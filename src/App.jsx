import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Brain,
  Compass,
  Crown,
  Grid3X3,
  HeartHandshake,
  RefreshCw,
  Search,
  Share2,
  Shield,
  Sparkles,
  Swords,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { heroes } from "./data/heroes";
import { questions } from "./data/questions";

const traits = [
  { key: "drive", label: "目标驱动", icon: Target },
  { key: "focus", label: "理性判断", icon: Brain },
  { key: "empathy", label: "共情照顾", icon: HeartHandshake },
  { key: "resilience", label: "抗压韧性", icon: Shield },
  { key: "creativity", label: "灵感创造", icon: Sparkles },
  { key: "adventure", label: "冒险破局", icon: Zap },
  { key: "order", label: "秩序规划", icon: Grid3X3 },
  { key: "independence", label: "独立锋芒", icon: Compass },
  { key: "team", label: "协作连接", icon: Crown },
];

const roleBase = {
  坦克: { resilience: 9, empathy: 5, team: 6, order: 6, drive: 4, focus: 4, creativity: 2, adventure: 3, independence: 4 },
  战士: { drive: 8, resilience: 7, independence: 7, adventure: 5, focus: 5, order: 4, team: 4, empathy: 3, creativity: 3 },
  刺客: { adventure: 9, drive: 8, independence: 7, creativity: 6, focus: 5, resilience: 4, order: 3, team: 3, empathy: 2 },
  法师: { focus: 8, creativity: 8, order: 6, drive: 5, team: 4, empathy: 4, adventure: 4, independence: 4, resilience: 3 },
  射手: { drive: 8, focus: 8, order: 6, resilience: 5, independence: 5, team: 4, creativity: 3, adventure: 4, empathy: 2 },
  辅助: { empathy: 9, team: 9, order: 6, focus: 5, resilience: 5, creativity: 4, drive: 3, adventure: 3, independence: 2 },
};


const identityProfiles = [
  { name: "冷静执行者", vector: { drive: 7.5, focus: 9.5, empathy: 2.5, resilience: 6, creativity: 3, adventure: 3, order: 8.5, independence: 6, team: 4 } },
  { name: "锋芒突破者", vector: { drive: 9, focus: 5, empathy: 2, resilience: 6.5, creativity: 5, adventure: 9.5, order: 3, independence: 8.5, team: 3 } },
  { name: "温柔守护者", vector: { drive: 3.5, focus: 5, empathy: 10, resilience: 6, creativity: 4.5, adventure: 2.5, order: 6.5, independence: 2.5, team: 9.5 } },
  { name: "长期主义者", vector: { drive: 8.5, focus: 8.5, empathy: 3, resilience: 8, creativity: 3.5, adventure: 3, order: 8, independence: 6, team: 4.5 } },
  { name: "灵感表达者", vector: { drive: 5, focus: 6, empathy: 6, resilience: 3.5, creativity: 10, adventure: 6.5, order: 3.5, independence: 7, team: 5 } },
  { name: "秩序组织者", vector: { drive: 6.5, focus: 8, empathy: 5, resilience: 7, creativity: 3, adventure: 2.5, order: 10, independence: 4, team: 8 } },
  { name: "独行解决者", vector: { drive: 7, focus: 6.5, empathy: 2.5, resilience: 7.5, creativity: 5, adventure: 5.5, order: 5, independence: 10, team: 2.5 } },
  { name: "协作调度者", vector: { drive: 5, focus: 7.5, empathy: 7.5, resilience: 5.5, creativity: 4, adventure: 3.5, order: 8, independence: 3, team: 10 } },
  { name: "逆境硬扛者", vector: { drive: 6.5, focus: 4.5, empathy: 4, resilience: 10, creativity: 2.5, adventure: 5, order: 5.5, independence: 7.5, team: 5 } },
  { name: "机会猎手", vector: { drive: 8, focus: 7, empathy: 2, resilience: 4.5, creativity: 6.5, adventure: 10, order: 3.5, independence: 8, team: 3.5 } },
  { name: "审美创造者", vector: { drive: 4.5, focus: 5.5, empathy: 6.5, resilience: 3.5, creativity: 10, adventure: 5, order: 4, independence: 6.5, team: 5.5 } },
  { name: "沉稳可靠者", vector: { drive: 5.5, focus: 7, empathy: 6.5, resilience: 9.5, creativity: 2.5, adventure: 2.5, order: 8, independence: 4.5, team: 7 } },
  { name: "目标竞速者", vector: { drive: 10, focus: 7.5, empathy: 2, resilience: 5.5, creativity: 4, adventure: 6.5, order: 5.5, independence: 7, team: 3.5 } },
  { name: "关系连接者", vector: { drive: 4, focus: 5.5, empathy: 9.5, resilience: 5, creativity: 5.5, adventure: 3.5, order: 5, independence: 2.5, team: 9 } },
  { name: "策略控场者", vector: { drive: 5.5, focus: 10, empathy: 4, resilience: 5, creativity: 6, adventure: 3.5, order: 8.5, independence: 5, team: 6 } },
  { name: "自由游侠", vector: { drive: 5.5, focus: 4.5, empathy: 3.5, resilience: 4.5, creativity: 7.5, adventure: 9.5, order: 2.5, independence: 9.5, team: 3 } },
  { name: "团队发动机", vector: { drive: 7, focus: 6, empathy: 7, resilience: 7, creativity: 4.5, adventure: 6, order: 6.5, independence: 3.5, team: 9.5 } },
  { name: "慢热蓄力者", vector: { drive: 7.5, focus: 8, empathy: 4, resilience: 8.5, creativity: 3, adventure: 2.5, order: 7.5, independence: 6.5, team: 4 } },
];

