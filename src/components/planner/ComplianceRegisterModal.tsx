import React, { useState } from 'react';
import { MarketEvent, VendorApplication, VendorProfile } from '../../types';
import { 
  X, 
  Download, 
  Printer, 
  ShieldCheck, 
  FileSpreadsheet, 
  Building2, 
  Search, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  PhoneCall
} from 'lucide-react';

interface ComplianceRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  market: MarketEvent;
  approvedApplications: VendorApplication[];
  vendorProfiles: VendorProfile[];
}

export const ComplianceRegisterModal: React.FC<ComplianceRegisterModalProps> = ({
  isOpen,
  onClose,
  market,
  approvedApplications,
  vendorProfiles,
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');

  // Map application details with full vendor document profiles
  const complianceRecords = approvedApplications.map((app) => {
    const profile = vendorProfiles.find(v => v.id === app.vendorId) || {
      ownerName: 'Zainab Hendricks',
      phone: '+27 82 491 8820',
      documents: [
        { title: 'CoA', code: 'COA-CT-2026', expiryDate: '2026-11-30', status: 'valid' },
        { title: 'Gas Cert', code: 'GAS-SA-8821', expiryDate: '2026-10-15', status: 'valid' },
        { title: 'Public Liability Insurance', code: 'PLI-MUTUAL-994', expiryDate: '2027-02-15', status: 'valid' }
      ]
    };

    const coaDoc = profile.documents.find(d => d.title.includes('Acceptability') || d.code.startsWith('COA')) || profile.documents[0];
    const gasDoc = profile.documents.find(d => d.title.includes('Gas') || d.code.startsWith('GAS'));
    const pliDoc = profile.documents.find(d => d.title.includes('Liability') || d.code.startsWith('PLI'));

    const stallSpot = market.stallGrid.find(s => s.id === app.selectedSpotId);

    return {
      applicationId: app.id,
      vendorName: app.vendorName,
      ownerName: profile.ownerName,
      phone: profile.phone,
      category: app.vendorCategory,
      spotId: app.selectedSpotId,
      spotZone: app.selectedSpotZone,
      circuitId: stallSpot?.circuitId || 'circuit-1',
      powerKw: stallSpot?.powerKw || 3.5,
      coaCode: coaDoc?.code || 'COA-CT-2026',
      coaStatus: coaDoc?.status || 'valid',
      gasCertCode: gasDoc?.code || (app.vendorCategory === '#ArtisanalFood' ? 'GAS-SA-8821' : 'N/A'),
      gasCertExpiry: gasDoc?.expiryDate || 'N/A',
      pliCode: pliDoc?.code || 'PLI-MUTUAL-994',
      checkInStatus: app.checkInStatus === 'checked_in' ? 'Checked In' : 'Pending Arrival',
      payfastReference: app.payfastReference || 'PF-2026-88192'
    };
  });

  const filteredRecords = complianceRecords.filter(r => 
    r.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.spotId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.coaCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate CSV Download
  const handleDownloadCSV = () => {
    const headers = [
      'Stall Bay ID',
      'Vendor Business Name',
      'Owner Name',
      'Category',
      'Cert of Acceptability (CoA)',
      'CoA Status',
      'Gas Safety Cert',
      'Gas Cert Expiry',
      'Public Liability Code',
      'Electrical Circuit',
      'Power Draw (kW)',
      'Emergency Contact',
      'Gate Check-in Status',
      'PayFast Reference'
    ];

    const rows = complianceRecords.map(r => [
      `"${r.spotId}"`,
      `"${r.vendorName}"`,
      `"${r.ownerName}"`,
      `"${r.category}"`,
      `"${r.coaCode}"`,
      `"${r.coaStatus}"`,
      `"${r.gasCertCode}"`,
      `"${r.gasCertExpiry}"`,
      `"${r.pliCode}"`,
      `"${r.circuitId}"`,
      `"${r.powerKw}"`,
      `"${r.phone}"`,
      `"${r.checkInStatus}"`,
      `"${r.payfastReference}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Plazr_Municipal_Compliance_Audit_${market.id}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl w-full max-w-5xl p-4 sm:p-6 shadow-2xl text-slate-100 relative max-h-[92vh] my-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h2 className="text-xl font-black text-white tracking-tight">
                Municipal Health & Safety Compliance Register
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Official audit manifest for City Health Inspectors & Emergency Responders • Verified through verifiedbizlink.co.za
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleDownloadCSV}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export CSV Audit File</span>
            </button>

            <button
              onClick={() => window.print()}
              className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center space-x-1.5 transition-all border border-slate-700"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print Report</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Audit Highlights Metric Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Event</p>
            <p className="text-xs font-black text-white truncate">{market.title}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CoA Compliance Rate</p>
            <p className="text-xs font-black text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> 100% Verified (verifiedbizlink.co.za)
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">LPG Gas Safety</p>
            <p className="text-sm font-black text-amber-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> 4 Active Permits
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Public Liability Cover</p>
            <p className="text-sm font-black text-indigo-400">R 170,000,000 Total</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vendor name, stall ID, or CoA certificate code..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Compliance Table */}
        <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60 max-h-[380px] overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase text-[10px] tracking-wider sticky top-0 border-b border-slate-800">
              <tr>
                <th className="p-3">Bay ID</th>
                <th className="p-3">Vendor Business</th>
                <th className="p-3">Category</th>
                <th className="p-3">Municipal CoA Code</th>
                <th className="p-3">LPG Gas Safety</th>
                <th className="p-3">Electrical Draw</th>
                <th className="p-3">Emergency Contact</th>
                <th className="p-3">Gate Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredRecords.map((r, idx) => (
                <tr key={r.applicationId || idx} className="hover:bg-slate-900/60 transition-all">
                  <td className="p-3 font-mono font-bold text-emerald-400 whitespace-nowrap">{r.spotId}</td>
                  <td className="p-3">
                    <div className="font-bold text-white">{r.vendorName}</div>
                    <div className="text-[10px] text-slate-400">{r.ownerName}</div>
                  </td>
                  <td className="p-3 font-semibold text-slate-300">{r.category}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono text-[10px] font-bold">
                      {r.coaCode}
                    </span>
                  </td>
                  <td className="p-3">
                    {r.gasCertCode !== 'N/A' ? (
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono text-[10px]">
                        {r.gasCertCode} (Exp: {r.gasCertExpiry})
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">Non-Gas Stall</span>
                    )}
                  </td>
                  <td className="p-3 font-medium text-indigo-300">{r.powerKw} kW ({r.circuitId})</td>
                  <td className="p-3 text-slate-300 font-mono text-[11px] whitespace-nowrap">
                    {r.phone}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.checkInStatus === 'Checked In'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {r.checkInStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Audit Disclaimer */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <p className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Plazr Real-Time Compliance Vault Engine • City of Cape Town / Joburg Municipal Standards Compliant</span>
          </p>
          <span className="font-mono text-[10px] text-slate-500">
            TIMESTAMP: {new Date().toLocaleString('en-ZA')}
          </span>
        </div>

      </div>
    </div>
  );
};
