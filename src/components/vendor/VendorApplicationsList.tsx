import React, { useState } from 'react';
import { VendorApplication, LoadInSlot } from '../../types';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  CreditCard, 
  Sparkles, 
  MessageSquare, 
  Calendar, 
  MapPin,
  ChevronRight,
  Receipt,
  QrCode,
  ShieldCheck
} from 'lucide-react';
import { CoBrandedGraphicGenerator } from '../CoBrandedGraphicGenerator';
import { VendorPassQRModal } from './VendorPassQRModal';

interface VendorApplicationsListProps {
  applications: VendorApplication[];
  availableLoadInSlots?: LoadInSlot[];
  onTriggerPayment: (app: VendorApplication) => void;
  onOpenChat: (marketId: string) => void;
  onSelectLoadInSlot?: (applicationId: string, slotId: string, timeWindow: string) => void;
}

const getMarketBannerImage = (app: VendorApplication): string => {
  if (app.coverImage) return app.coverImage;
  const title = (app.marketTitle || '').toLowerCase();
  if (title.includes('neighbourgoods') || title.includes('artisanal') || title.includes('biscuit mill')) {
    return 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&auto=format&fit=crop&q=80';
  }
  if (title.includes('comic con') || title.includes('geek') || title.includes('expo')) {
    return 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80';
  }
  if (title.includes('oranjezicht') || title.includes('farm') || title.includes('waterfront')) {
    return 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&auto=format&fit=crop&q=80';
  }
  if (title.includes('night') || title.includes('street') || title.includes('food')) {
    return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80';
  }
  return 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&auto=format&fit=crop&q=80';
};

