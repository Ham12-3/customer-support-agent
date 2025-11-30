using CustomerSupport.Api.Extensions;
using CustomerSupport.Core.DTOs.Domain;
using CustomerSupport.Core.Entities;
using CustomerSupport.Core.Enums;
using CustomerSupport.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Linq;
using Microsoft.Extensions.Configuration;

namespace CustomerSupport.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DomainsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IConfiguration _configuration;
    private readonly ILogger<DomainsController> _logger;
    
    public DomainsController(
        IUnitOfWork unitOfWork,
        IConfiguration configuration,
        ILogger<DomainsController> logger)
    {
        _unitOfWork = unitOfWork;
        _configuration = configuration;
        _logger = logger;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetDomains()
    {
        try
        {
            var tenantId = GetTenantIdFromClaims();
            var domains = await _unitOfWork.Domains.GetByTenantIdAsync(tenantId);
            
            var domainResponses = domains.Select(d => MapToDomainResponse((Domain)d)).ToList();
            
            return Ok(new { items = domainResponses });
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized access attempt to GetDomains");
            return Unauthorized(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving domains");
            return StatusCode(500, new { error = "An error occurred while retrieving domains" });
        }
    }
    
    [HttpPost]
    public async Task<IActionResult> AddDomain([FromBody] AddDomainDto dto)
    {
        var domain = new Domain
        {
            TenantId = GetTenantIdFromClaims(),
            DomainUrl = SanitizeDomainUrl(dto.DomainUrl),
            ApiKey = GenerateApiKey(),
            VerificationCode = GenerateVerificationCode(),
            Status = DomainStatus.Pending
        };
        
        await _unitOfWork.Domains.AddAsync(domain);
        await _unitOfWork.SaveChangesAsync();
        
        return Ok(MapToDomainResponse(domain));
    }
    
    /// <summary>
    /// Create a new AI agent with business configuration
    /// </summary>
    [HttpPost("agent")]
    public async Task<IActionResult> CreateAgent([FromBody] CreateAgentDto dto)
    {
        // Serialize business configuration to JSON for WidgetConfig
        var widgetConfig = new
        {
            businessInfo = new
            {
                companyName = dto.CompanyName,
                industry = dto.Industry,
                description = dto.CompanyDescription,
                productsServices = dto.ProductsServices,
                targetAudience = dto.TargetAudience,
                keyFeatures = dto.KeyFeatures
            },
            agentConfig = new
            {
                name = dto.AgentName,
                personality = dto.AgentPersonality,
                language = dto.PrimaryLanguage
            },
            knowledge = new
            {
                faqs = dto.Faqs,
                additionalInfo = dto.AdditionalInfo
            },
            contact = new
            {
                email = dto.SupportEmail,
                phone = dto.SupportPhone,
                workingHours = dto.WorkingHours
            }
        };
        
        var domain = new Domain
        {
            TenantId = GetTenantIdFromClaims(),
            DomainUrl = dto.DomainUrl,
            ApiKey = GenerateApiKey(),
            VerificationCode = GenerateVerificationCode(),
            Status = DomainStatus.Pending,
            WidgetConfig = JsonSerializer.Serialize(widgetConfig)
        };
        
        await _unitOfWork.Domains.AddAsync(domain);
        await _unitOfWork.SaveChangesAsync();
        
        return Ok(MapToDomainResponse(domain));
    }
    
    [HttpGet("{id}/script")]
    public async Task<IActionResult> GetEmbedScript(Guid id)
    {
        var domain = await _unitOfWork.Domains.GetByIdAsync(id);
        if (domain == null) return NotFound();
        
        var domainEntity = (Domain)domain;
        var htmlScript = GenerateEmbedScript(domainEntity);
        var reactScript = GenerateReactEmbedScript(domainEntity);
        return Ok(new { script = htmlScript, htmlScript, reactScript });
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDomain(Guid id)
    {
        var domain = await _unitOfWork.Domains.GetByIdAsync(id);
        if (domain == null) return NotFound();
        
        await _unitOfWork.Domains.DeleteAsync(id);
        await _unitOfWork.SaveChangesAsync();
        
        return NoContent();
    }
    
    private Guid GetTenantIdFromClaims()
    {
        var tenantId = User.GetTenantId();
        if (tenantId == Guid.Empty)
        {
            throw new UnauthorizedAccessException("Tenant ID not found in token");
        }
        return tenantId;
    }
    
    private string GenerateApiKey()
    {
        return $"sk_live_{Guid.NewGuid():N}{Guid.NewGuid():N}"[..40];
    }
    
    private string GenerateVerificationCode()
    {
        return $"cs-verify-{Guid.NewGuid():N}";
    }
    
    private string SanitizeDomainUrl(string domainUrl)
    {
        if (string.IsNullOrWhiteSpace(domainUrl))
            return domainUrl;
        
        // Remove http:// or https://
        domainUrl = domainUrl.Replace("https://", "").Replace("http://", "");
        
        // Remove trailing slashes
        domainUrl = domainUrl.TrimEnd('/');
        
        // Remove www. prefix (optional)
        // domainUrl = domainUrl.Replace("www.", "");
        
        return domainUrl.Trim();
    }
    
    private string GenerateEmbedScript(Domain domain)
    {
        // Get widget URL from configuration
        var widgetUrl = _configuration["Widget:Url"] 
            ?? _configuration["WidgetUrl"] 
            ?? "https://widget.nexusai.com";
        
        var apiBaseUrl = _configuration["Api:BaseUrl"] 
            ?? _configuration["ApiBaseUrl"] 
            ?? "https://api.nexusai.com";
        
        // SECURE: Embed script includes API key for authentication
        return $@"<!-- Customer Support AI Widget -->
<!-- Paste this before the closing </body> tag -->
<script>
  (function() {{
    var script = document.createElement('script');
    script.src = '{widgetUrl}/widget.js';
    script.setAttribute('data-domain', '{domain.DomainUrl}');
    script.setAttribute('data-api-key', '{domain.ApiKey}');
    script.setAttribute('data-api-url', '{apiBaseUrl}');
    script.async = true;
    document.body.appendChild(script);
  }})();
</script>";
    }
    
    private string GenerateReactEmbedScript(Domain domain)
    {
        // Get widget URL from configuration
        var widgetUrl = _configuration["Widget:Url"] 
            ?? _configuration["WidgetUrl"] 
            ?? "https://widget.nexusai.com";
        
        var apiBaseUrl = _configuration["Api:BaseUrl"] 
            ?? _configuration["ApiBaseUrl"] 
            ?? "https://api.nexusai.com";
        
        // React/Next.js version using next/script
        return $@"{{/* Customer Support AI Widget */}}
{{/* Add this inside your layout.js or _app.js */}}
import Script from 'next/script'

<Script
  id=""customer-support-widget""
  strategy=""afterInteractive""
  dangerouslySetInnerHTML={{{{
    __html: `
      (function() {{
        var script = document.createElement('script');
        script.src = '{widgetUrl}/widget.js';
        script.setAttribute('data-domain', '{domain.DomainUrl}');
        script.setAttribute('data-api-key', '{domain.ApiKey}');
        script.setAttribute('data-api-url', '{apiBaseUrl}');
        script.async = true;
        document.body.appendChild(script);
      }})();
    `,
  }}}}
/>";
    }
    
    private DomainResponseDto MapToDomainResponse(Domain domain)
    {
        return new DomainResponseDto
        {
            Id = domain.Id,
            DomainUrl = domain.DomainUrl,
            ApiKey = domain.ApiKey,
            VerificationCode = domain.VerificationCode,
        IsVerified = domain.Status == DomainStatus.Verified,
            Status = domain.Status.ToString(),
            EmbedScript = GenerateEmbedScript(domain),
            CreatedAt = domain.CreatedAt
        };
    }
}