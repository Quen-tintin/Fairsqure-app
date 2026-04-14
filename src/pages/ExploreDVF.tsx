import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { ARRONDISSEMENTS } from '../data/constants';
import { formatPrice, cn } from '../lib/utils';
import { Filter, MapPin, Calendar, Layers, Maximize2, Info } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Mock DVF Data
const MOCK_DVF = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  lat: 48.85 + (Math.random() - 0.5) * 0.1,
  lon: 2.34 + (Math.random() - 0.5) * 0.1,
  price: 400000 + Math.random() * 1200000,
  surface: 20 + Math.random() * 100,
  date: '2024-03-12',
  type: 'Appartement',
  arr: 75000 + Math.floor(Math.random() * 20) + 1
}));

function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

export function ExploreDVF() {
  const [selectedArr, setSelectedArr] = useState("11");
  const [selectedPoint, setSelectedPoint] = useState<any>(null);

  const center: [number, number] = [
    ARRONDISSEMENTS[selectedArr as keyof typeof ARRONDISSEMENTS].lat,
    ARRONDISSEMENTS[selectedArr as keyof typeof ARRONDISSEMENTS].lon
  ];

  return (
    <Layout 
      title="Explore DVF" 
      subtitle="Interactive map of historical transactions in Paris (Demande de Valeur Foncière)."
    >
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-250px)]">
        {/* Map Container */}
        <div className="col-span-12 lg:col-span-8 bg-card rounded-2xl border border-card-border overflow-hidden relative shadow-2xl">
          {/* Map Controls Overlay */}
          <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
            <div className="bg-card/80 backdrop-blur-md p-1 rounded-lg border border-card-border flex flex-col gap-1">
              {["1", "4", "11", "18"].map(arr => (
                <button 
                  key={arr}
                  onClick={() => setSelectedArr(arr)}
                  className={cn(
                    "w-10 h-10 rounded flex items-center justify-center text-xs font-black transition-all",
                    selectedArr === arr ? "bg-primary-accent text-background" : "text-text-label hover:bg-card-border/50"
                  )}
                >
                  {arr}
                </button>
              ))}
              <div className="h-px bg-card-border/50 mx-2 my-1"></div>
              <button className="w-10 h-10 rounded flex items-center justify-center text-text-label hover:bg-card-border/50">
                <Layers size={18} />
              </button>
            </div>
          </div>

          <div className="absolute top-4 right-4 z-[1000] flex gap-2">
            <div className="bg-card/80 backdrop-blur-md px-4 py-2 rounded-lg border border-card-border flex items-center gap-3">
              <span className="text-[10px] font-bold text-text-label uppercase tracking-widest">Timeframe</span>
              <select className="bg-transparent border-none text-xs font-bold text-text-heading p-0 focus:ring-0">
                <option>Last 6 Months</option>
                <option>Last Year</option>
                <option>Last 5 Years</option>
              </select>
            </div>
          </div>

          <MapContainer 
            center={center} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapRecenter center={center} />
            
            {MOCK_DVF.map(point => (
              <CircleMarker 
                key={point.id}
                center={[point.lat, point.lon]}
                radius={8}
                pathOptions={{ 
                  fillColor: point.price > 800000 ? '#00D4AA' : '#0095FF',
                  fillOpacity: 0.8,
                  color: '#131929',
                  weight: 1
                }}
                eventHandlers={{
                  click: () => setSelectedPoint(point)
                }}
              >
                <Popup className="dark-popup">
                  <div className="p-1">
                    <p className="text-xs font-bold text-background">{formatPrice(point.price)}</p>
                    <p className="text-[10px] text-background/80">{point.surface.toFixed(0)} m² — {point.type}</p>
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

        {/* Side Panel: Details */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-card p-6 rounded-2xl border border-card-border shadow-xl flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-primary-accent/20 flex items-center justify-center text-primary-accent">
                  <MapPin size={20} />
                </div>
                <h4 className="text-lg font-bold font-headline text-text-heading">Transaction Details</h4>
              </div>
              <button className="text-text-label hover:text-text-heading transition-all">
                <Maximize2 size={18} />
              </button>
            </div>

            {selectedPoint ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-1">
                  <p className="text-[10px] text-text-label uppercase font-bold tracking-widest">Sale Price</p>
                  <p className="text-4xl font-black font-headline text-primary-accent tracking-tighter">
                    {formatPrice(selectedPoint.price)}
                  </p>
                  <p className="text-xs font-bold text-text-body">
                    {formatPrice(selectedPoint.price / selectedPoint.surface)} / m²
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-background rounded-xl border border-card-border/50">
                    <div className="flex items-center gap-2 text-text-label mb-1">
                      <Calendar size={14} />
                      <span className="text-[10px] uppercase font-bold tracking-widest">Mutation Date</span>
                    </div>
                    <p className="text-sm font-bold text-text-heading">{selectedPoint.date}</p>
                  </div>
                  <div className="p-4 bg-background rounded-xl border border-card-border/50">
                    <div className="flex items-center gap-2 text-text-label mb-1">
                      <Layers size={14} />
                      <span className="text-[10px] uppercase font-bold tracking-widest">Property Type</span>
                    </div>
                    <p className="text-sm font-bold text-text-heading">{selectedPoint.type}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="text-[10px] font-bold text-text-label uppercase tracking-widest">Cadastral Info</h5>
                  <div className="space-y-3">
                    {[
                      { label: "Section", value: "000 AB" },
                      { label: "Plot Number", value: "0124" },
                      { label: "Volume", value: "1" },
                      { label: "Lots", value: "2" },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between items-center py-2 border-b border-card-border/30">
                        <span className="text-xs text-text-label">{item.label}</span>
                        <span className="text-xs font-bold text-text-heading">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto p-4 bg-primary-accent/5 rounded-xl border border-primary-accent/20 flex gap-3">
                  <Info size={18} className="text-primary-accent shrink-0" />
                  <p className="text-[11px] text-text-body leading-relaxed">
                    This transaction was recorded in the official DVF database. Values are net-seller and do not include agency or notary fees.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40">
                <MapPin size={48} className="mb-4 text-text-label" />
                <p className="text-sm font-headline font-bold uppercase tracking-widest text-text-label">Select a point on the map to view details</p>
              </div>
            )}
          </div>

          <div className="bg-card p-6 rounded-2xl border border-card-border shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[10px] font-bold text-text-label uppercase tracking-widest">Arrondissement Stats</h4>
              <span className="text-[10px] font-bold text-primary-accent">Paris {selectedArr}e</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-black font-headline text-text-heading">11,240 €/m²</p>
                <p className="text-[10px] text-text-label font-bold uppercase tracking-tighter">Avg. Market Price</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary-accent">+3.2%</p>
                <p className="text-[10px] text-text-label font-bold uppercase tracking-tighter">vs. Prev Quarter</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
