using CustomerSupport.Core.Enums;

namespace CustomerSupport.Core.Entities;

/// <summary>
/// Represents a document uploaded to the knowledge base
/// </summary>
public class Document : BaseEntity
{
    public Guid TenantId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? SourceUrl { get; set; }

    public string? FileType { get; set; } // pdf, docx, txt, url

    public long? FileSizeBytes { get; set; }

    public string ContentHash { get; set; } = string.Empty;

    public DocumentStatus Status { get; set; } = DocumentStatus.Processing;

    public string? BlobStoragePath { get; set; }

    public int ChunkCount { get; set; } = 0;

    public DateTime? ProcessedAt { get; set; }

    public string? ErrorMessage { get; set; }

    // Navigation properties
    public Tenant Tenant { get; set; } = null!;
    public ICollection<DocumentChunk> Chunks { get; set; } = new List<DocumentChunk>();
}

