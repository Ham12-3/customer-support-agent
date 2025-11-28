namespace CustomerSupport.Core.DTOs.Dashboard;

/// <summary>
/// Dashboard statistics overview
/// </summary>
public class DashboardStatsDto
{
    public int TotalConversations { get; set; }
    public int ActiveAgents { get; set; }
    public double AverageResponseTimeSeconds { get; set; }
    public double ConversationsChangePercent { get; set; }
    public double ResponseTimeChangePercent { get; set; }
    public double AgentsChangePercent { get; set; }
}
