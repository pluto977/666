/**
 * 梅花易数起卦算法
 * 基于邵雍梅花易数原理
 */

// 八卦数（先天八卦序数）
export const GUA_NUM: Record<string, number> = {
  乾: 1, 兑: 2, 离: 3, 震: 4, 巽: 5, 坎: 6, 艮: 7, 坤: 8,
};

export const NUM_GUA: Record<number, string> = {
  1: '乾', 2: '兑', 3: '离', 4: '震', 5: '巽', 6: '坎', 7: '艮', 8: '坤',
};

// 卦象符号（实线=阳，虚线=阴）
export const GUA_SYMBOL: Record<string, string> = {
  乾: '☰', 兑: '☱', 离: '☲', 震: '☳', 巽: '☴', 坎: '☵', 艮: '☶', 坤: '☷',
};

// 卦象五行
export const GUA_WU_XING: Record<string, string> = {
  乾: '金', 兑: '金', 离: '火', 震: '木', 巽: '木', 坎: '水', 艮: '土', 坤: '土',
};

// 六十四卦名
const LIU_SHI_SI_GUA: Record<string, string> = {
  '乾乾': '乾为天', '乾兑': '天泽履', '乾离': '天火同人', '乾震': '天雷无妄',
  '乾巽': '天风姤', '乾坎': '天水讼', '乾艮': '天山遁', '乾坤': '天地否',
  '兑乾': '泽天夬', '兑兑': '兑为泽', '兑离': '泽火革', '兑震': '泽雷随',
  '兑巽': '泽风大过', '兑坎': '泽水困', '兑艮': '泽山咸', '兑坤': '泽地萃',
  '离乾': '火天大有', '离兑': '火泽睽', '离离': '离为火', '离震': '火雷噬嗑',
  '离巽': '火风鼎', '离坎': '火水未济', '离艮': '火山旅', '离坤': '火地晋',
  '震乾': '雷天大壮', '震兑': '雷泽归妹', '震离': '雷火丰', '震震': '震为雷',
  '震巽': '雷风恒', '震坎': '雷水解', '震艮': '雷山小过', '震坤': '雷地豫',
  '巽乾': '风天小畜', '巽兑': '风泽中孚', '巽离': '风火家人', '巽震': '风雷益',
  '巽巽': '巽为风', '巽坎': '风水涣', '巽艮': '风山渐', '巽坤': '风地观',
  '坎乾': '水天需', '坎兑': '水泽节', '坎离': '水火既济', '坎震': '水雷屯',
  '坎巽': '水风井', '坎坎': '坎为水', '坎艮': '水山蹇', '坎坤': '水地比',
  '艮乾': '山天大畜', '艮兑': '山泽损', '艮离': '山火贲', '艮震': '山雷颐',
  '艮巽': '山风蛊', '艮坎': '山水蒙', '艮艮': '艮为山', '艮坤': '山地剥',
  '坤乾': '地天泰', '坤兑': '地泽临', '坤离': '地火明夷', '坤震': '地雷复',
  '坤巽': '地风升', '坤坎': '地水师', '坤艮': '地山谦', '坤坤': '坤为地',
};

