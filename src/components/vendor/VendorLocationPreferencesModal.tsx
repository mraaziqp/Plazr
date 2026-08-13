import React, { useState } from 'react';
import { VendorProfile, VendorLocationPreferences } from '../../types';
import { 
  MapPin, 
  Navigation, 
  X, 
  Check, 
  Compass, 
  Building, 
  Sliders, 
  Target, 
  Sparkles, 
  Plus, 
  ShieldCheck,
  CheckCircle2,
  Map
} from 'lucide-react';

interface VendorLocationPreferencesModalProps {
  vendorProfile: VendorProfile;
  isOpen: boolean;
  onClose: () => void;
  onSavePreferences: (updatedPreferences: VendorLocationPreferences) => void;
}

const SA_CITIES = [
  'Cape Town',
  'Stellenbosch & Winelands',
  'Johannesburg',
  'Pretoria',
  'Durban & Ballito',
  'Garden Route',
  'Gqeberha / PE'
];

const POPULAR_ZONES = [
  'Woodstock & Salt River',
  'Bo-Kaap & City Centre',
  'Sea Point & Atlantic Seaboard',
  'Rosebank & Sandton',
  'Kirstenbosch & Southern Suburbs',
  'Stellenbosch Winelands',
  'Durban North & Umhlanga',
  'Pretoria East',
  'Kloof Street & Tamboerskloof'
];

const MARKET_FORMATS = [
  'Weekend Street Markets',
  'Night Food Festivals',
  'Artisanal Indoor Halls',
  'Coastal Pop-ups',
  'Food Truck Rallies',
  'Corporate Pop-up Hubs'
];

