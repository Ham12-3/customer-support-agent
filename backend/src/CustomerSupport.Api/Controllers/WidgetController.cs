using CustomerSupport.Core.DTOs.Widget;
using CustomerSupport.Core.Entities;
using CustomerSupport.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CustomerSupport.Api.Controllers;

/// <summary>
/// Public controller for widget configuration (no auth required)
/// Validates domain ownership before returning config
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class WidgetController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<WidgetController> _logger;
    private readonly IConfiguration _configuration;

    public WidgetController(
        IUnitOfWork unitOfWork,
        ILogger<WidgetController> logger,
        IConfiguration configuration)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _configuration = configuration;
    }

    /// <summary>
    /// Get widget configuration based on domain hostname
    /// This endpoint validates that the domain is verified before returning the API key
    /// Domain can be provided as query param or detected from Origin/Referer header
    /// </summary>
    [HttpGet("config")]
    [ProducesResponseType(typeof(WidgetConfigDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<WidgetConfigDto>> GetWidgetConfig([FromQuery] string? domain = null)
    {
        try
        {
            // Try to get domain from query param, Origin header, or Referer header
            var requestedDomain = domain;
            
            if (string.IsNullOrWhiteSpace(requestedDomain))
            {
                // Try Origin header first (most reliable)
                requestedDomain = Request.Headers["Origin"].FirstOrDefault();
                
                if (string.IsNullOrWhiteSpace(requestedDomain))
                {
                    // Fallback to Referer header
                    var referer = Request.Headers["Referer"].FirstOrDefault();
                    if (!string.IsNullOrWhiteSpace(referer) && Uri.TryCreate(referer, UriKind.Absolute, out var refererUri))
                    {
                        requestedDomain = refererUri.Host;
                    }
                }
                else if (Uri.TryCreate(requestedDomain, UriKind.Absolute, out var originUri))
                {
                    requestedDomain = originUri.Host;
                }
            }

            if (string.IsNullOrWhiteSpace(requestedDomain))
            {
                return BadRequest(new { error = "Domain parameter is required or must be in Origin/Referer header" });
            }

            // Normalize domain (remove protocol, www, trailing slashes)
            var normalizedDomain = NormalizeDomain(requestedDomain);
            
            // Get all domains and find matching one by normalized URL
            var allDomains = await _unitOfWork.Domains.GetAllAsync();
            var domainObj = allDomains
                .Cast<Domain>()
                .FirstOrDefault(d => NormalizeDomain(d.DomainUrl) == normalizedDomain);

            if (domainObj == null)
            {
                _logger.LogWarning("Widget config requested for unknown domain: {Domain}", requestedDomain);
                return NotFound(new { error = "Domain not found" });
            }

            // Only return config if domain is verified (security check - both flags must be true)
            if (!domainObj.IsVerified || domainObj.Status != Core.Enums.DomainStatus.Verified)
            {
                _logger.LogWarning("Widget config requested for unverified domain: {Domain} (IsVerified: {IsVerified}, Status: {Status})", 
                    requestedDomain, domainObj.IsVerified, domainObj.Status);
                return StatusCode(403, new { error = "Domain not verified. Please verify domain ownership first." });
            }

            var widgetUrl = _configuration["Widget:Url"] 
                ?? _configuration["WidgetUrl"] 
                ?? "http://localhost:3001";

            var config = new WidgetConfigDto
            {
                ApiKey = domainObj.ApiKey,
                DomainId = domainObj.Id,
                WidgetUrl = widgetUrl,
                IsVerified = domainObj.IsVerified
            };

            return Ok(config);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving widget config");
            return StatusCode(500, new { error = "An error occurred while retrieving widget configuration" });
        }
    }

    /// <summary>
    /// Normalize domain URL for comparison
    /// Removes protocol, www, trailing slashes, etc.
    /// </summary>
    private static string NormalizeDomain(string domainUrl)
    {
        if (string.IsNullOrWhiteSpace(domainUrl))
            return string.Empty;

        var normalized = domainUrl.Trim().ToLowerInvariant();
        
        // Remove protocol
        if (normalized.StartsWith("http://") || normalized.StartsWith("https://"))
        {
            normalized = normalized.Split(new[] { "://" }, StringSplitOptions.None)[1];
        }
        
        // Remove www
        if (normalized.StartsWith("www."))
        {
            normalized = normalized.Substring(4);
        }
        
        // Remove trailing slash
        normalized = normalized.TrimEnd('/');
        
        // Remove port if present (for localhost testing)
        var portIndex = normalized.IndexOf(':');
        if (portIndex > 0 && !normalized.StartsWith("localhost") && !normalized.StartsWith("127.0.0.1"))
        {
            normalized = normalized.Substring(0, portIndex);
        }
        
        return normalized;
    }
}

