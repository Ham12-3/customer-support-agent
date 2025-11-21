using CustomerSupport.Core.Entities;
using CustomerSupport.Core.Interfaces;
using CustomerSupport.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CustomerSupport.Infrastructure.Repositories;



public class DomainRepository : Repository<Domain>, IDomainRepository
{
    public DomainRepository(AppDbContext context) : base(context) { }
    
    public async Task<IEnumerable<Domain>> GetByTenantIdAsync(Guid tenantId)
    {
        return await _dbSet
            .Where(d => d.TenantId == tenantId)
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync();
    }
    
    public async Task<Domain?> GetByApiKeyAsync(string apiKey)
    {
        return await _dbSet.FirstOrDefaultAsync(d => d.ApiKey == apiKey);
    }
}