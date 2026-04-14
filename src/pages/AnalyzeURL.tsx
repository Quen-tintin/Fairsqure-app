import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { analyzeUrl } from '../services/api';
import { formatPrice, cn } from '../lib/utils';
import { Globe, Eye, Handshake, CheckCircle, FileText, Share2, AlertTriangle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

// Map vision fields to display values + bar percentages
function renoLabel(score: number): { label: string; pct: number } {
  const map: Record<number, { label: string; pct: number }> = {
    1: { label: 'Neuf', pct: 95 },
    2: { label: 'Bon état', pct: 78 },
    3: { label: 'Standard', pct: 60 },
    4: { label: 'Travaux légers', pct: 40 },
    5: { label: 'Gros travaux', pct: 20 },
  };
  return map[score] || { label: 'N/A', pct: 50 };
}

function luminoBar(v: string): { label: string; pct: number } {
  if (v === 'Lumineuse') return { label: 'Excellent', pct: 90 };
  if (v === 'Sombre') return { label: 'Low', pct: 30 };
  return { label: 'Average', pct: 60 };
}

function qualiteBar(v: string): { label: string; pct: number } {
  if (v === 'Premium') return { label: 'Premium', pct: 92 };
  if (v === 'Basique') return { label: 'Basic', pct: 35 };
  return { label: 'Standard', pct: 65 };
}

function marginLabel(days: number | null, margin: number): string {
  if (days === null) return `${(margin * 100).toFixed(0)}% — standard margin (listing age unknown)`;
  if (days <= 30) return `${(margin * 100).toFixed(0)}% — fresh listing (${days}d), less room to negotiate`;
  if (days <= 90) return `${(margin * 100).toFixed(0)}% — standard (${days}d on market)`;
  if (days <= 180) return `${(margin * 100).toFixed(0)}% — stale listing (${days}d), seller likely motivated`;
  return `${(margin * 100).toFixed(0)}% — very stale (${days}d), significant negotiation expected`;
}

export function AnalyzeURL() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzeUrl(url);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Analysis failed. The listing may be unavailable or protected.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAnalyze();
  };

  // Derived values from result
  const vision = result?.vision || {};
  const extras = result?.listing_extras || {};
  const corrections = result?.corrections || {};
  const reno = renoLabel(vision.renovation_score || 3);
  const lumi = luminoBar(vision.luminosite || 'Moyenne');
  const qual = qualiteBar(vision.qualite_generale || 'Standard');
  const recommendedOffer = result ? Math.round(result.prix_annonce * (1 - (result.negotiation_margin || 0.07))) : 0;

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
              onKeyDown={handleKeyDown}
              placeholder="https://www.seloger.com/annonces/..."
              className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-text-heading focus:ring-0 font-body text-sm"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="primary-gradient text-background font-headline font-bold px-10 rounded-lg text-sm hover:opacity-90 transition-all uppercase tracking-widest disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing...</> : "Analyze"}
          </button>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 space-y-4">
          <Loader2 size={40} className="animate-spin text-primary-accent mx-auto" />
          <p className="text-text-label text-sm">Scraping listing... Analyzing photos with Gemini Vision...</p>
          <p className="text-text-label/60 text-xs">This may take 15-30 seconds (scraping + AI vision on 5 photos)</p>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bento-card !border-red-500/30 flex items-start gap-4">
          <AlertTriangle size={24} className="text-red-400 shrink-0 mt-1" />
          <div>
            <h4 className="font-headline font-bold text-text-heading mb-1">Analysis Failed</h4>
            <p className="text-sm text-text-body">{error}</p>
            <p className="text-xs text-text-label mt-2">Try a different URL, or check that the listing is still online.</p>
          </div>
        </motion.div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Hero Card */}
          <section className="grid grid-cols-12 gap-8">
            <div className="col-span-12 glass-panel rounded-2xl overflow-hidden flex flex-col md:flex-row h-auto md:h-[320px]">
              {result.photo_url && (
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
              )}
              <div className="flex-1 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-headline font-extrabold tracking-tighter text-text-heading leading-tight">
                        {result.titre || 'Listing Analysis'}
                      </h3>
                      <p className="text-text-label font-medium flex items-center gap-1 mt-1">
                        <Globe size={14} /> Paris {result.arrondissement}ème
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
                      { label: 'Floor', value: extras.etage !== null && extras.etage !== undefined ? (extras.etage === 0 ? 'RDC' : `${extras.etage}th`) : 'N/A' },
                      { label: 'Gem Score', value: `${(result.gem_score * 100).toFixed(1)}%` },
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
                    {(extras.features_found || []).slice(0, 4).map((f: string) => (
                      <span key={f} className="px-3 py-1 bg-card-border/40 rounded-full text-[10px] font-medium uppercase tracking-wider text-text-body">
                        {f}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-text-label uppercase tracking-widest">DPE</span>
                    <span className={cn(
                      "w-8 h-8 flex items-center justify-center font-black rounded",
                      extras.dpe_classe === 'A' || extras.dpe_classe === 'B' ? 'bg-green-400 text-background' :
                      extras.dpe_classe === 'C' || extras.dpe_classe === 'D' ? 'bg-yellow-400 text-background' :
                      extras.dpe_classe === 'E' ? 'bg-orange-400 text-background' :
                      extras.dpe_classe === 'F' || extras.dpe_classe === 'G' ? 'bg-red-400 text-background' :
                      'bg-card-border text-text-label'
                    )}>
                      {extras.dpe_classe || '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Gem Score Banner */}
          {result.is_hidden_gem && (
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="p-6 rounded-2xl border-2 border-primary-accent/40 bg-primary-accent/5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">💎</span>
                <div>
                  <h3 className="text-xl font-headline font-black text-primary-accent">Hidden Gem Detected</h3>
                  <p className="text-sm text-text-body">This property is undervalued by {(result.gem_score * 100).toFixed(1)}% — potential gain of {formatPrice(result.gain_potentiel)}</p>
                </div>
              </div>
              <span className="text-3xl font-headline font-black text-primary-accent">+{(result.gem_score * 100).toFixed(1)}%</span>
            </motion.div>
          )}

          {/* Analysis Grid */}
          <section className="grid grid-cols-12 gap-8 items-start">
            {/* Left Column */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
              <div className="bento-card space-y-6">
                <h4 className="bento-title">Listing Details Analysis</h4>
                <div className="space-y-4">
                  {[
                    { label: 'Days on Market', value: result.days_on_market !== null ? `${result.days_on_market} days` : 'Unknown' },
                    { label: 'Exposition', value: extras.exposition || 'N/A' },
                    { label: 'Charges', value: extras.charges_mensuelles ? `€ ${extras.charges_mensuelles} / mo` : 'N/A' },
                    { label: 'DPE Class', value: extras.dpe_classe || 'Not detected' },
                    { label: 'Photos Analyzed', value: vision.photos_analyzed ? `${vision.photos_analyzed} photos` : 'None' },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-2 border-b border-card-border/30">
                      <span className="text-sm text-text-label">{item.label}</span>
                      <span className="text-sm font-bold text-text-heading">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4">
                  <p className="text-[10px] font-bold text-text-label uppercase tracking-widest mb-3">Extracted Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {(extras.features_found || []).map((tag: string) => (
                      <span key={tag} className="px-2 py-1 bg-card-border/20 rounded text-[10px] font-medium text-primary-accent">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bento-card">
                <h4 className="bento-title mb-6">Corrections Applied</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Market Trend', value: `×${corrections.market_trend}`, desc: 'DVF data staleness adjustment' },
                    { label: 'Floor', value: `×${corrections.floor_corr}`, desc: extras.etage !== null ? `Floor ${extras.etage}` : 'Unknown' },
                    { label: 'DPE', value: `×${corrections.dpe_corr}`, desc: extras.dpe_classe ? `Class ${extras.dpe_classe}` : 'Not detected' },
                    { label: 'Renovation', value: `×${corrections.reno_corr?.toFixed(3)}`, desc: `Vision score: ${vision.renovation_score || 'N/A'}` },
                    { label: 'Exposition', value: `×${corrections.expo_corr}`, desc: extras.exposition || 'N/A' },
                    { label: 'Reno Cost', value: corrections.reno_cost_m2 ? `-${corrections.reno_cost_m2}€/m²` : '—', desc: 'Estimated buyer renovation' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-1.5">
                      <div>
                        <span className="text-xs font-bold text-text-heading">{item.label}</span>
                        <span className="text-[10px] text-text-label ml-2">{item.desc}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-primary-accent">{item.value}</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-card-border/50 flex justify-between">
                    <span className="text-sm font-bold text-text-heading">Total Correction</span>
                    <span className="text-sm font-mono font-black text-primary-accent">×{corrections.total_corr}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-12 lg:col-span-8 space-y-8">
              {/* Price Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bento-card text-center">
                  <span className="text-[10px] uppercase font-bold text-text-label tracking-widest block mb-2">AI Predicted</span>
                  <span className="text-2xl font-headline font-black text-primary-accent">{formatPrice(result.prix_predit_m2)}/m²</span>
                  <span className="text-sm text-text-label block mt-1">{formatPrice(result.prix_predit_total)} total</span>
                </div>
                <div className="bento-card text-center">
                  <span className="text-[10px] uppercase font-bold text-text-label tracking-widest block mb-2">Asking Price</span>
                  <span className="text-2xl font-headline font-black text-text-heading">{formatPrice(result.prix_affiche_m2)}/m²</span>
                  <span className="text-sm text-text-label block mt-1">{formatPrice(result.prix_annonce)} total</span>
                </div>
                <div className="bento-card text-center">
                  <span className="text-[10px] uppercase font-bold text-text-label tracking-widest block mb-2">LightGBM Raw</span>
                  <span className="text-2xl font-headline font-black text-text-body">{formatPrice(result.prix_predit_m2_brut)}/m²</span>
                  <span className="text-sm text-text-label block mt-1">Before corrections</span>
                </div>
              </div>

              {/* SHAP Explainability */}
              {result.shap_top3?.length > 0 && (
                <div className="bento-card">
                  <h4 className="bento-title mb-4">SHAP Explainability — Why This Price?</h4>
                  <div className="space-y-3">
                    {result.shap_top3.map((s: any) => (
                      <div key={s.feature} className="flex items-center gap-4">
                        <span className="text-xs text-text-label w-40 shrink-0 truncate">{s.feature}</span>
                        <div className="flex-1 h-6 bg-card-border/20 rounded-full overflow-hidden relative">
                          <div
                            className={cn("h-full rounded-full", s.impact >= 0 ? "bg-primary-accent" : "bg-red-400")}
                            style={{ width: `${Math.min(Math.abs(s.impact) / 5, 100)}%`, marginLeft: s.impact < 0 ? 'auto' : 0 }}
                          />
                        </div>
                        <span className={cn("text-xs font-mono font-bold w-24 text-right", s.impact >= 0 ? "text-primary-accent" : "text-red-400")}>
                          {s.impact >= 0 ? '+' : ''}{s.impact} €/m²
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                    {vision.photos_analyzed && (
                      <span className="px-2 py-0.5 bg-secondary-accent/20 rounded text-[10px] font-bold text-secondary-accent">
                        {vision.photos_analyzed} photos analyzed
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {[
                      { label: 'Renovation', ...reno },
                      { label: 'Luminosity', ...lumi },
                      { label: 'Quality', ...qual },
                    ].map((item) => (
                      <div key={item.label} className="space-y-3">
                        <div className="flex justify-between items-end">
                          <span className="text-xs font-bold uppercase tracking-widest text-text-label">{item.label}</span>
                          <span className="text-sm font-black text-secondary-accent">{item.label}</span>
                        </div>
                        <div className="h-1.5 bg-card-border/30 rounded-full overflow-hidden flex">
                          <div className="h-full bg-secondary-accent" style={{ width: `${item.pct}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {vision.reasoning && (
                    <div className="p-6 bg-card-border/20 rounded-xl italic text-text-body/80 text-sm leading-relaxed border-l-4 border-secondary-accent/30">
                      "{vision.reasoning}"
                    </div>
                  )}
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
                    <span className="text-lg font-headline font-bold text-primary-accent">{formatPrice(recommendedOffer)}</span>
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="relative pt-2">
                    <div className="flex justify-between mb-4">
                      <span className="text-sm font-bold text-text-heading">Dynamic Margin</span>
                      <span className="text-sm font-black text-primary-accent">{((result.negotiation_margin || 0.07) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-3 bg-card-border/30 rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-primary-accent rounded-full transition-all"
                        style={{ width: `${((result.negotiation_margin || 0.07) / 0.15) * 100}%` }}
                      />
                      {/* Scale markers */}
                      {[5, 7, 10, 13].map((v) => (
                        <div
                          key={v}
                          className="absolute top-0 h-full w-px bg-text-label/30"
                          style={{ left: `${(v / 15) * 100}%` }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-text-label font-bold uppercase">
                      <span>Fresh (5%)</span>
                      <span>Standard (7%)</span>
                      <span>Stale (10%)</span>
                      <span>Old (13%)</span>
                    </div>
                    <p className="text-xs text-text-body mt-3">
                      {marginLabel(result.days_on_market, result.negotiation_margin || 0.07)}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h5 className="text-xs font-bold uppercase tracking-widest text-text-label">Negotiation Context</h5>
                      <ul className="space-y-3">
                        {corrections.dpe_corr && corrections.dpe_corr < 1 && (
                          <li className="flex items-start gap-3 text-sm">
                            <CheckCircle size={16} className="text-primary-accent mt-0.5" />
                            <span className="text-text-body">Poor DPE ({extras.dpe_classe}) — energy renovation costs can justify a lower offer.</span>
                          </li>
                        )}
                        {corrections.reno_cost_m2 > 0 && (
                          <li className="flex items-start gap-3 text-sm">
                            <CheckCircle size={16} className="text-primary-accent mt-0.5" />
                            <span className="text-text-body">Estimated renovation cost: {corrections.reno_cost_m2} €/m² ({formatPrice(corrections.reno_cost_m2 * result.surface)} total).</span>
                          </li>
                        )}
                        <li className="flex items-start gap-3 text-sm">
                          <CheckCircle size={16} className="text-primary-accent mt-0.5" />
                          <span className="text-text-body">
                            LightGBM predicts {formatPrice(result.prix_predit_m2_brut)}/m² raw, vs asking {formatPrice(result.prix_affiche_m2)}/m² —
                            {result.prix_predit_m2_brut > result.prix_affiche_m2 ? ' property is below market' : ' property is above market prediction'}.
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h5 className="text-xs font-bold uppercase tracking-widest text-text-label">Key Metrics</h5>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-card-border/20">
                          <span className="text-xs text-text-label">Asking price</span>
                          <span className="text-xs font-bold text-text-heading">{formatPrice(result.prix_annonce)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-card-border/20">
                          <span className="text-xs text-text-label">After negotiation ({((result.negotiation_margin || 0.07) * 100).toFixed(0)}%)</span>
                          <span className="text-xs font-bold text-text-heading">{formatPrice(recommendedOffer)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-card-border/20">
                          <span className="text-xs text-text-label">AI predicted value</span>
                          <span className="text-xs font-bold text-primary-accent">{formatPrice(result.prix_predit_total)}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-xs text-text-label">Potential gain</span>
                          <span className="text-xs font-bold text-primary-accent">+{formatPrice(result.gain_potentiel)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </motion.div>
      )}
    </Layout>
  );
}
