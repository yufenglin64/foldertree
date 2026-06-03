'use strict';

const $ = (id) => document.getElementById(id);
const viewport = $('viewport');
const canvas = $('canvas');
const edgesSvg = $('edges');
const nodesLayer = $('nodes');
const emptyEl = $('empty');
const loadingEl = $('loading');
const zoomCtl = $('zoomCtl');
const hintBar = $('hintBar');
const tooltip = $('tooltip');
const statText = $('statText');
const searchInput = $('search');
const searchCount = $('searchCount');
const layoutSel = $('layoutSel');
const tabbar = $('tabbar');
const dropOverlay = $('dropOverlay');

const SVGNS = 'http://www.w3.org/2000/svg';


const LANGS = {
  en: {
    appTitle: 'FolderTree Viewer', cancelScopeSearch: 'Cancel scoped search', searchCurrentTab: 'Search current tab…', clearSearch: 'Clear search',
    openFolder: 'Open Folder', openFolderTitle: 'Open folder in a new tab (Ctrl+O)', expandAll: 'Expand all', collapseAll: 'Collapse all', fitWindow: 'Fit to window (center)',
    refreshTitle: 'Left click: refresh now · Right click: auto-refresh settings', autoRefreshTitle: 'Auto-refresh (current folder only)', off: 'Off', every10s: 'Every 10 seconds', every1m: 'Every 1 minute', every5m: 'Every 5 minutes', every10m: 'Every 10 minutes', every30m: 'Every 30 minutes',
    layoutShape: 'Layout shape', layoutH: 'Tree · Horizontal', layoutV: 'Tree · Vertical', layoutRadial: 'Radial · Sphere', layoutHDesc: 'Expands left to right, ideal for wide screens', layoutVDesc: 'Expands top to bottom, making hierarchy clear', layoutRadialDesc: 'Spreads outward from the center for big-picture views',
    export: 'Export', exportTxt: 'Export as text tree (.txt)', exportMd: 'Export as Markdown (.md)', exportHtml: 'Export as webpage (.html)', exportJson: 'Export as JSON (.json)', copyTextTree: 'Copy text tree to clipboard',
    toggleHidden: 'Show/hide hidden files', switchLanguage: 'Switch language', toggleTheme: 'Toggle light/dark theme', minimize: 'Minimize', maximize: 'Maximize', close: 'Close',
    emptyTitle: 'Drag in or open a folder', emptySub: 'Generate a zoomable mind-map folder tree', emptyHint: 'You can also drag a folder here · one folder per tab', scanning: 'Scanning…', zoomOut: 'Zoom out', zoomIn: 'Zoom in', hintBar: 'Wheel to zoom · Drag to pan · Right-click menu (lock/copy path, etc.) · Double-click to expand/open · Drag the card edge to widen · Hover 1 second for details · Esc clears all locks', ready: 'Ready', dropOverlay: 'Release — open this folder in a new tab', hiddenOn: '✓ Hidden files shown', hiddenOff: '✓ Hidden files hidden',
    folder: 'Folder', file: 'File', typedFile: '{ext} file', newTab: 'New tab', closeTabTitle: 'Close', blankTabTitle: 'Blank tab', addTabTitle: 'New tab',
    refreshing: 'Refreshing…', refreshFailed: 'Refresh failed: {error}', refreshed: '✓ Refreshed', standardLayout: 'Position is already in the standard layout', resetPositionDone: '✓ Position reset', scanLimitFallback: 'This folder is too large to load safely. FolderTree stopped scanning at {limit} items. Please choose a smaller folder, narrow the directory, or raise the scan limit carefully.',
    scanLimitTitle: 'Scan item limit', scanLimitMenuTitle: 'Scan item limit', customLimit: 'Custom…', applyLimit: 'Apply', customLimitPrompt: 'Enter the maximum number of items to scan (1–1,000,000):', invalidLimit: 'Please enter a number between 1 and 1,000,000.', highLimitWarning: 'Scanning more than 100,000 items may use more memory and make the app slower. Continue with {limit} items?', scanLimitSet: '✓ Scan limit set to {limit} items',
    emptyCannotRead: 'Cannot read this folder ({error})', cannotRead: 'Cannot read: {error}', stats: '{dirs} folders · {files} files · {size} total · {nodes} items', matches: '{count} matches', noMatches: 'No matches', matchPos: '{index}/{total} matches',
    gripTitle: 'Drag to resize the card and show the full name', copyFullPath: 'Copy full path', copyName: 'Copy name', unlockPath: 'Unlock path', lockPath: 'Lock path and highlight', resetPosition: 'Reset position', searchUnderFolder: 'Search within this folder', openFolderSystem: 'Open folder with system', openSystem: 'Open with system', showInFolder: 'Show in file manager', expandChildren: 'Expand all children', collapseChildren: 'Collapse all children',
    closeOtherTabs: 'Close other tabs', closeRightTabs: 'Close tabs to the right', newBlankTab: 'New blank tab', reload: 'Reload', copyFolderPath: 'Copy folder path', searchInScope: 'Search in “{name}”…',
    type: 'Type', contains: 'Contains', containsValue: '{dirs} folders / {files} files', totalSize: 'Total size', size: 'Size', modifiedAt: 'Modified',
    htmlItems: '{count} items', htmlTitleSuffix: 'Folder Tree', htmlMeta: '{dirs} folders · {files} files · {size} total · Generated at {date}', copiedTree: '✓ Text tree copied to clipboard', exported: '✓ Exported: {path}', treeSuffix: '_tree',
  },
  zh: {
    appTitle: '文件夹树查看器', cancelScopeSearch: '取消范围搜索', searchCurrentTab: '搜索当前标签…', clearSearch: '清除搜索',
    openFolder: '打开文件夹', openFolderTitle: '新标签打开文件夹 (Ctrl+O)', expandAll: '全部展开', collapseAll: '全部折叠', fitWindow: '适应窗口 (居中)',
    refreshTitle: '左键：立即刷新 · 右键：自动刷新设置', autoRefreshTitle: '自动刷新（仅当前文件夹）', off: '关闭', every10s: '每 10 秒', every1m: '每 1 分钟', every5m: '每 5 分钟', every10m: '每 10 分钟', every30m: '每 30 分钟',
    layoutShape: '布局形状', layoutH: '树状·横向', layoutV: '树状·纵向', layoutRadial: '球状·放射', layoutHDesc: '从左到右展开，适合宽屏浏览', layoutVDesc: '从上到下展开，层级更直观', layoutRadialDesc: '中心向外扩散，适合总览大目录',
    export: '导出', exportTxt: '导出为文本树 (.txt)', exportMd: '导出为 Markdown (.md)', exportHtml: '导出为网页 (.html)', exportJson: '导出为 JSON (.json)', copyTextTree: '复制文本树到剪贴板',
    toggleHidden: '显示/隐藏 隐藏文件', switchLanguage: '切换语言', toggleTheme: '切换 亮色/暗色', minimize: '最小化', maximize: '最大化', close: '关闭',
    emptyTitle: '拖入或打开一个文件夹', emptySub: '生成可缩放的思维导图式目录', emptyHint: '也可以直接把文件夹拖到这里 · 每个文件夹一个标签页', scanning: '正在扫描…', zoomOut: '缩小', zoomIn: '放大', hintBar: '滚轮缩放 · 拖拽平移 · 右键菜单(锁定/复制路径等) · 双击展开/打开 · 拖卡片右侧加宽 · 悬停 1 秒看详情 · Esc 清除全部锁定', ready: '就绪', dropOverlay: '松开 — 新标签打开此文件夹', hiddenOn: '✓ 已显示隐藏文件', hiddenOff: '✓ 已隐藏隐藏文件',
    folder: '文件夹', file: '文件', typedFile: '{ext} 文件', newTab: '新标签', closeTabTitle: '关闭', blankTabTitle: '空白标签', addTabTitle: '新建标签页',
    refreshing: '正在刷新…', refreshFailed: '刷新失败：{error}', refreshed: '✓ 已刷新', standardLayout: '位置已是标准布局', resetPositionDone: '✓ 已重置位置', scanLimitFallback: '这个文件夹太大，无法安全加载。FolderTree 已在 {limit} 项时停止扫描。请重新拖入更小的文件夹、缩小目录范围，或谨慎提高扫描上限。',
    scanLimitTitle: '扫描数量上限', scanLimitMenuTitle: '扫描数量上限', customLimit: '自定义…', applyLimit: '应用', customLimitPrompt: '请输入最多扫描的项目数量（1–1,000,000）：', invalidLimit: '请输入 1 到 1,000,000 之间的数字。', highLimitWarning: '扫描超过 100,000 项可能占用更多内存并让软件变慢。确定使用 {limit} 项上限吗？', scanLimitSet: '✓ 扫描上限已设为 {limit} 项',
    emptyCannotRead: '无法读取此文件夹（{error}）', cannotRead: '无法读取：{error}', stats: '{dirs} 个文件夹 · {files} 个文件 · 共 {size} · {nodes} 项', matches: '{count} 个匹配', noMatches: '无匹配', matchPos: '{index}/{total} 个匹配',
    gripTitle: '拖动调整卡片宽度以显示完整名称', copyFullPath: '复制完整路径', copyName: '复制名称', unlockPath: '解锁路径', lockPath: '锁定路径并高亮', resetPosition: '重置位置', searchUnderFolder: '在此文件夹下搜索', openFolderSystem: '用系统打开文件夹', openSystem: '用系统打开', showInFolder: '在文件管理器中显示', expandChildren: '展开全部子级', collapseChildren: '折叠全部子级',
    closeOtherTabs: '关闭其他标签', closeRightTabs: '关闭右侧标签', newBlankTab: '新建空白标签', reload: '重新加载', copyFolderPath: '复制文件夹路径', searchInScope: '在「{name}」下搜索…',
    type: '类型', contains: '包含', containsValue: '{dirs} 文件夹 / {files} 文件', totalSize: '总大小', size: '大小', modifiedAt: '修改于',
    htmlItems: '{count} 项', htmlTitleSuffix: '目录树', htmlMeta: '{dirs} 个文件夹 · {files} 个文件 · 共 {size} · 生成于 {date}', copiedTree: '✓ 已复制文本树到剪贴板', exported: '✓ 已导出：{path}', treeSuffix: '_树',
  },
};
let currentLang = 'en';
function tr(key, vars = {}) {
  let text = (LANGS[currentLang] && LANGS[currentLang][key]) || LANGS.en[key] || key;
  return text.replace(/\{(\w+)\}/g, (_, k) => vars[k] == null ? '' : String(vars[k]));
}
function applyStaticI18n() {
  document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = tr(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-title]').forEach((el) => { el.title = tr(el.dataset.i18nTitle); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => { el.placeholder = tr(el.dataset.i18nPlaceholder); });
  document.title = tr('appTitle');
  const btn = $('btnLang'); if (btn) btn.textContent = currentLang === 'en' ? 'EN' : '中';
}
function setLang(lang, save = true) {
  currentLang = lang === 'zh' ? 'zh' : 'en';
  if (save) { try { localStorage.setItem('ft-lang', currentLang); } catch (_) {} }
  applyStaticI18n();
  if (typeof syncScanLimitMenu === 'function') syncScanLimitMenu();
  if (typeof syncLayoutPicker === 'function') syncLayoutPicker(layoutSel.value);
  if (typeof updateScopeChip === 'function') updateScopeChip(activeTab());
  if (typeof renderTabs === 'function') renderTabs();
  if (typeof render === 'function') render();
}

