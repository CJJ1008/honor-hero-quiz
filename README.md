# 王者荣耀生活人格英雄测评

一个完整的 Vite + React 单页网站工程：30 道生活场景选择题，4 选 1，答完后从内置全英雄池中匹配最像你的王者荣耀英雄人格。

## 功能

- 30 道题全部源于生活场景，不询问游戏位置、段位、操作偏好
- 英雄池放在 `src/data/heroes.js`，当前内置 130 个英雄/职业条目
- 题目放在 `src/data/questions.js`，方便继续增删改
- 根据 9 个生活人格维度计算匹配：目标驱动、理性判断、共情照顾、抗压韧性、灵感创造、冒险破局、秩序规划、独立锋芒、协作连接
- 结果页展示本命英雄、匹配度、人格描述、人格雷达、备选英雄
- 页面包含英雄池搜索和职业筛选
- 响应式适配桌面端与移动端

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
  quote: "你不怕复杂任务，习惯把想法落到行动里。"
}
```

匹配向量会根据职业自动生成，也可以在 `src/App.jsx` 的 `buildHeroTarget` 函数里给特定英雄加偏置。
