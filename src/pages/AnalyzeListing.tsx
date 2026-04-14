import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { MetricCard } from '../components/MetricCard';
import { ARRONDISSEMENTS } from '../data/constants';
import { formatPrice, cn } from '../lib/utils';
import { Edit3, Map as MapIcon, Info, Bolt, Sparkles, Diamond, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { predictListing } from '../services/api';

export function AnalyzeListing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    arrondissement: "11",
    surface: 65,
    pieces: 3,
    prix_affiche: "380 000"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const arrData = ARRONDISSEMENTS[formData.arrondissement as keyof typeof ARRONDISSEMENTS];
      const now = new Date();
      const month = now.getMonth() + 1;
      const quarter = Math.ceil(month / 3);

      const payload = {
        surface: Number(formData.surface),
        pieces: Number(formData.pieces),
        arrondissement: Number(formData.arrondissement),
        latitude: arrData.lat,
        longitude: arrData.lon,
        mois: month,
        trimestre: quarter,
        nombre_lots: 1,
        prix_affiche: Number(formData.prix_affiche.replace(/\s/g, ''))
      };

      const data = await predictListing(payload);
      setResult(data);
    } catch (err) {
      setError("Failed to get prediction. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Predictive Analysis">
      <div className="grid grid-cols-12 grid-rows-10 gap-4 h-[calc(100vh-120px)]">
        {/* Input Section */}
        <div className="bento-card col-span-12 lg:col-span-4 row-span-10">
          <div className="bento-title">Property Details</div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs text-text-label">Arrondissement</label>
              <select 
                name="arrondissement"
                value={formData.arrondissement}
                onChange={handleChange}
                className="input-field appearance-none"
              >
                {Object.entries(ARRONDISSEMENTS).map(([key, value]) => (
                  <option key={key} value={key}>Paris {value.label}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs text-text-label">Surface (m²)</label>
              <input 
                name="surface"
                type="number" 
                value={formData.surface}
                onChange={handleChange}
                className="input-field" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-text-label">Rooms / Pieces</label>
              <input 
                name="pieces"
                type="number" 
                value={formData.pieces}
                onChange={handleChange}
                className="input-field" 
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs text-text-label">Asking Price (€)</label>
              <input 
                name="prix_affiche"
                type="text" 
                value={formData.prix_affiche}
                onChange={handleChange}
                className="input-field" 
              />
            </div>

            <div className="opacity-60 space-y-1">
              <label className="text-xs text-text-label">Coordinates</label>
              <div className="text-xs font-mono text-text-body">
                {ARRONDISSEMENTS[formData.arrondissement as keyof typeof ARRONDISSEMENTS].lat} / {ARRONDISSEMENTS[formData.arrondissement as keyof typeof ARRONDISSEMENTS].lon}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-negative/10 border border-negative/20 text-negative rounded-lg text-xs">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-predict">
              {loading ? "Calculating..." : "Run Prediction"}
            </button>
          </form>
        </div>

        {/* Result Section */}
        <div className="bento-card col-span-12 lg:col-span-4 row-span-6 flex flex-col justify-between">
          {result ? (
            <>
              <div>
                <div className="bento-title">AI Price Valuation</div>
                <div className="text-[44px] font-extrabold text-text-heading leading-tight mb-1">
                  {formatPrice(result.prix_predit_total)}
                </div>
                <div className="text-base text-text-label">
                  {formatPrice(result.prix_predit_m2)} / m²
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-xs text-text-label font-medium">95% Confidence Interval</label>
                <div className="h-10 bg-card-border/50 rounded-lg relative flex items-center px-3">
                  <div className="absolute left-3 text-[10px] text-text-label">
                    {formatPrice(result.confidence_low * Number(formData.surface))}
                  </div>
                  <div className="h-1 primary-gradient w-2/5 mx-auto rounded-full"></div>
                  <div className="absolute right-3 text-[10px] text-text-label">
                    {formatPrice(result.confidence_high * Number(formData.surface))}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="bento-title !mb-2 !text-[10px]">XAI Model Summary</div>
                <p className="text-[13px] leading-relaxed text-text-body">
                  {result.xai_summary}
                </p>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-40">
              <Sparkles size={32} className="mb-2" />
              <p className="text-xs uppercase tracking-widest font-bold">Awaiting Data</p>
            </div>
          )}
        </div>

        {/* SHAP Section */}
        <div className="bento-card col-span-12 lg:col-span-4 row-span-5">
          <div className="bento-title">Price Contributions (SHAP)</div>
          {result ? (
            <div className="space-y-4">
              {result.shap_contributions.slice(0, 3).map((shap: any) => (
                <div key={shap.feature} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-body">{shap.feature}</span>
                    <span className={cn("font-bold", shap.value > 0 ? "text-positive" : "text-negative")}>
                      {shap.value > 0 ? "+" : ""}{formatPrice(shap.value)}
                    </span>
                  </div>
                  <div className="h-2 bg-card-border rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full", shap.value > 0 ? "bg-positive" : "bg-negative")}
                      style={{ 
                        width: `${Math.min(Math.abs(shap.value) / 150, 100)}%`,
                        marginLeft: shap.value > 0 ? '15%' : '0'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center opacity-20">
              <div className="w-full space-y-4">
                <div className="h-2 bg-card-border rounded-full w-3/4"></div>
                <div className="h-2 bg-card-border rounded-full w-1/2"></div>
                <div className="h-2 bg-card-border rounded-full w-2/3"></div>
              </div>
            </div>
          )}
        </div>

        {/* Gem Section */}
        <div className="bento-card col-span-12 lg:col-span-4 row-span-4">
          <div className="bento-title">Valuation Status</div>
          {result ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center px-3 py-1.5 bg-secondary-accent/10 border border-secondary-accent/20 text-secondary-accent rounded-lg font-bold text-sm">
                  CORRECT PRICE
                </div>
                <div className="text-2xl font-bold text-text-heading">
                  +{(result.hidden_gem_score * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-xs text-text-label leading-relaxed">
                Hidden Gem Score: {result.hidden_gem_score}<br />
                Potentiel d'appréciation modéré à court terme.
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center opacity-20">
              <Diamond size={32} />
            </div>
          )}
        </div>

        {/* Performance Section */}
        <div className="bento-card col-span-12 lg:col-span-4 row-span-5">
          <div className="bento-title">Model Quality Metrics</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'MAE', value: '1 427 €' },
              { label: 'R² Score', value: '0.43' },
              { label: 'MAPE', value: '15.8%' },
              { label: 'RMSE', value: '1 954 €' },
            ].map(m => (
              <div key={m.label} className="p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="text-[10px] text-text-label uppercase font-bold tracking-wider mb-1">{m.label}</div>
                <div className="text-lg font-bold text-text-heading">{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
