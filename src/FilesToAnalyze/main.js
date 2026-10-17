const { app, BrowserWindow, ipcMain, dialog, screen } = require('electron');
const path = require('node:path');
const { spawn, exec } = require('child_process');
const fs = require('fs');

let backendProcess = null;
let mainWindow = null;

app.commandLine.appendSwitch('js-flags', '--expose_gc');

// Handle squirrel startup
if (require('electron-squirrel-startup')) {
  app.quit();
}

function createWindow() {
  const iconPath = path.join(process.cwd(), 'src', 'Assets', 'RedSnake.png');

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    resizable: true,
    frame: false,
    transparent: false,
    backgroundColor: '#1e1e1e',           // Must match your app's dark background
    roundedCorners: true,                 // Important for Windows 11
    hasShadow: true,
    thickFrame: true,
    icon: iconPath,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
    autoHideMenuBar: true,
  });

  // CSP
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; " +
          "connect-src 'self' http://127.0.0.1:8000 ws://127.0.0.1:8000 http://localhost:3000 ws://localhost:3000 http://localhost:* ws://localhost:*"
        ]
      }
    });
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // === Window State Events ===
  const sendWindowState = () => {
    if (mainWindow) {
      const isMax = mainWindow.isMaximized();
      mainWindow.webContents.send('window-state-changed', { 
        isMaximized: isMax,
        isFullScreen: mainWindow.isFullScreen()
      });
    }
  };

  mainWindow.on('maximize', sendWindowState);
  mainWindow.on('unmaximize', sendWindowState);
  mainWindow.on('restore', sendWindowState);
  mainWindow.on('resize', () => {
    // Optional: throttle if needed
    sendWindowState();
  });

  // File association handling
  mainWindow.webContents.once('did-finish-load', () => {
    if (global.pendingFileToOpen) {
      mainWindow.webContents.send('open-file', global.pendingFileToOpen);
      global.pendingFileToOpen = null;
    }
  });

  return mainWindow;
}


// ====================== Django Backend ======================
function startDjangoBackend() {
  if (process.env.NODE_ENV === 'development') {
    const managePyPath = path.join('C:', 'KnoladgeBased_initiative', 'BackEnd', 'IRCT', 'manage.py');
    const cwd = path.join('C:', 'KnoladgeBased_initiative', 'BackEnd', 'IRCT');

    exec('where python', (err, stdout) => {
      if (err) {
        console.error("Failed to find python");
        return;
      }
      const pythonPath = stdout.split(/\r?\n/)[0];
      backendProcess = spawn(pythonPath, ['manage.py', 'runserver', '127.0.0.1:8000'], {
        cwd,
        stdio: 'inherit'
      });
    });
  } else {
    const backendDir = path.join(process.resourcesPath, 'manage');
    const backendExePath = path.join(backendDir, 'manage.exe');
    backendProcess = spawn(backendExePath, ['runserver', '127.0.0.1:8000'], {
      cwd: backendDir,
      stdio: 'inherit'
    });
  }
}



async function waitForDjango(timeout = 12000) {
  const http = require('http');
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tryConnect = () => {
      http.get('http://127.0.0.1:8000', () => resolve())
        .on('error', () => {
          if (Date.now() - start > timeout) {
            reject(new Error('Django timeout'));
          } else {
            setTimeout(tryConnect, 500);
          }
        });
    };
    tryConnect();
  });
}

