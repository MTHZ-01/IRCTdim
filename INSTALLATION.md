# Power Calculation Suite - Installation Guide

## Overview
This installer creates a Windows application that automatically registers `.irct`, `.irm`, and `.irvt` file types with Windows, allowing you to double-click these files to open them directly in the Power Calculation Suite.

## What's Included
- **PowerCalculationSuite-Setup.exe**: Main installer for the application
- **File Type Registration**: Automatic association of custom file types
- **Custom Icons**: Each file type gets its own icon
  - 🐍 **Red Snake**: `.irct` files (Current Transformer projects)
  - 🐍 **Yellow Snake**: `.irm` files (Meter/CT configurations) 
  - 🐍 **White Snake**: `.irvt` files (Voltage Transformer configurations)

## Installation Methods

### Method 1: Automatic Installation (Recommended)
1. **Run the installer script as Administrator**:
   ```powershell
   # Right-click PowerShell and "Run as Administrator"
   .\install-with-file-associations.ps1
   ```
   
2. The script will:
   - Install the main application
   - Register file associations
   - Set up custom icons for each file type
   - Refresh Windows Explorer

### Method 2: Manual Installation
1. **Install the application**:
   ```
   .\out\make\squirrel.windows\x64\PowerCalculationSuite-Setup.exe
   ```

2. **Register file associations** (optional):
   - Double-click `register-file-types.reg` 
   - Click "Yes" when Windows asks for permission

## File Type Associations

After installation, the following file types will be registered:

| Extension | Description | Icon |
|-----------|-------------|------|
| `.irct` | Current Transformer Calculation Project | Red Snake 🐍 |
| `.irm` | Meter/CT Configuration File | Yellow Snake 🐍 |
| `.irvt` | Voltage Transformer Configuration File | White Snake 🐍 |

## Usage
- **Double-click** any `.irct`, `.irm`, or `.irvt` file to open it directly in Power Calculation Suite
- Files will display with their custom icons in Windows Explorer
- The application will automatically start the Django backend server
- Your workspace and projects will load automatically

## Troubleshooting

### File associations not working
1. Make sure you ran the installer as Administrator
2. Try logging out and back in to refresh Windows
3. Manually run the registry file: `register-file-types.reg`

### Icons not showing
1. Restart Windows Explorer:
   - Press `Ctrl+Shift+Esc` → Find "Windows Explorer" → Restart
2. Or restart your computer

### Application not starting
1. Make sure the Django backend dependencies are installed
2. Check that Python is available on your system
3. Try running the application manually from the Start menu

## Uninstallation
1. Go to **Settings** → **Apps** → **Power Calculation Suite** → **Uninstall**
2. File associations will be automatically removed

## Development
To build the installer yourself:
```bash
npm run make-installer
```

The installer will be created at:
```
.\out\make\squirrel.windows\x64\PowerCalculationSuite-Setup.exe
```

## Support
For technical support or bug reports, please contact the development team.