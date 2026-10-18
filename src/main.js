const { app, BrowserWindow, ipcMain, dialog, screen } = require('electron');
const path = require('node:path');
const { spawn, execSync, spawnSync } = require('child_process');
const fs = require('fs');
const http = require('http');

let backendProcess = null;
let mainWindow = null;
let isQuitting = false;

app.commandLine.appendSwitch('js-flags', '--expose_gc');

if (require('electron-squirrel-startup')) {
  app.quit();
}

function freePort8000() {
  try {
    if (process.platform === 'win32') {
      try {
        const out = execSync('netstat -ano | findstr :8000', { encoding: 'utf8' });
        const lines = out.split(/\r?\n/).filter((l) => l.includes('LISTENING'));
        const pids = new Set();
        for (const line of lines) {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (pid && /^\d+$/.test(pid)) pids.add(pid);
        }
        for (const pid of pids) {
          try {
            execSync(`taskkill /PID ${pid} /F /T`, { stdio: 'ignore' });
          } catch (_) {}
        }
      } catch (_) {}
    } else {
      try {
        execSync('fuser -k 8000/tcp', { stdio: 'ignore' });
      } catch (_) {}
      try {
        execSync('pkill -f "[m]anage.py runserver"', { stdio: 'ignore' });
      } catch (_) {}
      try {
        execSync('pkill -f "[.]/dist/manage"', { stdio: 'ignore' });
      } catch (_) {}
      try {
        execSync('pkill -f "resources/manage"', { stdio: 'ignore' });
      } catch (_) {}
    }
  } catch (_) {}
}

function stopBackend() {
  if (!backendProcess) {
    freePort8000();
    return;
  }

  const proc = backendProcess;
  const pid = proc.pid;
  backendProcess = null;

  try {
    if (process.platform === 'win32') {
      if (pid) {
        try {
          execSync(`taskkill /PID ${pid} /F /T`, { stdio: 'ignore' });
        } catch (_) {}
      }
      try {
        proc.kill();
      } catch (_) {}
    } else {
      if (pid) {
        try {
          process.kill(-pid, 'SIGTERM');
        } catch (_) {}
        try {
          process.kill(pid, 'SIGTERM');
        } catch (_) {}
      }
      try {
        proc.kill('SIGTERM');
      } catch (_) {}

      setTimeout(() => {
        if (pid) {
          try {
            process.kill(-pid, 'SIGKILL');
          } catch (_) {}
          try {
            process.kill(pid, 'SIGKILL');
          } catch (_) {}
        }
        try {
          proc.kill('SIGKILL');
        } catch (_) {}
        freePort8000();
      }, 500);
    }
  } catch (err) {
    console.error('stopBackend error:', err);
    freePort8000();
  }
}

function createWindow() {
  const iconCandidates = [
    app.isPackaged ? path.join(process.resourcesPath, 'RedSnake.png') : null,
    app.isPackaged ? path.join(process.resourcesPath, 'RedSnake.ico') : null,
    path.join(process.cwd(), 'src', 'Assets', 'RedSnake.png'),
    path.join(process.cwd(), 'src', 'Assets', 'RedSnake.ico'),
  ].filter(Boolean);

  let iconPath = undefined;
  for (const p of iconCandidates) {
    if (fs.existsSync(p)) {
      iconPath = p;
      break;
    }
  }

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    resizable: true,
    frame: false,
    transparent: false,
    backgroundColor: '#1e1e1e',
    roundedCorners: true,
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

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; " +
            "connect-src 'self' http://127.0.0.1:8000 ws://127.0.0.1:8000 http://localhost:3000 ws://localhost:3000 http://localhost:* ws://localhost:*",
        ],
      },
    });
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  const sendWindowState = () => {
    if (mainWindow) {
      mainWindow.webContents.send('window-state-changed', {
        isMaximized: mainWindow.isMaximized(),
        isFullScreen: mainWindow.isFullScreen(),
      });
    }
  };

  mainWindow.on('maximize', sendWindowState);
  mainWindow.on('unmaximize', sendWindowState);
  mainWindow.on('restore', sendWindowState);
  mainWindow.on('resize', sendWindowState);

  mainWindow.webContents.once('did-finish-load', () => {
    if (global.pendingFileToOpen) {
      mainWindow.webContents.send('open-file', global.pendingFileToOpen);
      global.pendingFileToOpen = null;
    }
  });

  return mainWindow;
}

function resolvePackagedBackend() {
  const candidates = [
    path.join(process.resourcesPath, 'manage', process.platform === 'win32' ? 'manage.exe' : 'manage'),
    path.join(process.resourcesPath, process.platform === 'win32' ? 'manage.exe' : 'manage'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return { binary: candidate, cwd: path.dirname(candidate) };
    }
  }
  return null;
}

