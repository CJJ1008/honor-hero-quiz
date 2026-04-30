# 王者荣耀生活人格英雄测评

一个 Vite + React 单页网站：用 30 道生活场景选择题，匹配用户最像的王者荣耀英雄人格。适配电脑端和手机端，部署后给用户一个链接即可测试。

## 本版特性

- 30 道生活题，全部 4 选 1，不询问游戏打法、位置、刷野、开团等游戏问题。
- 英雄池放在 `src/data/heroes.js`，可维护、可扩展。
- 手机端适配：移动端单列排版、触屏按钮、安全区适配、底部操作栏、结果页移动端阅读优化。
- 结果改为独立界面展示：用户答完 30 题后跳转到 `#result` 结果界面，不再挤在右侧栏里。
- 结果页增加完整解读：
  - 该英雄在游戏里的特征
  - 你和该英雄相似在哪里
  - 约 200 字左右的综合总结
  - 性格定义
  - 优点
  - 可能的缺点
  - 生活 / 人生建议
  - 备选英雄人格
- 支持英雄池搜索和职业筛选。
- 匹配算法已升级：不再只按职业/分路归类，而是加入英雄人格标签、英雄专属指纹、特质加权距离和备选英雄去同质化展示。
- 匹配度分数已拉开差距，第一匹配和备选匹配会有更明显层级。

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开终端提示的本地地址即可。手机和电脑在同一个局域网时，也可以用电脑的局域网 IP 地址在手机浏览器里预览。

## 打包

```bash
npm run build
```

打包后会生成 `dist/` 目录，这个目录就是可以部署到网站托管平台的静态文件。

## 部署成一个可分享的网站链接

### 方式一：Vercel

1. 把整个工程上传到 GitHub。
2. 在 Vercel 新建项目，导入这个 GitHub 仓库。
3. Framework 选择 Vite，Build Command 使用：`npm run build`。
4. Output Directory 使用：`dist`。
5. 部署完成后，Vercel 会给你一个网址，把这个链接发给用户即可测评。

工程里已经附带 `vercel.json`，用于静态单页网站刷新和访问兼容。

### 方式二：Netlify

1. 把整个工程上传到 GitHub，然后在 Netlify 导入项目；或者直接把 `npm run build` 生成的 `dist/` 拖到 Netlify。
2. Build Command：`npm run build`。
3. Publish Directory：`dist`。
4. 部署完成后，把 Netlify 生成的网址发给用户即可。

工程里已经附带 `netlify.toml`。

### 方式三：服务器 / 对象存储

运行：

```bash
npm run build
```

然后把 `dist/` 里的文件上传到你的服务器、Nginx、COS、OSS、Cloudflare Pages 或其他静态托管服务即可。

## 文件结构

```text
honor-hero-life-quiz/
├── index.html
├── package.json
├── README.md
├── vercel.json
├── netlify.toml
└── src/
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    └── data/
        ├── heroes.js
        └── questions.js
```

## 后续维护

- 新英雄：修改 `src/data/heroes.js`。
- 新题目：修改 `src/data/questions.js`。
- 结果文案逻辑：修改 `src/App.jsx` 中的 `roleGameProfiles`、`traitInsights` 和 `buildResultReport`。
- 匹配算法：修改 `src/App.jsx` 中的 `identityProfiles`、`heroPersonaOverrides`、`buildHeroTarget`、`getMatches` 和 `getDiverseMatches`。
- 手机样式：修改 `src/index.css` 后半部分的移动端媒体查询。

> 非官方娱乐向项目；王者荣耀相关名称归其权利方所有。
