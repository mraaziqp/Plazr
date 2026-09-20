# Plazr AWS Amplify Deployment Automation Script
# Usage: .\scripts\deploy-aws.ps1 [-Region eu-west-1] [-AppName Plazr]

param(
    [string]$Region = "eu-west-1",
    [string]$AppName = "Plazr"
)

$ErrorActionPreference = "Stop"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   PLAZR - AWS AMPLIFY PRODUCTION DEPLOYMENT     " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Check AWS CLI
Write-Host "`n[1/7] Checking AWS CLI installation..." -ForegroundColor Yellow
if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
    Write-Error "AWS CLI is not installed or not in PATH. Please install it from https://aws.amazon.com/cli/"
    exit 1
}
$awsVersion = (aws --version)
Write-Host "[OK] AWS CLI found: $awsVersion" -ForegroundColor Green

# 2. Check AWS Authentication
Write-Host "`n[2/7] Verifying AWS credentials..." -ForegroundColor Yellow
$callerIdentityJson = & cmd.exe /c "aws sts get-caller-identity --output json 2>nul"
if ($LASTEXITCODE -ne 0 -or -not $callerIdentityJson) {
    Write-Host "`n[!] AWS credentials are not configured yet." -ForegroundColor Red
    Write-Host "Please configure your credentials by running:" -ForegroundColor Yellow
    Write-Host "    aws configure" -ForegroundColor White
    Write-Host "Or by setting environment variables in your terminal:" -ForegroundColor Yellow
    Write-Host "    `$env:AWS_ACCESS_KEY_ID = 'YOUR_KEY'" -ForegroundColor White
    Write-Host "    `$env:AWS_SECRET_ACCESS_KEY = 'YOUR_SECRET'" -ForegroundColor White
    Write-Host "    `$env:AWS_DEFAULT_REGION = '$Region'" -ForegroundColor White
    exit 1
}

$callerIdentity = $callerIdentityJson | ConvertFrom-Json
Write-Host "[OK] Authenticated as: $($callerIdentity.Arn)" -ForegroundColor Green
Write-Host "     Account ID: $($callerIdentity.Account)" -ForegroundColor Gray

# 3. Read Environment Variables
Write-Host "`n[3/7] Reading environment variables..." -ForegroundColor Yellow
$envFile = if (Test-Path ".env.production") { ".env.production" } elseif (Test-Path ".env") { ".env" } else { $null }
$dbUrl = ""

if ($envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^\s*VITE_DATABASE_URL\s*=\s*[`"']?(.*?)[`"']?\s*$") {
            $dbUrl = $matches[1]
        }
    }
}

if (-not $dbUrl) {
    $dbUrl = "postgresql://neondb_owner:npg_OE1Xqvgy3bnD@ep-polished-night-za5la761.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require"
}
Write-Host "[OK] Neon Database URL loaded for VITE_DATABASE_URL" -ForegroundColor Green

# 4. Build Production Bundle
Write-Host "`n[4/7] Building production bundle (npm run build)..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed. Please check build errors above."
    exit 1
}
Write-Host "[OK] Vite production build completed in ./dist" -ForegroundColor Green

# Compress dist folder into dist.zip
Write-Host "Creating dist.zip artifact..." -ForegroundColor Gray
if (Test-Path "dist.zip") { Remove-Item "dist.zip" -Force }
Compress-Archive -Path dist\* -DestinationPath dist.zip -Force
$zipSizeKb = [math]::Round((Get-Item dist.zip).Length / 1KB, 1)
Write-Host "[OK] Deployment bundle created: dist.zip ($zipSizeKb KB)" -ForegroundColor Green

# 5. Check or Create AWS Amplify App
Write-Host "`n[5/7] Configuring AWS Amplify App ($AppName)..." -ForegroundColor Yellow

$listAppsJson = (aws amplify list-apps --region $Region --output json) | ConvertFrom-Json
$existingApp = $listAppsJson.apps | Where-Object { $_.name -eq $AppName }

$appId = ""
$defaultDomain = ""

