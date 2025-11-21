namespace CustomerSupport.Core.DTOs.Conversation;

/// <summary>
/// DTO for conversation response
/// </summary>
public class ConversationResponseDto
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid DomainId { get; set; }
    public string DomainUrl { get; set; } = string.Empty;
    public string SessionId { get; set; } = string.Empty;
    public string? CustomerEmail { get; set; }
    public string? CustomerName { get; set; }
    public string Status { get; set; } = string.Empty;
    public bool IsEscalated { get; set; }
    public string? AssignedAgentName { get; set; }
    public int MessageCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? EndedAt { get; set; }
    public List<MessageDto> Messages { get; set; } = new();
}

/// <summary>
/// DTO for message in a conversation
/// </summary>
public class MessageDto
{
    public Guid Id { get; set; }
    public string Role { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public double? ConfidenceScore { get; set; }
    public bool IsFromHuman { get; set; }
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// DTO for paginated conversations list
/// </summary>
public class ConversationListDto
{
    public List<ConversationResponseDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}

/// <summary>
/// DTO for filtering conversations
/// </summary>
public class ConversationFilterDto
{
    public Guid? DomainId { get; set; }
    public string? Status { get; set; }
    public bool? IsEscalated { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

