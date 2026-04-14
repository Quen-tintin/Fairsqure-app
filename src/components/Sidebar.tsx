import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Search, 
  Link as LinkIcon, 
  Diamond, 
  LineChart, 
  AlertCircle, 
  Map as MapIcon,
  Menu,
  X,
  Settings2,
  PieChart,
  Eye,
  MapPin
} from 'lucide-react';
import { cn } from '../lib/utils';

const NAV_ITEMS = [
  { icon: Search, label: 'Analyze a Listing', path: '/' },
  { icon: LinkIcon, label: 'Analyze URL', path: '/url' },
  { icon: Diamond, label: 'Hidden Gems', path: '/gems' },
  { icon: BarChart3, label: 'Model Performance', path: '/performance' },
  { icon: AlertCircle, label: 'Error Analysis', path: '/errors' },
  { icon: MapIcon, label: 'Explore DVF', path: '/explore' },
];

const INTEGRATIONS = [
  { icon: Settings2, label: 'LightGBM' },
  { icon: PieChart, label: 'SHAP' },
  { icon: Eye, label: 'Gemini Vision' },
  { icon: MapPin, label: 'OSM' },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card rounded-lg border border-card-border text-text-heading"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-[220px] bg-background border-r border-card-border transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-6 gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-default">
            <div className="w-6 h-6 rounded-md primary-gradient shadow-[0_0_12px_rgba(0,212,170,0.3)] group-hover:shadow-[0_0_20px_rgba(0,212,170,0.5)] transition-shadow duration-300"></div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">FairSquare</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200",
                      isActive 
                        ? "bg-white/5 text-text-heading border-l-[3px] border-primary-accent" 
                        : "text-text-label hover:text-text-heading"
                    )}
                  >
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer Info */}
          <div className="mt-auto text-[10px] text-text-label opacity-50 leading-relaxed">
            Paris Real Estate Intelligence<br />Built for Desktop 1440p
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
