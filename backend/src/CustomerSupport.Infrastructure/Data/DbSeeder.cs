using CustomerSupport.Core.Entities;
using CustomerSupport.Core.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CustomerSupport.Infrastructure.Data;

/// <summary>
/// Seeds the database with initial test data for development
/// </summary>
public class DbSeeder
{
    private readonly AppDbContext _context;
    private readonly ILogger<DbSeeder> _logger;

    public DbSeeder(AppDbContext context, ILogger<DbSeeder> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Seeds the database with test data if it's empty
    /// </summary>
    public async Task SeedAsync()
    {
        try
        {
            // Check if we already have data
            if (await _context.Users.AnyAsync())
            {
                _logger.LogInformation("Database already seeded. Skipping seed operation.");
                return;
            }

            _logger.LogInformation("Starting database seeding...");

            // Create test tenant
            var tenant = new Tenant
            {
                Id = Guid.NewGuid(),
                Name = "Test Company",
                Email = "admin@testcompany.com",
                Status = TenantStatus.Active,
                Plan = SubscriptionPlan.Free,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Tenants.AddAsync(tenant);

            // Create admin user with known password: Admin123!
            var adminUser = new User
            {
                Id = Guid.NewGuid(),
                TenantId = tenant.Id,
                Email = "admin@testcompany.com",
                FirstName = "Admin",
                LastName = "User",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                Role = UserRole.Admin,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Users.AddAsync(adminUser);

            // Create regular test user with known password: Test123!
            var testUser = new User
            {
                Id = Guid.NewGuid(),
                TenantId = tenant.Id,
                Email = "test@testcompany.com",
                FirstName = "Test",
                LastName = "User",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test123!"),
                Role = UserRole.User,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Users.AddAsync(testUser);

            // Save all changes
            await _context.SaveChangesAsync();

            _logger.LogInformation("✅ Database seeding completed successfully!");
            _logger.LogInformation("Test Admin User: admin@testcompany.com / Admin123!");
            _logger.LogInformation("Test Regular User: test@testcompany.com / Test123!");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while seeding database");
            throw;
        }
    }

    /// <summary>
    /// Creates a specific user for testing (useful for creating your own test account)
    /// </summary>
    public async Task CreateUserAsync(string email, string password, string firstName, string lastName, string companyName)
    {
        try
        {
            // Check if user already exists
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (existingUser != null)
            {
                _logger.LogWarning("User with email {Email} already exists", email);
                return;
            }

            // Check if tenant exists
            var tenant = await _context.Tenants.FirstOrDefaultAsync(t => t.Name == companyName);
            
            if (tenant == null)
            {
                // Create new tenant
                tenant = new Tenant
                {
                    Id = Guid.NewGuid(),
                    Name = companyName,
                    Email = email,
                    Status = TenantStatus.Active,
                    Plan = SubscriptionPlan.Free,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.Tenants.AddAsync(tenant);
            }

            // Create user
            var user = new User
            {
                Id = Guid.NewGuid(),
                TenantId = tenant.Id,
                Email = email,
                FirstName = firstName,
                LastName = lastName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                Role = UserRole.Admin,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation("✅ User created: {Email} / {Password}", email, password);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user {Email}", email);
            throw;
        }
    }
}
