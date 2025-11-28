namespace CustomerSupport.Core.DTOs.Domain;

/// <summary>
/// DTO for creating a new AI agent with business configuration
/// </summary>
public class CreateAgentDto
{
    // Basic Information
    public string DomainUrl { get; set; } = string.Empty;
    
    // Business Information
    public string CompanyName { get; set; } = string.Empty;
    public string Industry { get; set; } = string.Empty;
    public string CompanyDescription { get; set; } = string.Empty;
    
    // Agent Configuration
    public string AgentName { get; set; } = "Support Agent";
    public string AgentPersonality { get; set; } = "professional"; // professional, friendly, casual
    public string PrimaryLanguage { get; set; } = "en";
    
    // Business Details
    public string ProductsServices { get; set; } = string.Empty;
    public string TargetAudience { get; set; } = string.Empty;
    public string KeyFeatures { get; set; } = string.Empty;
    
    // FAQ & Knowledge
    public List<FaqItem> Faqs { get; set; } = new();
    public string AdditionalInfo { get; set; } = string.Empty;
    
    // Contact & Support
    public string SupportEmail { get; set; } = string.Empty;
    public string SupportPhone { get; set; } = string.Empty;
    public string WorkingHours { get; set; } = string.Empty;
}

public class FaqItem
{
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
}

