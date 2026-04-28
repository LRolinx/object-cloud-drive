# Object Cloud Drive 说明书

Object Cloud Drive 是一个仿云盘项目，包含桌面/网页客户端和 Rust 后端服务。项目支持用户登录、文件上传、文件夹上传、分片并发上传、秒传、文件/文件夹下载、图片预览、视频流预览、资源池浏览、头像上传裁剪、深色主题和动态背景等功能。

## 技术栈

- 前端：React 18、TypeScript、Vite、Ant Design、Tauri、PixiJS
- 后端：Rust、Actix Web、SQLx、SQLite
- 存储：本地文件系统 + SQLite 元数据
- 鉴权/加密：RSA 公钥加密登录参数，后端自动生成密钥对

## 目录结构

```text
object-cloud-drive/
├── client/              # 新版 React/Tauri 客户端
├── serve_rust/          # 新版 Rust 后端
├── serve/               # 旧版后端代码，当前主要开发不再使用
├── resources/           # 项目资源
└── README.md            # 项目说明书
```

## 功能说明

- 用户：注册、登录、自动获取公钥、头像上传、头像画布裁剪。
- 云盘：新建文件夹、上传文件、上传文件夹、拖拽上传文件/目录、删除文件/文件夹。
- 上传：SHA-256 哈希计算、秒传、分片并发上传、上传进度展示、0KB 文件上传。
- 下载：单文件直接下载，文件夹由后端打包为 ZIP 后下载。
- 预览：图片预览、视频流预览、同目录视频列表、视频缩略图。
- 资源池：浏览服务端指定目录，过滤隐藏文件/目录，支持 MP4 视频预览。
- 界面：响应式卡片布局、深色主题、动态 canvas/PixiJS 背景、玻璃拟态效果。

## 环境要求

- Node.js：建议 18+
- pnpm：建议使用 pnpm 管理前端依赖
- Rust：建议 stable 工具链
- SQLite：由后端通过 SQLx 自动创建数据库和表结构，无需手动建表

## 后端启动

进入 Rust 后端目录：

```bash
cd serve_rust
cargo run
```

默认监听：

```text
http://localhost:3000
```

后端首次启动会自动创建：

- SQLite 数据库：`serve_rust/objcloud.db3`
- RSA 密钥目录：`~/.objectcloud/key/`
- 上传临时目录：`~/.objectcloud/temp/`
- 文件存储目录：`~/.objectcloud/upload/`
- 预览缓存目录：`~/.objectcloud/preview/`

如果修改了后端代码，需要重启 `serve_rust`。

## 后端配置

当前配置集中在：

```text
serve_rust/src/config.rs
```

主要配置项：

```text
db_path            SQLite 数据库路径，默认 objcloud.db3
upload_temp_dir    分片上传临时目录，默认 ~/.objectcloud/temp
upload_dir         文件实际存储目录，默认 ~/.objectcloud/upload
preview_dir        预览缓存目录，默认 ~/.objectcloud/preview
resource_pool_dir  资源池根目录，当前默认 /Volumes/Data/
static_dir         静态文件目录，默认 serve_rust/src/
```

如果你的机器不是 macOS，或者没有 `/Volumes/Data/`，需要把 `resource_pool_dir` 改成实际存在的目录。

## 前端启动

进入客户端目录：

```bash
cd client
pnpm install
pnpm dev
```

构建生产包：

```bash
pnpm build
```

Tauri 桌面模式：

```bash
pnpm "tauri dev"
```

## 前端接口地址

接口基础地址在：

```text
client/src/script/api.ts
```

当前默认：

```ts
BASEURL: 'http://192.168.50.48:3000'
```

如果后端运行在本机，可以改成：

```ts
BASEURL: 'http://localhost:3000'
```

前端请求失败、一直加载、获取公钥失败时，优先检查这里的地址是否和后端实际地址一致。

## 使用流程

1. 启动 Rust 后端：`cd serve_rust && cargo run`
2. 启动前端：`cd client && pnpm dev`
3. 打开前端页面。
4. 注册账号，内部注册码为：`OBJECT`
5. 登录后进入云盘页面。
6. 可以上传文件、拖拽上传目录、预览图片/视频、下载文件或文件夹。

## 上传说明

上传前端会先计算文件 SHA-256：

