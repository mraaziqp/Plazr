import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Lock, CreditCard, Sparkles, X, ArrowRight, Clock } from 'lucide-react';

interface PayFastModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketTitle: string;
  eventDate: string;
  spotZone: string;
  feeBreakdown: {
    baseStallFeeZar: number;
    vendrPlatformFeeZar: number;
    docVerificationFeeZar: number;
    totalZar: number;
  };
  onSuccessPayment: (payfastRef: string) => void;
}

export const PayFastModal: React.FC<PayFastModalProps> = ({
  isOpen,
  onClose,
  marketTitle,
  eventDate,
  spotZone,
  feeBreakdown,
  onSuccessPayment,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'payfast_eft' | 'payfast_card' | 'wallet'>('payfast_eft');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePayFastCheckout = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      const ref = `PF-ZA-${Math.floor(100000 + Math.random() * 900000)}`;

      setTimeout(() => {
        setPaymentSuccess(false);
        onSuccessPayment(ref);
      }, 1500);
    }, 1800);
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
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200 font-black text-sm">
              PayFast
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Instant PayFast Checkout</h3>
              <p className="text-xs text-slate-500 font-medium">Official South African Payment Gateway</p>
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
          
          {/* Booking Summary Box */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs">
            <div className="flex justify-between text-slate-700">
              <span className="font-extrabold text-slate-900">{marketTitle}</span>
              <span className="text-indigo-700 font-bold">{eventDate}</span>
            </div>
            <p className="text-slate-500 text-[11px] font-medium">Selected Zone: <strong className="text-slate-800">{spotZone}</strong></p>
          </div>

          {/* 48-Hour Deadline Alert Badge */}
          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs flex items-center space-x-2 font-medium">
            <Clock className="w-4 h-4 text-indigo-600 shrink-0 animate-pulse" />
            <span>
              <strong>48-Hour Payment Window Active:</strong> Complete checkout within 48 hours to lock your stall spot before it is offered to standby waitlisted vendors.
            </span>
          </div>

          {/* Fee Breakdown */}
          <div className="space-y-2 p-4 rounded-xl bg-white border border-slate-200 text-xs shadow-xs">
            <h4 className="font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">
              Stall Fee Summary (ZAR)
            </h4>

            <div className="flex justify-between py-1 border-b border-slate-100 text-slate-700 font-medium">
              <span>Actual Stall Fee</span>
              <span className="font-bold">R {(feeBreakdown.baseStallFeeZar + feeBreakdown.vendrPlatformFeeZar).toFixed(2)}</span>
            </div>

            {feeBreakdown.docVerificationFeeZar > 0 && (
              <div className="flex justify-between py-1 border-b border-slate-100 text-amber-800 font-semibold">
                <span>Document Re-verification Fee</span>
                <span>R {feeBreakdown.docVerificationFeeZar.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between pt-2 text-sm font-black text-emerald-700 border-t border-slate-200">
              <span>Total Amount Payable</span>
              <span>R {feeBreakdown.totalZar.toFixed(2)}</span>
            </div>

            <p className="pt-2 text-[11px] text-slate-500 font-medium leading-relaxed border-t border-slate-100">
              * Plazr platform fee (5% / R {feeBreakdown.vendrPlatformFeeZar.toFixed(2)}) is automatically included in the actual stall fee and deducted separately from the organiser payout once paid.
            </p>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
              Select PayFast Payment Channel
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPaymentMethod('payfast_eft')}
                className={`p-3 rounded-xl border text-xs font-extrabold text-center transition-all ${
                  paymentMethod === 'payfast_eft'
                    ? 'bg-red-50 border-red-500 text-red-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Instant EFT
                <span className="block text-[10px] font-medium text-slate-500 mt-0.5">Capitec / FNB / Nedbank</span>
              </button>

              <button
                onClick={() => setPaymentMethod('payfast_card')}
                className={`p-3 rounded-xl border text-xs font-extrabold text-center transition-all ${
                  paymentMethod === 'payfast_card'
                    ? 'bg-red-50 border-red-500 text-red-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                3D Secure Card
                <span className="block text-[10px] font-medium text-slate-500 mt-0.5">Visa / Mastercard</span>
              </button>

              <button
                onClick={() => setPaymentMethod('wallet')}
                className={`p-3 rounded-xl border text-xs font-extrabold text-center transition-all ${
                  paymentMethod === 'wallet'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Plazr Wallet
                <span className="block text-[10px] font-medium text-slate-500 mt-0.5">Instant ZAR Debit</span>
              </button>
            </div>
          </div>

          {/* Security Badge */}
          <div className="flex items-center space-x-2 text-[11px] text-slate-600 p-2.5 rounded-lg bg-white border border-slate-200 font-medium">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>256-Bit SSL Encrypted. Stall reserved instantly upon PayFast payment clearance.</span>
          </div>

          {/* Checkout Trigger Button */}
          <button
            onClick={handlePayFastCheckout}
            disabled={isProcessing || paymentSuccess}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-md transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Connecting to PayFast Secure Gateway...</span>
            ) : paymentSuccess ? (
              <span className="flex items-center text-white">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-200" /> Payment Approved & Stall Locked!
              </span>
            ) : (
              <>
                <span>Pay R {feeBreakdown.totalZar.toFixed(2)} via PayFast</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
};
