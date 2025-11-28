namespace CustomerSupport.Core.DTOs.User;

/// <summary>
/// User notification preferences
/// </summary>
public class NotificationPreferencesDto
{
    public bool EmailNotifications { get; set; } = true;
    public bool PushNotifications { get; set; } = false;
    public bool WeeklyReports { get; set; } = true;
    public bool SecurityAlerts { get; set; } = true;
    public bool NewConversations { get; set; } = true;
    public bool AgentUpdates { get; set; } = false;
}