/* ===== 布局常量 ===== */
const HGAPX = 34, VGAP = 40;        // 卡片间隙（列间/同排间）与行高
const VLEVEL = 100;                 // 纵向树层高
const RING = 128, MIN_ARC = 116;    // 放射：更紧凑（总览靠圆点LOD呈密集圆盘，放大看卡片）
const CARD_DEFAULT = 200;           // 卡片默认固定宽度（未手动拉宽时）
const NODE_H = 34, PAD = 60;
const LOD_CAP = 1000;               // 视口内节点超过此数则只显示文件夹骨架
const DOT_SCALE = 0.5;              // 低于此缩放级别 → 卡片转为圆点（避免文字重叠）
const VIEW_MARGIN = 700;            // 预渲染余量(屏幕px)：视口在此范围内移动不重建 DOM
const DEFAULT_SCAN_LIMIT = 100000;
const HIGH_SCAN_LIMIT = 100000;
const MAX_SCAN_LIMIT = 1000000;

/* ===== 状态 ===== */
let tabs = [];
let activeId = null;
let tabSeq = 0;
let showHidden = false;
let scanLimit = DEFAULT_SCAN_LIMIT;
let searchTerm = '';

function activeTab() { return tabs.find((t) => t.id === activeId) || null; }

/* ===== 工具 ===== */
function fmtSize(b) {
  if (b == null) return '';
  if (b < 1024) return b + ' B';
  const u = ['KB', 'MB', 'GB', 'TB']; let n = b / 1024, i = 0;
  while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
  return n.toFixed(n < 10 ? 1 : 0) + ' ' + u[i];
}
function fmtDate(ms) { if (!ms) return ''; const d = new Date(ms); const p = (x) => String(x).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`; }
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function basename(p) { return p.replace(/[\\/]+$/, '').split(/[\\/]/).pop() || p; }
function parentDir(p) { const norm = p.replace(/[\\/]+$/, ''); const i = Math.max(norm.lastIndexOf('/'), norm.lastIndexOf('\\')); return i > 0 ? norm.slice(0, i) : norm; }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function fmtInt(n) { return Number(n || 0).toLocaleString(currentLang === 'zh' ? 'zh-CN' : 'en-US'); }
function normalizeScanLimit(value) {
  const n = Number(String(value).replace(/,/g, '').trim());
  if (!Number.isFinite(n) || n < 1 || n > MAX_SCAN_LIMIT) return null;
  return Math.floor(n);
}
function confirmHighScanLimit(value) {
  return value <= HIGH_SCAN_LIMIT || window.confirm(tr('highLimitWarning', { limit: fmtInt(value) }));
}
function syncScanLimitMenu() {
  const btn = $('btnLimit');
  if (btn) btn.textContent = fmtInt(scanLimit);
  const menu = $('limitMenu');
  if (menu) menu.querySelectorAll('.limit-item').forEach((it) => it.classList.toggle('active', Number(it.dataset.limit) === scanLimit));
}
function setScanLimit(value, save = true, announce = true) {
  const next = normalizeScanLimit(value);
  if (!next) { window.alert(tr('invalidLimit')); return false; }
  scanLimit = next;
  if (save) { try { localStorage.setItem('ft-scan-limit', String(scanLimit)); } catch (_) {} }
  syncScanLimitMenu();
  if (announce) statText.textContent = tr('scanLimitSet', { limit: fmtInt(scanLimit) });
  return true;
}

const ICONS = {
  dir: '📁', dirOpen: '📂',
  pdf: '📕', doc: '📘', docx: '📘', xls: '📗', xlsx: '📗', csv: '📊', ppt: '📙', pptx: '📙',
  txt: '📄', md: '📝', json: '🧾', xml: '🧾', yml: '🧾', yaml: '🧾',
  png: '🖼️', jpg: '🖼️', jpeg: '🖼️', gif: '🖼️', webp: '🖼️', svg: '🖼️', bmp: '🖼️', ico: '🖼️',
  mp4: '🎬', mov: '🎬', avi: '🎬', mkv: '🎬', webm: '🎬',
  mp3: '🎵', wav: '🎵', flac: '🎵', m4a: '🎵',
  zip: '🗜️', rar: '🗜️', '7z': '🗜️', gz: '🗜️', tar: '🗜️',
  js: '📜', ts: '📜', py: '🐍', html: '🌐', css: '🎨', java: '☕', go: '🐹', rs: '🦀', sh: '⚙️',
  exe: '⚙️', dmg: '💿', iso: '💿', db: '🗃️', sql: '🗃️',
};
// 有自定义图片图标的类型（renderer/icons/<key>.png）
const ICON_FILES = new Set(['dir', 'dirOpen', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'ppt', 'pptx', 'txt', 'md', 'json', 'xml', 'yml', 'yaml', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico', 'mp4', 'mov', 'avi', 'mkv', 'webm', 'mp3', 'wav', 'flac', 'm4a', 'zip', 'rar', '7z', 'gz', 'tar', 'js', 'ts', 'py', 'html', 'css', 'java', 'go', 'rs', 'sh', 'exe', 'dmg', 'iso', 'db', 'sql']);
function iconKey(n, open) { return n.isDir ? (open ? 'dirOpen' : 'dir') : n.ext; }
function iconHtml(n, open) { const k = iconKey(n, open); return ICON_FILES.has(k) ? `<img class="gicon" src="icons/${k}.png" alt="">` : `<span class="gicon">${iconFor(n, open)}</span>`; }
function iconFor(n, open) { return n.isDir ? (open ? ICONS.dirOpen : ICONS.dir) : (ICONS[n.ext] || '📄'); }
function typeLabel(n) { return n.isDir ? tr('folder') : (n.ext ? tr('typedFile', { ext: n.ext.toUpperCase() }) : tr('file')); }

/* ===== 标签页 ===== */
function newTabObj(path) {
  return { id: ++tabSeq, path: path || null, name: path ? basename(path) : tr('newTab'), root: null, stats: null, error: null, layout: layoutSel.value, transform: null, target: null, search: '', locks: new Set(), searchScope: null, searchFocus: null, _layout: null, _rendered: [], _matches: [], _matchIdx: -1 };
}
function newBlankTab() { const t = newTabObj(null); tabs.push(t); activeId = t.id; searchInput.value = ''; renderTabs(); render(); }
function loadIntoTarget(path) {
  const t = activeTab();
  if (t && !t.path && !t.root) { t.path = path; t.name = basename(path); loadTab(t); }
  else { const nt = newTabObj(path); tabs.push(nt); activeId = nt.id; renderTabs(); loadTab(nt); }
}
async function openFolderDialog() { const p = await window.api.openFolder(currentLang); if (p) loadIntoTarget(p); }

// 刷新当前标签：重新扫描磁盘，尽量保留展开状态/拖动位置/视角（手动同步文件夹变动）
let refreshing = false;
async function refreshActive() {
  const tab = activeTab(); if (!tab || !tab.path || refreshing || panning) return;  // 拖动/上一次未完成时跳过
  refreshing = true;
  // 记录当前展开/拖动/锁定/范围（按路径），刷新后恢复
  const openPaths = new Set(), userPos = new Map(), lockPaths = new Set();
  (function walk(n) { if (!n) return; if (n.isDir && n._open) openPaths.add(n.path); if (n._dx || n._dy) userPos.set(n.path, [n._dx, n._dy]); if (n.children) n.children.forEach(walk); })(tab.root);
  for (const ln of tab.locks) if (ln.path) lockPaths.add(ln.path);
  const scopePath = tab.searchScope ? tab.searchScope.path : null;
  const searchFocusPath = tab.searchFocus ? tab.searchFocus.path : null;
  statText.textContent = tr('refreshing');
  let res;
  try { res = await window.api.scan(tab.path, { showHidden, lang: currentLang, maxNodes: scanLimit }); }
  catch (err) { refreshing = false; statText.textContent = tr('refreshFailed', { error: err && err.message ? err.message : err }); return; }
  refreshing = false;
  if (res.error) {
    const msg = res.error === 'SCAN_LIMIT' ? tr('scanLimitFallback', { limit: fmtInt(res.limit || scanLimit) }) : tr('refreshFailed', { error: res.error });
    statText.textContent = msg;
    if (res.error === 'SCAN_LIMIT') {
      tab.root = null; tab.error = msg; tab.path = null; tab.name = tr('newTab'); tab.stats = null; tab.transform = null; tab.target = null; tab.search = ''; tab.locks = new Set(); tab.searchScope = null; tab.searchFocus = null; tab._layout = null;
      if (activeId === tab.id) { searchInput.value = ''; updateScopeChip(tab); window.alert(msg); renderTabs(); render(); }
    }
    return;
  }
  tab.root = res.root; tab.stats = res.stats; tab.error = null;
  setParents(tab.root, null);
  const byPath = new Map();
  // 恢复展开状态与拖动偏移（按路径匹配；新文件夹默认折叠）
  (function restore(n, depth) {
    byPath.set(n.path, n);
    if (n.isDir) n._open = openPaths.size ? openPaths.has(n.path) : depth < 1;
    const up = userPos.get(n.path); if (up) { n._dx = up[0]; n._dy = up[1]; }
    if (n.children) n.children.forEach((c) => restore(c, depth + 1));
  })(tab.root, 0);
  tab.root._open = true;            // 根始终展开
  tab.locks = new Set(); for (const p of lockPaths) { const nn = byPath.get(p); if (nn) tab.locks.add(nn); }  // 按路径恢复锁定
  tab.searchScope = scopePath ? (byPath.get(scopePath) || null) : null;   // 恢复范围
  tab.searchFocus = searchFocusPath ? (byPath.get(searchFocusPath) || null) : null;
  tab._layout = null;
  if (activeId === tab.id) updateScopeChip(tab);
  render({ relayout: true });       // tab.transform 未变 → 视角保持；search 文本也保留
  statText.textContent = tr('refreshed');
}
async function loadTab(tab) {
  if (activeId === tab.id) { emptyEl.hidden = true; loadingEl.hidden = false; statText.textContent = tr('scanning'); }
  let res = await window.api.scan(tab.path, { showHidden, lang: currentLang, maxNodes: scanLimit });
  if (res.error === 'NOT_DIR') { tab.path = parentDir(tab.path); tab.name = basename(tab.path); res = await window.api.scan(tab.path, { showHidden, lang: currentLang, maxNodes: scanLimit }); }
  if (activeId === tab.id) loadingEl.hidden = true;
  if (res.error) {
    const msg = res.error === 'SCAN_LIMIT' ? tr('scanLimitFallback', { limit: fmtInt(res.limit || scanLimit) }) : res.error;
    tab.root = null; tab.error = msg; tab.path = null; tab.name = tr('newTab'); tab.stats = null; tab.transform = null; tab.target = null; tab.search = ''; tab.locks = new Set(); tab.searchScope = null; tab.searchFocus = null; tab._layout = null;
    if (activeId === tab.id) { searchInput.value = ''; updateScopeChip(tab); if (res.error === 'SCAN_LIMIT') window.alert(msg); }
    renderTabs(); if (activeId === tab.id) render(); return;
  }
  tab.root = res.root; tab.stats = res.stats; tab.error = null;
  setParents(tab.root, null);   // 整棵树设置父指针 → isUnder/范围搜索对折叠的深层节点也有效
  setDefaultOpen(tab.root, 0);
  tab.locks = new Set(); tab.searchScope = null; tab.searchFocus = null; tab.transform = null; tab.target = null; tab.search = ''; tab._layout = null;
  if (activeId === tab.id) { searchInput.value = ''; updateScopeChip(tab); }
  renderTabs();
  if (activeId === tab.id) render({ fit: true, relayout: true });
}

function setParents(n, p) { n._parent = p; if (n.children) for (const c of n.children) setParents(c, n); }  // 全树父指针
function setDefaultOpen(n, d) { if (!n.isDir) return; n._open = d < 1; if (n.children) n.children.forEach((c) => setDefaultOpen(c, d + 1)); }  // 默认折叠：只展开根
function setAllOpen(n, open) { if (!n.isDir) return; n._open = open; if (n.children) n.children.forEach((c) => setAllOpen(c, open)); }
function resetSubtreePosition(t, n) {
  if (!t || !t._layout) return;
  const before = new Map();
  for (const node of t._layout.nodes) before.set(node, [node._cx, node._cy, node._w]);
  let changed = false;
  (function walk(node) {
    if (node._dx || node._dy) { node._dx = 0; node._dy = 0; changed = true; }
    if (node.children) node.children.forEach(walk);
  })(n);
  if (!changed) { statText.textContent = tr('standardLayout'); return; }
  relayoutTab(t, false);
  for (const node of t._layout.nodes) {
    const old = before.get(node);
    if (old) { node._cx = old[0]; node._cy = old[1]; node._w = old[2]; }
  }
  startLayoutTween(t);
  statText.textContent = tr('resetPositionDone');
}

function renderTabs() {
  tabbar.innerHTML = '';
  for (const t of tabs) {
    const el = document.createElement('div');
    el.className = 'tab' + (t.id === activeId ? ' active' : '');
    const icon = t.error ? '⚠️' : (t.root ? '📂' : '🗂️');
    el.innerHTML = `<span class="tab-icon">${icon}</span><span class="tab-name">${escapeHtml(t.name)}</span><span class="tab-close" title="${tr('closeTabTitle')}">×</span>`;
    el.title = t.path || tr('blankTabTitle');
    el.addEventListener('click', (e) => { if (e.target.classList.contains('tab-close')) closeTab(t.id); else switchTab(t.id); });
    el.addEventListener('auxclick', (e) => { if (e.button === 1) closeTab(t.id); });
    el.addEventListener('contextmenu', (e) => { e.preventDefault(); e.stopPropagation(); openTabMenu(t, e.clientX, e.clientY); });
    tabbar.appendChild(el);
  }
  const add = document.createElement('div');
  add.className = 'tab-add'; add.textContent = '＋'; add.title = tr('addTabTitle');
  add.addEventListener('click', newBlankTab);
  tabbar.appendChild(add);
}
// 释放非活动标签的派生缓存（保留原始树 root，切回时重建），降低多标签内存
function freeTabCache(tab) {
  if (!tab) return;
  if (tab._lraf) { cancelAnimationFrame(tab._lraf); tab._lraf = null; }
  tab._layout = null; tab._rendered = []; tab._visEdges = null; tab._prevNodes = null; tab._builtRect = null;
}
function switchTab(id) {
  if (id === activeId) return;
  freeTabCache(activeTab());   // 切走前释放上一个标签的布局缓存
  activeId = id; const t = activeTab(); renderTabs();
  if (t) { layoutSel.value = t.layout; syncLayoutPicker(t.layout); searchInput.value = t.search; updateScopeChip(t); }
  if (t && !t.root && t.path) { loadTab(t); return; }
  render();
}
function closeTab(id) {
  const idx = tabs.findIndex((t) => t.id === id); if (idx < 0) return;
  tabs.splice(idx, 1);
  if (activeId === id) {
    const next = tabs[idx] || tabs[idx - 1] || null;
    activeId = next ? next.id : null;
    if (next) { layoutSel.value = next.layout; searchInput.value = next.search; updateScopeChip(next); } else { searchInput.value = ''; updateScopeChip(null); }
  }
  renderTabs(); render();
}

/* ===== 布局计算（纯数学，不建 DOM） ===== */
let curScope = null;  // 当前范围搜索的根节点（null=全文）
let layoutDirty = false;  // openAncestorsOfMatches 是否真的改变了展开状态
function matchNode(n) { return searchTerm && n.name.toLowerCase().includes(searchTerm); }
function effMatch(n) { return matchNode(n) && (!curScope || n === curScope || isUnder(n, curScope)); }
function openAncestorsOfMatches(n) {
  let has = effMatch(n);
  if (n.isDir && n.children) { let ch = false; for (const c of n.children) if (openAncestorsOfMatches(c)) ch = true; if (ch) { if (!n._open) { n._open = true; layoutDirty = true; } has = true; } }
  return has;
}
// 卡片宽度：默认固定 CARD_DEFAULT；用户拉宽后用 _userW
function nodeWidth(n) { return n._userW || CARD_DEFAULT; }
// 显示完整文件名所需的卡片宽度（用 canvas 量测真实文字宽度）
const _measureCtx = document.createElement('canvas').getContext('2d');
function fullCardWidth(n) {
  _measureCtx.font = '600 13px -apple-system, "Segoe UI", "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif';
  const tw = _measureCtx.measureText(n.name).width;
  const badge = (n.isDir && (n.fileCount || n.dirCount)) ? 36 : 0;
  return Math.ceil(34 + tw + badge + 26);   // 图标+间隙 + 文字 + 角标 + 内边距/手柄
}
// 碰撞避让（作用于目标坐标 _tx/_ty/_tw）：沿最小重叠轴把重叠卡片推进空隙（根固定）
function relaxOverlap(nodes) {
  const GAPX = 12, GAPY = 10, CELL = 220, ITER = 90;
  for (let it = 0; it < ITER; it++) {
    const grid = new Map();
    for (const n of nodes) {
      const gx = Math.floor(n._tx / CELL), gy = Math.floor(n._ty / CELL);
      const k = gx + ',' + gy; let arr = grid.get(k); if (!arr) grid.set(k, arr = []); arr.push(n);
    }
    let moved = false;
    for (const a of nodes) {
      const gx = Math.floor(a._tx / CELL), gy = Math.floor(a._ty / CELL);
      for (let ix = -1; ix <= 1; ix++) for (let iy = -1; iy <= 1; iy++) {
        const arr = grid.get((gx + ix) + ',' + (gy + iy)); if (!arr) continue;
        for (const b of arr) {
          if (b._seq <= a._seq) continue;
          const dx = b._tx - a._tx, dy = b._ty - a._ty;
          const ox = (a._tw + b._tw) / 2 + GAPX - Math.abs(dx);
          const oy = (NODE_H + GAPY) - Math.abs(dy);
          if (ox > 0 && oy > 0) {
            moved = true;
            if (ox < oy) { const p = ox / 2 * (dx >= 0 ? 1 : -1); if (a._depth) a._tx -= p; if (b._depth) b._tx += p; }
            else { const p = oy / 2 * (dy >= 0 ? 1 : -1); if (a._depth) a._ty -= p; if (b._depth) b._ty += p; }
          }
        }
      }
    }
    if (!moved) break;
  }
}
// 把单个被拖卡片解决到空隙（只移动它，其他不动）；写回 _dx/_dy 使其位置持久
function resolveDragged(n, nodes) {
  const near = nodes.filter((b) => b !== n && Math.abs(b._tx - n._tx) < 700 && Math.abs(b._ty - n._ty) < 400);
  for (let it = 0; it < 90; it++) {
    let hit = false;
    for (const b of near) {
      const dx = n._tx - b._tx, dy = n._ty - b._ty;
      const ox = (n._tw + b._tw) / 2 + 12 - Math.abs(dx);
      const oy = (NODE_H + 10) - Math.abs(dy);
      if (ox > 0 && oy > 0) { hit = true; if (ox < oy) n._tx += ox * (dx >= 0 ? 1 : -1); else n._ty += oy * (dy >= 0 ? 1 : -1); }
    }
    if (!hit) break;
  }
  n._dx = n._tx - n._bx; n._dy = n._ty - n._by;
}
// 计算目标布局：写入 _tx/_ty/_tw（目标），_bx/_by（未拖动的基准），叠加用户拖动 _dx/_dy
function computeLayout(root, mode) {
  const nodes = [], edges = []; let leaf = 0, maxDepth = 0;
  (function assign(n, depth, parent) {
    n._depth = depth; n._parent = parent; n._el = null; n._vis = false; n._tw = nodeWidth(n);
    if (depth > maxDepth) maxDepth = depth;
    n._seq = nodes.length; nodes.push(n);
    const kids = (n.isDir && n._open && n.children && n.children.length) ? n.children : null;
    n._kids = kids || [];
    if (!kids) { n._order = leaf++; }
    else { for (const k of kids) { assign(k, depth + 1, n); edges.push({ p: n, c: k }); } n._order = (kids[0]._order + kids[kids.length - 1]._order) / 2; }
  })(root, 0, null);
  const total = Math.max(1, leaf);

  if (mode === 'h') {
    const maxW = []; for (const n of nodes) maxW[n._depth] = Math.max(maxW[n._depth] || 0, n._tw);
    const colX = [0]; for (let d = 1; d <= maxDepth; d++) colX[d] = colX[d - 1] + (maxW[d - 1] || 0) + HGAPX;
    for (const n of nodes) { n._tx = colX[n._depth] + n._tw / 2; n._ty = n._order * VGAP; n._ang = null; }
  } else if (mode === 'v') {
    let cur = 0;
    (function place(n) {
      if (!n._kids.length) { n._tx = cur + n._tw / 2; cur += n._tw + HGAPX; }
      else { for (const k of n._kids) place(k); n._tx = (n._kids[0]._tx + n._kids[n._kids.length - 1]._tx) / 2; }
      n._ty = n._depth * VLEVEL; n._ang = null;
    })(root);
  } else { // radial
    let ringStep = RING; const needR = (total * MIN_ARC) / (2 * Math.PI); ringStep = Math.max(RING, needR / Math.max(1, maxDepth));
    for (const n of nodes) {
      const ang = (n._order / total) * Math.PI * 2;
      const j = Math.sin(n._order * 12.9898 + n._depth * 78.233) * 43758.5453; const fr = j - Math.floor(j);
      const r = n._depth === 0 ? 0 : n._depth * ringStep * (0.8 + fr * 0.4);
      n._tx = Math.cos(ang) * r; n._ty = Math.sin(ang) * r; n._ang = ang;
    }
    if (nodes.length <= 4000) relaxOverlap(nodes);
  }
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const n of nodes) { minX = Math.min(minX, n._tx - n._tw / 2); maxX = Math.max(maxX, n._tx + n._tw / 2); minY = Math.min(minY, n._ty); maxY = Math.max(maxY, n._ty); }
  const offX = PAD - minX, offY = PAD - minY + 30;
  for (const n of nodes) { n._tx += offX; n._ty += offY; n._bx = n._tx; n._by = n._ty; if (n._dx) n._tx += n._dx; if (n._dy) n._ty += n._dy; }
  return { nodes, edges, w: (maxX - minX) + PAD * 2, h: (maxY - minY) + 60 + PAD * 2, maxDepth };
}
function relayoutTab(t, animate) {
  t._layout = computeLayout(t.root, t.layout);
  canvas.style.width = t._layout.w + 'px'; canvas.style.height = t._layout.h + 'px';
  edgesSvg.setAttribute('width', t._layout.w); edgesSvg.setAttribute('height', t._layout.h);
  const nodes = t._layout.nodes;
  if (animate && t._prevNodes && nodes.length <= 4000) {
    for (const n of nodes) {
      if (!t._prevNodes.has(n) || n._cx === undefined) {   // 新出现的节点从父节点当前位置冒出
        const p = n._parent;
        n._cx = (p && p._cx !== undefined) ? p._cx : n._tx;
        n._cy = (p && p._cy !== undefined) ? p._cy : n._ty;
        n._w = n._tw;
      }
    }
    startLayoutTween(t);
  } else {
    for (const n of nodes) { n._cx = n._tx; n._cy = n._ty; n._w = n._tw; }
    if (t._lraf) { cancelAnimationFrame(t._lraf); t._lraf = null; }
  }
  t._prevNodes = new Set(nodes);
}
// 布局补间：显示坐标 _cx/_cy/_w 平滑逼近目标；每帧只更新已有元素的位置(不重建 DOM) + 刷新连线
function startLayoutTween(t) {
  if (t._lraf) cancelAnimationFrame(t._lraf);
  const nodes = t._layout.nodes;
  for (const n of nodes) { n._sx = n._cx; n._sy = n._cy; n._sw = n._w; }
  const t0 = performance.now(), D = 300, ease = (x) => 1 - Math.pow(1 - x, 3);
  const step = (now) => {
    if (activeTab() !== t || t._layout.nodes !== nodes) { t._lraf = null; return; }
    const k = ease(clamp((now - t0) / D, 0, 1));
    for (const n of nodes) { n._cx = n._sx + (n._tx - n._sx) * k; n._cy = n._sy + (n._ty - n._sy) * k; n._w = n._sw + (n._tw - n._sw) * k; }
    for (const n of t._rendered) { const el = n._el; if (el) { el.style.left = n._cx + 'px'; el.style.top = n._cy + 'px'; el.style.width = n._w + 'px'; } }
    refreshEdges(t);
    if (t.locks && t.locks.size) applyHighlight(t);
    if (k < 1) t._lraf = requestAnimationFrame(step);
    else { for (const n of nodes) { n._cx = n._tx; n._cy = n._ty; n._w = n._tw; } t._lraf = null; renderScene(); }
  };
  t._lraf = requestAnimationFrame(step);
}
// n 是否严格位于 anc 之下（anc 是 n 的祖先）
function isUnder(n, anc) { let c = n._parent; while (c) { if (c === anc) return true; c = c._parent; } return false; }
// n 是否在任一锁定节点的"血缘"内（祖先链 / 自身 / 后代）
function inLineage(t, n) { for (const f of t.locks) { if (n === f || isUnder(n, f) || isUnder(f, n)) return true; } return false; }

/* ===== 视口裁剪渲染 ===== */
function worldRect(tr, marginPx) {
  const vw = viewport.clientWidth, vh = viewport.clientHeight, s = tr.scale, m = (marginPx == null ? VIEW_MARGIN : marginPx) / s;
  return { l: (-tr.tx) / s - m, r: (vw - tr.tx) / s + m, t: (-tr.ty) / s - m, b: (vh - tr.ty) / s + m };
}
function edgesPathD(t) { let d = ''; for (const e of (t._visEdges || [])) d += edgePath(e.p, e.c, t.layout) + ' '; return d; }
// 合并连线，但排除与某节点相连的边（拖动时该节点的线单独画，其余不再重绘）
function edgesPathDExcept(t, node) { let d = ''; for (const e of (t._visEdges || [])) { if (e.p === node || e.c === node) continue; d += edgePath(e.p, e.c, t.layout) + ' '; } return d; }
// 仅刷新连线（动画时跟随，开销极小：只改一个 path 的 d）
function refreshEdges(t) { if (t._baseEdge) t._baseEdge.setAttribute('d', edgesPathD(t)); }
function edgePath(p, c, mode) {
  if (mode === 'v') { const dy = (c._cy - p._cy) / 2; return `M${p._cx},${p._cy} C${p._cx},${p._cy + dy} ${c._cx},${c._cy - dy} ${c._cx},${c._cy}`; }
  if (mode === 'radial') return `M${p._cx},${p._cy} L${c._cx},${c._cy}`;
  const dx = (c._cx - p._cx) / 2; return `M${p._cx},${p._cy} C${p._cx + dx},${p._cy} ${c._cx - dx},${c._cy} ${c._cx},${c._cy}`;
}
// 卡片配色：depth0(根)=棕；文件夹随层级加深而变浅；文件用最浅叶子色
function dirColor(depth) {
  if (depth === 0) return { bg: '#6b4f28', bd: '#543d1d', fg: '#ffffff' };
  const L = Math.min(32 + (depth - 1) * 9, 80);
  const fg = L < 58 ? '#ffffff' : '#173324';
  return { bg: `hsl(132 40% ${L}%)`, bd: `hsl(132 42% ${Math.max(L - 11, 18)}%)`, fg };
}
function leafColor() { return { bg: 'hsl(132 48% 88%)', bd: 'hsl(132 38% 72%)', fg: '#173324' }; }
function buildNodeEl(t, n) {
  const el = document.createElement('div');
  let cls = 'gnode ' + (n.isDir ? 'dir' : 'file');
  if (n.error) cls += ' err';
  if (n.isDir && n.children && n.children.length && !n._open) cls += ' collapsed';
  const searching = !!t.search;
  const locksActive = t.locks && t.locks.size;
  if (searching && n._isMatch) cls += ' match';
  let dim = false;
  if (searching && !n._isMatch) dim = true;
  if (locksActive && !inLineage(t, n)) dim = true;   // 锁定时，不在血缘内的节点透明
  if (dim) cls += ' dim';
  el.className = cls;
  let label;
  if (searching && n._isMatch) { const i = n.name.toLowerCase().indexOf(searchTerm); label = escapeHtml(n.name.slice(0, i)) + '<span class="hl">' + escapeHtml(n.name.slice(i, i + searchTerm.length)) + '</span>' + escapeHtml(n.name.slice(i + searchTerm.length)); }
  else label = escapeHtml(n.name);
  let badge = '';
  if (n.isDir && (n.fileCount || n.dirCount)) badge = `<span class="gbadge">${(n.fileCount || 0) + (n.dirCount || 0)}</span>`;
  else if (n.error) badge = `<span class="gbadge">${n.error}</span>`;
  el.innerHTML = `${iconHtml(n, n.isDir && n._open)}<span class="glabel">${label}</span>${badge}<span class="grip" title="${tr('gripTitle')}"></span>`;
  el.style.left = n._cx + 'px'; el.style.top = n._cy + 'px'; el.style.width = n._w + 'px';
  // 文件夹按层级上色；文件使用最浅的叶子色，避免文件卡片透明发虚
  const col = n.isDir ? dirColor(n._depth) : leafColor();
  el.style.background = col.bg; el.style.borderColor = col.bd; el.style.color = col.fg;
  const bdg = el.querySelector('.gbadge'); if (bdg) { bdg.style.color = col.fg; bdg.style.background = 'rgba(255,255,255,.18)'; }
  bindNode(t, el, n);
  bindResize(t, el, n);
  return el;
}
// 拖动右侧手柄 → 加宽卡片看全名，松手后重排把邻居挤开
function bindResize(t, el, n) {
  const grip = el.querySelector('.grip'); if (!grip) return;
  grip.addEventListener('mousedown', (e) => {
    e.stopPropagation(); e.preventDefault();
    const startX = e.clientX, startW = n._w, scale = t.transform.scale;
    let moved = false;
    hideTooltip();
    const onMove = (ev) => {
      if (!moved && Math.abs(ev.clientX - startX) > 2) { moved = true; el.classList.add('resizing'); }
      if (!moved) return;
      const w = clamp(startW + (ev.clientX - startX) / scale, 64, 1400);
      n._userW = w; n._w = w; el.style.width = w + 'px';
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp);
      el.classList.remove('resizing');
      if (moved) render({ relayout: true, animate: true });   // 拖动结束：邻居平滑让位
    };
    document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
  });
  // 双击手柄：弹性拉到能看全文件名的适配宽度（再双击则恢复默认）
  grip.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    const full = clamp(fullCardWidth(n), CARD_DEFAULT, 2000);
    n._userW = (n._userW && Math.abs(n._userW - full) < 2) ? null : full;
    render({ relayout: true, animate: true });   // 宽度弹性过渡
  });
}
function renderScene(rectArg) {
  const t = activeTab(); if (!t || !t._layout) return;
  if (t._rendered) for (const n of t._rendered) { n._el = null; n._vis = false; }
  const rect = rectArg || worldRect(t.transform);
  t._builtRect = rect;

  // 裁剪：只取视口(含余量)内的节点
  let vis = [];
  for (const n of t._layout.nodes) if (n._cx >= rect.l && n._cx <= rect.r && n._cy >= rect.t && n._cy <= rect.b) vis.push(n);
  if (vis.length > LOD_CAP) vis = vis.filter((n) => n.isDir || n._isMatch || inLineage(t, n));
  for (const n of vis) n._vis = true;

  // 节点
  const nf = document.createDocumentFragment();
  for (const n of vis) { const el = buildNodeEl(t, n); n._el = el; nf.appendChild(el); }
  nodesLayer.replaceChildren(nf);

  // 连线：可见的全部合并为一条 base path（极致性能），高亮另用叠加层
  const visEdges = [];
  for (const e of t._layout.edges) if (e.p._vis || e.c._vis) visEdges.push(e);
  t._visEdges = visEdges;
  edgesSvg.replaceChildren();
  const base = document.createElementNS(SVGNS, 'path');
  base.setAttribute('class', 'edge'); base.setAttribute('d', edgesPathD(t));
  edgesSvg.appendChild(base);
  t._baseEdge = base;
  const hl = document.createElementNS(SVGNS, 'g'); hl.setAttribute('id', 'hlEdges');
  edgesSvg.appendChild(hl);

  t._rendered = vis;
  applyTransform();              // 同步圆点 LOD class
  applyHighlight(t);             // 重画锁定高亮
}
// 视口在已渲染范围内则跳过重建（平移/缩放时保持纯 GPU 合成，高帧率）
function maybeRefresh() {
  const t = activeTab(); if (!t || !t._layout) return;
  if (!t._builtRect) { renderScene(); return; }
  const v = worldRect(t.transform, 0), b = t._builtRect;
  if (v.l >= b.l && v.r <= b.r && v.t >= b.t && v.b <= b.b) return;
  renderScene();
}

/* ===== 渲染入口 ===== */
function showEmpty(title) {
  nodesLayer.innerHTML = ''; edgesSvg.innerHTML = '';
  emptyEl.hidden = false; zoomCtl.hidden = true; hintBar.hidden = true;
  emptyEl.querySelector('.empty-title').textContent = title;
  searchCount.textContent = '';
}
function render(opts = {}) {
  const t = activeTab();
  if (!t) { showEmpty(tr('emptyTitle')); statText.textContent = tr('ready'); return; }
  if (!t.root) { showEmpty(t.error ? tr('emptyCannotRead', { error: t.error }) : tr('emptyTitle')); statText.textContent = t.error ? tr('cannotRead', { error: t.error }) : tr('ready'); return; }
  emptyEl.hidden = true; zoomCtl.hidden = false; hintBar.hidden = false;

  searchTerm = t.search;
  curScope = t.searchScope || null;   // 范围搜索：限定在锁定路径子树内
  let needLayout = opts.relayout || !t._layout;
  if (searchTerm) { layoutDirty = false; openAncestorsOfMatches(t.root); if (layoutDirty) needLayout = true; }  // 仅展开状态真变了才重排
  if (needLayout) relayoutTab(t, opts.animate);

  if (searchTerm) { t._matches = []; for (const n of t._layout.nodes) { const m = effMatch(n); n._isMatch = m; if (m) t._matches.push(n); } }
  else { for (const n of t._layout.nodes) n._isMatch = false; t._matches = []; }

  if (!t.transform) { t.transform = computeInitialView(t); t.target = null; }
  else if (opts.fit) { t.transform = computeFit(t._layout.w, t._layout.h); t.target = null; }
  renderScene();

  const s = t.stats || {};
  statText.textContent = tr('stats', { dirs: s.dirCount || 0, files: s.fileCount || 0, size: fmtSize(s.size || 0), nodes: s.nodes || 0 });
  searchCount.textContent = searchTerm ? (t._matches.length ? tr('matches', { count: t._matches.length }) : tr('noMatches')) : '';
}

/* ===== 节点交互 ===== */
let hoverTimer = null;
function bindNode(t, el, n) {
  // 拖动卡片改位置：其他卡片不动；落点若重叠，被拖卡自动滑入最近空隙
  el.addEventListener('mousedown', (e) => {
    if (e.button !== 0 || e.target.classList.contains('grip')) return;
    e.stopPropagation();
    const startX = e.clientX, startY = e.clientY, scale = t.transform.scale;
    const baseCx = n._cx, baseCy = n._cy;
    let moved = false, nx = baseCx, ny = baseCy, incident = null, dragEdgesEl = null;
    hideTooltip();
    const onMove = (ev) => {
      if (!moved && Math.abs(ev.clientX - startX) + Math.abs(ev.clientY - startY) > 3) {
        moved = true; el.classList.add('dragging');
        // 把被拖卡片相连的线拆出来单独画；其余线一次性画好、之后不再重绘
        incident = (t._visEdges || []).filter((e) => e.p === n || e.c === n);
        if (t._baseEdge) t._baseEdge.setAttribute('d', edgesPathDExcept(t, n));
        dragEdgesEl = document.createElementNS(SVGNS, 'path'); dragEdgesEl.setAttribute('class', 'edge');
        edgesSvg.appendChild(dragEdgesEl);
      }
      if (!moved) return;
      nx = baseCx + (ev.clientX - startX) / scale; ny = baseCy + (ev.clientY - startY) / scale;
      n._cx = nx; n._cy = ny; el.style.left = nx + 'px'; el.style.top = ny + 'px';
      let d = ''; for (const e of incident) d += edgePath(e.p, e.c, t.layout) + ' ';   // 只重绘被拖卡片的线
      dragEdgesEl.setAttribute('d', d);
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp);
      if (dragEdgesEl) { dragEdgesEl.remove(); dragEdgesEl = null; }
      el.classList.remove('dragging');
      if (!moved) return;
      n._dx = (n._dx || 0) + (nx - baseCx); n._dy = (n._dy || 0) + (ny - baseCy);
      relayoutTab(t, false);               // 重算目标(含落点)，其他卡片位置不变
      resolveDragged(n, t._layout.nodes);  // 只把被拖卡解到空隙
      n._cx = nx; n._cy = ny;              // 动画起点=落点 → 弹向空隙
      startLayoutTween(t);
    };
    document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
  });
  el.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    if (n.isDir && n.children && n.children.length) {
      const opening = !n._open; n._open = opening;
      render({ relayout: true, animate: true });
      if (opening && n._kids && n._kids.length) flyTo(n._kids[Math.floor(n._kids.length / 2)]);  // 居中到中间子节点
    } else if (n.path) window.api.open(n.path);
  });
  el.addEventListener('contextmenu', (e) => { e.preventDefault(); e.stopPropagation(); openCtxMenu(t, n, e.clientX, e.clientY); });
  el.addEventListener('mouseenter', () => {
    applyHighlight(t, n);
    clearTimeout(hoverTimer); hoverTimer = setTimeout(() => showTooltip(n, el), 1000);
  });
  el.addEventListener('mouseleave', () => { if (t.searchFocus === n) t.searchFocus = null; clearTimeout(hoverTimer); hideTooltip(); applyHighlight(t); });
}
// 锁定/解锁路径；锁定时把"范围搜索"指向该节点
function toggleLock(t, n) {
  if (t.locks.has(n)) { t.locks.delete(n); if (t.searchScope === n) t.searchScope = null; }
  else { t.locks.add(n); t.searchScope = n; }
  updateScopeChip(t);
  if (t.search) render(); else renderScene();
}

/* ===== 右键菜单 ===== */
const ctxMenu = $('ctxMenu');
function closeCtxMenu() { ctxMenu.hidden = true; }
function showMenu(titleHtml, items, x, y) {
  ctxMenu.innerHTML = titleHtml ? `<div class="ctx-title">${titleHtml}</div>` : '';
  for (const it of items) {
    if (it.sep) { const s = document.createElement('div'); s.className = 'ctx-sep'; ctxMenu.appendChild(s); continue; }
    const d = document.createElement('div'); d.className = 'ctx-item' + (it.disabled ? ' disabled' : '');
    d.innerHTML = `<span class="ci-ico">${it.ico || ''}</span><span>${it.label}</span>`;
    if (!it.disabled) d.addEventListener('click', (ev) => { ev.stopPropagation(); closeCtxMenu(); it.fn(); });
    ctxMenu.appendChild(d);
  }
  ctxMenu.hidden = false;
  const r = ctxMenu.getBoundingClientRect();
  ctxMenu.style.left = Math.min(x, window.innerWidth - r.width - 8) + 'px';
  ctxMenu.style.top = Math.min(y, window.innerHeight - r.height - 8) + 'px';
}
function openCtxMenu(t, n, x, y) {
  const locked = t.locks.has(n);
  const items = [
    { ico: '📋', label: tr('copyFullPath'), fn: () => window.api.copy(n.path) },
    { ico: '🏷️', label: tr('copyName'), fn: () => window.api.copy(n.name) },
    { sep: true },
    { ico: locked ? '🔓' : '🔒', label: locked ? tr('unlockPath') : tr('lockPath'), fn: () => toggleLock(t, n) },
  ];
  if (n.isDir) {
    items.push({ ico: '↩', label: tr('resetPosition'), fn: () => resetSubtreePosition(t, n) });
    items.push({ ico: '🔍', label: tr('searchUnderFolder'), fn: () => { t.locks.add(n); t.searchScope = n; updateScopeChip(t); searchInput.focus(); if (t.search) render(); else renderScene(); } });
  }
  items.push({ sep: true });
  items.push({ ico: '📂', label: n.isDir ? tr('openFolderSystem') : tr('openSystem'), fn: () => window.api.open(n.path) });
  items.push({ ico: '🗂️', label: tr('showInFolder'), fn: () => window.api.showInFolder(n.path) });
  if (n.isDir && n.children && n.children.length) {
    items.push({ sep: true });
    items.push({ ico: '⊕', label: tr('expandChildren'), fn: () => { setAllOpen(n, true); render({ relayout: true, animate: true }); } });
    items.push({ ico: '⊖', label: tr('collapseChildren'), fn: () => { setAllOpen(n, false); n._open = true; render({ relayout: true, animate: true }); } });
  }
  showMenu(`${iconFor(n, false)} ${escapeHtml(n.name)}`, items, x, y);
}
// 标签页右键菜单（浏览器式）
function openTabMenu(tab, x, y) {
  const idx = tabs.findIndex((t) => t.id === tab.id);
  const others = tabs.length > 1, hasRight = idx < tabs.length - 1;
  const items = [
    { ico: '✕', label: tr('closeTabTitle'), fn: () => closeTab(tab.id) },
    { ico: '⊘', label: tr('closeOtherTabs'), disabled: !others, fn: () => closeOtherTabs(tab.id) },
    { ico: '⇥', label: tr('closeRightTabs'), disabled: !hasRight, fn: () => closeRightTabs(tab.id) },
    { sep: true },
    { ico: '➕', label: tr('newBlankTab'), fn: newBlankTab },
    { ico: '🔄', label: tr('reload'), disabled: !tab.path, fn: () => { switchTab(tab.id); loadTab(tab); } },
    { sep: true },
    { ico: '📋', label: tr('copyFolderPath'), disabled: !tab.path, fn: () => window.api.copy(tab.path) },
    { ico: '🗂️', label: tr('showInFolder'), disabled: !tab.path, fn: () => window.api.showInFolder(tab.path) },
  ];
  showMenu(`📂 ${escapeHtml(tab.name)}`, items, x, y);
}
function closeOtherTabs(id) {
  tabs = tabs.filter((t) => t.id === id);
  activeId = id; const t = activeTab();
  if (t) { layoutSel.value = t.layout; syncLayoutPicker(t.layout); searchInput.value = t.search; updateScopeChip(t); }
  renderTabs(); if (t && !t.root && t.path) loadTab(t); else render();
}
function closeRightTabs(id) {
  const idx = tabs.findIndex((t) => t.id === id); if (idx < 0) return;
  tabs = tabs.slice(0, idx + 1);
  if (!tabs.some((t) => t.id === activeId)) { activeId = id; const t = activeTab(); if (t) { layoutSel.value = t.layout; syncLayoutPicker(t.layout); searchInput.value = t.search; updateScopeChip(t); } }
  renderTabs(); render();
}

/* ===== 范围搜索标签 ===== */
function updateScopeChip(t) {
  const chip = $('scopeChip');
  if (t && t.searchScope) {
    $('scopeName').textContent = t.searchScope.name;
    chip.hidden = false;
    searchInput.placeholder = tr('searchInScope', { name: t.searchScope.name });
    searchInput.style.paddingLeft = (chip.offsetWidth + 34) + 'px';
  } else {
    chip.hidden = true;
    searchInput.placeholder = tr('searchCurrentTab');
    searchInput.style.paddingLeft = '';
  }
}

// 高亮：祖先路径=荧光金，后代子文件夹=灰，其余透明；粒子只叠加在路径线上，减少重绘
function clearHL() {
  nodesLayer.querySelectorAll('.path-hi,.sub-hi').forEach((e) => e.classList.remove('path-hi', 'sub-hi'));
  const g = document.getElementById('hlEdges'); if (g) g.replaceChildren();
}
function applyHighlight(t, hover) {
  clearHL();
  const focus = [...t.locks];
  if (t.searchFocus && !focus.includes(t.searchFocus)) focus.push(t.searchFocus);
  if (hover && !focus.includes(hover)) focus.push(hover);
  if (!focus.length) return;
  // 节点：先标灰后代，再标黑路径（黑覆盖灰）
  for (const r of t._rendered) {
    if (!r._el) continue;
    for (const f of focus) { if (r !== f && isUnder(r, f)) { r._el.classList.add('sub-hi'); break; } }
  }
  for (const f of focus) { let c = f; while (c) { if (c._el) { c._el.classList.remove('sub-hi'); c._el.classList.add('path-hi'); } c = c._parent; } }
  // 连线叠加层：黑路径 + 灰后代
  const g = document.getElementById('hlEdges'); if (!g) return;
  let dPath = '', dSub = '';
  for (const e of (t._visEdges || [])) {
    let onPath = false, onSub = false;
    for (const f of focus) {
      if (e.c === f || isUnder(f, e.c)) { onPath = true; break; }      // 边的子端在某焦点的祖先链上 → 黑
      if (e.p === f || isUnder(e.p, f)) onSub = true;                   // 边位于焦点子树内 → 灰
    }
    if (onPath) dPath += edgePath(e.p, e.c, t.layout) + ' ';
    else if (onSub) dSub += edgePath(e.p, e.c, t.layout) + ' ';
  }
  if (dSub) { const p = document.createElementNS(SVGNS, 'path'); p.setAttribute('class', 'edge edge-sub'); p.setAttribute('d', dSub); g.appendChild(p); }
  if (dPath) {
    const p = document.createElementNS(SVGNS, 'path'); p.setAttribute('class', 'edge edge-hi'); p.setAttribute('d', dPath); g.appendChild(p);
    // 只复制一条轻量虚线 path 做粒子流光；大视图/大量边时 CSS 动画仍是单元素，避免逐粒子 DOM。
    const particles = document.createElementNS(SVGNS, 'path'); particles.setAttribute('class', 'edge edge-particles'); particles.setAttribute('d', dPath); g.appendChild(particles);
  }
}

/* ===== 悬浮卡片（图片缩略图 / 视频封面） ===== */
const IMG_EXT = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'ico', 'svg', 'avif']);
const VID_EXT = new Set(['mp4', 'mov', 'avi', 'mkv', 'webm', 'm4v']);
function fileUrl(p) { let pp = p.replace(/\\/g, '/'); if (!pp.startsWith('/')) pp = '/' + pp; return 'file://' + encodeURI(pp); }
function showTooltip(n, el) {
  if (!n.path) return;
  let media = '';
  if (!n.isDir && n.ext) {
    if (IMG_EXT.has(n.ext)) media = `<div class="tt-media"><img src="${fileUrl(n.path)}" alt=""></div>`;
    else if (VID_EXT.has(n.ext)) media = `<div class="tt-media"><video src="${fileUrl(n.path)}" muted preload="metadata"></video></div>`;
  }
  let rows = `<div class="tt-row"><span class="tt-key">${tr('type')}</span><span class="tt-val">${typeLabel(n)}</span></div>`;
  if (n.isDir) { rows += `<div class="tt-row"><span class="tt-key">${tr('contains')}</span><span class="tt-val">${tr('containsValue', { dirs: n.dirCount || 0, files: n.fileCount || 0 })}</span></div><div class="tt-row"><span class="tt-key">${tr('totalSize')}</span><span class="tt-val">${fmtSize(n.size || 0)}</span></div>`; }
  else rows += `<div class="tt-row"><span class="tt-key">${tr('size')}</span><span class="tt-val">${fmtSize(n.size || 0)}</span></div>`;
  if (n.mtime) rows += `<div class="tt-row"><span class="tt-key">${tr('modifiedAt')}</span><span class="tt-val">${fmtDate(n.mtime)}</span></div>`;
  tooltip.innerHTML = `<div class="tt-name">${iconFor(n, false)} ${escapeHtml(n.name)}</div>${media}${rows}<div class="tt-path">${escapeHtml(n.path)}</div>`;
  tooltip.hidden = false;
  positionTooltip(el);
  // 媒体异步加载完成后重新定位；视频跳到 0.1s 取一帧作封面
  const img = tooltip.querySelector('img');
  if (img) img.addEventListener('load', () => positionTooltip(el), { once: true });
  const vid = tooltip.querySelector('video');
  if (vid) vid.addEventListener('loadeddata', () => { try { vid.currentTime = 0.1; } catch (_) {} positionTooltip(el); }, { once: true });
}
function positionTooltip(el) {
  if (tooltip.hidden) return;
  const r = el.getBoundingClientRect(), tr = tooltip.getBoundingClientRect();
  let x = r.right + 12, y = r.top;
  if (x + tr.width > window.innerWidth - 8) x = r.left - tr.width - 12;
  if (x < 8) x = 8;
  if (y + tr.height > window.innerHeight - 8) y = window.innerHeight - tr.height - 8;
  tooltip.style.left = x + 'px'; tooltip.style.top = Math.max(8, y) + 'px';
}
function hideTooltip() { tooltip.hidden = true; }

/* ===== 变换 / 平滑缩放 / 飞行 ===== */
function applyTransform() {
  const t = activeTab(); if (!t || !t.transform) return;
  const { scale, tx, ty } = t.transform;
  canvas.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`;
  $('zoomLevel').textContent = Math.round(scale * 100) + '%';
  nodesLayer.classList.toggle('dots', scale < DOT_SCALE);  // 低缩放 → 圆点，杜绝文字重叠
}
function computeFit(w, h) { const vw = viewport.clientWidth, vh = viewport.clientHeight, m = 80; let s = clamp(Math.min((vw - m) / w, (vh - m) / h, 1), 0.06, 1); return { scale: s, tx: (vw - w * s) / 2, ty: (vh - h * s) / 2 }; }
// 初始视图：小树整体可见；大树用可读比例锚定到根节点，保证一上来就看得到文件夹名
function computeInitialView(t) {
  const L = t._layout, fit = computeFit(L.w, L.h);
  if (fit.scale >= 0.85) return fit;
  const s = 0.85, root = t.root, vw = viewport.clientWidth, vh = viewport.clientHeight;
  let ax, ay;
  if (t.layout === 'v') { ax = vw / 2; ay = vh * 0.2; }
  else if (t.layout === 'radial') { ax = vw / 2; ay = vh / 2; }
  else { ax = vw * 0.16; ay = vh / 2; }
  return { scale: s, tx: ax - root._cx * s, ty: ay - root._cy * s };
}

