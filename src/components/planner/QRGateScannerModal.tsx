import React, { useState } from 'react';
import { MarketEvent, VendorApplication } from '../../types';
import { 
  X, 
  QrCode, 
  CheckCircle2, 
  Camera, 
  Sparkles, 
  Search, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Zap,
  Clock,
  Building2
} from 'lucide-react';

interface QRGateScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  market: MarketEvent;
  applications: VendorApplication[];
  onCheckInVendor: (applicationId: string) => void;
}

export const QRGateScannerModal: React.FC<QRGateScannerModalProps> = ({
  isOpen,
  onClose,
  market,
  applications,
  onCheckInVendor,
}) => {
  if (!isOpen) return null;

  const [selectedVendorForSimulatedScan, setSelectedVendorForSimulatedScan] = useState<VendorApplication | null>(
    applications[0] || null
  );
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    vendorName: string;
    spotId: string;
    timestamp: string;
  } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSimulateScan = (app: VendorApplication) => {
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      onCheckInVendor(app.id);
      setIsScanning(false);
      setScanResult({
        success: true,
        vendorName: app.vendorName,
        spotId: app.selectedSpotId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }, 900);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl w-full max-w-lg p-4 sm:p-6 space-y-5 shadow-2xl text-slate-100 relative max-h-[92vh] my-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <QrCode className="w-6 h-6 text-emerald-400" />
            <div>
              <h2 className="text-base font-black text-white tracking-tight">
                Gate Pass Scanner Simulator
              </h2>
              <p className="text-[11px] text-slate-400">
                Scan vendor Plazr Passes at venue gate for automated floor plan check-in
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              title="Toggle Audio Feedback"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewfinder Simulator Camera Box */}
        <div className="bg-slate-950 rounded-2xl border-2 border-emerald-500/40 p-6 flex flex-col items-center justify-center space-y-4 relative overflow-hidden min-h-[220px]">
          
          {/* Laser Scan Line Animation */}
          {isScanning && (
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-300 to-emerald-500 shadow-lg shadow-emerald-500 animate-bounce transition-all duration-300" />
          )}

          {/* Target Reticle */}
          <div className="w-36 h-36 border-2 border-dashed border-emerald-500/60 rounded-2xl flex items-center justify-center relative p-2">
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />

            <Camera className="w-10 h-10 text-emerald-400/60 animate-pulse" />
          </div>

          <p className="text-xs text-slate-400 font-medium">
            {isScanning ? 'Decoding Encrypted Security Token...' : 'Align Vendor QR Pass within Viewfinder frame'}
          </p>

          {/* Success Result Banner */}
          {scanResult && (
            <div className="w-full p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center space-x-2.5 animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 animate-bounce" />
              <div>
                <p className="font-extrabold text-white">
                  VERIFIED ENTRY (verifiedbizlink.co.za): {scanResult.vendorName}
                </p>
                <p className="text-[11px] text-emerald-300">
                  Allocated Bay: <strong className="text-white">{scanResult.spotId}</strong> • Checked in at {scanResult.timestamp}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Rapid Test Selector: Pick Vendor Pass to Simulate Scan */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Select Vendor QR Pass from Queue:</span>
          </p>

          <div className="space-y-2 max-h-[180px] overflow-y-auto">
            {applications.map((app) => {
              const isCheckedIn = app.checkInStatus === 'checked_in';

              return (
                <div
                  key={app.id}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                    isCheckedIn ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-800/80 border-slate-700'
                  }`}
                >
                  <div>
                    <p className="font-bold text-white">{app.vendorName}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Bay: <strong className="text-emerald-400">{app.selectedSpotId}</strong></span>
                      <span>Slot: <strong className="text-indigo-300">{app.loadInSlotTime || '06:00 AM'}</strong></span>
                    </p>
                  </div>

                  {isCheckedIn ? (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Checked In
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSimulateScan(app)}
                      disabled={isScanning}
                      className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] flex items-center space-x-1 shadow-md transition-all"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Scan Pass</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
