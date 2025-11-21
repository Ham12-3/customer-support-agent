namespace CustomerSupport.Core.Enums;

/// <summary>
/// Represents the status of a tenant account
/// </summary>
public enum TenantStatus
{
    /// <summary>
    /// Account is pending verification or activation
    /// </summary>
    Pending = 0,

    /// <summary>
    /// Account is active and operational
    /// </summary>
    Active = 1,

    /// <summary>
    /// Account is temporarily suspended (e.g., payment issues)
    /// </summary>
    Suspended = 2,

    /// <summary>
    /// Account is permanently deactivated
    /// </summary>
    Inactive = 3
}

