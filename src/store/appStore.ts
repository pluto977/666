/**
 * 全局状态管理（localStorage持久化）
 */
import { BaZi, BaziInput } from '../utils/bazi';
import { DivinationResult } from '../utils/plumDivination';

export interface UserInfo {
  id: string;
  nickname: string;
  avatar: string;
  phone?: string;
  email?: string;
}

export interface BaziRecord {
  id: string;
  input: BaziInput;
  bazi: BaZi;
  createdAt: string;
  note?: string;
}

export interface HuangLiFavorite {
  id: string;
  date: string; // YYYY-MM-DD
  note?: string;
  savedAt: string;
}

export interface AppSettings {
  useTrueSolarTime: boolean;
  useEarlyZi: boolean;
  fontSize: 'small' | 'medium' | 'large';
  pushNotification: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  useTrueSolarTime: false,
  useEarlyZi: false,
  fontSize: 'medium',
  pushNotification: true,
};

// 存储键
const KEYS = {
  USER: 'bazi_user',
  BAZI_RECORDS: 'bazi_records',
  DIVINATION_RECORDS: 'bazi_divinations',
  HUANGLI_FAVORITES: 'bazi_huangli_favs',
  SETTINGS: 'bazi_settings',
};

function load<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// 用户
export const userStore = {
  get(): UserInfo | null { return load<UserInfo | null>(KEYS.USER, null); },
  set(u: UserInfo) { save(KEYS.USER, u); },
  clear() { localStorage.removeItem(KEYS.USER); },
  isLoggedIn(): boolean { return !!this.get(); },
  login(phone: string, nickname?: string): UserInfo {
    const user: UserInfo = {
      id: Date.now().toString(),
      nickname: nickname || '用户' + phone.slice(-4),
      avatar: '',
      phone,
    };
    this.set(user);
    return user;
  },
};

// 八字记录
export const baziRecordStore = {
  getAll(): BaziRecord[] { return load<BaziRecord[]>(KEYS.BAZI_RECORDS, []); },
  add(input: BaziInput, bazi: BaZi): BaziRecord {
    const records = this.getAll();
    const record: BaziRecord = {
      id: Date.now().toString(),
      input,
      bazi,
      createdAt: new Date().toISOString(),
    };
    records.unshift(record);
    save(KEYS.BAZI_RECORDS, records.slice(0, 50)); // 最多50条
    return record;
  },
  remove(id: string) {
    const records = this.getAll().filter(r => r.id !== id);
    save(KEYS.BAZI_RECORDS, records);
  },
  clear() { localStorage.removeItem(KEYS.BAZI_RECORDS); },
};

// 起卦记录
export const divinationStore = {
  getAll(): DivinationResult[] { return load<DivinationResult[]>(KEYS.DIVINATION_RECORDS, []); },
  add(result: DivinationResult): void {
    const records = this.getAll();
    records.unshift(result);
    save(KEYS.DIVINATION_RECORDS, records.slice(0, 30));
  },
  remove(createTime: string) {
    const records = this.getAll().filter(r => r.createTime !== createTime);
    save(KEYS.DIVINATION_RECORDS, records);
  },
};

// 黄历收藏
export const huangLiFavStore = {
  getAll(): HuangLiFavorite[] { return load<HuangLiFavorite[]>(KEYS.HUANGLI_FAVORITES, []); },
  add(date: string): void {
    const favs = this.getAll();
    if (!favs.find(f => f.date === date)) {
      favs.unshift({ id: Date.now().toString(), date, savedAt: new Date().toISOString() });
      save(KEYS.HUANGLI_FAVORITES, favs.slice(0, 100));
    }
  },
  remove(date: string): void {
    save(KEYS.HUANGLI_FAVORITES, this.getAll().filter(f => f.date !== date));
  },
  has(date: string): boolean { return !!this.getAll().find(f => f.date === date); },
  toggle(date: string): boolean {
    if (this.has(date)) { this.remove(date); return false; }
    else { this.add(date); return true; }
  },
};

// 设置
export const settingsStore = {
  get(): AppSettings { return load<AppSettings>(KEYS.SETTINGS, DEFAULT_SETTINGS); },
  set(s: Partial<AppSettings>): void {
    const curr = this.get();
    save(KEYS.SETTINGS, { ...curr, ...s });
  },
};
