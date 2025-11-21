using CustomerSupport.Core.Interfaces;
using CustomerSupport.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore.Storage;

namespace CustomerSupport.Infrastructure.Data;

/// <summary>
/// Implementation of Unit of Work pattern for managing database transactions
/// </summary>
public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;
    private IDbContextTransaction? _transaction;
    private bool _disposed;

    // Lazy initialization of repositories
    private ITenantRepository? _tenants;
    private IUserRepository? _users;
   private IDomainRepository? _domains;
    private IRepository<Core.Entities.Conversation>? _conversations;
    private IRepository<Core.Entities.Message>? _messages;
    private IRepository<Core.Entities.Document>? _documents;
    private IRepository<Core.Entities.DocumentChunk>? _documentChunks;

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
    }

    // Repository properties with lazy initialization
    public ITenantRepository Tenants =>
        _tenants ??= new TenantRepository(_context);

    public IUserRepository Users =>
        _users ??= new UserRepository(_context);

    public IDomainRepository Domains =>
       _domains ??= new DomainRepository(_context);

    public IRepository<Core.Entities.Conversation> Conversations =>
        _conversations ??= new Repository<Core.Entities.Conversation>(_context);

    public IRepository<Core.Entities.Message> Messages =>
        _messages ??= new Repository<Core.Entities.Message>(_context);

    public IRepository<Core.Entities.Document> Documents =>
        _documents ??= new Repository<Core.Entities.Document>(_context);

    public IRepository<Core.Entities.DocumentChunk> DocumentChunks =>
        _documentChunks ??= new Repository<Core.Entities.DocumentChunk>(_context);

    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        _transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
    }

    public async Task<int> CommitAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await _context.SaveChangesAsync(cancellationToken);

            if (_transaction != null)
            {
                await _transaction.CommitAsync(cancellationToken);
                await _transaction.DisposeAsync();
                _transaction = null;
            }

            return result;
        }
        catch
        {
            await RollbackAsync(cancellationToken);
            throw;
        }
    }

    public async Task RollbackAsync(CancellationToken cancellationToken = default)
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync(cancellationToken);
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed && disposing)
        {
            _transaction?.Dispose();
            _context.Dispose();
        }
        _disposed = true;
    }
}

