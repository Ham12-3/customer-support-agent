using CustomerSupport.Core.Entities;

namespace CustomerSupport.Core.Interfaces;

/// <summary>
/// Repository interface for Domain entities
/// </summary>
public interface IDomainRepository : IRepository<Domain>
{
    /// <summary>
    /// Gets all domains for a specific tenant
    /// </summary>
    Task<IEnumerable<Domain>> GetByTenantIdAsync(Guid tenantId);
    
    /// <summary>
    /// Gets a domain by its API key
    /// </summary>
    Task<Domain?> GetByApiKeyAsync(string apiKey);
}