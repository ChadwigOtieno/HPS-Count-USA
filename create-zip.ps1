# PowerShell script to create a ZIP file of the project excluding specific directories
$source = Get-Location
$destination = Join-Path $source "hps-dashboard.zip"

# Create a temporary directory
$tempDir = Join-Path $source "temp_for_zip"
if (Test-Path $tempDir) {
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
}
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

# List of directories and files to exclude
$excludeDirs = @(".next", "node_modules", "temp_for_zip")
$excludeFiles = @("hps-dashboard.zip", "create-zip.ps1")

# Copy files and directories with exclusions
Get-ChildItem -Path $source | 
    Where-Object { 
        ($_.PSIsContainer -and $excludeDirs -notcontains $_.Name) -or 
        (-not $_.PSIsContainer -and $excludeFiles -notcontains $_.Name) 
    } | 
    ForEach-Object {
        try {
            if ($_.PSIsContainer) {
                Copy-Item -Path $_.FullName -Destination (Join-Path $tempDir $_.Name) -Recurse -Force -ErrorAction SilentlyContinue
            } else {
                Copy-Item -Path $_.FullName -Destination (Join-Path $tempDir $_.Name) -Force -ErrorAction SilentlyContinue
            }
        } catch {
            Write-Warning "Could not copy $($_.FullName): $_"
        }
    }

# Create the ZIP file
try {
    if (Test-Path $destination) {
        Remove-Item -Path $destination -Force -ErrorAction SilentlyContinue
    }
    Compress-Archive -Path "$tempDir\*" -DestinationPath $destination -Force
    Write-Host "ZIP file created at: $destination" -ForegroundColor Green
} catch {
    Write-Error "Failed to create ZIP file: $_"
}

# Remove the temporary directory
try {
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
} catch {
    Write-Warning "Could not remove temporary directory: $_"
}

Write-Host "Now you can manually upload this ZIP file to your GitHub repository at: https://github.com/ChadwigOtieno/HPS-Count-USA" -ForegroundColor Cyan 