// 卦辞简版
const GUA_CI: Record<string, string> = {
  '乾为天': '元亨利贞。刚健中正，自强不息，大吉大利。',
  '坤为地': '元亨，利牝马之贞。厚德载物，顺承天道，有孚而利。',
  '水雷屯': '元亨，利贞。勿用有攸往，利建侯。万事开头难，坚持必成。',
  '山水蒙': '亨。匪我求童蒙，童蒙求我。启蒙立志，循序渐进。',
  '水天需': '有孚，光亨，贞吉。利涉大川。静待时机，时机一到则大有作为。',
  '天水讼': '有孚，窒惕，中吉。终凶。利见大人，不利涉大川。宜和不宜争。',
  '地水师': '贞，丈人，吉，无咎。以正待变，整顿内部，稳固根基。',
  '水地比': '吉，原筮，元永贞，无咎。不宁方来，后夫凶。团结协作，同心协力。',
  '风天小畜': '亨。密云不雨，自我西郊。积累力量，厚积薄发，时机未到勿强求。',
  '天泽履': '履虎尾，不咥人，亨。谨慎前行，礼节周全，则无大碍。',
  '地天泰': '小往大来，吉，亨。天地交通，阴阳和合，万物亨通，大吉之象。',
  '天地否': '否之匪人，不利君子贞，大往小来。天地阻隔，暂时不利，宜韬光养晦。',
  '天火同人': '同人于野，亨。利涉大川，利君子贞。志同道合，共谋大事，吉。',
  '火天大有': '元亨。火照天下，拥有广博，大吉之卦，诸事顺遂。',
  '地山谦': '亨，君子有终。谦虚自牧，低调处事，终有所成。',
  '雷地豫': '利建侯行师。顺势而为，提前谋划，快乐前行。',
  '泽雷随': '元亨，利贞，无咎。灵活变通，随机应变，顺势而行。',
  '山风蛊': '元亨，利涉大川。先甲三日，后甲三日。整治积弊，革旧布新。',
  '地泽临': '元亨，利贞。至于八月有凶。居高临下，把握全局，注意时机变化。',
  '风地观': '盥而不荐，有孚颙若。观察形势，以理服人，获得信任。',
  '火雷噬嗑': '亨，利用狱。刚决果断，排除障碍，执法公正。',
  '山火贲': '亨，小利有攸往。注重外表，文饰得当，内外兼修。',
  '山地剥': '不利有攸往。阴盛阳衰，当下不利，宜退守待机。',
  '地雷复': '亨，出入无疾，朋来无咎。反复其道，七日来复，否极泰来。',
  '天雷无妄': '元亨，利贞。其匪正有眚，不利有攸往。顺天应时，不妄行，吉。',
  '山天大畜': '利贞，不家食，吉，利涉大川。厚积厚蓄，蓄德备才，时机已到。',
  '山雷颐': '贞吉，观颐，自求口实。养正蓄德，慎言节食，养生有道。',
  '泽风大过': '栋桡，利有攸往，亨。非常之时，需有非常之举，但须谨慎。',
  '坎为水': '习坎，有孚，维心亨，行有尚。处险不惊，坚守内心，可渡难关。',
  '离为火': '利贞，亨，畜牝牛，吉。光明正大，附丽正道，文明昌盛。',
  '泽山咸': '亨，利贞，取女吉。感应相通，男女相悦，婚姻吉祥。',
  '雷风恒': '亨，无咎，利贞，利有攸往。持之以恒，坚守正道，恒久而吉。',
  '天山遁': '亨，小利贞。退而有为，韬光养晦，以退为进。',
  '雷天大壮': '利贞。刚强有力，大展宏图，但须防过于刚猛而有失。',
  '火地晋': '康侯用锡马蕃庶，昼日三接。顺势上进，蒸蒸日上，光明前途。',
  '地火明夷': '利艰贞。光明受损，暂时隐晦，保持内心光明，待机而动。',
  '风火家人': '利女贞。家庭和睦，各司其职，内外有序，家道昌盛。',
  '火泽睽': '小事吉。异中求同，求同存异，小处着手方为吉。',
  '水山蹇': '利西南，不利东北，利见大人，贞吉。前路艰难，寻求贵人相助。',
  '雷水解': '利西南，无所往，其来复吉。有攸往，夙吉。消解困难，否极泰来。',
  '山泽损': '有孚，元吉，无咎，可贞，利有攸往。损下益上，诚心奉献，终获吉祥。',
  '风雷益': '利有攸往，利涉大川。增益进步，风助雷威，大有作为。',
  '泽天夬': '扬于王庭，孚号，有厉，告自邑，不利即戎，利有攸往。果断决策，刚决前行。',
  '天风姤': '女壮，勿用取女。偶遇良机，但须谨慎，防止阴柔侵蚀。',
  '泽地萃': '亨，王假有庙，利见大人，亨，利贞，用大牲吉，利有攸往。汇聚人才，团结力量。',
  '地风升': '元亨，用见大人，勿恤，南征吉。循序渐进，积小成大，终达顶峰。',
  '泽水困': '亨，贞，大人吉，无咎，有言不信。困境中坚守正道，大人处之泰然。',
  '水风井': '改邑不改井，无丧无得，往来井井。养而不穷，取之不尽，源源不断。',
  '泽火革': '己日乃孚，元亨，利贞，悔亡。革旧布新，因时制宜，改革创新。',
  '火风鼎': '元吉，亨。鼎革旧制，烹饪新知，稳重变革，大有收益。',
  '震为雷': '亨，震来虩虩，笑言哑哑，震惊百里，不丧匕鬯。居安思危，遇震不惊。',
  '艮为山': '艮其背，不获其身，行其庭，不见其人，无咎。静止自守，各得其所。',
  '风山渐': '女归吉，利贞。循序渐进，步步为营，慢工出细活。',
  '雷泽归妹': '征凶，无攸利。归宿之道，顺乎天理，但此时征凶，宜守。',
  '雷火丰': '亨，王假之，勿忧，宜日中。盛大丰满，光明正大，当盛之时宜珍惜。',
  '火山旅': '小亨，旅贞吉。旅途奔波，随遇而安，保持正直则吉。',
  '巽为风': '小亨，利有攸往，利见大人。谦逊顺从，以柔克刚，见机行事。',
  '兑为泽': '亨，利贞。喜悦和顺，内刚外柔，言说得当，和悦众人。',
  '风水涣': '亨，王假有庙，利涉大川，利贞。消散聚合，化解矛盾，团结人心。',
  '水泽节': '亨，苦节不可贞。适度节制，把握分寸，过犹不及。',
  '风泽中孚': '豚鱼吉，利涉大川，利贞。内心诚信，感动天地，信实无欺。',
  '雷山小过': '亨，利贞，可小事，不可大事。飞鸟遗之音，不宜上，宜下，大吉。小心谨慎，只宜小事。',
  '水火既济': '亨，小利贞，初吉终乱。水火相济，功德圆满，守成防变。',
  '火水未济': '亨，小狐汔济，濡其尾，无攸利。功业未竟，继续努力，终可成功。',
};

