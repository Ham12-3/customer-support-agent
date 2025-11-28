using CustomerSupport.Core.DTOs.Auth;
using FluentValidation;

namespace CustomerSupport.Api.Validators.Auth;

/// <summary>
/// FluentValidation rules for <see cref="RefreshTokenDto"/>.
/// </summary>
public class RefreshTokenDtoValidator : AbstractValidator<RefreshTokenDto>
{
    public RefreshTokenDtoValidator()
    {
        RuleFor(x => x.RefreshToken)
            .NotEmpty().WithMessage("Refresh token is required.");
    }
}