let rafId = null, lastScene = 0;
function tick() {
  const t = activeTab();
  if (!t || !t.target) { rafId = null; return; }
  const cur = t.transform, tg = t.target, k = 0.3;
  cur.scale += (tg.scale - cur.scale) * k; cur.tx += (tg.tx - cur.tx) * k; cur.ty += (tg.ty - cur.ty) * k;
  const done = Math.abs(tg.scale - cur.scale) < 0.002 && Math.abs(tg.tx - cur.tx) < 0.4 && Math.abs(tg.ty - cur.ty) < 0.4;
  applyTransform();
  const now = performance.now();
  if (now - lastScene > 60) { lastScene = now; maybeRefresh(); }  // 限频重建，腾出帧预算给 transform
  if (done) { t.transform = { ...tg }; t.target = null; applyTransform(); maybeRefresh(); rafId = null; }
  else rafId = requestAnimationFrame(tick);
}
function startLoop() { if (!rafId) rafId = requestAnimationFrame(tick); }
function zoomBy(cx, cy, factor) {
  const t = activeTab(); if (!t || !t.transform) return;
  const base = t.target || t.transform;
  const ns = clamp(base.scale * factor, 0.05, 4);
  const wx = (cx - base.tx) / base.scale, wy = (cy - base.ty) / base.scale;
  t.target = { scale: ns, tx: cx - wx * ns, ty: cy - wy * ns };
  startLoop();
}
function animateFit() { const t = activeTab(); if (!t || !t._layout) return; t.target = computeFit(t._layout.w, t._layout.h); startLoop(); }
function flyTo(n) {
  const t = activeTab(); if (!t || !t.transform || !n) return;
  const vw = viewport.clientWidth, vh = viewport.clientHeight;
  const base = t.target || t.transform;
  const ts = clamp(Math.max(base.scale, 1), 0.05, 1.8);
  const cx = n._tx != null ? n._tx : n._cx, cy = n._ty != null ? n._ty : n._cy;  // 用目标坐标，避免动画中途定位偏
  t.target = { scale: ts, tx: vw / 2 - cx * ts, ty: vh / 2 - cy * ts };
  renderScene(worldRect(t.target)); // 预渲染目标区域，节点滑入
  startLoop();
}
function focusSearchMatch(t, n) {
  if (!t || !n) return;
  t.searchFocus = n;
  flyTo(n);
  applyHighlight(t);
}

