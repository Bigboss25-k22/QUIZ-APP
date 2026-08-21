<#
.SYNOPSIS
    Automated Azure Infrastructure Provisioning for QUIZ-APP (quiz-api + quiz-web).
    Cost-optimized configuration: Scale-to-0, 0.25 vCPU, 0.5GiB RAM (Azure Free Tier Friendly).
    Uses Neon PostgreSQL (No Azure DB cost).
    Configures Passwordless GitHub Actions authentication via Azure OIDC.
#>

param (
    [string]$ResourceGroupName = "rg-quiz-app-prod",
    [string]$Location = "eastasia", # East Asia (or southeastasia: Singapore)
    [string]$AcrName = "crquizapp$((Get-Random -Minimum 1000 -Maximum 9999))",
    [string]$ContainerAppEnvName = "cae-quiz-app",
    [string]$GitHubRepo = "Bigboss25-k22/quiz-app" # Format: <github-username>/<repo-name>
)

$ErrorActionPreference = "Continue"
$ProgressPreference = "SilentlyContinue"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "AZURE INFRASTRUCTURE SETUP - COST OPTIMIZED (SCALE-TO-ZERO)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Check Azure CLI Login
Write-Host "`n[1/7] Checking Azure CLI authentication..." -ForegroundColor Yellow
$accountJson = az account show --only-show-errors 2>$null
if (-not $accountJson) {
    Write-Host "Error: You are not logged into Azure CLI. Please run 'az login' first!" -ForegroundColor Red
    exit 1
}
$account = $accountJson | ConvertFrom-Json
$subscriptionId = $account.id
$tenantId = $account.tenantId
Write-Host "Subscription: $($account.name) (ID: $subscriptionId)" -ForegroundColor Green

# 2. Register Required Resource Providers
Write-Host "`n[2/7] Registering required resource providers..." -ForegroundColor Yellow
az provider register --namespace Microsoft.OperationalInsights --wait --only-show-errors
az provider register --namespace Microsoft.App --wait --only-show-errors
az provider register --namespace Microsoft.ContainerRegistry --wait --only-show-errors
Write-Host "Resource providers registered successfully." -ForegroundColor Green

# 3. Create Resource Group
Write-Host "`n[3/7] Creating Resource Group '$ResourceGroupName' at '$Location'..." -ForegroundColor Yellow
az group create --name $ResourceGroupName --location $Location --output none --only-show-errors
Write-Host "Resource Group is ready." -ForegroundColor Green

# 4. Create or Reuse Azure Container Registry (ACR)
Write-Host "`n[4/7] Checking/Creating Azure Container Registry (ACR Basic)..." -ForegroundColor Yellow
$existingAcr = az acr list --resource-group $ResourceGroupName --query "[0].name" --output tsv --only-show-errors 2>$null
if ($existingAcr) {
    $AcrName = $existingAcr
    Write-Host "Reusing existing ACR: $AcrName" -ForegroundColor Cyan
} else {
    az acr create --resource-group $ResourceGroupName --name $AcrName --sku Basic --admin-enabled true --output none --only-show-errors
}
$acrLoginServer = (az acr show --name $AcrName --query loginServer --output tsv --only-show-errors 2>$null)
Write-Host "ACR Login Server: $acrLoginServer" -ForegroundColor Green

# Ensure Container Apps extension is installed
az extension add --name containerapp --upgrade --yes --only-show-errors 2>$null

