import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  calculateBaZi, analyzeWuXing, calculateDaYun,
  getPersonalityReading, getRecentFortune, analyzeGe, getShenSha,
  BaziInput, BaZi, WuXingAnalysis, DaYun, GAN_WU_XING
} from '../utils/bazi';
import WuXingChart from '../components/WuXingChart';
import { baziRecordStore } from '../store/appStore';
import { REGION_DATA } from '../utils/regionData';

type Tab = 'basic' | 'deep';

const WX_COLORS: Record<string, string> = {
  木: 'text-green-600 bg-green-50 border-green-200',
  火: 'text-red-600 bg-red-50 border-red-200',
  土: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  金: 'text-gray-600 bg-gray-50 border-gray-200',
  水: 'text-blue-600 bg-blue-50 border-blue-200',
};

export default function BaziPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'input' | 'result'>('input');
  const [tab, setTab] = useState<Tab>('basic');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [bazi, setBazi] = useState<BaZi | null>(null);
  const [wxAnalysis, setWxAnalysis] = useState<WuXingAnalysis | null>(null);
  const [daYun, setDaYun] = useState<DaYun[]>([]);
  const [input, setInput] = useState<BaziInput>({
    year: 1990, month: 1, day: 1, hour: 8, minute: 0,
    gender: '男', city: '北京',
    useTrueSolarTime: false, useEarlyZi: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [selProvince, setSelProvince] = useState('北京市');
  const [selCity, setSelCity] = useState('北京市');
  const [selDistrict, setSelDistrict] = useState('东城区');

  const curProvince = REGION_DATA.find(p => p.name === selProvince) ?? REGION_DATA[0];
  const curCity = curProvince.cities.find(c => c.name === selCity) ?? curProvince.cities[0];

  function handleProvinceChange(pname: string) {
    const prov = REGION_DATA.find(p => p.name === pname) ?? REGION_DATA[0];
    const city = prov.cities[0];
    const dist = city.districts[0];
    setSelProvince(pname);
    setSelCity(city.name);
    setSelDistrict(dist.name);
    setInput(prev => ({ ...prev, city: dist.cityKey }));
  }

  function handleCityChange(cname: string) {
    const city = curProvince.cities.find(c => c.name === cname) ?? curProvince.cities[0];
    const dist = city.districts[0];
    setSelCity(cname);
    setSelDistrict(dist.name);
    setInput(prev => ({ ...prev, city: dist.cityKey }));
  }

  function handleDistrictChange(dname: string) {
    const dist = curCity.districts.find(d => d.name === dname) ?? curCity.districts[0];
    setSelDistrict(dname);
    setInput(prev => ({ ...prev, city: dist.cityKey }));
  }

  const PILLAR_NAMES = ['年柱', '月柱', '日柱', '时柱'];
  const pillars = bazi ? [bazi.year, bazi.month, bazi.day, bazi.hour] : [];

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (input.year < 1900 || input.year > 2050) errs.year = '年份范围1900-2050';
    if (input.month < 1 || input.month > 12) errs.month = '月份1-12';
    if (input.day < 1 || input.day > 31) errs.day = '日期1-31';
    if (input.hour < 0 || input.hour > 23) errs.hour = '时辰0-23';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handlePaipan() {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const b = calculateBaZi(input);
      const wx = analyzeWuXing(b);
      const dy = calculateDaYun(b, input.year, input.gender);
      setBazi(b); setWxAnalysis(wx); setDaYun(dy);
      setStep('result'); setLoading(false); setSaved(false);
    }, 800);
  }

  function handleSave() {
    if (bazi) { baziRecordStore.add(input, bazi); setSaved(true); }
  }

  return (
    <div className="p-8 fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 serif">八字排盘</h1>
          <p className="text-gray-400 text-sm mt-2">输入出生信息，获取八字命盘与深度解读</p>
        </div>
        {step === 'result' && (
          <div className="flex gap-4">
            <button onClick={() => { setStep('input'); setBazi(null); setSaved(false); }} className="btn-secondary text-sm">
              重新排盘
            </button>
            <button onClick={() => navigate('/divination')} className="btn-danger text-sm">
              梅花起卦
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 左侧输入表单 */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="font-semibold text-gray-800 mb-4 text-lg">出生信息</h2>
            <div className="space-y-4">
              {/* 性别 */}
              <div>
                <label className="text-sm text-gray-400 block mb-2">性别</label>
                <div className="flex gap-2">
                  {(['男', '女'] as const).map(g => (
                    <button key={g} onClick={() => setInput(p => ({ ...p, gender: g }))}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${
                        input.gender === g
                          ? 'text-white border-orange-500'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                      }`}
                      style={input.gender === g ? { background: 'linear-gradient(135deg, #f97316, #ea6c0a)' } : {}}
                    >{g}</button>
                  ))}
                </div>
              </div>

              {/* 年 */}
              <div>
                <label className="text-sm text-gray-400 block mb-2">出生年份</label>
                <input type="number" value={input.year}
                  onChange={e => setInput(p => ({ ...p, year: +e.target.value }))}
                  className={`w-full border rounded-xl px-4 py-2 text-sm ${errors.year ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-orange-400'} outline-none`}
                  placeholder="如：1990"
                />
                {errors.year && <p className="text-xs text-red-500 mt-2">{errors.year}</p>}
              </div>

              {/* 月日 */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm text-gray-400 block mb-2">月</label>
                  <input type="number" min={1} max={12} value={input.month}
                    onChange={e => setInput(p => ({ ...p, month: +e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:border-orange-400 outline-none text-center"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-2">日</label>
                  <input type="number" min={1} max={31} value={input.day}
                    onChange={e => setInput(p => ({ ...p, day: +e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:border-orange-400 outline-none text-center"
                  />
                </div>
              </div>

              {/* 时辰 */}
              <div>
                <label className="text-sm text-gray-400 block mb-2">出生时辰</label>
                <select value={input.hour} onChange={e => setInput(p => ({ ...p, hour: +e.target.value }))}
                  className="select-field"
                >
                  {[
                    [0,'子时（23-01点）'],[1,'丑时（01-03点）'],[3,'寅时（03-05点）'],
                    [5,'卯时（05-07点）'],[7,'辰时（07-09点）'],[9,'巳时（09-11点）'],
                    [11,'午时（11-13点）'],[13,'未时（13-15点）'],[15,'申时（15-17点）'],
                    [17,'酉时（17-19点）'],[19,'戌时（19-21点）'],[21,'亥时（21-23点）'],
                  ].map(([h, name]) => (
                    <option key={h} value={h}>{name}</option>
                  ))}
                </select>
              </div>

              {/* 出生地 */}
              <div>
                <label className="text-sm text-gray-400 block mb-2">出生地</label>
                <div className="space-y-2">
                  <select value={selProvince} onChange={e => handleProvinceChange(e.target.value)} className="select-field">
                    {REGION_DATA.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                  </select>
                  <select value={selCity} onChange={e => handleCityChange(e.target.value)} className="select-field">
                    {curProvince.cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                  <select value={selDistrict} onChange={e => handleDistrictChange(e.target.value)} className="select-field">
                    {curCity.districts.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                  </select>
                  <p className="text-xs text-gray-400">经度参考城市：{input.city}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 排盘设置 */}
          <div className="card">
            <h2 className="font-semibold text-gray-800 mb-4 text-lg">排盘设置</h2>
            <div className="space-y-4">
              {[
                { key: 'useTrueSolarTime' as const, label: '真太阳时校正', desc: '根据出生地经度校正' },
                { key: 'useEarlyZi' as const, label: '早子时排盘', desc: '子时按当日日期' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-700">{item.label}</div>
                    <div className="text-xs text-gray-400">{item.desc}</div>
                  </div>
                  <div
                    onClick={() => setInput(p => ({ ...p, [item.key]: !p[item.key] }))}
                    className={`toggle ${input[item.key] ? 'bg-orange-500' : 'bg-gray-200'}`}
                  >
                    <div className={`toggle-dot ${input[item.key] ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handlePaipan} disabled={loading}
            className="w-full text-white rounded-xl py-4 font-semibold text-base transition shadow-md disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea6c0a 100%)' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                排盘中...
              </span>
            ) : '排盘解读'}
          </button>
          <p className="text-center text-xs text-gray-400">以上内容仅供参考，不构成迷信引导</p>
        </div>

        {/* 右侧结果区 */}
        <div className="col-span-2 space-y-6">
          {!bazi ? (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <p className="text-gray-400 text-lg">请在左侧填写出生信息</p>
              <p className="text-gray-300 text-sm mt-2">支持真太阳时校正 · 早晚子时选择</p>
            </div>
          ) : wxAnalysis && (
            <div className="fade-in space-y-6">
              {/* 八字排盘表格 */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-800 text-lg">八字排盘结果</h2>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-3 py-1 bg-orange-50 rounded-lg text-orange-600 text-xs">
                      {input.gender} · {input.year}/{input.month}/{input.day} {input.hour}时
                    </span>
                    {input.useTrueSolarTime && <span className="px-3 py-1 bg-blue-50 rounded-lg text-blue-600 text-xs">真太阳时</span>}
                    <span className="px-3 py-1 bg-orange-50 rounded-lg text-orange-600 text-xs">{input.city}</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="bazi-table">
                    <thead>
                      <tr>
                        <th className="text-orange-400 w-16"></th>
                        {PILLAR_NAMES.map(n => <th key={n} className="text-gray-700 text-base">{n}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-gray-400 text-sm">十神</td>
                        {pillars.map((p, i) => <td key={i} className="text-orange-500 font-medium">{p.tenGod}</td>)}
                      </tr>
                      <tr className="bg-orange-50/40">
                        <td className="text-gray-400 text-sm">天干</td>
                        {pillars.map((p, i) => {
                          const wx = GAN_WU_XING[p.gan];
                          return (
                            <td key={i}>
                              <span className={`font-bold text-2xl ${wx ? WX_COLORS[wx]?.split(' ')[0] : ''}`}>{p.gan}</span>
                            </td>
                          );
                        })}
                      </tr>
                      <tr>
                        <td className="text-gray-400 text-sm">地支</td>
                        {pillars.map((p, i) => <td key={i} className="font-bold text-2xl text-gray-700 serif">{p.zhi}</td>)}
                      </tr>
                      <tr className="bg-orange-50/40">
                        <td className="text-gray-400 text-sm">藏干</td>
                        {pillars.map((p, i) => <td key={i} className="text-sm text-gray-600">{p.cangGan.join(' ')}</td>)}
                      </tr>
                      <tr>
                        <td className="text-gray-400 text-sm">纳音</td>
                        {pillars.map((p, i) => <td key={i} className="text-sm text-gray-500">{p.nayin}</td>)}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 五行分析 + 解读 */}
              <div className="grid grid-cols-2 gap-6">
                {/* 五行旺衰 */}
                <div className="card">
                  <h2 className="font-semibold text-gray-800 mb-4 text-lg">五行旺衰</h2>
                  <WuXingChart analysis={wxAnalysis} />
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className={`rounded-xl p-4 border ${WX_COLORS[wxAnalysis.strongest] || ''}`}>
                      <div className="text-xs opacity-60 mb-2">最旺五行</div>
                      <div className="font-bold text-lg">{wxAnalysis.strongest}</div>
                    </div>
                    <div className={`rounded-xl p-4 border ${WX_COLORS[wxAnalysis.weakest] || ''}`}>
                      <div className="text-xs opacity-60 mb-2">最弱五行</div>
                      <div className="font-bold text-lg">{wxAnalysis.weakest}</div>
                    </div>
                    <div className="col-span-2 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div className="text-xs text-gray-500 mb-2">喜用神</div>
                      <div className="text-emerald-700 font-medium text-sm">{wxAnalysis.xiYongShen}</div>
                    </div>
                    <div className="col-span-2 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="text-xs text-gray-500 mb-2">忌神</div>
                      <div className="text-red-600 font-medium text-sm">{wxAnalysis.jiShen}</div>
                    </div>
                  </div>
                </div>

                {/* 解读区 */}
                <div className="card">
                  <div className="tab-group mb-4">
                    {([['basic', '基础解读'], ['deep', '深度解读']] as [Tab, string][]).map(([t, label]) => (
                      <button key={t} onClick={() => setTab(t)}
                        className={`tab-item ${tab === t ? 'active' : ''}`}
                      >{label}</button>
                    ))}
                  </div>

                  {tab === 'basic' && (
                    <div className="space-y-4 fade-in overflow-y-auto max-h-72">
                      <div className="p-4 bg-orange-50 rounded-xl">
                        <div className="text-base text-orange-600 font-medium mb-2">性格特征</div>
                        <p className="text-sm text-gray-700 leading-relaxed">{getPersonalityReading(bazi, wxAnalysis, input.gender)}</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-xl">
                        <div className="text-base text-blue-600 font-medium mb-2">近期运势</div>
                        <p className="text-sm text-gray-700 leading-relaxed">{getRecentFortune(bazi, wxAnalysis)}</p>
                      </div>
                      <div className="p-4 bg-emerald-50 rounded-xl">
                        <div className="text-base text-emerald-600 font-medium mb-2">运势建议</div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          根据五行旺衰，建议多穿<strong>{wxAnalysis.xiYongShen.split('（')[0]}</strong>对应颜色
                          （{wxAnalysis.xiYongShen.includes('金') ? '白、金' : wxAnalysis.xiYongShen.includes('木') ? '绿、青' : wxAnalysis.xiYongShen.includes('火') ? '红、紫' : wxAnalysis.xiYongShen.includes('水') ? '黑、蓝' : '黄、棕'}），
                          有助于调和五行能量，提升整体运势。
                        </p>
                      </div>
                    </div>
                  )}

                  {tab === 'deep' && (
                    <div className="space-y-4 fade-in overflow-y-auto max-h-72">
                      <div className="p-4 bg-orange-50 rounded-xl">
                        <div className="text-base text-orange-600 font-medium mb-2">格局分析</div>
                        <p className="text-sm text-gray-700">{analyzeGe(bazi, wxAnalysis)}</p>
                      </div>
                      <div>
                        <div className="text-base text-gray-600 font-medium mb-2">大运流年</div>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {daYun.map((dy, i) => (
                            <div key={i} className="flex-shrink-0 w-16 bg-orange-50 rounded-xl p-2 text-center border border-orange-100">
                              <div className="text-xs text-gray-400">{dy.start}岁</div>
                              <div className="font-bold text-orange-600 text-base serif">{dy.gan}{dy.zhi}</div>
                              <div className="text-xs text-orange-400">{dy.tenGod}</div>
                              <div className="text-xs text-gray-400">{dy.startYear}年</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-base text-gray-600 font-medium mb-2">神煞分析</div>
                        <div className="space-y-2">
                          {getShenSha(bazi).map((ss, i) => (
                            <div key={i} className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
                              <div className="text-xs font-medium text-purple-600 mb-2">{ss.name}</div>
                              <div className="text-xs text-gray-600">{ss.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 保存按钮 */}
              <div className="flex justify-end gap-4">
                <button onClick={handleSave} disabled={saved}
                  className={`px-6 py-2 rounded-xl font-medium text-sm transition ${
                    saved ? 'bg-emerald-500 text-white cursor-default' : 'text-white hover:opacity-90'
                  }`}
                  style={!saved ? { background: 'linear-gradient(135deg, #f97316, #ea6c0a)' } : {}}
                >{saved ? '✓ 已保存' : '保存记录'}</button>
              </div>
              <p className="text-center text-xs text-gray-400">以上内容基于周易五行理论，仅供参考</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
