using CustomerSupport.Core.Common;
using CustomerSupport.Core.DTOs.Auth;

namespace CustomerSupport.Core.Interfaces;

/// <summary>
/// Service interface for authentication operations
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Registers a new enterprise tenant and admin user
    /// </summary>
    Task<Result<AuthResponseDto>> RegisterAsync(RegisterDto dto, string? ipAddress = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Authenticates a user with email and password
    /// </summary>
    Task<Result<AuthResponseDto>> LoginAsync(LoginDto dto, string? ipAddress = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets the current user information
    /// </summary>
    Task<Result<UserDto>> GetCurrentUserAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Refreshes an access token using a refresh token
    /// </summary>
    Task<Result<AuthResponseDto>> RefreshTokenAsync(RefreshTokenDto dto, Guid userId, string? ipAddress = null, CancellationToken cancellationToken = default);
}

