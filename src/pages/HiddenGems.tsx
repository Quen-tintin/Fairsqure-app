import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { MOCK_GEMS } from '../data/constants';
import { formatPrice, cn } from '../lib/utils';
import { Diamond, MapPin, Filter, ArrowUpDown, Sparkles, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function HiddenGems() {
  const [filterArr, setFilterArr] = useState<number[]>([]);
  
  const toggleArr = (arr: number) => {
    setFilterArr(prev => 
      prev.includes(arr) ? prev.filter(a => a !== arr) : [...prev, arr]
    );
  };

  const filteredGems = filterArr.length > 0 
    ? MOCK_GEMS.filter(gem => filterArr.includes(gem.arrondissement))
    : MOCK_GEMS;

  return (
    <Layout 
      title="Hidden Gems" 
      subtitle="Found 24 potential 'Gems' matching criteria"
    >
      {/* Filters Row */}
      <section className="mb-10">
        <div className="bg-card rounded-xl p-6 border border-card-border shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Arrondissement */}
            <div className="space-y-3">
              <label className="text-text-label text-[10px] uppercase font-bold tracking-widest">Arrondissements</label>
              <div className="flex flex-wrap gap-2">
                {[75001, 75002, 75011, 75016].map(arr => (
                  <span 
                    key={arr}
                    onClick={() => toggleArr(arr)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-[10px] font-bold cursor-pointer transition-all",
                      filterArr.includes(arr) 
                        ? "bg-primary-accent text-background" 
                        : "bg-card-border/30 text-text-label hover:bg-primary-accent/20 hover:text-primary-accent"
                    )}
                  >
                    {arr}
                  </span>
                ))}
                <div className="px-2 py-1.5 rounded-full bg-card-border/30 flex items-center justify-center cursor-pointer text-text-label">
                  <span className="text-[10px] font-bold">+</span>
                </div>
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-text-label text-[10px] uppercase font-bold tracking-widest">Price Range</label>
                <span className="text-primary-accent text-[10px] font-bold">€350k - €1.2M</span>
              </div>
              <div className="relative h-1.5 w-full bg-card-border/30 rounded-full overflow-hidden">
                <div className="absolute left-[20%] right-[30%] h-full bg-primary-accent"></div>
              </div>
            </div>

            {/* Surface Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-text-label text-[10px] uppercase font-bold tracking-widest">Surface (m²)</label>
                <span className="text-primary-accent text-[10px] font-bold">25 - 120 m²</span>
              </div>
              <div className="relative h-1.5 w-full bg-card-border/30 rounded-full overflow-hidden">
                <div className="absolute left-[10%] right-[40%] h-full bg-secondary-accent"></div>
              </div>
            </div>

            {/* Gem Score Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-text-label text-[10px] uppercase font-bold tracking-widest">Min Gem Score</label>
                <span className="text-primary-accent text-[10px] font-bold">8.5 / 10</span>
              </div>
              <div className="relative h-1.5 w-full bg-card-border/30 rounded-full overflow-hidden">
                <div className="absolute left-0 w-[85%] h-full primary-gradient"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section>
        <div className="flex items-center justify-between mb-6 px-1">
          <h3 className="text-text-label text-xs font-medium">Sort by:</h3>
          <button className="text-[10px] uppercase tracking-widest font-bold text-primary-accent flex items-center gap-1">
            Opportunity Size <ArrowUpDown size={12} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGems.map((gem, index) => (
            <motion.div 
              key={gem.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl overflow-hidden group hover:bg-card-border/20 transition-all duration-300 shadow-xl flex flex-col border border-card-border"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={gem.image} 
                  alt={gem.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-primary-accent text-background px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-[0_0_12px_rgba(0,212,170,0.4)] flex items-center gap-1.5">
                  <Diamond size={12} fill="currentColor" />
                  GEM SCORE {(gem.gem_score * 100).toFixed(1)}
                </div>
                <div className="absolute bottom-4 right-4 bg-card/80 backdrop-blur-md px-2 py-1 rounded text-primary-accent text-xs font-bold border border-card-border">
                  +{(gem.gem_score * 100).toFixed(1)}%
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-headline font-bold text-text-heading group-hover:text-primary-accent transition-colors">
                    {gem.title}
                  </h4>
                  <span className="text-text-label text-[10px] font-bold">{gem.arrondissement}</span>
                </div>
                <p className="text-[10px] text-text-label mb-4 flex items-center gap-1">
                  <MapPin size={12} /> {gem.location}
                </p>

                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-card-border/30">
                  <div>
                    <p className="text-[10px] text-text-label uppercase font-bold tracking-widest">Price</p>
                    <p className="text-sm font-headline font-black text-text-heading">{formatPrice(gem.price)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-label uppercase font-bold tracking-widest">Surface</p>
                    <p className="text-sm font-headline font-black text-text-heading">{gem.surface} m²</p>
                  </div>
                </div>

                <div className={cn(
                  "rounded p-3 mb-4",
                  gem.potential_gain > 0 ? "bg-primary-accent/5" : "bg-red-500/5"
                )}>
                  <p className={cn(
                    "text-[10px] uppercase font-black tracking-widest mb-1",
                    gem.potential_gain > 0 ? "text-primary-accent" : "text-red-400"
                  )}>
                    Potential Gain
                  </p>
                  <p className={cn(
                    "text-lg font-headline font-extrabold",
                    gem.potential_gain > 0 ? "text-primary-accent" : "text-red-400"
                  )}>
                    {gem.potential_gain > 0 ? "+" : ""}{formatPrice(gem.potential_gain)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {gem.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded bg-card-border/30 text-text-label text-[10px] font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Insights Summary Footer */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-xl border-l-4 border-primary-accent border border-card-border">
          <p className="text-[10px] text-text-label uppercase font-bold tracking-widest mb-2">Market Sentiment</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-headline font-black text-text-heading">BULLISH</span>
            <Sparkles className="text-primary-accent pb-1" size={20} />
          </div>
          <p className="text-xs text-text-label mt-2 leading-relaxed">Arrondissements 1, 11, and 16 show highest liquidity scores this week.</p>
        </div>
        <div className="bg-card p-6 rounded-xl border-l-4 border-secondary-accent border border-card-border">
          <p className="text-[10px] text-text-label uppercase font-bold tracking-widest mb-2">Avg. Opportunity Size</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-headline font-black text-text-heading">€41,250</span>
            <span className="text-secondary-accent text-xs font-bold pb-1 uppercase">Per Asset</span>
          </div>
          <p className="text-xs text-text-label mt-2 leading-relaxed">Based on predictive SHAP analysis and current OSM infrastructure updates.</p>
        </div>
        <div className="bg-card p-6 rounded-xl border-l-4 border-card-border border border-card-border">
          <p className="text-[10px] text-text-label uppercase font-bold tracking-widest mb-2">Data Integrity</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-headline font-black text-text-heading">99.8%</span>
            <CheckCircle className="text-text-label pb-1" size={20} />
          </div>
          <p className="text-xs text-text-label mt-2 leading-relaxed">Real-time DVF synchronization and Gemini-verified listing photos.</p>
        </div>
      </section>
    </Layout>
  );
}