function startDjangoBackend() {
  freePort8000();

  if (!app.isPackaged) {
    const projectRoot = app.getAppPath();
    const djangoDir = path.join(projectRoot, 'BackEnd', 'IRCT');
    const managePyPath = path.join(djangoDir, 'manage.py');
    const pythonExecutable =
      process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');

    console.log('Operating system:', process.platform);
    console.log('Django directory:', djangoDir);
    console.log('Python executable:', pythonExecutable);

    if (!fs.existsSync(managePyPath)) {
      throw new Error(`Django manage.py not found: ${managePyPath}`);
    }

    backendProcess = spawn(
      pythonExecutable,
      [managePyPath, 'runserver', '127.0.0.1:8000'],
      {
        cwd: djangoDir,
        stdio: 'inherit',
        windowsHide: true,
        detached: process.platform !== 'win32',
      }
    );
  } else {
    const resolved = resolvePackagedBackend();
    if (!resolved) {
      throw new Error('Packaged backend binary not found under process.resourcesPath');
    }

    const { binary, cwd } = resolved;
    console.log('Packaged backend binary:', binary);
    console.log('Backend cwd:', cwd);

    // Ensure DB tables exist (writable DB lives in ~/.power-calculation-suite)
    try {
      spawnSync(binary, ['migrate', '--run-syncdb'], {
        cwd,
        stdio: 'inherit',
        windowsHide: true,
        timeout: 60000,
      });
    } catch (err) {
      console.error('migrate failed (continuing):', err);
    }

    backendProcess = spawn(binary, ['runserver', '127.0.0.1:8000'], {
      cwd,
      stdio: 'inherit',
      windowsHide: true,
      detached: process.platform !== 'win32',
    });
  }

  if (backendProcess && backendProcess.pid && process.platform !== 'win32') {
    try {
      backendProcess.unref();
    } catch (_) {}
  }

  backendProcess.on('error', (error) => {
    console.error('Failed to start Django:', error);
  });

  backendProcess.on('exit', (code, signal) => {
    console.log(`Django exited: code=${code}, signal=${signal}`);
    backendProcess = null;
  });
}

async function waitForDjango(timeout = 45000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tryConnect = () => {
      http
        .get('http://127.0.0.1:8000', () => resolve())
        .on('error', () => {
          if (Date.now() - start > timeout) {
            reject(new Error('Django timeout'));
          } else {
            setTimeout(tryConnect, 400);
          }
        });
    };
    tryConnect();
  });
}

app.whenReady().then(async () => {
  try {
    startDjangoBackend();
    await waitForDjango();
    createWindow();
  } catch (error) {
    console.error('Backend failed:', error);
    dialog.showErrorBox(
      'Error',
      'Could not start the backend server.\n\n' + String(error.message || error)
    );
    stopBackend();
    app.quit();
    return;
  }

  ipcMain.handle('dialog:showOpenDialog', async (_, options) => {
    return dialog.showOpenDialog(options);
  });

  ipcMain.handle('dialog:showSaveDialog', async (_, options) => {
    return dialog.showSaveDialog(options);
  });

  ipcMain.handle('fs:readFile', async (_, filePath) => fs.promises.readFile(filePath, 'utf8'));
  ipcMain.handle('fs:writeFile', async (_, filePath, data) =>
    fs.promises.writeFile(filePath, data, 'utf8')
  );

  ipcMain.handle('fs:copyFolder', (_, src, dest) => {
    const copyFolderRecursive = (srcDir, destDir) => {
      const folderName = path.basename(srcDir);
      const newDestDir = path.join(destDir, folderName);
      if (!fs.existsSync(newDestDir)) fs.mkdirSync(newDestDir, { recursive: true });

      const entries = fs.readdirSync(srcDir, { withFileTypes: true });
      for (const entry of entries) {
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
  ipcMain.on('close-app', () => {
    isQuitting = true;
    stopBackend();
    app.quit();
  });

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
          setBounds({
            x: work.x,
            y: work.y,
            width: Math.floor(work.width / 2),
            height: work.height,
          });
          break;
        case 'right':
          setBounds({
            x: work.x + Math.ceil(work.width / 2),
            y: work.y,
            width: Math.floor(work.width / 2),
            height: work.height,
          });
          break;
        case 'top-left':
          setBounds({
            x: work.x,
            y: work.y,
            width: Math.floor(work.width / 2),
            height: Math.floor(work.height / 2),
          });
          break;
        case 'top-right':
          setBounds({
            x: work.x + Math.ceil(work.width / 2),
            y: work.y,
            width: Math.floor(work.width / 2),
            height: Math.floor(work.height / 2),
          });
          break;
        case 'bottom-left':
          setBounds({
            x: work.x,
            y: work.y + Math.ceil(work.height / 2),
            width: Math.floor(work.width / 2),
            height: Math.floor(work.height / 2),
          });
          break;
        case 'bottom-right':
          setBounds({
            x: work.x + Math.ceil(work.width / 2),
            y: work.y + Math.ceil(work.height / 2),
            width: Math.floor(work.width / 2),
            height: Math.floor(work.height / 2),
          });
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

app.on('before-quit', () => {
  isQuitting = true;
  stopBackend();
});

app.on('will-quit', (event) => {
  if (backendProcess) {
    event.preventDefault();
    stopBackend();
    setTimeout(() => app.exit(0), 600);
  }
});

app.on('window-all-closed', () => {
  stopBackend();
  if (process.platform !== 'darwin') app.quit();
});