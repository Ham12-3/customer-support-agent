namespace CustomerSupport.Core.Enums;

/// <summary>
/// Represents the verification status of a domain
/// </summary>
public enum DomainStatus
{
    /// <summary>
    /// Domain is pending verification
    /// </summary>
    Pending = 0,

    /// <summary>
    /// Domain has been verified and is active
    /// </summary>
    Verified = 1,

    /// <summary>
    /// Domain verification failed
    /// </summary>
    Failed = 2,

    /// <summary>
    /// Domain has been suspended
    /// </summary>
    Suspended = 3
}

