using System.Linq;
using AutoMapper;
using CustomerSupport.Core.Common;
using CustomerSupport.Core.DTOs.Auth;
using CustomerSupport.Core.Entities;
using CustomerSupport.Core.Enums;
using CustomerSupport.Core.Interfaces;
using CustomerSupport.Core.Options;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CustomerSupport.Infrastructure.Services;

/// <summary>
/// Service implementation for authentication operations
/// </summary>
public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITokenService _tokenService;
    private readonly ILogger<AuthService> _logger;
    private readonly IMapper _mapper;
    private readonly RefreshTokenOptions _refreshTokenOptions;

    public AuthService(
        IUnitOfWork unitOfWork,
        ITokenService tokenService,
        ILogger<AuthService> logger,
        IMapper mapper,
        IOptions<RefreshTokenOptions> refreshTokenOptions)
    {
        _unitOfWork = unitOfWork;
        _tokenService = tokenService;
        _logger = logger;
        _mapper = mapper;
        _refreshTokenOptions = refreshTokenOptions.Value;
    }

    public async Task<Result<AuthResponseDto>> RegisterAsync(
        RegisterDto dto,
        string? ipAddress = null,
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

            var refreshTokenValue = _tokenService.GenerateRefreshToken();
            var refreshTokenEntity = CreateRefreshToken(user, refreshTokenValue, ipAddress);
            await _unitOfWork.RefreshTokens.AddAsync(refreshTokenEntity, cancellationToken);

            // Commit transaction - both operations succeed or both fail
            await _unitOfWork.CommitAsync(cancellationToken);
            await EnforceRefreshTokenLimitAsync(user.Id, cancellationToken);

            // Set navigation property for token generation
            user.Tenant = tenant;

            // Generate tokens
            var accessToken = _tokenService.GenerateAccessToken(user);

            var response = BuildAuthResponse(user, accessToken, refreshTokenValue);

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
        string? ipAddress = null,
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

            var refreshTokenValue = _tokenService.GenerateRefreshToken();
            var refreshTokenEntity = CreateRefreshToken(user, refreshTokenValue, ipAddress);
            await _unitOfWork.RefreshTokens.AddAsync(refreshTokenEntity, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            await EnforceRefreshTokenLimitAsync(user.Id, cancellationToken);

            // Generate tokens
            var accessToken = _tokenService.GenerateAccessToken(user);

            var response = BuildAuthResponse(user, accessToken, refreshTokenValue);

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

            return Result<UserDto>.Success(_mapper.Map<UserDto>(user));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting current user: {UserId}", userId);
            return Result<UserDto>.Failure("An error occurred retrieving user information");
        }
    }

    public async Task<Result<AuthResponseDto>> RefreshTokenAsync(
        RefreshTokenDto dto,
        Guid userId,
        string? ipAddress = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Get user from database
            var user = await _unitOfWork.Users.GetByIdAsync(userId, cancellationToken);
            if (user == null || !user.IsActive)
            {
                return Result<AuthResponseDto>.Failure("User not found or inactive");
            }

            var tokenHash = _tokenService.HashToken(dto.RefreshToken);
            var storedToken = await _unitOfWork.RefreshTokens.GetByTokenHashAsync(tokenHash, cancellationToken);

            if (storedToken == null || storedToken.UserId != userId)
            {
                return Result<AuthResponseDto>.Failure("Invalid refresh token. Please login again.");
            }

            if (storedToken.IsRevoked)
            {
                return Result<AuthResponseDto>.Failure("Refresh token has been revoked. Please login again.");
            }

            if (storedToken.IsExpired)
            {
                return Result<AuthResponseDto>.Failure("Refresh token has expired. Please login again.");
            }

            // Rotate refresh token
            storedToken.RevokedAt = DateTime.UtcNow;
            storedToken.RevokedByIp = ipAddress;
            storedToken.RevokedReason = "Token rotated";

            var newRefreshTokenValue = _tokenService.GenerateRefreshToken();
            var newRefreshTokenEntity = CreateRefreshToken(user, newRefreshTokenValue, ipAddress);
            storedToken.ReplacedByTokenId = newRefreshTokenEntity.Id;

            await _unitOfWork.RefreshTokens.AddAsync(newRefreshTokenEntity, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            await EnforceRefreshTokenLimitAsync(user.Id, cancellationToken);

            // Generate new tokens
            var accessToken = _tokenService.GenerateAccessToken(user);
            var response = BuildAuthResponse(user, accessToken, newRefreshTokenValue);

            _logger.LogInformation("Token refreshed for user: {Email} ({UserId})", user.Email, user.Id);

            return Result<AuthResponseDto>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error refreshing token");
            return Result<AuthResponseDto>.Failure("An error occurred refreshing the token");
        }
    }
    private RefreshToken CreateRefreshToken(User user, string rawToken, string? ipAddress)
    {
        return new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            TokenHash = _tokenService.HashToken(rawToken),
            ExpiresAt = DateTime.UtcNow.AddDays(_refreshTokenOptions.DaysToExpire),
            CreatedByIp = ipAddress
        };
    }

    private AuthResponseDto BuildAuthResponse(User user, string accessToken, string refreshToken)
    {
        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(60),
            User = _mapper.Map<UserDto>(user)
        };
    }

    private async Task EnforceRefreshTokenLimitAsync(Guid userId, CancellationToken cancellationToken)
    {
        if (_refreshTokenOptions.MaxActiveTokensPerUser <= 0)
        {
            return;
        }

        var activeTokens = await _unitOfWork.RefreshTokens
            .GetActiveTokensByUserAsync(userId, cancellationToken);

        var tokensToRevoke = activeTokens
            .Skip(_refreshTokenOptions.MaxActiveTokensPerUser)
            .ToList();

        if (tokensToRevoke.Count == 0)
        {
            return;
        }

        foreach (var token in tokensToRevoke)
        {
            token.RevokedAt = DateTime.UtcNow;
            token.RevokedReason = "Exceeded maximum active sessions";
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}

