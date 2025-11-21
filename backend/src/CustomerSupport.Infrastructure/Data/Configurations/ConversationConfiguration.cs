using CustomerSupport.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerSupport.Infrastructure.Data.Configurations;

/// <summary>
/// Entity Framework configuration for Conversation entity
/// </summary>
public class ConversationConfiguration : IEntityTypeConfiguration<Conversation>
{
    public void Configure(EntityTypeBuilder<Conversation> builder)
    {
        builder.ToTable("conversations");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.SessionId)
            .IsRequired()
            .HasMaxLength(200);

        // Store enum as integer in database
        builder.Property(c => c.Status)
            .IsRequired()
            .HasConversion<int>()
            .HasDefaultValue(Core.Enums.ConversationStatus.Active);

        builder.Property(c => c.CustomerEmail)
            .HasMaxLength(200);

        builder.Property(c => c.CustomerName)
            .HasMaxLength(100);

        builder.Property(c => c.CustomerIpAddress)
            .HasMaxLength(100);

        builder.Property(c => c.CustomerUserAgent)
            .HasMaxLength(500);

        // Relationships
        builder.HasOne(c => c.Tenant)
            .WithMany(t => t.Conversations)
            .HasForeignKey(c => c.TenantId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(c => c.Domain)
            .WithMany(d => d.Conversations)
            .HasForeignKey(c => c.DomainId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(c => c.AssignedAgent)
            .WithMany()
            .HasForeignKey(c => c.AssignedAgentId)
            .OnDelete(DeleteBehavior.SetNull);

        // Indexes
        builder.HasIndex(c => c.TenantId)
            .HasDatabaseName("idx_conversations_tenant_id");

        builder.HasIndex(c => c.DomainId)
            .HasDatabaseName("idx_conversations_domain_id");

        builder.HasIndex(c => c.SessionId)
            .HasDatabaseName("idx_conversations_session_id");

        builder.HasIndex(c => c.Status)
            .HasDatabaseName("idx_conversations_status");

        builder.HasIndex(c => c.CreatedAt)
            .HasDatabaseName("idx_conversations_created_at");
    }
}