/* 滚轮缩放（平滑） */
viewport.addEventListener('wheel', (e) => { e.preventDefault(); const r = viewport.getBoundingClientRect(); zoomBy(e.clientX - r.left, e.clientY - r.top, e.deltaY < 0 ? 1.18 : 1 / 1.18); }, { passive: false });

/* 平移 */
let panning = false, panStart = null, panMoved = false;
viewport.addEventListener('mousedown', (e) => {
  closeCtxMenu();
  if (e.button !== 0) return; const t = activeTab(); if (!t || !t.transform) return;
  if (rafId) { cancelAnimationFrame(rafId); rafId = null; } t.target = null;
  panning = true; panMoved = false; viewport.classList.add('panning');
  panStart = { x: e.clientX, y: e.clientY, tx: t.transform.tx, ty: t.transform.ty }; hideTooltip();
});
window.addEventListener('mousemove', (e) => {
  if (!panning) return; const t = activeTab(); if (!t) return;
  const dx = e.clientX - panStart.x, dy = e.clientY - panStart.y;
  if (Math.abs(dx) + Math.abs(dy) > 3) panMoved = true;
  t.transform.tx = panStart.tx + dx; t.transform.ty = panStart.ty + dy; applyTransform();
  const now = performance.now(); if (now - lastScene > 60) { lastScene = now; maybeRefresh(); }
});
window.addEventListener('mouseup', () => { if (panning) { panning = false; viewport.classList.remove('panning'); maybeRefresh(); } });

