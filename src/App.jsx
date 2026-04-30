import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Brain,
  Compass,
  Crown,
  Grid3X3,
  HeartHandshake,
  Home,
  Layers3,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  Swords,
  Target,
  Users,
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

const personalityProfiles = {
  guardian: {
    label: "守护壁垒型",
    short: "保护、承压、稳定阵型",
    target: { drive: 4.5, focus: 5.2, empathy: 7.2, resilience: 9.4, creativity: 2.2, adventure: 3.2, order: 7.6, independence: 4.6, team: 8.2 },
  },
  strategist: {
    label: "冷静谋略型",
    short: "分析、预判、全局调度",
    target: { drive: 5.8, focus: 9.5, empathy: 4.5, resilience: 4.8, creativity: 6.6, adventure: 3.6, order: 9.2, independence: 5.4, team: 6.4 },
  },
  visionary: {
    label: "灵感控场型",
    short: "创造、表达、空间感",
    target: { drive: 5.2, focus: 7.2, empathy: 5.2, resilience: 3.8, creativity: 9.6, adventure: 5.4, order: 6.3, independence: 5.2, team: 4.8 },
  },
  hunter: {
    label: "机会猎手型",
    short: "爆发、窗口、精准切入",
    target: { drive: 8.6, focus: 6.2, empathy: 2.4, resilience: 4.4, creativity: 6.7, adventure: 9.7, order: 3.4, independence: 8.4, team: 3.2 },
  },
  maverick: {
    label: "自由变奏型",
    short: "机动、花活、非线性解法",
    target: { drive: 6.6, focus: 5.6, empathy: 3.6, resilience: 4.8, creativity: 9.2, adventure: 8.8, order: 2.8, independence: 8.9, team: 3.9 },
  },
  challenger: {
    label: "正面破局型",
    short: "执行、强攻、主动承担",
    target: { drive: 9.2, focus: 5.4, empathy: 3.2, resilience: 8.2, creativity: 4.2, adventure: 7.4, order: 4.8, independence: 7.4, team: 4.8 },
  },
  anchor: {
    label: "长期抗压型",
    short: "耐心、消耗、越打越稳",
    target: { drive: 6.8, focus: 5.6, empathy: 4.8, resilience: 9.8, creativity: 3.2, adventure: 3.8, order: 6.8, independence: 6.4, team: 5.2 },
  },
  nurturer: {
    label: "治愈连接型",
    short: "照顾、续航、情绪价值",
    target: { drive: 3.6, focus: 5.4, empathy: 9.8, resilience: 5.4, creativity: 5.8, adventure: 3.4, order: 6.8, independence: 2.8, team: 9.8 },
  },
  connector: {
    label: "团队节奏型",
    short: "协调、转线、组织配合",
    target: { drive: 4.8, focus: 7.2, empathy: 8.2, resilience: 5.4, creativity: 6.2, adventure: 5.6, order: 8.4, independence: 3.4, team: 9.6 },
  },
  precision: {
    label: "精准兑现型",
    short: "耐心、距离、稳定输出",
    target: { drive: 9.3, focus: 9.2, empathy: 2.4, resilience: 5.8, creativity: 4.2, adventure: 4.8, order: 7.8, independence: 6.4, team: 4.2 },
  },
  soloist: {
    label: "独立锋芒型",
    short: "自我节奏、单点突破",
    target: { drive: 8.4, focus: 6.6, empathy: 2.8, resilience: 6.8, creativity: 5.2, adventure: 6.4, order: 5.4, independence: 9.8, team: 2.8 },
  },
  ruler: {
    label: "秩序领导型",
    short: "规则、责任、带队推进",
    target: { drive: 8.4, focus: 8.2, empathy: 4.2, resilience: 6.8, creativity: 3.8, adventure: 4.6, order: 9.4, independence: 6.2, team: 7.2 },
  },
};

