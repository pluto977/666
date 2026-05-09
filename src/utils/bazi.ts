/**
 * 八字排盘核心算法
 * 基于周易五行生克、干支合化规则
 */

// 天干
export const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
// 地支
export const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
// 纳音五行
const NAYIN = [
  '海中金', '炉中火', '大林木', '路旁土', '剑锋金', '山头火',
  '涧下水', '城头土', '白蜡金', '杨柳木', '泉中水', '屋上土',
  '霹雳火', '松柏木', '长流水', '沙中金', '山下火', '平地木',
  '壁上土', '金箔金', '覆灯火', '天河水', '大驿土', '钗钏金',
  '桑柘木', '大溪水', '沙中土', '天上火', '石榴木', '大海水',
];
// 五行
export const WU_XING = ['木', '火', '土', '金', '水'];
// 天干五行对应
export const GAN_WU_XING: Record<string, string> = {
  甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土',
  己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水',
};
// 地支五行对应
export const ZHI_WU_XING: Record<string, string> = {
  子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火',
  午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水',
};
// 天干阴阳
export const GAN_YIN_YANG: Record<string, string> = {
  甲: '阳', 乙: '阴', 丙: '阳', 丁: '阴', 戊: '阳',
  己: '阴', 庚: '阳', 辛: '阴', 壬: '阳', 癸: '阴',
};
// 地支藏干（主气、中气、余气）
export const ZHI_CANG_GAN: Record<string, string[]> = {
  子: ['癸'], 丑: ['己', '癸', '辛'], 寅: ['甲', '丙', '戊'],
  卯: ['乙'], 辰: ['戊', '乙', '癸'], 巳: ['丙', '戊', '庚'],
  午: ['丁', '己'], 未: ['己', '丁', '乙'], 申: ['庚', '壬', '戊'],
  酉: ['辛'], 戌: ['戊', '辛', '丁'], 亥: ['壬', '甲'],
};

// 十神关系表（日主 -> 他干 -> 十神）
export function getTenGod(riZhu: string, target: string): string {
  const riWx = GAN_WU_XING[riZhu];
  const tarWx = GAN_WU_XING[target];
  const riYy = GAN_YIN_YANG[riZhu];
  const tarYy = GAN_YIN_YANG[target];
  const sameYin = riYy === tarYy;

  if (riZhu === target) return '日主';
  // 同我者（同五行）
  if (riWx === tarWx) return sameYin ? '比肩' : '劫财';
  // 我生者（日主生目标）
  if (sheng(riWx) === tarWx) return sameYin ? '食神' : '伤官';
  // 我克者（日主克目标）
  if (ke(riWx) === tarWx) return sameYin ? '偏财' : '正财';
  // 生我者（目标生日主）
  if (sheng(tarWx) === riWx) return sameYin ? '偏印' : '正印';
  // 克我者（目标克日主）
  if (ke(tarWx) === riWx) return sameYin ? '七杀' : '正官';
  return '';
}

// 五行相生：木->火->土->金->水->木
export function sheng(wx: string): string {
  const map: Record<string, string> = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
  return map[wx] || '';
}
// 五行相克：木->土->水->火->金->木
export function ke(wx: string): string {
  const map: Record<string, string> = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };
  return map[wx] || '';
}

// 获取干支序号（0-59）
function getGanZhiIndex(ganIdx: number, zhiIdx: number): number {
  // 同奇偶
  return ((ganIdx % 10) * 6 + (zhiIdx % 12) * 5) % 60;
}

// 根据序号获取干支
function indexToGanZhi(idx: number): string {
  return TIAN_GAN[idx % 10] + DI_ZHI[idx % 12];
}