/* ===== 导出 ===== */
function buildText(n, prefix, isLast, isRoot) { let line = isRoot ? ('📁 ' + n.name + '\n') : (prefix + (isLast ? '└── ' : '├── ') + n.name + (n.isDir ? '/' : '') + '\n'); let out = line; if (n.isDir && n.children) { const cp = isRoot ? '' : prefix + (isLast ? '    ' : '│   '); n.children.forEach((c, i) => { out += buildText(c, cp, i === n.children.length - 1, false); }); } return out; }
function buildMd(n, d) { let out = d === 0 ? `# ${n.name}\n\n` : `${'  '.repeat(d - 1)}- ${n.isDir ? '📁' : '📄'} ${n.name}${n.isDir ? '/' : ` \`${fmtSize(n.size || 0)}\``}\n`; if (n.isDir && n.children) n.children.forEach((c) => { out += buildMd(c, d + 1); }); return out; }
function buildJson(n) { const o = { name: n.name, type: n.isDir ? 'dir' : 'file' }; if (!n.isDir) { o.size = n.size; o.mtime = n.mtime; } else { o.fileCount = n.fileCount; o.dirCount = n.dirCount; o.size = n.size; } if (n.children && n.children.length) o.children = n.children.map(buildJson); return o; }
function buildHtml(root) {
  const css = `body{background:#ffffff;color:#2f3a30;font-family:-apple-system,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;padding:28px}h1{color:#3f9e54;font-size:20px;margin:0 0 8px}ul{list-style:none;padding-left:18px;border-left:1px solid #d8e0d6;margin:2px 0}li{padding:3px 0}.d{font-weight:600}.s{color:#9aa39a;font-size:12px;margin-left:8px}.wrap{max-width:900px;margin:auto}.m{color:#79847a;font-size:12px;margin-bottom:18px}`;
  const ul = (n) => { if (!n.children || !n.children.length) return ''; let s = '<ul>'; for (const c of n.children) { const sz = c.isDir ? `<span class="s">${tr('htmlItems', { count: (c.fileCount || 0) + (c.dirCount || 0) })}</span>` : `<span class="s">${fmtSize(c.size || 0)}</span>`; s += `<li><span class="${c.isDir ? 'd' : ''}">${iconFor(c, true)} ${escapeHtml(c.name)}</span>${sz}${ul(c)}</li>`; } return s + '</ul>'; };
  const htmlLang = currentLang === 'zh' ? 'zh-CN' : 'en';
  const meta = tr('htmlMeta', { dirs: root.dirCount || 0, files: root.fileCount || 0, size: fmtSize(root.size || 0), date: fmtDate(Date.now()) });
  return `<!DOCTYPE html><html lang="${htmlLang}"><head><meta charset="UTF-8"><title>${escapeHtml(root.name)} · ${tr('htmlTitleSuffix')}</title><style>${css}</style></head><body><div class="wrap"><h1>🌳 ${escapeHtml(root.name)}</h1><div class="m">${meta}</div>${ul(root)}</div></body></html>`;
}
async function doExport(fmt) {
  const t = activeTab(); if (!t || !t.root) return; const root = t.root, base = root.name || 'folder';
  if (fmt === 'copy') { await window.api.copy(buildText(root, '', true, true)); statText.textContent = tr('copiedTree'); return; }
  let content, name, filters;
  if (fmt === 'txt') { content = buildText(root, '', true, true); name = base + tr('treeSuffix') + '.txt'; filters = [{ name: 'Text', extensions: ['txt'] }]; }
  else if (fmt === 'md') { content = buildMd(root, 0); name = base + '.md'; filters = [{ name: 'Markdown', extensions: ['md'] }]; }
  else if (fmt === 'json') { content = JSON.stringify(buildJson(root), null, 2); name = base + '.json'; filters = [{ name: 'JSON', extensions: ['json'] }]; }
  else if (fmt === 'html') { content = buildHtml(root); name = base + tr('treeSuffix') + '.html'; filters = [{ name: 'HTML', extensions: ['html'] }]; }
  else return;
  const res = await window.api.save({ content, defaultName: name, filters, lang: currentLang });
  if (!res.canceled) statText.textContent = tr('exported', { path: res.path });
}

