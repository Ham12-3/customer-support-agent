using CustomerSupport.Core.DTOs.Conversation;
using CustomerSupport.Core.Entities;
using CustomerSupport.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CustomerSupport.Api.Controllers;

/// <summary>
/// Controller for managing conversations
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ConversationsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ConversationsController> _logger;

    public ConversationsController(
        IUnitOfWork unitOfWork,
        ILogger<ConversationsController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    /// <summary>
    /// Get all conversations for the current tenant with filtering
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ConversationListDto>> GetConversations(
        [FromQuery] ConversationFilterDto filter)
    {
        var tenantId = GetTenantIdFromClaims();

        var allConversations = await _unitOfWork.Conversations.GetAllAsync();
        var tenantConversations = allConversations
            .Cast<Conversation>()
            .Where(c => c.TenantId == tenantId)
            .AsQueryable();

        // Apply filters
        if (filter.DomainId.HasValue)
        {
            tenantConversations = tenantConversations.Where(c => c.DomainId == filter.DomainId.Value);
        }

        if (!string.IsNullOrEmpty(filter.Status))
        {
            tenantConversations = tenantConversations.Where(c => c.Status.ToString() == filter.Status);
        }

        if (filter.IsEscalated.HasValue)
        {
            tenantConversations = tenantConversations.Where(c => c.IsEscalated == filter.IsEscalated.Value);
        }

        if (filter.FromDate.HasValue)
        {
            tenantConversations = tenantConversations.Where(c => c.CreatedAt >= filter.FromDate.Value);
        }

        if (filter.ToDate.HasValue)
        {
            tenantConversations = tenantConversations.Where(c => c.CreatedAt <= filter.ToDate.Value);
        }

        var conversations = tenantConversations
            .OrderByDescending(c => c.CreatedAt)
            .ToList();

        var totalCount = conversations.Count;
        var pagedConversations = conversations
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToList();

        // Get domains for mapping
        var allDomains = await _unitOfWork.Domains.GetAllAsync();
        var domains = allDomains.Cast<Domain>().ToList();

        var result = new ConversationListDto
        {
            Items = pagedConversations.Select(c => MapToConversationResponse(c, domains)).ToList(),
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize
        };

        return Ok(result);
    }

    /// <summary>
    /// Get a specific conversation by ID with all messages
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ConversationResponseDto>> GetConversation(Guid id)
    {
        var conversation = await _unitOfWork.Conversations.GetByIdAsync(id);
        if (conversation == null)
            return NotFound();

        var conv = (Conversation)conversation;
        if (conv.TenantId != GetTenantIdFromClaims())
            return Forbid();

        // Load messages
        var allMessages = await _unitOfWork.Messages.GetAllAsync();
        var messages = allMessages
            .Cast<Message>()
            .Where(m => m.ConversationId == id)
            .OrderBy(m => m.CreatedAt)
            .ToList();

        // Get domain info
        var domain = await _unitOfWork.Domains.GetByIdAsync(conv.DomainId);
        var allDomains = domain != null ? new List<Domain> { (Domain)domain } : new List<Domain>();

        var response = MapToConversationResponse(conv, allDomains);
        response.Messages = messages.Select(MapToMessageDto).ToList();

        return Ok(response);
    }

    /// <summary>
    /// Update conversation status (e.g., escalate, close)
    /// </summary>
    [HttpPatch("{id}")]
    public async Task<ActionResult<ConversationResponseDto>> UpdateConversation(
        Guid id,
        [FromBody] UpdateConversationDto dto)
    {
        var conversation = await _unitOfWork.Conversations.GetByIdAsync(id);
        if (conversation == null)
            return NotFound();

        var conv = (Conversation)conversation;
        if (conv.TenantId != GetTenantIdFromClaims())
            return Forbid();

        // Update fields
        if (dto.Status.HasValue)
        {
            conv.Status = dto.Status.Value;
            if (dto.Status.Value == Core.Enums.ConversationStatus.Closed)
            {
                conv.EndedAt = DateTime.UtcNow;
            }
        }

        if (dto.IsEscalated.HasValue)
        {
            conv.IsEscalated = dto.IsEscalated.Value;
        }

        await _unitOfWork.Conversations.UpdateAsync(conv);
        await _unitOfWork.SaveChangesAsync();

        var allDomains = await _unitOfWork.Domains.GetAllAsync();
        var domains = allDomains.Cast<Domain>().ToList();

        return Ok(MapToConversationResponse(conv, domains));
    }

    /// <summary>
    /// Delete a conversation
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteConversation(Guid id)
    {
        var conversation = await _unitOfWork.Conversations.GetByIdAsync(id);
        if (conversation == null)
            return NotFound();

        var conv = (Conversation)conversation;
        if (conv.TenantId != GetTenantIdFromClaims())
            return Forbid();

        await _unitOfWork.Conversations.DeleteAsync(id);
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

    private ConversationResponseDto MapToConversationResponse(Conversation conversation, List<Domain> domains)
    {
        var domain = domains.FirstOrDefault(d => d.Id == conversation.DomainId);

        return new ConversationResponseDto
        {
            Id = conversation.Id,
            TenantId = conversation.TenantId,
            DomainId = conversation.DomainId,
            DomainUrl = domain?.DomainUrl ?? "Unknown",
            SessionId = conversation.SessionId,
            CustomerEmail = conversation.CustomerEmail,
            CustomerName = conversation.CustomerName,
            Status = conversation.Status.ToString(),
            IsEscalated = conversation.IsEscalated,
            AssignedAgentName = conversation.AssignedAgent?.FirstName + " " + conversation.AssignedAgent?.LastName,
            MessageCount = conversation.MessageCount,
            CreatedAt = conversation.CreatedAt,
            EndedAt = conversation.EndedAt
        };
    }

    private MessageDto MapToMessageDto(Message message)
    {
        return new MessageDto
        {
            Id = message.Id,
            Role = message.Role.ToString(),
            Content = message.Content,
            ConfidenceScore = message.ConfidenceScore,
            IsFromHuman = message.IsFromHuman,
            CreatedAt = message.CreatedAt
        };
    }
}

/// <summary>
/// DTO for updating a conversation
/// </summary>
public class UpdateConversationDto
{
    public Core.Enums.ConversationStatus? Status { get; set; }
    public bool? IsEscalated { get; set; }
}

