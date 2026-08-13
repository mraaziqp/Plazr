import React, { useState } from 'react';
import { MarketEvent, StallSpot, VendorProfile, SpotCategoryGroup } from '../../types';
import { SPOT_CATEGORY_CONFIGS, getSpotCategoryConfig } from '../../lib/spotUtils';
import { 
  Map, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Info, 
  ShieldCheck, 
  Sparkles,
  Building,
  Flame,
  AlertTriangle,
  Ruler,
  Filter
} from 'lucide-react';

interface StallPickerProps {
  market: MarketEvent;
  vendorProfile: VendorProfile;
  onClose: () => void;
  onConfirmStallSelection: (
    selectedSpot: StallSpot, 
    feeBreakdown: { baseStallFeeZar: number; vendrPlatformFeeZar: number; docVerificationFeeZar: number; totalZar: number }
  ) => void;
}

export const StallPicker: React.FC<StallPickerProps> = ({
  market,
  vendorProfile,
  onClose,
  onConfirmStallSelection,
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<SpotCategoryGroup | 'ALL'>('ALL');

  const availableSpots: StallSpot[] = market.stallGrid.length > 0 ? market.stallGrid : [
    {
      id: 'SPOT-A1',
      label: 'A1 - Prime Food Alley Corner',
      zoneType: 'Corner Spot (3x3m)',
      dimensions: '3m x 3m',
      categoryGroup: 'Food & Beverage',
      basePriceZar: market.pricing.cornerStallZar || 1250,
      isHighFootTraffic: true,
      footTrafficLabel: '🔥 Main Food Alley Entrance',
      premiumSurchargeZar: 350,
      maxPowerWatts: 4000,
      powerKw: 4.0,
      circuitId: 'circuit-1',
      status: 'available',
      xRatio: 20,
      yRatio: 25
    },
    {
      id: 'SPOT-A2',
      label: 'A2 - Powered Food Bay',
      zoneType: 'Powered Bay (3x3m + 15A)',
      dimensions: '3m x 3m',
      categoryGroup: 'Food & Beverage',
      basePriceZar: market.pricing.poweredBayZar || 1450,
      isHighFootTraffic: true,
      footTrafficLabel: '🔥 Central Courtyard Hub',
      premiumSurchargeZar: 300,
      maxPowerWatts: 3500,
      powerKw: 3.5,
      circuitId: 'circuit-1',
      status: 'occupied',
      occupantVendorName: 'Mama Africa Dumplings',
      xRatio: 45,
      yRatio: 25
    },
    {
      id: 'SPOT-A3',
      label: 'A3 - Food Truck Bay',
      zoneType: 'Food Truck Bay (5x3m)',
      dimensions: '5m x 3m',
      categoryGroup: 'Food & Beverage',
      basePriceZar: market.pricing.foodTruckZar || 1800,
      isHighFootTraffic: false,
      maxPowerWatts: 5000,
      powerKw: 5.0,
      circuitId: 'circuit-1',
      status: 'available',
      xRatio: 70,
      yRatio: 25
    },
    {
      id: 'SPOT-B1',
      label: 'B1 - Crafts Corner Spot',
      zoneType: 'Corner Spot (3x3m)',
      dimensions: '3m x 3m',
      categoryGroup: 'Artisanal & Crafts',
      basePriceZar: market.pricing.cornerStallZar || 1100,
      isHighFootTraffic: true,
      footTrafficLabel: '🔥 High Walkway Corner',
      premiumSurchargeZar: 250,
      maxPowerWatts: 1500,
      powerKw: 1.5,
      circuitId: 'circuit-2',
      status: 'available',
      xRatio: 20,
      yRatio: 65
    },
    {
      id: 'SPOT-B2',
      label: 'B2 - Standard Crafts 2x2',
      zoneType: 'Standard Middle (2x2m)',
      dimensions: '2m x 2m',
      categoryGroup: 'Artisanal & Crafts',
      basePriceZar: market.pricing.standardStallZar || 850,
      isHighFootTraffic: false,
      maxPowerWatts: 1000,
      powerKw: 1.0,
      circuitId: 'circuit-2',
      status: 'available',
      xRatio: 45,
      yRatio: 65
    }
  ];

  const filteredSpots = selectedCategoryFilter === 'ALL'
    ? availableSpots
    : availableSpots.filter(s => s.categoryGroup === selectedCategoryFilter);

  const [selectedSpotId, setSelectedSpotId] = useState<string>(
    availableSpots.find(s => s.status === 'available')?.id || availableSpots[0].id
  );

  const selectedSpot = availableSpots.find(s => s.id === selectedSpotId) || availableSpots[0];

  // Dynamic Price & Premium Surcharge Calculation
  const baseStallFeeZar = selectedSpot.basePriceZar;
  const isHighTraffic = selectedSpot.isHighFootTraffic;
  const premiumSurchargeZar = isHighTraffic ? (selectedSpot.premiumSurchargeZar || Math.round(baseStallFeeZar * 0.25)) : 0;
  const subtotal = baseStallFeeZar + premiumSurchargeZar;
  const vendrPlatformFeeZar = Math.round(subtotal * 0.05 * 100) / 100; // 5%
  const docVerificationFeeZar = 0;
  const totalZar = subtotal + vendrPlatformFeeZar + docVerificationFeeZar;

  // Power & Wattage Validation
  const spotMaxWatts = selectedSpot.maxPowerWatts || ((selectedSpot.powerKw || 1.0) * 1000);
  const vendorWattsNeeded = (vendorProfile.powerRequirementKw || 1.0) * 1000;
  const isPowerInsufficient = vendorWattsNeeded > spotMaxWatts;

  const handleProceed = () => {
    onConfirmStallSelection(selectedSpot, {
      baseStallFeeZar: subtotal,
      vendrPlatformFeeZar,
      docVerificationFeeZar,
      totalZar
    });
  };

  const spotCatMeta = getSpotCategoryConfig(selectedSpot.categoryGroup);

  return (
    <div className="fixed inset-0 z-50 bg-white text-slate-900 flex flex-col h-screen w-screen overflow-hidden animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Interactive Venue Map & Colour-Coded Stall Picker</h3>
            <p className="text-xs text-slate-500 font-medium">{market.title} • {market.displayDates}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center space-x-1 border border-slate-200 font-bold text-xs"
        >
          <X className="w-5 h-5" />
          <span className="hidden sm:inline">Close Map</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/60 max-w-7xl mx-auto w-full">
        
        {/* Colour Code System Legend & Category Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Spot Sector Colour Codes</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Organisers color-code spots by sector to ensure optimal visitor flow and vendor layout balance.
            </p>
          </div>

          {/* Legend Chips & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedCategoryFilter === 'ALL'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              All Spots ({availableSpots.length})
            </button>

            {(Object.keys(SPOT_CATEGORY_CONFIGS) as SpotCategoryGroup[]).map((catKey) => {
              const meta = SPOT_CATEGORY_CONFIGS[catKey];
              const isSelected = selectedCategoryFilter === catKey;
              const count = availableSpots.filter(s => s.categoryGroup === catKey).length;

              return (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategoryFilter(catKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border flex items-center space-x-1.5 ${
                    isSelected
                      ? `${meta.bgClass} text-white border-transparent shadow-xs scale-105 ring-2 ring-indigo-300`
                      : `${meta.lightBgClass} ${meta.textClass} ${meta.borderClass} hover:brightness-95`
                  }`}
                >
                  <span>{meta.emoji}</span>
                  <span>{catKey}</span>
                  <span className="text-[10px] bg-white/30 px-1.5 py-0.2 rounded-full font-black">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Visual Interactive Floorplan Grid */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-4 h-4 text-indigo-600" />
                <span>Venue Floorplan & Foot-Traffic Grid</span>
              </h4>
              <div className="flex items-center space-x-3 text-[11px] font-bold">
                <span className="flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span className="text-amber-800 font-extrabold">High Foot Traffic</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                  <span className="text-slate-500">Occupied</span>
                </span>
              </div>
            </div>

            {/* Interactive Visual Floor Map Canvas Container */}
            <div className="relative w-full h-[420px] md:h-[480px] rounded-2xl bg-white border-2 border-slate-200 p-4 flex flex-col justify-between overflow-hidden shadow-xs">
              
              {/* Background Grid Lines & Stage Indicator */}
              <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1.2px,transparent_1.2px)] [background-size:16px_16px] opacity-60"></div>
              
              {/* Main Stage / Entrance Label */}
              <div className="w-full py-1.5 bg-indigo-900 text-white border border-indigo-950 rounded-xl text-center text-[10px] font-black uppercase tracking-widest z-10 shadow-sm flex items-center justify-center space-x-2">
                <span>🎵 Main Stage & High Foot-Traffic Gate Entrance 🎵</span>
              </div>

              {/* Render Interactive Stall Spot Pins with Colour Coding & Traffic Highlights */}
              <div className="relative w-full flex-1 mt-4">
                {availableSpots.map((spot) => {
                  const isSelected = spot.id === selectedSpotId;
                  const isOccupied = spot.status === 'occupied';
                  const isFilteredOut = selectedCategoryFilter !== 'ALL' && spot.categoryGroup !== selectedCategoryFilter;
                  const catMeta = getSpotCategoryConfig(spot.categoryGroup);
                  const isHighTraffic = spot.isHighFootTraffic;

                  return (
                    <button
                      key={spot.id}
                      disabled={isOccupied}
                      onClick={() => setSelectedSpotId(spot.id)}
                      style={{
                        left: `${spot.xRatio}%`,
                        top: `${spot.yRatio}%`,
                      }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl border-2 font-bold text-xs transition-all flex flex-col items-center justify-center min-w-[70px] ${
                        isFilteredOut ? 'opacity-20 pointer-events-none' : ''
                      } ${
                        isOccupied
                          ? 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed opacity-60'
                          : isSelected
                          ? 'bg-slate-900 border-indigo-500 text-white scale-110 z-30 ring-4 ring-indigo-400 shadow-xl'
                          : `${catMeta.lightBgClass} ${catMeta.borderClass} ${catMeta.textClass} z-10 hover:scale-105 shadow-md`
                      }`}
                    >
                      {/* Flame Badge for High Traffic */}
                      {isHighTraffic && !isOccupied && (
                        <div className="absolute -top-2.5 -right-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white p-0.5 rounded-full shadow-xs animate-bounce">
                          <Flame className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div className="flex items-center space-x-1">
                        <span className="text-[10px]">{catMeta.emoji}</span>
                        <span className="text-[11px] font-black">{spot.id}</span>
                      </div>

                      <div className="flex items-center space-x-1 text-[9px] font-extrabold opacity-90">
                        <Ruler className="w-2.5 h-2.5" />
                        <span>{spot.dimensions || '3x3m'}</span>
                      </div>

                      <span className="text-[9px] font-black mt-0.5 bg-slate-900/10 px-1 rounded">
                        R{spot.basePriceZar + (isHighTraffic ? (spot.premiumSurchargeZar || 250) : 0)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Generator & Utility Zone Marker */}
              <div className="w-full py-1 bg-amber-50 border border-amber-200 rounded-lg text-center text-[10px] font-bold text-amber-900 flex items-center justify-center space-x-2 z-10">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>Substation DB Circuit (Loads DB-1: Max {market.circuits?.[0]?.maxCapacityKw || 12} kW Generator Backup)</span>
              </div>

            </div>

            <p className="text-[11px] text-slate-500 font-medium italic">
              💡 Tip: Spots with the 🔥 icon are designated by organisers as high foot-traffic locations near major walkways and stage access points.
            </p>
          </div>

          {/* Right Sidebar: Selected Stall Details, Wattage Checks & Dynamic Pricing */}
          <div className="space-y-4 bg-white p-5 md:p-6 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-xs">
            
            <div className="space-y-4">
              
              {/* Spot Header & Sector Badge */}
              <div className="border-b border-slate-100 pb-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black flex items-center space-x-1 ${spotCatMeta.badgeClass}`}>
                    <span>{spotCatMeta.emoji}</span>
                    <span>{selectedSpot.categoryGroup}</span>
                  </span>

                  <span className="text-xs font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1 border border-slate-200">
                    <Ruler className="w-3 h-3 text-slate-500" />
                    <span>{selectedSpot.dimensions || '3m x 3m'}</span>
                  </span>
                </div>

                <h4 className="text-lg font-black text-slate-900">{selectedSpot.label}</h4>
                <p className="text-xs text-slate-500 font-semibold">{selectedSpot.zoneType}</p>
              </div>

              {/* High Foot Traffic Banner if Applicable */}
              {isHighTraffic && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-300 text-amber-950 text-xs space-y-1 animate-in fade-in">
                  <div className="flex items-center space-x-1.5 font-black text-amber-900">
                    <Flame className="w-4 h-4 text-amber-600 animate-pulse" />
                    <span>{selectedSpot.footTrafficLabel || '🔥 Prime High Foot-Traffic Location'}</span>
                  </div>
                  <p className="text-[11px] text-amber-900 font-bold">
                    Prime position near stage & entrance flow • Surcharge applies
                  </p>
                </div>
              )}

              {/* Required Wattage & Power Infrastructure Section */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="font-bold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-600" /> Max Wattage Limit:
                  </span>
                  <span className="font-black text-slate-900">
                    {spotMaxWatts.toLocaleString()} W ({(spotMaxWatts / 1000).toFixed(1)} kW)
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 text-[11px]">
                  <span>Your Equipment Requirement:</span>
                  <span className={`font-extrabold ${isPowerInsufficient ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {vendorWattsNeeded.toLocaleString()} W ({(vendorWattsNeeded / 1000).toFixed(1)} kW)
                  </span>
                </div>

                {/* Wattage Warning Box */}
                {isPowerInsufficient && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-semibold space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold text-rose-900">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>Wattage Warning</span>
                    </div>
                    <p>
                      Your rig requires {vendorWattsNeeded}W, which exceeds this spot's {spotMaxWatts}W maximum threshold. Please choose a powered bay or adjust equipment.
                    </p>
                  </div>
                )}
              </div>

              {/* Dynamic Price & Fee Calculation */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <h5 className="font-extrabold text-slate-500 uppercase text-[10px] tracking-wider">
                  Stall Fee Breakdown
                </h5>

                <div className="flex justify-between text-slate-700 font-medium">
                  <span>Actual Stall Fee</span>
                  <span className="font-bold">R {(subtotal + vendrPlatformFeeZar).toFixed(2)}</span>
                </div>

                {isHighTraffic && (
                  <div className="flex justify-between text-amber-800 font-bold bg-amber-50 p-1.5 rounded border border-amber-200 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-600" /> Includes High Traffic Surcharge
                    </span>
                    <span>Included</span>
                  </div>
                )}

                <div className="flex justify-between pt-2 border-t border-slate-200 font-black text-emerald-700 text-sm">
                  <span>Total ZAR Payable</span>
                  <span>R {totalZar.toFixed(2)}</span>
                </div>

                <p className="pt-2 text-[11px] text-slate-500 font-medium leading-relaxed border-t border-slate-200/60">
                  * Plazr platform fee (5% / R {vendrPlatformFeeZar.toFixed(2)}) is automatically added to the actual stall fee and deducted separately from the payout once paid.
                </p>
              </div>
            </div>

            <button
              onClick={handleProceed}
              disabled={isPowerInsufficient}
              className={`w-full py-3.5 px-4 rounded-xl font-black text-sm flex items-center justify-center space-x-2 shadow-md transition-all mt-4 ${
                isPowerInsufficient
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <span>{isPowerInsufficient ? 'Wattage Limit Exceeded' : 'Proceed to Reserve Stall'}</span>
              {!isPowerInsufficient && <ArrowRight className="w-4 h-4" />}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
