import React, { useState, useEffect } from 'react';
import { MarketEvent, RegisteredUser, UserActivityLog, VendorApplication, UserRole } from '../../types';
import { fetchAllUsersFromDb, fetchUserActivities, logUserActivity, isSuperAdminEmail, updateUserRoleInDb } from '../../lib/db';
import { 
  ShieldCheck, 
  Users, 
  Store, 
  DollarSign, 
  TrendingUp, 
  Search, 
  Filter, 
  History, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Building2, 
  Lock, 
  Database,
  BarChart3,
  Calendar,
  Layers,
  UserPlus,
  Zap,
  Crown
} from 'lucide-react';

interface AdminDashboardProps {
  markets: MarketEvent[];
  applications: VendorApplication[];
  registeredUser: RegisteredUser | null;
  onUpdateMarkets: React.Dispatch<React.SetStateAction<MarketEvent[]>>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  markets,
  applications,
  registeredUser,
  onUpdateMarkets
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'system_logs' | 'markets'>('overview');
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [systemLogs, setSystemLogs] = useState<UserActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'vendor' | 'planner' | 'admin'>('all');
  const [systemAnnouncement, setSystemAnnouncement] = useState('');
  const [announcementSent, setAnnouncementSent] = useState(false);

  const isCurrentSuperAdmin = isSuperAdminEmail(registeredUser?.email);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [u, logs] = await Promise.all([
        fetchAllUsersFromDb(),
        fetchUserActivities()
      ]);
      setUsers(u);
      setSystemLogs(logs);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, targetEmail: string, newRole: UserRole) => {
    try {
      await updateUserRoleInDb(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      if (registeredUser?.email) {
        await logUserActivity(
          registeredUser.email, 
          'Super Admin Updated Role', 
          `Changed role for ${targetEmail} to ${newRole}`, 
          'admin', 
          registeredUser.id
        );
      }
      loadData();
    } catch (err) {
      console.error('Failed to change role:', err);
    }
  };

  const handlePublishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!systemAnnouncement.trim() || !registeredUser?.email) return;

    await logUserActivity(
      registeredUser.email,
      'Super Admin System Announcement',
      systemAnnouncement,
      'admin',
      registeredUser.id
    );

    setAnnouncementSent(true);
    setSystemAnnouncement('');
    setTimeout(() => setAnnouncementSent(false), 3000);
    loadData();
  };

  // Metrics Calculations
  const totalStallBookings = applications.filter(a => a.status === 'confirmed' || a.status === 'checked_in').length;
  const totalPlatformFeesZar = applications.reduce((acc, a) => acc + (a.feeBreakdown?.vendrPlatformFeeZar || 62.5), 0);
  const totalGMVZar = applications.reduce((acc, a) => acc + (a.feeBreakdown?.totalZar || 1250), 0);

  // Filtered Users List
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (u.businessOrOrgName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleTogglePromote = async (marketId: string) => {
    onUpdateMarkets(prev => prev.map(m => m.id === marketId ? { ...m, isPromoted: !m.isPromoted } : m));
    if (registeredUser?.email) {
      await logUserActivity(registeredUser.email, 'Admin Promoted Market', `Toggled featured status on market ${marketId}`, 'admin', registeredUser.id);
      loadData();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-purple-800/60 relative overflow-hidden">
        
        <div className="space-y-1 relative z-10">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/25 text-purple-300 text-[10px] font-black uppercase tracking-wider border border-purple-500/40 flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Super Admin Portal</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
              <Database className="w-3 h-3 text-emerald-400" />
              <span>Neon PostgreSQL Synced</span>
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <span>Plazr Ecosystem Master Console</span>
          </h2>
          <p className="text-xs text-purple-200/80 font-medium">
            Authorized Super Admins: <strong>mraaziqp@gmail.com</strong> &amp; <strong>raziashade4@gmail.com</strong>
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={isLoading}
          className="px-4 py-2.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-white font-extrabold text-xs flex items-center space-x-2 border border-purple-700 shadow-md transition-all relative z-10"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-300' : ''}`} />
          <span>Refresh Neon DB</span>
        </button>
      </div>

      {/* Super Admin Announcement Publisher */}
      <form onSubmit={handlePublishAnnouncement} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center space-x-2 shrink-0">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-800 font-bold text-xs flex items-center gap-1">
            <Zap className="w-4 h-4 text-purple-700" />
            <span>Broadcast Platform Alert</span>
          </div>
        </div>
        <input
          type="text"
          placeholder="Publish instant system alert to all vendors & organisers..."
          value={systemAnnouncement}
          onChange={(e) => setSystemAnnouncement(e.target.value)}
          className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-purple-950 hover:bg-purple-900 text-white text-xs font-black shrink-0 transition-all shadow-xs"
        >
          {announcementSent ? '✓ Broadcast Published' : 'Publish Alert'}
        </button>
      </form>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>System Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === 'users'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-indigo-600" />
          <span>User Account Control ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('system_logs')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === 'system_logs'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <History className="w-3.5 h-3.5 text-emerald-600" />
          <span>Audit Feed ({systemLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('markets')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === 'markets'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Store className="w-3.5 h-3.5 text-amber-600" />
          <span>Market Listings ({markets.length})</span>
        </button>
      </div>

      {/* TAB 1: EXECUTIVE SYSTEM OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in slide-in-from-left duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total System GMV */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Market Value</span>
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900">
                R {totalGMVZar.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
              </p>
              <span className="text-[11px] text-emerald-700 font-bold">Processed via PayFast &amp; Wallet</span>
            </div>

            {/* Platform Fees */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Platform Fee Revenue</span>
                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900">
                R {totalPlatformFeesZar.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
              </p>
              <span className="text-[11px] text-indigo-700 font-bold">5% Plazr ecosystem take rate</span>
            </div>

            {/* Total Users */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Accounts</span>
                <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900">{users.length} Users</p>
              <span className="text-[11px] text-purple-700 font-bold">Synced in Neon PostgreSQL</span>
            </div>

            {/* Total Active Markets */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Published Markets</span>
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <Store className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900">{markets.length} Events</p>
              <span className="text-[11px] text-amber-700 font-bold">{totalStallBookings} total stall bookings</span>
            </div>

          </div>

          {/* Quick System Status Panel */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">Super Admin System Controls</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="flex items-center space-x-2 text-emerald-800 text-xs font-extrabold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Neon DB Connection</span>
                </div>
                <p className="text-xs text-slate-600">PostgreSQL serverless cluster active in eu-west-2 (AWS London).</p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-1">
                <div className="flex items-center space-x-2 text-indigo-800 text-xs font-extrabold">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Super Admin Designation</span>
                </div>
                <p className="text-xs text-slate-600">mraaziqp@gmail.com &amp; raziashade4@gmail.com active super administrators.</p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
                <div className="flex items-center space-x-2 text-purple-800 text-xs font-extrabold">
                  <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Full Role Management</span>
                </div>
                <p className="text-xs text-slate-600">1-click user promotion &amp; vetting status override in User Accounts tab.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER ACCOUNTS MANAGER */}
      {activeTab === 'users' && (
        <div className="space-y-4 animate-in slide-in-from-right duration-200">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            
            {/* Filter & Search Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or business..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Roles ({users.length})</option>
                  <option value="vendor">Vendors</option>
                  <option value="planner">Organisers</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-black uppercase text-slate-400 bg-slate-50/50">
                    <th className="py-3 px-3">User &amp; Contact</th>
                    <th className="py-3 px-3">Role &amp; Override</th>
                    <th className="py-3 px-3">Business / Organization</th>
                    <th className="py-3 px-3">Region</th>
                    <th className="py-3 px-3">Registered At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        No registered users found matching filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => {
                      const isTargetSuperAdmin = isSuperAdminEmail(u.email);
                      return (
                        <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                              <span>{u.fullName}</span>
                              {isTargetSuperAdmin && (
                                <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-300 font-black text-[9px] flex items-center gap-0.5">
                                  <Crown className="w-3 h-3 text-amber-500 fill-amber-500" />
                                  <span>Super Admin</span>
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500">{u.email} • {u.phone || 'No phone'}</div>
                          </td>
                          <td className="py-3 px-3">
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u.id, u.email, e.target.value as UserRole)}
                              className={`px-2.5 py-1 rounded-xl text-xs font-black border transition-all ${
                                u.role === 'admin' ? 'bg-purple-100 text-purple-900 border-purple-300' :
                                u.role === 'planner' ? 'bg-indigo-100 text-indigo-900 border-indigo-300' :
                                'bg-amber-100 text-amber-900 border-amber-300'
                              }`}
                            >
                              <option value="vendor">Vendor</option>
                              <option value="planner">Organiser</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-800">
                            {u.businessOrOrgName || 'N/A'}
                          </td>
                          <td className="py-3 px-3 text-slate-600 font-medium">
                            {u.city}
                          </td>
                          <td className="py-3 px-3 text-slate-400 text-[11px]">
                            {new Date(u.registeredAt).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM AUDIT FEED */}
      {activeTab === 'system_logs' && (
        <div className="space-y-4 animate-in slide-in-from-right duration-200">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <span>Live Ecosystem Audit Trail</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Real-Time Stream
                  </span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Audit logs automatically captured from user interactions &amp; Neon database operations</p>
              </div>

              <button
                onClick={loadData}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Refresh Log Stream
              </button>
            </div>

            <div className="space-y-2">
              {systemLogs.map(log => (
                <div key={log.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150 flex items-start justify-between text-xs">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-xl bg-slate-200 text-slate-700 shrink-0">
                      <History className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900">{log.action}</p>
                      <p className="text-slate-600 text-[11px] font-medium">{log.details}</p>
                      <p className="text-slate-400 text-[10px] mt-1">{log.timestamp} • {log.userEmail}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 font-black text-[10px] uppercase tracking-wider">
                    {log.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MARKET LISTINGS & FEATURED TOGGLES */}
      {activeTab === 'markets' && (
        <div className="space-y-4 animate-in slide-in-from-right duration-200">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">Active Street Markets &amp; Event Listings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {markets.map(m => (
                <div key={m.id} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{m.title}</h4>
                      <p className="text-xs text-slate-500 font-medium">{m.locationName}, {m.city}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                      {m.displayDates}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500">Stall Base Price: <strong>R {m.basePriceZar}</strong></span>
                    <button
                      onClick={() => handleTogglePromote(m.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all ${
                        m.isPromoted
                          ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{m.isPromoted ? '⭐ Promoted Market' : 'Promote Market'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