const heroPersonaOverrides = {
  廉颇: "逆境硬扛者", 小乔: "审美创造者", 赵云: "团队发动机", 墨子: "策略控场者", 妲己: "机会猎手", 嬴政: "秩序组织者",
  孙尚香: "目标竞速者", 鲁班七号: "长期主义者", 庄周: "自由游侠", 刘禅: "温柔守护者", 高渐离: "灵感表达者", 阿轲: "机会猎手",
  钟无艳: "逆境硬扛者", 孙膑: "协作调度者", 扁鹊: "温柔守护者", 白起: "沉稳可靠者", 芈月: "独行解决者", 吕布: "锋芒突破者",
  周瑜: "策略控场者", 夏侯惇: "沉稳可靠者", 甄姬: "策略控场者", 曹操: "目标竞速者", 典韦: "逆境硬扛者", 宫本武藏: "独行解决者",
  李白: "自由游侠", 马可波罗: "自由游侠", 狄仁杰: "冷静执行者", 达摩: "沉稳可靠者", 项羽: "逆境硬扛者", 武则天: "秩序组织者",
  老夫子: "长期主义者", 关羽: "锋芒突破者", 貂蝉: "审美创造者", 安琪拉: "机会猎手", 程咬金: "逆境硬扛者", 露娜: "灵感表达者",
  姜子牙: "策略控场者", 刘邦: "协作调度者", 韩信: "机会猎手", 王昭君: "策略控场者", 兰陵王: "机会猎手", 花木兰: "独行解决者",
  张良: "冷静执行者", 不知火舞: "锋芒突破者", 娜可露露: "自由游侠", 橘右京: "独行解决者", 亚瑟: "沉稳可靠者", 孙悟空: "锋芒突破者",
  牛魔: "温柔守护者", 后羿: "长期主义者", 刘备: "团队发动机", 张飞: "逆境硬扛者", 李元芳: "目标竞速者", 虞姬: "冷静执行者",
  钟馗: "机会猎手", 成吉思汗: "自由游侠", 杨戬: "独行解决者", 雅典娜: "秩序组织者", 蔡文姬: "关系连接者", 太乙真人: "协作调度者",
  哪吒: "锋芒突破者", 诸葛亮: "策略控场者", 黄忠: "长期主义者", 大乔: "协作调度者", 东皇太一: "沉稳可靠者", 干将莫邪: "冷静执行者",
  鬼谷子: "策略控场者", 铠: "逆境硬扛者", 百里守约: "冷静执行者", 百里玄策: "机会猎手", 苏烈: "沉稳可靠者", 梦奇: "温柔守护者",
  女娲: "秩序组织者", 明世隐: "关系连接者", 公孙离: "审美创造者", 杨玉环: "关系连接者", 裴擒虎: "锋芒突破者", 弈星: "策略控场者",
  狂铁: "逆境硬扛者", 米莱狄: "秩序组织者", 元歌: "灵感表达者", 司马懿: "机会猎手", 孙策: "团队发动机", 盾山: "沉稳可靠者",
  伽罗: "长期主义者", 沈梦溪: "灵感表达者", 李信: "独行解决者", 上官婉儿: "灵感表达者", 嫦娥: "冷静执行者", 猪八戒: "逆境硬扛者",
  盘古: "秩序组织者", 瑶: "关系连接者", 云中君: "自由游侠", 曜: "自由游侠", 马超: "锋芒突破者", 西施: "策略控场者",
  鲁班大师: "秩序组织者", 蒙犽: "目标竞速者", 镜: "锋芒突破者", 蒙恬: "秩序组织者", 阿古朵: "关系连接者", 夏洛特: "冷静执行者",
  澜: "机会猎手", 司空震: "目标竞速者", 艾琳: "审美创造者", 云缨: "团队发动机", 金蝉: "沉稳可靠者", 暃: "自由游侠",
  桑启: "温柔守护者", 戈娅: "自由游侠", 海月: "策略控场者", 赵怀真: "沉稳可靠者", 莱西奥: "目标竞速者", 姬小满: "灵感表达者",
  亚连: "沉稳可靠者", 朵莉亚: "关系连接者", 海诺: "冷静执行者", 敖隐: "目标竞速者", 大司命: "机会猎手", 少司缘: "关系连接者",
  影: "独行解决者", 苍: "自由游侠", 空空儿: "灵感表达者", 蚩奼: "锋芒突破者", 孙权: "秩序组织者", 大禹: "沉稳可靠者",
  "元流之子(坦克)": "沉稳可靠者", "元流之子(战士)": "团队发动机", "元流之子(法师)": "策略控场者", "元流之子(射手)": "目标竞速者", "元流之子(辅助)": "协作调度者", "元流之子(刺客)": "机会猎手",
};

const colorSets = [
  "gold",
  "cyan",
  "violet",
  "rose",
  "emerald",
  "blue",
  "orange",
  "silver",
];

