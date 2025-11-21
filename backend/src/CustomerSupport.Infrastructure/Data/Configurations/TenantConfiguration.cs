using CustomerSupport.Core.Entities;
using CustomerSupport.Core.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerSupport.Infrastructure.Data.Configurations;

/// <summary>
/// Entity Framework configuration for Tenant entity
/// </summary>
public class TenantConfiguration : IEntityTypeConfiguration<Tenant>
{
    public void Configure(EntityTypeBuilder<Tenant> builder)
    {
        builder.ToTable("tenants");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(t => t.Email)
            .IsRequired()
            .HasMaxLength(200);

        // Store enum as integer in database
        builder.Property(t => t.Status)
            .IsRequired()
            .HasConversion<int>()
            .HasDefaultValue(TenantStatus.Active);

        builder.Property(t => t.Plan)
            .IsRequired()
            .HasConversion<int>()
            .HasDefaultValue(SubscriptionPlan.Free);

        // Indexes for performance
        builder.HasIndex(t => t.Email)
            .IsUnique()
            .HasDatabaseName("idx_tenants_email");

        builder.HasIndex(t => t.Status)
            .HasDatabaseName("idx_tenants_status");

        builder.HasIndex(t => t.CreatedAt)
            .HasDatabaseName("idx_tenants_created_at");
    }
}