- 如果用户目录中已经存在同名同后缀文件，会显示“文件已存在”。
- 如果服务器已经有相同 SHA-256 文件，会走秒传。
- 如果服务器没有该文件，会按分片并发上传。
- 0KB 文件允许上传，会作为空文件入库并创建实际空文件。

重复上传同名文件时，前端会自动追加序号，例如：

```text
文件.txt
文件 (1).txt
文件 (2).txt
```

## 下载说明

- 文件：前端直接请求文件 Blob 并触发浏览器下载。
- 文件夹：前端请求后端 `/drive/downloadUserFolder`，后端递归读取目录树，生成 ZIP 后返回。

当前 ZIP 使用“存储模式”，也就是只打包不压缩。优点是速度快、无需额外依赖；缺点是 ZIP 体积不会比原文件小。

## 视频预览说明

视频预览使用 HTTP Range 流式加载，适合大视频播放。视频弹窗右侧会显示同目录视频列表和缩略图，点击可切换播放。

如果视频预览很慢，优先检查：

- 后端是否已重启到最新代码。
- 视频文件是否可被后端读取。
- 浏览器 Network 中 Range 请求是否返回 `206 Partial Content`。
- 资源池路径是否配置正确。

## 资源池说明

资源池用于浏览后端机器上的本地目录，配置项是：

```text
serve_rust/src/config.rs -> resource_pool_dir
```

资源池会过滤隐藏文件和隐藏文件夹。当前主要支持 MP4 视频预览。

## 主题和界面

客户端会跟随系统深色/浅色主题。页面首次加载时会在 `index.html` 中同步设置主题，避免深色模式下出现白屏闪烁。

背景使用 canvas/PixiJS 绘制动态模糊光晕，不同刷新可能出现不同背景效果，例如光晕、极光、星云等。

## 常见问题

### 1. 前端一直卡在获取公钥

检查：

- 后端是否运行。
- `client/src/script/api.ts` 的 `BASEURL` 是否正确。
- 浏览器 Network 中 `/user/getpublickey` 是否能请求到。

### 2. 登录提示解密失败

通常是后端密钥或服务状态不一致。尝试：

- 重启 Rust 后端。
- 确认前端连接的是当前运行的后端。
- 如需要重置密钥，可停止后端后删除 `~/.objectcloud/key/`，再重新启动后端。

### 3. 上传目录失败

新版前端支持通过拖拽目录上传，也支持“上传文件夹”按钮上传。浏览器需要支持 `webkitGetAsEntry` 或 `webkitdirectory`，Chrome/Edge 通常支持较好。

### 4. 资源池为空

检查 `serve_rust/src/config.rs` 中的 `resource_pool_dir` 是否存在，且后端进程有读取权限。

### 5. 修改后端代码后前端功能没变化

后端改动需要重启 `serve_rust`，前端改动需要重新构建或等待 Vite 热更新。

## 主要接口

用户：

```text
POST /user/getpublickey
POST /user/registered
POST /user/login
POST /user/updateAvatar
```

云盘：

```text
POST /drive/addUserFolder
POST /drive/batchAddUserFolder
POST /drive/getUserFileAndFolder
POST /drive/getUserFileForFileId
POST /drive/downloadUserFolder
POST /drive/delUserFileOrFolder
```

上传：

```text
POST /upload/examineFile
PUT  /upload/uploadStreamFile
POST /upload/uploadSecondPass
```

视频：

```text
GET  /video/playVideoSteam
POST /video/playVideoSteam
GET  /video/playLocalVideoSteam
POST /video/getVideoSceenshots
```

资源池：

```text
GET  /resourcepool/playVideoSteam
POST /resourcepool/playVideoSteam
POST /resourcepool/getVideoSceenshots
POST /resourcepool/getFolderAndFile
```

## 开发建议

- 前端改动后运行：`cd client && pnpm build`
- 后端改动后运行：`cd serve_rust && cargo check`
- 涉及接口地址、资源池路径、存储目录时，优先检查配置文件。
- 不建议直接提交 `objcloud.db3`、`target/`、`dist/`、`node_modules/`、`.pnpm-store/` 等生成物。

## 当前状态

当前主力版本是：

- 前端：`client/`
- 后端：`serve_rust/`

`serve/` 是旧版后端目录，README 中如有旧说明，以本文件为准。