const heroPersonaOverrides = {
  廉颇: "guardian", 项羽: "guardian", 张飞: "guardian", 牛魔: "guardian", 苏烈: "guardian", 盾山: "guardian", 鲁班大师: "guardian", 东皇太一: "guardian", 刘邦: "guardian", 蒙恬: "guardian", "元流之子(坦克)": "guardian",
  白起: "anchor", 夏侯惇: "anchor", 程咬金: "anchor", 猪八戒: "anchor", 盘古: "anchor", 赵怀真: "anchor", 大禹: "anchor", 狂铁: "anchor", 吕布: "anchor", 钟无艳: "anchor", 梦奇: "anchor",
  诸葛亮: "strategist", 张良: "strategist", 姜子牙: "strategist", 弈星: "strategist", 女娲: "strategist", 周瑜: "strategist", 嬴政: "strategist", 武则天: "strategist", 海诺: "strategist", 孙权: "strategist", "元流之子(法师)": "strategist", 墨子: "strategist",
  小乔: "visionary", 甄姬: "visionary", 王昭君: "visionary", 西施: "visionary", 沈梦溪: "visionary", 嫦娥: "visionary", 海月: "visionary", 安琪拉: "visionary", 妲己: "visionary", 米莱狄: "visionary", 干将莫邪: "visionary", 扁鹊: "visionary", 高渐离: "visionary", 芈月: "visionary", 貂蝉: "visionary", 杨玉环: "visionary",
  李白: "hunter", 韩信: "hunter", 阿轲: "hunter", 兰陵王: "hunter", 娜可露露: "hunter", 橘右京: "hunter", 百里玄策: "hunter", 镜: "hunter", 澜: "hunter", 暃: "hunter", 空空儿: "hunter", 司马懿: "hunter", "元流之子(刺客)": "hunter",
  元歌: "maverick", 云中君: "maverick", 曜: "maverick", 公孙离: "maverick", 马可波罗: "maverick", 露娜: "maverick", 不知火舞: "maverick", 上官婉儿: "maverick", 影: "maverick", 裴擒虎: "maverick",
  赵云: "challenger", 孙悟空: "challenger", 典韦: "challenger", 达摩: "challenger", 宫本武藏: "challenger", 曹操: "challenger", 杨戬: "challenger", 哪吒: "challenger", 铠: "challenger", 夏洛特: "challenger", 马超: "challenger", 云缨: "challenger", 姬小满: "challenger", 亚连: "challenger", 大司命: "challenger", 亚瑟: "challenger", 刘备: "challenger",
  蔡文姬: "nurturer", 瑶: "nurturer", 桑启: "nurturer", 朵莉亚: "nurturer", 少司缘: "nurturer", "元流之子(辅助)": "nurturer", 明世隐: "nurturer", 太乙真人: "nurturer",
  孙膑: "connector", 大乔: "connector", 庄周: "connector", 鬼谷子: "connector", 刘禅: "connector", 阿古朵: "connector",
  百里守约: "precision", 伽罗: "precision", 虞姬: "precision", 狄仁杰: "precision", 黄忠: "precision", 后羿: "precision", 艾琳: "precision", 莱西奥: "precision", 蒙犽: "precision", 敖隐: "precision", 鲁班七号: "precision", "元流之子(射手)": "precision",
  孙尚香: "soloist", 李元芳: "soloist", 戈娅: "soloist", 苍: "soloist", 关羽: "soloist", 老夫子: "soloist", 花木兰: "soloist", 李信: "soloist", 孙策: "soloist", 雅典娜: "soloist", 蚩奼: "soloist",
};

const signatureBoosts = {
  李白: { creativity: 1.3, adventure: 1.2, independence: 0.8 },
  韩信: { adventure: 1.4, drive: 0.9 },
  诸葛亮: { focus: 1.2, order: 0.9 },
  孙尚香: { drive: 1.1, focus: 0.8, independence: 0.5 },
  鲁班七号: { focus: 1.2, drive: 0.9, order: 0.5 },
  孙悟空: { adventure: 1.1, drive: 1.1 },
  貂蝉: { creativity: 1.1, resilience: 0.9 },
  铠: { resilience: 1.4, independence: 0.8 },
  花木兰: { independence: 1.1, resilience: 0.8, focus: 0.5 },
  张飞: { resilience: 1.3, team: 1.0 },
  蔡文姬: { empathy: 1.4, team: 1.0 },
  大乔: { team: 1.2, order: 1.0 },
  瑶: { empathy: 1.2, creativity: 0.7 },
  关羽: { adventure: 1.2, independence: 0.8 },
  王昭君: { focus: 1.1, order: 1.1 },
  老夫子: { order: 1.0, independence: 1.1 },
  大禹: { resilience: 1.4, order: 1.0 },
  空空儿: { adventure: 1.3, creativity: 1.0 },
  孙权: { order: 1.2, focus: 1.0, team: 0.7 },
  蚩奼: { independence: 1.3, drive: 0.9 },
};

