import { useState } from 'react';
import { getSceneJiDates, SceneJiDate } from '../utils/lunar';

const SCENES = [
  { name: '婚嫁', desc: '嫁娶、订婚、领证' },
  { name: '开工', desc: '动土、开业、开工' },
  { name: '搬家', desc: '入宅、搬迁、安床' },
  { name: '祭祀', desc: '祭祖、祈福、开光' },
  { name: '出行', desc: '旅游、出差、远行' },
  { name: '签约', desc: '合同、立券、交易' },
  { name: '求职', desc: '面试、求职、上任' },
  { name: '开业', desc: '开业、开店、揭牌' },
];

export default function ScenePage() {
  const today = new Date();
  const [selectedScene, setSelectedScene] = useState('');
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [results, setResults] = useState<SceneJiDate[]>([]);
  const [queried, setQueried] = useState(false);

  function query() {
    if (!selectedScene) { alert('请选择场景'); return; }
    setResults(getSceneJiDates(selectedScene, year, month));
    setQueried(true);
  }

  return (
    <div className="p-8 fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 serif">场景化择吉</h1>
        <p className="text-gray-400 text-sm mt-2">选择场景与月份，智能筛选近期吉日</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 左侧查询设置 */}
        <div className="space-y-6">
          {/* 场景选择 */}
          <div className="card">
            <h2 className="font-semibold text-gray-800 mb-4">选择场景</h2>
            <div className="grid grid-cols-2 gap-2">
              {SCENES.map(s => (
                <button key={s.name} onClick={() => setSelectedScene(s.name)}
                  className={`flex items-center gap-4 p-4 rounded-xl border text-left transition ${
                    selectedScene === s.name
                      ? 'text-white border-orange-500'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
                  }`}
                  style={selectedScene === s.name ? { background: 'linear-gradient(135deg, #f97316, #ea6c0a)' } : {}}
                >
                  <div>
                    <div className="text-sm font-medium">{s.name}</div>
                    <div className={`text-xs ${selectedScene === s.name ? 'text-orange-100' : 'text-gray-400'}`}>{s.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 月份选择 */}
          <div className="card">
            <h2 className="font-semibold text-gray-800 mb-4">查询月份</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 block mb-2">年份</label>
                <select value={year} onChange={e => setYear(+e.target.value)} className="select-field">
                  {[today.getFullYear(), today.getFullYear() + 1].map(y => (
                    <option key={y} value={y}>{y}年</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-2">月份</label>
                <select value={month} onChange={e => setMonth(+e.target.value)} className="select-field">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>{m}月</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button onClick={query}
            className="w-full text-white rounded-xl py-4 font-semibold text-base transition shadow-md"
            style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea6c0a 100%)' }}
          >
            筛选吉日
          </button>
          <p className="text-center text-xs text-gray-400">以上内容基于传统黄历规则，仅供参考</p>
        </div>

        {/* 右侧结果 */}
        <div className="col-span-2">
          {!queried ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <p className="text-gray-400 text-lg">请选择场景和月份后查询</p>
              <p className="text-gray-300 text-sm mt-2">支持8大场景 · 智能吉利度评分</p>
            </div>
          ) : (
            <div className="fade-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800 text-lg">
                  {results.length > 0
                    ? `共找到 ${results.length} 个适宜「${selectedScene}」的吉日`
                    : '本月暂无明显吉日，建议换月查询'}
                </h2>
                <span className="text-sm text-gray-400">{year}年{month}月</span>
              </div>
              <div className="space-y-4">
                {results.map((r, i) => (
                  <div key={r.date} className="card hover:shadow-md transition">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-white flex-shrink-0 font-bold ${
                        i === 0 ? '' : ''
                      }`}
                        style={{
                          background: i === 0
                            ? 'linear-gradient(135deg, #ef4444, #f97316)'
                            : i === 1
                            ? 'linear-gradient(135deg, #f97316, #fb923c)'
                            : 'linear-gradient(135deg, #fb923c, #fdba74)',
                        }}
                      >
                        <span className="text-xs">{i === 0 ? '首选' : `第${i+1}`}</span>
                        <span className="text-lg">{r.solar.day}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-4 flex-wrap mb-2">
                          <span className="text-lg font-bold text-gray-800">{r.date}</span>
                          <span className="text-sm text-gray-400">
                            农历{r.lunar.monthName}{r.lunar.dayName} · {r.dayGanZhi}
                          </span>
                          <span className="badge-brand font-medium">
                            吉利度 {r.score}分
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">{r.reason}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
