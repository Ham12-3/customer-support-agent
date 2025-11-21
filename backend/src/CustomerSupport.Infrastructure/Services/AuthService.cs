using CustomerSupport.Core.Common;
using CustomerSupport.Core.DTOs.Auth;
using CustomerSupport.Core.Entities;
using CustomerSupport.Core.Enums;
using CustomerSupport.Core.Interfaces;
using Microsoft.Extensions.Logging;

namespace CustomerSupport.Infrastructure.Services;

/// <summary>
/// Service implementation for authentication operations
/// </summary>
public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITokenService _tokenService;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IUnitOfWork unitOfWork,
        ITokenService tokenService,
        ILogger<AuthService> logger)
    {
        _unitOfWork = unitOfWork;
        _tokenService = tokenService;
        _logger = logger;
    }

    public async Task<Result<AuthResponseDto>> RegisterAsync(
        RegisterDto dto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Check if email already exists
            var existingUser = await _unitOfWork.Users.GetByEmailAsync(dto.Email, cancellationToken);
            if (existingUser != null)
            {
                return Result<AuthResponseDto>.Failure("A user with this email already exists");
            }

            // Begin transaction
            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            // Create tenant
            var tenant = new Tenant
            {
                Id = Guid.NewGuid(),
                Name = dto.CompanyName,
                Email = dto.Email,
                Status = TenantStatus.Active,
                Plan = SubscriptionPlan.Free
            };

            await _unitOfWork.Tenants.AddAsync(tenant, cancellationToken);

            // Create admin user
            var user = new User
            {
                Id = Guid.NewGuid(),
                TenantId = tenant.Id,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = UserRole.Admin,
                IsActive = true
            };

            await _unitOfWork.Users.AddAsync(user, cancellationToken);

            // Commit transaction - both operations succeed or both fail
            await _unitOfWork.CommitAsync(cancellationToken);

            // Set navigation property for token generation
            user.Tenant = tenant;

            // Generate tokens
            var accessToken = _tokenService.GenerateAccessToken(user);
            var refreshToken = _tokenService.GenerateRefreshToken();

            var response = new AuthResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(60),
                User = new UserDto
                {
                    Id = user.Id,
                    TenantId = user.TenantId,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Role = user.Role.ToString(),
                    TenantName = tenant.Name
                }
            };

            _logger.LogInformation(
                "New tenant registered: {TenantName} ({TenantId}) with admin user {Email}",
                tenant.Name, tenant.Id, user.Email);

            return Result<AuthResponseDto>.Success(response);
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackAsync(cancellationToken);
            _logger.LogError(ex, "Error during registration for email: {Email}", dto.Email);
            return Result<AuthResponseDto>.Failure("An error occurred during registration. Please try again later.");
        }
    }

    public async Task<Result<AuthResponseDto>> LoginAsync(
        LoginDto dto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Find user by email
            var user = await _unitOfWork.Users.GetByEmailAsync(dto.Email, cancellationToken);
            if (user == null)
            {
                return Result<AuthResponseDto>.Failure("Invalid email or password");
            }

            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                _logger.LogWarning("Failed login attempt for email: {Email}", dto.Email);
                return Result<AuthResponseDto>.Failure("Invalid email or password");
            }

            // Check if user is active
            if (!user.IsActive)
            {
                _logger.LogWarning("Login attempt for inactive account: {Email}", dto.Email);
                return Result<AuthResponseDto>.Failure("Your account has been deactivated. Please contact support.");
            }

            // Update last login time
            user.LastLoginAt = DateTime.UtcNow;
            await _unitOfWork.Users.UpdateAsync(user, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Generate tokens
            var accessToken = _tokenService.GenerateAccessToken(user);
            var refreshToken = _tokenService.GenerateRefreshToken();

            var response = new AuthResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(60),
                User = new UserDto
                {
                    Id = user.Id,
                    TenantId = user.TenantId,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Role = user.Role.ToString(),
                    TenantName = user.Tenant.Name
                }
            };

            _logger.LogInformation("User logged in: {Email} ({UserId})", user.Email, user.Id);

            return Result<AuthResponseDto>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for email: {Email}", dto.Email);
            return Result<AuthResponseDto>.Failure("An error occurred during login. Please try again later.");
        }
    }

    public async Task<Result<UserDto>> GetCurrentUserAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId, cancellationToken);
            if (user == null)
            {
                return Result<UserDto>.Failure("User not found");
            }

            var userDto = new UserDto
            {
                Id = user.Id,
                TenantId = user.TenantId,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role.ToString(),
                TenantName = user.Tenant.Name
            };

            return Result<UserDto>.Success(userDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting current user: {UserId}", userId);
            return Result<UserDto>.Failure("An error occurred retrieving user information");
        }
    }
}

