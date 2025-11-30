using System.Net.Http;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace CustomerSupport.Infrastructure.Services;

public interface IGeminiService
{
    Task<string> GenerateResponseAsync(string prompt, string conversationHistory = "");
}

public class GeminiService : IGeminiService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _model;

  public GeminiService(IConfiguration configuration)
{
    _httpClient = new HttpClient();
    _apiKey = configuration["Gemini:ApiKey"] ?? throw new InvalidOperationException("Gemini API key not configured");
    _model = configuration["Gemini:Model"] ?? "gemini-3-pro-preview";
}
    public async Task<string> GenerateResponseAsync(string prompt, string conversationHistory = "")
    {
        var url = $"https://generativelanguage.googleapis.com/v1beta/models/{_model}:generateContent?key={_apiKey}";

        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    parts = new[]
                    {
                        new { text = BuildPrompt(prompt, conversationHistory) }
                    }
                }
            },
            generationConfig = new
            {
                temperature = 0.7,
                maxOutputTokens = 2048,
                topP = 0.95,
                topK = 40
            }
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        try
        {
            var response = await _httpClient.PostAsync(url, content);
            response.EnsureSuccessStatusCode();

            var responseJson = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<GeminiResponse>(responseJson);

            return result?.Candidates?[0]?.Content?.Parts?[0]?.Text 
                   ?? "I apologize, but I'm having trouble generating a response. Please try again.";
        }
        catch (Exception ex)
        {
            // Log error
            return $"Error: {ex.Message}";
        }
    }

    private string BuildPrompt(string userMessage, string history)
    {
        return $@"You are a helpful customer support assistant. 
        
Context from knowledge base: [Knowledge base context will be added here based on semantic search]

Conversation history:
{history}

Customer question: {userMessage}

Please provide a helpful, accurate, and friendly response.";
    }
}

// Response DTOs
public class GeminiResponse
{
    public Candidate[]? Candidates { get; set; }
}

public class Candidate
{
    public Content? Content { get; set; }
}

public class Content
{
    public Part[]? Parts { get; set; }
}

public class Part
{
    public string? Text { get; set; }
}