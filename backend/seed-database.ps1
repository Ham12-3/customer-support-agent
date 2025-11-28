#!/usr/bin/env pwsh
# Database Seeding Script for Customer Support Agent
# This script provides utilities to manage test users in the database

param(
    [Parameter(Position=0)]
    [ValidateSet("seed", "clear", "list", "delete", "reset")]
    [string]$Action = "seed",
    
    [Parameter(Position=1)]
    [string]$Email = ""
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host " Database Management Tool" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "src/CustomerSupport.Api/CustomerSupport.Api.csproj")) {
    Write-Host "❌ Error: Please run this script from the backend directory!" -ForegroundColor Red
    Write-Host "   Current location: $PWD" -ForegroundColor Yellow
    Write-Host "   Expected: .../customer-support-agent/backend" -ForegroundColor Yellow
    exit 1
}

# Build the code snippet to execute
$codeToRun = switch ($Action) {
    "seed" {
        "await DatabaseSeeder.SeedTestUserAsync(context);"
    }
    "clear" {
        @"
Console.WriteLine("⚠️  WARNING: This will delete ALL users and tenants!");
Console.Write("Are you sure? (yes/no): ");
var confirm = Console.ReadLine();
if (confirm?.ToLower() == "yes") {
    await DatabaseSeeder.ClearUsersAsync(context);
} else {
    Console.WriteLine("❌ Operation cancelled.");
}
"@
    }
    "list" {
        "await DatabaseSeeder.ListUsersAsync(context);"
    }
    "delete" {
        if ([string]::IsNullOrWhiteSpace($Email)) {
            Write-Host "❌ Error: Email parameter is required for delete action" -ForegroundColor Red
            Write-Host "   Usage: .\seed-database.ps1 delete <email>" -ForegroundColor Yellow
            exit 1
        }
        "await DatabaseSeeder.DeleteUserByEmailAsync(context, `"$Email`");"
    }
    "reset" {
        @"
Console.WriteLine("⚠️  WARNING: This will delete all users and create a fresh test user!");
Console.Write("Are you sure? (yes/no): ");
var confirm = Console.ReadLine();
if (confirm?.ToLower() == "yes") {
    await DatabaseSeeder.ClearUsersAsync(context);
    await DatabaseSeeder.SeedTestUserAsync(context);
} else {
    Console.WriteLine("❌ Operation cancelled.");
}
"@
    }
}

# Create a temporary C# script
$tempScript = @"
using CustomerSupport.Api;
using CustomerSupport.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

var configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json")
    .AddJsonFile("appsettings.Development.json", optional: true)
    .Build();

var connectionString = configuration.GetConnectionString("DefaultConnection");

var options = new DbContextOptionsBuilder<AppDbContext>()
    .UseNpgsql(connectionString)
    .Options;

using var context = new AppDbContext(options);

// Ensure database is created
await context.Database.EnsureCreatedAsync();

$codeToRun

Console.WriteLine("");
Console.WriteLine("✅ Done!");
"@

# Save to temp file
$tempFile = [System.IO.Path]::GetTempFileName() + ".cs"
$tempScript | Out-File -FilePath $tempFile -Encoding UTF8

try {
    Write-Host "🔄 Executing $Action operation..." -ForegroundColor Yellow
    Write-Host ""
    
    # Run the script using dotnet-script
    $env:DOTNET_ENVIRONMENT = "Development"
    
    # Use dotnet run with a custom entry point
    dotnet run --project src/CustomerSupport.Api -- --seed-action $Action --seed-email $Email
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Operation completed successfully!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Operation failed!" -ForegroundColor Red
        exit 1
    }
}
finally {
    # Cleanup
    if (Test-Path $tempFile) {
        Remove-Item $tempFile -Force
    }
}

Write-Host ""

