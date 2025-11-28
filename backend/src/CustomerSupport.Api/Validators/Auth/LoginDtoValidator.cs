using CustomerSupport.Core.DTOs.Auth;
using FluentValidation;

namespace CustomerSupport.Api.Validators.Auth;

/// <summary>
/// FluentValidation rules for <see cref="LoginDto"/>.
/// </summary>
public class LoginDtoValidator : AbstractValidator<LoginDto>
{
    public LoginDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email address.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.");
    }
}