// 获取卦名
export function getGuaName(shangGua: string, xiaGua: string): string {
  const key = shangGua + xiaGua;
  return LIU_SHI_SI_GUA[key] || shangGua + xiaGua;
}

// 获取卦辞
export function getGuaCi(guaName: string): string {
  return GUA_CI[guaName] || '此卦象征变化，需结合具体情况判断吉凶。';
}

// 时间起卦
export function timeQiGua(date: Date): { shangGua: string; xiaGua: string; dongYao: number } {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  
  // 上卦 = (月+日+时) % 8
  const shangNum = ((month + day + Math.floor(hour / 2) + 1) % 8) || 8;
  // 下卦 = (月+日) % 8
  const xiaNum = ((month + day) % 8) || 8;
  // 动爻 = (月+日+时) % 6
  const dongYao = ((month + day + Math.floor(hour / 2) + 1) % 6) || 6;
  
  return {
    shangGua: NUM_GUA[shangNum],
    xiaGua: NUM_GUA[xiaNum],
    dongYao,
  };
}

// 数字起卦（gender: 'male' | 'female'，影响动爻推算）
// 传统梅花易数：男性取阳，动爻 = (上卦数 + 下卦数) % 6；
// 女性取阴，动爻 = (上卦数 + 下卦数 + 1) % 6（阴进一位）
export function numberQiGua(num1: number, num2: number, gender: 'male' | 'female' = 'male'): { shangGua: string; xiaGua: string; dongYao: number } {
  const shangNum = (num1 % 8) || 8;
  const xiaNum = (num2 % 8) || 8;
  // 女性在总数上加1（阴数顺推），使动爻结果不同
  const base = num1 + num2 + (gender === 'female' ? 1 : 0);
  const dongYao = (base % 6) || 6;
  
  return {
    shangGua: NUM_GUA[shangNum],
    xiaGua: NUM_GUA[xiaNum],
    dongYao,
  };
}

