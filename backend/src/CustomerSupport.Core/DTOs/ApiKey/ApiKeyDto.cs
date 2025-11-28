namespace CustomerSupport.Core.DTOs.ApiKey;

/// <summary>
/// API Key information
/// </summary>
public class ApiKeyDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string KeyPreview { get; set; } = string.Empty; // Only shows first/last few chars
    public DateTime CreatedAt { get; set; }
    public DateTime? LastUsedAt { get; set; }
    public bool IsActive { get; set; } = true;
}

/// <summary>
/// Create API Key request
/// </summary>
public class CreateApiKeyDto
{
    public string Name { get; set; } = string.Empty;
}

/// <summary>
/// API Key creation response (includes full key - only shown once)
/// </summary>
public class ApiKeyCreatedDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty; // Full key shown only on creation
    public DateTime CreatedAt { get; set; }
}