const roleGameProfiles = {
  坦克: {
    feature: "在游戏里偏向承伤、开团和保护，常用身体给队友争取输出空间，是团队正面阵型的地基。",
    life: "你像这类英雄一样，遇到麻烦时更愿意先稳住局面，再把压力一点点消化掉。",
  },
  战士: {
    feature: "在游戏里兼具对抗、切入和持续作战能力，既能单线处理问题，也能在团战里承担关键突破。",
    life: "你像这类英雄一样，不喜欢只停留在想法层面，更习惯亲自上手，把问题推进到有结果。",
  },
  刺客: {
    feature: "在游戏里强调高机动、抓机会和瞬间爆发，擅长从侧面切入，用一次精准判断改变战局。",
    life: "你像这类英雄一样，对机会很敏感，讨厌拖泥带水，关键时刻敢下判断、敢承担结果。",
  },
  法师: {
    feature: "在游戏里依靠技能范围、控制、爆发或消耗建立影响力，讲究距离感、节奏感和出手时机。",
    life: "你像这类英雄一样，更重视思考、表达和方法，喜欢先看清结构，再用聪明方式解决问题。",
  },
  射手: {
    feature: "在游戏里通常是持续输出核心，前期需要积累和保护，后期能凭稳定火力接管局面。",
    life: "你像这类英雄一样，愿意长期投入、耐心成长，一旦进入自己的强势区，就能持续产出价值。",
  },
  辅助: {
    feature: "在游戏里负责视野、保护、增益和团队节奏，不一定最抢眼，却常常决定队伍能不能顺利运转。",
    life: "你像这类英雄一样，很在意关系、氛围和协作质量，擅长让身边的人发挥得更稳定。",
  },
};

const traitInsights = {
  drive: {
    define: "目标驱动型",
    strength: "目标感强，执行速度快，能把想法推进成结果。",
    weakness: "容易把成败看得太重，偶尔会忽略过程里的感受。",
    advice: "给自己设置阶段性奖励，别只等最终胜利才允许快乐。",
  },
  focus: {
    define: "理性分析型",
    strength: "判断清楚，擅长拆解复杂问题，不容易被情绪带偏。",
    weakness: "有时会想太多，机会窗口可能在反复权衡中溜走。",
    advice: "重要决定可以先定标准，再给行动一个截止时间。",
  },
  empathy: {
    define: "共情连接型",
    strength: "很会照顾他人状态，能让团队和关系变得更舒服。",
    weakness: "容易过度体谅别人，把自己的需求放到最后。",
    advice: "温柔不等于无限让步，边界感也是一种高级的善良。",
  },
  resilience: {
    define: "抗压韧性型",
    strength: "能扛事，关键时刻稳定，越困难越能显出可靠。",
    weakness: "容易习惯硬撑，不主动求助，压力积累后才爆发。",
    advice: "把求助当成资源调度，而不是能力不足的证明。",
  },
  creativity: {
    define: "灵感创造型",
    strength: "想法灵活，表达有特色，擅长用新角度打开局面。",
    weakness: "容易被新鲜感牵引，长期重复任务会消耗热情。",
    advice: "把灵感落到固定节奏里，才会从闪光变成作品。",
  },
  adventure: {
    define: "冒险破局型",
    strength: "敢试、敢冲、敢在不确定中寻找突破口。",
    weakness: "偶尔会低估风险，凭感觉冲进复杂局面。",
    advice: "保留你的锐气，同时给每次冒险准备一个撤退方案。",
  },
  order: {
    define: "秩序规划型",
    strength: "条理清楚，重视边界和流程，能把混乱整理成系统。",
    weakness: "面对突发变化时，可能会因为计划被打乱而烦躁。",
    advice: "计划里预留弹性区，人生不是每一局都按攻略刷新。",
  },
  independence: {
    define: "独立锋芒型",
    strength: "有主见，不盲从，能独立承担关键任务。",
    weakness: "容易一个人扛太久，让别人不知道该怎么靠近你。",
    advice: "真正的强不是永远单挑，而是知道何时借力。",
  },
  team: {
    define: "协作共赢型",
    strength: "大局观好，懂配合，能把不同的人组织到同一方向。",
    weakness: "有时会为了整体和谐压低个人表达。",
    advice: "团队需要你的协调，也需要你清楚说出自己的判断。",
  },
};

const traitSummary = {
  drive: "你对结果很敏感，不太愿意把人生交给随机数。",
  focus: "你习惯先看清问题结构，再决定如何出手。",
  empathy: "你很会照顾人的状态，也能捕捉关系里的微妙信号。",
  resilience: "你能扛事，越到关键时刻越不容易散。",
  creativity: "你擅长把旧问题换个角度拆开，脑洞和美感都在线。",
  adventure: "你愿意试新路，不怕在不确定性里找机会。",
  order: "你喜欢秩序、边界和清晰计划，讨厌事情糊成一锅粥。",
  independence: "你有自己的判断，不太容易被外界节奏完全带走。",
  team: "你重视协作和整体气氛，知道一个人强不等于全局赢。",
};

function hashName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % 9973;
  }
  return hash;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getProfileByName(profileName) {
  return identityProfiles.find((profile) => profile.name === profileName);
}

function getSeededIdentityProfile(hero) {
  const explicit = getProfileByName(heroPersonaOverrides[hero.name]);
  if (explicit) return explicit;
  const seed = hashName(`${hero.id}-${hero.name}`);
  return identityProfiles[seed % identityProfiles.length];
}

