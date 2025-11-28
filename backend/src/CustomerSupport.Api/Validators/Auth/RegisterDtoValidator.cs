using CustomerSupport.Core.DTOs.Auth;
using FluentValidation;

namespace CustomerSupport.Api.Validators.Auth;

/// <summary>
/// FluentValidation rules for <see cref="RegisterDto"/>.
/// </summary>
public class RegisterDtoValidator : AbstractValidator<RegisterDto>
{
    private const string PasswordPattern = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$";

    public RegisterDtoValidator()
    {
        RuleFor(x => x.CompanyName)
            .NotEmpty().WithMessage("Company name is required.")
            .MaximumLength(200);

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email address.")
            .MaximumLength(200);

        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required.")
            .MaximumLength(100);

        RuleFor(x => x.LastName)
            .MaximumLength(100)
            .When(x => !string.IsNullOrWhiteSpace(x.LastName));

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MinimumLength(8).WithMessage("Password must be at least 8 characters.")
            .Matches(PasswordPattern)
            .WithMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number.");

        RuleFor(x => x.ConfirmPassword)
            .NotEmpty().WithMessage("Password confirmation is required.")
            .Equal(x => x.Password)
            .WithMessage("Passwords do not match.");
    }
}


