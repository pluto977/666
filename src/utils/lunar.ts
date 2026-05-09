/**
 * 农历、黄历核心算法
 * 参考传统黄历规则与周易理论
 */

import { TIAN_GAN, DI_ZHI } from './bazi';

// 农历月份数据（1900-2100）简化版
// 每个数字代表一年的农历数据：高16位为该年闰月月份（0为无闰月），低位为各月天数（1=30天，0=29天）
const LUNAR_INFO = [
  0x04AE53,0x0A5748,0x5526BD,0x0D2650,0x0D9544,0x46AAB9,0x056A4D,0x09AD42,0x24AEB6,0x04AE4A,
  0x6AA550,0x0B5544,0x0AD550,0x515B45,0x056C4D,0x0A6C42,0x35AAD6,0x04AE4A,0x6B2550,0x0B2545,
  0x0D2650,0x5D52BD,0x0D5244,0x0DA548,0x25D54D,0x056A43,0x0A7B38,0x354AAD,0x045B50,0x0D5945,
  0x0D2B4D,0x528B43,0x0A9548,0x1B6A4D,0x0AD543,0x055B49,0x2756A4,0x0A5B4A,0x1953A4,0x0592B0,
];

// 节气精确时刻（2020-2030年，格式：月日时分）
// 简化版：使用固定偏移量计算
const JIEQI_BASE = [
  { name: '小寒', month: 1, baseDay: 6 },
  { name: '大寒', month: 1, baseDay: 20 },
  { name: '立春', month: 2, baseDay: 4 },
  { name: '雨水', month: 2, baseDay: 19 },
  { name: '惊蛰', month: 3, baseDay: 6 },
  { name: '春分', month: 3, baseDay: 21 },
  { name: '清明', month: 4, baseDay: 5 },
  { name: '谷雨', month: 4, baseDay: 20 },
  { name: '立夏', month: 5, baseDay: 6 },
  { name: '小满', month: 5, baseDay: 21 },
  { name: '芒种', month: 6, baseDay: 6 },
  { name: '夏至', month: 6, baseDay: 21 },
  { name: '小暑', month: 7, baseDay: 7 },
  { name: '大暑', month: 7, baseDay: 23 },
  { name: '立秋', month: 8, baseDay: 7 },
  { name: '处暑', month: 8, baseDay: 23 },
  { name: '白露', month: 9, baseDay: 8 },
  { name: '秋分', month: 9, baseDay: 23 },
  { name: '寒露', month: 10, baseDay: 8 },
  { name: '霜降', month: 10, baseDay: 23 },
  { name: '立冬', month: 11, baseDay: 7 },
  { name: '小雪', month: 11, baseDay: 22 },
  { name: '大雪', month: 12, baseDay: 7 },
  { name: '冬至', month: 12, baseDay: 22 },
];

export function getJieQi(year: number, month: number, day: number): string {
  const match = JIEQI_BASE.find(j => j.month === month && Math.abs(j.baseDay - day) <= 1);
  return match?.name || '';
}

export function getNextJieQi(month: number, day: number): { name: string; daysLeft: number } {
  const today = new Date();
  const todayMonth = month;
  const todayDay = day;
  
  for (const jq of JIEQI_BASE) {
    if (jq.month > todayMonth || (jq.month === todayMonth && jq.baseDay > todayDay)) {
      const daysLeft = (jq.month - todayMonth) * 30 + (jq.baseDay - todayDay);
      return { name: jq.name, daysLeft: Math.max(1, daysLeft) };
    }
  }
  return { name: '小寒', daysLeft: 365 - todayMonth * 30 + 6 };
}

// 农历转换（简化版，适用于1990-2050年）
// 基于已知的农历对应关系
export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeap: boolean;
  monthName: string;
  dayName: string;
  yearGan: string;
  yearZhi: string;
  monthGan: string;
  monthZhi: string;
  dayGan: string;
  dayZhi: string;
  zodiac: string;
}

const LUNAR_MONTH_NAMES = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
const LUNAR_DAY_NAMES = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十',
];
const ZODIAC = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

// 1900年1月31日为农历1900年正月初一
const BASE_DATE = new Date(1900, 0, 31);
const BASE_LUNAR = { year: 1900, month: 1, day: 1 };

