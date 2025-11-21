namespace CustomerSupport.Core.Entities;

/// <summary>
/// Represents a chunk of text from a document with its embedding
/// </summary>
public class DocumentChunk : BaseEntity
{
    public Guid DocumentId { get; set; }

    public string Content { get; set; } = string.Empty;

    public int ChunkIndex { get; set; }

    public int StartPosition { get; set; }

    public int EndPosition { get; set; }

    public string VectorId { get; set; } = string.Empty; // ID in vector store

    public string? Metadata { get; set; } // JSON metadata

    // Navigation properties
    public Document Document { get; set; } = null!;
}

