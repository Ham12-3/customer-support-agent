using CustomerSupport.Core.DTOs.Document;
using CustomerSupport.Core.Entities;
using CustomerSupport.Core.Enums;
using CustomerSupport.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;

namespace CustomerSupport.Api.Controllers;

/// <summary>
/// Controller for managing knowledge base documents
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DocumentsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<DocumentsController> _logger;

    public DocumentsController(
        IUnitOfWork unitOfWork,
        IWebHostEnvironment environment,
        ILogger<DocumentsController> logger)
    {
        _unitOfWork = unitOfWork;
        _environment = environment;
        _logger = logger;
    }

    /// <summary>
    /// Get all documents for the current tenant
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<DocumentListDto>> GetDocuments(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var tenantId = GetTenantIdFromClaims();
        
        var allDocuments = await _unitOfWork.Documents.GetAllAsync();
        var tenantDocuments = allDocuments
            .Where(d => ((Document)d).TenantId == tenantId)
            .Cast<Document>()
            .OrderByDescending(d => d.CreatedAt)
            .ToList();

        var totalCount = tenantDocuments.Count;
        var pagedDocuments = tenantDocuments
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(MapToDocumentResponse)
            .ToList();

        return Ok(new DocumentListDto
        {
            Items = pagedDocuments,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        });
    }

    /// <summary>
    /// Get a specific document by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<DocumentResponseDto>> GetDocument(Guid id)
    {
        var document = await _unitOfWork.Documents.GetByIdAsync(id);
        if (document == null)
            return NotFound();

        var doc = (Document)document;
        if (doc.TenantId != GetTenantIdFromClaims())
            return Forbid();

        return Ok(MapToDocumentResponse(doc));
    }

   /// <summary>
/// Upload a new document to the knowledge base
/// </summary>
[HttpPost("upload")]
public async Task<ActionResult<DocumentResponseDto>> UploadDocument(
    [FromForm] IFormFile? file,
    [FromForm] string title,
    [FromForm] string? sourceUrl)
{
    try
    {
        if (file == null && string.IsNullOrEmpty(sourceUrl))
        {
            return BadRequest("Either a file or source URL must be provided.");
        }

        if (string.IsNullOrEmpty(title))
        {
            return BadRequest("Title is required.");
        }

        var tenantId = GetTenantIdFromClaims();
        string? filePath = null;
        long? fileSize = null;
        string? fileType = null;
        string contentHash = string.Empty;

        // Handle file upload
        if (file != null)
        {
            fileSize = file.Length;
            fileType = Path.GetExtension(file.FileName).TrimStart('.');
            
            // Create uploads directory if it doesn't exist
            var uploadsDir = Path.Combine(_environment.ContentRootPath, "uploads", tenantId.ToString());
            Directory.CreateDirectory(uploadsDir);

            // Generate unique filename
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            filePath = Path.Combine(uploadsDir, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Calculate content hash
            contentHash = await CalculateFileHashAsync(filePath);
        }
        else if (!string.IsNullOrEmpty(sourceUrl))
        {
            // For URL-based documents, use URL as hash
            contentHash = ComputeHash(sourceUrl);
            fileType = "url";
        }

        // Create document entity
        var document = new Document
        {
            TenantId = tenantId,
            Title = title,
            SourceUrl = sourceUrl,
            FileType = fileType,
            FileSizeBytes = fileSize,
            ContentHash = contentHash,
            BlobStoragePath = filePath,
            Status = DocumentStatus.Processing,
            ChunkCount = 0
        };

        await _unitOfWork.Documents.AddAsync(document);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation(
            "Document uploaded: {DocumentId} for tenant {TenantId}",
            document.Id, tenantId);

        // TODO: Trigger background processing to chunk and vectorize the document
        
        return CreatedAtAction(
            nameof(GetDocument),
            new { id = document.Id },
            MapToDocumentResponse(document));
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error uploading document");
        return StatusCode(500, "An error occurred while uploading the document.");
    }
}
    /// <summary>
    /// Delete a document
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDocument(Guid id)
    {
        var document = await _unitOfWork.Documents.GetByIdAsync(id);
        if (document == null)
            return NotFound();

        var doc = (Document)document;
        if (doc.TenantId != GetTenantIdFromClaims())
            return Forbid();

        // Delete physical file if exists
        if (!string.IsNullOrEmpty(doc.BlobStoragePath) && System.IO.File.Exists(doc.BlobStoragePath))
        {
            try
            {
                System.IO.File.Delete(doc.BlobStoragePath);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to delete physical file: {FilePath}", doc.BlobStoragePath);
            }
        }

        await _unitOfWork.Documents.DeleteAsync(id);
        await _unitOfWork.SaveChangesAsync();

        return NoContent();
    }

    // Helper methods

    private Guid GetTenantIdFromClaims()
    {
        var tenantIdClaim = User.FindFirst("TenantId")?.Value;
        if (string.IsNullOrEmpty(tenantIdClaim))
            throw new UnauthorizedAccessException("Tenant ID not found in claims");
        
        return Guid.Parse(tenantIdClaim);
    }

    private DocumentResponseDto MapToDocumentResponse(Document document)
    {
        return new DocumentResponseDto
        {
            Id = document.Id,
            Title = document.Title,
            SourceUrl = document.SourceUrl,
            FileType = document.FileType,
            FileSizeBytes = document.FileSizeBytes,
            Status = document.Status.ToString(),
            ChunkCount = document.ChunkCount,
            CreatedAt = document.CreatedAt,
            ProcessedAt = document.ProcessedAt,
            ErrorMessage = document.ErrorMessage
        };
    }

    private async Task<string> CalculateFileHashAsync(string filePath)
    {
        using var sha256 = SHA256.Create();
        using var stream = System.IO.File.OpenRead(filePath);
        var hashBytes = await sha256.ComputeHashAsync(stream);
        return Convert.ToHexString(hashBytes);
    }

    private string ComputeHash(string input)
    {
        using var sha256 = SHA256.Create();
        var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(hashBytes);
    }
}

