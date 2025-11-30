using System.Linq;
using CustomerSupport.Core.Entities;
using CustomerSupport.Core.Enums;
using CustomerSupport.Core.Interfaces;
using CustomerSupport.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CustomerSupport.Infrastructure.Repositories;



public class DomainRepository : Repository<Domain>, IDomainRepository
{
    public DomainRepository(AppDbContext context) : base(context) { }
    
    public async Task<IEnumerable<Domain>> GetByTenantIdAsync(Guid tenantId)
    {
        return await _dbSet
            .Where(d => d.TenantId == tenantId)
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync();
    }
    
    public async Task<Domain?> GetByApiKeyAsync(string apiKey)
    {
        return await _dbSet.FirstOrDefaultAsync(d => d.ApiKey == apiKey);
    }

    public async Task<Domain?> GetActiveByApiKeyAsync(string apiKey, bool skipVerification = false)
    {
        if (string.IsNullOrWhiteSpace(apiKey))
            return null;

        var query = _dbSet
            .Include(d => d.Tenant)
            .Include(d => d.Conversations)
            .Where(d => d.ApiKey == apiKey);

        // In production, require verification
        // In development (with skipVerification=true), allow unverified domains
        if (!skipVerification)
        {
            query = query.Where(d => d.IsVerified && d.Status == DomainStatus.Verified);
        }

        return await query.FirstOrDefaultAsync();
    }

    public async Task<bool> ValidateApiKeyAndDomainAsync(string apiKey, string domainUrl)
    {
        if (string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(domainUrl))
            return false;

        return await _dbSet
            .AnyAsync(d => d.ApiKey == apiKey && 
                          d.DomainUrl == domainUrl && 
                          d.IsVerified &&
                          d.Status == DomainStatus.Verified);
    }

    public async Task<IEnumerable<Domain>> GetPendingVerificationAsync(int batchSize, CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;

        return await _dbSet
            .Where(d => !d.IsVerified &&
                        d.Status == DomainStatus.Pending &&
                        (d.NextVerificationAttemptAt == null || d.NextVerificationAttemptAt <= now))
            .OrderBy(d => d.LastVerificationAttemptAt ?? DateTime.MinValue)
            .ThenBy(d => d.CreatedAt)
            .Take(batchSize)
            .ToListAsync(cancellationToken);
    }
}