function getSecondaryIdentityProfile(hero) {
  const seed = hashName(`${hero.name}-${hero.roles.join("/")}-${hero.id}`);
  return identityProfiles[Math.floor(seed / 7) % identityProfiles.length];
}

function buildHeroTarget(hero) {
  const roleAverage = Object.fromEntries(traits.map((trait) => [trait.key, 0]));
  hero.roles.forEach((role) => {
    const base = roleBase[role] || {};
    traits.forEach(({ key }) => {
      roleAverage[key] += base[key] || 0;
    });
  });

  traits.forEach(({ key }) => {
    roleAverage[key] = roleAverage[key] / Math.max(hero.roles.length, 1);
  });

  const primaryProfile = getSeededIdentityProfile(hero);
  const secondaryProfile = getSecondaryIdentityProfile(hero);
  const seed = hashName(`${hero.name}-${hero.id}-fingerprint`);
  const traitKeys = traits.map((trait) => trait.key);
  const firstBoost = traitKeys[seed % traitKeys.length];
  const secondBoost = traitKeys[Math.floor(seed / 11) % traitKeys.length];
  const thirdBoost = traitKeys[Math.floor(seed / 37) % traitKeys.length];
  const dampTrait = traitKeys[Math.floor(seed / 101) % traitKeys.length];

  const target = Object.fromEntries(
    traits.map(({ key }) => {
      // 旧版像“分路预测”，核心原因是 roleBase 权重太高。
      // 新版把英雄人格画像权重提高到 60% 以上，让同为射手/法师的英雄也能明显分开。
      const identityValue = (primaryProfile.vector[key] || 5) * 0.78 + (secondaryProfile.vector[key] || 5) * 0.22;
      const mixed = roleAverage[key] * 0.36 + identityValue * 0.64;
      return [key, mixed];
    })
  );

  target[firstBoost] += 1.25;
  target[secondBoost] += secondBoost === firstBoost ? 0.35 : 0.85;
  target[thirdBoost] += thirdBoost === firstBoost || thirdBoost === secondBoost ? 0.2 : 0.55;
  target[dampTrait] -= 0.75;

  const boosts = {
    李白: { creativity: 1.3, adventure: 1.2, independence: 0.8, order: -0.6 },
    韩信: { adventure: 1.4, drive: 0.8, independence: 0.7 },
    诸葛亮: { focus: 1.2, order: 0.8, adventure: -0.4 },
    孙尚香: { drive: 1.1, focus: 0.8, resilience: 0.5 },
    鲁班七号: { focus: 1.2, drive: 0.7, order: 0.7, adventure: -0.6 },
    孙悟空: { adventure: 1.1, drive: 1.1, order: -0.5 },
    貂蝉: { creativity: 1.1, resilience: 0.9, independence: 0.5 },
    铠: { resilience: 1.4, independence: 0.8, empathy: -0.4 },
    花木兰: { independence: 1.1, resilience: 0.8, focus: 0.5 },
    张飞: { resilience: 1.3, team: 1.0, empathy: 0.6 },
    蔡文姬: { empathy: 1.4, team: 1.0, drive: -0.4 },
    大乔: { team: 1.2, order: 1.0, focus: 0.5 },
    瑶: { empathy: 1.2, creativity: 0.7, team: 0.6 },
    关羽: { adventure: 1.2, independence: 0.8, drive: 0.6 },
    王昭君: { focus: 1.1, order: 1.1, adventure: -0.4 },
    老夫子: { order: 1.0, independence: 1.1, resilience: 0.6 },
    大禹: { resilience: 1.4, order: 1.0, team: 0.5 },
    孙权: { order: 1.1, team: 0.8, focus: 0.7 },
    空空儿: { creativity: 1.1, adventure: 1.0, independence: 0.7 },
    蚩奼: { adventure: 1.2, drive: 0.9, resilience: 0.8 },
    "元流之子(刺客)": { adventure: 1.4, creativity: 0.8, independence: 0.8 },
  };

  Object.entries(boosts[hero.name] || {}).forEach(([key, value]) => {
    target[key] = (target[key] || 0) + value;
  });

  traits.forEach(({ key }) => {
    target[key] = clamp(target[key], 0.6, 10);
  });

  const primaryTrait = traits
    .map((trait) => ({ ...trait, value: target[trait.key] }))
    .sort((a, b) => b.value - a.value)[0];

  return {
    values: target,
    persona: primaryProfile.name,
    primaryTrait: primaryTrait?.key || "drive",
  };
}

function emptyScores() {
  return Object.fromEntries(traits.map((trait) => [trait.key, 0]));
}

function calculateScores(answers) {
  return answers.reduce((acc, selectedIndex, questionIndex) => {
    if (selectedIndex === null) return acc;
    const option = questions[questionIndex].options[selectedIndex];
    Object.entries(option.scores).forEach(([key, value]) => {
      acc[key] = (acc[key] || 0) + value;
    });
    return acc;
  }, emptyScores());
}

function getHeroColor(hero) {
  return colorSets[hashName(hero.name) % colorSets.length];
}

