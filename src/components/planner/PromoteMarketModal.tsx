import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MarketEvent } from '../../types';
import { 
  Star, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  X, 
  Wallet, 
  Megaphone,
  Award,
  ArrowRight
} from 'lucide-react';

interface PromoteMarketModalProps {
  isOpen: boolean;
  onClose: () => void;
  markets: MarketEvent[];
  walletBalanceZar: number;
  onConfirmPromotion: (marketId: string, tier: 'recommended' | 'featured_gold' | 'headline_sponsor', priceZar: number) => void;
}

export const PromoteMarketModal: React.FC<PromoteMarketModalProps> = ({
  isOpen,
  onClose,
  markets,
  walletBalanceZar,
  onConfirmPromotion,
}) => {
  const [selectedMarketId, setSelectedMarketId] = useState<string>(markets[0]?.id || '');
  const [selectedTier, setSelectedTier] = useState<'recommended' | 'featured_gold' | 'headline_sponsor'>('featured_gold');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const tiers = [
    {
      id: 'recommended' as const,
      name: 'Recommended Spotlight',
      priceZar: 350,
      badge: 'RECOMMENDED',
      color: 'border-emerald-500 bg-emerald-50/80 text-emerald-950',
      description: 'Front-page recommended section + priority search ranking.',
      boost: '+180% Vendor Views',
    },
    {
      id: 'featured_gold' as const,
      name: 'Gold Featured Tier',
      priceZar: 750,
      badge: 'FEATURED GOLD',
      color: 'border-amber-500 bg-amber-50/80 text-amber-950',
      description: 'Gold hero badge in card stack + front page spotlight carousel.',
      boost: '+350% Vendor Views',
      popular: true,
    },
    {
      id: 'headline_sponsor' as const,
      name: 'Headline Sponsor & Push Broadcast',
      priceZar: 1500,
      badge: 'HEADLINE SPONSOR',
      color: 'border-indigo-500 bg-indigo-50/80 text-indigo-950',
      description: 'Top banner placement + instant push alert to 500+ local vendors.',
      boost: '+600% Rapid Stall Booking',
    },
  ];

  const currentTierObj = tiers.find((t) => t.id === selectedTier) || tiers[1];

  const handlePurchase = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onConfirmPromotion(selectedMarketId, selectedTier, currentTierObj.priceZar);
      setIsProcessing(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex flex-col items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-hidden"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative flex flex-col w-full max-w-xl bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-slate-900 max-h-[92vh] my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 p-6 relative text-slate-950">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-950/10 hover:bg-slate-950/20 text-slate-950 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-slate-900/80 mb-1">
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>MARKET ADVERTISING & PROMOTION TIERS</span>
            </div>

            <h2 className="text-2xl font-black text-slate-950 tracking-tight">
              Promote Your Event on Plazr
            </h2>
            <p className="text-xs text-slate-900 font-bold mt-1">
              Reach thousands of verified South African craft, food, and fashion vendors searching for market spots.
            </p>
          </div>

          <div className="p-6 space-y-6 bg-slate-50/50">
            
            {/* Select Market Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
                Select Market Event
              </label>
              <select
                value={selectedMarketId}
                onChange={(e) => setSelectedMarketId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs"
              >
                {markets.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title} ({m.city}) {m.isPromoted ? '• Currently Promoted' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Pay Tier */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
                Choose Advertising Tier
              </label>

              <div className="space-y-3">
                {tiers.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTier(t.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all relative ${
                      selectedTier === t.id
                        ? `${t.color} ring-1 ring-amber-500 shadow-md`
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs'
                    }`}
                  >
                    {t.popular && (
                      <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider">
                        Most Popular
                      </span>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className={`w-4 h-4 ${selectedTier === t.id ? 'fill-amber-600 text-amber-600' : 'text-slate-400'}`} />
                        <span className="font-black text-sm text-slate-900">{t.name}</span>
                      </div>
                      <span className="font-black text-base text-slate-900">R {t.priceZar.toLocaleString()}</span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium mt-1.5 leading-relaxed">{t.description}</p>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] font-extrabold text-amber-800">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" /> {t.boost}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] uppercase tracking-wider text-slate-700 font-mono">
                        {t.badge}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-slate-600 font-medium">
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span>Plazr Wallet Balance:</span>
              </div>
              <span className="font-black text-slate-900">R {walletBalanceZar.toFixed(2)}</span>
            </div>

            {/* Action Button */}
            <button
              onClick={handlePurchase}
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center space-x-2 shadow-md transition-all active:scale-98"
            >
              {isProcessing ? (
                <span>Activating Advertising Tier...</span>
              ) : (
                <>
                  <Megaphone className="w-4 h-4 text-slate-950" />
                  <span>Confirm & Launch Promotion (R {currentTierObj.priceZar.toLocaleString()})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