/* ===== 主题 ===== */
function applyTheme(theme) { document.body.classList.toggle('light', theme === 'light'); $('btnTheme').textContent = theme === 'light' ? '☀' : '☾'; try { localStorage.setItem('ft-theme', theme); } catch (_) {} }

/* ===== 自定义布局下拉 ===== */
const layoutCurrent = $('layoutCurrent');
const layoutMenu = $('layoutMenu');
const layoutPicker = $('layoutPicker');
const layoutIco = layoutCurrent.querySelector('.layout-ico');
const layoutText = layoutCurrent.querySelector('.layout-text');
const layoutOptions = [...layoutMenu.querySelectorAll('.layout-option')];
const layoutMeta = {
  h: { ico: '🌳', key: 'layoutH' },
  v: { ico: '🌲', key: 'layoutV' },
  radial: { ico: '🔵', key: 'layoutRadial' },
};
function syncLayoutPicker(value) {
  const meta = layoutMeta[value] || layoutMeta.h;
  layoutIco.textContent = meta.ico;
  layoutText.textContent = tr(meta.key);
  layoutOptions.forEach((it) => {
    const active = it.dataset.value === value;
    it.classList.toggle('active', active);
    it.setAttribute('aria-selected', active ? 'true' : 'false');
  });
}
function closeLayoutMenu() { layoutMenu.hidden = true; layoutPicker.classList.remove('open'); layoutCurrent.setAttribute('aria-expanded', 'false'); }
function openLayoutMenu() { layoutMenu.hidden = false; layoutPicker.classList.add('open'); layoutCurrent.setAttribute('aria-expanded', 'true'); }
function setLayoutValue(value) {
  if (!layoutMeta[value]) return;
  layoutSel.value = value; syncLayoutPicker(value); closeLayoutMenu();
  const t = activeTab();
  if (t && t.layout !== value) { t.layout = value; render({ fit: true, relayout: true }); }
}

