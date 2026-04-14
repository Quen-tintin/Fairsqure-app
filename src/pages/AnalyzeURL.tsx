import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { MetricCard } from '../components/MetricCard';
import { MOCK_URL_ANALYSIS } from '../data/constants';
import { formatPrice, cn } from '../lib/utils';
import { Globe, Eye, Handshake, CheckCircle, FileText, Share2 } from 'lucide-react';
import { motion } from 'motion/react';

export function AnalyzeURL() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = () => {
    if (!url) return;
    setLoading(true);
    setTimeout(() => {
      setResult(MOCK_URL_ANALYSIS);
      setLoading(false);
    }, 2000);
  };

  return (
    <Layout 
      title="Analyze URL" 
      subtitle="Paste a real estate listing URL for deep AI extraction and analysis."
    >
      {/* URL Input */}
      <section className="w-full">
        <div className="flex gap-4 p-1 bg-card rounded-xl border border-card-border shadow-lg">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Globe className="text-text-label" size={20} />
            </div>
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.seloger.com/annonces/..."
              className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-text-heading focus:ring-0 font-body text-sm"
            />
          </div>
          <button 
            onClick={handleAnalyze}
            disabled={loading}
            className="primary-gradient text-background font-headline font-bold px-10 rounded-lg text-sm hover:opacity-90 transition-all uppercase tracking-widest disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      </section>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Hero Card */}
          <section className="grid grid-cols-12 gap-8">
            <div className="col-span-12 glass-panel rounded-2xl overflow-hidden flex flex-col md:flex-row h-auto md:h-[320px]">
              <div className="w-full md:w-2/5 relative h-64 md:h-full">
                <img 
                  src={result.photo_url} 
                  alt="Listing" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-text-heading text-background px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                    {result.source} Verified
                  </span>
                </div>
              </div>
              <div className="flex-1 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-headline font-extrabold tracking-tighter text-text-heading leading-tight">
                        {result.titre}
                      </h3>
                      <p className="text-text-label font-medium flex items-center gap-1 mt-1">
                        <Globe size={14} /> Paris {result.arrondissement}ème — Folie-Méricourt
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <div className="text-3xl md:text-4xl font-headline font-black text-primary-accent">
                        {formatPrice(result.prix_annonce)}
                      </div>
                      <div className="text-xs font-bold text-text-label mt-1">
                        {formatPrice(result.prix_affiche_m2)} / m²
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-6">
                    {[
                      { label: 'Surface', value: `${result.surface}m²` },
                      { label: 'Rooms', value: result.pieces },
                      { label: 'Bedrooms', value: result.pieces - 1 },
                      { label: 'Floor', value: `${result.listing_extras.etage}th` },
                    ].map((item) => (
                      <div key={item.label} className="px-4 py-2 bg-card-border/20 rounded-lg border border-card-border/50 flex flex-col items-center min-w-[80px]">
                        <span className="text-[10px] uppercase font-bold text-text-label tracking-widest">{item.label}</span>
                        <span className="text-lg font-headline font-bold text-text-heading">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap justify-between items-center gap-4 mt-6 md:mt-0">
                  <div className="flex flex-wrap gap-2">
                    {result.listing_extras.features_found.slice(0, 3).map((f: string) => (
                      <span key={f} className="px-3 py-1 bg-card-border/40 rounded-full text-[10px] font-medium uppercase tracking-wider text-text-body">
                        {f}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-text-label uppercase tracking-widest">DPE CLASS</span>
                    <span className="w-8 h-8 flex items-center justify-center bg-yellow-400 text-background font-black rounded">
                      {result.listing_extras.dpe_classe || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Analysis Grid */}
          <section className="grid grid-cols-12 gap-8 items-start">
            {/* Left Column */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
              <div className="bento-card space-y-6">
                <h4 className="bento-title">Listing Details Analysis</h4>
                <div className="space-y-4">
                  {[
                    { label: 'Building Period', value: '1880-1914' },
                    { label: 'Property Tax (TF)', value: '€ 1,240 / yr' },
                    { label: 'Charges', value: '€ 320 / mo' },
                    { label: 'Heating', value: 'Individual Gas' },
                    { label: 'Last Renovation', value: '2012 (Delayed)', color: 'text-red-400' },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-2 border-b border-card-border/30">
                      <span className="text-sm text-text-label">{item.label}</span>
                      <span className={cn("text-sm font-bold", item.color || "text-text-heading")}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4">
                  <p className="text-[10px] font-bold text-text-label uppercase tracking-widest mb-3">Extracted Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {result.listing_extras.features_found.map((tag: string) => (
                      <span key={tag} className="px-2 py-1 bg-card-border/20 rounded text-[10px] font-medium text-primary-accent">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bento-card">
                <h4 className="bento-title mb-6">Price Benchmarks</h4>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-text-label">Market Price Confidence</span>
                      <span className="text-xs font-bold text-primary-accent">94.2%</span>
                    </div>
                    <div className="h-1 bg-card-border/30 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-accent w-[94%]"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-background rounded-xl">
                      <span className="text-[10px] text-text-label uppercase font-bold tracking-widest block mb-1">Low Range</span>
                      <span className="text-lg font-headline font-bold text-text-heading">€ 1.02M</span>
                    </div>
                    <div className="p-4 bg-background rounded-xl">
                      <span className="text-[10px] text-text-label uppercase font-bold tracking-widest block mb-1">High Range</span>
                      <span className="text-lg font-headline font-bold text-text-heading">€ 1.21M</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-12 lg:col-span-8 space-y-8">
              {/* Vision Intelligence */}
              <div className="bento-card !p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Eye size={120} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded bg-secondary-accent/20 flex items-center justify-center text-secondary-accent">
                      <Eye size={20} />
                    </div>
                    <h4 className="text-xl font-headline font-bold tracking-tight text-text-heading">Gemini Vision Intelligence</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {[
                      { label: 'Renovation', value: 'High-End', score: 85 },
                      { label: 'Luminosity', value: 'Excellent', score: 92 },
                      { label: 'Layout', value: 'Optimized', score: 78 },
                    ].map((item) => (
                      <div key={item.label} className="space-y-3">
                        <div className="flex justify-between items-end">
                          <span className="text-xs font-bold uppercase tracking-widest text-text-label">{item.label}</span>
                          <span className="text-sm font-black text-secondary-accent">{item.value}</span>
                        </div>
                        <div className="h-1.5 bg-card-border/30 rounded-full overflow-hidden flex">
                          <div className="h-full bg-secondary-accent" style={{ width: `${item.score}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 bg-card-border/20 rounded-xl italic text-text-body/80 text-sm leading-relaxed border-l-4 border-secondary-accent/30">
                    "{result.vision.reasoning}"
                  </div>
                </div>
              </div>

              {/* Negotiation Strategy */}
              <div className="bento-card !p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-primary-accent/20 flex items-center justify-center text-primary-accent">
                      <Handshake size={20} />
                    </div>
                    <h4 className="text-xl font-headline font-bold tracking-tight text-text-heading">Negotiation Strategy</h4>
                  </div>
                  <div className="px-4 py-2 bg-background rounded-lg text-left md:text-right w-full md:w-auto">
                    <span className="text-[10px] text-text-label uppercase font-bold tracking-widest block">Recommended Offer</span>
                    <span className="text-lg font-headline font-bold text-primary-accent">€ 1,087,750</span>
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="relative pt-6">
                    <div className="flex justify-between mb-4">
                      <span className="text-sm font-bold text-text-heading">Aggressiveness Margin</span>
                      <span className="text-sm font-black text-primary-accent">5%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="15" 
                      defaultValue="5"
                      className="w-full h-2 bg-card-border/30 rounded-lg appearance-none cursor-pointer accent-primary-accent"
                    />
                    <div className="flex justify-between mt-2 text-[10px] text-text-label font-bold uppercase">
                      <span>Safe (0%)</span>
                      <span>Moderate (7.5%)</span>
                      <span>Aggressive (15%)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h5 className="text-xs font-bold uppercase tracking-widest text-text-label">Negotiation Levers</h5>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm">
                          <CheckCircle size={16} className="text-primary-accent mt-0.5" />
                          <span className="text-text-body">DPE 'C' is good but requires isolation upgrades for 'B' target.</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm">
                          <CheckCircle size={16} className="text-primary-accent mt-0.5" />
                          <span className="text-text-body">Market average in Folie-Méricourt is trending -1.2% this quarter.</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h5 className="text-xs font-bold uppercase tracking-widest text-text-label">Success Probability</h5>
                      <div className="flex items-center gap-6">
                        <div className="relative w-20 h-20">
                          <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path className="text-card-border/30" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                            <path className="text-primary-accent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="68, 100" strokeLinecap="round" strokeWidth="3" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center font-headline font-black text-lg text-text-heading">68%</div>
                        </div>
                        <p className="text-xs text-text-label leading-tight">High probability of acceptance based on similar sold assets in the building.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Floating Actions */}
          <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-30">
            <button className="w-14 h-14 glass-panel rounded-full flex items-center justify-center text-text-heading shadow-2xl hover:bg-card-border/50 transition-all">
              <Share2 size={20} />
            </button>
            <button className="primary-gradient p-[1px] rounded-full shadow-2xl hover:scale-105 transition-all">
              <div className="bg-background rounded-full px-6 py-3 flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-primary-accent">Generate PDF Report</span>
                <FileText size={18} className="text-primary-accent" />
              </div>
            </button>
          </div>
        </motion.div>
      )}
    </Layout>
  );
}