// 节气数据（每年大约时间，精度月份级别）
const JIEQI_MONTHS = [
  { month: 1, day: 6, name: '小寒' }, { month: 1, day: 20, name: '大寒' },
  { month: 2, day: 4, name: '立春' }, { month: 2, day: 19, name: '雨水' },
  { month: 3, day: 6, name: '惊蛰' }, { month: 3, day: 21, name: '春分' },
  { month: 4, day: 5, name: '清明' }, { month: 4, day: 20, name: '谷雨' },
  { month: 5, day: 6, name: '立夏' }, { month: 5, day: 21, name: '小满' },
  { month: 6, day: 6, name: '芒种' }, { month: 6, day: 21, name: '夏至' },
  { month: 7, day: 7, name: '小暑' }, { month: 7, day: 23, name: '大暑' },
  { month: 8, day: 7, name: '立秋' }, { month: 8, day: 23, name: '处暑' },
  { month: 9, day: 8, name: '白露' }, { month: 9, day: 23, name: '秋分' },
  { month: 10, day: 8, name: '寒露' }, { month: 10, day: 23, name: '霜降' },
  { month: 11, day: 7, name: '立冬' }, { month: 11, day: 22, name: '小雪' },
  { month: 12, day: 7, name: '大雪' }, { month: 12, day: 22, name: '冬至' },
];

// 月支映射（节气月）
const MONTH_ZHI_MAP = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];

// 获取月柱地支（按节气）
function getMonthZhi(year: number, month: number, day: number): number {
  // 找到该月所在节气月（以"节"为分界）
  const jieMonths = JIEQI_MONTHS.filter(j => [2,4,6,8,10,12].includes(j.month) || 
    ['立春','惊蛰','清明','立夏','芒种','小暑','立秋','白露','寒露','立冬','大雪','小寒'].includes(j.name));
  
  // 简化：根据月份和日期判断节气月
  const jieList = [
    { month: 1, day: 6 },  // 小寒 -> 丑月
    { month: 2, day: 4 },  // 立春 -> 寅月
    { month: 3, day: 6 },  // 惊蛰 -> 卯月
    { month: 4, day: 5 },  // 清明 -> 辰月
    { month: 5, day: 6 },  // 立夏 -> 巳月
    { month: 6, day: 6 },  // 芒种 -> 午月
    { month: 7, day: 7 },  // 小暑 -> 未月
    { month: 8, day: 7 },  // 立秋 -> 申月
    { month: 9, day: 8 },  // 白露 -> 酉月
    { month: 10, day: 8 }, // 寒露 -> 戌月
    { month: 11, day: 7 }, // 立冬 -> 亥月
    { month: 12, day: 7 }, // 大雪 -> 子月
  ];

  let monthIdx = 0; // 默认寅月
  for (let i = jieList.length - 1; i >= 0; i--) {
    const j = jieList[i];
    if (month > j.month || (month === j.month && day >= j.day)) {
      monthIdx = i;
      break;
    }
  }
  // 调整：小寒前为上年子月
  return monthIdx;
}

// 年柱算法
function getYearGanZhi(year: number, month: number, day: number): { gan: string; zhi: string; idx: number } {
  // 以立春（2月4日左右）为年分界
  let y = year;
  if (month < 2 || (month === 2 && day < 4)) y = year - 1;
  const ganIdx = (y - 4) % 10;
  const zhiIdx = (y - 4) % 12;
  return {
    gan: TIAN_GAN[((ganIdx % 10) + 10) % 10],
    zhi: DI_ZHI[((zhiIdx % 12) + 12) % 12],
    idx: getGanZhiIndex(((ganIdx % 10) + 10) % 10, ((zhiIdx % 12) + 12) % 12),
  };
}

// 月柱算法
function getMonthGanZhi(year: number, month: number, day: number): { gan: string; zhi: string } {
  const yearGanZhi = getYearGanZhi(year, month, day);
  const yearGanIdx = TIAN_GAN.indexOf(yearGanZhi.gan);
  const monthZhiIdx = getMonthZhi(year, month, day);
  
  // 月干 = 年干 * 2 + 月支序号（寅=0）
  const monthGanBase = (yearGanIdx % 5) * 2;
  const monthGanIdx = (monthGanBase + monthZhiIdx) % 10;
  
  return {
    gan: TIAN_GAN[monthGanIdx],
    zhi: MONTH_ZHI_MAP[monthZhiIdx],
  };
}

// 日柱算法（基于儒略日）
function getDayGanZhi(year: number, month: number, day: number): { gan: string; zhi: string } {
  // 以1900年1月1日为基准（甲戌日，索引=50）
  const base = new Date(1900, 0, 1);
  const target = new Date(year, month - 1, day);
  const diff = Math.floor((target.getTime() - base.getTime()) / (1000 * 60 * 60 * 24));
  const baseIdx = 50; // 甲戌日
  const idx = ((diff + baseIdx) % 60 + 60) % 60;
  return {
    gan: TIAN_GAN[idx % 10],
    zhi: DI_ZHI[idx % 12],
  };
}

