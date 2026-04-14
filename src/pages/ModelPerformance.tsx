import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { MetricCard } from '../components/MetricCard';
import { getModelMetrics } from '../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { TrendingDown, Target, Zap, Activity, Loader2 } from 'lucide-react';

export function ModelPerformance() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getModelMetrics()
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout title="Model Performance">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="animate-spin text-primary-accent" size={32} />
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout title="Model Performance">
        <div className="flex items-center justify-center h-96 text-negative">
          Failed to load metrics: {error}
        </div>
      </Layout>
    );
  }

  const current = data.current_model || {};
  const history = data.model_history || [];
  const importance = data.feature_importance || [];
  const stats = data.training_stats || {};

  return (
    <Layout
      title="Model Performance"
      subtitle="Comprehensive validation of our predictive pricing engine using historical DVF transaction data."
    >
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          label="MAE"
          value={current.MAE ? `${current.MAE.toLocaleString()} €/m²` : '—'}
          icon={<TrendingDown size={14} />}
        />
        <MetricCard
          label="RMSE"
          value={current.RMSE ? current.RMSE.toLocaleString() : '—'}
          icon={<Target size={14} />}
        />
        <MetricCard
          label="R² Score"
          value={current.R2 != null ? current.R2.toFixed(4) : '—'}
          icon={<Zap size={14} />}
        />
        <MetricCard
          label="MAPE"
          value={current.MAPE != null ? `${current.MAPE}%` : '—'}
          icon={<Activity size={14} />}
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Model Evolution Line Chart */}
        <div className="col-span-12 lg:col-span-8 bg-card p-6 rounded-xl border border-card-border shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold font-headline text-text-heading">Model Evolution</h3>
              <p className="text-xs text-text-label uppercase tracking-widest">MAE improvement across {history.length} model versions</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-accent"></span>
              <span className="text-[10px] font-bold text-text-label uppercase">{current.name}</span>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" vertical={false} />
                <XAxis
                  dataKey="model"
                  stroke="#8899BB"
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                  angle={-30}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  stroke="#8899BB"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#131929',
                    border: '1px solid #1E2D45',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#F0F4FF'
                  }}
                  itemStyle={{ color: '#00D4AA' }}
                  formatter={(value: number) => [`${value.toLocaleString()} €/m²`, 'MAE']}
                />
                <Line
                  type="monotone"
                  dataKey="MAE"
                  stroke="#00D4AA"
                  strokeWidth={3}
                  dot={{ fill: '#00D4AA', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Training Data Stats */}
        <div className="col-span-12 lg:col-span-4 bg-card p-6 rounded-xl border border-card-border shadow-xl flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded bg-secondary-accent/20 flex items-center justify-center text-secondary-accent">
              <Activity size={20} />
            </div>
            <h4 className="text-lg font-bold font-headline text-text-heading">Training Data</h4>
          </div>

          <div className="space-y-8 flex-1">
            <div>
              <p className="text-[10px] text-text-label uppercase font-bold tracking-widest mb-1">Total Transactions</p>
              <p className="text-5xl font-black font-headline text-text-heading tracking-tighter">
                {stats.total_transactions?.toLocaleString() || '—'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-background rounded-xl border border-card-border/50">
                <p className="text-[10px] text-text-label uppercase font-bold tracking-widest mb-1">Time Horizon</p>
                <p className="text-lg font-bold text-text-heading">{stats.time_horizon_months || '—'} Months</p>
              </div>
              <div className="p-4 bg-background rounded-xl border border-card-border/50">
                <p className="text-[10px] text-text-label uppercase font-bold tracking-widest mb-1">Coverage</p>
                <p className="text-lg font-bold text-text-heading">{stats.coverage || '—'}</p>
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex justify-between mb-2">
                <span className="text-[10px] text-text-label uppercase font-bold tracking-widest">Features</span>
                <span className="text-[10px] font-bold text-primary-accent">{current.n_features || '—'}</span>
              </div>
              <p className="text-[10px] text-text-label">{stats.data_source}</p>
            </div>
          </div>
        </div>

        {/* Feature Importance Bar Chart */}
        <div className="col-span-12 bg-card p-6 rounded-xl border border-card-border shadow-xl">
          <h3 className="text-lg font-bold font-headline text-text-heading mb-2">Feature Importance</h3>
          <p className="text-xs text-text-label uppercase tracking-widest mb-8">Top {importance.length} parameters driving valuation variance (LightGBM Gain)</p>

          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={importance} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="feature"
                  type="category"
                  stroke="#8899BB"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  width={160}
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
                  formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Importance']}
                />
                <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                  {importance.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index < 3 ? '#00D4AA' : '#0095FF'} />
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
