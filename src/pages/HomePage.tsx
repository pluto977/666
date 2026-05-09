import { useNavigate } from 'react-router-dom';
import { getHuangLi } from '../utils/lunar';
import { useMemo } from 'react';

export default function HomePage() {
  const navigate = useNavigate();
  const today = new Date();
  const hl = useMemo(() => getHuangLi(today.getFullYear(), today.getMonth() + 1, today.getDate()), []);

  const weekDays = ['日','一','二','三','四','五','六'];

  return (
    <div className="p-8 fade-in">
      {/* 顶部欢迎区 */}
      <div className="rounded-3xl p-8 text-white mb-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fdba74 100%)' }}>
        {/* 装饰圆 */}
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-20" style={{ background: 'rgba(255,255,255,0.4)' }} />
        <div className="absolute right-20 bottom-0 w-24 h-24 rounded-full opacity-10" style={{ background: 'rgba(255,255,255,0.6)' }} />
        <div className="relative z-10">
          <div className="text-orange-100 text-sm mb-2">
            {today.getFullYear()}年{today.getMonth()+1}月{today.getDate()}日 · 周{weekDays[today.getDay()]}
          </div>
          <div className="text-3xl font-bold serif mb-1.5">
            {hl.lunar.yearGan}{hl.lunar.yearZhi}年
          </div>
          <div className="text-orange-100">
            农历{hl.lunar.monthName}{hl.lunar.dayName}
            {hl.jieqi && <span className="ml-4 px-3 py-1 bg-white/20 rounded-full text-sm">{hl.jieqi}</span>}
          </div>
          {/* 干支 */}
          <div className="flex gap-3 mt-6">
            {[
              { label: '年柱', gz: hl.lunar.yearGan + hl.lunar.yearZhi },
              { label: '月柱', gz: hl.lunar.monthGan + hl.lunar.monthZhi },
              { label: '日柱', gz: hl.lunar.dayGan + hl.lunar.dayZhi },
            ].map(item => (
              <div key={item.label} className="bg-white/20 backdrop-blur rounded-xl px-4 py-2 text-center min-w-[70px]">
                <div className="text-orange-100 text-xs">{item.label}</div>
                <div className="text-white font-bold text-xl serif">{item.gz}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 两大核心功能入口 */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <button
          onClick={() => navigate('/bazi')}
          className="group rounded-2xl p-8 text-left transition-all shadow-md hover:shadow-xl active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea6c0a 100%)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'linear-gradient(135deg, #ea6c0a 0%, #c2540a 100%)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'linear-gradient(135deg, #f97316 0%, #ea6c0a 100%)')}
        >
          <div className="text-orange-100 text-sm mb-2">周易命理</div>
          <div className="text-white font-bold text-2xl serif mb-2">八字解读</div>
          <div className="text-orange-100 text-sm mb-4">排盘 · 五行 · 大运 · 神煞</div>
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-white text-sm group-hover:bg-white/30 transition">
            立即排盘 →
          </div>
        </button>

        <button
          onClick={() => navigate('/huangli')}
          className="group rounded-2xl p-8 text-left transition-all shadow-md hover:shadow-xl active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626 0%, #ea6c0a 100%)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)')}
        >
          <div className="text-orange-100 text-sm mb-2">择吉参考</div>
          <div className="text-white font-bold text-2xl serif mb-2">黄历查看</div>
          <div className="text-orange-100 text-sm mb-4">宜忌 · 冲煞 · 择吉 · 解读</div>
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-white text-sm group-hover:bg-white/30 transition">
            查看今日 →
          </div>
        </button>
      </div>

      {/* 下方区域 */}
      <div className="grid grid-cols-3 gap-6">
        {/* 今日黄历摘要 */}
        <div className="col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 text-lg">
              今日黄历摘要
            </h2>
            <button onClick={() => navigate('/huangli')} className="text-sm text-orange-500 hover:text-orange-600">
              查看详情 →
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">宜</span>
                <span className="text-sm text-emerald-700 font-medium">今日适宜</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {hl.yi.map(y => <span key={y} className="tag-yi">{y}</span>)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">忌</span>
                <span className="text-sm text-red-600 font-medium">今日不宜</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {hl.ji.map(j => <span key={j} className="tag-ji">{j}</span>)}
              </div>
            </div>
          </div>
          <div className="flex gap-6 text-sm text-gray-400 pt-4 border-t border-gray-50">
            <span>冲：{hl.chong}</span>
            <span>值神：{hl.zhiShen}</span>
            <span>星宿：{hl.xingXiu}</span>
            <span>月相：{hl.yueShen}</span>
          </div>
        </div>

        {/* 快捷功能 */}
        <div className="card">
          <h2 className="font-semibold text-gray-800 mb-4 text-lg">快捷功能</h2>
          <div className="space-y-2">
            {[
              { label: '梅花起卦', path: '/divination', desc: '时间/数字起卦' },
              { label: '场景择吉', path: '/scene', desc: '筛选吉日' },
              { label: '我的记录', path: '/profile', desc: '历史记录' },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-orange-50 transition text-left"
              >
                <div>
                  <div className="text-base font-medium text-gray-700">{item.label}</div>
                  <div className="text-xs text-gray-400">{item.desc}</div>
                </div>
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-orange-300 ml-auto" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* 今日运势 */}
        <div className="col-span-3 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 text-lg">
              今日周易运势参考
            </h2>
            <span className="badge-brand">
              下一节气：{hl.nextJieqi.name}（约{hl.nextJieqi.daysLeft}天）
            </span>
          </div>
          <p className="text-gray-600 leading-relaxed">{hl.zhouYiJiedu}</p>
          <p className="text-xs text-gray-300 mt-4 text-right">以上内容仅供参考，不构成迷信引导</p>
        </div>
      </div>
    </div>
  );
}
