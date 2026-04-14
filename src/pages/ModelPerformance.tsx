import React from 'react';
import { Layout } from '../components/Layout';
import { MetricCard } from '../components/MetricCard';
import { MODEL_PERFORMANCE_HISTORY, FEATURE_IMPORTANCE } from '../data/constants';
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
import { TrendingDown, Target, Zap, Activity } from 'lucide-react';

export function ModelPerformance() {
  return (
    <Layout 
      title="Model Performance" 
      subtitle="Comprehensive validation of our predictive pricing engine using historical DVF transaction data."
    >
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard 
          label="MAE" 
          value="1,427 €/m²" 
          icon={<TrendingDown size={14} />} 
          badge="-4.2% from V4.1"
          badgeColor="teal"
        />
        <MetricCard 
          label="RMSE" 
          value="1,954" 
          icon={<Target size={14} />} 
        />
        <MetricCard 
          label="R² Score" 
          value="0.43" 
          icon={<Zap size={14} />} 
          badge="+0.05 improvement"
          badgeColor="teal"
        />
        <MetricCard 
          label="MAPE" 
          value="15.8%" 
          icon={<Activity size={14} />} 
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Model Evolution Line Chart */}
        <div className="col-span-12 lg:col-span-8 bg-card p-6 rounded-xl border border-card-border shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold font-headline text-text-heading">Model Evolution</h3>
              <p className="text-xs text-text-label uppercase tracking-widest">MAE Improvement across iteration versions</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-accent"></span>
              <span className="text-[10px] font-bold text-text-label uppercase">Main Branch</span>
            </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MODEL_PERFORMANCE_HISTORY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" vertical={false} />
                <XAxis 
                  dataKey="model" 
                  stroke="#8899BB" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
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
              <p className="text-5xl font-black font-headline text-text-heading tracking-tighter">67,292</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-background rounded-xl border border-card-border/50">
                <p className="text-[10px] text-text-label uppercase font-bold tracking-widest mb-1">Time Horizon</p>
                <p className="text-lg font-bold text-text-heading">24 Months</p>
              </div>
              <div className="p-4 bg-background rounded-xl border border-card-border/50">
                <p className="text-[10px] text-text-label uppercase font-bold tracking-widest mb-1">Regions</p>
                <p className="text-lg font-bold text-text-heading">94 Depts</p>
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex justify-between mb-2">
                <span className="text-[10px] text-text-label uppercase font-bold tracking-widest">Data Freshness Index</span>
                <span className="text-[10px] font-bold text-primary-accent">98.2%</span>
              </div>
              <div className="h-1.5 bg-background rounded-full overflow-hidden">
                <div className="h-full primary-gradient w-[98%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Importance Bar Chart */}
        <div className="col-span-12 bg-card p-6 rounded-xl border border-card-border shadow-xl">
          <h3 className="text-lg font-bold font-headline text-text-heading mb-8">Feature Importance</h3>
          <p className="text-xs text-text-label uppercase tracking-widest mb-8">Top 10 parameters driving valuation variance (SHAP Values)</p>
          
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FEATURE_IMPORTANCE} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="feature" 
                  type="category" 
                  stroke="#8899BB" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  width={120}
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
                <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                  {FEATURE_IMPORTANCE.map((entry, index) => (
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
