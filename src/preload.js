const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    fs: {
        readFile: (filePath) => ipcRenderer.invoke('fs:readFile', filePath),
        writeFile: (filePath, data) => ipcRenderer.invoke('fs:writeFile', filePath, data),
        existsSync: (filePath) => ipcRenderer.invoke('fs:existsSync', filePath),
        mkdirSync: (dirPath) => ipcRenderer.invoke('fs:mkdirSync', dirPath),
        copyFolder: (src, dest) => ipcRenderer.invoke('fs:copyFolder', src, dest), // NEW
    },
    dialog: {
        showOpenDialog: (options) => ipcRenderer.invoke('dialog:showOpenDialog', options),
        showSaveDialog: (options) => ipcRenderer.invoke('dialog:showSaveDialog', options),
    },
    appControl: {
        closeApp: () => ipcRenderer.send('close-app'),
        minimizeApp: () => ipcRenderer.send('minimize-app'),
        maximizeApp: () => ipcRenderer.send('maximize-app'),
        isWindowMaximized: () => ipcRenderer.invoke('is-window-maximized'),
    },
    windowSnap: {
        snap: (action) => ipcRenderer.send('snap-window', action),
    },
    fileAssociation: {
        onFileOpen: (callback) => {
            ipcRenderer.on('open-file', (event, filePath) => callback(filePath));
        },
        removeAllListeners: () => {
            ipcRenderer.removeAllListeners('open-file');
        }
    }
});

// window state events
ipcRenderer.on('window-maximized', () => {
    const ev = new Event('electron-window-maximized');
    window.dispatchEvent(ev);
});

ipcRenderer.on('window-unmaximized', () => {
    const ev = new Event('electron-window-unmaximized');
    window.dispatchEvent(ev);
});
