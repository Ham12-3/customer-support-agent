using CustomerSupport.Core.DTOs.Dashboard;
using CustomerSupport.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CustomerSupport.Api.Controllers;

/// <summary>
/// Controller for dashboard statistics and analytics
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;
    private readonly ILogger<DashboardController> _logger;

    public DashboardController(
        IDashboardService dashboardService,
        ILogger<DashboardController> logger)
    {
        _dashboardService = dashboardService;
        _logger = logger;
    }

    /// <summary>
    /// Get dashboard statistics overview
    /// </summary>
    [HttpGet("stats")]
    [ProducesResponseType(typeof(DashboardStatsDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<DashboardStatsDto>> GetStats(CancellationToken cancellationToken)
    {
        try
        {
            var tenantId = GetTenantIdFromClaims();
            var stats = await _dashboardService.GetStatsAsync(tenantId, cancellationToken);
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving dashboard stats");
            return StatusCode(500, "An error occurred while retrieving dashboard statistics");
        }
    }

    /// <summary>
    /// Get analytics data for charts (last 7 days)
    /// </summary>
    [HttpGet("analytics")]
    [ProducesResponseType(typeof(DashboardAnalyticsDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<DashboardAnalyticsDto>> GetAnalytics(CancellationToken cancellationToken)
    {
        try
        {
            var tenantId = GetTenantIdFromClaims();
            var analytics = await _dashboardService.GetAnalyticsAsync(tenantId, cancellationToken);
            return Ok(analytics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving analytics");
            return StatusCode(500, "An error occurred while retrieving analytics data");
        }
    }

    /// <summary>
    /// Get system health metrics
    /// </summary>
    [HttpGet("system-health")]
    [ProducesResponseType(typeof(SystemHealthDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<SystemHealthDto>> GetSystemHealth(CancellationToken cancellationToken)
    {
        try
        {
            var health = await _dashboardService.GetSystemHealthAsync(cancellationToken);
            return Ok(health);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving system health");
            return StatusCode(500, "An error occurred while retrieving system health");
        }
    }

    /// <summary>
    /// Helper method to extract tenant ID from JWT claims
    /// </summary>
    private Guid GetTenantIdFromClaims()
    {
        var tenantIdClaim = User.FindFirst("tenant_id")?.Value
            ?? User.FindFirst(ClaimTypes.GroupSid)?.Value;

        if (string.IsNullOrEmpty(tenantIdClaim) || !Guid.TryParse(tenantIdClaim, out var tenantId))
        {
            throw new UnauthorizedAccessException("Tenant ID not found in token");
        }

        return tenantId;
    }
}
