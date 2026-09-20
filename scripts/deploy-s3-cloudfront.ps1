# Plazr AWS S3 + CloudFront Deployment Automation Script
# Usage: .\scripts\deploy-s3-cloudfront.ps1 [-BucketName plazr-app-<unique>] [-Region eu-west-1]

param(
    [string]$BucketName = "",
    [string]$Region = "eu-west-1"
)

$ErrorActionPreference = "Stop"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   PLAZR - AWS S3 + CLOUDFRONT DEPLOYMENT        " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Check AWS CLI
Write-Host "`n[1/6] Checking AWS CLI installation..." -ForegroundColor Yellow
if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
    Write-Error "AWS CLI is not installed or not in PATH. Please install it from https://aws.amazon.com/cli/"
    exit 1
}
$awsVersion = (aws --version)
Write-Host "[OK] AWS CLI found: $awsVersion" -ForegroundColor Green

# 2. Check AWS Authentication
Write-Host "`n[2/6] Verifying AWS credentials..." -ForegroundColor Yellow
$callerIdentityJson = & cmd.exe /c "aws sts get-caller-identity --output json 2>nul"
if ($LASTEXITCODE -ne 0 -or -not $callerIdentityJson) {
    Write-Host "`n[!] AWS credentials are not configured yet." -ForegroundColor Red
    Write-Host "Please configure your credentials by running:" -ForegroundColor Yellow
    Write-Host "    aws configure" -ForegroundColor White
    exit 1
}

$callerIdentity = $callerIdentityJson | ConvertFrom-Json
$accountId = $callerIdentity.Account
Write-Host "[OK] Authenticated as: $($callerIdentity.Arn)" -ForegroundColor Green

if (-not $BucketName) {
    $BucketName = "plazr-market-platform-$accountId"
}

# 3. Build Production Bundle
Write-Host "`n[3/6] Building production bundle (npm run build)..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed. Please check build errors above."
    exit 1
}
Write-Host "[OK] Vite production build completed in ./dist" -ForegroundColor Green

# 4. Check or Create S3 Bucket
Write-Host "`n[4/6] Configuring S3 Bucket ('$BucketName')..." -ForegroundColor Yellow
$bucketExists = & cmd.exe /c "aws s3api head-bucket --bucket $BucketName 2>nul"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Creating S3 bucket '$BucketName'..." -ForegroundColor Gray
    if ($Region -eq "us-east-1") {
        aws s3api create-bucket --bucket $BucketName --region $Region | Out-Null
    } else {
        aws s3api create-bucket --bucket $BucketName --region $Region --create-bucket-configuration LocationConstraint=$Region | Out-Null
    }
    Write-Host "[OK] Bucket created: $BucketName" -ForegroundColor Green
} else {
    Write-Host "[OK] S3 Bucket exists: $BucketName" -ForegroundColor Green
}

# 5. Sync dist to S3
Write-Host "`n[5/6] Syncing dist/ files to S3 bucket..." -ForegroundColor Yellow
aws s3 sync dist/ "s3://$BucketName" --delete --region $Region
Write-Host "[OK] Files synced to S3." -ForegroundColor Green

# 6. Check or Create CloudFront Distribution
Write-Host "`n[6/6] Checking CloudFront distribution..." -ForegroundColor Yellow
$cfListJson = (aws cloudfront list-distributions --output json) | ConvertFrom-Json
$existingDist = $cfListJson.DistributionList.Items | Where-Object { $_.Origins.Items[0].DomainName -like "*$BucketName*" }

if ($existingDist) {
    $distId = $existingDist.Id
    $domainName = $existingDist.DomainName
    Write-Host "[OK] Existing CloudFront distribution found: $distId ($domainName)" -ForegroundColor Green
    Write-Host "Creating CloudFront cache invalidation..." -ForegroundColor Gray
    aws cloudfront create-invalidation --distribution-id $distId --paths "/*" | Out-Null
    Write-Host "[OK] Cache invalidation triggered." -ForegroundColor Green
} else {
    Write-Host "Note: To create a new CloudFront distribution with Origin Access Control (OAC), see AWS console or run CloudFront wizard." -ForegroundColor Yellow
    $domainName = "$BucketName.s3-website-$Region.amazonaws.com"
}

$liveUrl = "https://$domainName"
Write-Host "`n==================================================" -ForegroundColor Green
Write-Host "   DEPLOYMENT COMPLETE!                          " -ForegroundColor Green
Write-Host "   Target URL: $liveUrl                          " -ForegroundColor White
Write-Host "==================================================" -ForegroundColor Green