namespace CustomerSupport.Core.DTOs.Domain;

/// <summary>
/// DTO for adding a new domain
/// </summary>
public class AddDomainDto
{
    public string DomainUrl { get; set; } = string.Empty;
}

/// <summary>
/// DTO for domain response
/// </summary>
public class DomainResponseDto
{
    public Guid Id { get; set; }
    public string DomainUrl { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
    public string VerificationCode { get; set; } = string.Empty;
    public bool IsVerified { get; set; }
    public string Status { get; set; } = string.Empty;
    public string EmbedScript { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}