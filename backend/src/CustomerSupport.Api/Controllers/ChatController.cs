using CustomerSupport.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace CustomerSupport.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IGeminiService _geminiService;
    private readonly ILogger<ChatController> _logger;

    public ChatController(
        IGeminiService geminiService,
        ILogger<ChatController> logger)
    {
        _geminiService = geminiService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] ChatRequest request)
    {
        try
        {
            // Validate API key from header
            var apiKey = Request.Headers["X-API-Key"].FirstOrDefault();
            if (string.IsNullOrEmpty(apiKey))
            {
                return Unauthorized(new { error = "API key is required" });
            }

            // TODO: Validate API key against Domains table
            // TODO: Load relevant knowledge base chunks
            // TODO: Build conversation history

            var response = await _geminiService.GenerateResponseAsync(request.Message);

            // TODO: Save conversation and messages to database

            return Ok(new ChatResponse
            {
                Message = response,
                SessionId = request.SessionId,
                Timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing chat message");
            return StatusCode(500, new { error = "Failed to process message" });
        }
    }
}

public class ChatRequest
{
    public string Message { get; set; } = string.Empty;
    public string SessionId { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
}

public class ChatResponse
{
    public string Message { get; set; } = string.Empty;
    public string SessionId { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}