// 时柱算法
function getHourGanZhi(dayGan: string, hour: number, isEarlyZi: boolean = false): { gan: string; zhi: string } {
  // 时支（每2小时一支）
  let zhiIdx: number;
  if (hour === 23 || hour === 0) {
    zhiIdx = isEarlyZi ? 0 : 0; // 子时
  } else {
    zhiIdx = Math.floor((hour + 1) / 2) % 12;
  }
  
  const dayGanIdx = TIAN_GAN.indexOf(dayGan);
  const hourGanBase = (dayGanIdx % 5) * 2;
  const hourGanIdx = (hourGanBase + zhiIdx) % 10;
  
  return {
    gan: TIAN_GAN[hourGanIdx],
    zhi: DI_ZHI[zhiIdx],
  };
}

// 获取纳音
function getNayin(gan: string, zhi: string): string {
  const ganIdx = TIAN_GAN.indexOf(gan);
  const zhiIdx = DI_ZHI.indexOf(zhi);
  const idx = Math.floor((ganIdx * 12 + zhiIdx) / 2) % 30;
  return NAYIN[idx];
}

// 真太阳时校正（根据经度）
function correctTrueSolarTime(hour: number, minute: number, longitude: number): { hour: number; minute: number } {
  // 北京时间与真太阳时差 = (longitude - 120) * 4 分钟
  const diffMinutes = Math.round((longitude - 120) * 4);
  let totalMinutes = hour * 60 + minute + diffMinutes;
  totalMinutes = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  return {
    hour: Math.floor(totalMinutes / 60),
    minute: totalMinutes % 60,
  };
}

// 常见城市经度
export const CITY_LONGITUDE: Record<string, number> = {
  '北京': 116.4, '上海': 121.5, '广州': 113.3, '深圳': 114.1,
  '成都': 104.1, '重庆': 106.5, '武汉': 114.3, '西安': 108.9,
  '南京': 118.8, '杭州': 120.2, '天津': 117.2, '苏州': 120.6,
  '郑州': 113.7, '长沙': 113.0, '沈阳': 123.4, '哈尔滨': 126.6,
  '昆明': 102.7, '贵阳': 106.7, '兰州': 103.8, '西宁': 101.8,
  '乌鲁木齐': 87.6, '拉萨': 91.1, '呼和浩特': 111.7, '南宁': 108.4,
  '福州': 119.3, '济南': 117.0, '太原': 112.5, '石家庄': 114.5,
  '长春': 125.3, '合肥': 117.3, '南昌': 115.9, '海口': 110.3,
  '银川': 106.3,
};

