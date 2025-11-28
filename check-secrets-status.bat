@echo off
echo ========================================
echo Secret Files Status Check
echo ========================================
echo.

echo [CHECK 1] Is appsettings.json tracked by git?
echo ----------------------------------------
git ls-files | findstr /i "appsettings.json" >nul
if %errorlevel% == 0 (
    echo [BAD] appsettings.json IS tracked in git!
    echo        This means it will be pushed to GitHub!
    echo        ACTION: Run: git rm --cached backend\src\CustomerSupport.Api\appsettings.json
    set HAS_ERROR=1
) else (
    echo [GOOD] appsettings.json is NOT tracked
    echo        This means it will NOT be pushed to GitHub
)

echo.
echo [CHECK 2] Is appsettings.json staged for commit?
echo ----------------------------------------
git status --short | findstr /i "appsettings.json" >nul
if %errorlevel% == 0 (
    echo [BAD] appsettings.json IS staged for commit!
    echo        ACTION: Run: git reset HEAD backend\src\CustomerSupport.Api\appsettings.json
    set HAS_ERROR=1
) else (
    echo [GOOD] appsettings.json is NOT staged
    echo        This means it will NOT be committed
)

echo.
echo [CHECK 3] Does appsettings.Example.json exist?
echo ----------------------------------------
if exist "backend\src\CustomerSupport.Api\appsettings.Example.json" (
    echo [GOOD] appsettings.Example.json exists
    echo        This is the template file (safe to commit)
) else (
    echo [WARNING] appsettings.Example.json not found
    echo           You should create this file as a template
)

echo.
echo [CHECK 4] Does appsettings.json exist locally?
echo ----------------------------------------
if exist "backend\src\CustomerSupport.Api\appsettings.json" (
    echo [GOOD] appsettings.json exists locally
    echo        This file stays on your computer only
) else (
    echo [INFO] appsettings.json not found locally
    echo        You may need to create it from the example file
)

echo.
echo [CHECK 5] Is appsettings.json in .gitignore?
echo ----------------------------------------
findstr /i "appsettings.json" .gitignore >nul
if %errorlevel% == 0 (
    echo [GOOD] appsettings.json is in .gitignore
    echo        Git will ignore this file
) else (
    echo [BAD] appsettings.json is NOT in .gitignore!
    echo        ACTION: Add "**/appsettings.json" to .gitignore
    set HAS_ERROR=1
)

echo.
echo ========================================
if defined HAS_ERROR (
    echo [RESULT] PROBLEMS FOUND!
    echo Please fix the issues above before committing.
    echo ========================================
    exit /b 1
) else (
    echo [RESULT] ALL CHECKS PASSED!
    echo Your secrets are properly configured.
    echo appsettings.json will NOT be pushed to GitHub.
    echo ========================================
    exit /b 0
)

