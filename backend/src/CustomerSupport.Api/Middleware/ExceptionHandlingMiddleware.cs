using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace CustomerSupport.Api.Middleware;

/// <summary>
/// Centralized exception handling middleware that converts unhandled exceptions into ProblemDetails responses.
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception occurred while processing {Path}", context.Request.Path);
            await WriteProblemDetailsAsync(context, ex);
        }
    }

    private static Task WriteProblemDetailsAsync(HttpContext context, Exception exception)
    {
        var problem = new ProblemDetails
        {
            Title = "An unexpected error occurred.",
            Detail = "Please try again later or contact support if the problem persists.",
            Status = (int)HttpStatusCode.InternalServerError,
            Instance = context.TraceIdentifier
        };

        context.Response.Clear();
        context.Response.StatusCode = problem.Status ?? (int)HttpStatusCode.InternalServerError;
        context.Response.ContentType = "application/problem+json";

        var payload = JsonSerializer.Serialize(problem);
        return context.Response.WriteAsync(payload);
    }
}

public static class ExceptionHandlingMiddlewareExtensions
{
    public static IApplicationBuilder UseGlobalExceptionHandling(this IApplicationBuilder app)
    {
        return app.UseMiddleware<ExceptionHandlingMiddleware>();
    }
}