/* ===== 事件 ===== */
$('btnOpen').addEventListener('click', openFolderDialog);
$('btnOpenBig').addEventListener('click', openFolderDialog);
$('btnExpand').addEventListener('click', () => { const t = activeTab(); if (t && t.root) { setAllOpen(t.root, true); render({ relayout: true, animate: true }); } });
$('btnCollapse').addEventListener('click', () => { const t = activeTab(); if (t && t.root) { setAllOpen(t.root, false); t.root._open = true; render({ relayout: true, animate: true }); } });
$('btnFit').addEventListener('click', animateFit);
layoutCurrent.addEventListener('click', (e) => { e.stopPropagation(); if (layoutMenu.hidden) openLayoutMenu(); else closeLayoutMenu(); });
layoutMenu.addEventListener('click', (e) => { const it = e.target.closest('.layout-option'); if (it) setLayoutValue(it.dataset.value); });
layoutCurrent.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (layoutMenu.hidden) openLayoutMenu(); else closeLayoutMenu(); }
  if (e.key === 'Escape') closeLayoutMenu();
});
// 刷新：左键立即刷新，右键自动刷新菜单
let autoRefreshMs = 0, autoRefreshTimer = null;
const autoMenu = $('autoMenu');
function setAutoRefresh(ms) {
  autoRefreshMs = ms;
  if (autoRefreshTimer) { clearInterval(autoRefreshTimer); autoRefreshTimer = null; }
  if (ms > 0) autoRefreshTimer = setInterval(() => { const t = activeTab(); if (t && t.path && t.root) refreshActive(); }, ms);
  try { localStorage.setItem('ft-auto', String(ms)); } catch (_) {}
  $('btnRefresh').classList.toggle('toggled', ms > 0);
  autoMenu.querySelectorAll('.auto-item').forEach((it) => it.classList.toggle('active', Number(it.dataset.ms) === ms));
}
$('btnRefresh').addEventListener('click', (e) => { e.stopPropagation(); refreshActive(); });
$('btnRefresh').addEventListener('contextmenu', (e) => { e.preventDefault(); e.stopPropagation(); exportMenu.hidden = true; limitMenu.hidden = true; closeLayoutMenu(); autoMenu.hidden = !autoMenu.hidden; });
autoMenu.addEventListener('click', (e) => { const it = e.target.closest('.auto-item'); if (it) { setAutoRefresh(Number(it.dataset.ms)); autoMenu.hidden = true; } });
(function initAuto() { let ms = 0; try { ms = Number(localStorage.getItem('ft-auto')) || 0; } catch (_) {} setAutoRefresh(ms); })();
(function initScanLimit() { let raw = DEFAULT_SCAN_LIMIT; try { raw = localStorage.getItem('ft-scan-limit') || DEFAULT_SCAN_LIMIT; } catch (_) {} setScanLimit(normalizeScanLimit(raw) || DEFAULT_SCAN_LIMIT, false, false); })();
$('zoomReset').addEventListener('click', animateFit);
$('zoomIn').addEventListener('click', () => zoomBy(viewport.clientWidth / 2, viewport.clientHeight / 2, 1.25));
$('zoomOut').addEventListener('click', () => zoomBy(viewport.clientWidth / 2, viewport.clientHeight / 2, 1 / 1.25));
layoutSel.addEventListener('change', () => setLayoutValue(layoutSel.value));
$('btnHidden').addEventListener('click', () => { showHidden = !showHidden; $('btnHidden').classList.toggle('toggled', showHidden); statText.textContent = tr(showHidden ? 'hiddenOn' : 'hiddenOff'); const t = activeTab(); if (t && t.path) loadTab(t); });
$('btnTheme').addEventListener('click', () => applyTheme(document.body.classList.contains('light') ? 'dark' : 'light'));
$('btnLang').addEventListener('click', () => setLang(currentLang === 'en' ? 'zh' : 'en'));

