import React, { useState } from 'react';
import { MarketEvent, VendorApplication, LoadInSlot } from '../../types';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  QrCode, 
  FileSpreadsheet, 
  Search, 
  ShieldCheck, 
  Building2, 
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';

interface LoadInGateManagerProps {
  market: MarketEvent;
  applications: VendorApplication[];
  onCheckInVendor: (applicationId: string) => void;
  onOpenQRScanner: () => void;
  onOpenComplianceExport: () => void;
}

export const LoadInGateManager: React.FC<LoadInGateManagerProps> = ({
  market,
  applications,
  onCheckInVendor,
  onOpenQRScanner,
  onOpenComplianceExport,
}) => {
  const [selectedSlotFilter, setSelectedSlotFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const defaultSlots: LoadInSlot[] = market.loadInSlots || [
    {
      id: 'slot-a',
      timeWindow: '06:00 - 06:30 AM',
      title: 'Slot A - Heavy Food Rigs & Gas Griddles',
      description: 'High-draw electrical equipment and commercial gas setups',
      maxCapacity: 10,
      assignedVendorCount: 8,
      categoryRestriction: '#ArtisanalFood'
    },
    {
      id: 'slot-b',
      timeWindow: '06:30 - 07:00 AM',
      title: 'Slot B - Bakery, Beverage & Cold Prep',
      description: 'Standard powered bays and refrigeration units',
      maxCapacity: 12,
      assignedVendorCount: 10
    },
    {
      id: 'slot-c',
      timeWindow: '07:00 - 07:30 AM',
      title: 'Slot C - Botanical Ceramics, Crafts & Art',
      description: 'Heavy displays and delicate craft pop-ups',
      maxCapacity: 12,
      assignedVendorCount: 9,
      categoryRestriction: '#Crafts'
    },
    {
      id: 'slot-d',
      timeWindow: '07:30 - 08:00 AM',
      title: 'Slot D - Vintage Fashion & Apparel',
      description: 'Racks, mirrors, and lighting displays',
      maxCapacity: 10,
      assignedVendorCount: 7,
      categoryRestriction: '#VintageFashion'
    }
  ];

  const totalVendors = applications.length;
  const checkedInCount = applications.filter(a => a.checkInStatus === 'checked_in').length;
  const checkInPercentage = totalVendors > 0 ? Math.round((checkedInCount / totalVendors) * 100) : 0;

  const filteredApps = applications.filter((app) => {
    const matchesSlot = selectedSlotFilter === 'all' || app.loadInSlotId === selectedSlotFilter || (!app.loadInSlotId && selectedSlotFilter === 'slot-a');
    const matchesSearch = app.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) || app.selectedSpotId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSlot && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Load-In Schedule & Gate Manager
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Arrival window tracking & gate pass QR check-ins
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={onOpenQRScanner}
              className="py-2.5 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center space-x-2 shadow-xs transition-all"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>Scan Gate QR Pass</span>
            </button>

            <button
              onClick={onOpenComplianceExport}
              className="py-2.5 px-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center space-x-1.5 transition-all border border-slate-200"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Compliance Audit CSV</span>
            </button>
          </div>
        </div>

        {/* Real-time Gate Arrival Progress Bar */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Venue Gate On-Site Check-In Status:
            </span>
            <span className="font-black text-slate-900">
              {checkedInCount} / {totalVendors} Vendors Checked In ({checkInPercentage}%)
            </span>
          </div>

          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              style={{ width: `${Math.max(12, checkInPercentage)}%` }}
              className="h-full rounded-full bg-slate-900 transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {/* Staggered Time Slot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {defaultSlots.map((slot) => {
          const isSelected = selectedSlotFilter === slot.id;
          return (
            <button
              key={slot.id}
              onClick={() => setSelectedSlotFilter(isSelected ? 'all' : slot.id)}
              className={`p-4 rounded-2xl border text-left transition-all space-y-2 relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isSelected ? 'bg-slate-800 text-indigo-300 border border-slate-700' : 'bg-slate-100 text-indigo-700 border border-slate-200'
                }`}>
                  {slot.timeWindow}
                </span>
                <span className={`text-[10px] font-mono ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {slot.assignedVendorCount} Stalls
                </span>
              </div>

              <div>
                <h4 className={`text-xs font-bold leading-snug ${isSelected ? 'text-white' : 'text-slate-900'}`}>{slot.title}</h4>
                <p className={`text-[10px] mt-1 line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>{slot.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search & Gate List */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Gate Arrival Vendor Manifest ({filteredApps.length})</span>
          </h3>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter vendor name or stall ID..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 font-medium"
            />
          </div>
        </div>

        {/* Vendor Gate List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredApps.map((app) => {
            const isCheckedIn = app.checkInStatus === 'checked_in';

            return (
              <div
                key={app.id}
                className={`p-4 rounded-xl border text-xs space-y-3 transition-all ${
                  isCheckedIn ? 'bg-emerald-50/50 border-emerald-200 shadow-xs' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{app.vendorName}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Allocated Bay: <strong className="text-emerald-700">{app.selectedSpotZone}</strong> ({app.selectedSpotId})
                    </p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border shrink-0 ${
                    isCheckedIn
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}>
                    {isCheckedIn ? 'ON-SITE & CHECKED IN' : 'EXPECTED AT GATE'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 text-[11px] text-slate-700 flex items-center justify-between border border-slate-200">
                  <span className="flex items-center gap-1 text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" /> Arrival Slot:
                  </span>
                  <span className="font-bold text-slate-900">
                    {app.loadInSlotTime || '06:00 - 06:30 AM (Slot A)'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-mono text-slate-400">
                    PayFast Ref: {app.payfastReference || 'PF-2026-88192'}
                  </span>

                  {!isCheckedIn ? (
                    <button
                      onClick={() => onCheckInVendor(app.id)}
                      className="py-1.5 px-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[11px] flex items-center space-x-1 shadow-xs transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Check In at Gate</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Gate Entry via verifiedbizlink.co.za ({app.checkedInAt || '06:14 AM'})</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
