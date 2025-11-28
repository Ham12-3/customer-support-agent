using CustomerSupport.Core.DTOs.Dashboard;

namespace CustomerSupport.Core.Interfaces;

/// <summary>
/// Service for dashboard statistics and analytics
/// </summary>
public interface IDashboardService
{
    /// <summary>
    /// Get dashboard statistics for a tenant
    /// </summary>
    Task<DashboardStatsDto> GetStatsAsync(Guid tenantId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get analytics data for charts (last 7 days)
    /// </summary>
    Task<DashboardAnalyticsDto> GetAnalyticsAsync(Guid tenantId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get system health metrics
    /// </summary>
    Task<SystemHealthDto> GetSystemHealthAsync(CancellationToken cancellationToken = default);
}

