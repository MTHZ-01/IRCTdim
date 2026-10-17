# PowerShell Installation Script for Power Calculation Suite
# This script installs the application and registers file associations for .irct, .irm, and .irvt files

Write-Host "Power Calculation Suite Installer" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "This script requires administrator privileges to register file associations." -ForegroundColor Yellow
    Write-Host "Please run as administrator or choose to skip file association registration." -ForegroundColor Yellow
    
    $response = Read-Host "Continue without file associations? (y/n)"
    if ($response -ne 'y') {
        Write-Host "Please restart this script as administrator." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    $skipFileAssociations = $true
} else {
    $skipFileAssociations = $false
}

# Step 1: Install the application
Write-Host "`nStep 1: Installing Power Calculation Suite..." -ForegroundColor Cyan

$installerPath = ".\out\make\squirrel.windows\x64\PowerCalculationSuite-Setup.exe"

if (Test-Path $installerPath) {
    Write-Host "Running installer: $installerPath" -ForegroundColor Yellow
    
    try {
        Start-Process -FilePath $installerPath -Wait -NoNewWindow
        Write-Host "Application installed successfully!" -ForegroundColor Green
    } catch {
        Write-Host "Error running installer: $_" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "Installer not found at: $installerPath" -ForegroundColor Red
    Write-Host "Please make sure you've built the installer first using 'npm run make-installer'" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 2: Register file associations (if running as admin)
if (-not $skipFileAssociations) {
    Write-Host "`nStep 2: Registering file associations..." -ForegroundColor Cyan
    
    # Get the current user's name for the path
    $username = $env:USERNAME
    $appPath = "C:\Users\$username\AppData\Local\Programs\Power Calculation Suite\PowerCalculationSuite.exe"
    
    # Wait a moment for installation to complete
    Start-Sleep -Seconds 2
    
    # Check if the application was installed
    if (Test-Path $appPath) {
        Write-Host "Found application at: $appPath" -ForegroundColor Green
        
        # Register .irct files
        Write-Host "Registering .irct files..." -ForegroundColor Yellow
        New-Item -Path "HKCR:\.irct" -Force | Out-Null
        Set-ItemProperty -Path "HKCR:\.irct" -Name "(Default)" -Value "IRCTFile"
        Set-ItemProperty -Path "HKCR:\.irct" -Name "Content Type" -Value "application/irct"
        
        New-Item -Path "HKCR:\IRCTFile" -Force | Out-Null
        Set-ItemProperty -Path "HKCR:\IRCTFile" -Name "(Default)" -Value "IRCT Project File"
        Set-ItemProperty -Path "HKCR:\IRCTFile" -Name "FriendlyTypeName" -Value "Current Transformer Calculation Project"
        
        New-Item -Path "HKCR:\IRCTFile\DefaultIcon" -Force | Out-Null
        Set-ItemProperty -Path "HKCR:\IRCTFile\DefaultIcon" -Name "(Default)" -Value "`"$appPath`",0"
        
        New-Item -Path "HKCR:\IRCTFile\shell" -Force | Out-Null
        New-Item -Path "HKCR:\IRCTFile\shell\open" -Force | Out-Null
        New-Item -Path "HKCR:\IRCTFile\shell\open\command" -Force | Out-Null
        Set-ItemProperty -Path "HKCR:\IRCTFile\shell\open" -Name "(Default)" -Value "&Open with Power Calculation Suite"
        Set-ItemProperty -Path "HKCR:\IRCTFile\shell\open\command" -Name "(Default)" -Value "`"$appPath`" `"%1`""
        
        # Register .irm files
        Write-Host "Registering .irm files..." -ForegroundColor Yellow
        New-Item -Path "HKCR:\.irm" -Force | Out-Null
        Set-ItemProperty -Path "HKCR:\.irm" -Name "(Default)" -Value "IRMFile"
        Set-ItemProperty -Path "HKCR:\.irm" -Name "Content Type" -Value "application/irm"
        
        New-Item -Path "HKCR:\IRMFile" -Force | Out-Null
        Set-ItemProperty -Path "HKCR:\IRMFile" -Name "(Default)" -Value "IRM Meter File"
        Set-ItemProperty -Path "HKCR:\IRMFile" -Name "FriendlyTypeName" -Value "Meter/CT Configuration File"
        
        New-Item -Path "HKCR:\IRMFile\DefaultIcon" -Force | Out-Null
        Set-ItemProperty -Path "HKCR:\IRMFile\DefaultIcon" -Name "(Default)" -Value "`"$appPath`",0"
        
        New-Item -Path "HKCR:\IRMFile\shell" -Force | Out-Null
        New-Item -Path "HKCR:\IRMFile\shell\open" -Force | Out-Null
        New-Item -Path "HKCR:\IRMFile\shell\open\command" -Force | Out-Null
        Set-ItemProperty -Path "HKCR:\IRMFile\shell\open" -Name "(Default)" -Value "&Open with Power Calculation Suite"
        Set-ItemProperty -Path "HKCR:\IRMFile\shell\open\command" -Name "(Default)" -Value "`"$appPath`" `"%1`""
        
        # Register .irvt files
        Write-Host "Registering .irvt files..." -ForegroundColor Yellow
        New-Item -Path "HKCR:\.irvt" -Force | Out-Null
        Set-ItemProperty -Path "HKCR:\.irvt" -Name "(Default)" -Value "IRVTFile"
        Set-ItemProperty -Path "HKCR:\.irvt" -Name "Content Type" -Value "application/irvt"
        
        New-Item -Path "HKCR:\IRVTFile" -Force | Out-Null
        Set-ItemProperty -Path "HKCR:\IRVTFile" -Name "(Default)" -Value "IRVT Voltage Transformer File"
        Set-ItemProperty -Path "HKCR:\IRVTFile" -Name "FriendlyTypeName" -Value "Voltage Transformer Configuration File"
        
        New-Item -Path "HKCR:\IRVTFile\DefaultIcon" -Force | Out-Null
        Set-ItemProperty -Path "HKCR:\IRVTFile\DefaultIcon" -Name "(Default)" -Value "`"$appPath`",0"
        
        New-Item -Path "HKCR:\IRVTFile\shell" -Force | Out-Null
        New-Item -Path "HKCR:\IRVTFile\shell\open" -Force | Out-Null
        New-Item -Path "HKCR:\IRVTFile\shell\open\command" -Force | Out-Null
        Set-ItemProperty -Path "HKCR:\IRVTFile\shell\open" -Name "(Default)" -Value "&Open with Power Calculation Suite"
        Set-ItemProperty -Path "HKCR:\IRVTFile\shell\open\command" -Name "(Default)" -Value "`"$appPath`" `"%1`""
        
        Write-Host "File associations registered successfully!" -ForegroundColor Green
        Write-Host "You can now double-click .irct, .irm, and .irvt files to open them with Power Calculation Suite." -ForegroundColor Green
        
        # Refresh Explorer to update file associations
        Write-Host "Refreshing Windows Explorer..." -ForegroundColor Yellow
        try {
            # Notify the system that file associations have changed
            Add-Type -TypeDefinition @"
                using System;
                using System.Runtime.InteropServices;
                public class Win32 {
                    [DllImport("shell32.dll", CharSet = CharSet.Auto, SetLastError = true)]
                    public static extern void SHChangeNotify(uint wEventId, uint uFlags, IntPtr dwItem1, IntPtr dwItem2);
                }
"@
            [Win32]::SHChangeNotify(0x08000000, 0x0000, [IntPtr]::Zero, [IntPtr]::Zero)
            Write-Host "File associations refreshed!" -ForegroundColor Green
        } catch {
            Write-Host "Note: You may need to restart Windows Explorer to see the new file icons." -ForegroundColor Yellow
        }
        
    } else {
        Write-Host "Application not found at expected location: $appPath" -ForegroundColor Red
        Write-Host "File associations were not registered." -ForegroundColor Yellow
    }
} else {
    Write-Host "`nSkipping file association registration (not running as administrator)." -ForegroundColor Yellow
    Write-Host "To register file associations later, run this script as administrator." -ForegroundColor Yellow
}

Write-Host "`nInstallation completed!" -ForegroundColor Green
Write-Host "You can now find Power Calculation Suite in your Start menu." -ForegroundColor Cyan

Read-Host "`nPress Enter to exit"