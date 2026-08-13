import React from 'react';
import { MarketEvent } from '../../types';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  PieChart, 
  Sparkles, 
  Calendar, 
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Star,
  Award,
  BarChart3
} from 'lucide-react';

interface RevenueAnalyticsProps {
  market: MarketEvent;
  totalGrossRentZar: number;
  onOpenPerformance?: () => void;
}

export const RevenueAnalytics: React.FC<RevenueAnalyticsProps> = ({
  market,
  totalGrossRentZar,
  onOpenPerformance,
}) => {
  const plannerCommissionRate = 0.025; // 2.5% Plazr Planner Commission
  const vendrCommissionZar = Math.round(totalGrossRentZar * plannerCommissionRate * 100) / 100;
  const netPlannerRevenueZar = totalGrossRentZar - vendrCommissionZar;

  const footTrafficTarget = market.expectedFootTraffic.target;
  const footTrafficAvg = market.expectedFootTraffic.historicalAverage;
  const trafficGainPercent = Math.round(((footTrafficTarget - footTrafficAvg) / footTrafficAvg) * 100);

  const perf = market.performance;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Analytics & Revenue</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">Financial projections, foot traffic gauges & market performance ratings</p>
        </div>

        <div className="flex items-center space-x-2">
          {perf && onOpenPerformance && (
            <button
              onClick={onOpenPerformance}
              className="px-4 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200 flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>⭐ {perf.overallRating.toFixed(1)} Market Rating ({perf.totalVendorReviews} Reviews)</span>
            </button>
          )}

          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Real-time Financial Sync</span>
          </span>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Gross Stall Rent Collected */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 relative overflow-hidden shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Gross Stall Rent Collected
          </p>
          <p className="text-2xl font-black text-slate-900 tracking-tight">
            R {totalGrossRentZar.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex items-center space-x-1 text-emerald-600 text-[11px] font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>34 Stalls Reserved & Paid</span>
          </div>
        </div>

        {/* Vendr Planner Commission */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 relative overflow-hidden shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Plazr Platform Fee (2.5%)
          </p>
          <p className="text-2xl font-black text-slate-700 tracking-tight">
            - R {vendrCommissionZar.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            Deducted separately from gross stall fee upon payment completion (Covers PayFast gateway & verifiedbizlink.co.za vetting)
          </p>
        </div>

        {/* Net Planner Revenue */}
        <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2 relative overflow-hidden shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
            Net Organizer Payout (ZAR)
          </p>
          <p className="text-3xl font-black text-emerald-950 tracking-tight">
            R {netPlannerRevenueZar.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
            INSTANT PAYOUT ACTIVE
          </span>
        </div>

      </div>

      {/* Vendor Satisfaction & Performance Analytics Callout */}
      {perf && (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black text-white">Vendor Performance & Ratings Benchmark</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Market reputation score based on verified stallholder reviews (via verifiedbizlink.co.za) from past editions
              </p>
            </div>

            {onOpenPerformance && (
              <button
                onClick={onOpenPerformance}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold transition-all shadow-md self-start sm:self-auto flex items-center space-x-1.5"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Open Full Performance Register</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Vendor Rating</span>
              <p className="text-base font-black text-amber-300 flex items-center space-x-1">
                <span>⭐ {perf.overallRating.toFixed(1)} / 5.0</span>
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Avg Stall Revenue</span>
              <p className="text-base font-black text-emerald-400">
                R {perf.avgDailyVendorRevenueZar.toLocaleString()}/day
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Repeat Vendors</span>
              <p className="text-base font-black text-indigo-400">
                {perf.repeatVendorRatePercent}% Return
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Satisfaction</span>
              <p className="text-base font-black text-emerald-400">
                {perf.satisfactionRatePercent}% Happy
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Foot Traffic Gauge & Audience Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Foot Traffic Gauge Box */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Estimated Foot Traffic Gauge</span>
            </h3>
            <span className="text-xs font-bold text-emerald-400">+{trafficGainPercent}% vs Historical</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Target Attendance: <strong>{footTrafficTarget.toLocaleString()} Visitors</strong></span>
                <span>Historical Avg: {footTrafficAvg.toLocaleString()}</span>
              </div>

              <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  style={{ width: `${Math.min(100, (footTrafficTarget / (footTrafficTarget * 1.1)) * 100)}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                ></div>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
              📈 High audience demand forecast driven by social media reach of approved vendors (combined 156,000+ Instagram & TikTok followers).
            </p>
          </div>
        </div>

        {/* Category Split Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-purple-400" />
            <span>Curated Vendor Category Mix</span>
          </h3>

          <div className="space-y-2 text-xs">
            {[
              { category: '#ArtisanalFood & Gourmet', percent: 42, color: 'bg-emerald-500', count: '14 Stalls' },
              { category: '#VintageFashion & Apparel', percent: 28, color: 'bg-indigo-500', count: '9 Stalls' },
              { category: '#Crafts & Botanical Ceramics', percent: 18, color: 'bg-purple-500', count: '6 Stalls' },
              { category: '#Halal & Vegan Specialty', percent: 12, color: 'bg-amber-500', count: '5 Stalls' },
            ].map((cat) => (
              <div key={cat.category} className="space-y-1">
                <div className="flex justify-between text-slate-200">
                  <span>{cat.category}</span>
                  <span className="font-bold text-white">{cat.percent}% ({cat.count})</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div style={{ width: `${cat.percent}%` }} className={`h-full rounded-full ${cat.color}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

