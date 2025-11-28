namespace CustomerSupport.Core.Options;

/// <summary>
/// Configuration values controlling refresh token lifetime and retention.
/// </summary>
public class RefreshTokenOptions
{
    /// <summary>
    /// Number of days a refresh token remains valid.
    /// </summary>
    public int DaysToExpire { get; set; } = 30;

    /// <summary>
    /// Maximum number of active refresh tokens allowed per user. Oldest tokens will be revoked when the limit is exceeded.
    /// </summary>
    public int MaxActiveTokensPerUser { get; set; } = 5;
}


