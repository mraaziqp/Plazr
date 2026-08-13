import React, { useState } from 'react';
import { MarketEvent, StallSpot, PowerCircuit, SpotCategoryGroup, CategoryQuota } from '../../types';
import { SPOT_CATEGORY_CONFIGS, getSpotCategoryConfig } from '../../lib/spotUtils';
import { 
  Zap, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Move, 
  Building2, 
  RefreshCw,
  Power,
  Flame,
  Ruler,
  Sliders,
  Sparkles,
  PieChart,
  X
} from 'lucide-react';

interface FloorPlanManagerProps {
  market: MarketEvent;
  onUpdateCircuitAssignment: (spotId: string, newCircuitId: 'circuit-1' | 'circuit-2' | 'circuit-3') => void;
  onUpdateSpotHighTraffic?: (spotId: string, isHighTraffic: boolean, footTrafficLabel?: string, surchargeZar?: number) => void;
  onUpdateCategoryQuotas?: (quotas: CategoryQuota[]) => void;
}

export const FloorPlanManager: React.FC<FloorPlanManagerProps> = ({
  market,
  onUpdateCircuitAssignment,
  onUpdateSpotHighTraffic,
  onUpdateCategoryQuotas,
}) => {
  const [selectedSpotForReassign, setSelectedSpotForReassign] = useState<StallSpot | null>(null);
  const [editingSpotTraffic, setEditingSpotTraffic] = useState<StallSpot | null>(null);
  const [surchargeInput, setSurchargeInput] = useState<number>(300);
  const [trafficLabelInput, setTrafficLabelInput] = useState<string>('🔥 High Walkway Entrance');

  // Category Quotas (Default if missing)
  const categoryQuotas: CategoryQuota[] = market.categoryQuotas || [
    { categoryGroup: 'Food & Beverage', targetCount: 10, bookedCount: 7 },
    { categoryGroup: 'Artisanal & Crafts', targetCount: 15, bookedCount: 9 },
    { categoryGroup: 'Apparel & Vintage', targetCount: 12, bookedCount: 4 },
    { categoryGroup: 'Beauty & Wellness', targetCount: 8, bookedCount: 3 },
    { categoryGroup: 'General Retail', targetCount: 10, bookedCount: 2 }
  ];

  // Calculate Total Venue Power Draw
  const totalCapacityKw = 25.0; // 25 kW (25,000 W)
  
  // Calculate allocated power from current stall grid occupants
  const currentAllocatedKw = market.stallGrid.reduce((sum, spot) => {
    return sum + (spot.status === 'occupied' ? (spot.occupantPowerKw || spot.powerKw) : 0);
  }, 11.5); // Base ambient lighting + occupants

  const totalLoadPercent = Math.min(100, Math.round((currentAllocatedKw / totalCapacityKw) * 100));

  // Calculate power per circuit board
  const circuitLoads = {
    'circuit-1': market.stallGrid.filter(s => s.circuitId === 'circuit-1' && s.status === 'occupied').reduce((sum, s) => sum + (s.occupantPowerKw || s.powerKw), 5.5),
    'circuit-2': market.stallGrid.filter(s => s.circuitId === 'circuit-2' && s.status === 'occupied').reduce((sum, s) => sum + (s.occupantPowerKw || s.powerKw), 2.5),
    'circuit-3': market.stallGrid.filter(s => s.circuitId === 'circuit-3' && s.status === 'occupied').reduce((sum, s) => sum + (s.occupantPowerKw || s.powerKw), 1.5),
  };

  const circuitCapacities = {
    'circuit-1': 8.0, // 8kW limit for Circuit 1
    'circuit-2': 10.0,
    'circuit-3': 7.0,
  };

  const isZone1Overloaded = circuitLoads['circuit-1'] > circuitCapacities['circuit-1'];

  const handleReassignCircuit = (newCircuitId: 'circuit-1' | 'circuit-2' | 'circuit-3') => {
    if (!selectedSpotForReassign) return;
    onUpdateCircuitAssignment(selectedSpotForReassign.id, newCircuitId);
    setSelectedSpotForReassign(null);
  };

  const handleSaveHighTrafficToggle = (spot: StallSpot, makeHighTraffic: boolean) => {
    if (onUpdateSpotHighTraffic) {
      onUpdateSpotHighTraffic(
        spot.id, 
        makeHighTraffic, 
        makeHighTraffic ? trafficLabelInput : undefined,
        makeHighTraffic ? surchargeInput : 0
      );
    } else {
      spot.isHighFootTraffic = makeHighTraffic;
      spot.footTrafficLabel = makeHighTraffic ? trafficLabelInput : undefined;
      spot.premiumSurchargeZar = makeHighTraffic ? surchargeInput : 0;
    }
    setEditingSpotTraffic(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Power Load Gauge */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-black text-white tracking-tight">
                Interactive Layout, Quotas & Foot Traffic Manager
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Manage stall allocations, category quotas, max wattage limits, and high foot-traffic pricing
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Loadshedding Backup: Active Generator (45 kVA)</span>
            </span>
          </div>
        </div>

        {/* Global Electrical Load Gauge */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Power className="w-4 h-4 text-indigo-400" /> Total Venue Power Draw:
            </span>
            <span className="font-black text-white text-sm">
              {(currentAllocatedKw * 1000).toLocaleString()} W / {(totalCapacityKw * 1000).toLocaleString()} W Allocated ({currentAllocatedKw.toFixed(1)} kW)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              style={{ width: `${totalLoadPercent}%` }}
              className={`h-full rounded-full transition-all duration-500 ${
                totalLoadPercent > 85 ? 'bg-rose-500' : totalLoadPercent > 65 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            ></div>
          </div>
        </div>
      </div>

      {/* ORGANISER VENDOR CATEGORY QUOTAS TRACKER */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Organiser Vendor Category Quotas
            </h3>
          </div>
          <span className="text-[11px] font-bold text-slate-400">
            Target caps defined by market planners
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {categoryQuotas.map((q) => {
            const meta = getSpotCategoryConfig(q.categoryGroup);
            const pct = Math.min(100, Math.round((q.bookedCount / q.targetCount) * 100));
            const isFull = q.bookedCount >= q.targetCount;

            return (
              <div
                key={q.categoryGroup}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between font-bold text-white">
                  <span className="flex items-center space-x-1 text-[11px]">
                    <span>{meta.emoji}</span>
                    <span>{q.categoryGroup}</span>
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                    isFull ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-indigo-500/20 text-indigo-300'
                  }`}>
                    {isFull ? 'CAP REACHED' : `${q.bookedCount}/${q.targetCount}`}
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className={`h-full rounded-full ${meta.bgClass}`}
                  ></div>
                </div>

                <p className="text-[10px] text-slate-400 text-right">
                  {q.targetCount - q.bookedCount} spots remaining
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* OVERLOAD WARNING FLAG BANNER */}
      {isZone1Overloaded && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border-2 border-rose-500 text-rose-200 space-y-2 animate-in slide-in-from-top duration-300 shadow-xl">
          <div className="flex items-center space-x-2.5">
            <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 animate-bounce" />
            <div>
              <h3 className="text-sm font-bold text-white">⚠️ CIRCUIT OVERLOAD WARNING: Zone A Food Alley</h3>
              <p className="text-xs text-rose-300">
                Current Load: <strong>{circuitLoads['circuit-1'].toFixed(1)} kW</strong> exceeds Zone A board limit of <strong>8.0 kW</strong>. Risk of tripping main breaker during peak griddle usage!
              </p>
            </div>
          </div>
          <p className="text-xs text-rose-100 bg-rose-900/50 p-2.5 rounded-xl font-medium border border-rose-800">
            ⚡ Action Recommended: Reassign high-draw food vendors from <strong>Circuit 1 (Zone A)</strong> to <strong>Circuit 2 (Zone B Substation)</strong> using the spot manager below.
          </p>
        </div>
      )}

      {/* Circuit Boards Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { id: 'circuit-1', name: 'Zone A - Food Alley Substation', max: 8.0, load: circuitLoads['circuit-1'] },
          { id: 'circuit-2', name: 'Zone B - Crafts & Heavy Grid', max: 10.0, load: circuitLoads['circuit-2'] },
          { id: 'circuit-3', name: 'Zone C - Fashion & Lighting Board', max: 7.0, load: circuitLoads['circuit-3'] },
        ].map((circuit) => {
          const isOver = circuit.load > circuit.max;
          const pct = Math.min(100, Math.round((circuit.load / circuit.max) * 100));

          return (
            <div
              key={circuit.id}
              className={`p-4 rounded-2xl border text-xs space-y-3 ${
                isOver ? 'bg-rose-950/30 border-rose-500/80 shadow-md' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{circuit.name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isOver ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {isOver ? 'OVERLOADED' : 'NORMAL'}
                </span>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Load Draw: {circuit.load.toFixed(1)} kW</span>
                  <span>Max: {circuit.max} kW</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className={`h-full rounded-full ${isOver ? 'bg-rose-500' : 'bg-indigo-500'}`}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Stall Layout, Sector Colour Coding & High Traffic Surcharge Controls */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-400" />
            Interactive Floor Plan & Foot-Traffic Highlighting
          </h3>
          <span className="text-xs text-slate-400">
            Click <Flame className="w-3.5 h-3.5 text-amber-500 inline" /> to toggle High Foot Traffic status & premium surcharge rate
          </span>
        </div>

        {/* List / Grid of Stalls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {market.stallGrid.map((spot) => {
            const isOccupied = spot.status === 'occupied';
            const catMeta = getSpotCategoryConfig(spot.categoryGroup);
            const isHighTraffic = spot.isHighFootTraffic;
            const spotMaxWatts = spot.maxPowerWatts || ((spot.powerKw || 1.0) * 1000);

            return (
              <div
                key={spot.id}
                className={`p-3.5 rounded-xl border text-xs space-y-2.5 transition-all ${
                  isHighTraffic ? 'bg-slate-950 border-amber-500/60 shadow-lg ring-1 ring-amber-500/30' : 'bg-slate-800/60 border-slate-700/80'
                }`}
              >
                {/* Header Badge Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${catMeta.badgeClass}`}>
                      {catMeta.emoji} {spot.categoryGroup || 'General'}
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-1.5 py-0.5 rounded flex items-center gap-1 border border-slate-700">
                      <Ruler className="w-3 h-3 text-slate-400" />
                      {spot.dimensions || '3x3m'}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isOccupied ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {isOccupied ? 'Occupied' : 'Available'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-black text-white text-sm">{spot.label}</span>
                  <span className="font-extrabold text-amber-400">
                    R{spot.basePriceZar + (isHighTraffic ? (spot.premiumSurchargeZar || 250) : 0)}
                  </span>
                </div>

                {/* High Foot Traffic Indicator */}
                {isHighTraffic && (
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-center justify-between font-bold">
                    <span className="flex items-center space-x-1">
                      <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span>{spot.footTrafficLabel || 'High Foot Traffic'}</span>
                    </span>
                    <span className="text-amber-200 bg-amber-500/20 px-1.5 py-0.2 rounded">
                      +R{spot.premiumSurchargeZar || 250} Premium
                    </span>
                  </div>
                )}

                {/* Wattage & Power Limits */}
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Circuit: <strong className="text-slate-200">{spot.circuitId}</strong></span>
                  <span className="flex items-center gap-1 text-amber-300 font-bold">
                    <Zap className="w-3 h-3 text-amber-400" />
                    Max {spotMaxWatts.toLocaleString()}W ({spot.powerKw} kW)
                  </span>
                </div>

                {isOccupied && (
                  <div className="p-2 rounded-lg bg-slate-950 text-[11px] text-slate-300 border border-slate-800">
                    Occupant: <strong className="text-white">{spot.occupantVendorName}</strong>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {isOccupied && (
                    <button
                      onClick={() => setSelectedSpotForReassign(spot)}
                      className="py-1.5 px-2 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold text-[10px] flex items-center justify-center space-x-1 col-span-2"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reassign Circuit Board</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setEditingSpotTraffic(spot);
                      setSurchargeInput(spot.premiumSurchargeZar || 300);
                      setTrafficLabelInput(spot.footTrafficLabel || '🔥 Main Walkway Entrance');
                    }}
                    className={`py-1.5 px-2 rounded-lg font-bold text-[10px] flex items-center justify-center space-x-1 ${
                      isHighTraffic
                        ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 col-span-2'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 col-span-2'
                    }`}
                  >
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>{isHighTraffic ? 'Edit Foot-Traffic Surcharge' : 'Mark High Foot Traffic (+Higher Rate)'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* High Foot Traffic Settings Modal / Card */}
        {editingSpotTraffic && (
          <div className="p-4 rounded-xl bg-slate-950 border-2 border-amber-500 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-xs font-black text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Flame className="w-4 h-4 text-amber-500" />
                Configure High Foot-Traffic Spot & Rate: {editingSpotTraffic.label}
              </h4>
              <button onClick={() => setEditingSpotTraffic(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Traffic Label / Descriptor:</label>
                <input
                  type="text"
                  value={trafficLabelInput}
                  onChange={(e) => setTrafficLabelInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-medium focus:border-amber-500"
                  placeholder="e.g. 🔥 Main Food Court Entrance"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Premium Surcharge Rate (ZAR):</label>
                <input
                  type="number"
                  value={surchargeInput}
                  onChange={(e) => setSurchargeInput(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-black text-amber-400 focus:border-amber-500"
                  placeholder="300"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              {editingSpotTraffic.isHighFootTraffic && (
                <button
                  onClick={() => handleSaveHighTrafficToggle(editingSpotTraffic, false)}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 font-bold text-xs border border-rose-500/40"
                >
                  Remove High Traffic Badge
                </button>
              )}

              <button
                onClick={() => handleSaveHighTrafficToggle(editingSpotTraffic, true)}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md"
              >
                Save High Traffic Badge & Charge R{surchargeInput} Premium
              </button>
            </div>
          </div>
        )}

        {/* Reassignment Modal */}
        {selectedSpotForReassign && (
          <div className="p-4 rounded-xl bg-slate-800 border border-indigo-500/50 space-y-3 animate-in fade-in">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Move className="w-4 h-4 text-indigo-400" />
              Move Electrical Load for {selectedSpotForReassign.label} ({selectedSpotForReassign.occupantVendorName})
            </h4>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => handleReassignCircuit('circuit-1')}
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-indigo-500 text-slate-200 text-center font-bold"
              >
                Zone A (Circuit 1)
              </button>
              <button
                onClick={() => handleReassignCircuit('circuit-2')}
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-indigo-500 text-slate-200 text-center font-bold"
              >
                Zone B (Circuit 2 - High Cap)
              </button>
              <button
                onClick={() => handleReassignCircuit('circuit-3')}
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-indigo-500 text-slate-200 text-center font-bold"
              >
                Zone C (Circuit 3)
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