# 5. Create or Reuse Azure Container Apps Environment
Write-Host "`n[5/7] Creating/Checking Container Apps Environment '$ContainerAppEnvName'..." -ForegroundColor Yellow
$existingEnv = az containerapp env list --resource-group $ResourceGroupName --query "[?name=='$ContainerAppEnvName'].name" --output tsv --only-show-errors 2>$null
if (-not $existingEnv) {
    az containerapp env create `
        --name $ContainerAppEnvName `
        --resource-group $ResourceGroupName `
        --location $Location `
        --output none `
        --only-show-errors
}
Write-Host "Container Apps Environment is ready." -ForegroundColor Green

# 6. Configure Microsoft Entra App + OIDC Federated Credentials for GitHub Actions
Write-Host "`n[6/7] Configuring Azure OIDC for GitHub Repository: $GitHubRepo..." -ForegroundColor Yellow
$appName = "github-actions-quiz-app"
$appJson = az ad app list --display-name $appName --only-show-errors 2>$null
$app = $null
if ($appJson) {
    $app = $appJson | ConvertFrom-Json
}

if (-not $app -or $app.Count -eq 0) {
    $app = (az ad app create --display-name $appName --only-show-errors 2>$null) | ConvertFrom-Json
    Start-Sleep -Seconds 3
} else {
    $app = $app[0]
}
$appId = $app.appId

# Create Service Principal if not exists
$spJson = az ad sp list --filter "appId eq '$appId'" --only-show-errors 2>$null
if (-not $spJson -or ($spJson | ConvertFrom-Json).Count -eq 0) {
    az ad sp create --id $appId --only-show-errors --output none 2>$null
    Start-Sleep -Seconds 5
}

# Assign Contributor role for Resource Group
az role assignment create `
    --assignee $appId `
    --role "Contributor" `
    --scope "/subscriptions/$subscriptionId/resourceGroups/$ResourceGroupName" `
    --output none `
    --only-show-errors 2>$null

# Assign AcrPush role for Container Registry
$acrId = (az acr show --name $AcrName --query id --output tsv --only-show-errors 2>$null)
az role assignment create `
    --assignee $appId `
    --role "AcrPush" `
    --scope $acrId `
    --output none `
    --only-show-errors 2>$null

# List existing credentials to avoid duplicates
$existingCreds = (az ad app federated-credential list --id $appId --only-show-errors 2>$null) | ConvertFrom-Json

# Create Federated Credential for main branch if missing
$hasMainCred = $existingCreds | Where-Object { $_.name -eq "gh-actions-main" }
if (-not $hasMainCred) {
    $credMainPath = "$env:TEMP\cred-main-$PID.json"
@"
{
    "name": "gh-actions-main",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:${GitHubRepo}:ref:refs/heads/main",
    "description": "GitHub Actions main branch",
    "audiences": ["api://AzureADTokenExchange"]
}
"@ | Out-File -FilePath $credMainPath -Encoding ascii
    az ad app federated-credential create --id $appId --parameters "`@$credMainPath" --output none --only-show-errors 2>$null
    Remove-Item -Path $credMainPath -Force -ErrorAction SilentlyContinue
}

# Create Federated Credential for Pull Requests if missing
$hasPrCred = $existingCreds | Where-Object { $_.name -eq "gh-actions-pr" }
if (-not $hasPrCred) {
    $credPrPath = "$env:TEMP\cred-pr-$PID.json"
@"
{
    "name": "gh-actions-pr",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:${GitHubRepo}:pull_request",
    "description": "GitHub Actions PRs",
    "audiences": ["api://AzureADTokenExchange"]
}
"@ | Out-File -FilePath $credPrPath -Encoding ascii
    az ad app federated-credential create --id $appId --parameters "`@$credPrPath" --output none --only-show-errors 2>$null
    Remove-Item -Path $credPrPath -Force -ErrorAction SilentlyContinue
}

Write-Host "Azure OIDC configured successfully for repo: $GitHubRepo" -ForegroundColor Green

# 7. Create Container Apps with Lowest Cost Profile (0.25 CPU, 0.5Gi RAM, Scale to 0)
Write-Host "`n[7/7] Creating Container Apps with lowest resource profile (Scale-to-0)..." -ForegroundColor Yellow

# Create quiz-api Container App if not exists
$existingApi = az containerapp list --resource-group $ResourceGroupName --query "[?name=='quiz-api'].name" --output tsv --only-show-errors 2>$null
if (-not $existingApi) {
    az containerapp create `
        --name quiz-api `
        --resource-group $ResourceGroupName `
        --environment $ContainerAppEnvName `
        --image mcr.microsoft.com/k8se/quickstart:latest `
        --target-port 8080 `
        --ingress external `
        --cpu 0.25 `
        --memory 0.5Gi `
        --min-replicas 0 `
        --max-replicas 1 `
        --output none `
        --only-show-errors
}

$apiFqdn = (az containerapp show --name quiz-api --resource-group $ResourceGroupName --query properties.configuration.ingress.fqdn --output tsv --only-show-errors 2>$null)

# Create quiz-web Container App if not exists
$existingWeb = az containerapp list --resource-group $ResourceGroupName --query "[?name=='quiz-web'].name" --output tsv --only-show-errors 2>$null
if (-not $existingWeb) {
    az containerapp create `
        --name quiz-web `
        --resource-group $ResourceGroupName `
        --environment $ContainerAppEnvName `
        --image mcr.microsoft.com/k8se/quickstart:latest `
        --target-port 3000 `
        --ingress external `
        --cpu 0.25 `
        --memory 0.5Gi `
        --min-replicas 0 `
        --max-replicas 1 `
        --output none `
        --only-show-errors
}

$webFqdn = (az containerapp show --name quiz-web --resource-group $ResourceGroupName --query properties.configuration.ingress.fqdn --output tsv --only-show-errors 2>$null)

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "AZURE INFRASTRUCTURE PROVISIONED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Note: Containers will auto-sleep when idle (Scale-to-0) to save cost." -ForegroundColor Yellow
Write-Host "API Public URL: https://$apiFqdn" -ForegroundColor Cyan
Write-Host "Web Public URL: https://$webFqdn" -ForegroundColor Cyan

Write-Host "`nCONFIGURE THE FOLLOWING ON GITHUB REPOSITORY:" -ForegroundColor Yellow
Write-Host "(Go to: GitHub Repo -> Settings -> Secrets and variables -> Actions)`n" -ForegroundColor Yellow

Write-Host "--- [REPOSITORY SECRETS] ---" -ForegroundColor Magenta
Write-Host "AZURE_CLIENT_ID:           $appId"
Write-Host "AZURE_TENANT_ID:           $tenantId"
Write-Host "AZURE_SUBSCRIPTION_ID:     $subscriptionId"
Write-Host "SPRING_DATASOURCE_URL:     jdbc:postgresql://ep-quiet-dust-b3w9f3h5-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
Write-Host "SPRING_DATASOURCE_USERNAME:neondb_owner"
Write-Host "SPRING_DATASOURCE_PASSWORD:npg_nLE1S5cIrhKQ"
Write-Host "JWT_SECRET:                your-secret-key-should-be-at-least-256-bits-long-for-production"

Write-Host "`n--- [REPOSITORY VARIABLES] ---" -ForegroundColor Magenta
Write-Host "AZURE_RESOURCE_GROUP:      $ResourceGroupName"
Write-Host "ACR_LOGIN_SERVER:          $acrLoginServer"
Write-Host "ACA_ENVIRONMENT_NAME:      $ContainerAppEnvName"
Write-Host "API_ORIGIN:                https://$apiFqdn"
Write-Host "APP_ORIGIN:                https://$webFqdn"
Write-Host "==========================================================" -ForegroundColor Cyan
