using CustomerSupport.Core.Entities;

namespace CustomerSupport.Core.Interfaces;

/// <summary>
/// Service for generating and validating JWT tokens
/// </summary>
public interface ITokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    Task<bool> ValidateTokenAsync(string token, CancellationToken cancellationToken = default);
}

