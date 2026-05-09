import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHuangLi } from '../utils/lunar';
import { huangLiFavStore } from '../store/appStore';

export default function HuangLiPage() {
  const navigate = useNavigate();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const dateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2,'0')}-${String(selectedDate.getDate()).padStart(2,'0')}`;
  const hl = useMemo(() => getHuangLi(selectedDate.getFullYear(), selectedDate.getMonth() + 1, selectedDate.getDate()), [selectedDate]);
  const [localFav, setLocalFav] = useState(() => huangLiFavStore.has(dateKey));
  const isToday = dateKey === `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  function toggleFav() { setLocalFav(huangLiFavStore.toggle(dateKey)); }
  function changeDate(offset: number) {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offset);
    setSelectedDate(d);
    setShowDetail(false);
  }
  function goToday() { setSelectedDate(new Date()); setShowDetail(false); }

  const weekDays = ['日','一','二','三','四','五','六'];

  return (
    <div className="p-8 fade-in">
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 serif">黄历查看</h1>
          <p className="text-gray-400 text-sm mt-2">宜忌冲煞 · 周易择吉 · 传统历法</p>
        </div>
        <button onClick={() => navigate('/scene')} className="btn-primary text-sm">
          场景化择吉
        </button>
      </div>

      {/* 日期切换栏 */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <button onClick={() => changeDate(-1)} className="p-2 rounded-xl hover:bg-orange-50 transition">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-orange-400" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="text-center hover:bg-orange-50 px-4 py-2 rounded-xl transition"
            >
              <div className="text-2xl font-bold text-gray-800 serif">
                {selectedDate.getFullYear()}年{selectedDate.getMonth() + 1}月{selectedDate.getDate()}日
              </div>
              <div className="text-gray-400 text-sm">
                周{weekDays[selectedDate.getDay()]} · 农历{hl.lunar.monthName}{hl.lunar.dayName} · {hl.lunar.yearGan}{hl.lunar.yearZhi}年
              </div>
            </button>
            {!isToday && (
              <button onClick={goToday} className="text-sm text-orange-500 hover:text-orange-600 underline">
                回到今天
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleFav} className="p-2 rounded-xl hover:bg-orange-50 transition" title={localFav ? '取消收藏' : '收藏'}>
              <svg viewBox="0 0 24 24" className={`w-6 h-6 ${localFav ? 'text-red-400' : 'text-gray-300'}`} fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
            <button onClick={() => changeDate(1)} className="p-2 rounded-xl hover:bg-orange-50 transition">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-orange-400" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </button>
          </div>
        </div>
        {showDatePicker && (
          <div className="mt-4 pt-4 border-t border-gray-50 flex justify-center">
            <input type="date" value={dateKey}
              onChange={e => { setSelectedDate(new Date(e.target.value + 'T00:00:00')); setShowDatePicker(false); setShowDetail(false); }}
              className="border border-orange-200 rounded-xl px-4 py-2 text-sm focus:border-orange-400 outline-none"
            />
          </div>
        )}
      </div>

      {/* 主内容区 */}
      <div className="grid grid-cols-3 gap-6">
        {/* 左列 */}
        <div className="space-y-6">
          {/* 干支信息 */}
          <div className="card">
            <h2 className="font-semibold text-gray-800 mb-4 text-lg">
              干支信息
              {hl.jieqi && <span className="ml-3 px-2 py-1 bg-orange-50 text-orange-500 rounded-full text-xs border border-orange-100">{hl.jieqi}</span>}
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '日柱', value: hl.lunar.dayGan + hl.lunar.dayZhi },
                { label: '值神', value: hl.zhiShen },
                { label: '星宿', value: hl.xingXiu },
              ].map(item => (
                <div key={item.label} className="text-center p-4 bg-orange-50 rounded-xl">
                  <div className="text-xs text-gray-400 mb-2">{item.label}</div>
                  <div className="font-bold text-orange-600 text-lg serif">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-4 text-sm text-gray-400 pt-4 border-t border-gray-50">
              <span>月相：{hl.yueShen}</span>
              <span className="ml-auto">{hl.lunar.zodiac}年</span>
            </div>
          </div>

          {/* 冲煞 */}
          <div className="card">
            <h2 className="font-semibold text-gray-800 mb-4 text-lg">冲煞信息</h2>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                <div className="text-xs text-gray-400 mb-2">冲</div>
                <div className="text-base font-semibold text-red-600">{hl.chong}</div>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                <div className="text-xs text-gray-400 mb-2">煞方</div>
                <div className="text-base font-semibold text-orange-600">{hl.sha}</div>
              </div>
            </div>
          </div>

          {/* 吉神凶煞 */}
          <div className="card">
            <h2 className="font-semibold text-gray-800 mb-4 text-lg">吉神凶煞</h2>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-400 mb-2">吉神</div>
                <div className="flex flex-wrap gap-2">
                  {hl.jiShen.map(j => <span key={j} className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs">{j}</span>)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-2">凶煞</div>
                <div className="flex flex-wrap gap-2">
                  {hl.xiongSha.map(x => <span key={x} className="px-2 py-1 bg-red-50 text-red-600 border border-red-200 rounded-full text-xs">{x}</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右列 */}
        <div className="col-span-2 space-y-6">
          {/* 宜忌 */}
          <div className="card">
            <h2 className="font-semibold text-gray-800 mb-4 text-lg">今日宜忌</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">宜</span>
                  <span className="text-base font-medium text-emerald-700">适合今日进行</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hl.yi.map(y => (
                    <button key={y} onClick={() => setShowDetail(true)} className="tag-yi hover:bg-emerald-100 transition">
                      {y}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">忌</span>
                  <span className="text-base font-medium text-red-600">今日不宜进行</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hl.ji.map(j => (
                    <button key={j} onClick={() => setShowDetail(true)} className="tag-ji hover:bg-red-100 transition">
                      {j}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 周易择吉解读 */}
          {showDetail ? (
            <div className="card border border-orange-100 fade-in">
              <h2 className="font-semibold text-gray-800 mb-4 text-lg">周易择吉解读</h2>
              <p className="text-gray-600 leading-relaxed text-base">{hl.zhouYiJiedu}</p>
            </div>
          ) : (
            <button
              onClick={() => setShowDetail(true)}
              className="w-full py-4 border-2 border-dashed border-orange-200 text-orange-400 rounded-2xl text-base font-medium hover:bg-orange-50 transition"
            >
              点击查看周易择吉解读
            </button>
          )}

          {/* 场景化入口 */}
          <button
            onClick={() => navigate('/scene')}
            className="w-full text-white rounded-2xl py-6 font-semibold text-lg transition shadow-md"
            style={{ background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)' }}
          >
            进入场景化择吉查询 →
          </button>

          <p className="text-center text-xs text-gray-400">黄历数据参考传统历法规则，仅供参考，不构成迷信引导</p>
        </div>
      </div>
    </div>
  );
}
