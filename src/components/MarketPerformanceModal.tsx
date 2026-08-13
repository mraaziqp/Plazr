import React, { useState } from 'react';
import { MarketEvent, CategoryTag, MarketReview } from '../types';
import { X, Star, TrendingUp, Users, DollarSign, Award, ThumbsUp, ShieldCheck, BarChart3, MessageSquare, Plus, CheckCircle, Flame } from 'lucide-react';

interface MarketPerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  market: MarketEvent | null;
  onAddReview?: (marketId: string, review: Omit<MarketReview, 'id' | 'date'>) => void;
}

export const MarketPerformanceModal: React.FC<MarketPerformanceModalProps> = ({
  isOpen,
  onClose,
  market,
  onAddReview,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryTag | 'all'>('all');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Review Form state
  const [newVendorName, setNewVendorName] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryTag>('#ArtisanalFood');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newRevenue, setNewRevenue] = useState(8500);

  if (!isOpen || !market || !market.performance) return null;

  const perf = market.performance;
  const filteredReviews = selectedCategory === 'all'
    ? perf.reviews
    : perf.reviews.filter(r => r.vendorCategory === selectedCategory);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorName.trim() || !newComment.trim()) return;

    if (onAddReview) {
      onAddReview(market.id, {
        vendorName: newVendorName,
        vendorCategory: newCategory,
        rating: newRating,
        comment: newComment,
        dailyRevenueReportedZar: Number(newRevenue)
      });
    }

    setShowReviewForm(false);
    setNewVendorName('');
    setNewComment('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-hidden"
      onClick={onClose}
    >
      <div 
        className="relative flex flex-col bg-white text-slate-900 border border-slate-200 rounded-2xl sm:rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] sm:max-h-[88vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Banner */}
        <div className="relative flex-shrink-0 h-36 sm:h-44 bg-slate-900 overflow-hidden">
          <img
            src={market.coverImage}
            alt={market.title}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
          
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-10 h-10 rounded-full bg-slate-900/90 text-slate-200 hover:text-white flex items-center justify-center transition-all border border-slate-700/80 hover:bg-slate-800 shadow-lg active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-3 text-white">
            <div>
              <div className="flex items-center space-x-2 mb-0.5 sm:mb-1">
                <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {market.city}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-300 font-medium truncate">
                  {market.locationName}
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight line-clamp-1">
                {market.title}
              </h2>
            </div>

            <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-2xl self-start sm:self-auto">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400 flex-shrink-0" />
              <div>
                <div className="text-sm sm:text-base font-black text-emerald-400 leading-tight">
                  {perf.overallRating.toFixed(1)} / 5.0
                </div>
                <p className="text-[9px] sm:text-[10px] text-slate-300 font-medium">
                  {perf.totalVendorReviews} Verified Reviews (verifiedbizlink.co.za)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6 min-h-0 overscroll-contain">
          
          {/* Top Performance Stats Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span>Market Performance Metrics</span>
              </h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ⚡ Sales Velocity: {perf.salesVelocityScore}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                <div className="flex items-center text-slate-500 text-xs font-medium mb-1 space-x-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Avg Daily Revenue</span>
                </div>
                <p className="text-lg font-black text-slate-900">
                  R {perf.avgDailyVendorRevenueZar.toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">Per trading stall</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                <div className="flex items-center text-slate-500 text-xs font-medium mb-1 space-x-1">
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Vendor Satisfaction</span>
                </div>
                <p className="text-lg font-black text-slate-900">
                  {perf.satisfactionRatePercent}%
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">Would trade again</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                <div className="flex items-center text-slate-500 text-xs font-medium mb-1 space-x-1">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Traffic Conversion</span>
                </div>
                <p className="text-lg font-black text-slate-900">
                  {perf.footTrafficConversionRatePercent}%
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">Stall visitor buyer rate</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                <div className="flex items-center text-slate-500 text-xs font-medium mb-1 space-x-1">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>Vendor Repeat Rate</span>
                </div>
                <p className="text-lg font-black text-slate-900">
                  {perf.repeatVendorRatePercent}%
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">Return rate</p>
              </div>
            </div>
          </div>

          {/* Category Demand Breakdown */}
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Category Earnings Benchmark</span>
              </span>
              <span className="text-[11px] font-normal text-emerald-800">
                Top Category: <strong className="font-extrabold">{perf.topSellingCategory}</strong>
              </span>
            </h4>

            <div className="space-y-2.5">
              {perf.categoryDemandBreakdown.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                    <span className="font-bold text-slate-900">{cat.category}</span>
                    <div className="space-x-3 text-[11px]">
                      <span className="text-slate-500">{cat.demandSharePercent}% Market Share</span>
                      <span className="font-extrabold text-emerald-700">R {cat.avgRevenueZar.toLocaleString()} / day avg</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${cat.demandSharePercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Vendor Reviews Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Verified Vendor Reviews & Testimonials</span>
                </h3>
                <p className="text-xs text-slate-500">Real feedback from stallholders who traded at previous editions</p>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="inline-flex items-center space-x-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-full transition-all shadow-sm self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showReviewForm ? 'Cancel Form' : 'Write Vendor Review'}</span>
              </button>
            </div>

            {/* Optional Form to Submit Review */}
            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="bg-slate-50 border border-slate-300 p-4 rounded-2xl space-y-3 animate-in fade-in duration-200">
                <h4 className="text-xs font-bold text-slate-800">Add Your Vendor Experience Review</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Business Name</label>
                    <input
                      type="text"
                      required
                      value={newVendorName}
                      onChange={(e) => setNewVendorName(e.target.value)}
                      placeholder="e.g. Bo-Kaap Gourmet Sliders"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Stall Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as CategoryTag)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="#ArtisanalFood">#ArtisanalFood</option>
                      <option value="#Crafts">#Crafts</option>
                      <option value="#VintageFashion">#VintageFashion</option>
                      <option value="#Halal">#Halal</option>
                      <option value="#Vegan">#Vegan</option>
                      <option value="#LocalProduce">#LocalProduce</option>
                      <option value="#GeekCulture">#GeekCulture</option>
                      <option value="#BeautyWellness">#BeautyWellness</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Rating (1 to 5 Stars)</label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 text-slate-400 hover:text-amber-400"
                        >
                          <Star className={`w-5 h-5 ${star <= newRating ? 'text-amber-400 fill-amber-400' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Daily Revenue Earned (ZAR)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={newRevenue}
                      onChange={(e) => setNewRevenue(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Review Comments</label>
                  <textarea
                    rows={2}
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share feedback on foot traffic, power reliability, organizer support..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-full hover:bg-emerald-700 shadow-sm"
                  >
                    Post Review
                  </button>
                </div>
              </form>
            )}

            {/* Category Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Reviews ({perf.reviews.length})
              </button>
              {perf.categoryDemandBreakdown.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => setSelectedCategory(cat.category)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat.category
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.category}
                </button>
              ))}
            </div>

            {/* Review Cards */}
            <div className="space-y-3">
              {filteredReviews.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  No reviews posted for this category yet.
                </div>
              ) : (
                filteredReviews.map((rev) => (
                  <div key={rev.id} className="bg-white border border-slate-200 p-4 rounded-2xl space-y-2 hover:border-slate-300 transition-all shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs">
                          {rev.vendorName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h5 className="text-xs font-bold text-slate-900">{rev.vendorName}</h5>
                            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              {rev.vendorCategory}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400">{rev.date} • Verified Trader (verifiedbizlink.co.za)</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center space-x-1 justify-end">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-xs font-black text-slate-800">{rev.rating.toFixed(1)}</span>
                        </div>
                        <p className="text-[11px] font-extrabold text-emerald-700">
                          R {rev.dailyRevenueReportedZar.toLocaleString()} / day
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex-shrink-0 bg-slate-50 border-t border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 z-10">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="truncate text-[11px] sm:text-xs">Verified Performance through verifiedbizlink.co.za</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 sm:px-5 py-2 text-xs font-bold bg-slate-900 text-white rounded-full hover:bg-slate-800 shadow-sm transition-all flex-shrink-0 active:scale-95"
          >
            Close Analytics
          </button>
        </div>

      </div>
    </div>
  );
};
