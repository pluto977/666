import { useState } from 'react';
import {
  timeQiGua, numberQiGua, manualQiGua, getBianGua, getTiYong,
  analyzeJiXiong, getGuaName, getGuaCi, GUA_SYMBOL, GUA_WU_XING,
  DivinationResult,
} from '../utils/plumDivination';
import { divinationStore } from '../store/appStore';

type Method = 'time' | 'number' | 'manual';

export default function DivinationPage() {
  const [method, setMethod] = useState<Method>('time');
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [scene, setScene] = useState('');
  const [result, setResult] = useState<DivinationResult | null>(null);
  const [saved, setSaved] = useState(false);

  const SCENES = ['求职', '婚恋', '投资', '出行', '健康', '学业', '事业', '家宅'];

  function doQiGua() {
    let shangGua: string, xiaGua: string, dongYao: number;
    if (method === 'time') {
      const r = timeQiGua(new Date());
      shangGua = r.shangGua; xiaGua = r.xiaGua; dongYao = r.dongYao;
    } else if (method === 'number') {
      if (!num1 || !num2) { alert('请输入两个数字'); return; }
      const r = numberQiGua(+num1, +num2, gender);
      shangGua = r.shangGua; xiaGua = r.xiaGua; dongYao = r.dongYao;
    } else {
      const throws = Array.from({ length: 6 }, () =>
        [Math.random() > 0.5 ? 3 : 2, Math.random() > 0.5 ? 3 : 2, Math.random() > 0.5 ? 3 : 2]
      );
      const r = manualQiGua(throws);
      shangGua = r.shangGua; xiaGua = r.xiaGua; dongYao = r.dongYao;
    }
    const bianGua = getBianGua(shangGua, xiaGua, dongYao);
    const guaName = getGuaName(shangGua, xiaGua);
    const guaCi = getGuaCi(guaName);
    const { tiGua, yongGua } = getTiYong(shangGua, xiaGua, dongYao);
    const analysis = analyzeJiXiong(shangGua, xiaGua, dongYao, bianGua.shangGua, bianGua.xiaGua, scene);
    const bianGuaName = getGuaName(bianGua.shangGua, bianGua.xiaGua);
    setResult({ shangGua, xiaGua, guaName, guaCi, dongYao, bianShang: bianGua.shangGua, bianXia: bianGua.xiaGua, bianGuaName, tiGua, yongGua, analysis, createTime: new Date().toISOString(), scene, method });
    setSaved(false);
  }

  function handleSave() {
    if (result) { divinationStore.add(result); setSaved(true); }
  }

  return (
    <div className="p-8 fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 serif">梅花易数起卦</h1>
        <p className="text-gray-400 text-sm mt-2">无事不占，不诚不占 · 基于邵雍梅花易数原理</p>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* 左侧起卦设置 */}
        <div className="col-span-2 space-y-6">
          <div className="card">
            <h2 className="font-semibold text-gray-800 mb-4">起卦方式</h2>
            <div className="flex gap-2 mb-4">
              {([['time', '时间起卦'], ['number', '数字起卦'], ['manual', '手动起卦']] as [Method, string][]).map(([m, label]) => (
                <button key={m} onClick={() => setMethod(m)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${
                    method === m ? 'text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                  }`}
                  style={method === m ? { background: 'linear-gradient(135deg, #f97316, #ea6c0a)' } : {}}
                >{label}</button>
              ))}
            </div>

            {method === 'time' && (
              <div className="p-4 bg-orange-50 rounded-xl fade-in">
                <p className="text-sm text-orange-600">以当前时间自动起卦，取年月日时数字，按梅花易数法推算卦象。</p>
                <p className="text-xs text-gray-400 mt-2">当前时间：{new Date().toLocaleString('zh-CN')}</p>
              </div>
            )}
            {method === 'number' && (
              <div className="space-y-3 fade-in">
                <p className="text-sm text-gray-500">输入两个数字（上卦数、下卦数）</p>
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="上卦数" value={num1}
                    onChange={e => setNum1(e.target.value)}
                    className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-center focus:border-orange-400 outline-none"
                  />
                  <input type="number" placeholder="下卦数" value={num2}
                    onChange={e => setNum2(e.target.value)}
                    className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-center focus:border-orange-400 outline-none"
                  />
                </div>
                {/* 性别选择 */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">起卦人性别</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setGender('male')}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${
                        gender === 'male' ? 'text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                      }`}
                      style={gender === 'male' ? { background: 'linear-gradient(135deg, #f97316, #ea6c0a)' } : {}}
                    >
                      男
                    </button>
                    <button
                      onClick={() => setGender('female')}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${
                        gender === 'female' ? 'text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                      }`}
                      style={gender === 'female' ? { background: 'linear-gradient(135deg, #f97316, #ea6c0a)' } : {}}
                    >
                      女
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">男为阳，女为阴，影响动爻推算，令卦象更为精准</p>
                </div>
              </div>
            )}
            {method === 'manual' && (
              <div className="p-4 bg-orange-50 rounded-xl fade-in">
                <p className="text-sm text-orange-600">系统将模拟投掷铜钱六次，正面为阳（☰），背面为阴（☷），生成六爻卦象。</p>
              </div>
            )}
          </div>

          {/* 占问场景 */}
          <div className="card">
            <h2 className="font-semibold text-gray-800 mb-4">占问场景（选填）</h2>
            <div className="grid grid-cols-4 gap-2">
              {SCENES.map(s => (
                <button key={s} onClick={() => setScene(scene === s ? '' : s)}
                  className={`py-2 rounded-xl text-sm border transition ${
                    scene === s ? 'text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                  }`}
                  style={scene === s ? { background: 'linear-gradient(135deg, #f97316, #ea6c0a)' } : {}}
                >{s}</button>
              ))}
            </div>
          </div>

          <button onClick={doQiGua}
            className="w-full text-white rounded-xl py-4 font-semibold text-base transition shadow-md"
            style={{ background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)' }}
          >
            立即起卦
          </button>
          <p className="text-center text-xs text-gray-400">以上内容基于梅花易数理论，仅供参考，不构成迷信引导</p>
        </div>

        {/* 右侧结果 */}
        <div className="col-span-3">
          {!result ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <p className="text-gray-400 text-lg">请在左侧选择起卦方式</p>
              <p className="text-gray-300 text-sm mt-2">支持时间起卦 · 数字起卦 · 手动起卦</p>
            </div>
          ) : (
            <div className="space-y-6 fade-in">
              {/* 卦象展示 */}
              <div className="card">
                <h2 className="font-semibold text-gray-800 mb-6 text-center text-lg serif">本卦：《{result.guaName}》</h2>
                <div className="flex items-center justify-center gap-12">
                  <div className="text-center">
                    <div className="text-8xl mb-2 leading-none">{GUA_SYMBOL[result.shangGua]}{GUA_SYMBOL[result.xiaGua]}</div>
                    <div className="text-lg text-orange-600 font-semibold serif">{result.guaName}</div>
                    <div className="text-sm text-gray-400 mt-2">
                      上{result.shangGua}（{GUA_WU_XING[result.shangGua]}）下{result.xiaGua}（{GUA_WU_XING[result.xiaGua]}）
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl text-orange-300 mb-2">→</div>
                    <div className="text-sm text-gray-400">第{result.dongYao}爻动</div>
                  </div>
                  <div className="text-center">
                    <div className="text-8xl mb-2 leading-none opacity-70">{GUA_SYMBOL[result.bianShang]}{GUA_SYMBOL[result.bianXia]}</div>
                    <div className="text-lg text-orange-600 font-semibold serif">{result.bianGuaName}</div>
                    <div className="text-sm text-gray-400 mt-2">变卦</div>
                  </div>
                </div>
                <div className="flex gap-4 justify-center mt-6">
                  <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm border border-blue-200">
                    体卦：{result.tiGua}（{GUA_WU_XING[result.tiGua]}）
                  </span>
                  <span className="px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-sm border border-orange-200">
                    用卦：{result.yongGua}（{GUA_WU_XING[result.yongGua]}）
                  </span>
                </div>
              </div>

              {/* 卦辞 */}
              <div className="card">
                <div className="text-lg text-gray-800 font-semibold mb-2">卦辞</div>
                <p className="text-gray-600 leading-relaxed">{result.guaCi}</p>
              </div>

              {/* 卦象解读 */}
              <div className="card">
                <div className="text-lg text-gray-800 font-semibold mb-2">
                  卦象解读{result.scene && ` · ${result.scene}`}
                </div>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{result.analysis}</p>
              </div>

              {/* 操作 */}
              <div className="flex gap-4 justify-end">
                <button onClick={() => setResult(null)} className="btn-secondary text-sm">重新起卦</button>
                <button onClick={handleSave} disabled={saved}
                  className={`px-6 py-2 rounded-xl font-medium text-sm transition ${saved ? 'bg-emerald-500 text-white cursor-default' : 'text-white hover:opacity-90'}`}
                  style={!saved ? { background: 'linear-gradient(135deg, #f97316, #ea6c0a)' } : {}}
                >{saved ? '✓ 已保存' : '保存卦象'}</button>
              </div>
              <p className="text-center text-xs text-gray-400">以上解读仅供参考，不构成迷信引导</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