function getVectorDistance(userVector, heroVector) {
  let weightedSquareSum = 0;
  let weightSum = 0;
  let dot = 0;
  let userMagnitude = 0;
  let heroMagnitude = 0;

  traits.forEach(({ key }) => {
    const userValue = userVector[key] || 0;
    const heroValue = heroVector[key] || 0;
    // 用户越明显的特质权重越高，避免最后只按“职业平均值”归类。
    const weight = 1 + userValue / 8;
    const diff = userValue - heroValue;
    weightedSquareSum += weight * diff * diff;
    weightSum += weight;
    dot += userValue * heroValue;
    userMagnitude += userValue * userValue;
    heroMagnitude += heroValue * heroValue;
  });

  const shapeDistance = Math.sqrt(weightedSquareSum / Math.max(weightSum, 1));
  const cosine = dot / Math.max(Math.sqrt(userMagnitude) * Math.sqrt(heroMagnitude), 0.0001);
  const directionPenalty = (1 - cosine) * 6.5;

  return shapeDistance + directionPenalty;
}

function getMatches(scores) {
  const maxUserScore = Math.max(...Object.values(scores), 1);
  const normalized = Object.fromEntries(
    traits.map(({ key }) => [key, (scores[key] / maxUserScore) * 10])
  );

  const ranked = heroes
    .map((hero) => {
      const target = buildHeroTarget(hero);
      const distance = getVectorDistance(normalized, target.values);
      return {
        ...hero,
        target: target.values,
        persona: target.persona,
        primaryTrait: target.primaryTrait,
        color: getHeroColor(hero),
        distance,
      };
    })
    .sort((a, b) => a.distance - b.distance);

  const best = ranked[0]?.distance ?? 0;
  const topScore = clamp(Math.round(100 - best * 2.7), 91, 99);

  return ranked.map((hero, index) => {
    const gap = hero.distance - best;
    // 旧版把所有分数压在 66-99，近邻英雄自然全是 98/99。
    // 新版加入排名衰减和距离放大，让“第一像谁”更明确，备选也能看出层级。
    const rankPenalty = index === 0 ? 0 : 5.5 + Math.log2(index + 1) * 4.8;
    const distancePenalty = Math.pow(Math.max(gap, 0), 1.22) * 9.2;
    const score = index === 0 ? topScore : topScore - rankPenalty - distancePenalty;
    return { ...hero, rank: index + 1, match: clamp(Math.round(score), 38, index === 0 ? 99 : topScore - 6) };
  });
}

function getDiverseMatches(matches, count = 6) {
  if (!matches.length) return [];
  const picked = [matches[0]];
  const usedRoles = new Set(matches[0].roles);
  const usedPersonas = new Set([matches[0].persona]);
  const usedTraits = new Set([matches[0].primaryTrait]);

  for (const hero of matches.slice(1)) {
    if (picked.length >= count) break;
    const hasNewRole = hero.roles.some((role) => !usedRoles.has(role));
    const hasNewPersona = !usedPersonas.has(hero.persona);
    const hasNewTrait = !usedTraits.has(hero.primaryTrait);
    if (hasNewRole || hasNewPersona || hasNewTrait) {
      picked.push(hero);
      hero.roles.forEach((role) => usedRoles.add(role));
      usedPersonas.add(hero.persona);
      usedTraits.add(hero.primaryTrait);
    }
  }

  for (const hero of matches.slice(1)) {
    if (picked.length >= count) break;
    if (!picked.some((item) => item.name === hero.name)) picked.push(hero);
  }

  return picked;
}

