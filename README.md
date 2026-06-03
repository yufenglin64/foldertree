<div align="center">

<img src="renderer/icon.png" width="120" alt="FolderTree logo" />
<br />
<img src="renderer/name.png" width="300" alt="FolderTree logo" />

**Make file management as clear as a tree** — Turn any folder into a zoomable, searchable, draggable mind map.

**让文件管理像树一样清晰** — 把任意文件夹变成一张可缩放、可搜索、可拖动的思维导图。

[![License: Apache--2.0](https://img.shields.io/badge/License-Apache--2.0-a882ff.svg)](LICENSE)
![Electron](https://img.shields.io/badge/Electron-33-47848F?logo=electron&logoColor=white)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-888)

</div>

---

## 🗣️ Author's Note 作者独白

At work, I often receive deeply nested folders from clients; in daily life, I sometimes want to tweak a Steam game file, only to get lost in a maze of folders. Windows' built-in file search can also be slow enough to break my patience. I wanted a clearer and faster way to understand folder structures and find files, so I built **FolderTree**.

工作中，我经常会收到客户与同事发来的多层嵌套文件夹；生活中，我也会想改动某个 Steam 游戏文件，却总是被眼花缭乱的目录结构绕晕，也常常因为 Windows 自带文件搜索太慢而失去耐心。于是我想做一个更直观、更高效的工具来解决这些痛点，**FolderTree** 就这样诞生了。

## ✨ Features 特性

- 🌐 **English / Chinese switching** — The app defaults to English and can switch between English and Chinese at any time.
  **中英文切换** — 软件默认英文版，用户可以随时在英文 / 中文之间切换。
- 🗺️ **Mind-map layout** — The root folder branches outward, with three layout styles: tree horizontal, tree vertical, and radial sphere.
  **思维导图式布局** — 根文件夹向外分叉延伸，三种形状任选：树状·横向 / 树状·纵向 / 球状·放射。
- 🔍 **Real-time search and positioning** — Press `Ctrl+F` to search, then press Enter to smoothly fly between matches; after locking a folder, you can search within its subtree.
  **实时搜索定位** — `Ctrl+F` 搜索，回车在匹配间平滑“飞行”定位；锁定文件夹后可在其子树内范围搜索。
- 🛣️ **Ancestry highlighting** — Hover over any node to highlight the full path to the root, highlight child folders, and fade out the rest.
  **血缘高亮** — 悬停任意节点，从它到根的整条路径高亮、子文件夹灰色高亮，其余淡出。
- 🖱️ **Free dragging and resizing** — Drag cards to reposition them, and drag the right handle to widen cards for long names.
  **自由拖动与调宽** — 拖动卡片改位置，拖右侧手柄加宽卡片看全名。
- 🖼️ **Hover preview** — Images show thumbnails and videos show cover frames without opening the files.
  **悬停预览** — 图片显示缩略图、视频显示封面帧，无需打开。
- 📑 **Multiple tabs** — Open multiple folders like a browser, with right-click actions such as “close others” and “close tabs to the right”.
  **多标签页** — 像浏览器一样多开文件夹，右键支持“关闭其他 / 关闭右侧”等。
- 🎬 **Smooth large-folder rendering with a safety limit** — Viewport clipping, level-of-detail dots, and merged SVG paths help large directories stay responsive; folders above 100,000 scanned items are stopped and must be narrowed before loading.
  **大目录流畅渲染与安全上限** — 视口裁剪、低缩放圆点模式、合并 SVG 连线，让大目录也尽量保持流畅；扫描超过 100,000 项会停止加载，需要缩小目录范围后重新打开。
- 🌗 **Light / dark themes** — Switch themes with one click and remember your choice.
  **亮 / 暗主题** — 一键切换并记忆。
- 📤 **Export and share** — Export as a text tree, Markdown, styled webpage, or JSON, or copy to the clipboard.
  **导出分享** — 文本树 / Markdown / 自带样式网页 / JSON，或复制到剪贴板。

## 🚀 Getting Started 快速开始

### Windows

```powershell
# Check Node.js; install Node.js LTS automatically if missing
# 检查 Node.js；如果没有则自动安装 Node.js LTS
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { winget install OpenJS.NodeJS.LTS }

git clone https://github.com/yufenglin64/foldertree.git foldertree
cd foldertree
npm install
npm start
```

### Linux

```bash
# Check Node.js; install Node.js LTS automatically if missing
# 检查 Node.js；如果没有则自动安装 Node.js LTS
command -v node >/dev/null 2>&1 || (curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt install -y nodejs)

git clone https://github.com/yufenglin64/foldertree.git foldertree
cd foldertree
npm install
npm start
```

### macOS

```bash
# Check Node.js; install Node.js automatically with Homebrew if missing
# 检查 Node.js；如果没有则通过 Homebrew 自动安装
command -v node >/dev/null 2>&1 || brew install node

git clone https://github.com/yufenglin64/foldertree.git foldertree
cd foldertree
npm install
npm start
```

> Requires Node.js 18+.
> 依赖 Node.js 18+。
>
> If Electron downloads slowly in China, you can use a mirror:
> 国内安装 Electron 慢可设镜像：
>
> ```bash
> ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/ npm install
> ```

## 🎮 Usage 操作

- **Open / drag in a folder** — Each folder opens in its own tab without replacing existing tabs.
  **打开 / 拖入文件夹** — 每个文件夹一个标签页，不覆盖。
- **Mouse wheel / drag blank canvas** — Zoom or pan the canvas.
  **滚轮 / 拖空白处** — 缩放 / 平移画布。
- **Double-click a folder** — Expand / collapse it and center on the middle child node.
  **双击文件夹** — 展开 / 收起，并居中到中间子节点。
- **Double-click a file** — Open it with the system default app.
  **双击文件** — 用系统默认程序打开。
- **Right-click a node** — Copy path, lock highlight, search within this folder, expand all, and more.
  **右键节点** — 复制路径、锁定高亮、在此文件夹下搜索、展开全部等。
- **Hover for 1 second** — Show a detail card, with image/video previews when available.
  **悬停 1 秒** — 弹出详情卡（图片 / 视频带预览）。
- **Drag a card** — Reposition it; drag the purple handle on the right to widen it.
  **拖动卡片** — 改位置；拖右侧紫色手柄加宽。
- **`Ctrl+F` / Enter** — Search / jump to the next match.
  **`Ctrl+F` / 回车** — 搜索 / 跳转下一个匹配。
- **`Ctrl+T` / `Ctrl+W`** — Create / close a tab.
  **`Ctrl+T` / `Ctrl+W`** — 新建 / 关闭标签。
- **`Esc`** — Clear search and all locked highlights.
  **`Esc`** — 清除搜索与全部锁定高亮。

## 🧱 Tech Stack 技术栈

- **Electron 33** — Cross-platform desktop runtime; the main process handles file-system scanning and native dialogs.
  **Electron 33** — 跨平台桌面运行环境，主进程负责文件系统扫描与原生对话框。
- **Native HTML / CSS / JS** — No frontend framework; SVG draws connection lines, and CSS `transform` handles GPU-composited zooming and panning.
  **原生 HTML / CSS / JS** — 无前端框架；SVG 绘制连线，CSS `transform` 做 GPU 合成的缩放平移。
- **Security** — `contextIsolation` plus a preload bridge, so the renderer process does not directly access Node.js.
  **安全** — `contextIsolation` + preload 桥接，渲染进程不直接访问 Node。

```text
foldertree/
├── main.js            # Main process: scanning, window, IPC / 主进程：扫描、窗口、IPC
├── preload.js         # Secure bridge / 安全桥接
└── renderer/
    ├── index.html
    ├── styles.css     # Obsidian-style light/dark themes / Obsidian 风 · 亮暗双主题
    ├── renderer.js    # Layout, rendering, interactions, animation / 布局、渲染、交互、动画
    └── icons/         # File-type icons / 文件类型图标
```

## 🤝 Contributing 贡献

Issues and PRs are welcome. Before submitting, please make sure `node --check` passes and the app starts normally.

欢迎 Issue 与 PR。提交前请确保 `node --check` 通过、应用可正常启动。

## 📄 License 许可

[Apache-2.0](LICENSE) © 林宇锋 (yufenglin64)
