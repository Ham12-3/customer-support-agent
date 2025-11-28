using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CustomerSupport.Core.DTOs.ApiKey;
using System.Security.Cryptography;

namespace CustomerSupport.Api.Controllers;

[ApiController]
[Route("api/api-keys")]
[Authorize]
public class ApiKeysController : ControllerBase
{
    private readonly ILogger<ApiKeysController> _logger;

    public ApiKeysController(ILogger<ApiKeysController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Get all API keys for the current user
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<ApiKeyDto>>> GetApiKeys()
    {
        try
        {
            var tenantId = User.FindFirst("tenant_id")?.Value;
            if (string.IsNullOrEmpty(tenantId))
            {
                return Unauthorized("Tenant ID not found");
            }

            // Mock implementation - in production, fetch from database
            var apiKeys = new List<ApiKeyDto>
            {
                new ApiKeyDto
                {
                    Id = Guid.NewGuid().ToString(),
                    Name = "Production API Key",
                    KeyPreview = "sk_live_••••••••••••••••••••••••••••",
                    CreatedAt = DateTime.UtcNow.AddDays(-45),
                    LastUsedAt = DateTime.UtcNow.AddHours(-2),
                    IsActive = true
                },
                new ApiKeyDto
                {
                    Id = Guid.NewGuid().ToString(),
                    Name = "Development API Key",
                    KeyPreview = "sk_test_••••••••••••••••••••••••••••",
                    CreatedAt = DateTime.UtcNow.AddDays(-75),
                    LastUsedAt = DateTime.UtcNow.AddDays(-1),
                    IsActive = true
                }
            };

            await Task.Delay(50);
            return Ok(apiKeys);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting API keys");
            return StatusCode(500, "Error retrieving API keys");
        }
    }

    /// <summary>
    /// Generate a new API key
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiKeyCreatedDto>> CreateApiKey([FromBody] CreateApiKeyDto dto)
    {
        try
        {
            var tenantId = User.FindFirst("tenant_id")?.Value;
            if (string.IsNullOrEmpty(tenantId))
            {
                return Unauthorized("Tenant ID not found");
            }

            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return BadRequest("API key name is required");
            }

            // Generate a secure API key
            var apiKey = GenerateApiKey();

            // Mock implementation - in production, save to database with hash
            var created = new ApiKeyCreatedDto
            {
                Id = Guid.NewGuid().ToString(),
                Name = dto.Name,
                ApiKey = apiKey,
                CreatedAt = DateTime.UtcNow
            };

            await Task.Delay(50);
            return Ok(created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating API key");
            return StatusCode(500, "Error creating API key");
        }
    }

    /// <summary>
    /// Revoke an API key
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> RevokeApiKey(string id)
    {
        try
        {
            var tenantId = User.FindFirst("tenant_id")?.Value;
            if (string.IsNullOrEmpty(tenantId))
            {
                return Unauthorized("Tenant ID not found");
            }

            // Mock implementation - in production, mark as inactive in database
            await Task.Delay(50);
            return Ok(new { message = "API key revoked successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error revoking API key");
            return StatusCode(500, "Error revoking API key");
        }
    }

    private static string GenerateApiKey()
    {
        const string prefix = "sk_live_";
        const int keyLength = 32;
        
        var randomBytes = new byte[keyLength];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomBytes);
        }
        
        var key = Convert.ToBase64String(randomBytes)
            .Replace("+", "")
            .Replace("/", "")
            .Replace("=", "")
            .Substring(0, keyLength);
        
        return prefix + key;
    }
}

