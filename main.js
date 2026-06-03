const { app, BrowserWindow, ipcMain, dialog, shell, clipboard } = require('electron');
const path = require('path');
const fs = require('fs');
const fsp = fs.promises;

// 默认扫描上限，防止超大目录卡死界面
const DEFAULT_MAX_NODES = 100000;
const HARD_MAX_NODES = 1000000;
function normalizeMaxNodes(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return DEFAULT_MAX_NODES;
  return Math.min(Math.floor(n), HARD_MAX_NODES);
}

// Native dialog labels
const MAIN_I18N = {
  en: { openFolder: 'Select folder to scan', export: 'Export', scanLimit: 'This folder is too large to load safely. FolderTree stopped at 100,000 items. Please choose a smaller folder or narrow the directory first.' },
  zh: { openFolder: '选择要解析的文件夹', export: '导出', scanLimit: '这个文件夹太大，无法安全加载。FolderTree 已在 100,000 项时停止扫描。请重新拖入更小的文件夹，或先缩小目录范围。' },
};
function mt(lang, key) { return (MAIN_I18N[lang] || MAIN_I18N.en)[key] || MAIN_I18N.en[key] || key; }

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 800,
    minWidth: 720,
    minHeight: 500,
    backgroundColor: '#1a1a1c',
    title: 'FolderTree Viewer',
    icon: path.join(__dirname, 'renderer', 'icon.png'),
    frame: false,            // 无边框：使用自绘的圆润窗口控制按钮
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  // 调试时取消注释:
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ---- 递归扫描目录，构造树 ----
async function scanDir(dirPath, opts, counter) {
  let entries;
  try {
    entries = await fsp.readdir(dirPath, { withFileTypes: true });
  } catch (e) {
    return { error: e.code || 'EACCES' };
  }

  // 文件夹在前，其次按名称(中文友好)排序
  entries.sort((a, b) => {
    const ad = a.isDirectory() ? 0 : 1;
    const bd = b.isDirectory() ? 0 : 1;
    if (ad !== bd) return ad - bd;
    return a.name.localeCompare(b.name, 'zh-Hans-CN', { numeric: true });
  });

  const children = [];
  for (const ent of entries) {
    if (counter.count >= counter.limit) {
      return { error: 'SCAN_LIMIT', message: mt(opts.lang, 'scanLimit'), limit: counter.limit, count: counter.count };
    }
    if (!opts.showHidden && ent.name.startsWith('.')) continue;
    if (opts.ignore && opts.ignore.includes(ent.name)) continue;

    const full = path.join(dirPath, ent.name);
    counter.count++;

    // 处理符号链接 / 无法 stat 的情况
    let stat = null;
    try {
      stat = await fsp.lstat(full);
    } catch (e) {
      children.push({ name: ent.name, path: full, isDir: false, error: e.code });
      continue;
    }

    if (ent.isDirectory()) {
      const node = {
        name: ent.name,
        path: full,
        isDir: true,
        mtime: stat.mtimeMs,
        children: [],
        fileCount: 0,
        dirCount: 0,
        size: 0,
      };
      const sub = await scanDir(full, opts, counter);
      if (sub.error) {
        if (sub.error === 'SCAN_LIMIT') return sub;
        node.error = sub.error;
      } else {
        node.children = sub.children;
        // 汇总统计
        for (const c of sub.children) {
          if (c.isDir) {
            node.dirCount += 1 + (c.dirCount || 0);
            node.fileCount += c.fileCount || 0;
          } else if (!c.truncated) {
            node.fileCount += 1;
          }
          node.size += c.size || 0;
        }
      }
      children.push(node);
    } else {
      children.push({
        name: ent.name,
        path: full,
        isDir: false,
        size: stat.size,
        mtime: stat.mtimeMs,
        ext: path.extname(ent.name).slice(1).toLowerCase(),
      });
    }
  }
  return { children };
}

ipcMain.handle('dialog:openFolder', async (_e, lang = 'en') => {
  const res = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: mt(lang, 'openFolder'),
  });
  if (res.canceled || !res.filePaths.length) return null;
  return res.filePaths[0];
});

ipcMain.handle('fs:scan', async (_e, dirPath, opts = {}) => {
  if (!dirPath) return { error: 'NO_PATH' };
  let rootStat;
  try {
    rootStat = await fsp.stat(dirPath);
  } catch (e) {
    return { error: e.code || 'ENOENT' };
  }
  if (!rootStat.isDirectory()) return { error: 'NOT_DIR' };

  const counter = { count: 0, limit: normalizeMaxNodes(opts.maxNodes) };
  const t0 = Date.now();
  const sub = await scanDir(dirPath, opts, counter);
  if (sub.error) return { error: sub.error, message: sub.message, limit: sub.limit, count: sub.count };

  let fileCount = 0, dirCount = 0, size = 0;
  for (const c of sub.children) {
    if (c.isDir) { dirCount += 1 + (c.dirCount || 0); fileCount += c.fileCount || 0; }
    else if (!c.truncated) fileCount += 1;
    size += c.size || 0;
  }

  return {
    root: {
      name: path.basename(dirPath) || dirPath,
      path: dirPath,
      isDir: true,
      children: sub.children,
      fileCount, dirCount, size,
      mtime: rootStat.mtimeMs,
    },
    stats: { fileCount, dirCount, size, nodes: counter.count, ms: Date.now() - t0 },
  };
});

ipcMain.on('win:minimize', () => mainWindow && mainWindow.minimize());
ipcMain.on('win:maxtoggle', () => { if (!mainWindow) return; if (mainWindow.isMaximized()) mainWindow.unmaximize(); else mainWindow.maximize(); });
ipcMain.on('win:close', () => mainWindow && mainWindow.close());

ipcMain.handle('clipboard:write', async (_e, text) => {
  clipboard.writeText(text || '');
  return null;
});

ipcMain.handle('shell:open', async (_e, p) => {
  const err = await shell.openPath(p);
  return err || null;
});

ipcMain.handle('shell:showInFolder', async (_e, p) => {
  shell.showItemInFolder(p);
  return null;
});

ipcMain.handle('export:save', async (_e, { content, defaultName, filters, lang = 'en' }) => {
  const res = await dialog.showSaveDialog(mainWindow, {
    title: mt(lang, 'export'),
    defaultPath: defaultName,
    filters: filters || [{ name: 'All', extensions: ['*'] }],
  });
  if (res.canceled || !res.filePath) return { canceled: true };
  await fsp.writeFile(res.filePath, content, 'utf8');
  return { path: res.filePath };
});
