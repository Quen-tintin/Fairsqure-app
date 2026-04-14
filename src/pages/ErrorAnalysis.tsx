import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { getModelErrors } from '../services/api';
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
import { AlertTriangle, Info, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export function ErrorAnalysis() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getModelErrors()
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout title="Error Analysis">
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <Loader2 className="animate-spin text-primary-accent" size={36} />
          <p className="text-text-heading font-bold">Computing residuals on test set…</p>
          <p className="text-text-label text-xs max-w-xs text-center">
            Running predictions on 10,000+ transactions. First load takes ~20 seconds.
          </p>
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout title="Error Analysis">
        <div className="flex flex-col items-center justify-center h-96 gap-3">
          <p className="text-negative font-bold">Failed to load error analysis</p>
          <p className="text-text-label text-xs max-w-md text-center break-all">{error}</p>
          <button
            onClick={() => { setError(''); setLoading(true); getModelErrors().then(setData).catch(e => setError(e.message)).finally(() => setLoading(false)); }}
            className="mt-2 px-4 py-2 bg-card border border-card-border rounded-lg text-xs text-text-label hover:text-primary-accent transition-colors"
          >
            Retry
          </button>
        </div>
      </Layout>
    );
  }

  const scatter = data.scatter_data || [];
  const residuals = data.residual_distribution || [];
  const errorByArr = (data.error_by_arrondissement || []).map((e: any) => ({
    arr: `${e.arrondissement}e`,
    MAE: e.MAE,
    bias: e.bias,
    count: e.count,
  }));
  const metrics = data.metrics || {};

  // Find top biased arrondissements for the insights panel
  const sortedByBias = [...(data.error_by_arrondissement || [])].sort((a: any, b: any) => Math.abs(b.bias) - Math.abs(a.bias));
  const biases = sortedByBias.slice(0, 3).map((e: any) => ({
    title: `${e.arrondissement}e arr. — ${e.bias > 0 ? 'Over' : 'Under'}-prediction`,
    impact: Math.abs(e.bias) > 300 ? 'High' : Math.abs(e.bias) > 150 ? 'Medium' : 'Low',
    desc: `Average bias of ${e.bias > 0 ? '+' : ''}${Math.round(e.bias)} €/m² across ${e.count} test samples.`,
  }));

  return (
    <Layout
      title="Error Analysis"
      subtitle={`Test set: ${metrics.n_test?.toLocaleString() || '—'} transactions — ${metrics.pct_within_1000 || '—'}% within 1,000 €/m²`}
    >
      <div className="grid grid-cols-12 gap-6">
        {/* Scatter Plot: Predicted vs Actual */}
        <div className="col-span-12 lg:col-span-8 bg-card p-6 rounded-xl border border-card-border shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold font-headline text-text-heading">Predicted vs. Actual</h3>
              <p className="text-xs text-text-label uppercase tracking-widest">{scatter.length} sampled points from test set</p>
            </div>
            <div className="flex gap-4 text-[10px] font-bold text-text-label uppercase">
              <span>MAE: <span className="text-primary-accent">{metrics.MAE?.toLocaleString()} €/m²</span></span>
              <span>R²: <span className="text-primary-accent">{metrics.R2}</span></span>
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
                  unit=" €/m²"
                  stroke="#8899BB"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="number"
                  dataKey="predicted"
                  name="Predicted"
                  unit=" €/m²"
                  stroke="#8899BB"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <ZAxis type="number" dataKey="error" range={[20, 200]} name="Error" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{
                    backgroundColor: '#131929',
                    border: '1px solid #1E2D45',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#F0F4FF'
                  }}
                  formatter={(value: number, name: string) => [`${Math.round(value).toLocaleString()} €/m²`, name]}
                />
                <ReferenceLine segment={[{ x: 2000, y: 2000 }, { x: 25000, y: 25000 }]} stroke="#00D4AA" strokeDasharray="3 3" strokeOpacity={0.5} />
                <Scatter name="Transactions" data={scatter} fill="#0095FF" fillOpacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Systemic Biases */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-card p-6 rounded-xl border border-card-border shadow-xl h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded bg-red-500/20 flex items-center justify-center text-red-500">
                <AlertTriangle size={20} />
              </div>
              <h4 className="text-lg font-bold font-headline text-text-heading">Systemic Biases</h4>
            </div>

            <div className="space-y-4 flex-1">
              {biases.map((bias: any) => (
                <div key={bias.title} className="p-4 bg-background rounded-xl border border-card-border/50 group hover:border-primary-accent transition-all cursor-default">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-text-heading">{bias.title}</span>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full",
                      bias.impact === 'High' ? "bg-red-500/20 text-red-500" :
                      bias.impact === 'Medium' ? "bg-orange-500/20 text-orange-500" : "bg-blue-500/20 text-blue-500"
                    )}>
                      {bias.impact}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-label leading-relaxed">{bias.desc}</p>
                </div>
              ))}
            </div>

            {/* Quick metrics */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="p-3 bg-background rounded-lg border border-card-border/50 text-center">
                <p className="text-[10px] text-text-label uppercase font-bold tracking-widest">Within 1k</p>
                <p className="text-lg font-black text-primary-accent">{metrics.pct_within_1000}%</p>
              </div>
              <div className="p-3 bg-background rounded-lg border border-card-border/50 text-center">
                <p className="text-[10px] text-text-label uppercase font-bold tracking-widest">Within 2k</p>
                <p className="text-lg font-black text-primary-accent">{metrics.pct_within_2000}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Residual Histogram */}
        <div className="col-span-12 lg:col-span-5 bg-card p-6 rounded-xl border border-card-border shadow-xl">
          <h3 className="text-lg font-bold font-headline text-text-heading mb-8">Residual Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={residuals}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" vertical={false} />
                <XAxis
                  dataKey="range"
                  stroke="#8899BB"
                  fontSize={9}
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
            <span className="text-[10px] text-text-label italic">Median absolute error: {metrics.median_AE?.toLocaleString()} €/m²</span>
          </div>
        </div>

        {/* Error by Arrondissement */}
        <div className="col-span-12 lg:col-span-7 bg-card p-6 rounded-xl border border-card-border shadow-xl">
          <h3 className="text-lg font-bold font-headline text-text-heading mb-8">MAE by Arrondissement</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={errorByArr}>
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
                  formatter={(value: number, name: string) => [`${Math.round(value).toLocaleString()} €/m²`, name]}
                />
                <Bar dataKey="MAE" radius={[2, 2, 0, 0]}>
                  {errorByArr.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.MAE > 1500 ? '#F87171' : '#0095FF'} />
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
