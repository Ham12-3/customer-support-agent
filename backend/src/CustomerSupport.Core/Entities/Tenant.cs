using CustomerSupport.Core.Enums;

namespace CustomerSupport.Core.Entities;

/// <summary>
/// Represents an enterprise customer tenant in the system
/// </summary>
public class Tenant : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public TenantStatus Status { get; set; } = TenantStatus.Active;

    public SubscriptionPlan Plan { get; set; } = SubscriptionPlan.Free;

    // Navigation properties
    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<Domain> Domains { get; set; } = new List<Domain>();
    public ICollection<Conversation> Conversations { get; set; } = new List<Conversation>();
    public ICollection<Document> Documents { get; set; } = new List<Document>();
}

