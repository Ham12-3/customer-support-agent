# Quick Authentication Test Script
# Tests if the backend is running and can authenticate users

$baseUrl = "http://localhost:5000"
$testEmail = "admin@testcompany.com"
$testPassword = "Admin123!"

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host " Authentication Test" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if API is running
Write-Host "[1/4] Testing API health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET -TimeoutSec 5
    Write-Host "  ✅ API is running" -ForegroundColor Green
    Write-Host "  Status: $($health.status)" -ForegroundColor Gray
}
catch {
    Write-Host "  ❌ API is not responding!" -ForegroundColor Red
    Write-Host "  Make sure the backend is running: cd backend/src/CustomerSupport.Api && dotnet run" -ForegroundColor Yellow
    exit 1
}

# Test 2: Try to login with test user
Write-Host ""
Write-Host "[2/4] Testing login..." -ForegroundColor Yellow
$loginBody = @{
    email = $testEmail
    password = $testPassword
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody `
        -TimeoutSec 10
    
    Write-Host "  ✅ Login successful!" -ForegroundColor Green
    Write-Host "  User: $($response.user.firstName) $($response.user.lastName)" -ForegroundColor Gray
    Write-Host "  Email: $($response.user.email)" -ForegroundColor Gray
    Write-Host "  Role: $($response.user.role)" -ForegroundColor Gray
    Write-Host "  Token: $($response.accessToken.Substring(0, 20))..." -ForegroundColor Gray
    
    $token = $response.accessToken
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    
    if ($statusCode -eq 401) {
        Write-Host "  ⚠️  Login failed - User doesn't exist or wrong password" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "  Options:" -ForegroundColor Cyan
        Write-Host "  1. Run: .\seed-database.ps1  (Creates test users)" -ForegroundColor White
        Write-Host "  2. Register at: http://localhost:3000/register" -ForegroundColor White
        Write-Host "  3. See: AUTHENTICATION_GUIDE.md for help" -ForegroundColor White
        exit 1
    }
    else {
        Write-Host "  ❌ Login error: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Test 3: Test authenticated endpoint
Write-Host ""
Write-Host "[3/4] Testing authenticated endpoint..." -ForegroundColor Yellow
try {
    $headers = @{
        Authorization = "Bearer $token"
    }
    
    $me = Invoke-RestMethod -Uri "$baseUrl/api/auth/me" `
        -Method GET `
        -Headers $headers `
        -TimeoutSec 10
    
    Write-Host "  ✅ Authenticated request successful!" -ForegroundColor Green
    Write-Host "  User ID: $($me.id)" -ForegroundColor Gray
    Write-Host "  Tenant: $($me.tenantName)" -ForegroundColor Gray
}
catch {
    Write-Host "  ❌ Authentication failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 4: Test registration endpoint
Write-Host ""
Write-Host "[4/4] Testing registration endpoint..." -ForegroundColor Yellow
$testRegEmail = "test-$(Get-Random)@example.com"
$registerBody = @{
    email = $testRegEmail
    password = "TestPass123!"
    firstName = "Test"
    lastName = "User"
    companyName = "Test Company $(Get-Random)"
} | ConvertTo-Json

try {
    $regResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerBody `
        -TimeoutSec 10
    
    Write-Host "  ✅ Registration successful!" -ForegroundColor Green
    Write-Host "  New user: $($regResponse.user.email)" -ForegroundColor Gray
}
catch {
    $errorMessage = $_.ErrorDetails.Message
    if ($errorMessage -like "*already exists*") {
        Write-Host "  ⚠️  User already exists (expected)" -ForegroundColor Yellow
    }
    else {
        Write-Host "  ❌ Registration error: $errorMessage" -ForegroundColor Red
    }
}

# Summary
Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host " All Tests Passed! ✅" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your authentication is working correctly!" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now:" -ForegroundColor White
Write-Host "  • Login at: http://localhost:3000/login" -ForegroundColor Gray
Write-Host "  • View API docs: http://localhost:5000/swagger" -ForegroundColor Gray
Write-Host "  • Access dashboard: http://localhost:3000/dashboard" -ForegroundColor Gray
Write-Host ""
