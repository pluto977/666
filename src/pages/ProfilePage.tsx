import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userStore, baziRecordStore, divinationStore, huangLiFavStore, settingsStore, AppSettings } from '../store/appStore';
import { GUA_SYMBOL } from '../utils/plumDivination';

type Section = 'main' | 'records' | 'divinations' | 'favorites' | 'settings' | 'help' | 'login';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>('main');
  const [user, setUser] = useState(userStore.get());
  const [phone, setPhone] = useState('');
  const [nickname, setNickname] = useState('');
  const [settings, setSettings] = useState<AppSettings>(settingsStore.get());
  const [baziRecords, setBaziRecords] = useState(baziRecordStore.getAll());
  const [divRecords, setDivRecords] = useState(divinationStore.getAll());
  const [favs, setFavs] = useState(huangLiFavStore.getAll());

  useEffect(() => {
    setBaziRecords(baziRecordStore.getAll());
    setDivRecords(divinationStore.getAll());
    setFavs(huangLiFavStore.getAll());
  }, [section]);

  function handleLogin() {
    if (!phone.match(/^1\d{10}$/)) { alert('请输入正确的手机号'); return; }
    const u = userStore.login(phone, nickname || undefined);
    setUser(u); setSection('main');
  }

  function handleLogout() {
    if (confirm('确认退出登录？')) { userStore.clear(); setUser(null); }
  }

  function updateSetting(key: keyof AppSettings, value: boolean | string) {
    const ns = { ...settings, [key]: value } as AppSettings;
    setSettings(ns); settingsStore.set(ns);
  }

  return (
    <div className="p-8 fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 serif">个人中心</h1>
        <p className="text-gray-400 text-sm mt-2">账号管理 · 历史记录 · 偏好设置</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* 左侧 */}
        <div className="space-y-6">
          {/* 用户信息卡 */}
          <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea6c0a 100%)' }}>
            {user ? (
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-white/30 flex items-center justify-center text-white text-2xl font-bold">
                    {user.nickname[0]}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-base">{user.nickname}</div>
                    <div className="text-orange-100 text-xs">{user.phone || 'ID: ' + user.id.slice(-6)}</div>
                  </div>
                </div>
                <button onClick={handleLogout} className="text-orange-100 text-xs hover:text-white transition">
                  退出登录
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white text-base font-semibold">未</div>
                  <div>
                    <div className="text-white font-semibold">未登录</div>
                    <div className="text-orange-100 text-xs">登录后可保存记录</div>
                  </div>
                </div>
                <button onClick={() => setSection('login')}
                  className="w-full py-2 bg-white/20 text-white rounded-xl text-sm font-medium hover:bg-white/30 transition"
                >登录 / 注册</button>
              </div>
            )}
          </div>

          {/* 菜单 */}
          <div className="card space-y-1">
            {[
              { label: '八字记录', section: 'records' as Section, count: baziRecords.length },
              { label: '起卦记录', section: 'divinations' as Section, count: divRecords.length },
              { label: '黄历收藏', section: 'favorites' as Section, count: favs.length },
              { label: '偏好设置', section: 'settings' as Section, count: null },
              { label: '帮助反馈', section: 'help' as Section, count: null },
            ].map(item => (
              <button key={item.label} onClick={() => setSection(item.section)}
                className={`w-full flex items-center gap-4 py-3 px-2 rounded-xl transition text-left ${
                  section === item.section ? 'bg-orange-50 text-orange-600' : 'hover:bg-orange-50/50 text-gray-600'
                }`}
              >
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {item.count !== null && <span className="text-xs text-gray-400">{item.count}条</span>}
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-300" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </button>
            ))}
          </div>

          {/* 免责声明 */}
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
            <p className="text-xs text-orange-600 leading-relaxed">
              <strong>免责声明</strong>：本产品所有内容均基于中国传统文化理论，仅供参考与娱乐，不构成任何迷信引导，不能替代个人决策。
            </p>
          </div>
        </div>

        {/* 右侧内容区 */}
        <div className="col-span-3">
          {/* 登录 */}
          {section === 'login' && (
            <div className="card max-w-md fade-in">
              <h2 className="font-semibold text-gray-800 mb-6 text-lg">手机号登录</h2>
              <div className="space-y-4">
                <input type="tel" placeholder="手机号（1开头11位）" value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-4 text-sm focus:border-orange-400 outline-none"
                />
                <input type="text" placeholder="昵称（选填）" value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-4 text-sm focus:border-orange-400 outline-none"
                />
                <button onClick={handleLogin}
                  className="w-full text-white rounded-xl py-4 font-semibold transition"
                  style={{ background: 'linear-gradient(135deg, #f97316, #ea6c0a)' }}
                >
                  登录 / 注册
                </button>
                <button onClick={() => setSection('main')} className="w-full text-gray-400 text-sm hover:text-orange-500">
                  取消
                </button>
              </div>
              <p className="text-center text-xs text-gray-400 mt-4">登录即表示同意用户协议与隐私政策</p>
            </div>
          )}

          {/* 八字记录 */}
          {section === 'records' && (
            <div className="fade-in">
              <h2 className="font-semibold text-gray-800 mb-4 text-lg">八字排盘记录</h2>
              {baziRecords.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <p className="text-lg">暂无排盘记录</p>
                  <button onClick={() => navigate('/bazi')} className="mt-4 text-orange-500 hover:text-orange-600 text-sm">去排盘 →</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {baziRecords.map(r => (
                    <div key={r.id} className="card hover:shadow-md transition">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-800 mb-2">
                            {r.input.year}/{r.input.month}/{r.input.day} {r.input.hour}时 · {r.input.gender} · {r.input.city}
                          </div>
                          <div className="flex gap-2">
                            {[r.bazi.year, r.bazi.month, r.bazi.day, r.bazi.hour].map((p, i) => (
                              <span key={i} className="px-2 py-1 bg-orange-50 rounded-lg text-orange-600 font-bold serif text-base">{p.gan}{p.zhi}</span>
                            ))}
                          </div>
                          <div className="text-xs text-gray-400 mt-2">{new Date(r.createdAt).toLocaleString('zh-CN')}</div>
                        </div>
                        <button onClick={() => { baziRecordStore.remove(r.id); setBaziRecords(baziRecordStore.getAll()); }}
                          className="text-xs text-red-400 hover:text-red-600 transition px-4 py-2 rounded-lg hover:bg-red-50"
                        >删除</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 起卦记录 */}
          {section === 'divinations' && (
            <div className="fade-in">
              <h2 className="font-semibold text-gray-800 mb-4 text-lg">梅花起卦记录</h2>
              {divRecords.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <p className="text-lg">暂无起卦记录</p>
                  <button onClick={() => navigate('/divination')} className="mt-4 text-orange-500 hover:text-orange-600 text-sm">去起卦 →</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {divRecords.map((r, idx) => (
                    <div key={idx} className="card hover:shadow-md transition">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{GUA_SYMBOL[r.shangGua]}{GUA_SYMBOL[r.xiaGua]}</div>
                        <div>
                          <div className="font-semibold text-gray-800 mb-2">
                            {r.guaName}
                            {r.scene && <span className="text-xs bg-orange-50 text-orange-500 px-2 py-1 rounded-full ml-2">{r.scene}</span>}
                          </div>
                          <div className="text-sm text-gray-400">第{r.dongYao}爻动 → 变卦《{r.bianGuaName}》</div>
                          <div className="text-xs text-gray-400 mt-2">{new Date(r.createTime).toLocaleString('zh-CN')}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 黄历收藏 */}
          {section === 'favorites' && (
            <div className="fade-in">
              <h2 className="font-semibold text-gray-800 mb-4 text-lg">黄历收藏</h2>
              {favs.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <p className="text-lg">暂无收藏</p>
                  <button onClick={() => navigate('/huangli')} className="mt-4 text-orange-500 hover:text-orange-600 text-sm">去收藏 →</button>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {favs.map(f => (
                    <div key={f.id} className="card flex items-center justify-between hover:shadow-md transition">
                      <div>
                        <div className="font-medium text-gray-800">{f.date}</div>
                        <div className="text-xs text-gray-400">{new Date(f.savedAt).toLocaleDateString('zh-CN')}</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => navigate(`/huangli?date=${f.date}`)} className="text-xs text-orange-500 hover:text-orange-600 px-2 py-1 rounded hover:bg-orange-50">查看</button>
                        <button onClick={() => { huangLiFavStore.remove(f.date); setFavs(huangLiFavStore.getAll()); }} className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50">删除</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 设置 */}
          {section === 'settings' && (
            <div className="fade-in">
              <h2 className="font-semibold text-gray-800 mb-4 text-lg">偏好设置</h2>
              <div className="card max-w-lg space-y-6">
                {[
                  { key: 'useTrueSolarTime' as const, label: '真太阳时校正', desc: '排盘时根据出生地经度校正时间' },
                  { key: 'useEarlyZi' as const, label: '早子时排盘', desc: '子时（23:00-00:59）按当日日期排盘' },
                  { key: 'pushNotification' as const, label: '推送提醒', desc: '开启每日黄历推送提醒' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <div className="text-base text-gray-700">{item.label}</div>
                      <div className="text-sm text-gray-400">{item.desc}</div>
                    </div>
                    <div
                      onClick={() => updateSetting(item.key, !settings[item.key])}
                      className={`toggle ${settings[item.key] ? 'bg-orange-500' : 'bg-gray-200'}`}
                    >
                      <div className={`toggle-dot ${settings[item.key] ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                  </div>
                ))}
                <div className="border-t border-gray-50 pt-4">
                  <div className="text-base text-gray-700 mb-2">字体大小</div>
                  <div className="flex gap-2">
                    {(['small', 'medium', 'large'] as const).map(s => (
                      <button key={s} onClick={() => updateSetting('fontSize', s)}
                        className={`flex-1 py-2 rounded-xl text-sm border transition ${
                          settings.fontSize === s ? 'text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                        }`}
                        style={settings.fontSize === s ? { background: 'linear-gradient(135deg, #f97316, #ea6c0a)' } : {}}
                      >{s === 'small' ? '小' : s === 'medium' ? '中' : '大'}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 帮助 */}
          {section === 'help' && (
            <div className="fade-in">
              <h2 className="font-semibold text-gray-800 mb-4 text-lg">帮助与反馈</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="font-semibold text-gray-800 mb-4">常见问题</h3>
                  <div className="space-y-4">
                    {[
                      { q: '八字排盘如何使用？', a: '在八字模块输入出生年月日时、性别和出生地，点击「排盘解读」即可获得八字分析。' },
                      { q: '真太阳时是什么？', a: '根据出生地经度校正后的实际太阳时间，不同地区与北京时间存在偏差，专业命理师通常使用真太阳时排盘。' },
                      { q: '梅花易数如何起卦？', a: '支持时间起卦（自动取当前时间）、数字起卦（输入两个数字）、手动起卦三种方式。' },
                      { q: '黄历数据准确吗？', a: '黄历数据基于传统历法规则计算，仅供日常参考，不代表绝对吉凶，请理性对待。' },
                    ].map((item, i) => (
                      <div key={i} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                        <div className="text-sm font-medium text-orange-600 mb-2">Q: {item.q}</div>
                        <div className="text-sm text-gray-600">A: {item.a}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card">
                  <h3 className="font-semibold text-gray-800 mb-4">用户反馈</h3>
                  <textarea
                    placeholder="请输入您的意见或建议..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm h-40 resize-none focus:border-orange-400 outline-none"
                  />
                  <button
                    className="mt-4 w-full text-white rounded-xl py-2 text-sm font-medium transition"
                    style={{ background: 'linear-gradient(135deg, #f97316, #ea6c0a)' }}
                  >
                    提交反馈
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 主页面 */}
          {section === 'main' && (
            <div className="fade-in">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: '八字记录', count: baziRecords.length, section: 'records' as Section },
                  { label: '起卦记录', count: divRecords.length, section: 'divinations' as Section },
                  { label: '黄历收藏', count: favs.length, section: 'favorites' as Section },
                ].map(item => (
                  <button key={item.label} onClick={() => setSection(item.section)}
                    className="card hover:shadow-md transition text-center cursor-pointer active:scale-[0.98]"
                  >
                    <div className="text-2xl font-bold text-orange-500">{item.count}</div>
                    <div className="text-sm text-gray-400 mt-1">{item.label}</div>
                  </button>
                ))}
              </div>
              <div className="card">
                <p className="text-sm text-gray-500 leading-relaxed">
                  点击左侧菜单查看详细记录，或点击上方统计卡片快速跳转。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