// 窗口控制
$('winMin').addEventListener('click', () => window.api.win.minimize());
$('winMax').addEventListener('click', () => window.api.win.maxtoggle());
$('winClose').addEventListener('click', () => window.api.win.close());

const exportMenu = $('exportMenu');
const limitMenu = $('limitMenu');
$('btnExport').addEventListener('click', (e) => { e.stopPropagation(); autoMenu.hidden = true; limitMenu.hidden = true; closeLayoutMenu(); exportMenu.hidden = !exportMenu.hidden; });
exportMenu.addEventListener('click', (e) => { const it = e.target.closest('.menu-item'); if (it) { doExport(it.dataset.fmt); exportMenu.hidden = true; } });
$('btnLimit').addEventListener('click', (e) => { e.stopPropagation(); exportMenu.hidden = true; autoMenu.hidden = true; closeLayoutMenu(); limitMenu.hidden = !limitMenu.hidden; });
function applyCustomScanLimit() {
  const input = $('limitInput');
  const next = normalizeScanLimit(input ? input.value : '');
  if (!next) { window.alert(tr('invalidLimit')); if (input) input.focus(); return; }
  if (next > HIGH_SCAN_LIMIT && !confirmHighScanLimit(next)) { if (input) input.focus(); return; }
  setScanLimit(next);
  $('limitCustom').hidden = true;
  limitMenu.hidden = true;
}
limitMenu.addEventListener('click', (e) => {
  const customBox = e.target.closest('#limitCustom');
  if (customBox) { e.stopPropagation(); return; }
  const it = e.target.closest('.limit-item'); if (!it) return;
  e.stopPropagation();
  if (it.dataset.limit === 'custom') {
    const box = $('limitCustom'), input = $('limitInput');
    box.hidden = !box.hidden;
    if (!box.hidden && input) { input.value = String(scanLimit); setTimeout(() => { input.focus(); input.select(); }, 0); }
    return;
  }
  const next = normalizeScanLimit(it.dataset.limit);
  if (!next) { window.alert(tr('invalidLimit')); limitMenu.hidden = true; return; }
  if (next > HIGH_SCAN_LIMIT && !confirmHighScanLimit(next)) { limitMenu.hidden = true; return; }
  setScanLimit(next);
  $('limitCustom').hidden = true;
  limitMenu.hidden = true;
});
$('limitApply').addEventListener('click', (e) => { e.stopPropagation(); applyCustomScanLimit(); });
$('limitInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); applyCustomScanLimit(); } });
document.addEventListener('click', () => { exportMenu.hidden = true; autoMenu.hidden = true; limitMenu.hidden = true; $('limitCustom').hidden = true; closeLayoutMenu(); closeCtxMenu(); });
viewport.addEventListener('wheel', closeCtxMenu, { passive: true });

// 范围搜索标签 ×：取消范围 → 恢复全文搜索（保留高亮锁定）
$('scopeX').addEventListener('click', (e) => { e.stopPropagation(); const t = activeTab(); if (t) { t.searchScope = null; updateScopeChip(t); if (t.search) render(); } });

let searchTimer = null;
searchInput.addEventListener('input', () => {
  $('searchClear').hidden = !searchInput.value;
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    const t = activeTab(); if (!t || !t.root) return;
    t.search = searchInput.value.trim().toLowerCase(); t._matchIdx = -1; t.searchFocus = null;
    render();   // 是否重排由 render 按 layoutDirty 自动判断（避免每次按键都跑碰撞算法）
    if (t.search && t._matches.length) { t._matchIdx = 0; focusSearchMatch(t, t._matches[0]); searchCount.textContent = tr('matchPos', { index: 1, total: t._matches.length }); }
  }, 180);
});
$('searchClear').addEventListener('click', () => {
  searchInput.value = ''; $('searchClear').hidden = true; searchInput.focus();
  const t = activeTab(); if (t) { t.search = ''; t.searchFocus = null; render(); }
});
searchInput.addEventListener('keydown', (e) => {
  const t = activeTab();
  if (e.key === 'Enter' && t && t._matches && t._matches.length) {
    e.preventDefault();
    t._matchIdx = ((t._matchIdx || 0) + (e.shiftKey ? -1 : 1) + t._matches.length) % t._matches.length;
    focusSearchMatch(t, t._matches[t._matchIdx]); searchCount.textContent = tr('matchPos', { index: t._matchIdx + 1, total: t._matches.length });
  } else if (e.key === 'Escape') { searchInput.value = ''; $('searchClear').hidden = true; if (t) { t.search = ''; t.searchFocus = null; } render({ relayout: true }); searchInput.blur(); }
});

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'o') { e.preventDefault(); openFolderDialog(); }
  if ((e.ctrlKey || e.metaKey) && e.key === 't') { e.preventDefault(); newBlankTab(); }
  if ((e.ctrlKey || e.metaKey) && e.key === 'f') { e.preventDefault(); searchInput.focus(); searchInput.select(); }
  if ((e.ctrlKey || e.metaKey) && e.key === 'w') { e.preventDefault(); if (activeId) closeTab(activeId); }
  if (e.key === 'F5' || ((e.ctrlKey || e.metaKey) && e.key === 'r')) { e.preventDefault(); refreshActive(); }
  if (e.key === 'Escape' && document.activeElement !== searchInput) {
    closeCtxMenu(); closeLayoutMenu();
    const t = activeTab(); if (!t) return;
    const had = (t.locks && t.locks.size) || t.searchScope || t.search || t.searchFocus;
    searchInput.value = ''; $('searchClear').hidden = true; t.search = ''; t.searchFocus = null;   // ESC 同时清除搜索
    if (t.locks) t.locks.clear(); t.searchScope = null; updateScopeChip(t);
    if (had) render();
  }
});

/* 拖放 —— 空白标签则填入，否则新开标签 */
let dragDepth = 0;
window.addEventListener('dragenter', (e) => { e.preventDefault(); dragDepth++; dropOverlay.hidden = false; });
window.addEventListener('dragover', (e) => { e.preventDefault(); });
window.addEventListener('dragleave', (e) => { e.preventDefault(); if (--dragDepth <= 0) { dragDepth = 0; dropOverlay.hidden = true; } });
window.addEventListener('drop', (e) => {
  e.preventDefault(); dragDepth = 0; dropOverlay.hidden = true;
  const files = e.dataTransfer.files; if (!files || !files.length) return;
  for (const f of files) { let p = null; try { p = window.api.pathForFile(f); } catch (_) {} if (!p && f.path) p = f.path; if (p) loadIntoTarget(p); }
});

window.addEventListener('resize', () => { const t = activeTab(); if (t && t.root) renderScene(); });

(function init() { let theme = 'light', lang = 'en'; try { theme = localStorage.getItem('ft-theme') || 'light'; lang = localStorage.getItem('ft-lang') || 'en'; } catch (_) {} applyTheme(theme); setLang(lang, false); })();