// 手动起卦（三枚铜钱法）
export function manualQiGua(throws: number[][]): { shangGua: string; xiaGua: string; dongYao: number } {
  // 每次投掷3枚铜钱，正面=3，背面=2，奇数为阳，偶数为阴
  const yaos = throws.map(t => {
    const sum = t.reduce((a, b) => a + b, 0);
    return sum % 2 !== 0 ? 1 : 0; // 1=阳，0=阴
  });
  
  // 下三爻为下卦，上三爻为上卦
  const xiaYaos = yaos.slice(0, 3);
  const shangYaos = yaos.slice(3, 6);
  
  function yaosToGua(ys: number[]): string {
    const key = ys.join('');
    const guaMap: Record<string, string> = {
      '111': '乾', '011': '兑', '101': '离', '001': '震',
      '110': '巽', '010': '坎', '100': '艮', '000': '坤',
    };
    return guaMap[key] || '坤';
  }
  
  // 找变爻（老阳=9，老阴=6为动爻，简化为随机选）
  const dongYao = Math.floor(Math.random() * 6) + 1;
  
  return {
    shangGua: yaosToGua(shangYaos),
    xiaGua: yaosToGua(xiaYaos),
    dongYao,
  };
}

// 变卦（动爻变化）
export function getBianGua(shangGua: string, xiaGua: string, dongYao: number): { shangGua: string; xiaGua: string } {
  // 将动爻取反（阳变阴，阴变阳）
  const guaYaos: Record<string, number[]> = {
    乾: [1,1,1], 兑: [0,1,1], 离: [1,0,1], 震: [0,0,1],
    巽: [1,1,0], 坎: [0,1,0], 艮: [1,0,0], 坤: [0,0,0],
  };
  
  const allYaos = [...(guaYaos[xiaGua] || [0,0,0]), ...(guaYaos[shangGua] || [1,1,1])];
  const yaoIdx = dongYao - 1;
  if (yaoIdx >= 0 && yaoIdx < 6) {
    allYaos[yaoIdx] = allYaos[yaoIdx] === 1 ? 0 : 1;
  }
  
  const newXiaYaos = allYaos.slice(0, 3);
  const newShangYaos = allYaos.slice(3, 6);
  
  function yaosToGua(ys: number[]): string {
    const key = ys.join('');
    const guaMap: Record<string, string> = {
      '111': '乾', '011': '兑', '101': '离', '001': '震',
      '110': '巽', '010': '坎', '100': '艮', '000': '坤',
    };
    return guaMap[key] || '坤';
  }
  
  return {
    shangGua: yaosToGua(newShangYaos),
    xiaGua: yaosToGua(newXiaYaos),
  };
}

// 体用分析（动爻所在卦为用卦，另一卦为体卦）
export function getTiYong(shangGua: string, xiaGua: string, dongYao: number): { tiGua: string; yongGua: string } {
  if (dongYao <= 3) {
    return { tiGua: shangGua, yongGua: xiaGua };
  } else {
    return { tiGua: xiaGua, yongGua: shangGua };
  }
}

