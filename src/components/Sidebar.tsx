import { useNavigate, useLocation } from 'react-router-dom';

const NAV = [
  { path: '/', label: '首页' },
  { path: '/bazi', label: '八字排盘' },
  { path: '/divination', label: '梅花起卦' },
  { path: '/huangli', label: '黄历查看' },
  { path: '/scene', label: '场景择吉' },
  { path: '/profile', label: '个人中心' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col min-h-screen bg-white border-r border-gray-100" style={{ boxShadow: '2px 0 16px rgba(0,0,0,0.04)' }}>
      {/* Logo */}
      <div className="px-6 py-8 border-b border-gray-50">
        <div>
          <div className="font-bold text-lg serif tracking-wider" style={{ color: '#f97316' }}>八字命理</div>
          <div className="text-gray-400 text-xs mt-1.5">黄历择吉 · 传统文化</div>
        </div>
      </div>

      {/* 导航 */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(item => {
          const isActive = item.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                isActive
                  ? 'text-orange-500 font-semibold'
                  : 'text-gray-500 hover:text-orange-500 hover:bg-orange-50'
              }`}
              style={isActive ? { background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)' } : {}}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all ${isActive ? 'bg-orange-400 scale-125' : 'bg-transparent'}`} />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1 h-4 rounded-full bg-orange-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* 底部免责 */}
      <div className="px-4 py-4 border-t border-gray-50">
        <p className="text-gray-400 text-xs leading-relaxed">
          所有内容仅供参考<br/>不构成迷信引导
        </p>
        <p className="text-gray-300 text-xs mt-2">v1.0.0</p>
      </div>
    </aside>
  );
}