export const VendorApplicationsList: React.FC<VendorApplicationsListProps> = ({
  applications,
  availableLoadInSlots = [],
  onTriggerPayment,
  onOpenChat,
  onSelectLoadInSlot,
}) => {
  const [selectedAppForGraphic, setSelectedAppForGraphic] = useState<VendorApplication | null>(null);
  const [selectedAppForPassQR, setSelectedAppForPassQR] = useState<VendorApplication | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">My Vendor Applications & Bookings</h2>
          <p className="text-xs text-slate-500 font-medium">Track application statuses, gate passes, PayFast invoices & social graphics</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-900 font-extrabold text-xs border border-slate-200">
          {applications.length} Active Records
        </span>
      </div>

      {/* Modal for QR Gate Pass */}
      {selectedAppForPassQR && (
        <VendorPassQRModal
          isOpen={true}
          onClose={() => setSelectedAppForPassQR(null)}
          application={selectedAppForPassQR}
          availableLoadInSlots={availableLoadInSlots}
          onSelectLoadInSlot={(appId, slotId, timeWindow) => {
            if (onSelectLoadInSlot) onSelectLoadInSlot(appId, slotId, timeWindow);
          }}
        />
      )}

      {/* Modal for Social Graphic if selected */}
      {selectedAppForGraphic && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/75 backdrop-blur-md p-2 sm:p-4 overflow-hidden animate-in fade-in duration-200"
          onClick={() => setSelectedAppForGraphic(null)}
        >
          <div 
            className="relative flex flex-col w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-slate-100 max-h-[92vh] my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Vendor Social Graphic Generator</h3>
              </div>
              <button
                onClick={() => setSelectedAppForGraphic(null)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-3 sm:p-4 overflow-y-auto">
              <CoBrandedGraphicGenerator
                vendorName={selectedAppForGraphic.vendorName}
                marketTitle={selectedAppForGraphic.marketTitle}
                eventDate={selectedAppForGraphic.eventDate}
                locationName={selectedAppForGraphic.locationName || "The Old Biscuit Mill, Woodstock"}
                spotNumber={selectedAppForGraphic.selectedSpotId}
                vendorCategory={selectedAppForGraphic.vendorCategory}
              />
            </div>
          </div>
        </div>
      )}

      {/* Applications List */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <p className="text-sm font-bold text-slate-900">No market applications submitted yet.</p>
            <p className="text-xs text-slate-500 mt-1">Browse Market Discovery to swipe and select your first stall.</p>
          </div>
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition-all"
            >
              {/* Market Name Header with Image Banner & White Lettering */}
              <div className="relative p-4 sm:p-5 bg-slate-950 text-white min-h-[105px] sm:min-h-[115px] flex flex-col justify-end overflow-hidden">
                {/* Background image banner */}
                <img
                  src={getMarketBannerImage(app)}
                  alt={app.marketTitle}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay scale-105 transition-transform duration-700 hover:scale-100"
                />
                {/* Dark gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/30" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-black text-white tracking-tight drop-shadow-md">
                      {app.marketTitle}
                    </h3>
                    <p className="text-xs text-slate-200 flex items-center gap-1.5 font-medium drop-shadow-sm">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      Event Date: <strong className="text-white">{app.eventDate}</strong> • Spot: <strong className="text-emerald-300">{app.selectedSpotId}</strong> <span className="text-slate-300">({app.selectedSpotZone})</span>
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0">
                    {app.status === 'pending_planner_review' && (
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md text-amber-200 border border-amber-400/30 text-xs font-bold flex items-center space-x-1.5 shadow-sm">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Pending Planner Review</span>
                      </span>
                    )}

                    {app.status === 'waitlisted' && (
                      <span className="px-3 py-1 rounded-full bg-amber-500/25 backdrop-blur-md text-amber-100 border border-amber-400/40 text-xs font-black flex items-center space-x-1.5 shadow-sm">
                        <Clock className="w-3.5 h-3.5 text-amber-300" />
                        <span>Standby Waitlist #{app.waitlistPosition || 1}</span>
                      </span>
                    )}

                    {app.status === 'approved_pending_payment' && (
                      <span className="px-3 py-1 rounded-full bg-indigo-500/30 backdrop-blur-md text-indigo-100 border border-indigo-400/40 text-xs font-bold flex items-center space-x-1.5 animate-pulse shadow-sm">
                        <CreditCard className="w-3.5 h-3.5 text-indigo-300" />
                        <span>Approved • PayFast Required ({app.unpaidHoursRemaining || 48}h Left)</span>
                      </span>
                    )}

                    {app.status === 'payment_expired' && (
                      <span className="px-3 py-1 rounded-full bg-rose-500/20 backdrop-blur-md text-rose-200 border border-rose-400/30 text-xs font-bold flex items-center space-x-1.5 shadow-sm">
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        <span>Payment Window Expired</span>
                      </span>
                    )}

                    {app.status === 'paid_and_confirmed' && (
                      <span className="px-3 py-1 rounded-full bg-emerald-500/25 backdrop-blur-md text-emerald-200 border border-emerald-400/30 text-xs font-bold flex items-center space-x-1.5 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Confirmed & Locked</span>
                      </span>
                    )}

                    {app.status === 'declined' && (
                      <span className="px-3 py-1 rounded-full bg-rose-500/20 backdrop-blur-md text-rose-200 border border-rose-400/30 text-xs font-bold flex items-center space-x-1.5 shadow-sm">
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        <span>Declined</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Body Details */}
              <div className="p-4 sm:p-5 space-y-4">
                {/* Special Banners for Waitlist and Payment Countdown */}
              {app.status === 'waitlisted' && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Standby Backup Queue Position #{app.waitlistPosition || 1}:</strong> If the primary vendor fails to complete payment within 48 hours, this stall spot will be automatically offered to you!
                  </span>
                </div>
              )}

              {app.status === 'approved_pending_payment' && (
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-indigo-600 shrink-0 animate-pulse" />
                    <span>
                      <strong>{app.unpaidHoursRemaining || 48} Hours Remaining to Complete Payment:</strong> Pay before deadline or stall spot will be released to the standby waitlist vendor.
                    </span>
                  </div>
                </div>
              )}

              {app.status === 'payment_expired' && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs flex items-center space-x-2">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    <strong>Payment Timeout Elapsed:</strong> Payment was not received within the 48-hour window. This spot was re-allocated to the next backup vendor on the waitlist.
                  </span>
                </div>
              )}

              {/* Fee & Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
                
                <div className="text-slate-600 space-y-1 font-medium">
                  <p>
                    Stall Fee: <strong className="text-slate-900 text-sm">R {app.feeBreakdown.totalZar.toFixed(2)}</strong>
                    <span className="text-[10px] text-slate-500 ml-2">(Plazr 5% fee included • Deducted separately from payout once paid)</span>
                  </p>
                  <p className="text-[11px] text-indigo-700 font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    Load-in Arrival Window: {app.loadInSlotTime || '06:00 - 06:30 AM (Slot A)'}
                  </p>
                  {app.payfastReference && (
                    <p className="text-[11px] text-slate-500">PayFast Ref: <code className="text-slate-900 font-bold">{app.payfastReference}</code></p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                  <button
                    onClick={() => onOpenChat(app.marketId)}
                    className="px-3 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center space-x-1.5 border border-slate-200 shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Chat Planner</span>
                  </button>

                  {app.status === 'approved_pending_payment' && (
                    <button
                      onClick={() => onTriggerPayment(app)}
                      className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-md transition-all animate-bounce"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>PayFast Now (R {app.feeBreakdown.totalZar.toFixed(2)})</span>
                    </button>
                  )}

                  {app.status === 'paid_and_confirmed' && (
                    <>
                      <button
                        onClick={() => setSelectedAppForPassQR(app)}
                        className="px-3.5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-xs transition-all"
                      >
                        <QrCode className="w-4 h-4 text-emerald-400" />
                        <span>Plazr Gate Pass</span>
                      </button>

                      <button
                        onClick={() => setSelectedAppForGraphic(app)}
                        className="px-3.5 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-xs transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Social Graphic</span>
                      </button>
                    </>
                  )}
                </div>

              </div>

            </div>
          </div>
        ))
      )}
      </div>

    </div>
  );
};
