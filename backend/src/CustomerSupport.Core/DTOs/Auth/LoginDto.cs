namespace CustomerSupport.Core.DTOs.Auth;

/// <summary>
/// DTO for user login
/// </summary>
public class LoginDto
{
    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;
}