// 体用关系的白话说明
const TI_YONG_PLAIN: Record<string, { short: string; plain: string; advice: string }> = {
  '体用同五行': {
    short: '不好不坏，平稳发展',
    plain: '体卦与用卦五行相同，力量相当，局面不会有太大起伏。事情会按部就班地进行，既不会突飞猛进，也不会急转直下。',
    advice: '维持现状，稳扎稳打，不必强求突破，耐心等待时机成熟。',
  },
  '用生体': {
    short: '贵人相助，事顺则成',
    plain: '用卦（外部环境）在滋养体卦（自身），意味着外部条件对你十分有利。就像顺风行船，有人在背后帮你一把，事情推进起来比较省力。',
    advice: '主动出击，积极借助外力与他人支持，时机成熟，当仁不让。',
  },
  '体生用': {
    short: '需要付出，有去有得',
    plain: '体卦在滋养用卦，意味着你需要主动投入资源、精力或感情。就像种树要先浇水，付出在前，收获在后，不可急于求成。',
    advice: '做好充足准备，量力而行，投入要有节制，避免过度消耗自身。',
  },
  '用克体': {
    short: '阻力较大，需谨慎行事',
    plain: '用卦（外部环境）在压制体卦（自身），说明外部阻力较强，局势对你不够友好。此时强行推进容易碰壁，需要格外谨慎。',
    advice: '暂缓行动，先充分了解情况，避免正面硬碰，可寻求调解或迂回化解阻力。',
  },
  '体克用': {
    short: '掌握主动，可克服困难',
    plain: '体卦（自身）在克制用卦（外部），说明你处于相对主动的位置，有能力驾驭局面。只要方向正确，可以凭借自身实力推动事情向好的方向发展。',
    advice: '坚定信心，主动出击，把握当前优势，但切勿骄傲冒进，注意留有余地。',
  },
};

// 场景化建议补充
const SCENE_ADVICE: Record<string, Record<string, string>> = {
  求职: {
    '用生体': '面试机会大，伯乐容易出现，积极投递简历、参加面试。',
    '体生用': '需要多做准备，打磨技能与简历，付出努力后会有回报。',
    '用克体': '近期求职阻力较多，宜充电提升自身，暂缓大规模投递。',
    '体克用': '竞争中你有优势，勇敢表现自己，成功概率较高。',
    '体用同五行': '机会平平，保持持续投入，勿急于求成。',
  },
  婚恋: {
    '用生体': '对方对你有好感，感情顺势而生，可主动表达。',
    '体生用': '你付出更多，感情需要呵护，注意双方平衡。',
    '用克体': '感情中易受阻，沟通需耐心，避免争吵。',
    '体克用': '你在关系中占主动，但需温柔以待，勿过于强势。',
    '体用同五行': '感情平稳，细水长流，无大起伏。',
  },
  投资: {
    '用生体': '市场环境利好，可适度出手，把握机会。',
    '体生用': '需要持续投入，回报周期较长，耐心持有。',
    '用克体': '市场阻力大，谨慎入场，控制仓位，保守为主。',
    '体克用': '判断较为准确，可按计划执行，注意止盈止损。',
    '体用同五行': '行情平淡，维持现有配置，不必频繁操作。',
  },
  健康: {
    '用生体': '体质向好，注意保养，继续保持良好习惯。',
    '体生用': '身体消耗较大，注意休息，避免过劳。',
    '用克体': '身体抵抗力偏弱，注意预防疾病，及时就医检查。',
    '体克用': '恢复能力较强，按时调养，状态会逐步好转。',
    '体用同五行': '健康平稳，维持现有生活习惯即可。',
  },
  学业: {
    '用生体': '学习环境顺利，贵人指引多，成绩有望提升。',
    '体生用': '需要加倍努力，勤奋付出必有回报。',
    '用克体': '学习压力较大，调整心态，寻求老师或同学帮助。',
    '体克用': '理解能力强，勤加练习，可取得不错成绩。',
    '体用同五行': '成绩平稳，保持节奏，循序渐进。',
  },
  事业: {
    '用生体': '事业顺风顺水，贵人提携，把握晋升机会。',
    '体生用': '需主动担责，付出努力，积累口碑。',
    '用克体': '职场阻力大，保持低调，避免与人正面冲突。',
    '体克用': '主动把握主导权，发挥特长，事业可有突破。',
    '体用同五行': '事业平稳推进，保持专注，积累沉淀。',
  },
  家宅: {
    '用生体': '家宅运势向好，家庭和睦，适合装修或置业。',
    '体生用': '家中事务需要你多操持，付出耐心。',
    '用克体': '家宅有些不顺，注意家人关系，避免口角。',
    '体克用': '你能主导家庭事务，妥善安排，家宅平安。',
    '体用同五行': '家宅平稳，无大变化，日常维护即可。',
  },
  出行: {
    '用生体': '出行顺利，一路顺风，目的地行程愉快。',
    '体生用': '出行需多准备，行前做好功课，旅途尚顺。',
    '用克体': '出行有阻，注意安全，可推迟或更改计划。',
    '体克用': '行程掌控得当，遇到问题能妥善应对。',
    '体用同五行': '出行平稳，按计划进行，无大意外。',
  },
};

