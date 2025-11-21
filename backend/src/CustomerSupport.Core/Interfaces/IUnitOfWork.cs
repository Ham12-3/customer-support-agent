namespace CustomerSupport.Core.Interfaces;

/// <summary>
/// Unit of Work pattern interface for managing database transactions
/// </summary>
public interface IUnitOfWork : IDisposable
{
    // Repository properties
    ITenantRepository Tenants { get; }
    IUserRepository Users { get; }
  IDomainRepository Domains { get; }
    IRepository<Entities.Conversation> Conversations { get; }
    IRepository<Entities.Message> Messages { get; }
    IRepository<Entities.Document> Documents { get; }
    IRepository<Entities.DocumentChunk> DocumentChunks { get; }

    /// <summary>
    /// Begins a new database transaction
    /// </summary>
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Commits all changes and the current transaction
    /// </summary>
    Task<int> CommitAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Rolls back the current transaction
    /// </summary>
    Task RollbackAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Saves changes without committing transaction (for non-transactional operations)
    /// </summary>
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}

