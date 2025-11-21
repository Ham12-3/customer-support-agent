using CustomerSupport.Core.Enums;

namespace CustomerSupport.Core.Entities;

/// <summary>
/// Represents a conversation between a customer and the AI agent
/// </summary>
public class Conversation : BaseEntity
{
    public Guid TenantId { get; set; }

    public Guid DomainId { get; set; }

    public string SessionId { get; set; } = string.Empty;

    public string? CustomerEmail { get; set; }

    public string? CustomerName { get; set; }

    public ConversationStatus Status { get; set; } = ConversationStatus.Active;

    public DateTime? EndedAt { get; set; }

    public bool IsEscalated { get; set; } = false;

    public Guid? AssignedAgentId { get; set; }

    // Metadata
    public string? CustomerIpAddress { get; set; }

    public string? CustomerUserAgent { get; set; }

    public int MessageCount { get; set; } = 0;

    // Navigation properties
    public Tenant Tenant { get; set; } = null!;
    public Domain Domain { get; set; } = null!;
    public User? AssignedAgent { get; set; }
    public ICollection<Message> Messages { get; set; } = new List<Message>();
}

