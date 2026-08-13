import React, { useState } from 'react';
import { VendorProfile, MarketEvent, VendorApplication } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Check, 
  X, 
  Star, 
  Sparkles, 
  Instagram, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Flame,
  XCircle,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  MapPin,
  Navigation
} from 'lucide-react';

interface ApplicantSwipeDashboardProps {
  applicants: VendorProfile[];
  activeMarket: MarketEvent;
  applications?: VendorApplication[];
  onApproveApplicant: (vendor: VendorProfile, stallSpotId: string) => void;
  onWaitlistApplicant?: (vendor: VendorProfile, stallSpotId: string) => void;
  onDeclineApplicant: (vendor: VendorProfile, reason: string) => void;
  onExpirePaymentAndPromoteWaitlist?: (applicationId: string) => void;
  onPromoteWaitlistVendor?: (applicationId: string) => void;
  onOpenChatWithVendor: (vendorId: string) => void;
}

export const ApplicantSwipeDashboard: React.FC<ApplicantSwipeDashboardProps> = ({
  applicants,
  activeMarket,
  applications = [],
  onApproveApplicant,
  onWaitlistApplicant,
  onDeclineApplicant,
  onExpirePaymentAndPromoteWaitlist,
  onPromoteWaitlistVendor,
  onOpenChatWithVendor,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('Category capacity full for this market date');
  const [selectedStallForApproval, setSelectedStallForApproval] = useState('SPOT-A1');
  const [activeSubTab, setActiveSubTab] = useState<'queue' | 'waitlist'>('queue');

  const currentVendor = applicants[currentIndex];

  const marketApplications = applications.filter(a => a.marketId === activeMarket.id || true);
  const pendingPaymentApps = marketApplications.filter(a => a.status === 'approved_pending_payment');
  const waitlistedApps = marketApplications.filter(a => a.status === 'waitlisted');

  const handleApprove = () => {
    if (!currentVendor) return;
    onApproveApplicant(currentVendor, selectedStallForApproval);
    if (currentIndex < applicants.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleWaitlist = () => {
    if (!currentVendor) return;
    if (onWaitlistApplicant) {
      onWaitlistApplicant(currentVendor, selectedStallForApproval);
    }
    if (currentIndex < applicants.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleDeclineConfirm = () => {
    if (!currentVendor) return;
    onDeclineApplicant(currentVendor, declineReason);
    setShowDeclineModal(false);
    if (currentIndex < applicants.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Vendor Applications & Waitlist</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">Review applicants, manage backup vendor waitlists, and enforce 24h payment deadlines</p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('queue')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'queue'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Applications Queue</span>
            <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
              {Math.max(0, applicants.length - currentIndex)}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('waitlist')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'waitlist'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Backup Waitlist</span>
            <span className="px-2 py-0.2 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black">
              {waitlistedApps.length}
            </span>
          </button>
        </div>
      </div>

      {/* Decline Reason Dialog */}
      {showDeclineModal && currentVendor && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => setShowDeclineModal(false)}
        >
          <div 
            className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600" />
              Polite Auto-Reason for Declining {currentVendor.businessName}
            </h3>

            <div className="space-y-2 text-xs">
              {[
                'Category capacity full for this market date',
                'Power requirement exceeds Zone A substation capacity',
                'Incompatible product category for this festival edition',
                'Missing or unverified municipal Certificate of Acceptability'
              ].map((reason) => (
                <button
                  key={reason}
                  onClick={() => setDeclineReason(reason)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                    declineReason === reason
                      ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowDeclineModal(false)}
                className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeclineConfirm}
                className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-xs"
              >
                Confirm & Send Decline Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Applicant Card */}
      {applicants.length === 0 || currentIndex >= applicants.length ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-6 text-slate-500 shadow-xs">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">Curated Applicant Queue Complete!</h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">All vendor applications for {activeMarket.title} have been reviewed.</p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentVendor.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl text-slate-900 flex flex-col space-y-5 p-6"
            >
              
              {/* Header Profile Info */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={currentVendor.avatar}
                    alt={currentVendor.ownerName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-black text-slate-900">{currentVendor.businessName}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200" title="Verified through verifiedbizlink.co.za">
                        VERIFIED (verifiedbizlink.co.za)
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Owner: {currentVendor.ownerName} • {currentVendor.phone}</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-bold text-slate-800 border border-slate-200">
                      {currentVendor.category}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenChatWithVendor(currentVendor.id)}
                  className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-indigo-600 border border-slate-200 transition-colors shadow-xs"
                  title="Open Chat Negotiation"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>

              {/* Product Photo Gallery */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Product Sample Gallery
                </p>
                <div className="grid grid-cols-3 gap-2 h-32 rounded-2xl overflow-hidden">
                  {currentVendor.galleryImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Product ${idx}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ))}
                </div>
              </div>

              {/* Bio Description */}
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 font-medium">
                "{currentVendor.bio}"
              </p>

              {/* Vendor Base Location & Operating Zones */}
              {currentVendor.locationPreferences && (
                <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-indigo-950 font-black">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Base: {currentVendor.locationPreferences.baseAddress || currentVendor.locationPreferences.baseCity}</span>
                    </div>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-indigo-200 font-extrabold text-indigo-800">
                      {currentVendor.locationPreferences.maxTravelDistanceKm} km Radius
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 text-[11px] text-slate-600 font-medium pt-0.5">
                    <span className="font-bold text-indigo-900">Operating Hubs:</span>
                    <span className="text-slate-800 font-extrabold">{currentVendor.locationPreferences.operatingCities.join(', ')}</span>
                  </div>
                </div>
              )}

              {/* Social Reach & Plazr Reliability Index Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Social Reach Card */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-1">
                  <div className="flex items-center justify-between text-xs text-indigo-900 font-bold">
                    <span className="flex items-center gap-1">
                      <Instagram className="w-4 h-4 text-pink-600" /> Total Social Reach
                    </span>
                    <span className="text-slate-900 text-sm font-black">
                      {(currentVendor.socialReach.totalReach / 1000).toFixed(1)}k Followers
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 font-medium">
                    Insta: {(currentVendor.socialReach.instagramFollowers / 1000).toFixed(1)}k ({currentVendor.socialReach.instagramHandle}) • TikTok: {(currentVendor.socialReach.tiktokFollowers / 1000).toFixed(1)}k
                  </p>
                </div>

                {/* Plazr Reliability Index */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <div className="flex items-center justify-between text-xs text-emerald-900 font-bold">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> Reliability Index
                    </span>
                    <span className="text-slate-900 text-sm font-black">
                      {currentVendor.reliabilityIndex.rating} / 5.0 ⭐
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 font-medium">
                    On-Time Setup: <strong>{currentVendor.reliabilityIndex.onTimeSetupPercent}%</strong> • Cleanliness: <strong>{currentVendor.reliabilityIndex.cleanlinessScore}/5</strong> • Markets: <strong>{currentVendor.reliabilityIndex.totalMarketsCompleted}</strong>
                  </p>
                </div>

              </div>

              {/* Power Requirement Badge */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <Zap className="w-4 h-4 text-amber-500" /> Electrical Power Draw Required:
                </span>
                <span className="font-extrabold text-amber-900">
                  {currentVendor.powerRequirementKw} kW ({currentVendor.powerRequirementKw > 3 ? 'High-Draw Appliance' : 'Standard Lighting'})
                </span>
              </div>

              {/* Stall Assignment Selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Assign Stall Spot for PayFast Invoice Approval:
                </label>
                <select
                  value={selectedStallForApproval}
                  onChange={(e) => setSelectedStallForApproval(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-slate-900"
                >
                  <option value="SPOT-A1">Spot A1 - Prime Food Alley Corner (R 1,250.00)</option>
                  <option value="SPOT-A3">Spot A3 - Food Truck Bay (R 1,800.00)</option>
                  <option value="SPOT-B1">Spot B1 - Crafts Corner Spot (R 1,100.00)</option>
                  <option value="SPOT-B3">Spot B3 - Standard Crafts 2x2 (R 850.00)</option>
                </select>
              </div>

              {/* Swipe Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <button
                  onClick={() => setShowDeclineModal(true)}
                  className="py-3 px-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-rose-600 font-extrabold text-[11px] flex items-center justify-center space-x-1 border border-slate-200 shadow-xs transition-all active:scale-95"
                >
                  <X className="w-3.5 h-3.5 text-rose-600" />
                  <span>Decline</span>
                </button>

                <button
                  onClick={handleWaitlist}
                  className="py-3 px-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-extrabold text-[11px] flex items-center justify-center space-x-1 border border-amber-200 shadow-xs transition-all active:scale-95"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Backup Waitlist</span>
                </button>

                <button
                  onClick={handleApprove}
                  className="py-3 px-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[11px] flex items-center justify-center space-x-1 shadow-md transition-all active:scale-95"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Approve & Invoice</span>
                </button>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* BACKUP WAITLIST & PAYMENT TIMEOUT MANAGER SUB-TAB */}
      {activeSubTab === 'waitlist' && (
        <div className="space-y-6">
          
          {/* Info Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border border-amber-200 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-amber-900">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>STANDBY WAITLIST & AUTOMATIC PAYMENT TIMEOUT ENGINE</span>
              </div>
              <p className="text-xs font-bold text-amber-950">
                If an approved vendor fails to pay within 24 hours, their spot is released and automatically offered to Backup Vendor #1.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-900 text-xs font-black shrink-0">
              {waitlistedApps.length} Vendors on Standby
            </span>
          </div>

          {/* Unpaid Approved Applications Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Approved Vendors (24h Payment Window)</span>
            </h3>

            {pendingPaymentApps.length === 0 ? (
              <div className="text-center py-6 bg-white border border-slate-200 rounded-2xl p-4 text-xs font-medium text-slate-500">
                No unpaid pending applications.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {pendingPaymentApps.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-sm text-slate-900">{app.vendorName}</span>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-[10px] font-black text-indigo-900">
                          {app.selectedSpotId}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Category: {app.vendorCategory} • Total Invoice: <strong className="text-slate-900">R {app.feeBreakdown.totalZar.toFixed(2)}</strong>
                      </p>
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-700">
                        <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                        <span>Payment Required ({app.unpaidHoursRemaining || 48} Hours Remaining)</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => {
                          if (onExpirePaymentAndPromoteWaitlist) {
                            onExpirePaymentAndPromoteWaitlist(app.id);
                          }
                        }}
                        className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-extrabold text-xs flex items-center space-x-1.5 shadow-xs transition-all"
                        title="Simulate 48h timer expiration and release spot to top waitlisted vendor"
                      >
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Expire Payment & Release to Waitlist #1</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Backup Waitlist Queue Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Standby Backup Queue</span>
            </h3>

            {waitlistedApps.length === 0 ? (
              <div className="text-center py-8 bg-white border border-slate-200 rounded-2xl p-6 text-slate-500 text-xs">
                <p className="font-bold text-slate-900">No backup vendors currently on waitlist.</p>
                <p className="mt-1">When reviewing applications, choose "Backup Waitlist" to place top candidates on standby.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {waitlistedApps.map((app, index) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl bg-white border border-amber-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase">
                          STANDBY #{app.waitlistPosition || index + 1}
                        </span>
                        <span className="font-extrabold text-sm text-slate-900">{app.vendorName}</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Category: {app.vendorCategory} • Standby Spot: <strong className="text-slate-800">{app.selectedSpotId}</strong>
                      </p>
                      <p className="text-[11px] text-amber-800 font-semibold">
                        Ready for instant auto-promotion if primary vendor payment expires.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => {
                          if (onPromoteWaitlistVendor) {
                            onPromoteWaitlistVendor(app.id);
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Promote to Approved & Invoice</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
