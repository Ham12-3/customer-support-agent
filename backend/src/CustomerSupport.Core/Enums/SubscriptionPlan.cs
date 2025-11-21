namespace CustomerSupport.Core.Enums;

/// <summary>
/// Represents the subscription plan tier for a tenant
/// </summary>
public enum SubscriptionPlan
{
    /// <summary>
    /// Free tier with limited features
    /// </summary>
    Free = 0,

    /// <summary>
    /// Starter plan for small businesses
    /// </summary>
    Starter = 1,

    /// <summary>
    /// Professional plan for growing businesses
    /// </summary>
    Professional = 2,

    /// <summary>
    /// Enterprise plan with all features
    /// </summary>
    Enterprise = 3
}

