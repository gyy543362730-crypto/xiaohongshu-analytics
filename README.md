# 红数 · 小红书运营数据分析系统

中文版 React 数据管理后台，使用模拟数据，无需登录或连接真实小红书账号。

## 使用

已启动的云环境开发服务使用 **5173 端口**。如平台提供端口预览，请选择该端口。下载项目在自己电脑运行时，浏览器打开 `http://localhost:5173/xiaohongshu-analytics/`。

```bash
npm ci --cache /workspace/.npm-cache
npm run dev -- --port 5173
```

如果在个人电脑上安装，可以直接使用 `npm ci`，无需指定云环境缓存路径。

## 已实现

- 首页五项核心指标、曝光/阅读趋势图、投放与线索双轴柱状图。
- 笔记和投流记录新增、编辑、删除；自动计算获客成本，零线索显示“—”。
- 账号新增、编辑、删除；全局账号筛选、近7天/近30天/全部时间筛选。
- 浏览器 localStorage 自动保存，首次访问创建3个账号、30篇笔记和12条投流记录。
- `.xlsx`/`.xls` 导入，Excel 导出，响应式桌面与手机布局。

## Excel 导入

先点击“导出数据”获取格式，编辑导出的 Excel 后再导入，保持工作表名和表头不变。

- `笔记数据`：记录ID、账号ID、日期、笔记标题、内容分类、曝光量、阅读量、点赞数、评论数、收藏数。
- `投流数据`：记录ID、账号ID、日期、投流名称、关联笔记ID、投放金额、私信数量、有效线索。
- `账号列表`：账号ID、账号名称、小红书号、颜色。
- 日期填写文本 `YYYY-MM-DD`；账号ID应对应“账号列表”。
- 相同记录ID更新已有记录；新记录可留空记录ID。有效线索不能超过私信，数量必须为非负整数。
- 导入失败不会部分写入。导出的获客成本为参考，系统始终重新计算。
- 首页、账号页导出全部数据作为备份；笔记页和投流页按当前账号与时间条件导出两类数据。

数据只保存在当前浏览器及访问地址下；刷新不会丢失。清除浏览器数据、更换浏览器、设备或访问地址不会自动同步，请定期导出备份。删除账号前需清空其笔记与投流；删除笔记会解除投流关联，但保留投流金额。

## 验证

```bash
npm test           # 5项数据规则单元测试
npm run build      # 生产构建，产物 dist/
npm run test:e2e   # 开发服务运行时执行浏览器流程测试
```

浏览器测试使用环境已有的 `/usr/bin/chromium`；个人电脑可在 `playwright.config.js` 调整浏览器路径，或删除 executablePath 配置并执行 `npx playwright install chromium`。

技术栈：React、Vite、Recharts、Lucide、SheetJS、Vitest、Playwright。第一版不包含服务端、真实账号接口、多人协作或跨设备同步。中文字体有在线增强，无法访问时自动使用系统字体。

## GitHub Pages 免费部署

本项目使用 React 19 + Vite 6，构建产物为 `dist/`，无需服务器。Vite 的 `base` 为 `/xiaohongshu-analytics/`，适用于此 GitHub 项目站点。

1. 打开仓库 → **Settings** → 左侧 **Pages**。
2. 在 **Build and deployment** 下，将 **Source** 选择为 **GitHub Actions**。
3. 打开 **Actions** → **Deploy to GitHub Pages**。推送 main 会自动部署；如首次工作流失败，在选择 Source 后点击 **Re-run all jobs**，或 **Run workflow** → 选择 main → **Run workflow**。
4. 等待 build 和 deploy 均显示绿色成功，再打开 https://gyy543362730-crypto.github.io/xiaohongshu-analytics/ 。

工作流安装锁定依赖、执行数据规则测试、构建并通过官方 Pages Actions 发布。后续推送 main 自动更新。

如果仓库为私有且免费账户不支持 Pages，请确认可公开全部代码后，再在 Settings → General → Danger Zone → Change repository visibility 中改为 Public；不要公开敏感文件。若 Actions 被禁用，先在 Actions 页面按提示启用工作流。

页面内部通过 React 状态切换栏目，不创建 `/notes` 等子路径；刷新实际站点路径仍会返回首页，再从本地存储读取数据，不依赖服务器路由重写。不要使用不存在的子路径。

本地生产预览：`npm run build` 后执行 `npx vite preview --host 0.0.0.0 --port 4173`，访问 `/xiaohongshu-analytics/`。GitHub Pages 使用 HTTPS；从开发地址切换到正式地址时浏览器存储相互独立，请先从原页面导出 Excel，再在新站点导入。公开部署不会上传用户浏览器中的本地记录，首次访问仍显示模拟数据。
