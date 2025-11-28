using CustomerSupport.Core.Entities;
using CustomerSupport.Core.Enums;
using CustomerSupport.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CustomerSupport.Api;

/// <summary>
/// Seeds the database with test data for development
/// </summary>
public static class DatabaseSeeder
{
    /// <summary>
    /// Seeds a test user for development purposes
    /// </summary>
    public static async Task SeedTestUserAsync(AppDbContext context)
    {
        // Check if any users exist
        if (await context.Users.AnyAsync())
        {
            Console.WriteLine("⚠️  Users already exist in database. Skipping seeding.");
            return;
        }

        Console.WriteLine("🌱 Seeding test user...");

        // Create test tenant
        var tenant = new Tenant
        {
            Id = Guid.NewGuid(),
            Name = "Test Company",
            Email = "admin@test.com",
            Status = TenantStatus.Active,
            Plan = SubscriptionPlan.Free,
            CreatedAt = DateTime.UtcNow
        };

        // Create test admin user with known password
        // Password: Test123!
        var user = new User
        {
            Id = Guid.NewGuid(),
            TenantId = tenant.Id,
            Email = "admin@test.com",
            FirstName = "Admin",
            LastName = "User",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test123!"),
            Role = UserRole.Admin,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        context.Tenants.Add(tenant);
        context.Users.Add(user);

        await context.SaveChangesAsync();

        Console.WriteLine("✅ Test user created successfully!");
        Console.WriteLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        Console.WriteLine("📧 Email: admin@test.com");
        Console.WriteLine("🔑 Password: Test123!");
        Console.WriteLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }

    /// <summary>
    /// Clears all users and tenants from database (use with caution!)
    /// </summary>
    public static async Task ClearUsersAsync(AppDbContext context)
    {
        Console.WriteLine("🗑️  Clearing all users and tenants...");

        // This will cascade delete users due to foreign key constraints
        var tenants = await context.Tenants.ToListAsync();
        context.Tenants.RemoveRange(tenants);

        await context.SaveChangesAsync();

        Console.WriteLine("✅ All users and tenants cleared!");
    }

    /// <summary>
    /// Deletes a specific user by email
    /// </summary>
    public static async Task DeleteUserByEmailAsync(AppDbContext context, string email)
    {
        var user = await context.Users
            .Include(u => u.Tenant)
            .FirstOrDefaultAsync(u => u.Email == email);

        if (user == null)
        {
            Console.WriteLine($"❌ User with email '{email}' not found.");
            return;
        }

        // Check if this is the only user for the tenant
        var tenantUsersCount = await context.Users.CountAsync(u => u.TenantId == user.TenantId);

        if (tenantUsersCount == 1)
        {
            // Delete the entire tenant (will cascade delete user)
            context.Tenants.Remove(user.Tenant);
            Console.WriteLine($"✅ Deleted user '{email}' and their tenant '{user.Tenant.Name}'");
        }
        else
        {
            // Just delete the user
            context.Users.Remove(user);
            Console.WriteLine($"✅ Deleted user '{email}'");
        }

        await context.SaveChangesAsync();
    }

    /// <summary>
    /// Lists all users in the database
    /// </summary>
    public static async Task ListUsersAsync(AppDbContext context)
    {
        var users = await context.Users
            .Include(u => u.Tenant)
            .OrderBy(u => u.CreatedAt)
            .ToListAsync();

        if (!users.Any())
        {
            Console.WriteLine("📋 No users found in database.");
            return;
        }

        Console.WriteLine($"📋 Found {users.Count} user(s):");
        Console.WriteLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        foreach (var user in users)
        {
            Console.WriteLine($"📧 {user.Email}");
            Console.WriteLine($"   Name: {user.FirstName} {user.LastName}");
            Console.WriteLine($"   Role: {user.Role}");
            Console.WriteLine($"   Tenant: {user.Tenant.Name}");
            Console.WriteLine($"   Active: {(user.IsActive ? "✅ Yes" : "❌ No")}");
            Console.WriteLine($"   Created: {user.CreatedAt:yyyy-MM-dd HH:mm:ss}");
            Console.WriteLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        }
    }
}

