import React, { useState } from 'react';
import { VendorApplication, LoadInSlot } from '../../types';
import { QRCodeSVG } from '../common/QRCodeSVG';
import { 
  X, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Printer, 
  Calendar,
  WifiOff,
  Phone,
  MessageCircle,
  Car,
  FileText,
  Map,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface VendorPassQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: VendorApplication;
  availableLoadInSlots: LoadInSlot[];
  onSelectLoadInSlot: (applicationId: string, slotId: string, timeWindow: string) => void;
}

export const VendorPassQRModal: React.FC<VendorPassQRModalProps> = ({
  isOpen,
  onClose,
  application,
  availableLoadInSlots,
  onSelectLoadInSlot,
}) => {
  if (!isOpen) return null;

  const [isSlotPickerOpen, setIsSlotPickerOpen] = useState(false);
  const [showOfflineInfo, setShowOfflineInfo] = useState(true);

  const securityHash = application.qrSecurityToken || `VNDR-PASS-${application.id.toUpperCase()}-${application.selectedSpotId}`;
  const isCheckedIn = application.checkInStatus === 'checked_in';

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl w-full max-w-md p-4 sm:p-6 space-y-4 shadow-2xl text-slate-100 relative max-h-[92vh] my-auto overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Offline Badge */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-200 text-xs font-semibold">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="text-[11px] font-extrabold">Offline Stall Pass Cached</span>
          </div>
          <span className="text-[10px] bg-purple-500/20 px-2 py-0.5 rounded-md border border-purple-400/30 text-purple-300">No Signal Needed</span>
        </div>

        {/* Pass Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 text-xs font-black mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>OFFICIAL VENDOR PASS • SPOT SECURED ({application.selectedSpotId})</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            {application.marketTitle}
          </h2>
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>{application.eventDate} • Authorized Trader Access</span>
          </p>
        </div>

        {/* QR Code Container */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
          
          <QRCodeSVG value={securityHash} size={160} fgColor={isCheckedIn ? "#34D399" : "#10B981"} />

          <div className="text-center space-y-1">
            <p className="font-mono text-xs text-emerald-400 font-bold tracking-wider">
              {securityHash}
            </p>
            <div className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[11px] font-extrabold ${
              isCheckedIn 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isCheckedIn ? `CHECKED IN AT ${application.checkedInAt || '06:14 AM'}` : 'READY FOR GATE SCAN'}</span>
            </div>
          </div>
        </div>

        {/* Vendor & Stall Details Card */}
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-700/60">
              <span className="text-slate-400">Vendor Business:</span>
              <span className="font-bold text-white text-right">{application.vendorName}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-700/60">
              <span className="text-slate-400">Allocated Bay / Zone:</span>
              <span className="font-black text-emerald-400 text-right">{application.selectedSpotZone}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-700/60">
              <span className="text-slate-400">PayFast Tx Reference:</span>
              <span className="font-mono text-slate-300 text-right">{application.payfastReference || 'PF-2026-88192'}</span>
            </div>

            {/* Load-In Arrival Slot */}
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> Load-in Arrival Window:
              </span>
              <span className="font-bold text-indigo-300">
                {application.loadInSlotTime || '06:00 - 06:30 AM (Slot A)'}
              </span>
            </div>
          </div>

          {/* Collapsible Offline Stall Info Details */}
          <button
            onClick={() => setShowOfflineInfo(!showOfflineInfo)}
            className="w-full py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-purple-500/30 text-xs font-bold text-purple-300 flex items-center justify-between transition-all"
          >
            <span className="flex items-center gap-2">
              <Map className="w-4 h-4 text-purple-400" />
              <span>Offline Stall Info & Load-In Instructions</span>
            </span>
            {showOfflineInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showOfflineInfo && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs animate-in slide-in-from-top-2 duration-200">
              
              {/* Load-In Instructions & Gate Code */}
              <div className="space-y-1 pb-2.5 border-b border-slate-800">
                <div className="text-[11px] font-black uppercase text-purple-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Gate & Unloading Instructions</span>
                </div>
                <p className="text-slate-300 text-[11px] font-medium leading-relaxed mt-1">
                  Enter via <strong className="text-white">Gate 3 (South Entrance)</strong> using Access Code <strong className="text-amber-400 font-mono">#4921</strong>. Drive directly to Unloading Bay #2 for 20-minute offload window.
                </p>
              </div>

              {/* Parking Pass Info */}
              <div className="space-y-1 pb-2.5 border-b border-slate-800">
                <div className="text-[11px] font-black uppercase text-purple-400 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5" />
                  <span>Offline Parking Pass</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Vendor Parking Permit:</span>
                  <span className="font-mono text-emerald-400 font-bold">PERMIT #P-104 (South Vendor Lot)</span>
                </div>
              </div>

              {/* Organiser Direct Emergency Contact */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-black uppercase text-purple-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Organiser Direct Contact</span>
                </div>
                <p className="text-[11px] text-slate-400">Cape Town Market Operations Desk (08:00 - 18:00)</p>
                
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href="tel:+27825550192"
                    className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-bold flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call Organiser</span>
                  </a>
                  
                  <a
                    href="https://wa.me/27825550192"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-200 text-[11px] font-bold flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp Desk</span>
                  </a>
                </div>
              </div>

            </div>
          )}

          {/* Load-In Slot Selector Toggle */}
          <button
            onClick={() => setIsSlotPickerOpen(!isSlotPickerOpen)}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center justify-between transition-all"
          >
            <span className="flex items-center gap-1.5 text-indigo-300">
              <Clock className="w-3.5 h-3.5" />
              <span>Change Load-in Arrival Slot</span>
            </span>
            <span className="text-[10px] text-slate-400">{isSlotPickerOpen ? 'Hide Options' : 'Select Window'}</span>
          </button>

          {/* Slot Selection Options */}
          {isSlotPickerOpen && (
            <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-2 animate-in slide-in-from-top-2 duration-200">
              <p className="text-[11px] font-bold text-slate-300">Select Staggered Gate Arrival Window:</p>
              <div className="space-y-1.5">
                {availableLoadInSlots.map((slot) => {
                  const isSelected = application.loadInSlotId === slot.id || (!application.loadInSlotId && slot.id === 'slot-a');
                  return (
                    <button
                      key={slot.id}
                      onClick={() => {
                        onSelectLoadInSlot(application.id, slot.id, slot.timeWindow);
                        setIsSlotPickerOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-white text-[11px]">{slot.timeWindow} — {slot.title}</div>
                        <div className="text-[10px] text-slate-400">{slot.description}</div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => window.print()}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all border border-slate-700"
          >
            <Printer className="w-4 h-4" />
            <span>Print Pass</span>
          </button>

          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center justify-center space-x-1.5 transition-all shadow-lg shadow-emerald-600/30"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Offline Pass</span>
          </button>
        </div>

      </div>
    </div>
  );
};
