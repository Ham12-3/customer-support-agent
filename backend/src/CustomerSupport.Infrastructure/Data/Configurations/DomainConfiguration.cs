using CustomerSupport.Core.Entities;
using CustomerSupport.Core.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerSupport.Infrastructure.Data.Configurations;

/// <summary>
/// Entity Framework configuration for Domain entity
/// </summary>
public class DomainConfiguration : IEntityTypeConfiguration<Domain>
{
    public void Configure(EntityTypeBuilder<Domain> builder)
    {
        builder.ToTable("domains");

        builder.HasKey(d => d.Id);

        builder.Property(d => d.DomainUrl)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(d => d.VerificationCode)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(d => d.ApiKey)
            .IsRequired()
            .HasMaxLength(200);

        // Store enum as integer in database
        builder.Property(d => d.Status)
            .IsRequired()
            .HasConversion<int>()
            .HasDefaultValue(DomainStatus.Pending);

        builder.Property(d => d.IsVerified)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(d => d.WidgetConfig)
            .HasColumnType("jsonb");

        // Relationships
        builder.HasOne(d => d.Tenant)
            .WithMany(t => t.Domains)
            .HasForeignKey(d => d.TenantId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(d => d.TenantId)
            .HasDatabaseName("idx_domains_tenant_id");

        builder.HasIndex(d => d.ApiKey)
            .IsUnique()
            .HasDatabaseName("idx_domains_api_key");

        builder.HasIndex(d => d.IsVerified)
            .HasDatabaseName("idx_domains_is_verified");
    }
}

