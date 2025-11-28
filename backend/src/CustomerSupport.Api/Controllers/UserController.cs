using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CustomerSupport.Core.DTOs.User;
using CustomerSupport.Core.Entities;
using CustomerSupport.Infrastructure.Data;

namespace CustomerSupport.Api.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<UserController> _logger;

    public UserController(
        AppDbContext context,
        ILogger<UserController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get current user profile
    /// </summary>
    [HttpGet("profile")]
    public async Task<ActionResult<UserProfileDto>> GetProfile()
    {
        try
        {
            var userIdStr = User.FindFirst("sub")?.Value ?? User.FindFirst("user_id")?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
            {
                return Unauthorized("User ID not found");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var profile = new UserProfileDto
            {
                Id = user.Id.ToString(),
                Email = user.Email,
                FullName = user.FullName,
                Company = user.Company,
                Role = user.JobRole,
                Timezone = user.Timezone,
                AvatarUrl = user.AvatarUrl,
                CreatedAt = user.CreatedAt
            };

            return Ok(profile);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user profile");
            return StatusCode(500, "Error retrieving profile");
        }
    }

    /// <summary>
    /// Update user profile
    /// </summary>
    [HttpPut("profile")]
    public async Task<ActionResult<UserProfileDto>> UpdateProfile([FromBody] UpdateUserProfileDto dto)
    {
        try
        {
            var userIdStr = User.FindFirst("sub")?.Value ?? User.FindFirst("user_id")?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
            {
                return Unauthorized("User ID not found");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            // Parse full name into first and last
            var nameParts = dto.FullName.Split(' ', 2);
            user.FirstName = nameParts[0];
            user.LastName = nameParts.Length > 1 ? nameParts[1] : string.Empty;
            user.Company = dto.Company;
            user.JobRole = dto.Role;
            user.Timezone = dto.Timezone;

            await _context.SaveChangesAsync();

            var profile = new UserProfileDto
            {
                Id = user.Id.ToString(),
                Email = user.Email,
                FullName = user.FullName,
                Company = user.Company,
                Role = user.JobRole,
                Timezone = user.Timezone,
                AvatarUrl = user.AvatarUrl,
                CreatedAt = user.CreatedAt
            };

            return Ok(profile);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user profile");
            return StatusCode(500, "Error updating profile");
        }
    }

    /// <summary>
    /// Change user password
    /// </summary>
    [HttpPut("password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        try
        {
            var userIdStr = User.FindFirst("sub")?.Value ?? User.FindFirst("user_id")?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
            {
                return Unauthorized("User ID not found");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            // Verify current password
            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
            {
                return BadRequest(new { message = "Current password is incorrect" });
            }

            // Hash and update new password
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password changed successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error changing password");
            return StatusCode(500, "Error changing password");
        }
    }

    /// <summary>
    /// Get active sessions (mock implementation - would need session tracking in production)
    /// </summary>
    [HttpGet("sessions")]
    public Task<ActionResult<List<UserSessionDto>>> GetSessions()
    {
        // Mock implementation - in production, you'd track sessions in database or Redis
        var sessions = new List<UserSessionDto>
        {
            new UserSessionDto
            {
                Id = Guid.NewGuid().ToString(),
                Device = "Chrome on Windows",
                Location = "New York, US",
                IpAddress = "192.168.1.1",
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                LastActivity = DateTime.UtcNow,
                IsCurrent = true
            },
            new UserSessionDto
            {
                Id = Guid.NewGuid().ToString(),
                Device = "Safari on iPhone",
                Location = "New York, US",
                IpAddress = "192.168.1.2",
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                LastActivity = DateTime.UtcNow.AddHours(-2),
                IsCurrent = false
            }
        };

        return Task.FromResult<ActionResult<List<UserSessionDto>>>(Ok(sessions));
    }

    /// <summary>
    /// Revoke a session (mock implementation)
    /// </summary>
    [HttpDelete("sessions/{sessionId}")]
    public Task<IActionResult> RevokeSession(string sessionId)
    {
        try
        {
            // Mock implementation - in production, you'd invalidate the session
            return Task.FromResult<IActionResult>(Ok(new { message = "Session revoked successfully" }));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error revoking session");
            return Task.FromResult<IActionResult>(StatusCode(500, "Error revoking session"));
        }
    }

    /// <summary>
    /// Get notification preferences
    /// </summary>
    [HttpGet("notifications")]
    public async Task<ActionResult<NotificationPreferencesDto>> GetNotificationPreferences()
    {
        try
        {
            var userIdStr = User.FindFirst("sub")?.Value ?? User.FindFirst("user_id")?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
            {
                return Unauthorized("User ID not found");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            // Mock implementation - in production, store these in database
            var preferences = new NotificationPreferencesDto
            {
                EmailNotifications = true,
                PushNotifications = false,
                WeeklyReports = true,
                SecurityAlerts = true,
                NewConversations = true,
                AgentUpdates = false
            };

            return Ok(preferences);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting notification preferences");
            return StatusCode(500, "Error retrieving preferences");
        }
    }

    /// <summary>
    /// Update notification preferences
    /// </summary>
    [HttpPut("notifications")]
    public async Task<ActionResult<NotificationPreferencesDto>> UpdateNotificationPreferences([FromBody] NotificationPreferencesDto dto)
    {
        try
        {
            var userIdStr = User.FindFirst("sub")?.Value ?? User.FindFirst("user_id")?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
            {
                return Unauthorized("User ID not found");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            // Mock implementation - in production, save to database
            await Task.Delay(100); // Simulate async operation

            return Ok(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating notification preferences");
            return StatusCode(500, "Error updating preferences");
        }
    }
}

