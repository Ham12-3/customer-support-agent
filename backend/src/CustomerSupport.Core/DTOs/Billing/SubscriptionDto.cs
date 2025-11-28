namespace CustomerSupport.Core.DTOs.Billing;

/// <summary>
/// Subscription information
/// </summary>
public class SubscriptionDto
{
    public string Id { get; set; } = string.Empty;
    public string PlanName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string BillingInterval { get; set; } = "monthly"; // monthly, yearly
    public string Status { get; set; } = "active"; // active, cancelled, past_due
    public DateTime CurrentPeriodStart { get; set; }
    public DateTime CurrentPeriodEnd { get; set; }
    public bool CancelAtPeriodEnd { get; set; }
    public DateTime? CancelledAt { get; set; }
}

/// <summary>
/// Payment method information
/// </summary>
public class PaymentMethodDto
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = "card";
    public string Last4 { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public int ExpMonth { get; set; }
    public int ExpYear { get; set; }
    public bool IsDefault { get; set; }
}

/// <summary>
/// Invoice information
/// </summary>
public class InvoiceDto
{
    public string Id { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public string Status { get; set; } = "paid";
    public DateTime Date { get; set; }
    public string? InvoiceUrl { get; set; }
    public string? InvoicePdf { get; set; }
}

