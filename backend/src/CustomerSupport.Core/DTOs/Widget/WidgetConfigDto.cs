namespace CustomerSupport.Core.DTOs.Widget;

/// <summary>
/// Widget configuration returned to the embedded script
/// </summary>
public class WidgetConfigDto
{
    public string ApiKey { get; set; } = string.Empty;
    public Guid DomainId { get; set; }
    public string WidgetUrl { get; set; } = string.Empty;
    public bool IsVerified { get; set; }
}

