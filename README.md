# Vélune / 微澜 · 完整独立静态源码

版本：1.1.0，导出于 2026-10-28。包含未压缩的 HTML、CSS、JavaScript、全部图片与本地字体，以及三张原始 PNG。
不需要平台、登录、API key、数据库、npm 安装或构建。可离线运行或部署到任意支持静态文件的服务器。

## 运行

先解压 ZIP。在此 README 所在目录打开终端：

```sh
node server.mjs
```

然后打开 http://127.0.0.1:4173/ 。中文入口为 http://127.0.0.1:4173/?lang=zh 。终端 Ctrl+C 停止。
需要已安装 Node.js 18 或以上版本。也可以使用已安装的 Python：

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Windows 若只有 py 命令，可用 py -m http.server 4173 --bind 127.0.0.1。
以上服务只运行在本机，不需要联网或登录。对外托管时上传 index.html、所有 CSS / JS 和 assets/；server.mjs、检查脚本与原始 PNG 不属于网页运行必需文件。

## 页面与功能

网站是品牌长页：Home、Consultations、About、Visit & FAQ、Booking 都在 index.html 中，导航使用页面锚点；不是缺少其他 HTML 文件。

- 英文 / 简体中文切换，保留当前预约步骤与输入。
- 咨询详情、意向引导、空间图库、原生 FAQ 折叠与移动导航。
- 三步预约、快捷日期、校验、虚拟资料填充、核对、修改、完成与重新体验。
- 中英演示日历下载；仅含主题、时间和编号，不含联系资料。
- 滚动位置驱动的视觉展开、暂停及减少动态效果支持。

预约是前端演示：资料仅留在页面内存，刷新清空，没有向真实机构发送申请，也没有后台或真实排班。

## 直接双击 index.html

导出包已将 SVG 图标内嵌，并为 file: 地址保留语言切换。直接打开时的实测与浏览器限制见 VERIFICATION.md。
为了获得与正式网站一致的字体、资源及下载行为，推荐通过上面的本地 HTTP 地址体验全部功能。

## 目录

```text
index.html                 完整品牌长页、预约与弹窗
styles.css                 基础样式
motion.css                 动效样式
finish.css                 成品视觉及响应式布局
i18n.js                    中英文案与切换
motion.js                  滚动展开、导航与动效控制
booking-utils.js           演示时钟、日期及日历生成
app.js                     导航、弹窗、图库与预约逻辑
assets/                    网页图片、字体、SVG 和许可证
original-images/           三张生成图片的原始 PNG
server.mjs                 可选本地静态服务器
package.json               可选 npm start / npm run check 入口
check*.mjs                 源码与行为检查脚本
ASSET-SOURCES.md           每张图片与字体 / 图标来源
VERIFICATION.md            本导出的实际验证和限制
SHA256SUMS.txt             包内文件校验值
```

## 导出适配

视觉与功能来源于当前 1.1 版本；只移除绑定平台网址的 canonical / Open Graph URL 元数据、内嵌原有图标符号、适配 file: 语言切换和本地检查 / 服务器路径；小屏英文页眉隐藏冗余预约按钮（主内容与菜单预约入口保留），避免横向溢出。没有引入登录、CDN 或新运行依赖。SVG 中的 www.w3.org/2000/svg 是命名空间标识，不是网络请求。
