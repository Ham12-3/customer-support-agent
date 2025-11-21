namespace CustomerSupport.Core.Enums;

/// <summary>
/// Represents the role of a user within a tenant organization
/// </summary>
public enum UserRole
{
    /// <summary>
    /// Regular user with basic permissions
    /// </summary>
    User = 0,

    /// <summary>
    /// Customer support agent who can handle conversations
    /// </summary>
    Agent = 1,

    /// <summary>
    /// Manager who can oversee agents and configure settings
    /// </summary>
    Manager = 2,

    /// <summary>
    /// Administrator with full access to tenant features
    /// </summary>
    Admin = 3
}

