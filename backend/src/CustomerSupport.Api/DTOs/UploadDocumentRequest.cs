using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace CustomerSupport.Api.DTOs;

public class UploadDocumentRequest
{
    public IFormFile? File { get; set; }
    
    [Required]
    public string Title { get; set; } = string.Empty;
    
    public string? SourceUrl { get; set; }
    
    public Guid? DomainId { get; set; }
}