// 五行旺衰分析
export function analyzeWuXing(bazi: BaZi): WuXingAnalysis {
  const allGan = [bazi.year.gan, bazi.month.gan, bazi.day.gan, bazi.hour.gan];
  const allZhi = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];
  
  const count: Record<string, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  
  allGan.forEach(g => { if (GAN_WU_XING[g]) count[GAN_WU_XING[g]] += 1; });
  allZhi.forEach(z => {
    if (ZHI_WU_XING[z]) count[ZHI_WU_XING[z]] += 0.8;
    ZHI_CANG_GAN[z]?.forEach((cg, i) => {
      if (GAN_WU_XING[cg]) count[GAN_WU_XING[cg]] += i === 0 ? 0.6 : 0.3;
    });
  });
  
  const riGanWx = GAN_WU_XING[bazi.day.gan];
  // 日主强弱：生我、同我 为旺；克我、泄我 为弱
  const riStrength = count[riGanWx] + count[sheng(riGanWx) === riGanWx ? riGanWx : 
    Object.keys(count).find(k => sheng(k) === riGanWx) || ''] || 0;
  
  const total = Object.values(count).reduce((a, b) => a + b, 0);
  const percentages: Record<string, number> = {};
  Object.keys(count).forEach(k => {
    percentages[k] = Math.round((count[k] / total) * 100);
  });
  
  // 确定喜用神（日主弱则喜印、比；日主强则喜财、官、食伤）
  const sorted = Object.entries(count).sort((a, b) => b[1] - a[1]);
  const strongest = sorted[0][0];
  const weakest = sorted[sorted.length - 1][0];
  
  // 判断日主强弱
  const riWxCount = count[riGanWx] || 0;
  const isStrong = riWxCount >= total / 5 * 1.2;
  
  let xiYongShen: string, jiShen: string;
  if (isStrong) {
    // 身强：喜克泄，忌生扶
    xiYongShen = ke(riGanWx) + '（克）、' + sheng(riGanWx) + '（泄）';
    jiShen = riGanWx + '（同）、' + (Object.keys(count).find(k => sheng(k) === riGanWx) || '') + '（生）';
  } else {
    // 身弱：喜生扶，忌克泄
    xiYongShen = (Object.keys(count).find(k => sheng(k) === riGanWx) || '') + '（生）、' + riGanWx + '（同）';
    jiShen = ke(riGanWx) + '（克）、' + sheng(riGanWx) + '（泄）';
  }

  return {
    count,
    percentages,
    strongest,
    weakest,
    isStrong,
    xiYongShen: xiYongShen.replace(/（/g, '（').replace(/、$/, ''),
    jiShen: jiShen.replace(/（/g, '（').replace(/、$/, ''),
    riGanWx,
  };
}

export interface Pillar {
  gan: string;
  zhi: string;
  nayin: string;
  tenGod: string;
  cangGan: string[];
}

export interface BaZi {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
}

export interface WuXingAnalysis {
  count: Record<string, number>;
  percentages: Record<string, number>;
  strongest: string;
  weakest: string;
  isStrong: boolean;
  xiYongShen: string;
  jiShen: string;
  riGanWx: string;
}

export interface BaziInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  gender: '男' | '女';
  city: string;
  useTrueSolarTime: boolean;
  useEarlyZi: boolean;
}

// 主排盘函数
export function calculateBaZi(input: BaziInput): BaZi {
  let { year, month, day, hour, minute } = input;
  
  // 真太阳时校正
  if (input.useTrueSolarTime && input.city) {
    const lon = CITY_LONGITUDE[input.city] || 116.4;
    const corrected = correctTrueSolarTime(hour, minute, lon);
    hour = corrected.hour;
    minute = corrected.minute;
  }
  
  const yearGz = getYearGanZhi(year, month, day);
  const monthGz = getMonthGanZhi(year, month, day);
  const dayGz = getDayGanZhi(year, month, day);
  const hourGz = getHourGanZhi(dayGz.gan, hour, input.useEarlyZi);
  
  const riZhu = dayGz.gan;
  
  return {
    year: {
      ...yearGz,
      nayin: getNayin(yearGz.gan, yearGz.zhi),
      tenGod: getTenGod(riZhu, yearGz.gan),
      cangGan: ZHI_CANG_GAN[yearGz.zhi] || [],
    },
    month: {
      ...monthGz,
      nayin: getNayin(monthGz.gan, monthGz.zhi),
      tenGod: getTenGod(riZhu, monthGz.gan),
      cangGan: ZHI_CANG_GAN[monthGz.zhi] || [],
    },
    day: {
      ...dayGz,
      nayin: getNayin(dayGz.gan, dayGz.zhi),
      tenGod: '日主',
      cangGan: ZHI_CANG_GAN[dayGz.zhi] || [],
    },
    hour: {
      ...hourGz,
      nayin: getNayin(hourGz.gan, hourGz.zhi),
      tenGod: getTenGod(riZhu, hourGz.gan),
      cangGan: ZHI_CANG_GAN[hourGz.zhi] || [],
    },
  };
}

// 大运排列
export interface DaYun {
  start: number;  // 起运年龄
  gan: string;
  zhi: string;
  tenGod: string;
  years: number; // 跨越年数（每柱10年）
  startYear: number;
}