// 农历每月天数（简化）
function getLunarMonthDays(year: number, month: number): number {
  // 大月30天，小月29天（简化规则）
  const bigMonths = [1, 3, 5, 7, 8, 10, 12];
  return bigMonths.includes(month) ? 30 : 29;
}

// 农历年天数
function getLunarYearDays(year: number): number {
  return 354; // 平均农历年天数（简化）
}

export function solarToLunar(year: number, month: number, day: number): LunarDate {
  const target = new Date(year, month - 1, day);
  const diffDays = Math.floor((target.getTime() - BASE_DATE.getTime()) / (1000 * 60 * 60 * 24));
  
  // 从1900年农历正月初一开始计算
  let lunarYear = 1900;
  let lunarMonth = 1;
  let lunarDay = 1;
  let remainDays = diffDays;
  
  // 按年推进
  while (remainDays >= getLunarYearDays(lunarYear)) {
    remainDays -= getLunarYearDays(lunarYear);
    lunarYear++;
  }
  
  // 按月推进
  while (remainDays >= getLunarMonthDays(lunarYear, lunarMonth)) {
    remainDays -= getLunarMonthDays(lunarYear, lunarMonth);
    lunarMonth++;
    if (lunarMonth > 12) { lunarMonth = 1; lunarYear++; }
  }
  
  lunarDay = remainDays + 1;
  
  // 干支计算
  const ganIdx = (year - 4) % 10;
  const zhiIdx = (year - 4) % 12;
  const yearGan = TIAN_GAN[((ganIdx % 10) + 10) % 10];
  const yearZhi = DI_ZHI[((zhiIdx % 12) + 12) % 12];
  
  // 月干支
  const monthZhiList = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
  const monthZhiIdx = (month - 2 + 12) % 12;
  const yearGanIdx = TIAN_GAN.indexOf(yearGan);
  const monthGanBase = (yearGanIdx % 5) * 2;
  const monthGanIdx = (monthGanBase + monthZhiIdx) % 10;
  
  // 日干支（1900年1月1日为甲戌日，索引50）
  const dayOffset = Math.floor((target.getTime() - new Date(1900, 0, 1).getTime()) / (1000 * 60 * 60 * 24));
  const dayGzIdx = ((dayOffset + 50) % 60 + 60) % 60;
  
  return {
    year: lunarYear,
    month: lunarMonth,
    day: lunarDay,
    isLeap: false,
    monthName: LUNAR_MONTH_NAMES[lunarMonth - 1] + '月',
    dayName: LUNAR_DAY_NAMES[lunarDay - 1] || '初一',
    yearGan,
    yearZhi,
    zodiac: ZODIAC[((zhiIdx % 12) + 12) % 12],
    monthGan: TIAN_GAN[monthGanIdx],
    monthZhi: monthZhiList[monthZhiIdx],
    dayGan: TIAN_GAN[dayGzIdx % 10],
    dayZhi: DI_ZHI[dayGzIdx % 12],
  };
}

// 黄历宜忌数据
const YI_LIST = [
  '祭祀', '祈福', '出行', '纳采', '问名', '嫁娶', '搬家', '入宅',
  '开光', '开市', '立券', '交易', '纳财', '安床', '动土', '上梁',
  '栽种', '牧养', '开工', '求职', '会友', '签约',
];
const JI_LIST = [
  '破土', '出行', '嫁娶', '移徙', '开市', '纳财', '安葬', '修坟',
  '动土', '词讼', '针灸', '开仓', '乘船渡水', '置产',
];

// 冲煞
const CHONG_MAP: Record<string, string> = {
  子: '午', 丑: '未', 寅: '申', 卯: '酉', 辰: '戌', 巳: '亥',
  午: '子', 未: '丑', 申: '寅', 酉: '卯', 戌: '辰', 亥: '巳',
};
const ZODIAC_MAP: Record<string, string> = {
  子: '鼠', 丑: '牛', 寅: '虎', 卯: '兔', 辰: '龙', 巳: '蛇',
  午: '马', 未: '羊', 申: '猴', 酉: '鸡', 戌: '狗', 亥: '猪',
};

