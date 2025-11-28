using System.Linq;
using CustomerSupport.Core.Entities;
using CustomerSupport.Core.Enums;
using CustomerSupport.Core.Interfaces;
using DnsClient;
using DnsClient.Protocol;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace CustomerSupport.Api.Workers;

/// <summary>
/// Background worker that checks pending domains for DNS TXT verification records.
/// </summary>
public class DomainVerificationWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<DomainVerificationWorker> _logger;
    private readonly ILookupClient _lookupClient;
    private readonly TimeSpan _pollInterval = TimeSpan.FromMinutes(5);
    private const int BatchSize = 20;
    private const int MaxAttemptsBeforeFailure = 10;

    public DomainVerificationWorker(
        IServiceScopeFactory scopeFactory,
        ILogger<DomainVerificationWorker> logger,
        ILookupClient lookupClient)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
        _lookupClient = lookupClient;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Domain verification worker started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await VerifyPendingDomainsAsync(stoppingToken);
            }
            catch (OperationCanceledException)
            {
                // graceful shutdown
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in domain verification worker loop.");
            }

            try
            {
                await Task.Delay(_pollInterval, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                break;
            }
        }

        _logger.LogInformation("Domain verification worker stopped.");
    }

    private async Task VerifyPendingDomainsAsync(CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

        var pendingDomains = await unitOfWork.Domains.GetPendingVerificationAsync(BatchSize, cancellationToken);
        if (!pendingDomains.Any())
        {
            return;
        }

        foreach (var domain in pendingDomains)
        {
            try
            {
                var verified = await HasVerificationRecordAsync(domain, cancellationToken);
                domain.LastVerificationAttemptAt = DateTime.UtcNow;

                if (verified)
                {
                    domain.IsVerified = true;
                    domain.Status = DomainStatus.Verified;
                    domain.VerifiedAt = DateTime.UtcNow;
                    domain.LastVerificationError = null;
                    domain.NextVerificationAttemptAt = null;
                    _logger.LogInformation("Domain {Domain} verified successfully.", domain.DomainUrl);
                }
                else
                {
                    domain.VerificationAttempts++;
                    domain.LastVerificationError = $"TXT record matching verification code '{domain.VerificationCode}' not found.";
                    domain.NextVerificationAttemptAt = CalculateNextAttempt(domain.VerificationAttempts);

                    if (domain.VerificationAttempts >= MaxAttemptsBeforeFailure)
                    {
                        domain.Status = DomainStatus.Failed;
                        _logger.LogWarning("Domain {Domain} marked as failed after {Attempts} attempts.", domain.DomainUrl, domain.VerificationAttempts);
                    }
                }

                await unitOfWork.Domains.UpdateAsync(domain, cancellationToken);
            }
            catch (Exception ex)
            {
                domain.VerificationAttempts++;
                domain.LastVerificationAttemptAt = DateTime.UtcNow;
                domain.LastVerificationError = ex.Message;
                domain.NextVerificationAttemptAt = DateTime.UtcNow.AddMinutes(15);
                await unitOfWork.Domains.UpdateAsync(domain, cancellationToken);

                _logger.LogWarning(ex, "Failed to verify domain {DomainUrl}", domain.DomainUrl);
            }
        }

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private async Task<bool> HasVerificationRecordAsync(Domain domain, CancellationToken cancellationToken)
    {
        var host = NormalizeDomain(domain.DomainUrl);

        var response = await _lookupClient.QueryAsync(host, QueryType.TXT, cancellationToken: cancellationToken);
        var txtRecords = response.Answers
            .OfType<TxtRecord>()
            .SelectMany(record => record.Text ?? Array.Empty<string>());

        return txtRecords.Any(text =>
            !string.IsNullOrWhiteSpace(text) &&
            text.Trim().Equals(domain.VerificationCode, StringComparison.OrdinalIgnoreCase));
    }

    private static DateTime CalculateNextAttempt(int attempts)
    {
        // Basic exponential backoff capped at 60 minutes
        var minutes = Math.Min(60, Math.Pow(2, attempts));
        return DateTime.UtcNow.AddMinutes(minutes);
    }

    private static string NormalizeDomain(string domainUrl)
    {
        if (string.IsNullOrWhiteSpace(domainUrl))
        {
            return domainUrl;
        }

        if (!domainUrl.StartsWith("http", StringComparison.OrdinalIgnoreCase))
        {
            return domainUrl.Trim();
        }

        if (Uri.TryCreate(domainUrl, UriKind.Absolute, out var uri))
        {
            return uri.Host;
        }

        return domainUrl;
    }
}


