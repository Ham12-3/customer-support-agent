using CustomerSupport.Core.DTOs.Domain;
using CustomerSupport.Core.Entities;
using CustomerSupport.Core.Enums;
using CustomerSupport.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CustomerSupport.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DomainsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    
    public DomainsController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetDomains()
    {
        var tenantId = GetTenantIdFromClaims();
        var domains = await _unitOfWork.Domains.GetByTenantIdAsync(tenantId);
        return Ok(domains);
    }
    
    [HttpPost]
    public async Task<IActionResult> AddDomain([FromBody] AddDomainDto dto)
    {
        var domain = new Domain
        {
            TenantId = GetTenantIdFromClaims(),
            DomainUrl = dto.DomainUrl,
            ApiKey = GenerateApiKey(),
            VerificationCode = GenerateVerificationCode(),
            Status = DomainStatus.Pending
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
        var script = GenerateEmbedScript(domainEntity);
        return Ok(new { script });
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
        return Guid.Parse(User.FindFirst("TenantId")?.Value!);
    }
    
    private string GenerateApiKey()
    {
        return $"sk_live_{Guid.NewGuid():N}{Guid.NewGuid():N}"[..40];
    }
    
    private string GenerateVerificationCode()
    {
        return $"cs-verify-{Guid.NewGuid():N}";
    }
    
    private string GenerateEmbedScript(Domain domain)
    {
        // In production, replace localhost with your actual widget URL
        var widgetUrl = "http://localhost:3001";
        
        return $@"<!-- Customer Support AI Widget -->
<script>
  (function() {{
    var script = document.createElement('script');
    script.src = '{widgetUrl}/widget.js';
    script.setAttribute('data-api-key', '{domain.ApiKey}');
    script.setAttribute('data-domain-id', '{domain.Id}');
    script.setAttribute('data-widget-url', '{widgetUrl}');
    script.async = true;
    document.body.appendChild(script);
  }})();
</script>";
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