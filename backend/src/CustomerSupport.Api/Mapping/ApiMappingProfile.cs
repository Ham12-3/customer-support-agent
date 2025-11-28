using AutoMapper;
using CustomerSupport.Core.DTOs.Auth;
using CustomerSupport.Core.Entities;

namespace CustomerSupport.Api.Mapping;

/// <summary>
/// Central AutoMapper profile for API DTO mappings.
/// </summary>
public class ApiMappingProfile : Profile
{
    public ApiMappingProfile()
    {
        CreateMap<User, UserDto>()
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()))
            .ForMember(dest => dest.TenantName, opt => opt.MapFrom(src => src.Tenant.Name));
    }
}


