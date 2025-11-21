namespace CustomerSupport.Core.Enums;

/// <summary>
/// Represents the current status of a conversation
/// </summary>
public enum ConversationStatus
{
    /// <summary>
    /// Conversation is ongoing
    /// </summary>
    Active = 0,

    /// <summary>
    /// Conversation has been resolved
    /// </summary>
    Resolved = 1,

    /// <summary>
    /// Conversation has been escalated to a human agent
    /// </summary>
    Escalated = 2,

    /// <summary>
    /// Conversation has been closed
    /// </summary>
    Closed = 3
}

