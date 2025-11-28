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
    /// Get all documents for the current tenant, optionally filtered by domain
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<DocumentListDto>> GetDocuments(
        [FromQuery] Guid? domainId = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var tenantId = GetTenantIdFromClaims();
        
        var allDocuments = await _unitOfWork.Documents.GetAllAsync();
        var tenantDocuments = allDocuments
            .Where(d => ((Document)d).TenantId == tenantId)
            .Cast<Document>();

        // Filter by domain if specified
        if (domainId.HasValue)
        {
            tenantDocuments = tenantDocuments.Where(d => d.DomainId == domainId.Value);
        }

        var orderedDocuments = tenantDocuments
            .OrderByDescending(d => d.CreatedAt)
            .ToList();

        var totalCount = orderedDocuments.Count;
        var pagedDocuments = orderedDocuments
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
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<DocumentResponseDto>> UploadDocument(
        [FromForm] CustomerSupport.Api.DTOs.UploadDocumentRequest request)
    {
        try
        {
            if (request.File == null && string.IsNullOrEmpty(request.SourceUrl))
            {
                return BadRequest("Either a file or source URL must be provided.");
            }

            if (string.IsNullOrEmpty(request.Title))
            {
                return BadRequest("Title is required.");
            }

            var tenantId = GetTenantIdFromClaims();

            // Verify domain belongs to tenant if specified
            if (request.DomainId.HasValue)
            {
                var domain = await _unitOfWork.Domains.GetByIdAsync(request.DomainId.Value);
                if (domain == null || domain.TenantId != tenantId)
                {
                    return BadRequest("Invalid domain specified.");
                }
            }

            string? filePath = null;
            long? fileSize = null;
            string? fileType = null;
            string contentHash = string.Empty;

            // Handle file upload
            if (request.File != null)
            {
                fileSize = request.File.Length;
                fileType = Path.GetExtension(request.File.FileName).TrimStart('.');
                
                // Create uploads directory if it doesn't exist
                var uploadsDir = Path.Combine(_environment.ContentRootPath, "uploads", tenantId.ToString());
                Directory.CreateDirectory(uploadsDir);

                // Generate unique filename
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(request.File.FileName)}";
                filePath = Path.Combine(uploadsDir, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await request.File.CopyToAsync(stream);
                }

                // Calculate content hash
                contentHash = await CalculateFileHashAsync(filePath);
            }
            else if (!string.IsNullOrEmpty(request.SourceUrl))
            {
                // For URL-based documents, use URL as hash
                contentHash = ComputeHash(request.SourceUrl);
                fileType = "url";
            }

            // Create document entity
            var document = new Document
            {
                TenantId = tenantId,
                DomainId = request.DomainId,
                Title = request.Title,
                SourceUrl = request.SourceUrl,
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
                "Document uploaded: {DocumentId} for tenant {TenantId}, domain {DomainId}",
                document.Id, tenantId, request.DomainId);

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
            DomainId = document.DomainId,
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

