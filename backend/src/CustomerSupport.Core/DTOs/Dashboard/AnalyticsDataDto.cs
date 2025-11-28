namespace CustomerSupport.Core.DTOs.Dashboard;

/// <summary>
/// Analytics data for charts
/// </summary>
public class AnalyticsDataDto
{
    public List<DailyAnalyticsDto> DailyData { get; set; } = new();
}

public class DailyAnalyticsDto
{
    public string Name { get; set; } = string.Empty; // Day name (Mon, Tue, etc.)
    public int Value { get; set; } // Message count
    public DateTime Date { get; set; }
}

