import React, { useState } from 'react';
import { UserRole, VendorProfile, NotificationItem, RegisteredUser } from '../types';
import { 
  Store, 
  LayoutDashboard, 
  Wallet, 
  ShieldCheck, 
  ShieldAlert, 
  Bell, 
  Smartphone, 
  Monitor,
  ChevronDown,
  Sparkles,
  Menu,
  X,
  Compass,
  Calendar,
  FileCheck,
  QrCode,
  Download,
  BarChart3,
  MessageSquare,
  Users,
  Zap,
  Flame,
  User,
  ArrowRight,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  vendorProfile: VendorProfile;
  registeredUser?: RegisteredUser | null;
  walletBalanceZar: number;
  notifications: NotificationItem[];
  onOpenWallet: () => void;
  onOpenDocVault: () => void;
  onOpenNotifications: () => void;
  unreadNotifCount: number;
  mobileFrameMode: boolean;
  onToggleMobileFrameMode: () => void;
  // Navigation actions
  vendorActiveTab?: 'discovery' | 'applications' | 'sales' | 'vault';
  onSelectVendorTab?: (tab: 'discovery' | 'applications' | 'sales' | 'vault') => void;
  plannerActiveTab?: 'queue' | 'floorplan' | 'revenue' | 'gate_loadin';
  onSelectPlannerTab?: (tab: 'queue' | 'floorplan' | 'revenue' | 'gate_loadin') => void;
  onOpenQRScanner?: () => void;
  onOpenComplianceExport?: () => void;
  onOpenMarketPerformance?: () => void;
  onOpenPromoteModal?: () => void;
  onOpenAuthModal?: (role?: UserRole) => void;
  onOpenLocationPreferences?: () => void;
  onOpenAddMarketModal?: () => void;
  onReplaySplash?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeRole,
  onRoleChange,
  vendorProfile,
  registeredUser,
  walletBalanceZar,
  onOpenWallet,
  onOpenDocVault,
  onOpenNotifications,
  unreadNotifCount,
  mobileFrameMode,
  onToggleMobileFrameMode,
  vendorActiveTab = 'discovery',
  onSelectVendorTab,
  plannerActiveTab = 'queue',
  onSelectPlannerTab,
  onOpenQRScanner,
  onOpenComplianceExport,
  onOpenMarketPerformance,
  onOpenPromoteModal,
  onOpenAuthModal,
  onOpenLocationPreferences,
  onOpenAddMarketModal,
  onReplaySplash,
  onLogout
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check if user is registered as an organiser
  const isOrganiser = registeredUser?.role === 'planner';

  // Check if any required document is expiring or expired
  const hasExpiringDoc = vendorProfile.documents.some(
    d => d.status === 'expiring_soon' || d.status === 'expired'
  );

  const displayName = registeredUser?.fullName || vendorProfile.ownerName;
  const displayBusiness = registeredUser?.businessOrOrgName || vendorProfile.businessName;

  return (
    <>
      {/* INSTAGRAM-STYLE HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand Logo & Mode Toggle */}
            <div className="flex items-center space-x-3">
              <button
                onClick={onReplaySplash}
                title="Click to replay startup splash animation"
                className="flex items-center space-x-2 group text-left focus:outline-none"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center p-1 border border-slate-800 shadow-xs group-hover:border-emerald-500/50 group-hover:scale-105 transition-all">
                  <svg
                    className="w-full h-full text-[#65bd82]"
                    viewBox="0 0 140 140"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {/* Top-Left Gazebo */}
                    <path d="M 22 42 L 44 14 L 66 42" />
                    <path d="M 44 14 L 44 42" />
                    <path d="M 22 42 L 22 47 L 44 52 L 66 47 L 66 42 L 22 42" />
                    <path d="M 23 47 L 23 88" />
                    <path d="M 44 52 L 44 88" />
                    <path d="M 65 47 L 65 88" />
                    <path d="M 23 68 L 65 68" strokeWidth="4" />
                    <circle cx="50" cy="56" r="3.5" fill="currentColor" />
                    {/* Bottom-Left Produce Table & Customer */}
                    <path d="M 26 88 L 56 88" strokeWidth="4" />
                    <path d="M 27 88 L 27 106" />
                    <path d="M 55 88 L 55 106" />
                    <circle cx="32" cy="84" r="2.5" fill="currentColor" />
                    <circle cx="38" cy="84" r="2.5" fill="currentColor" />
                    <circle cx="44" cy="84" r="2.5" fill="currentColor" />
                    <circle cx="12" cy="84" r="3.5" fill="currentColor" />
                    <path d="M 12 87.5 L 12 106" />
                    {/* Top-Right Kiosk */}
                    <path d="M 72 26 L 94 12 L 118 26" />
                    <path d="M 72 26 L 72 31 L 118 31 L 118 26 L 72 26" />
                    <path d="M 74 31 L 74 70" />
                    <path d="M 116 31 L 116 70" />
                    <path d="M 74 52 L 116 52" strokeWidth="4" />
                    <circle cx="84" cy="42" r="3.5" fill="currentColor" />
                    <circle cx="98" cy="42" r="3.5" fill="currentColor" />
                    {/* Bottom-Right Gazebo Canopy */}
                    <path d="M 74 72 L 96 46 L 118 72" />
                    <path d="M 74 72 L 74 77 L 96 82 L 118 77 L 118 72 L 74 72" />
                    <path d="M 75 77 L 75 118" />
                    <path d="M 117 77 L 117 118" />
                    <path d="M 75 96 L 117 96" strokeWidth="4" />
                    <circle cx="86" cy="85" r="3.5" fill="currentColor" />
                    <circle cx="124" cy="98" r="3.5" fill="currentColor" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xl font-black tracking-tight text-slate-900 leading-none">Plazr</span>
                    <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300/80">SA</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold hidden sm:inline">Street Market Ecosystem</span>
                </div>
              </button>

              {/* Workspace Badge */}
              <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl text-xs font-extrabold border border-slate-200">
                <button
                  onClick={() => onRoleChange('vendor')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    activeRole === 'vendor' 
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Vendor Hub
                </button>
                <button
                  onClick={() => {
                    if (isOrganiser) {
                      onRoleChange('planner');
                    } else if (onOpenAuthModal) {
                      onOpenAuthModal('planner');
                    }
                  }}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center space-x-1 ${
                    activeRole === 'planner' 
                      ? 'bg-slate-900 text-white shadow-xs' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span>Organiser</span>
                  {!isOrganiser && <Sparkles className="w-3 h-3 text-amber-400" />}
                </button>
                <button
                  onClick={() => onRoleChange('admin')}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center space-x-1 ${
                    activeRole === 'admin' 
                      ? 'bg-purple-950 text-white shadow-xs font-black' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span>Admin</span>
                  <ShieldCheck className="w-3 h-3 text-purple-400" />
                </button>
              </div>
            </div>

            {/* Desktop Center Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 text-xs">
              
              {/* Explore Markets */}
              <button
                onClick={() => {
                  onRoleChange('vendor');
                  if (onSelectVendorTab) onSelectVendorTab('discovery');
                }}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full font-bold transition-all ${
                  vendorActiveTab === 'discovery' && activeRole === 'vendor'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-emerald-600" />
                <span>Explore Markets</span>
              </button>

              {/* Sales Analytics */}
              <button
                onClick={() => {
                  onRoleChange('vendor');
                  if (onSelectVendorTab) onSelectVendorTab('sales');
                }}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full font-bold transition-all ${
                  vendorActiveTab === 'sales' && activeRole === 'vendor'
                    ? 'bg-amber-50 text-amber-800 border border-amber-200 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
                <span>Sales & Revenue</span>
              </button>

              {/* Applications & Bookings */}
              <button
                onClick={() => {
                  onRoleChange('vendor');
                  if (onSelectVendorTab) onSelectVendorTab('applications');
                }}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full font-bold transition-all ${
                  vendorActiveTab === 'applications' && activeRole === 'vendor'
                    ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>Application Progress</span>
              </button>

              {/* Documents */}
              <button
                onClick={onOpenDocVault}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full font-bold text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Documents</span>
              </button>

              {/* Wallet */}
              <button
                onClick={onOpenWallet}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>R {walletBalanceZar.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}</span>
              </button>

              {/* Promote Market Action Button (Planner) */}
              {activeRole === 'planner' && (
                <button
                  onClick={onOpenPromoteModal}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-xs hover:opacity-95 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                  <span>⭐ Promote Market</span>
                </button>
              )}
            </div>

            {/* Right: Actions, Notifications & Menu Option */}
            <div className="flex items-center space-x-2">
              
              {/* Mobile Frame Toggle (Desktop view) */}
              {activeRole === 'vendor' && (
                <button
                  onClick={onToggleMobileFrameMode}
                  title={mobileFrameMode ? "Full Width Screen View" : "Mobile Frame View"}
                  className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all hidden lg:flex items-center"
                >
                  {mobileFrameMode ? <Monitor className="w-4 h-4 text-indigo-600" /> : <Smartphone className="w-4 h-4 text-slate-600" />}
                </button>
              )}

              {/* Notifications Icon */}
              <button
                onClick={onOpenNotifications}
                className="relative p-2 rounded-full text-slate-700 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[9px] font-black text-white bg-rose-500 rounded-full">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {/* Document Status Pill */}
              <button
                onClick={onOpenDocVault}
                title="Verified through verifiedbizlink.co.za"
                className={`hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${
                  hasExpiringDoc
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                }`}
              >
                {hasExpiringDoc ? (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    <span>Docs Expiring</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified</span>
                    <span className="text-[10px] text-emerald-700/90 font-semibold hidden lg:inline">via verifiedbizlink.co.za</span>
                  </>
                )}
              </button>

              {/* Desktop Quick Log Out button if logged in */}
              {registeredUser && onLogout && (
                <button
                  onClick={onLogout}
                  title={`Log Out (${registeredUser.email})`}
                  className="hidden md:flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span>Log Out</span>
                </button>
              )}

              {/* User Profile Avatar */}
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="flex items-center p-0.5 rounded-full border-2 border-emerald-500 hover:scale-105 transition-transform"
                title="Open Control Menu"
              >
                <img
                  src={vendorProfile.avatar}
                  alt={displayName}
                  className="w-7 h-7 rounded-full object-cover"
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* SLIDE-OUT CONTROL MENU DRAWER */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
              
              {/* Drawer Header & Profile */}
              <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={vendorProfile.avatar}
                    alt={displayName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-300 shadow-xs"
                  />
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">{displayName}</h3>
                    <p className="text-xs text-slate-500 font-medium">{displayBusiness}</p>
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold mt-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>{registeredUser ? `Logged in: ${registeredUser.email}` : 'Verified through verifiedbizlink.co.za'}</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-200 text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Role Switcher */}
              <div className="p-4 bg-slate-100 border-b border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Switch Workspace</div>
                  {onOpenAuthModal && (
                    <button
                      onClick={() => {
                        onOpenAuthModal();
                        setIsMenuOpen(false);
                      }}
                      className="text-[11px] font-extrabold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
                    >
                      <User className="w-3 h-3" />
                      <span>{registeredUser ? 'Account Settings' : 'Sign In / Register'}</span>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onRoleChange('vendor');
                      setIsMenuOpen(false);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                      activeRole === 'vendor'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Vendor Portal
                  </button>
                  {isOrganiser ? (
                    <button
                      onClick={() => {
                        onRoleChange('planner');
                        setIsMenuOpen(false);
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                        activeRole === 'planner'
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Organizer Dashboard
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (onOpenAuthModal) onOpenAuthModal('planner');
                        setIsMenuOpen(false);
                      }}
                      className="py-2 px-3 rounded-xl text-xs font-bold transition-all text-center bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 flex items-center justify-center space-x-1 shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Join as Organiser</span>
                    </button>
                  )}
                </div>

                {/* Account Action Banner */}
                {registeredUser && onLogout ? (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-extrabold text-xs flex items-center justify-between shadow-xs hover:bg-rose-100 transition-all"
                  >
                    <div className="flex items-center space-x-2">
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>Log Out of Account</span>
                    </div>
                    <span className="text-[10px] bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full font-bold">End Session</span>
                  </button>
                ) : (
                  onOpenAuthModal && (
                    <button
                      onClick={() => {
                        onOpenAuthModal();
                        setIsMenuOpen(false);
                      }}
                      className="w-full p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-extrabold text-xs flex items-center justify-between shadow-xs hover:opacity-95 transition-all"
                    >
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                        <span>Sign In / Create Account</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </button>
                  )
                )}
              </div>

              {/* Drawer Links List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5">
                
                {/* Primary Navigation Section */}
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">Core Marketplace</h4>
                  <div className="space-y-1">
                    
                    <button
                      onClick={() => {
                        onRoleChange('vendor');
                        if (onSelectVendorTab) onSelectVendorTab('discovery');
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <Flame className="w-4 h-4" />
                        </div>
                        <span>Explore Street Markets</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={() => {
                        onRoleChange('vendor');
                        if (onSelectVendorTab) onSelectVendorTab('applications');
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <span>Application Progress & Bookings</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={() => {
                        onOpenDocVault();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <span>Compliance & Document Vault</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </button>

                    {onOpenLocationPreferences && (
                      <button
                        onClick={() => {
                          onOpenLocationPreferences();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                            <Compass className="w-4 h-4" />
                          </div>
                          <span>Operating Locations & Radius</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onOpenWallet();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                          <Wallet className="w-4 h-4" />
                        </div>
                        <span>Wallet & PayFast Payouts</span>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        R {walletBalanceZar.toLocaleString()}
                      </span>
                    </button>

                  </div>
                </div>

                {/* Organizer Tools Section - Only shown if user registered as an organiser */}
                {isOrganiser ? (
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">Organizer & Gate Tools</h4>
                    <div className="space-y-1">
                      
                      {onOpenAddMarketModal && (
                        <button
                          onClick={() => {
                            onOpenAddMarketModal();
                            setIsMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold transition-colors hover:bg-slate-800"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                              <Store className="w-4 h-4" />
                            </div>
                            <span>Publish / Edit Market Location</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-emerald-400" />
                        </button>
                      )}
                      
                      {onOpenQRScanner && (
                        <button
                          onClick={() => {
                            onOpenQRScanner();
                            setIsMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center">
                              <QrCode className="w-4 h-4" />
                            </div>
                            <span>Gate Pass QR Scanner</span>
                          </div>
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Simulator</span>
                        </button>
                      )}

                      {onOpenComplianceExport && (
                        <button
                          onClick={() => {
                            onOpenComplianceExport();
                            setIsMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                              <Download className="w-4 h-4" />
                            </div>
                            <span>Municipal Compliance Register Export</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </button>
                      )}

                      {onOpenMarketPerformance && (
                        <button
                          onClick={() => {
                            onOpenMarketPerformance();
                            setIsMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                              <BarChart3 className="w-4 h-4" />
                            </div>
                            <span>Market Performance & Reviews</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          onRoleChange('planner');
                          if (onSelectPlannerTab) onSelectPlannerTab('floorplan');
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                            <Zap className="w-4 h-4" />
                          </div>
                          <span>Interactive Layout & Utilities</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </button>

                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">Organiser Portal</h4>
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-2.5 border border-slate-800 shadow-md">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-black tracking-tight">Host Street Markets & Events</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                        Register as an official Event Organiser to publish markets, manage vendor approvals, floorplans & gate QR check-ins.
                      </p>
                      <button
                        onClick={() => {
                          if (onOpenAuthModal) onOpenAuthModal('planner');
                          setIsMenuOpen(false);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Register as Organiser</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Drawer Footer with Log Out */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
                {registeredUser && onLogout && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black flex items-center justify-center space-x-2 transition-all shadow-md"
                  >
                    <LogOut className="w-4 h-4 text-white" />
                    <span>Log Out ({registeredUser.email})</span>
                  </button>
                )}
                <p className="text-center text-[11px] text-slate-500 font-medium">
                  Plazr ZA • Connecting South African Street Vendors & Market Planners
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};
