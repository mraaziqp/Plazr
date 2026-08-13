import React, { useState } from 'react';
import { VendorProfile, DocumentItem } from '../types';
import { 
  ShieldCheck, 
  ShieldAlert, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  X, 
  RefreshCw, 
  AlertTriangle,
  Lock,
  Sparkles,
  Calendar,
  Building2
} from 'lucide-react';

interface DocumentVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorProfile: VendorProfile;
  walletBalanceZar: number;
  onUpdateDocument: (docId: string, newExpiryDate: string) => void;
  onPayVettingFee: () => void;
}

export const DocumentVaultModal: React.FC<DocumentVaultModalProps> = ({
  isOpen,
  onClose,
  vendorProfile,
  walletBalanceZar,
  onUpdateDocument,
  onPayVettingFee,
}) => {
  const [selectedDocToRenew, setSelectedDocToRenew] = useState<DocumentItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [ocrScanning, setOcrScanning] = useState(false);
  const [renewalSuccess, setRenewalSuccess] = useState(false);
  const [vettingProcessing, setVettingProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSimulateDocumentRenewal = (doc: DocumentItem) => {
    setSelectedDocToRenew(doc);
  };

  const handleConfirmRenewal = () => {
    if (!selectedDocToRenew) return;
    setIsUploading(true);

    setTimeout(() => {
      setIsUploading(false);
      setOcrScanning(true);

      setTimeout(() => {
        setOcrScanning(false);
        // Add 1 year from now to expiry date
        const nextYearDate = '2027-08-30';
        onUpdateDocument(selectedDocToRenew.id, nextYearDate);
        setRenewalSuccess(true);

        setTimeout(() => {
          setRenewalSuccess(false);
          setSelectedDocToRenew(null);
        }, 1800);
      }, 1500);
    }, 1200);
  };

  const handleSimulateVettingFee = () => {
    setVettingProcessing(true);
    setTimeout(() => {
      onPayVettingFee();
      setVettingProcessing(false);
    }, 1500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-200 overflow-hidden"
      onClick={onClose}
    >
      <div 
        className="flex flex-col bg-white border border-slate-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl text-slate-900 max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black text-slate-900">Compliance & Verification</h3>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Municipal Standard
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Manage Certificates of Acceptability, LPG Permits & Liability Cover</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto bg-slate-50">

          {/* Vetting Fee / Onboarding Status Banner */}
          {!vendorProfile.vettingFeePaid ? (
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-extrabold text-slate-900">Initial Verification Onboarding (via verifiedbizlink.co.za)</span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  One-time R50 vetting fee grants full marketplace application privileges across SA event networks.
                </p>
              </div>
              <button
                onClick={handleSimulateVettingFee}
                disabled={vettingProcessing}
                className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-xs transition-all shrink-0 ml-4"
              >
                {vettingProcessing ? 'Verifying...' : 'Pay R50 Vetting Fee'}
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-emerald-900 font-medium">
                  <strong>Initial Vendor Vetting Active:</strong> Certified merchant profile verified through <strong>verifiedbizlink.co.za</strong>.
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] border border-emerald-300">
                VERIFIED
              </span>
            </div>
          )}

          {/* Renewal Modal Overlay if doc selected */}
          {selectedDocToRenew && (
            <div className="p-5 rounded-2xl bg-white border border-indigo-200 space-y-4 shadow-md animate-in zoom-in-95">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-indigo-600" />
                    Re-verify Document: {selectedDocToRenew.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">
                    Re-verification via verifiedbizlink.co.za: <strong className="text-emerald-700">Free (R0.00)</strong>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDocToRenew(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Upload Dropzone Simulator */}
              <div className="border-2 border-dashed border-indigo-200 rounded-xl p-6 text-center bg-indigo-50/50 hover:bg-indigo-50 transition-colors cursor-pointer">
                <UploadCloud className="w-8 h-8 text-indigo-600 mx-auto mb-2 animate-bounce" />
                <p className="text-xs font-bold text-slate-900">
                  Click or drag new certificate photo / PDF scan here
                </p>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">
                  Supports JPEG, PNG, PDF up to 10MB (verified through verifiedbizlink.co.za)
                </p>
              </div>

              {/* Status Simulation Feedback */}
              {isUploading && (
                <div className="p-3 rounded-lg bg-indigo-50 text-indigo-900 text-xs flex items-center justify-center space-x-2 border border-indigo-200">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                  <span className="font-bold">Uploading certificate scan securely to Vault...</span>
                </div>
              )}

              {ocrScanning && (
                <div className="p-3 rounded-lg bg-purple-50 text-purple-900 text-xs flex items-center justify-center space-x-2 border border-purple-200">
                  <Sparkles className="w-4 h-4 animate-pulse text-purple-600" />
                  <span className="font-bold">Running Verification: Checking SA Official Stamp & Expiry via verifiedbizlink.co.za...</span>
                </div>
              )}

              {renewalSuccess && (
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-900 text-xs flex items-center justify-center space-x-2 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">Verified through verifiedbizlink.co.za! Expiry extended to 30 August 2027. Free update applied.</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  onClick={() => setSelectedDocToRenew(null)}
                  className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRenewal}
                  disabled={isUploading || ocrScanning || renewalSuccess}
                  className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-xs disabled:opacity-50"
                >
                  Re-verify Document (Free)
                </button>
              </div>
            </div>
          )}

          {/* List of Documents in Vault */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Required Market Compliance Certificates (Verified by verifiedbizlink.co.za)
            </h4>

            <div className="space-y-3">
              {vendorProfile.documents.map((doc) => {
                const isWarning = doc.status === 'expiring_soon' || doc.status === 'expired';

                return (
                  <div
                    key={doc.id}
                    className={`p-4 rounded-xl border transition-all text-xs ${
                      isWarning
                        ? 'bg-amber-50 border-amber-200 shadow-xs'
                        : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      
                      <div className="flex items-start space-x-3">
                        <div className={`p-2.5 rounded-xl mt-0.5 ${
                          isWarning ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          <FileText className="w-5 h-5" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-sm">{doc.title}</span>
                            <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full ${
                              isWarning
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                            }`}>
                              {doc.status === 'expiring_soon' ? 'EXPIRES SOON' : doc.status === 'expired' ? 'EXPIRED' : 'VALID'}
                            </span>
                          </div>

                          <p className="text-slate-500 text-[11px] flex items-center gap-1.5 font-medium">
                            <Building2 className="w-3 h-3 text-slate-400" />
                            Issued by: {doc.issuedBy} • Code: {doc.code}
                          </p>

                          <p className={`text-[11px] font-medium flex items-center gap-1.5 ${
                            isWarning ? 'text-amber-900 font-bold' : 'text-slate-600'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            Expiration Date: <strong>{doc.expiryDate}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Update Action Button */}
                      <div className="sm:self-center">
                        <button
                          onClick={() => handleSimulateDocumentRenewal(doc)}
                          className={`w-full sm:w-auto px-3.5 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                            isWarning
                              ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs font-extrabold animate-pulse'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                          }`}
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Update Doc (Free)</span>
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
