namespace CustomerSupport.Core.Enums;

/// <summary>
/// Represents the role/sender of a message in a conversation
/// </summary>
public enum MessageRole
{
    /// <summary>
    /// Message sent by the customer/user
    /// </summary>
    User = 0,

    /// <summary>
    /// Message sent by the AI assistant
    /// </summary>
    Assistant = 1,

    /// <summary>
    /// System message (e.g., "Agent joined the conversation")
    /// </summary>
    System = 2,

    /// <summary>
    /// Message sent by a human agent
    /// </summary>
    Agent = 3
}

