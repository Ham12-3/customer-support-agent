using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.RateLimiting;
using CustomerSupport.Api.Middleware;
using CustomerSupport.Api.Mapping;
using CustomerSupport.Api.Workers;
using CustomerSupport.Api.Validators.Auth;
using CustomerSupport.Api.Filters;
using CustomerSupport.Core.Interfaces;
using CustomerSupport.Core.Options;
using CustomerSupport.Infrastructure.Data;
using CustomerSupport.Infrastructure.Repositories;
using CustomerSupport.Infrastructure.Services;
using DnsClient;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });
builder.Services.AddEndpointsApiExplorer();

// FluentValidation configuration
builder.Services
    .AddFluentValidationAutoValidation()
    .AddFluentValidationClientsideAdapters();

builder.Services.AddValidatorsFromAssemblyContaining<RegisterDtoValidator>();

// AutoMapper configuration
builder.Services.AddAutoMapper(typeof(ApiMappingProfile));

// Options
builder.Services.Configure<RefreshTokenOptions>(builder.Configuration.GetSection("RefreshTokens"));

// Rate limiting configuration
var isDevelopment = builder.Environment.IsDevelopment();
builder.Services.AddRateLimiter(options =>
{
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
    {
        var path = context.Request.Path.Value?.ToLower() ?? "";
        var ipAddress = context.Connection.RemoteIpAddress?.ToString() ?? "anonymous";
        
        // In development, use very lenient limits for auth endpoints to allow testing
        // In production, maintain security with reasonable limits
        if (path.Contains("/api/auth/login") || 
            path.Contains("/api/auth/register") || 
            path.Contains("/api/auth/refresh"))
        {
            return RateLimitPartition.GetFixedWindowLimiter(ipAddress, _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = isDevelopment ? 100 : 10, // Very high in dev (100/min), normal in production (10/min)
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                AutoReplenishment = true
            });
        }

        // Standard rate limiting for other endpoints
        var isAuthenticated = context.User?.Identity?.IsAuthenticated == true;
        var partitionKey = isAuthenticated
            ? context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "authenticated"
            : ipAddress;

        // Higher limits in development for easier testing
        var permitLimit = isDevelopment 
            ? (isAuthenticated ? 1000 : 500) // Very high in development for testing
            : (isAuthenticated ? 100 : 30);  // Normal in production

        return RateLimitPartition.GetFixedWindowLimiter(partitionKey, _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = permitLimit,
            Window = TimeSpan.FromMinutes(1),
            QueueLimit = 0,
            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
            AutoReplenishment = true
        });
    });

    // Chat endpoint specific rate limiting (costs money via Gemini API)
    options.AddFixedWindowLimiter("chat", options =>
    {
        options.PermitLimit = isDevelopment ? 100 : 20; // 20 messages per minute in production
        options.Window = TimeSpan.FromMinutes(1);
        options.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        options.QueueLimit = 0;
        options.AutoReplenishment = true;
    });

    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.ContentType = "application/json";
        var payload = JsonSerializer.Serialize(new
        {
            error = "Too many requests. Please wait a moment and try again.",
            retryAfter = "Wait 1 minute before trying again."
        });

        await context.HttpContext.Response.WriteAsync(payload, token);
    };
});

// Configure Swagger/OpenAPI
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Customer Support Agent API",
        Version = "v1",
        Description = "Enterprise AI Customer Support & Sales Agent Platform API"
    });

    // Add JWT authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });

    // Ignore schema conflicts
    c.CustomSchemaIds(type => type.FullName);

    // Support file uploads
    c.OperationFilter<FileUploadOperationFilter>();
});

// Configure Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(connectionString);
});

// Configure JWT Authentication
var jwtSecret = builder.Configuration["JWT:Secret"]
    ?? throw new InvalidOperationException("JWT Secret is not configured");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        ValidAudience = builder.Configuration["JWT:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                builder.Configuration.GetSection("CORS:Origins").Get<string[]>() 
                ?? new[] { "http://localhost:3000", "http://localhost:3001" }
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// Register Unit of Work
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Register repositories
builder.Services.AddScoped<IDomainRepository, DomainRepository>();

// Register services
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

// Add Redis cache (optional for now)
var redisConnection = builder.Configuration.GetConnectionString("Redis");
if (!string.IsNullOrEmpty(redisConnection))
{
    builder.Services.AddStackExchangeRedisCache(options =>
    {
        options.Configuration = redisConnection;
    });
}
builder.Services.AddSingleton<IGeminiService, GeminiService>();
builder.Services.AddSingleton<ILookupClient>(_ => new LookupClient());
builder.Services.AddHostedService<DomainVerificationWorker>();

var app = builder.Build();

// Check database in development environment
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        try
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            
            // Just check if database is empty and notify user
            var hasUsers = await dbContext.Users.AnyAsync();
            if (!hasUsers)
            {
                Log.Warning("⚠️  Database is empty! No users found.");
                Log.Information("💡 Create an account via: POST /api/auth/register");
                Log.Information("💡 Or use the frontend at: http://localhost:3000/register");
            }
            else
            {
                var userCount = await dbContext.Users.CountAsync();
                Log.Information("✅ Database initialized with {UserCount} user(s)", userCount);
            }
        }
        catch (Exception ex)
        {
            Log.Error(ex, "An error occurred during database check");
        }
    }
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Customer Support Agent API v1");
    });
}

app.UseSerilogRequestLogging();

app.UseGlobalExceptionHandling();

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Health check endpoint
app.MapGet("/health", () => Results.Ok(new
{
    status = "healthy",
    timestamp = DateTime.UtcNow
}));

try
{
    Log.Information("Starting Customer Support Agent API");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}

