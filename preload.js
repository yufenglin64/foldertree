const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('api', {
  openFolder: (lang) => ipcRenderer.invoke('dialog:openFolder', lang),
  scan: (dirPath, opts) => ipcRenderer.invoke('fs:scan', dirPath, opts),
  open: (p) => ipcRenderer.invoke('shell:open', p),
  showInFolder: (p) => ipcRenderer.invoke('shell:showInFolder', p),
  save: (payload) => ipcRenderer.invoke('export:save', payload),
  copy: (text) => ipcRenderer.invoke('clipboard:write', text),
  // Electron 32+ 移除了 File.path，必须用 webUtils 在 preload 里取真实路径
  pathForFile: (file) => webUtils.getPathForFile(file),
  win: {
    minimize: () => ipcRenderer.send('win:minimize'),
    maxtoggle: () => ipcRenderer.send('win:maxtoggle'),
    close: () => ipcRenderer.send('win:close'),
  },
  platform: process.platform,
});
