import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { getHiddenGems } from '../services/api';
import { formatPrice, cn } from '../lib/utils';
import { Diamond, MapPin, ArrowUpDown, Sparkles, Loader2, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export function HiddenGems() {
  const [gems, setGems] = useState<any[]>([]);
  const [metadata, setMetadata] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getHiddenGems()
      .then(res => {
        setGems(res.gems || []);
        setMetadata(res.metadata || {});
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout title="Hidden Gems">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="animate-spin text-primary-accent" size={32} />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Hidden Gems">
        <div className="flex items-center justify-center h-96 text-negative">
          Failed to load gems: {error}
        </div>
      </Layout>
    );
  }

  const avgGain = gems.length > 0
    ? Math.round(gems.reduce((s, g) => s + (g.gain_potentiel || 0), 0) / gems.length)
    : 0;

  return (
    <Layout
      title="Hidden Gems"
      subtitle={`${gems.length} under-valued listings detected — threshold ${((metadata.seuil_gem_score || 0.08) * 100).toFixed(0)}%`}
    >
      {/* Results Grid */}
      <section>
        <div className="flex items-center justify-between mb-6 px-1">
          <h3 className="text-text-label text-xs font-medium">
            Updated: {metadata.date_mise_a_jour || '—'} — {metadata.nb_annonces_analysees || '—'} listings analyzed
          </h3>
          <button className="text-[10px] uppercase tracking-widest font-bold text-primary-accent flex items-center gap-1">
            Gem Score <ArrowUpDown size={12} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gems.map((gem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 }}
              className="bg-card rounded-xl overflow-hidden group hover:bg-card-border/20 transition-all duration-300 shadow-xl flex flex-col border border-card-border"
            >
              {/* Photo + gem score overlay */}
              <div className="relative h-48 overflow-hidden">
                {gem.photo_url ? (
                  <img
                    src={gem.photo_url}
                    alt={gem.titre}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-card-border/30 flex items-center justify-center">
                    <Diamond size={32} className="text-text-label/30" />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-primary-accent text-background px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-[0_0_12px_rgba(0,212,170,0.4)] flex items-center gap-1.5">
                  <Diamond size={12} fill="currentColor" />
                  GEM {((gem.gem_score || 0) * 100).toFixed(1)}%
                </div>
                <div className="absolute bottom-4 right-4 bg-card/80 backdrop-blur-md px-2 py-1 rounded text-primary-accent text-xs font-bold border border-card-border">
                  +{formatPrice(gem.gain_potentiel)}
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className="bg-card/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-text-label border border-card-border">
                    {gem.source}
                  </span>
                  {gem.url && (
                    <a href={gem.url} target="_blank" rel="noopener noreferrer" className="bg-card/80 backdrop-blur-md p-1.5 rounded border border-card-border text-text-label hover:text-primary-accent transition-colors">
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="px-5 pt-4 pb-2">
                <h4 className="font-headline font-bold text-text-heading text-sm group-hover:text-primary-accent transition-colors leading-snug">
                  {gem.titre}
                </h4>
                <p className="text-[10px] text-text-label mt-1 flex items-center gap-1">
                  <MapPin size={10} /> Paris {gem.arrondissement}e
                </p>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                {/* Price + Surface */}
                <div className="flex items-center gap-6 mb-4">
                  <div>
                    <p className="text-[10px] text-text-label uppercase font-bold tracking-widest">Asking Price</p>
                    <p className="text-sm font-headline font-black text-text-heading">{formatPrice(gem.prix_annonce)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-label uppercase font-bold tracking-widest">Surface</p>
                    <p className="text-sm font-headline font-black text-text-heading">{gem.surface} m²</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-label uppercase font-bold tracking-widest">Rooms</p>
                    <p className="text-sm font-headline font-black text-text-heading">{gem.pieces}</p>
                  </div>
                </div>

                {/* Price comparison */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-background rounded-lg border border-card-border/50">
                    <p className="text-[10px] text-text-label uppercase font-bold tracking-widest">Listed</p>
                    <p className="text-sm font-bold text-text-heading">{(gem.prix_affiche_m2 || 0).toLocaleString()} €/m²</p>
                  </div>
                  <div className="p-3 bg-primary-accent/10 rounded-lg border border-primary-accent/30">
                    <p className="text-[10px] text-primary-accent uppercase font-bold tracking-widest">AI Predicted</p>
                    <p className="text-sm font-bold text-primary-accent">{(gem.prix_predit_m2 || 0).toLocaleString()} €/m²</p>
                  </div>
                </div>

                {/* Potential gain */}
                <div className="rounded-lg p-3 bg-primary-accent/5 border border-primary-accent/20 mt-auto">
                  <p className="text-[10px] uppercase font-black tracking-widest mb-1 text-primary-accent">Potential Gain</p>
                  <div className="flex justify-between items-end">
                    <p className="text-xl font-headline font-extrabold text-primary-accent">
                      +{formatPrice(gem.gain_potentiel)}
                    </p>
                    <p className="text-xs font-bold text-primary-accent/70">
                      -{gem.sous_evaluation_pct}% under-valued
                    </p>
                  </div>
                </div>

                {/* Description */}
                {gem.description && (
                  <p className="text-[11px] text-text-label mt-3 leading-relaxed line-clamp-2">{gem.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Summary Footer */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-xl border-l-4 border-primary-accent border border-card-border">
          <p className="text-[10px] text-text-label uppercase font-bold tracking-widest mb-2">Avg. Opportunity</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-headline font-black text-text-heading">{formatPrice(avgGain)}</span>
            <Sparkles className="text-primary-accent pb-1" size={20} />
          </div>
          <p className="text-xs text-text-label mt-2">Average potential gain per listing.</p>
        </div>
        <div className="bg-card p-6 rounded-xl border-l-4 border-secondary-accent border border-card-border">
          <p className="text-[10px] text-text-label uppercase font-bold tracking-widest mb-2">Listings Scanned</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-headline font-black text-text-heading">{metadata.nb_annonces_analysees || '—'}</span>
          </div>
          <p className="text-xs text-text-label mt-2">Real listings scraped and analyzed by ML + Vision.</p>
        </div>
        <div className="bg-card p-6 rounded-xl border-l-4 border-card-border border border-card-border">
          <p className="text-[10px] text-text-label uppercase font-bold tracking-widest mb-2">Detection Rate</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-headline font-black text-text-heading">
              {metadata.nb_annonces_analysees ? `${Math.round((metadata.nb_pepites / metadata.nb_annonces_analysees) * 100)}%` : '—'}
            </span>
          </div>
          <p className="text-xs text-text-label mt-2">{metadata.nb_pepites || '—'} gems out of {metadata.nb_annonces_analysees || '—'} listings.</p>
        </div>
      </section>
    </Layout>
  );
}
