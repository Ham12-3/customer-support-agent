using CustomerSupport.Core.Enums;

namespace CustomerSupport.Core.Entities;

/// <summary>
/// Represents a single message in a conversation
/// </summary>
public class Message : BaseEntity
{
    public Guid ConversationId { get; set; }

    public MessageRole Role { get; set; }

    public string Content { get; set; } = string.Empty;

    public string? Metadata { get; set; } // JSON metadata (sources, confidence, etc.)

    public double? ConfidenceScore { get; set; }

    public bool IsFromHuman { get; set; } = false;

    public Guid? SentByUserId { get; set; }

    // Navigation properties
    public Conversation Conversation { get; set; } = null!;
    public User? SentByUser { get; set; }
}