function getTopTraits(scores, count = 4) {
  return traits
    .map((trait) => ({ ...trait, value: scores[trait.key] || 0 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, count);
}

function roleText(roles) {
  return roles.join(" / ");
}

function getHeroGameFeature(hero) {
  const primaryRole = hero.roles[0];
  const primary = roleGameProfiles[primaryRole];
  const roleNames = roleText(hero.roles);
  const multiRoleText = hero.roles.length > 1
    ? `它还带有${hero.roles.slice(1).join("、")}属性，所以不是单一模板，而是更讲究切换节奏。`
    : "它的价值往往不在单点标签，而在稳定发挥自己的核心职责。";
  return `在游戏里，${hero.name}的定位是${roleNames}。${primary?.feature || "这个英雄的价值来自清晰定位、稳定执行和关键时刻的存在感。"}${multiRoleText}`;
}

function buildPersonalityDefinition(topTraits) {
  const main = traitInsights[topTraits[0]?.key];
  const second = traitInsights[topTraits[1]?.key];
  if (!main && !second) return "你的性格定义是：观察型潜力人格。你还没有表现出特别集中的倾向，但这也代表你具备较强的可塑性。";
  if (!second) return `你的性格定义是：${main.define}。你习惯围绕自己的核心优势行动，遇到选择时会优先相信最熟悉、最能带来确定感的方式。`;
  return `你的性格定义是：${main.define} × ${second.define}。你不是单纯靠热情或运气行动的人，而是会在自己的核心动机和第二优势之间切换：既想把事情做好，也希望过程符合你的内在秩序。`;
}

function buildSimilarityText(hero, topTraits) {
  const main = topTraits[0]?.key;
  const second = topTraits[1]?.key;
  const primaryRole = hero.roles[0];
  const roleLife = roleGameProfiles[primaryRole]?.life || "你和这个英雄相似的地方，是都需要在复杂环境中找到自己的节奏。";
  return `${roleLife}${traitSummary[main] ? ` ${traitSummary[main]}` : ""}${second && traitSummary[second] ? ` 同时，${traitSummary[second]}` : ""}`;
}

function buildStrengths(topTraits) {
  const parts = topTraits.slice(0, 3).map((trait) => traitInsights[trait.key]?.strength).filter(Boolean);
  return parts.length ? parts.join(" ") : "你的优势是适应性强，能根据环境变化调整自己的处理方式。";
}

function buildWeaknesses(topTraits) {
  const parts = topTraits.slice(0, 2).map((trait) => traitInsights[trait.key]?.weakness).filter(Boolean);
  return parts.length ? parts.join(" ") : "你的盲区是有时还不够了解自己真正的优先级，容易被外部节奏牵着走。";
}

function buildLifeAdvice(topTraits) {
  const parts = topTraits.slice(0, 2).map((trait) => traitInsights[trait.key]?.advice).filter(Boolean);
  return parts.length ? parts.join(" ") : "建议你多记录重大选择后的感受，慢慢找到真正适合自己的长期节奏。";
}

function buildResultReport(hero, topTraits) {
  const definition = buildPersonalityDefinition(topTraits);
  const similarity = buildSimilarityText(hero, topTraits);
  const strengths = buildStrengths(topTraits);
  const weaknesses = buildWeaknesses(topTraits);
  const advice = buildLifeAdvice(topTraits);
  const summary = `${hero.quote} 综合来看，你像${hero.name}，不是因为你一定会在生活里“打出爆发”，而是因为你处理问题的底层逻辑和它很接近：你有自己的节奏，也有一套判断风险、选择行动、承担结果的方式。${definition} 你的优势在于${strengths} 需要注意的是，${weaknesses} 给你的生活建议是：${advice}`;
  return {
    gameFeature: getHeroGameFeature(hero),
    similarity,
    definition,
    strengths,
    weaknesses,
    advice,
    summary,
  };
}

function getOptionLetter(index) {
  return String.fromCharCode(65 + index);
}

function ResultScreen({ result, matches, topTraits, scores, maxTraitScore, onBack, onReset }) {
  const [copied, setCopied] = useState(false);
  const report = buildResultReport(result, topTraits);
  const displayMatches = getDiverseMatches(matches, 6);
  const quizLink = typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}` : "";

  async function copyQuizLink() {
    try {
      await navigator.clipboard.writeText(quizLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="app-shell result-shell">
      <div className="bg-aurora aurora-one" />
      <div className="bg-aurora aurora-two" />
      <div className="bg-aurora aurora-three" />

      <main className="page result-page">
        <div className="result-nav">
          <button className="nav-button" onClick={onBack}>
            <ArrowLeft size={18} />
            修改答案
          </button>
          <div className="result-nav-actions">
            <button className="ghost-button inline" onClick={copyQuizLink}>
              <Share2 size={16} />
              {copied ? "已复制链接" : "复制测评链接"}
            </button>
            <button className="result-button inline" onClick={onReset}>
              <RefreshCw size={16} />
              重新测一次
            </button>
          </div>
        </div>

        <section className={`result-page-hero ${result.color}`}>
          <div className="result-page-mark">{result.icon}</div>
          <div className="result-page-copy">
            <div className="eyebrow result-eyebrow">
              <Trophy size={16} />
              测评完成 · 已生成你的英雄人格报告
            </div>
            <span className="result-kicker">你的本命英雄人格是</span>
            <h1>{result.name}</h1>
            <p className="result-title">{result.title}</p>
            <div className="result-tags">
              <span>{roleText(result.roles)}</span>
              <span>{result.persona}</span>
              <span>{topTraits.map((trait) => trait.label).join(" · ")}</span>
            </div>
            <p className="result-page-summary">{report.summary}</p>
          </div>

          <div className="result-score-card">
            <strong>{result.match}%</strong>
            <span>综合匹配度</span>
            <small>匹配算法已加入英雄人格标签和生活特质权重，不只按分路计算。</small>
          </div>
        </section>

        <section className="result-page-layout">
          <div className="result-report-stack">
            <div className="report-grid full-page">
              <article className="report-card wide highlight">
                <span>游戏里的TA</span>
                <p>{report.gameFeature}</p>
              </article>
              <article className="report-card wide highlight">
                <span>你和TA相似在哪里</span>
                <p>{report.similarity}</p>
              </article>
              <article className="report-card">
                <span>性格定义</span>
                <p>{report.definition}</p>
              </article>
              <article className="report-card">
                <span>你的优点</span>
                <p>{report.strengths}</p>
              </article>
              <article className="report-card">
                <span>可能的缺点</span>
                <p>{report.weaknesses}</p>
              </article>
              <article className="report-card">
                <span>生活 / 人生建议</span>
                <p>{report.advice}</p>
              </article>
            </div>
          </div>

          <aside className="result-sidebar">
            <div className="trait-card">
              <div className="trait-card-title">
                <span>生活人格雷达</span>
                <small>{topTraits.map((trait) => trait.label).join(" · ")}</small>
              </div>
              <TraitBars scores={scores} maxTraitScore={maxTraitScore} />
            </div>

            <div className="alt-matches">
              <h4>备选英雄人格</h4>
              {displayMatches.slice(1).map((hero) => (
                <div key={hero.name} className="alt-row">
                  <span>{hero.icon}</span>
                  <div>
                    <strong>{hero.name}</strong>
                    <small>{roleText(hero.roles)} · {hero.persona}</small>
                  </div>
                  <em>{hero.match}%</em>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="publish-note">
          <strong>网站分享方式</strong>
          <p>部署上线后，把浏览器地址栏里的首页链接发给用户，用户手机打开就能直接测评；结果会在这个独立结果界面展示。</p>
        </section>
      </main>
    </div>
  );
}

export default function App() {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [current, setCurrent] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [heroQuery, setHeroQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("全部");

  useEffect(() => {
    function syncHash() {
      setShowResult(window.location.hash === "#result");
    }
    syncHash();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);
    return () => {
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
    };
  }, []);

  const answeredCount = answers.filter((answer) => answer !== null).length;
  const progress = Math.round((answeredCount / questions.length) * 100);
  const canShowResult = answeredCount === questions.length;

  const scores = useMemo(() => calculateScores(answers), [answers]);
  const matches = useMemo(() => getMatches(scores), [scores]);
  const result = matches[0];
  const topTraits = useMemo(() => getTopTraits(scores), [scores]);
  const maxTraitScore = Math.max(...Object.values(scores), 1);

  const roles = ["全部", "坦克", "战士", "刺客", "法师", "射手", "辅助"];
  const filteredHeroes = heroes.filter((hero) => {
    const queryHit = !heroQuery.trim() || hero.name.includes(heroQuery.trim());
    const roleHit = roleFilter === "全部" || hero.roles.includes(roleFilter);
    return queryHit && roleHit;
  });

  useEffect(() => {
    if (showResult && !canShowResult) {
      setShowResult(false);
      if (window.location.hash === "#result") {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      }
    }
  }, [showResult, canShowResult]);

  function choose(optionIndex) {
    const next = [...answers];
    next[current] = optionIndex;
    setAnswers(next);
    setShowResult(false);
    if (window.location.hash === "#result") {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
    if (current < questions.length - 1) {
      setTimeout(() => setCurrent((value) => Math.min(questions.length - 1, value + 1)), 120);
    }
  }

  function openResult() {
    if (!canShowResult) return;
    setShowResult(true);
    if (window.location.hash !== "#result") {
      window.history.pushState(null, "", "#result");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function backToQuiz() {
    setShowResult(false);
    if (window.location.hash === "#result") {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setAnswers(Array(questions.length).fill(null));
    setCurrent(0);
    setShowResult(false);
    if (window.location.hash === "#result") {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const currentQuestion = questions[current];

  if (showResult && canShowResult) {
    return (
      <ResultScreen
        result={result}
        matches={matches}
        topTraits={topTraits}
        scores={scores}
        maxTraitScore={maxTraitScore}
        onBack={backToQuiz}
        onReset={reset}
      />
    );
  }

  return (
    <div className="app-shell">
      <div className="bg-aurora aurora-one" />
      <div className="bg-aurora aurora-two" />
      <div className="bg-aurora aurora-three" />

      <main className="page">
        <header className="hero-header">
          <div className="hero-copy">
            <div className="eyebrow">
              <Sparkles size={16} />
              30道生活题 · 4选1 · 覆盖{heroes.length}位王者荣耀英雄
            </div>
            <h1>
              王者荣耀
              <span>生活人格英雄测评</span>
            </h1>
            <p>
              不问段位、不问位置，只用日常选择、压力反应、协作方式和人生偏好，测出最像你的峡谷英雄人格。
            </p>
          </div>

          <div className="header-card">
            <div className="header-card-top">
              <Award />
              <span>全英雄池</span>
            </div>
            <strong>{heroes.length}</strong>
            <small>包含新英雄与元流之子多职业条目</small>
            <button onClick={reset} className="ghost-button">
              <RefreshCw size={16} />
              重新开始
            </button>
          </div>
        </header>

        <section className="quiz-layout">
          <section className="quiz-card">
            <div className="quiz-meta">
              <div>
                <strong>第 {current + 1} 题 / {questions.length}</strong>
                <span>已完成 {answeredCount} 题 · {progress}%</span>
              </div>
              <button
                className="result-button compact"
                disabled={!canShowResult}
                onClick={openResult}
              >
                <Crown size={16} />
                查看结果
              </button>
            </div>

            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>

            <div className="question-panel" key={current}>
              <div className="question-badge">
                <Brain size={20} />
              </div>
              <h2>{currentQuestion.text}</h2>

              <div className="options">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={option.text}
                    onClick={() => choose(index)}
                    className={`option ${answers[current] === index ? "selected" : ""}`}
                  >
                    <span>{getOptionLetter(index)}</span>
                    <p>{option.text}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="quiz-actions">
              <button
                className="nav-button"
                disabled={current === 0}
                onClick={() => setCurrent((value) => Math.max(0, value - 1))}
              >
                <ArrowLeft size={18} />
                上一题
              </button>

              <div className="question-dots" aria-label="题目导航">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    aria-label={`跳转到第 ${index + 1} 题`}
                    onClick={() => setCurrent(index)}
                    className={[
                      answers[index] !== null ? "done" : "",
                      current === index ? "active" : "",
                    ].join(" ")}
                  />
                ))}
              </div>

              {current < questions.length - 1 ? (
                <button
                  className="nav-button primary"
                  onClick={() => setCurrent((value) => Math.min(questions.length - 1, value + 1))}
                >
                  下一题
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  className="result-button"
                  disabled={!canShowResult}
                  onClick={openResult}
                >
                  <Crown size={18} />
                  生成我的英雄
                </button>
              )}
            </div>
          </section>

          <aside className="side-card">
            {showResult && canShowResult ? (
              <ResultPanel result={result} matches={matches} topTraits={topTraits} scores={scores} maxTraitScore={maxTraitScore} />
            ) : (
              <LivePanel topTraits={topTraits} scores={scores} answeredCount={answeredCount} maxTraitScore={maxTraitScore} />
            )}
          </aside>
        </section>

        <section className="hero-pool">
          <div className="section-title">
            <div>
              <span>Hero Pool</span>
              <h3>当前工程内置英雄池</h3>
            </div>
            <p>结果匹配会从下面全部英雄中计算，并结合英雄人格标签，不再只按分路粗略归类。</p>
          </div>

          <div className="pool-toolbar">
            <label className="search-box">
              <Search size={18} />
              <input value={heroQuery} onChange={(event) => setHeroQuery(event.target.value)} placeholder="搜索英雄，例如 李白 / 大禹 / 元流之子" />
            </label>
            <div className="role-tabs">
              {roles.map((role) => (
                <button key={role} className={roleFilter === role ? "active" : ""} onClick={() => setRoleFilter(role)}>
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="hero-grid">
            {filteredHeroes.map((hero) => (
              <div key={hero.name} className={`hero-chip ${getHeroColor(hero)}`}>
                <span className="hero-icon">{hero.icon}</span>
                <div>
                  <strong>{hero.name}</strong>
                  <small>{roleText(hero.roles)}</small>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer>
          娱乐向测评 · 非官方项目 · 王者荣耀相关名称归其权利方所有 · 英雄名单可在 src/data/heroes.js 中维护
        </footer>
      </main>
    </div>
  );
}

function LivePanel({ topTraits, scores, answeredCount, maxTraitScore }) {
  return (
    <div className="live-panel">
      <div className="side-hero">
        <div className="side-orb">
          <Swords size={34} />
        </div>
        <h3>人格雷达生成中</h3>
        <p>
          完成 30 道生活场景题后，会根据你的目标驱动、理性判断、共情照顾、抗压韧性、创造力、冒险心、秩序感、独立性和协作力进行全英雄匹配。
        </p>
      </div>

      <div className="trait-card">
        <div className="trait-card-title">
          <span>当前最高倾向</span>
          <small>{answeredCount ? "已生成预览" : "待答题"}</small>
        </div>

        {answeredCount ? (
          <>
            <div className="top-traits">
              {topTraits.map((trait) => (
                <span key={trait.key}>{trait.label}</span>
              ))}
            </div>
            <TraitBars scores={scores} maxTraitScore={maxTraitScore} />
          </>
        ) : (
          <p className="muted">先选一题，右侧会实时出现你的生活人格倾向。放心，不会问你“你最爱打哪一路”这种废话。</p>
        )}
      </div>
    </div>
  );
}

function ResultPanel({ result, matches, topTraits, scores, maxTraitScore }) {
  const report = buildResultReport(result, topTraits);
  const displayMatches = getDiverseMatches(matches, 6);
  return (
    <div className="result-panel">
      <div className={`result-card ${result.color}`}>
        <div className="result-bg-mark">{result.icon}</div>
        <div className="result-top">
          <div>
            <span>你的本命英雄人格是</span>
            <h2>{result.name}</h2>
            <p>{result.title}</p>
          </div>
          <div className="match-score">
            <strong>{result.match}%</strong>
            <small>匹配度</small>
          </div>
        </div>
        <div className="role-line">{roleText(result.roles)} · {result.persona}</div>
        <p className="result-desc">{report.summary}</p>
      </div>

      <div className="report-grid">
        <article className="report-card wide">
          <span>游戏里的TA</span>
          <p>{report.gameFeature}</p>
        </article>
        <article className="report-card wide">
          <span>你和TA相似在哪里</span>
          <p>{report.similarity}</p>
        </article>
        <article className="report-card">
          <span>性格定义</span>
          <p>{report.definition}</p>
        </article>
        <article className="report-card">
          <span>你的优点</span>
          <p>{report.strengths}</p>
        </article>
        <article className="report-card">
          <span>可能的缺点</span>
          <p>{report.weaknesses}</p>
        </article>
        <article className="report-card">
          <span>生活 / 人生建议</span>
          <p>{report.advice}</p>
        </article>
      </div>

      <div className="trait-card">
        <div className="trait-card-title">
          <span>你的生活人格雷达</span>
          <small>{topTraits.map((trait) => trait.label).join(" · ")}</small>
        </div>
        <TraitBars scores={scores} maxTraitScore={maxTraitScore} />
      </div>

      <div className="alt-matches">
        <h4>备选英雄人格</h4>
        {displayMatches.slice(1).map((hero) => (
          <div key={hero.name} className="alt-row">
            <span>{hero.icon}</span>
            <div>
              <strong>{hero.name}</strong>
              <small>{roleText(hero.roles)} · {hero.persona}</small>
            </div>
            <em>{hero.match}%</em>
          </div>
        ))}
      </div>
    </div>
  );
}

function TraitBars({ scores, maxTraitScore }) {
  return (
    <div className="trait-bars">
      {traits.map((trait) => {
        const width = Math.max(6, Math.round(((scores[trait.key] || 0) / maxTraitScore) * 100));
        const Icon = trait.icon;
        return (
          <div className="trait-row" key={trait.key}>
            <div className="trait-label">
              <span>
                <Icon size={14} />
                {trait.label}
              </span>
              <em>{scores[trait.key] || 0}</em>
            </div>
            <div className="bar">
              <i style={{ width: `${width}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
