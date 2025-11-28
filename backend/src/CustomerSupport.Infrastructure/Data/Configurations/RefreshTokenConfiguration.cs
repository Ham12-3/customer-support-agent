using CustomerSupport.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerSupport.Infrastructure.Data.Configurations;

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        builder.ToTable("refresh_tokens");

        builder.HasKey(rt => rt.Id);

        builder.Property(rt => rt.TokenHash)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(rt => rt.CreatedByIp)
            .HasMaxLength(64);

        builder.Property(rt => rt.RevokedByIp)
            .HasMaxLength(64);

        builder.Property(rt => rt.RevokedReason)
            .HasMaxLength(256);

        builder.HasIndex(rt => rt.TokenHash)
            .IsUnique()
            .HasDatabaseName("idx_refresh_tokens_token_hash");

        builder.HasIndex(rt => new { rt.UserId, rt.ExpiresAt })
            .HasDatabaseName("idx_refresh_tokens_user_expiration");

        builder.HasOne(rt => rt.User)
            .WithMany(u => u.RefreshTokens)
            .HasForeignKey(rt => rt.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}