// ====================== App Ready ======================
app.whenReady().then(async () => {
  try {
    startDjangoBackend();
    await waitForDjango();
    createWindow();
  } catch (error) {
    console.error('Backend failed:', error);
    dialog.showErrorBox('Error', 'Could not start the backend server.');
    app.quit();
  }

  // IPC Handlers (your existing ones + improved window controls)
  ipcMain.handle('dialog:showOpenDialog', async (_, options) => {
    return dialog.showOpenDialog(options);
  });

  ipcMain.handle('dialog:showSaveDialog', async (_, options) => {
    return dialog.showSaveDialog(options);
  });

  ipcMain.handle('fs:readFile', async (_, filePath) => fs.promises.readFile(filePath, 'utf8'));
  ipcMain.handle('fs:writeFile', async (_, filePath, data) => fs.promises.writeFile(filePath, data, 'utf8'));
  ipcMain.handle('fs:copyFolder', (_, src, dest) => {
    // your copy function remains unchanged
    const copyFolderRecursive = (srcDir, destDir) => {
      const folderName = path.basename(srcDir);
      const newDestDir = path.join(destDir, folderName);
      if (!fs.existsSync(newDestDir)) fs.mkdirSync(newDestDir, { recursive: true });

      const entries = fs.readdirSync(srcDir, { withFileTypes: true });
      for (let entry of entries) {
        const srcPath = path.join(srcDir, entry.name);
        const destPath = path.join(newDestDir, entry.name);
        if (entry.isDirectory()) {
          copyFolderRecursive(srcPath, newDestDir);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    };
    copyFolderRecursive(src, dest);
    return true;
  });

  ipcMain.handle('fs:existsSync', (_, filePath) => fs.existsSync(filePath));
  ipcMain.handle('fs:mkdirSync', (_, dirPath) => {
    fs.mkdirSync(dirPath, { recursive: true });
    return true;
  });

  // Window Controls
  ipcMain.on('maximize-app', () => {
    if (!mainWindow) return;
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow._restoreBounds = mainWindow.getBounds();
      mainWindow.maximize();
    }
  });

  ipcMain.on('minimize-app', () => mainWindow?.minimize());
  ipcMain.on('close-app', () => app.quit());

  ipcMain.handle('is-window-maximized', () => mainWindow?.isMaximized() ?? false);

  ipcMain.on('snap-window', (event, action) => {
    if (!mainWindow) return;
    try {
      const display = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
      const work = display.workArea;

      if (!mainWindow._restoreBounds) mainWindow._restoreBounds = mainWindow.getBounds();

      const setBounds = (bounds) => mainWindow.setBounds(bounds);

      switch (action) {
        case 'left':
          setBounds({ x: work.x, y: work.y, width: Math.floor(work.width / 2), height: work.height });
          break;
        case 'right':
          setBounds({ x: work.x + Math.ceil(work.width / 2), y: work.y, width: Math.floor(work.width / 2), height: work.height });
          break;
        case 'top-left':
          setBounds({ x: work.x, y: work.y, width: Math.floor(work.width / 2), height: Math.floor(work.height / 2) });
          break;
        case 'top-right':
          setBounds({ x: work.x + Math.ceil(work.width / 2), y: work.y, width: Math.floor(work.width / 2), height: Math.floor(work.height / 2) });
          break;
        case 'bottom-left':
          setBounds({ x: work.x, y: work.y + Math.ceil(work.height / 2), width: Math.floor(work.width / 2), height: Math.floor(work.height / 2) });
          break;
        case 'bottom-right':
          setBounds({ x: work.x + Math.ceil(work.width / 2), y: work.y + Math.ceil(work.height / 2), width: Math.floor(work.width / 2), height: Math.floor(work.height / 2) });
          break;
        case 'maximize':
          mainWindow.maximize();
          break;
        case 'restore':
          if (mainWindow.isMaximized()) mainWindow.unmaximize();
          else if (mainWindow._restoreBounds) mainWindow.setBounds(mainWindow._restoreBounds);
          break;
      }
    } catch (err) {
      console.error('snap-window error:', err);
    }
  });
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('open-file', (event, filePath) => {
  event.preventDefault();
  if (mainWindow) {
    mainWindow.webContents.send('open-file', filePath);
  } else {
    global.pendingFileToOpen = filePath;
  }
});

app.on('window-all-closed', () => {
  if (backendProcess && !backendProcess.killed) backendProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});