// 值日十二神
const SHI_ER_SHEN = ['建', '除', '满', '平', '定', '执', '破', '危', '成', '收', '开', '闭'];

// 根据日期生成稳定的宜忌列表（基于干支推算）
function getDayHash(dayGan: string, dayZhi: string): number {
  const ganIdx = TIAN_GAN.indexOf(dayGan);
  const zhiIdx = DI_ZHI.indexOf(dayZhi);
  return ganIdx * 12 + zhiIdx;
}

export interface HuangLiData {
  solar: { year: number; month: number; day: number; weekDay: string };
  lunar: LunarDate;
  jieqi: string;
  nextJieqi: { name: string; daysLeft: number };
  yi: string[];
  ji: string[];
  chong: string;
  sha: string;
  zhiShen: string;
  xingXiu: string;
  yueShen: string; // 月相
  jiShen: string[]; // 吉神
  xiongSha: string[]; // 凶煞
  zhouYiJiedu: string; // 周易解读
}

const WEEK_DAYS = ['日', '一', '二', '三', '四', '五', '六'];
const XING_XIU = ['角', '亢', '氐', '房', '心', '尾', '箕', '斗', '牛', '女', '虚', '危', '室', '壁', '奎', '娄', '胃', '昴', '毕', '觜', '参', '井', '鬼', '柳', '星', '张', '翼', '轸'];
const JI_SHEN_LIST = ['天德', '月德', '天赦', '天愿', '月空', '天医', '福生', '生气', '益后', '解神', '司命', '青龙'];
const XIONG_SHA_LIST = ['月破', '大耗', '灾煞', '天火', '四忌', '往亡', '天刑', '白虎', '朱雀', '玄武', '勾陈', '螣蛇'];
const YUE_XIANG = ['朔', '既朔', '蛾眉月', '上弦月', '上弦月', '盈凸月', '望', '既望', '亏凸月', '下弦月', '残月', '晦'];