export function calculateDaYun(bazi: BaZi, birthYear: number, gender: '男' | '女'): DaYun[] {
  // 阳男阴女顺排，阴男阳女逆排
  const yearGanIdx = TIAN_GAN.indexOf(bazi.year.gan);
  const isYang = yearGanIdx % 2 === 0; // 阳年
  const isForward = (isYang && gender === '男') || (!isYang && gender === '女');
  
  // 起运年龄（简化为3岁）
  const startAge = 3;
  
  const monthGanIdx = TIAN_GAN.indexOf(bazi.month.gan);
  const monthZhiIdx = DI_ZHI.indexOf(bazi.month.zhi);
  
  const result: DaYun[] = [];
  for (let i = 1; i <= 8; i++) {
    let ganIdx: number, zhiIdx: number;
    if (isForward) {
      ganIdx = (monthGanIdx + i) % 10;
      zhiIdx = (monthZhiIdx + i) % 12;
    } else {
      ganIdx = ((monthGanIdx - i) % 10 + 10) % 10;
      zhiIdx = ((monthZhiIdx - i) % 12 + 12) % 12;
    }
    
    result.push({
      start: startAge + (i - 1) * 10,
      gan: TIAN_GAN[ganIdx],
      zhi: DI_ZHI[zhiIdx],
      tenGod: getTenGod(bazi.day.gan, TIAN_GAN[ganIdx]),
      years: 10,
      startYear: birthYear + startAge + (i - 1) * 10,
    });
  }
  return result;
}

// 性格解读
export function getPersonalityReading(bazi: BaZi, wxAnalysis: WuXingAnalysis, gender: '男' | '女'): string {
  const riGan = bazi.day.gan;
  const riZhi = bazi.day.zhi;
  const riWx = GAN_WU_XING[riGan];
  
  const personalityMap: Record<string, string> = {
    甲: '甲木日主，性情正直刚毅，有领导才能，做事有条理，喜欢独立创业，但有时过于固执，不善变通。',
    乙: '乙木日主，性格温和谦逊，人际关系好，适应力强，善于处事，但有时优柔寡断，缺乏决断力。',
    丙: '丙火日主，性格开朗热情，积极向上，有感召力，善于表达，但有时急躁冲动，需要磨练耐心。',
    丁: '丁火日主，性格细腻敏感，艺术感强，有独特见解，但有时多愁善感，情绪波动较大。',
    戊: '戊土日主，性格稳重踏实，值得信赖，包容心强，但有时过于守旧，缺乏创新意识。',
    己: '己土日主，性格内敛细心，注重细节，有服务精神，但有时过于自我约束，难以放开手脚。',
    庚: '庚金日主，性格果断刚强，行动力强，自尊心旺，但有时过于强硬，需注意人际关系。',
    辛: '辛金日主，性格精细讲究，有美感，注重品质，但有时过于在意外界评价，敏感脆弱。',
    壬: '壬水日主，性格聪明机智，思维活跃，适应力强，但有时三心二意，缺乏持久力。',
    癸: '癸水日主，性格细腻多情，直觉敏锐，有艺术天赋，但有时过于内敛，不善主动争取。',
  };
  
  return personalityMap[riGan] || '日主特征明显，个性鲜明。';
}

// 近期运势解读
export function getRecentFortune(bazi: BaZi, wxAnalysis: WuXingAnalysis): string {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const yearGanIdx = (currentYear - 4) % 10;
  const yearGan = TIAN_GAN[((yearGanIdx % 10) + 10) % 10];
  const yearWx = GAN_WU_XING[yearGan];
  const riGanWx = wxAnalysis.riGanWx;
  
  const relation = getWxRelation(yearWx, riGanWx);
  const fortuneMap: Record<string, string> = {
    '生我': `今年流年五行生扶日主，整体运势向上，事业有发展机遇，人际关系和谐，适合积极进取，把握机会。`,
    '同我': `今年流年五行与日主相同，竞争意识增强，宜合作共赢，注意防范小人，财运一般但稳定。`,
    '我生': `今年流年五行为日主所生，精力有所消耗，注意劳逸结合，财运尚可，感情方面需多用心。`,
    '我克': `今年流年五行为日主所克，财运有所提升，但需防破财，工作压力较大，注意身体健康。`,
    '克我': `今年流年五行克制日主，需谨慎行事，避免冒险投资，注意身体，多积蓄力量，等待时机。`,
  };
  
  return fortuneMap[relation] || '运势平稳，宜稳扎稳打，循序渐进。';
}

