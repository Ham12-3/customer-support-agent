using CustomerSupport.Core.Entities;

namespace CustomerSupport.Core.Interfaces;

/// <summary>
/// Repository contract for managing refresh tokens.
/// </summary>
public interface IRefreshTokenRepository : IRepository<RefreshToken>
{
    Task<RefreshToken?> GetByTokenHashAsync(string tokenHash, CancellationToken cancellationToken = default);
    Task<IEnumerable<RefreshToken>> GetActiveTokensByUserAsync(Guid userId, CancellationToken cancellationToken = default);
}


