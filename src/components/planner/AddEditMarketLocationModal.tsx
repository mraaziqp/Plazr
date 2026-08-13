import React, { useState } from 'react';
import { MarketEvent, CategoryTag, StallSpot, PowerCircuit } from '../../types';
import { 
  MapPin, 
  Building, 
  Plus, 
  X, 
  Check, 
  Calendar, 
  DollarSign, 
  Zap, 
  Users, 
  Sparkles, 
  CheckCircle2,
  Navigation,
  Tag
} from 'lucide-react';

interface AddEditMarketLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMarket: (market: MarketEvent, broadcastDropAlert?: boolean) => void;
  existingMarket?: MarketEvent;
}

const CATEGORY_OPTIONS: CategoryTag[] = [
  '#ArtisanalFood',
  '#GeekCulture',
  '#VintageFashion',
  '#Crafts',
  '#Halal',
  '#Vegan',
  '#LocalProduce',
  '#BeautyWellness'
];

export const AddEditMarketLocationModal: React.FC<AddEditMarketLocationModalProps> = ({
  isOpen,
  onClose,
  onSaveMarket,
  existingMarket
}) => {
  const [title, setTitle] = useState(existingMarket?.title || '');
  const [organizer, setOrganizer] = useState(existingMarket?.organizer || 'Plazr Event Partner');
  const [locationName, setLocationName] = useState(existingMarket?.locationName || '');
  const [address, setAddress] = useState(existingMarket?.address || '');
  const [city, setCity] = useState<string>(existingMarket?.city || 'Cape Town');
  const [suburb, setSuburb] = useState(existingMarket?.suburb || '');
  const [operatingZonesInvited, setOperatingZonesInvited] = useState<string[]>(
    existingMarket?.operatingZonesInvited || ['Woodstock & Salt River', 'Bo-Kaap & City Centre']
  );
  const [targetVendorRadiusKm, setTargetVendorRadiusKm] = useState<number>(existingMarket?.targetVendorRadiusKm || 50);
  
  const [eventStartDate, setEventStartDate] = useState(existingMarket?.eventStartDate || '2026-10-15');
  const [eventEndDate, setEventEndDate] = useState(existingMarket?.eventEndDate || '2026-10-16');
  const [displayDates, setDisplayDates] = useState(existingMarket?.displayDates || 'Oct 15 - Oct 16, 2026');
  const [description, setDescription] = useState(existingMarket?.description || '');
  
  const [categories, setCategories] = useState<CategoryTag[]>(
    existingMarket?.categories || ['#ArtisanalFood', '#Crafts', '#VintageFashion']
  );
  
  // Pricing
  const [standardStallZar, setStandardStallZar] = useState(existingMarket?.pricing.standardStallZar || 450);
  const [cornerStallZar, setCornerStallZar] = useState(existingMarket?.pricing.cornerStallZar || 650);
  const [poweredBayZar, setPoweredBayZar] = useState(existingMarket?.pricing.poweredBayZar || 850);
  const [foodTruckZar, setFoodTruckZar] = useState(existingMarket?.pricing.foodTruckZar || 1200);

  // Capacity & Backup
  const [foodSpotsLeft, setFoodSpotsLeft] = useState(existingMarket?.inventory.foodSpotsLeft || 10);
  const [apparelSpotsLeft, setApparelSpotsLeft] = useState(existingMarket?.inventory.apparelSpotsLeft || 15);
  const [craftsSpotsLeft, setCraftsSpotsLeft] = useState(existingMarket?.inventory.craftsSpotsLeft || 10);
  const [loadsheddingBackupType, setLoadsheddingBackupType] = useState(
    existingMarket?.loadsheddingBackup.type || '60 kVA Silent Diesel Generator + Dual Inverter'
  );
  const [footTrafficTarget, setFootTrafficTarget] = useState(existingMarket?.expectedFootTraffic.target || 6500);
  const [broadcastDropAlert, setBroadcastDropAlert] = useState<boolean>(true);

  const [newZoneInput, setNewZoneInput] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleCategory = (cat: CategoryTag) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter(c => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (newZoneInput.trim() && !operatingZonesInvited.includes(newZoneInput.trim())) {
      setOperatingZonesInvited([...operatingZonesInvited, newZoneInput.trim()]);
      setNewZoneInput('');
    }
  };

  const removeZone = (zone: string) => {
    setOperatingZonesInvited(operatingZonesInvited.filter(z => z !== zone));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !locationName || !address) return;

    // Default circuits and grid spots for new market
    const defaultCircuits: PowerCircuit[] = [
      { id: 'circuit-1', name: 'Main Food Truck Circuit A (10 kW)', maxCapacityKw: 10, currentLoadKw: 0, isOverloaded: false, assignedSpotIds: [] },
      { id: 'circuit-2', name: 'Crafts & Retail Bay B (8 kW)', maxCapacityKw: 8, currentLoadKw: 0, isOverloaded: false, assignedSpotIds: [] },
      { id: 'circuit-3', name: 'Stage & Refrigeration C (12 kW)', maxCapacityKw: 12, currentLoadKw: 0, isOverloaded: false, assignedSpotIds: [] }
    ];

    const defaultGrid: StallSpot[] = [
      { id: 'spot-101', label: 'Spot A1 - Prime Corner', zoneType: 'Corner Spot (3x3m)', basePriceZar: cornerStallZar, powerKw: 2.0, maxPowerWatts: 2000, dimensions: '3x3m', categoryGroup: 'Food & Beverage', circuitId: 'circuit-1', status: 'available', xRatio: 15, yRatio: 25 },
      { id: 'spot-102', label: 'Spot A2 - Standard Middle', zoneType: 'Standard Middle (2x2m)', basePriceZar: standardStallZar, powerKw: 1.0, maxPowerWatts: 1000, dimensions: '2x2m', categoryGroup: 'Artisanal & Crafts', circuitId: 'circuit-1', status: 'available', xRatio: 35, yRatio: 25 },
      { id: 'spot-103', label: 'Spot A3 - Powered Bay (15A)', zoneType: 'Powered Bay (3x3m + 15A)', basePriceZar: poweredBayZar, powerKw: 3.5, maxPowerWatts: 3500, dimensions: '3x3m', categoryGroup: 'Food & Beverage', circuitId: 'circuit-1', status: 'available', xRatio: 55, yRatio: 25 },
      { id: 'spot-104', label: 'Spot FT1 - Food Truck Bay', zoneType: 'Food Truck Bay (5x3m)', basePriceZar: foodTruckZar, powerKw: 4.5, maxPowerWatts: 4500, dimensions: '5x3m', categoryGroup: 'Food & Beverage', circuitId: 'circuit-1', status: 'available', xRatio: 80, yRatio: 25 },
      { id: 'spot-105', label: 'Spot B1 - Corner Entrance', zoneType: 'Corner Spot (3x3m)', basePriceZar: cornerStallZar, powerKw: 2.0, maxPowerWatts: 2000, dimensions: '3x3m', categoryGroup: 'Apparel & Vintage', circuitId: 'circuit-2', status: 'available', xRatio: 15, yRatio: 65 },
      { id: 'spot-106', label: 'Spot B2 - Standard Craft', zoneType: 'Standard Middle (2x2m)', basePriceZar: standardStallZar, powerKw: 1.0, maxPowerWatts: 1000, dimensions: '2x2m', categoryGroup: 'Artisanal & Crafts', circuitId: 'circuit-2', status: 'available', xRatio: 35, yRatio: 65 }
    ];

    const marketData: MarketEvent = {
      id: existingMarket?.id || `market-custom-${Date.now()}`,
      title,
      organizer: organizer || 'Plazr Event Partner',
      locationName,
      address,
      city: city as any,
      suburb: suburb || locationName,
      operatingZonesInvited,
      targetVendorRadiusKm,
      coordinates: existingMarket?.coordinates || { lat: -33.9249, lng: 18.4241 },
      eventStartDate,
      eventEndDate,
      displayDates,
      categories,
      coverImage: existingMarket?.coverImage || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
      description: description || 'Exciting community street market gathering top artisanal food vendors, designers, and live entertainment.',
      inventory: {
        foodSpotsLeft,
        apparelSpotsLeft,
        craftsSpotsLeft,
        totalSpotsLeft: foodSpotsLeft + apparelSpotsLeft + craftsSpotsLeft
      },
      isPromoted: true,
      promotionTier: 'featured_gold',
      expectedFootTraffic: {
        target: footTrafficTarget,
        historicalAverage: Math.round(footTrafficTarget * 0.9)
      },
      pricing: {
        standardStallZar,
        cornerStallZar,
        poweredBayZar,
        foodTruckZar
      },
      stallGrid: existingMarket?.stallGrid || defaultGrid,
      circuits: existingMarket?.circuits || defaultCircuits,
      loadsheddingBackup: {
        active: true,
        type: loadsheddingBackupType
      },
      performance: existingMarket?.performance || {
        overallRating: 4.9,
        totalVendorReviews: 18,
        satisfactionRatePercent: 96,
        avgDailyVendorRevenueZar: 7800,
        footTrafficConversionRatePercent: 26,
        repeatVendorRatePercent: 85,
        topSellingCategory: categories[0] || '#ArtisanalFood',
        salesVelocityScore: 'High',
        categoryDemandBreakdown: [
          { category: categories[0] || '#ArtisanalFood', demandSharePercent: 45, avgRevenueZar: 8500 }
        ],
        reviews: []
      }
    };

    onSaveMarket(marketData, broadcastDropAlert);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-10 my-8 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">
                {existingMarket ? 'Edit Market Location & Event Details' : 'Publish New Market Event & Location'}
              </h3>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Specify venue address, city, operating catchment area, and stall allocations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-900">
          
          {success && (
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-300 flex items-center space-x-3 animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-extrabold text-xs">Market Location Published!</p>
                <p className="text-[11px] text-emerald-700">Vendors in your operating catchment can now discover and apply for stall spots.</p>
              </div>
            </div>
          )}

          {/* 1. Basic Market Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">1. Market Event Identity</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Market Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Kloof Street Night Feast & Artisanal Pop-up"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Organizer / Series Brand</label>
                <input
                  type="text"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  placeholder="e.g. City Night Markets Collective"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Market Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Highlight what makes this market unique, visitor attractions, live entertainment, etc."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* 2. Physical Venue & Location Details */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">2. Venue Address & Physical Location</h4>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Mapped for GPS & Navigation</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Venue / Building Name *</label>
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. The Old Biscuit Mill / Kloof Street Park"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Full Street Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 375 Albert Rd, Woodstock, 7925"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">City Hub</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="Cape Town">Cape Town</option>
                  <option value="Stellenbosch">Stellenbosch & Winelands</option>
                  <option value="Johannesburg">Johannesburg</option>
                  <option value="Pretoria">Pretoria</option>
                  <option value="Durban">Durban & Umhlanga</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Suburb / Micro-Zone</label>
                <input
                  type="text"
                  value={suburb}
                  onChange={(e) => setSuburb(e.target.value)}
                  placeholder="e.g. Woodstock / City Bowl"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          {/* 3. Vendor Operating Catchment & Invited Zones */}
          <div className="p-5 bg-indigo-50/70 rounded-2xl border border-indigo-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-indigo-700" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">3. Target Vendor Operating Catchment</h4>
              </div>
              <span className="text-[10px] font-extrabold text-indigo-800 bg-white px-2.5 py-0.5 rounded-full border border-indigo-200">
                {targetVendorRadiusKm} km Catchment Radius
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 mb-1.5">Invited Operating Zones & Suburbs</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {operatingZonesInvited.map((zone) => (
                  <span
                    key={zone}
                    className="px-3 py-1 rounded-full bg-white text-indigo-900 text-xs font-black border border-indigo-200 flex items-center space-x-1 shadow-2xs"
                  >
                    <span>{zone}</span>
                    <button
                      type="button"
                      onClick={() => removeZone(zone)}
                      className="p-0.5 hover:bg-slate-200 rounded-full text-slate-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newZoneInput}
                  onChange={(e) => setNewZoneInput(e.target.value)}
                  placeholder="Add invited vendor zone (e.g. Green Point, Rosebank)"
                  className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                <button
                  type="button"
                  onClick={handleAddZone}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
                >
                  Add Zone
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Maximum Vendor Radius</label>
              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={targetVendorRadiusKm}
                onChange={(e) => setTargetVendorRadiusKm(Number(e.target.value))}
                className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>

          {/* 4. Event Dates & Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-slate-700" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">4. Event Schedule</h4>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Display Dates String</label>
                <input
                  type="text"
                  value={displayDates}
                  onChange={(e) => setDisplayDates(e.target.value)}
                  placeholder="e.g. Sept 12 - Sept 13, 2026"
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={eventStartDate}
                    onChange={(e) => setEventStartDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={eventEndDate}
                    onChange={(e) => setEventEndDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">5. Target Goods Categories</h4>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {CATEGORY_OPTIONS.map((cat) => {
                  const isSelected = categories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-all border ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* 5. Pricing & Power Specs */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">6. Stall Rates & Loadshedding Backup</h4>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Standard Stall (R)</label>
                <input
                  type="number"
                  value={standardStallZar}
                  onChange={(e) => setStandardStallZar(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Corner Spot (R)</label>
                <input
                  type="number"
                  value={cornerStallZar}
                  onChange={(e) => setCornerStallZar(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Powered Bay (R)</label>
                <input
                  type="number"
                  value={poweredBayZar}
                  onChange={(e) => setPoweredBayZar(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Food Truck Bay (R)</label>
                <input
                  type="number"
                  value={foodTruckZar}
                  onChange={(e) => setFoodTruckZar(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 mb-1 flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Loadshedding Backup Power Specification</span>
              </label>
              <input
                type="text"
                value={loadsheddingBackupType}
                onChange={(e) => setLoadsheddingBackupType(e.target.value)}
                placeholder="e.g. 60 kVA Silent Diesel Generator + Dual Inverter Hybrid"
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium"
              />
            </div>
          </div>

          {/* Market Drop Broadcast Alert Checkbox */}
          <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <Sparkles className="w-5 h-5 text-purple-600 shrink-0 animate-pulse" />
              <div>
                <h5 className="text-xs font-black text-purple-900">Broadcast Instant Market Drop Notification</h5>
                <p className="text-[11px] text-purple-700 font-medium">Alert all registered vendors immediately about this market drop & 48-hour priority application window.</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={broadcastDropAlert}
              onChange={(e) => setBroadcastDropAlert(e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer shrink-0"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md transition-all flex items-center justify-center space-x-2 active:scale-95"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{existingMarket ? 'Save Location & Market Changes' : 'Publish Market Location & Open Vendor Applications'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
