# 王者荣耀生活人格英雄测评

一个完整的 Vite + React 单页网站工程：30 道生活场景选择题，4 选 1，答完后从内置全英雄池中匹配最像你的王者荣耀英雄人格。

## 功能

- 30 道题全部源于生活场景，不询问游戏位置、段位、操作偏好
- 英雄池放在 `src/data/heroes.js`，当前内置 130 个英雄/职业条目
- 题目放在 `src/data/questions.js`，方便继续增删改
- 根据 9 个生活人格维度计算匹配：目标驱动、理性判断、共情照顾、抗压韧性、灵感创造、冒险破局、秩序规划、独立锋芒、协作连接
- 匹配算法不再只按职业判断：职业只占辅助权重，核心会结合英雄自身人格设定，例如守护壁垒型、冷静谋略型、机会猎手型、自由变奏型、精准兑现型等
- 匹配度分数已拉开差距，并且备选英雄会尽量按人格类型去重，减少“一屏全是射手/法师”的情况
- 答题页带“答题概览”，可以看到哪些题未回答，并点击题号快速跳转补题
- 答完后会进入独立结果页，展示本命英雄、匹配度、游戏特征、相似点、性格定义、优缺点、生活建议、人格雷达和备选英雄
- 英雄池已经放到独立界面，支持搜索、职业筛选；点击某个英雄标签后会显示该英雄的 quote、desc 和算法人格标签
- 响应式适配桌面端与移动端
- `vite.config.js` 已配置 `base: './'`，方便部署到 CloudBase 这类子路径静态托管环境

## 本地运行

```bash
npm install
npm run dev
```

然后打开终端提示的本地地址即可。

## 构建

```bash
npm run build
npm run preview
```

## 目录结构

```text
honor-hero-life-quiz/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    └── data/
        ├── heroes.js
        └── questions.js
```

## 更新英雄名单

新英雄上线时，只需要改 `src/data/heroes.js`：

```js
{
  id: 131,
  name: "新英雄名",
  roles: ["战士"],
  icon: "⚔️",
  title: "正面执行者",
  quote: "你不怕复杂任务，习惯把想法落到行动里。",
  desc: "这里写该英雄对应的人格说明、生活相似点和建议。"
}
```

如果想让某个英雄拥有更明确的专属匹配倾向，可以在 `src/App.jsx` 中维护：

- `heroPersonaOverrides`：给英雄指定人格类型
- `signatureBoosts`：给英雄增加少量专属维度偏置
- `personalityProfiles`：维护每种人格类型的基础画像