if ($existingApp) {
    $appId = $existingApp.appId
    $defaultDomain = $existingApp.defaultDomain
    Write-Host "[OK] Found existing Amplify App: $AppName (ID: $appId)" -ForegroundColor Green
    Write-Host "Updating environment variables in Amplify..." -ForegroundColor Gray
    aws amplify update-app --app-id $appId --environment-variables "VITE_DATABASE_URL=$dbUrl,DATABASE_URL=$dbUrl" --region $Region | Out-Null
} else {
    Write-Host "Creating new Amplify App: $AppName..." -ForegroundColor Gray
    $customRules = '[{\"source\":\"</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>\",\"target\":\"/index.html\",\"status\":\"200\"}]'
    $newAppJson = (aws amplify create-app --name $AppName --description "Plazr Street Market Platform" --environment-variables "VITE_DATABASE_URL=$dbUrl,DATABASE_URL=$dbUrl" --custom-rules $customRules --region $Region --output json) | ConvertFrom-Json
    $appId = $newAppJson.app.appId
    $defaultDomain = $newAppJson.app.defaultDomain
    Write-Host "[OK] Created Amplify App: $AppName (ID: $appId)" -ForegroundColor Green
}

# Ensure main branch exists
$branchesJson = (aws amplify list-branches --app-id $appId --region $Region --output json) | ConvertFrom-Json
$mainBranch = $branchesJson.branches | Where-Object { $_.branchName -eq "main" }

if (-not $mainBranch) {
    Write-Host "Creating main branch..." -ForegroundColor Gray
    aws amplify create-branch --app-id $appId --branch-name main --framework "React" --region $Region | Out-Null
    Write-Host "[OK] Created branch: main" -ForegroundColor Green
} else {
    Write-Host "[OK] Branch main exists" -ForegroundColor Green
}

# 6. Upload and Deploy Zip
Write-Host "`n[6/7] Creating and starting Amplify deployment..." -ForegroundColor Yellow
$deploymentJson = (aws amplify create-deployment --app-id $appId --branch-name main --region $Region --output json) | ConvertFrom-Json
$jobId = $deploymentJson.jobId
$zipUploadUrl = $deploymentJson.zipUploadUrl

Write-Host "Uploading dist.zip to AWS deployment endpoint..." -ForegroundColor Gray
if (Get-Command curl.exe -ErrorAction SilentlyContinue) {
    & curl.exe -H "Content-Type: application/zip" --upload-file dist.zip $zipUploadUrl
} else {
    Invoke-RestMethod -Uri $zipUploadUrl -Method Put -InFile "dist.zip" -Headers @{ "Content-Type" = "application/zip" }
}

Write-Host "Starting deployment job $jobId..." -ForegroundColor Gray
aws amplify start-deployment --app-id $appId --branch-name main --job-id $jobId --region $Region | Out-Null

Write-Host "Waiting for deployment to complete..." -ForegroundColor Gray
$status = "PENDING"
$maxAttempts = 30
$attempt = 0

while ($status -notin @("SUCCEED", "FAILED") -and $attempt -lt $maxAttempts) {
    Start-Sleep -Seconds 4
    $attempt++
    $jobJson = (aws amplify get-job --app-id $appId --branch-name main --job-id $jobId --region $Region --output json) | ConvertFrom-Json
    $status = $jobJson.job.summary.status
    Write-Host "  Status: $status ($attempt/$maxAttempts)..." -ForegroundColor Gray
}

if ($status -ne "SUCCEED") {
    Write-Error "Deployment did not succeed. Final status: $status"
    exit 1
}
Write-Host "[OK] Deployment SUCCEEDED!" -ForegroundColor Green

# 7. Live Link & Health Check
$liveUrl = "https://main.$defaultDomain"
Write-Host "`n[7/7] Testing live application link..." -ForegroundColor Yellow
Write-Host "Live URL: $liveUrl" -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri $liveUrl -UseBasicParsing -TimeoutSec 15
    if ($response.StatusCode -eq 200) {
        Write-Host "[OK] Live Health Check: HTTP 200 OK! Plazr is live on AWS." -ForegroundColor Green
    } else {
        Write-Host "[!] Live URL returned status: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Note: CloudFront / DNS provisioning may take 1-2 minutes for new Amplify domains. You can verify at: $liveUrl" -ForegroundColor Yellow
}

Write-Host "`n==================================================" -ForegroundColor Green
Write-Host "   DEPLOYMENT COMPLETE!                          " -ForegroundColor Green
Write-Host "   Live AWS Link: $liveUrl                       " -ForegroundColor White
Write-Host "==================================================" -ForegroundColor Green