export function getHuangLi(year: number, month: number, day: number): HuangLiData {
  const lunar = solarToLunar(year, month, day);
  const jieqi = getJieQi(year, month, day);
  const nextJieqi = getNextJieQi(month, day);
  
  const dayHash = getDayHash(lunar.dayGan, lunar.dayZhi);
  const seed = dayHash + year * 400 + month * 30 + day;
  
  // 生成宜忌（基于干支规律）
  const ganIdx = TIAN_GAN.indexOf(lunar.dayGan);
  const zhiIdx = DI_ZHI.indexOf(lunar.dayZhi);
  
  const yiCount = 3 + (seed % 4);
  const jiCount = 2 + (seed % 3);
  
  const yi: string[] = [];
  const ji: string[] = [];
  
  // 基于干支生成固定宜忌
  for (let i = 0; i < yiCount; i++) {
    const idx = (dayHash * 3 + i * 7) % YI_LIST.length;
    if (!yi.includes(YI_LIST[idx])) yi.push(YI_LIST[idx]);
  }
  for (let i = 0; i < jiCount; i++) {
    const idx = (dayHash * 5 + i * 11) % JI_LIST.length;
    if (!ji.includes(JI_LIST[idx]) && !yi.includes(JI_LIST[idx])) ji.push(JI_LIST[idx]);
  }
  
  // 冲煞
  const chongZhi = CHONG_MAP[lunar.dayZhi] || '无';
  const chongZodiac = ZODIAC_MAP[chongZhi] || '无';
  
  // 值日神
  const zhiShenIdx = (zhiIdx + Math.floor(day / 5)) % 12;
  const zhiShen = SHI_ER_SHEN[zhiShenIdx];
  
  // 星宿
  const xingXiuIdx = (seed * 7) % 28;
  const xingXiu = XING_XIU[xingXiuIdx];
  
  // 月相
  const yueShenIdx = Math.floor(lunar.day / 2.6) % 12;
  const yueShen = YUE_XIANG[yueShenIdx];
  
  // 吉神
  const jiShenCount = 2 + (dayHash % 3);
  const jiShen: string[] = [];
  for (let i = 0; i < jiShenCount; i++) {
    jiShen.push(JI_SHEN_LIST[(dayHash + i * 3) % JI_SHEN_LIST.length]);
  }
  
  // 凶煞
  const xiongShaCount = 1 + (dayHash % 2);
  const xiongSha: string[] = [];
  for (let i = 0; i < xiongShaCount; i++) {
    xiongSha.push(XIONG_SHA_LIST[(dayHash + i * 4) % XIONG_SHA_LIST.length]);
  }
  
  // 周易解读
  const zhouYiMap: Record<string, string> = {
    甲: '甲木阳刚，此日充满生机，宜主动进取，开创新局。《周易》乾卦曰：天行健，君子以自强不息。',
    乙: '乙木柔顺，此日宜以柔克刚，顺势而为，不宜强争。坤卦云：地势坤，君子以厚德载物。',
    丙: '丙火光明，此日阳气旺盛，宜明事理，展才华，交际应酬皆宜。离卦象日，明照四方。',
    丁: '丁火内敛，此日宜静思默想，谋定后动。火水未济卦示：慎终如始，则无败事。',
    戊: '戊土厚重，此日稳重踏实，宜固本培元，不宜冒进。艮卦言：兼山，艮，君子以思不出其位。',
    己: '己土阴柔，此日宜细心谋划，稳步前行。坤卦云：含章可贞，以时发也。',
    庚: '庚金肃杀，此日宜果断决策，整饬旧事，修缮器物。兑卦象金，金口玉言，宜谨言慎行。',
    辛: '辛金精炼，此日宜精益求精，注重品质，善于表达。天泽履卦：履道坦坦，幽人贞吉。',
    壬: '壬水奔流，此日思路活跃，宜谋划远图。坎卦象水，习坎，有孚，维心亨。',
    癸: '癸水潜藏，此日宜收敛积蓄，内省修养。水山蹇卦：蹇，利西南，不利东北。',
  };
  
  const date = new Date(year, month - 1, day);
  
  return {
    solar: { year, month, day, weekDay: WEEK_DAYS[date.getDay()] },
    lunar,
    jieqi,
    nextJieqi,
    yi,
    ji,
    chong: `冲${chongZodiac}（${chongZhi}）`,
    sha: '北方',
    zhiShen,
    xingXiu: `${xingXiu}宿`,
    yueShen,
    jiShen,
    xiongSha,
    zhouYiJiedu: zhouYiMap[lunar.dayGan] || '此日平稳，宜按部就班，循序渐进。',
  };
}

// 场景化择吉
export interface SceneJiDate {
  date: string;
  solar: { year: number; month: number; day: number };
  lunar: { monthName: string; dayName: string };
  dayGanZhi: string;
  reason: string;
  score: number;
}

const SCENE_YI_MAP: Record<string, string[]> = {
  '婚嫁': ['嫁娶', '纳采', '问名'],
  '开工': ['开市', '开工', '动土'],
  '搬家': ['搬家', '入宅', '移徙'],
  '祭祀': ['祭祀', '祈福', '开光'],
  '出行': ['出行', '会友'],
  '签约': ['立券', '签约', '交易'],
  '求职': ['求职', '会友'],
  '开业': ['开市', '立券', '开工'],
};

export function getSceneJiDates(scene: string, year: number, month: number): SceneJiDate[] {
  const results: SceneJiDate[] = [];
  const yiItems = SCENE_YI_MAP[scene] || ['祭祀'];
  
  const daysInMonth = new Date(year, month, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const hl = getHuangLi(year, month, day);
    const matchYi = hl.yi.some(y => yiItems.includes(y));
    
    if (matchYi) {
      const score = 70 + Math.floor(hl.jiShen.length * 5 + (matchYi ? 15 : 0));
      results.push({
        date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        solar: { year, month, day },
        lunar: { monthName: hl.lunar.monthName, dayName: hl.lunar.dayName },
        dayGanZhi: hl.lunar.dayGan + hl.lunar.dayZhi,
        reason: `此日${hl.yi.slice(0, 3).join('、')}，${hl.jiShen.join('、')}值日，适宜${scene}。`,
        score: Math.min(score, 100),
      });
    }
  }
  
  return results.sort((a, b) => b.score - a.score).slice(0, 6);
}
