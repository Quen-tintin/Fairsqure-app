import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { ARRONDISSEMENTS } from '../data/constants';
import { getDvfTransactions } from '../services/api';
import { formatPrice, cn } from '../lib/utils';
import { MapPin, Calendar, Layers, Maximize2, Info, Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

export function ExploreDVF() {
  const [selectedArr, setSelectedArr] = useState("11");
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setSelectedPoint(null);
    getDvfTransactions({ arrondissement: parseInt(selectedArr), limit: 300 })
      .then(res => {
        setTransactions(res.transactions || []);
        setStats(res.stats || {});
        setTotal(res.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedArr]);

  const center: [number, number] = [
    ARRONDISSEMENTS[selectedArr as keyof typeof ARRONDISSEMENTS].lat,
    ARRONDISSEMENTS[selectedArr as keyof typeof ARRONDISSEMENTS].lon
  ];

  return (
    <Layout
      title="Explore DVF"
      subtitle={`${total.toLocaleString()} real transactions in Paris ${selectedArr}e — DVF Open Data`}
    >
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-250px)]">
        {/* Map Container */}
        <div className="col-span-12 lg:col-span-8 bg-card rounded-2xl border border-card-border overflow-hidden relative shadow-2xl">
          {/* Arrondissement selector */}
          <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
            <div className="bg-card/80 backdrop-blur-md p-1 rounded-lg border border-card-border flex flex-col gap-1">
              {Array.from({ length: 20 }, (_, i) => String(i + 1)).map(arr => (
                <button
                  key={arr}
                  onClick={() => setSelectedArr(arr)}
                  className={cn(
                    "w-10 h-8 rounded flex items-center justify-center text-[10px] font-black transition-all",
                    selectedArr === arr ? "bg-primary-accent text-background" : "text-text-label hover:bg-card-border/50"
                  )}
                >
                  {arr}e
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="absolute inset-0 z-[999] bg-background/60 flex items-center justify-center">
              <Loader2 className="animate-spin text-primary-accent" size={32} />
            </div>
          )}

          <MapContainer
            center={center}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapRecenter center={center} />

            {transactions.filter(t => t.latitude && t.longitude).map((point, i) => (
              <CircleMarker
                key={i}
                center={[point.latitude, point.longitude]}
                radius={6}
                pathOptions={{
                  fillColor: (point.prix_m2 || 0) > 10000 ? '#00D4AA' : '#0095FF',
                  fillOpacity: 0.7,
                  color: '#131929',
                  weight: 1
                }}
                eventHandlers={{
                  click: () => setSelectedPoint(point)
                }}
              >
                <Popup className="dark-popup">
                  <div className="p-1">
                    <p className="text-xs font-bold text-background">{formatPrice(point.valeur_fonciere)}</p>
                    <p className="text-[10px] text-background/80">{point.surface_reelle_bati?.toFixed(0)} m² — {Math.round(point.prix_m2)} €/m²</p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>

          {/* Legend */}
          <div className="absolute bottom-6 left-6 z-[1000] bg-card/90 backdrop-blur-md p-4 rounded-xl border border-card-border shadow-2xl">
            <h4 className="text-[10px] font-bold text-text-label uppercase tracking-widest mb-3">Price Heatmap</h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#0095FF]"></div>
                <span className="text-[10px] text-text-body font-medium">&lt; 10k €/m²</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#00D4AA]"></div>
                <span className="text-[10px] text-text-body font-medium">&gt; 10k €/m²</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-card p-6 rounded-2xl border border-card-border shadow-xl flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-primary-accent/20 flex items-center justify-center text-primary-accent">
                  <MapPin size={20} />
                </div>
                <h4 className="text-lg font-bold font-headline text-text-heading">Transaction Details</h4>
              </div>
            </div>

            {selectedPoint ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-1">
                  <p className="text-[10px] text-text-label uppercase font-bold tracking-widest">Sale Price</p>
                  <p className="text-4xl font-black font-headline text-primary-accent tracking-tighter">
                    {formatPrice(selectedPoint.valeur_fonciere)}
                  </p>
                  <p className="text-xs font-bold text-text-body">
                    {Math.round(selectedPoint.prix_m2).toLocaleString()} €/m²
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-background rounded-xl border border-card-border/50">
                    <div className="flex items-center gap-2 text-text-label mb-1">
                      <Calendar size={14} />
                      <span className="text-[10px] uppercase font-bold tracking-widest">Date</span>
                    </div>
                    <p className="text-sm font-bold text-text-heading">{selectedPoint.date_mutation}</p>
                  </div>
                  <div className="p-4 bg-background rounded-xl border border-card-border/50">
                    <div className="flex items-center gap-2 text-text-label mb-1">
                      <Layers size={14} />
                      <span className="text-[10px] uppercase font-bold tracking-widest">Type</span>
                    </div>
                    <p className="text-sm font-bold text-text-heading">{selectedPoint.type_local || 'Appartement'}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Surface", value: `${selectedPoint.surface_reelle_bati?.toFixed(0)} m²` },
                    { label: "Rooms", value: `${selectedPoint.nombre_pieces_principales || '—'}` },
                    { label: "Arr.", value: `Paris ${selectedPoint.arrondissement}e` },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center py-2 border-b border-card-border/30">
                      <span className="text-xs text-text-label">{item.label}</span>
                      <span className="text-xs font-bold text-text-heading">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto p-4 bg-primary-accent/5 rounded-xl border border-primary-accent/20 flex gap-3">
                  <Info size={18} className="text-primary-accent shrink-0" />
                  <p className="text-[11px] text-text-body leading-relaxed">
                    Official DVF transaction. Net-seller price, excluding agency and notary fees.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40">
                <MapPin size={48} className="mb-4 text-text-label" />
                <p className="text-sm font-headline font-bold uppercase tracking-widest text-text-label">Click a point on the map</p>
              </div>
            )}
          </div>

          {/* Arrondissement Stats */}
          <div className="bg-card p-6 rounded-2xl border border-card-border shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[10px] font-bold text-text-label uppercase tracking-widest">Arrondissement Stats</h4>
              <span className="text-[10px] font-bold text-primary-accent">Paris {selectedArr}e</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-black font-headline text-text-heading">
                  {stats.median_prix_m2 ? `${Math.round(stats.median_prix_m2).toLocaleString()} €/m²` : '—'}
                </p>
                <p className="text-[10px] text-text-label font-bold uppercase tracking-tighter">Median Price</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-secondary-accent">
                  {stats.total_count ? stats.total_count.toLocaleString() : '—'}
                </p>
                <p className="text-[10px] text-text-label font-bold uppercase tracking-tighter">Transactions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
