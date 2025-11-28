namespace CustomerSupport.Core.DTOs.Dashboard;

/// <summary>
/// Analytics data for charts
/// </summary>
public class DashboardAnalyticsDto
{
    public List<DailyDataPoint> DailyData { get; set; } = new();
}

public class DailyDataPoint
{
    public string Name { get; set; } = string.Empty; // e.g., "Mon", "Tue"
    public int Value { get; set; } // Number of conversations
}