function getWxRelation(sourceWx: string, targetWx: string): string {
  if (sheng(sourceWx) === targetWx) return '生我';
  if (sourceWx === targetWx) return '同我';
  if (sheng(targetWx) === sourceWx) return '我生';
  if (ke(targetWx) === sourceWx) return '我克';
  if (ke(sourceWx) === targetWx) return '克我';
  return '平';
}

// 格局分析
export function analyzeGe(bazi: BaZi, wxAnalysis: WuXingAnalysis): string {
  const riGan = bazi.day.gan;
  const riWx = GAN_WU_XING[riGan];
  
  const { count, isStrong } = wxAnalysis;
  const sorted = Object.entries(count).sort((a, b) => b[1] - a[1]);
  const dominant = sorted[0][0];
  
  if (dominant === riWx && count[dominant] > 3) return '从旺格（日主极旺，五行偏枯）';
  
  const dominantRel = getWxRelation(dominant, riWx);
  if (dominantRel === '克我' && count[dominant] > 3) return '从杀格（七杀当令，官杀过旺）';
  if (dominantRel === '我克' && count[dominant] > 3) return '从财格（财星当令，顺势从财）';
  
  if (isStrong) return '身强格局（日主旺相，宜用财官食伤）';
  return '身弱格局（日主衰弱，宜用印绶比劫）';
}

// 神煞分析
export function getShenSha(bazi: BaZi): Array<{name: string; description: string}> {
  const results = [];
  const yearZhi = bazi.year.zhi;
  const dayGan = bazi.day.gan;
  const dayZhi = bazi.day.zhi;
  
  // 天乙贵人（根据日干查年支或月支是否为贵人支）
  const tianYiMap: Record<string, string[]> = {
    甲: ['丑', '未'], 乙: ['子', '申'], 丙: ['亥', '酉'],
    丁: ['亥', '酉'], 戊: ['丑', '未'], 己: ['子', '申'],
    庚: ['丑', '未'], 辛: ['寅', '午'], 壬: ['卯', '巳'], 癸: ['卯', '巳'],
  };
  if (tianYiMap[dayGan]?.includes(yearZhi) || tianYiMap[dayGan]?.includes(bazi.month.zhi)) {
    results.push({ name: '天乙贵人', description: '得天乙贵人庇护，遇难呈祥，贵人相助，逢凶化吉。' });
  }
  
  // 文昌贵人
  const wenChangMap: Record<string, string> = {
    甲: '巳', 乙: '午', 丙: '申', 丁: '酉', 戊: '申',
    己: '酉', 庚: '亥', 辛: '子', 壬: '寅', 癸: '卯',
  };
  if ([bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi].includes(wenChangMap[dayGan])) {
    results.push({ name: '文昌贵人', description: '文昌入命，聪明好学，学业顺遂，有文学艺术才能。' });
  }
  
  // 桃花
  const taoHuaMap: Record<string, string> = { 子: '酉', 丑: '午', 寅: '卯', 卯: '子', 辰: '酉', 巳: '午', 午: '卯', 未: '子', 申: '酉', 酉: '午', 戌: '卯', 亥: '子' };
  if ([bazi.month.zhi, bazi.hour.zhi].includes(taoHuaMap[yearZhi])) {
    results.push({ name: '桃花', description: '命带桃花，异性缘好，感情丰富，魅力出众，感情生活较为活跃。' });
  }
  
  // 驿马
  const yiMaMap: Record<string, string> = { 寅: '申', 卯: '申', 辰: '申', 巳: '亥', 午: '亥', 未: '亥', 申: '寅', 酉: '寅', 戌: '寅', 亥: '巳', 子: '巳', 丑: '巳' };
  if ([bazi.month.zhi, bazi.hour.zhi].includes(yiMaMap[yearZhi])) {
    results.push({ name: '驿马', description: '命带驿马，奔波劳碌，但也代表出行机会多，适合从事需要移动的职业。' });
  }
  
  if (results.length === 0) {
    results.push({ name: '无明显神煞', description: '命局中无明显神煞，运势稳定平和，贵在脚踏实地。' });
  }
  
  return results;
}
