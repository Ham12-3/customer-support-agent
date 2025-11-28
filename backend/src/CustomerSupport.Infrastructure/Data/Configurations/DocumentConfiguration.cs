using CustomerSupport.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerSupport.Infrastructure.Data.Configurations;

/// <summary>
/// Entity Framework configuration for Document entity
/// </summary>
public class DocumentConfiguration : IEntityTypeConfiguration<Document>
{
    public void Configure(EntityTypeBuilder<Document> builder)
    {
        builder.ToTable("documents");

        builder.HasKey(d => d.Id);

        builder.Property(d => d.Title)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(d => d.SourceUrl)
            .HasMaxLength(1000);

        builder.Property(d => d.FileType)
            .HasMaxLength(100);

        builder.Property(d => d.ContentHash)
            .IsRequired()
            .HasMaxLength(100);

        // Store enum as integer in database
        builder.Property(d => d.Status)
            .IsRequired()
            .HasConversion<int>()
            .HasDefaultValue(Core.Enums.DocumentStatus.Processing);

        // Relationships
        builder.HasOne(d => d.Tenant)
            .WithMany(t => t.Documents)
            .HasForeignKey(d => d.TenantId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(d => d.Domain)
            .WithMany()
            .HasForeignKey(d => d.DomainId)
            .OnDelete(DeleteBehavior.SetNull);

        // Indexes
        builder.HasIndex(d => d.TenantId)
            .HasDatabaseName("idx_documents_tenant_id");
        
        builder.HasIndex(d => d.DomainId)
            .HasDatabaseName("idx_documents_domain_id");

        builder.HasIndex(d => d.Status)
            .HasDatabaseName("idx_documents_status");

        builder.HasIndex(d => d.ContentHash)
            .HasDatabaseName("idx_documents_content_hash");
    }
}

