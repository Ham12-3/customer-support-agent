namespace CustomerSupport.Core.DTOs.User;

/// <summary>
/// Active user session information
/// </summary>
public class UserSessionDto
{
    public string Id { get; set; } = string.Empty;
    public string Device { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string IpAddress { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime LastActivity { get; set; }
    public bool IsCurrent { get; set; }
}

