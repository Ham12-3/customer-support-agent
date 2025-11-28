using System.Security.Claims;
using CustomerSupport.Core.Entities;

namespace CustomerSupport.Core.Interfaces;

/// <summary>
/// Service for generating and validating JWT tokens
/// </summary>
public interface ITokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    string HashToken(string token);
    Task<bool> ValidateTokenAsync(string token, CancellationToken cancellationToken = default);
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
}

