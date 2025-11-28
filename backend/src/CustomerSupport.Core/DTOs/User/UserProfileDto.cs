namespace CustomerSupport.Core.DTOs.User;

/// <summary>
/// User profile information
/// </summary>
public class UserProfileDto
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? Company { get; set; }
    public string? Role { get; set; }
    public string? Timezone { get; set; }
    public string? AvatarUrl { get; set; }
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// Update user profile request
/// </summary>
public class UpdateUserProfileDto
{
    public string FullName { get; set; } = string.Empty;
    public string? Company { get; set; }
    public string? Role { get; set; }
    public string? Timezone { get; set; }
}

/// <summary>
/// Change password request
/// </summary>
public class ChangePasswordDto
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}

