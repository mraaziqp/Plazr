import React, { useState } from 'react';
import { MarketEvent } from '../../types';
import { Star, Sparkles, TrendingUp, CheckCircle2, Zap } from 'lucide-react';

interface PromotedMarketToggleProps {
  market: MarketEvent;
  onTogglePromote: (isPromoted: boolean) => void;
}

export const PromotedMarketToggle: React.FC<PromotedMarketToggleProps> = ({
  market,
  onTogglePromote,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleToggle = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onTogglePromote(!market.isPromoted);
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/40 text-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
      
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 fill-amber-400 text-amber-400 animate-pulse" />
          <h3 className="text-base font-bold text-white">Promoted Market Spot (Featured Gold Badge)</h3>
        </div>
        <p className="text-xs text-slate-300">
          Boost your market to the top of all South African vendor discovery feeds for R 2,500.00.
        </p>
        <div className="flex items-center space-x-3 pt-1 text-[11px] text-amber-300 font-medium">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +350% Vendor Discovery Views
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> Fast-track Stall Fill Rate
          </span>
        </div>
      </div>

      <div className="shrink-0">
        <button
          onClick={handleToggle}
          disabled={isProcessing}
          className={`px-5 py-3 rounded-xl font-extrabold text-xs flex items-center space-x-2 shadow-lg transition-all ${
            market.isPromoted
              ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20'
              : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/30'
          }`}
        >
          {isProcessing ? (
            <span>Updating Status...</span>
          ) : market.isPromoted ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>Promoted Active (R2,500)</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Promote Market for R 2,500</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