const colorSets = ["gold", "cyan", "violet", "rose", "emerald", "blue", "orange", "silver"];

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

function getHeroPersonaKey(hero) {
  if (heroPersonaOverrides[hero.name]) return heroPersonaOverrides[hero.name];
  const seed = hashName(hero.name);
  const roleCandidates = {
    坦克: ["guardian", "anchor", "ruler"],
    战士: ["challenger", "soloist", "anchor", "ruler"],
    刺客: ["hunter", "maverick", "soloist"],
    法师: ["strategist", "visionary", "maverick"],
    射手: ["precision", "soloist", "maverick"],
    辅助: ["nurturer", "connector", "guardian"],
  };
  const primaryRole = hero.roles[0];
  const candidates = roleCandidates[primaryRole] || Object.keys(personalityProfiles);
  return candidates[seed % candidates.length];
}

function buildHeroTarget(hero) {
  const roleTarget = Object.fromEntries(traits.map((trait) => [trait.key, 0]));
  hero.roles.forEach((role) => {
    const base = roleBase[role] || {};
    traits.forEach(({ key }) => {
      roleTarget[key] += base[key] || 0;
    });
  });
  traits.forEach(({ key }) => {
    roleTarget[key] = roleTarget[key] / Math.max(hero.roles.length, 1);
  });

  const personaKey = getHeroPersonaKey(hero);
  const personaTarget = personalityProfiles[personaKey].target;
  const target = Object.fromEntries(
    traits.map(({ key }) => [key, roleTarget[key] * 0.28 + personaTarget[key] * 0.72])
  );

  Object.entries(signatureBoosts[hero.name] || {}).forEach(([key, value]) => {
    target[key] = clamp(target[key] + value, 0.5, 10);
  });

  const seed = hashName(hero.name);
  const primaryTrait = traits[seed % traits.length].key;
  const secondaryTrait = traits[Math.floor(seed / 7) % traits.length].key;
  target[primaryTrait] = clamp(target[primaryTrait] + 0.45, 0.5, 10);
  target[secondaryTrait] = clamp(target[secondaryTrait] + 0.28, 0.5, 10);

  return { target, personaKey };
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

function getTopTraits(scores, count = 4) {
  return traits
    .map((trait) => ({ ...trait, value: scores[trait.key] || 0 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, count);
}

function getTopTargetTraits(target, count = 4) {
  return traits
    .map((trait) => ({ ...trait, value: target[trait.key] || 0 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, count);
}

function getMatches(scores) {
  const maxUserScore = Math.max(...Object.values(scores), 1);
  const normalized = Object.fromEntries(
    traits.map(({ key }) => [key, (scores[key] / maxUserScore) * 10])
  );
  const userTopKeys = getTopTraits(scores, 5).map((trait) => trait.key);

  const ranked = heroes
    .map((hero) => {
      const { target, personaKey } = buildHeroTarget(hero);
      const heroTopKeys = getTopTargetTraits(target, 5).map((trait) => trait.key);
      const overlap = userTopKeys.reduce((sum, key, index) => {
        const heroIndex = heroTopKeys.indexOf(key);
        if (heroIndex === -1) return sum;
        return sum + Math.max(0.15, 1.15 - index * 0.15 - heroIndex * 0.11);
      }, 0);
      const distance = Math.sqrt(
        traits.reduce((sum, { key }) => {
          const weight = 1 + (normalized[key] / 10) * 0.42 + (userTopKeys.includes(key) ? 0.32 : 0);
          const diff = normalized[key] - target[key];
          return sum + diff * diff * weight;
        }, 0)
      );
      const adjustedDistance = distance - overlap * 0.72;
      return {
        ...hero,
        target,
        personaKey,
        persona: personalityProfiles[personaKey],
        color: getHeroColor(hero),
        distance,
        adjustedDistance,
        overlap,
      };
    })
    .sort((a, b) => a.adjustedDistance - b.adjustedDistance);

  const best = ranked[0]?.adjustedDistance ?? 0;
  const p90 = ranked[Math.min(ranked.length - 1, Math.floor(ranked.length * 0.9))]?.adjustedDistance ?? best + 1;
  return ranked.map((hero, index) => {
    const gapRatio = clamp((hero.adjustedDistance - best) / Math.max(p90 - best, 0.1), 0, 1.35);
    const rankPenalty = Math.log1p(index) * 3.9;
    const gapPenalty = Math.pow(gapRatio, 0.72) * 31;
    const match = clamp(Math.round(99 - gapPenalty - rankPenalty), 48, index === 0 ? 99 : 94);
    return { ...hero, match };
  });
}

function getDiverseMatches(matches, limit = 5) {
  const picked = [];
  const personaUsed = new Set();
  const roleUsed = new Set();

  for (const hero of matches) {
    const primaryRole = hero.roles[0];
    if (picked.length < limit && !personaUsed.has(hero.personaKey)) {
      picked.push(hero);
      personaUsed.add(hero.personaKey);
      roleUsed.add(primaryRole);
    }
  }

  for (const hero of matches) {
    if (picked.length >= limit) break;
    const primaryRole = hero.roles[0];
    if (!picked.some((item) => item.name === hero.name) && !roleUsed.has(primaryRole)) {
      picked.push(hero);
      roleUsed.add(primaryRole);
    }
  }

  for (const hero of matches) {
    if (picked.length >= limit) break;
    if (!picked.some((item) => item.name === hero.name)) picked.push(hero);
  }

  return picked;
}

function roleText(roles) {
  return roles.join(" / ");
}

function getHeroGameFeature(hero) {
  const featureMap = {
    坦克: "在游戏里偏向承伤、开视野、保护阵型和正面开团，价值不一定体现在击杀数，而是让团队有空间做事。",
    战士: "在游戏里通常能打能抗，既能边路对抗，也能在关键时刻切入战场，是进攻和承压之间的平衡点。",
    刺客: "在游戏里强调机动、爆发和切入时机，擅长寻找后排或落单目标，用一次精准行动改变节奏。",
    法师: "在游戏里依靠技能、控制、消耗或爆发影响局面，通常需要预判、距离感和对团战节奏的理解。",
    射手: "在游戏里代表持续输出和后期兑现，需要发育、走位和稳定环境，越到关键阶段越能决定胜负。",
    辅助: "在游戏里负责保护、视野、开团、增益或节奏调度，强项是让团队整体变得更稳定、更好配合。",
  };
  const personaText = hero.persona ? `更具体地说，${hero.name}被归入「${hero.persona.label}」，核心气质是${hero.persona.short}。` : "";
  return hero.roles.map((role) => featureMap[role]).filter(Boolean).join(" ") + personaText;
}

function getPersonalityDefinition(topTraits) {
  const first = topTraits[0]?.label || "目标清晰";
  const second = topTraits[1]?.label || "行动稳定";
  return first + "型 × " + second + "型";
}

function getSimilarityText(hero, topTraits) {
  const main = topTraits[0]?.key;
  const second = topTraits[1]?.key;
  return [
    hero.desc,
    traitSummary[main],
    second ? traitSummary[second] : "",
  ].filter(Boolean).join(" ");
}

function getStrengthText(topTraits) {
  const keys = topTraits.map((trait) => trait.key);
  const strengths = [];
  if (keys.includes("drive")) strengths.push("目标感强，能把想法推进成结果");
  if (keys.includes("focus")) strengths.push("判断清晰，擅长拆解复杂问题");
  if (keys.includes("empathy")) strengths.push("共情力好，容易感知他人的真实状态");
  if (keys.includes("resilience")) strengths.push("抗压能力强，关键时刻不容易散");
  if (keys.includes("creativity")) strengths.push("有灵感和创造力，能跳出固定答案");
  if (keys.includes("adventure")) strengths.push("敢尝试，能在变化中抓机会");
  if (keys.includes("order")) strengths.push("重视秩序和流程，做事有章法");
  if (keys.includes("independence")) strengths.push("有独立判断，不容易被别人带偏");
  if (keys.includes("team")) strengths.push("协作意识强，能把个体能力转化为整体收益");
  return strengths.slice(0, 3).join("；") || "你最大的优势是能在不同场景里调整自己，不轻易被单一标签限制";
}

function getWeaknessText(topTraits) {
  const keys = topTraits.map((trait) => trait.key);
  if (keys.includes("drive") && keys.includes("order")) return "可能会对结果和计划过度敏感，一旦节奏被打乱，容易焦虑或变得挑剔。";
  if (keys.includes("empathy") && keys.includes("team")) return "可能太容易照顾别人的感受，反而把自己的边界和需求放到后面。";
  if (keys.includes("adventure") && keys.includes("independence")) return "可能会因为太想按自己的方式突破，而忽略节奏、风险和他人的配合成本。";
  if (keys.includes("focus") && keys.includes("creativity")) return "可能会在想法和分析里停留太久，真正行动时反而需要一个外部截止时间。";
  if (keys.includes("resilience")) return "可能习惯什么都自己扛，久了会让别人误以为你永远不需要支持。";
  return "需要注意的是，优势用过头就会变成惯性。偶尔换一种处理方式，反而能让你走得更远。";
}

function getAdviceText(topTraits) {
  const keys = topTraits.map((trait) => trait.key);
  if (keys.includes("order")) return "给计划预留弹性区。人生不是每一局都按攻略刷新，重要决定可以先定标准，再给行动一个截止时间。";
  if (keys.includes("empathy")) return "继续保留你的温柔和感知力，但不要把所有关系的稳定都揽到自己身上。被需要很好，被消耗就不必了。";
  if (keys.includes("adventure")) return "把冒险变成可复盘的实验：每次尝试前设好止损线，既保留冲劲，也保护长期节奏。";
  if (keys.includes("drive")) return "目标感是你的燃料，但也要允许自己阶段性休息。持续胜利靠的不是一直冲，而是会调整。";
  return "把你的核心优势用在真正重要的地方。少和无效消耗纠缠，多为长期成长建立稳定节奏。";
}

function getOptionLetter(index) {
  return String.fromCharCode(65 + index);
}

export default function App() {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [current, setCurrent] = useState(0);
  const [page, setPage] = useState("quiz");
  const [heroQuery, setHeroQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("全部");
  const [selectedHeroName, setSelectedHeroName] = useState(heroes[0]?.name || "");

  const answeredCount = answers.filter((answer) => answer !== null).length;
  const unansweredIndexes = answers
    .map((answer, index) => (answer === null ? index : null))
    .filter((index) => index !== null);
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
  const selectedHero = heroes.find((hero) => hero.name === selectedHeroName) || filteredHeroes[0] || heroes[0];

  function choose(optionIndex) {
    const next = [...answers];
    next[current] = optionIndex;
    setAnswers(next);
    if (current < questions.length - 1) {
      setTimeout(() => setCurrent((value) => Math.min(questions.length - 1, value + 1)), 120);
    }
  }

  function reset() {
    setAnswers(Array(questions.length).fill(null));
    setCurrent(0);
    setPage("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goQuiz() {
    setPage("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goHeroes() {
    setPage("heroes");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goResult() {
    if (!canShowResult) {
      const firstUnanswered = unansweredIndexes[0];
      if (firstUnanswered !== undefined) setCurrent(firstUnanswered);
      setPage("quiz");
      return;
    }
    setPage("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const currentQuestion = questions[current];

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
            <div className="top-nav">
              <button className={page === "quiz" ? "active" : ""} onClick={goQuiz}>
                <Home size={16} />
                开始测评
              </button>
              <button className={page === "heroes" ? "active" : ""} onClick={goHeroes}>
                <Layers3 size={16} />
                查看英雄池
              </button>
              <button disabled={!canShowResult} className={page === "result" ? "active" : ""} onClick={goResult}>
                <Crown size={16} />
                我的结果
              </button>
            </div>
          </div>

          <div className="header-card">
            <div className="header-card-top">
              <Award />
              <span>全英雄池</span>
            </div>
            <strong>{heroes.length}</strong>
            <small>职业只作为辅助参考，核心匹配会结合每个英雄的人格设定与具体气质。</small>
            <button onClick={reset} className="ghost-button">
              <RefreshCw size={16} />
              重新开始
            </button>
          </div>
        </header>

        {page === "result" && canShowResult ? (
          <ResultPage
            result={result}
            matches={matches}
            topTraits={topTraits}
            scores={scores}
            maxTraitScore={maxTraitScore}
            onBack={goQuiz}
            onReset={reset}
          />
        ) : page === "heroes" ? (
          <HeroPoolPage
            roles={roles}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            heroQuery={heroQuery}
            setHeroQuery={setHeroQuery}
            filteredHeroes={filteredHeroes}
            selectedHero={selectedHero}
            setSelectedHeroName={setSelectedHeroName}
          />
        ) : (
          <section className="quiz-layout">
            <section className="quiz-card">
              <div className="quiz-meta">
                <div>
                  <strong>第 {current + 1} 题 / {questions.length}</strong>
                  <span>已完成 {answeredCount} 题 · {progress}%</span>
                </div>
                <button className="result-button compact" disabled={!canShowResult} onClick={goResult}>
                  <Crown size={16} />
                  查看结果
                </button>
              </div>

              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>

              <div className="answer-overview">
                <div className="answer-overview-head">
                  <div>
                    <strong>答题概览</strong>
                    <span>青色已答，金色当前，灰色未答；点题号可快速跳转。</span>
                  </div>
                  <em className={unansweredIndexes.length ? "warn" : "ok"}>
                    {unansweredIndexes.length ? "还有 " + unansweredIndexes.length + " 题未答" : "已全部完成"}
                  </em>
                </div>
                <div className="answer-grid" aria-label="答题概览">
                  {questions.map((_, index) => {
                    const answered = answers[index] !== null;
                    const active = current === index;
                    return (
                      <button
                        key={index}
                        type="button"
                        aria-label={"跳转到第 " + (index + 1) + " 题"}
                        onClick={() => setCurrent(index)}
                        className={[answered ? "answered" : "", active ? "active" : ""].join(" ")}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
                {unansweredIndexes.length > 0 && (
                  <p className="unanswered-list">未答：{unansweredIndexes.map((index) => index + 1).join("、")}</p>
                )}
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
                <button className="nav-button" disabled={current === 0} onClick={() => setCurrent((value) => Math.max(0, value - 1))}>
                  <ArrowLeft size={18} />
                  上一题
                </button>

                <div className="question-dots" aria-label="题目导航">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      aria-label={`跳转到第 ${index + 1} 题`}
                      onClick={() => setCurrent(index)}
                      className={[answers[index] !== null ? "done" : "", current === index ? "active" : ""].join(" ")}
                    />
                  ))}
                </div>

                {current < questions.length - 1 ? (
                  <button className="nav-button primary" onClick={() => setCurrent((value) => Math.min(questions.length - 1, value + 1))}>
                    下一题
                    <ArrowRight size={18} />
                  </button>
                ) : (
                  <button className="result-button" disabled={!canShowResult} onClick={goResult}>
                    <Crown size={18} />
                    生成我的英雄
                  </button>
                )}
              </div>
            </section>

            <aside className="side-card">
              <LivePanel topTraits={topTraits} scores={scores} answeredCount={answeredCount} maxTraitScore={maxTraitScore} />
            </aside>
          </section>
        )}

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
          这版匹配不再只按分路推断。系统会先读取你的生活人格维度，再结合英雄自身设定：守护、谋略、机会猎手、自由变奏、精准兑现等细分气质进行计算。
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

function ResultPage({ result, matches, topTraits, scores, maxTraitScore, onBack, onReset }) {
  const gameFeature = getHeroGameFeature(result);
  const similarity = getSimilarityText(result, topTraits);
  const personalityDefinition = getPersonalityDefinition(topTraits);
  const strengths = getStrengthText(topTraits);
  const weakness = getWeaknessText(topTraits);
  const advice = getAdviceText(topTraits);
  const alternatives = getDiverseMatches(matches.slice(1), 5);

  return (
    <section className="result-page">
      <div className="page-tools">
        <button className="nav-button" onClick={onBack}>
          <ArrowLeft size={18} />
          返回答题
        </button>
        <button className="ghost-button inline" onClick={onReset}>
          <RefreshCw size={16} />
          重新测一次
        </button>
      </div>

      <div className="result-page-grid">
        <div className="result-main-column">
          <div className={"result-card hero-result-card " + result.color}>
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
            <div className="role-line">{roleText(result.roles)} · {result.persona.label}</div>
            <p className="result-quote">“{result.quote}”</p>
          </div>

          <div className="report-grid result-report-grid">
            <article className="report-card">
              <span>游戏里的TA</span>
              <p>{gameFeature}</p>
            </article>
            <article className="report-card">
              <span>你和TA相似在哪里</span>
              <p>{similarity}</p>
            </article>
            <article className="report-card">
              <span>性格定义</span>
              <p>{personalityDefinition}。你不是单靠热情或运气行动的人，而是会在自己的核心动机和现实处境之间找到平衡。</p>
            </article>
            <article className="report-card">
              <span>优点</span>
              <p>{strengths}。</p>
            </article>
            <article className="report-card">
              <span>可能的短板</span>
              <p>{weakness}</p>
            </article>
            <article className="report-card">
              <span>生活建议</span>
              <p>{advice}</p>
            </article>
          </div>
        </div>

        <aside className="result-side-column">
          <div className="trait-card">
            <div className="trait-card-title">
              <span>你的生活人格雷达</span>
              <small>{topTraits.map((trait) => trait.label).join(" · ")}</small>
            </div>
            <TraitBars scores={scores} maxTraitScore={maxTraitScore} />
          </div>

          <div className="alt-matches">
            <h4>备选英雄人格</h4>
            <p className="alt-note">备选结果已尽量按人格类型去重，避免一屏全是同职业英雄。</p>
            {alternatives.map((hero) => (
              <div key={hero.name} className="alt-row">
                <span>{hero.icon}</span>
                <div>
                  <strong>{hero.name}</strong>
                  <small>{roleText(hero.roles)} · {hero.persona.label}</small>
                </div>
                <em>{hero.match}%</em>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function HeroPoolPage({ roles, roleFilter, setRoleFilter, heroQuery, setHeroQuery, filteredHeroes, selectedHero, setSelectedHeroName }) {
  const selectedColor = getHeroColor(selectedHero);
  const personaKey = getHeroPersonaKey(selectedHero);
  const persona = personalityProfiles[personaKey];

  return (
    <section className="hero-pool hero-pool-page">
      <div className="section-title">
        <div>
          <span>Hero Pool</span>
          <h3>当前工程内置英雄池</h3>
        </div>
        <p>点击任意英雄标签，可以在右侧查看他的 quote、定位和人格设定。匹配算法会参考这些英雄个性，而不只看职业。</p>
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

      <div className="hero-pool-layout">
        <div className="hero-grid hero-grid-page">
          {filteredHeroes.map((hero) => {
            const active = selectedHero?.name === hero.name;
            return (
              <button
                type="button"
                key={hero.name}
                className={`hero-chip ${getHeroColor(hero)} ${active ? "selected" : ""}`}
                onClick={() => setSelectedHeroName(hero.name)}
              >
                <span className="hero-icon">{hero.icon}</span>
                <div>
                  <strong>{hero.name}</strong>
                  <small>{roleText(hero.roles)}</small>
                </div>
              </button>
            );
          })}
        </div>

        <aside className={`pool-detail ${selectedColor}`}>
          <div className="pool-detail-mark">{selectedHero.icon}</div>
          <div className="pool-detail-head">
            <div>
              <span>当前选中英雄</span>
              <h3>{selectedHero.name}</h3>
              <p>{roleText(selectedHero.roles)} · {persona.label}</p>
            </div>
            <Users size={28} />
          </div>
          <p className="pool-quote">“{selectedHero.quote}”</p>
          <p className="pool-desc">{selectedHero.desc}</p>
          <div className="pool-persona">
            <strong>算法人格标签</strong>
            <span>{persona.short}</span>
          </div>
        </aside>
      </div>
    </section>
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
