using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CustomerSupport.Core.DTOs.Billing;

namespace CustomerSupport.Api.Controllers;

[ApiController]
[Route("api/billing")]
[Authorize]
public class BillingController : ControllerBase
{
    private readonly ILogger<BillingController> _logger;

    public BillingController(ILogger<BillingController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Get subscription information
    /// </summary>
    [HttpGet("subscription")]
    public async Task<ActionResult<SubscriptionDto>> GetSubscription()
    {
        try
        {
            // Mock implementation - in production, integrate with Stripe or similar
            var subscription = new SubscriptionDto
            {
                Id = "sub_" + Guid.NewGuid().ToString("N")[..16],
                PlanName = "Professional",
                Price = 299.00m,
                BillingInterval = "monthly",
                Status = "active",
                CurrentPeriodStart = DateTime.UtcNow.AddDays(-15),
                CurrentPeriodEnd = DateTime.UtcNow.AddDays(15),
                CancelAtPeriodEnd = false
            };

            await Task.Delay(50); // Simulate async operation
            return Ok(subscription);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting subscription");
            return StatusCode(500, "Error retrieving subscription");
        }
    }

    /// <summary>
    /// Get payment methods
    /// </summary>
    [HttpGet("payment-methods")]
    public async Task<ActionResult<List<PaymentMethodDto>>> GetPaymentMethods()
    {
        try
        {
            // Mock implementation
            var paymentMethods = new List<PaymentMethodDto>
            {
                new PaymentMethodDto
                {
                    Id = "pm_" + Guid.NewGuid().ToString("N")[..16],
                    Type = "card",
                    Last4 = "4242",
                    Brand = "Visa",
                    ExpMonth = 12,
                    ExpYear = 2025,
                    IsDefault = true
                }
            };

            await Task.Delay(50);
            return Ok(paymentMethods);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting payment methods");
            return StatusCode(500, "Error retrieving payment methods");
        }
    }

    /// <summary>
    /// Get billing history / invoices
    /// </summary>
    [HttpGet("invoices")]
    public async Task<ActionResult<List<InvoiceDto>>> GetInvoices()
    {
        try
        {
            // Mock implementation
            var invoices = new List<InvoiceDto>();
            var now = DateTime.UtcNow;

            for (int i = 0; i < 3; i++)
            {
                invoices.Add(new InvoiceDto
                {
                    Id = "inv_" + Guid.NewGuid().ToString("N")[..16],
                    Amount = 299.00m,
                    Currency = "USD",
                    Status = "paid",
                    Date = now.AddMonths(-i),
                    InvoiceUrl = $"https://example.com/invoices/{i}",
                    InvoicePdf = $"https://example.com/invoices/{i}.pdf"
                });
            }

            await Task.Delay(50);
            return Ok(invoices);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting invoices");
            return StatusCode(500, "Error retrieving invoices");
        }
    }
}

