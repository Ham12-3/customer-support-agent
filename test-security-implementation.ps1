# Test Security Implementation
# This script verifies that all security fixes are working

Write-Host "`n=== Testing Security Implementation ===" -ForegroundColor Cyan
Write-Host ""

$apiUrl = "http://localhost:5000"
$testsPassed = 0
$testsFailed = 0

# Test 1: Chat without API Key should fail
Write-Host "[Test 1] Chat without API Key (should fail)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$apiUrl/api/chat" `
        -Method POST `
        -ContentType "application/json" `
        -Body '{"message":"Hello","sessionId":"test123"}' `
        -ErrorAction Stop
    
    Write-Host "  ❌ FAILED - Should have returned 401" -ForegroundColor Red
    $testsFailed++
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "  ✅ PASSED - Correctly returned 401 Unauthorized" -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Host "  ❌ FAILED - Wrong error code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        $testsFailed++
    }
}

# Test 2: Verify User Secrets are set
Write-Host "`n[Test 2] Verify User Secrets are configured..." -ForegroundColor Yellow
cd backend/src/CustomerSupport.Api
$secrets = dotnet user-secrets list

if ($secrets -match "JWT:Secret" -and $secrets -match "Gemini:ApiKey") {
    Write-Host "  ✅ PASSED - User Secrets configured" -ForegroundColor Green
    $testsPassed++
} else {
    Write-Host "  ❌ FAILED - User Secrets not configured" -ForegroundColor Red
    $testsFailed++
}
cd ../../..

# Test 3: Check appsettings.json doesn't have hardcoded secrets
Write-Host "`n[Test 3] Verify appsettings.json has no hardcoded secrets..." -ForegroundColor Yellow
$appsettings = Get-Content "backend/src/CustomerSupport.Api/appsettings.json" -Raw

if ($appsettings -notmatch "AIzaSy" -and $appsettings -match "SET_VIA_USER_SECRETS") {
    Write-Host "  ✅ PASSED - No hardcoded secrets found" -ForegroundColor Green
    $testsPassed++
} else {
    Write-Host "  ❌ FAILED - Hardcoded secrets still present" -ForegroundColor Red
    $testsFailed++
}

# Test 4: Verify AllowDevBypass is set
Write-Host "`n[Test 4] Verify AllowDevBypass configuration..." -ForegroundColor Yellow
if ($appsettings -match '"AllowDevBypass"\s*:\s*false') {
    Write-Host "  ✅ PASSED - AllowDevBypass set to false in production" -ForegroundColor Green
    $testsPassed++
} else {
    Write-Host "  ❌ FAILED - AllowDevBypass not configured" -ForegroundColor Red
    $testsFailed++
}

# Summary
Write-Host "`n=== Test Summary ===" -ForegroundColor Cyan
Write-Host "Tests Passed: $testsPassed" -ForegroundColor Green
Write-Host "Tests Failed: $testsFailed" -ForegroundColor $(if ($testsFailed -gt 0) { "Red" } else { "Green" })
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "🎉 All tests passed! Security implementation is working." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Test with a valid API key from your database" -ForegroundColor White
    Write-Host "2. Try sending a chat message with proper authentication" -ForegroundColor White
    Write-Host "3. Review SECURITY_AUDIT_COMPLETE.md for remaining tasks" -ForegroundColor White
} else {
    Write-Host "⚠️  Some tests failed. Review the output above." -ForegroundColor Red
}

Write-Host ""

