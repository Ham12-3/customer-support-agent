using CustomerSupport.Core.Enums;

namespace CustomerSupport.Core.Entities;

/// <summary>
/// Represents a verified domain where the chatbot can be deployed
/// </summary>
public class Domain : BaseEntity
{
    public Guid TenantId { get; set; }

    public string DomainUrl { get; set; } = string.Empty;

    public string VerificationCode { get; set; } = string.Empty;

    public bool IsVerified { get; set; } = false;

    public DateTime? VerifiedAt { get; set; }

    public string ApiKey { get; set; } = string.Empty;

    public DomainStatus Status { get; set; } = DomainStatus.Pending;

    // Widget configuration
    public string? WidgetConfig { get; set; } // JSON configuration for branding, position, etc.

    // Navigation properties
    public Tenant Tenant { get; set; } = null!;
    public ICollection<Conversation> Conversations { get; set; } = new List<Conversation>();
}

