import React from 'react';
import { Layout } from '../components/Layout';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis,
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  ReferenceLine
} from 'recharts';
import { AlertTriangle, Filter, Info, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

// Mock data for Error Analysis
const SCATTER_DATA = Array.from({ length: 100 }, (_, i) => {
  const actual = 5000 + Math.random() * 15000;
  const error = (Math.random() - 0.5) * 2000;
  return {
    actual,
    predicted: actual + error,
    error: Math.abs(error),
    arrondissement: Math.floor(Math.random() * 20) + 1
  };
});

const RESIDUAL_DATA = [
  { range: '-2.5k', count: 5 },
  { range: '-2k', count: 12 },
  { range: '-1.5k', count: 25 },
  { range: '-1k', count: 48 },
  { range: '-0.5k', count: 82 },
  { range: '0', count: 124 },
  { range: '0.5k', count: 95 },
  { range: '1k', count: 56 },
  { range: '1.5k', count: 32 },
  { range: '2k', count: 15 },
  { range: '2.5k', count: 8 },
];

const ERROR_BY_ARR = [
  { arr: '1er', error: 1240 },
  { arr: '2ème', error: 1560 },
  { arr: '3ème', error: 1320 },
  { arr: '4ème', error: 1480 },
  { arr: '5ème', error: 1100 },
  { arr: '6ème', error: 1850 },
  { arr: '7ème', error: 1920 },
  { arr: '8ème', error: 1740 },
  { arr: '9ème', error: 1350 },
  { arr: '10ème', error: 1220 },
  { arr: '11ème', error: 1180 },
  { arr: '12ème', error: 1050 },
  { arr: '13ème', error: 980 },
  { arr: '14ème', error: 1120 },
  { arr: '15ème', error: 1280 },
  { arr: '16ème', error: 1650 },
  { arr: '17ème', error: 1420 },
  { arr: '18ème', error: 1580 },
  { arr: '19ème', error: 1150 },
  { arr: '20ème', error: 1080 },
];

export function ErrorAnalysis() {
  return (
    <Layout 
      title="Error Analysis" 
      subtitle="Identifying systematic biases and outlier patterns in model predictions."
    >
      <div className="grid grid-cols-12 gap-6">
        {/* Scatter Plot: Predicted vs Actual */}
        <div className="col-span-12 lg:col-span-8 bg-card p-6 rounded-xl border border-card-border shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold font-headline text-text-heading">Predicted vs. Actual</h3>
              <p className="text-xs text-text-label uppercase tracking-widest">Visualizing variance across the price spectrum</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-background rounded border border-card-border text-text-label hover:text-primary-accent transition-all">
                <Filter size={16} />
              </button>
            </div>
          </div>
          
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" />
                <XAxis 
                  type="number" 
                  dataKey="actual" 
                  name="Actual" 
                  unit="€" 
                  stroke="#8899BB" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  type="number" 
                  dataKey="predicted" 
                  name="Predicted" 
                  unit="€" 
                  stroke="#8899BB" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <ZAxis type="number" dataKey="error" range={[20, 200]} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ 
                    backgroundColor: '#131929', 
                    border: '1px solid #1E2D45',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#F0F4FF'
                  }}
                />
                <ReferenceLine x={20000} y={20000} stroke="#00D4AA" strokeDasharray="3 3" />
                <Scatter name="Transactions" data={SCATTER_DATA} fill="#0095FF" fillOpacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Outlier Alerts */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-card p-6 rounded-xl border border-card-border shadow-xl h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded bg-red-500/20 flex items-center justify-center text-red-500">
                <AlertTriangle size={20} />
              </div>
              <h4 className="text-lg font-bold font-headline text-text-heading">Systemic Biases</h4>
            </div>
            
            <div className="space-y-4 flex-1">
              {[
                { title: "Luxury Segment Under-estimation", impact: "High", desc: "Model tends to under-predict assets > 18k €/m² by 12%." },
                { title: "Ground Floor Bias", impact: "Medium", desc: "Inconsistent data for RDC properties in 18th arr." },
                { title: "New Build Scarcity", impact: "Low", desc: "Limited training samples for 2024 completions." },
              ].map((bias) => (
                <div key={bias.title} className="p-4 bg-background rounded-xl border border-card-border/50 group hover:border-primary-accent transition-all cursor-default">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-text-heading">{bias.title}</span>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full",
                      bias.impact === 'High' ? "bg-red-500/20 text-red-500" : "bg-orange-500/20 text-orange-500"
                    )}>
                      {bias.impact} Impact
                    </span>
                  </div>
                  <p className="text-[11px] text-text-label leading-relaxed">{bias.desc}</p>
                </div>
              ))}
            </div>

            <button className="mt-8 w-full py-3 bg-card-border/30 rounded-lg text-xs font-bold uppercase tracking-widest text-text-label hover:text-text-heading transition-all flex items-center justify-center gap-2">
              View Detailed Logs <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Residual Histogram */}
        <div className="col-span-12 lg:col-span-5 bg-card p-6 rounded-xl border border-card-border shadow-xl">
          <h3 className="text-lg font-bold font-headline text-text-heading mb-8">Residual Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={RESIDUAL_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" vertical={false} />
                <XAxis 
                  dataKey="range" 
                  stroke="#8899BB" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#1E2D45', opacity: 0.4 }}
                  contentStyle={{ 
                    backgroundColor: '#131929', 
                    border: '1px solid #1E2D45',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#F0F4FF'
                  }}
                />
                <Bar dataKey="count" fill="#00D4AA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center gap-2 p-3 bg-background rounded-lg">
            <Info size={14} className="text-secondary-accent" />
            <span className="text-[10px] text-text-label italic">Normal distribution centered at 0 indicates low systematic bias.</span>
          </div>
        </div>

        {/* Error by Arrondissement */}
        <div className="col-span-12 lg:col-span-7 bg-card p-6 rounded-xl border border-card-border shadow-xl">
          <h3 className="text-lg font-bold font-headline text-text-heading mb-8">MAE by Arrondissement</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ERROR_BY_ARR}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" vertical={false} />
                <XAxis 
                  dataKey="arr" 
                  stroke="#8899BB" 
                  fontSize={9} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#8899BB" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{ fill: '#1E2D45', opacity: 0.4 }}
                  contentStyle={{ 
                    backgroundColor: '#131929', 
                    border: '1px solid #1E2D45',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#F0F4FF'
                  }}
                />
                <Bar dataKey="error" radius={[2, 2, 0, 0]}>
                  {ERROR_BY_ARR.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.error > 1500 ? '#F87171' : '#0095FF'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
}
