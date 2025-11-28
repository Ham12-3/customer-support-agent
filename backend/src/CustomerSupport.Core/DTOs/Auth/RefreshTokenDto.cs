namespace CustomerSupport.Core.DTOs.Auth;

/// <summary>
/// DTO for refresh token request
/// </summary>
public class RefreshTokenDto
{
    public string RefreshToken { get; set; } = string.Empty;
}

