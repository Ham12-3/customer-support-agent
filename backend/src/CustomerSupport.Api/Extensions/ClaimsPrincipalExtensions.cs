using System.Security.Claims;

namespace CustomerSupport.Api.Extensions;

/// <summary>
/// Extension methods for ClaimsPrincipal to easily extract user information
/// </summary>
public static class ClaimsPrincipalExtensions
{
    /// <summary>
    /// Gets the user ID from the claims
    /// </summary>
    public static Guid GetUserId(this ClaimsPrincipal principal)
    {
        var claim = principal.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null && Guid.TryParse(claim.Value, out var userId)
            ? userId
            : Guid.Empty;
    }

    /// <summary>
    /// Gets the tenant ID from the claims
    /// </summary>
    public static Guid GetTenantId(this ClaimsPrincipal principal)
    {
        var claim = principal.FindFirst("TenantId");
        return claim != null && Guid.TryParse(claim.Value, out var tenantId)
            ? tenantId
            : Guid.Empty;
    }

    /// <summary>
    /// Gets the user email from the claims
    /// </summary>
    public static string? GetUserEmail(this ClaimsPrincipal principal)
    {
        return principal.FindFirst(ClaimTypes.Email)?.Value;
    }

    /// <summary>
    /// Gets the user role from the claims
    /// </summary>
    public static string? GetUserRole(this ClaimsPrincipal principal)
    {
        return principal.FindFirst(ClaimTypes.Role)?.Value;
    }
}

