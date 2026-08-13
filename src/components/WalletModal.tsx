import React, { useState } from 'react';
import { WalletTransaction } from '../types';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, X, CheckCircle, CreditCard } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  balanceZar: number;
  transactions: WalletTransaction[];
  onTopUp: (amount: number, reference: string) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  balanceZar,
  transactions,
  onTopUp,
}) => {
  const [topUpAmount, setTopUpAmount] = useState<number>(500);
  const [paymentMethod, setPaymentMethod] = useState<'eft' | 'card' | 'snapscan'>('eft');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSimulateTopUp = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const ref = `ZA-${paymentMethod.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
      onTopUp(topUpAmount, ref);
      setIsProcessing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200 overflow-hidden"
      onClick={onClose}
    >
      <div 
        className="flex flex-col bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-slate-900 max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Plazr Wallet (ZAR)</h3>
              <p className="text-xs text-slate-500 font-medium">Instant SA Stall Bookings & Document Verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto bg-slate-50/50">
          
          {/* Balance Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 border border-emerald-700 relative overflow-hidden shadow-md text-white">
            <div className="absolute top-0 right-0 p-4 text-white/10 font-bold text-7xl select-none pointer-events-none">
              R
            </div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-200 mb-1">
              Active Wallet Balance
            </p>
            <p className="text-3xl font-black text-white tracking-tight">
              R {balanceZar.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="mt-3 flex items-center space-x-2 text-xs text-emerald-100 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
              <span>Available for instant PayFast stall checkouts & document renewals</span>
            </div>
          </div>

          {/* Top-Up Simulator Section */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">
                Simulate Top-Up
              </h4>
              <span className="text-[10px] text-indigo-700 font-extrabold">Instant ZAR Credit</span>
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-4 gap-2">
              {[250, 500, 1000, 2500].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setTopUpAmount(amt)}
                  className={`py-2 px-1 rounded-lg text-xs font-extrabold transition-all border ${
                    topUpAmount === amt
                      ? 'bg-indigo-600 border-indigo-700 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  +R {amt}
                </button>
              ))}
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => setPaymentMethod('eft')}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border text-center transition-all ${
                  paymentMethod === 'eft'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Instant EFT (Capitec/FNB)
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border text-center transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Credit / Debit Card
              </button>
              <button
                onClick={() => setPaymentMethod('snapscan')}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border text-center transition-all ${
                  paymentMethod === 'snapscan'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                SnapScan / Zapper
              </button>
            </div>

            <button
              onClick={handleSimulateTopUp}
              disabled={isProcessing}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-md transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Processing Payment...</span>
              ) : showSuccess ? (
                <span className="flex items-center text-white">
                  <CheckCircle className="w-4 h-4 mr-1.5 text-emerald-200" /> Balance Updated!
                </span>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Deposit R {topUpAmount} to Wallet</span>
                </>
              )}
            </button>
          </div>

          {/* Transactions List */}
          <div>
            <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3">
              Recent Transactions
            </h4>
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      tx.type === 'credit'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900">{tx.description}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{tx.date} • Ref: {tx.reference}</p>
                    </div>
                  </div>
                  <span className={`font-black ${tx.type === 'credit' ? 'text-emerald-700' : 'text-slate-900'}`}>
                    {tx.type === 'credit' ? '+' : ''}R {Math.abs(tx.amountZar).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