// 吉凶分析
export function analyzeJiXiong(
  shangGua: string, xiaGua: string, dongYao: number,
  bianShang: string, bianXia: string,
  scene: string
): string {
  const { tiGua, yongGua } = getTiYong(shangGua, xiaGua, dongYao);
  const tiWx = GUA_WU_XING[tiGua];
  const yongWx = GUA_WU_XING[yongGua];

  let relation = '';
  let jixiong = '';

  if (tiWx === yongWx) {
    relation = '体用同五行';
    jixiong = '平稳，结果一般，事情发展中等。';
  } else if (shengWx(yongWx) === tiWx) {
    relation = '用生体';
    jixiong = '大吉，得到外力支持，事情进展顺利，目标可以达成。';
  } else if (shengWx(tiWx) === yongWx) {
    relation = '体生用';
    jixiong = '中平，需要付出较多努力，有所消耗，结果尚可。';
  } else if (keWx(yongWx) === tiWx) {
    relation = '用克体';
    jixiong = '不利，遭遇阻碍，事情难以顺利进行，需谨慎应对。';
  } else if (keWx(tiWx) === yongWx) {
    relation = '体克用';
    jixiong = '较吉，主动掌控局势，能够克服困难，达成目标。';
  }

  const plain = TI_YONG_PLAIN[relation];
  const bianGuaName = getGuaName(bianShang, bianXia);
  const bianCi = getGuaCi(bianGuaName);
  const sceneAdvice = scene && SCENE_ADVICE[scene]?.[relation] ? `\n针对"${scene}"：${SCENE_ADVICE[scene][relation]}` : '';

  return `【一句话总结】${plain?.short ?? jixiong}

【卦象白话解读】
体卦为${tiGua}（${tiWx}），代表你自身的状态；用卦为${yongGua}（${yongWx}），代表外部环境与对手。两者关系为「${relation}」。
${plain?.plain ?? ''}

【变卦提示】
当前局势正在向《${bianGuaName}》转变——${bianCi}
这说明事情不会一成不变，需关注近期环境的变化信号。

【行动建议】
${plain?.advice ?? ''}${sceneAdvice}

【专业术语参考】体卦：${tiGua}（${tiWx}） | 用卦：${yongGua}（${yongWx}） | ${relation} | 第${dongYao}爻动 | 变卦：${bianGuaName}`;
}

function shengWx(wx: string): string {
  const map: Record<string, string> = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
  return map[wx] || '';
}
function keWx(wx: string): string {
  const map: Record<string, string> = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };
  return map[wx] || '';
}

export interface DivinationResult {
  shangGua: string;
  xiaGua: string;
  guaName: string;
  guaCi: string;
  dongYao: number;
  bianShang: string;
  bianXia: string;
  bianGuaName: string;
  tiGua: string;
  yongGua: string;
  analysis: string;
  createTime: string;
  scene: string;
  method: string;
}
