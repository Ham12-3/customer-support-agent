using CustomerSupport.Core.DTOs.Dashboard;
using CustomerSupport.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using CustomerSupport.Infrastructure.Data;

namespace CustomerSupport.Infrastructure.Services;

/// <summary>
/// Service for calculating dashboard statistics and analytics
/// </summary>
public class DashboardService : IDashboardService
{
    private readonly AppDbContext _context;
    private readonly ILogger<DashboardService> _logger;

    public DashboardService(AppDbContext context, ILogger<DashboardService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<DashboardStatsDto> GetStatsAsync(Guid tenantId, CancellationToken cancellationToken = default)
    {
        try
        {
            var now = DateTime.UtcNow;
            var sevenDaysAgo = now.AddDays(-7);
            var fourteenDaysAgo = now.AddDays(-14);

            // Get current period stats (last 7 days)
            var currentConversations = await _context.Conversations
                .Where(c => c.TenantId == tenantId && c.CreatedAt >= sevenDaysAgo)
                .CountAsync(cancellationToken);

            // Get previous period stats (7-14 days ago) for comparison
            var previousConversations = await _context.Conversations
                .Where(c => c.TenantId == tenantId && c.CreatedAt >= fourteenDaysAgo && c.CreatedAt < sevenDaysAgo)
                .CountAsync(cancellationToken);

            // Calculate conversation change percentage
            var conversationsChangePercent = previousConversations > 0
                ? ((currentConversations - previousConversations) / (double)previousConversations) * 100
                : currentConversations > 0 ? 100 : 0;

            // Get active agents (domains with verified status)
            var activeAgents = await _context.Domains
                .Where(d => d.TenantId == tenantId && d.IsVerified)
                .CountAsync(cancellationToken);

            // Get previous active agents count
            var previousActiveAgents = await _context.Domains
                .Where(d => d.TenantId == tenantId && d.IsVerified && d.CreatedAt < sevenDaysAgo)
                .CountAsync(cancellationToken);

            var agentsChangePercent = previousActiveAgents > 0
                ? ((activeAgents - previousActiveAgents) / (double)previousActiveAgents) * 100
                : activeAgents > 0 ? 100 : 0;

            // Calculate average response time (mock for now - will be real when we have message timestamps)
            var averageResponseTimeSeconds = 2.3; // Mock value
            var responseTimeChangePercent = -12.5; // Mock improvement

            return new DashboardStatsDto
            {
                TotalConversations = currentConversations,
                ActiveAgents = activeAgents,
                AverageResponseTimeSeconds = averageResponseTimeSeconds,
                ConversationsChangePercent = conversationsChangePercent,
                ResponseTimeChangePercent = responseTimeChangePercent,
                AgentsChangePercent = agentsChangePercent
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating dashboard stats for tenant {TenantId}", tenantId);
            throw;
        }
    }

    public async Task<DashboardAnalyticsDto> GetAnalyticsAsync(Guid tenantId, CancellationToken cancellationToken = default)
    {
        try
        {
            var now = DateTime.UtcNow;
            var sevenDaysAgo = now.AddDays(-7);

            // Get conversations grouped by day for the last 7 days
            var conversationsByDay = await _context.Conversations
                .Where(c => c.TenantId == tenantId && c.CreatedAt >= sevenDaysAgo)
                .GroupBy(c => c.CreatedAt.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    Count = g.Count()
                })
                .OrderBy(x => x.Date)
                .ToListAsync(cancellationToken);

            // Create data points for all 7 days (fill missing days with 0)
            var dailyData = new List<DailyDataPoint>();
            for (int i = 6; i >= 0; i--)
            {
                var date = now.AddDays(-i).Date;
                var dayName = date.ToString("ddd"); // Mon, Tue, Wed, etc.
                var count = conversationsByDay.FirstOrDefault(x => x.Date == date)?.Count ?? 0;

                dailyData.Add(new DailyDataPoint
                {
                    Name = dayName,
                    Value = count
                });
            }

            return new DashboardAnalyticsDto
            {
                DailyData = dailyData
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating analytics for tenant {TenantId}", tenantId);
            throw;
        }
    }

    public async Task<SystemHealthDto> GetSystemHealthAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var stopwatch = Stopwatch.StartNew();

            // Measure database latency with a simple query
            await _context.Users.Take(1).ToListAsync(cancellationToken);
            stopwatch.Stop();
            var dbLatencyMs = stopwatch.Elapsed.TotalMilliseconds;

            // Get database connection count as a proxy for load
            var connectionCount = _context.ChangeTracker.Entries().Count();
            var databaseLoadPercent = Math.Min(connectionCount * 2, 100); // Mock calculation

            // Get memory usage
            var process = Process.GetCurrentProcess();
            var memoryUsageMb = process.WorkingSet64 / 1024.0 / 1024.0;
            var memoryUsagePercent = Math.Min((memoryUsageMb / 512.0) * 100, 100); // Assume 512MB baseline

            return new SystemHealthDto
            {
                ApiLatencyMs = dbLatencyMs,
                DatabaseLoadPercent = databaseLoadPercent,
                MemoryUsagePercent = memoryUsagePercent
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating system health");
            throw;
        }
    }
}

