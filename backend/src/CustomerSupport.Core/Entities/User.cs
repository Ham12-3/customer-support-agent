using CustomerSupport.Core.Enums;

namespace CustomerSupport.Core.Entities;

/// <summary>
/// Represents a user within a tenant organization
/// </summary>
public class User : BaseEntity
{
    public Guid TenantId { get; set; }

    public string Email { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public UserRole Role { get; set; } = UserRole.User;

    public bool IsActive { get; set; } = true;

    public DateTime? LastLoginAt { get; set; }

    // Navigation properties
    public Tenant Tenant { get; set; } = null!;
}

