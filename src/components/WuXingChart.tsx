import { WuXingAnalysis } from '../utils/bazi';

const WX_COLORS: Record<string, { bar: string; text: string; bg: string; border: string }> = {
  木: { bar: 'bg-green-400', text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
  火: { bar: 'bg-red-400',   text: 'text-red-700',   bg: 'bg-red-50',   border: 'border-red-200' },
  土: { bar: 'bg-yellow-400',text: 'text-yellow-700',bg: 'bg-yellow-50',border: 'border-yellow-200' },
  金: { bar: 'bg-gray-400',  text: 'text-gray-600',  bg: 'bg-gray-50',  border: 'border-gray-200' },
  水: { bar: 'bg-blue-400',  text: 'text-blue-700',  bg: 'bg-blue-50',  border: 'border-blue-200' },
};

export default function WuXingChart({ analysis }: { analysis: WuXingAnalysis }) {
  const items = Object.entries(analysis.percentages).sort((a, b) => b[1] - a[1]);
  return (
    <div className="space-y-2">
      {items.map(([wx, pct]) => {
        const c = WX_COLORS[wx] || WX_COLORS['土'];
        return (
          <div key={wx} className="flex items-center gap-4">
            <span className={`w-8 text-center text-sm font-bold ${c.text}`}>{wx}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${c.bar}`}
                style={{ width: `${Math.max(pct, 2)}%` }}
              />
            </div>
            <span className={`w-12 text-right text-sm font-semibold ${c.text}`}>{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}
