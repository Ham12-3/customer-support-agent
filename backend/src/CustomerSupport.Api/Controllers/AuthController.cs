using CustomerSupport.Api.Extensions;
using CustomerSupport.Core.DTOs.Auth;
using CustomerSupport.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CustomerSupport.Api.Controllers;

/// <summary>
/// Controller for authentication operations
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ITokenService _tokenService;

    public AuthController(IAuthService authService, ITokenService tokenService)
    {
        _authService = authService;
        _tokenService = tokenService;
    }

    /// <summary>
    /// Register a new enterprise tenant and admin user
    /// </summary>
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto dto)
    {
        var result = await _authService.RegisterAsync(dto, GetClientIp());

        if (result.IsFailure)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Registration failed",
                Detail = result.Error,
                Status = StatusCodes.Status400BadRequest
            });
        }

        return CreatedAtAction(nameof(Register), result.Value);
    }

    /// <summary>
    /// Login with email and password
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto dto)
    {
        var result = await _authService.LoginAsync(dto, GetClientIp());

        if (result.IsFailure)
        {
            return Unauthorized(new ProblemDetails
            {
                Title = "Login failed",
                Detail = result.Error,
                Status = StatusCodes.Status401Unauthorized
            });
        }

        return Ok(result.Value);
    }

    /// <summary>
    /// Get current user information
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var userId = User.GetUserId();
        if (userId == Guid.Empty)
        {
            return Unauthorized();
        }

        var result = await _authService.GetCurrentUserAsync(userId);

        if (result.IsFailure)
        {
            return Unauthorized(new ProblemDetails
            {
                Title = "Unauthorized",
                Detail = result.Error,
                Status = StatusCodes.Status401Unauthorized
            });
        }

        return Ok(result.Value);
    }

    /// <summary>
    /// Refresh access token using refresh token
    /// </summary>
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthResponseDto>> Refresh([FromBody] RefreshTokenDto dto)
    {
        // Extract user ID from expired token in Authorization header
        // We'll manually validate the token (ignoring expiration) to get user info
        var authHeader = Request.Headers["Authorization"].FirstOrDefault();
        Guid userId = Guid.Empty;
        
        if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
        {
            var token = authHeader.Substring("Bearer ".Length).Trim();
            var principal = _tokenService.GetPrincipalFromExpiredToken(token);
            if (principal != null)
            {
                var userIdClaim = principal.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var parsedUserId))
                {
                    userId = parsedUserId;
                }
            }
        }
        
        // If we couldn't get user from token, return error
        if (userId == Guid.Empty)
        {
            return Unauthorized(new ProblemDetails
            {
                Title = "Token refresh failed",
                Detail = "Invalid or expired token. Please login again.",
                Status = StatusCodes.Status401Unauthorized
            });
        }

        var result = await _authService.RefreshTokenAsync(dto, userId, GetClientIp());

        if (result.IsFailure)
        {
            return Unauthorized(new ProblemDetails
            {
                Title = "Token refresh failed",
                Detail = result.Error,
                Status = StatusCodes.Status401Unauthorized
            });
        }

        return Ok(result.Value);
    }

    private string? GetClientIp()
    {
        return HttpContext.Connection.RemoteIpAddress?.ToString();
    }
}