export const VendorLocationPreferencesModal: React.FC<VendorLocationPreferencesModalProps> = ({
  vendorProfile,
  isOpen,
  onClose,
  onSavePreferences
}) => {
  const initialPrefs = vendorProfile.locationPreferences || {
    baseAddress: '124 Wale Street, Bo-Kaap',
    baseCity: 'Cape Town',
    baseSuburb: 'Bo-Kaap & City Centre',
    operatingCities: ['Cape Town', 'Stellenbosch & Winelands'],
    preferredZones: ['Woodstock & Salt River', 'Bo-Kaap & City Centre', 'Sea Point & Atlantic Seaboard'],
    maxTravelDistanceKm: 60,
    preferredMarketTypes: ['Weekend Street Markets', 'Night Food Festivals']
  };

  const [baseAddress, setBaseAddress] = useState(initialPrefs.baseAddress);
  const [baseCity, setBaseCity] = useState(initialPrefs.baseCity);
  const [baseSuburb, setBaseSuburb] = useState(initialPrefs.baseSuburb);
  const [operatingCities, setOperatingCities] = useState<string[]>(initialPrefs.operatingCities);
  const [preferredZones, setPreferredZones] = useState<string[]>(initialPrefs.preferredZones);
  const [maxTravelDistanceKm, setMaxTravelDistanceKm] = useState<number>(initialPrefs.maxTravelDistanceKm);
  const [preferredMarketTypes, setPreferredMarketTypes] = useState<string[]>(initialPrefs.preferredMarketTypes);
  
  const [customZoneInput, setCustomZoneInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleCity = (city: string) => {
    if (operatingCities.includes(city)) {
      setOperatingCities(operatingCities.filter(c => c !== city));
    } else {
      setOperatingCities([...operatingCities, city]);
    }
  };

  const toggleZone = (zone: string) => {
    if (preferredZones.includes(zone)) {
      setPreferredZones(preferredZones.filter(z => z !== zone));
    } else {
      setPreferredZones([...preferredZones, zone]);
    }
  };

  const handleAddCustomZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (customZoneInput.trim() && !preferredZones.includes(customZoneInput.trim())) {
      setPreferredZones([...preferredZones, customZoneInput.trim()]);
      setCustomZoneInput('');
    }
  };

  const toggleMarketType = (type: string) => {
    if (preferredMarketTypes.includes(type)) {
      setPreferredMarketTypes(preferredMarketTypes.filter(t => t !== type));
    } else {
      setPreferredMarketTypes([...preferredMarketTypes, type]);
    }
  };

  const handleSave = () => {
    const updated: VendorLocationPreferences = {
      baseAddress,
      baseCity,
      baseSuburb,
      operatingCities,
      preferredZones,
      maxTravelDistanceKm,
      preferredMarketTypes
    };
    onSavePreferences(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-10 my-8 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black tracking-tight">Location & Operating Preferences</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase">
                  Matching Engine
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Set where your business is based and which South African market hubs you want to trade in
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-900">
          
          {/* Saved Success Banner */}
          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-300 flex items-center space-x-3 animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-extrabold text-xs">Operating Locations Updated!</p>
                <p className="text-[11px] text-emerald-700">Market discovery matches will now prioritize your chosen operating zones.</p>
              </div>
            </div>
          )}

          {/* Section 1: Base Physical Location */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">1. Base Home / Kitchen Location</h4>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Used to calculate travel distances to venue</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Street Address or Kitchen Base</label>
                <input
                  type="text"
                  value={baseAddress}
                  onChange={(e) => setBaseAddress(e.target.value)}
                  placeholder="e.g. 124 Wale Street, Bo-Kaap"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Primary Suburb / Neighborhood</label>
                <input
                  type="text"
                  value={baseSuburb}
                  onChange={(e) => setBaseSuburb(e.target.value)}
                  placeholder="e.g. Bo-Kaap & City Centre"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Base Home City</label>
              <select
                value={baseCity}
                onChange={(e) => setBaseCity(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="Cape Town">Cape Town (Western Cape)</option>
                <option value="Stellenbosch & Winelands">Stellenbosch & Winelands</option>
                <option value="Johannesburg">Johannesburg (Gauteng)</option>
                <option value="Pretoria">Pretoria (Gauteng)</option>
                <option value="Durban">Durban & North Coast (KZN)</option>
                <option value="Garden Route">Garden Route (George/Knysna)</option>
              </select>
            </div>
          </div>

          {/* Section 2: Target Operating Cities & SA Hubs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">2. Target SA Cities & Trading Hubs</h4>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Select all cities you are willing to trade in</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {SA_CITIES.map((city) => {
                const isSelected = operatingCities.includes(city);
                return (
                  <button
                    key={city}
                    type="button"
                    onClick={() => toggleCity(city)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all border flex items-center space-x-1.5 ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{city}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Preferred Suburbs & Micro-Zones */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">3. Preferred Local Zones & Suburbs</h4>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">High priority trading zones</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {POPULAR_ZONES.map((zone) => {
                const isSelected = preferredZones.includes(zone);
                return (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => toggleZone(zone)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-900 border-indigo-300 font-black'
                        : 'bg-slate-100 text-slate-600 border-slate-200/80 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {zone}
                  </button>
                );
              })}
            </div>

            {/* Custom Zone Input */}
            <form onSubmit={handleAddCustomZone} className="flex gap-2 pt-1">
              <input
                type="text"
                value={customZoneInput}
                onChange={(e) => setCustomZoneInput(e.target.value)}
                placeholder="Add another preferred suburb / area..."
                className="flex-1 px-3.5 py-1.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 transition-all"
              >
                Add Zone
              </button>
            </form>
          </div>

          {/* Section 4: Maximum Travel Distance */}
          <div className="p-5 bg-indigo-50/60 rounded-2xl border border-indigo-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-indigo-700" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">4. Maximum Travel Radius</h4>
              </div>
              <span className="text-xs font-black text-indigo-900 bg-white px-3 py-1 rounded-full border border-indigo-200 shadow-2xs">
                {maxTravelDistanceKm} km Radius
              </span>
            </div>

            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={maxTravelDistanceKm}
              onChange={(e) => setMaxTravelDistanceKm(Number(e.target.value))}
              className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />

            <div className="flex justify-between text-[10px] text-slate-600 font-bold">
              <span>10 km (Local Only)</span>
              <span>50 km (Metro Area)</span>
              <span>120 km (Regional)</span>
              <span>200+ km (Inter-city)</span>
            </div>
          </div>

          {/* Section 5: Preferred Market Formats */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">5. Preferred Market Formats</h4>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {MARKET_FORMATS.map((format) => {
                const isSelected = preferredMarketTypes.includes(format);
                return (
                  <button
                    key={format}
                    type="button"
                    onClick={() => toggleMarketType(format)}
                    className={`p-2.5 rounded-xl text-xs font-extrabold text-left transition-all border flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-50 text-amber-950 border-amber-300 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{format}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 6: Visual Location Radar Preview */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 relative overflow-hidden shadow-md">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-2">
                <Map className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-black uppercase tracking-wider">Trading Radius Coverage</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-bold">
                📍 Based in {baseSuburb || baseCity}
              </span>
            </div>

            <div className="relative z-10 flex flex-wrap gap-2 text-xs">
              <span className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-xl text-slate-300">
                🚀 Operating in: <strong>{operatingCities.join(', ')}</strong>
              </span>
              <span className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-xl text-slate-300">
                🎯 {preferredZones.length} Preferred Local Zones
              </span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-slate-300 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md transition-all flex items-center space-x-2 active:scale-95"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Save Location Preferences</span>
          </button>
        </div>

      </div>
    </div>
  );
};
