
namespace CustomerSupport.Core.DTOs.Document;

/// <summary>
/// DTO for uploading a new document to the knowledge base
/// </summary>
public class UploadDocumentDto
{
    public string Title { get; set; } = string.Empty;
    public string? SourceUrl { get; set; }
    public string? FileType { get; set; }
    public byte[]? FileContent { get; set; }  // Changed from IFormFile
    public long? FileSizeBytes { get; set; }
}

/// <summary>
/// DTO for document response
/// </summary>
public class DocumentResponseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? SourceUrl { get; set; }
    public string? FileType { get; set; }
    public long? FileSizeBytes { get; set; }
    public string Status { get; set; } = string.Empty;
    public int ChunkCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ProcessedAt { get; set; }
    public string? ErrorMessage { get; set; }
}

/// <summary>
/// DTO for paginated documents list
/// </summary>
public class DocumentListDto
{
    public List<DocumentResponseDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}