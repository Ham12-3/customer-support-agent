namespace CustomerSupport.Core.DTOs.Dashboard;

/// <summary>
/// System health metrics
/// </summary>
public class SystemHealthDto
{
    public double ApiLatencyMs { get; set; }
    public double DatabaseLoadPercent { get; set; }
    public double MemoryUsagePercent { get; set; }
}
