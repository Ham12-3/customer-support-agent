using CustomerSupport.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerSupport.Infrastructure.Data.Configurations;

/// <summary>
/// Entity Framework configuration for DocumentChunk entity
/// </summary>
public class DocumentChunkConfiguration : IEntityTypeConfiguration<DocumentChunk>
{
    public void Configure(EntityTypeBuilder<DocumentChunk> builder)
    {
        builder.ToTable("document_chunks");

        builder.HasKey(dc => dc.Id);

        builder.Property(dc => dc.Content)
            .IsRequired();

        builder.Property(dc => dc.VectorId)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(dc => dc.Metadata)
            .HasColumnType("jsonb");

        // Relationships
        builder.HasOne(dc => dc.Document)
            .WithMany(d => d.Chunks)
            .HasForeignKey(dc => dc.DocumentId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(dc => dc.DocumentId)
            .HasDatabaseName("idx_document_chunks_document_id");

        builder.HasIndex(dc => dc.VectorId)
            .IsUnique()
            .HasDatabaseName("idx_document_chunks_vector_id");

        builder.HasIndex(dc => new { dc.DocumentId, dc.ChunkIndex })
            .HasDatabaseName("idx_document_chunks_document_index");
    }
}

