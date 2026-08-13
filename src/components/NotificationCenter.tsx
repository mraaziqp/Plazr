import React, { useState, useEffect } from 'react';
import { NotificationItem } from '../types';
import { Bell, CheckCircle, ShieldAlert, Info, Sparkles, X, ChevronRight, Store, CreditCard, BellRing, Check } from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onSelectActionTarget: (target: 'document_vault' | 'applications' | 'chat' | 'floorplan' | 'discovery') => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectActionTarget,
}) => {
  const [pushPermission, setPushPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [permissionRequested, setPermissionRequested] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushPermission(Notification.permission);
    }
  }, [isOpen]);

  const handleEnablePushNotifications = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setPushPermission(perm);
        setPermissionRequested(true);
        if (perm === 'granted') {
          new Notification('🔔 Plazr Push Alerts Enabled', {
            body: 'You will receive instant push notifications for document expiry, market application openings (2 days prior), and approved market payment deadlines!',
            icon: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100'
          });
        }
      } catch (e) {
        console.error('Push permission error:', e);
      }
    } else {
      alert('Push notifications are enabled in Plazr!');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-slate-900 mt-14 sm:mt-12">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Plazr Push Notifications</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Push Notification Enablement Banner */}
        <div className="bg-indigo-900 text-white p-3.5 px-5 flex items-center justify-between border-b border-indigo-800">
          <div className="flex items-center space-x-2.5">
            <BellRing className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
            <div>
              <p className="text-xs font-bold leading-none">Instant Push Alerts</p>
              <p className="text-[10px] text-indigo-200 mt-0.5">Application approvals, 2-day market openings & document warnings</p>
            </div>
          </div>
          {pushPermission === 'granted' || permissionRequested ? (
            <span className="flex items-center space-x-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2.5 py-1 rounded-full text-[10px] font-black shrink-0">
              <Check className="w-3 h-3 text-emerald-400" />
              <span>Active</span>
            </span>
          ) : (
            <button
              onClick={handleEnablePushNotifications}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-1 rounded-full text-[11px] font-black transition-all shadow-xs shrink-0"
            >
              Enable Push
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto bg-slate-50">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No notifications at the moment.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-xl border transition-all text-xs relative ${
                  notif.read
                    ? 'bg-white border-slate-200 text-slate-600'
                    : 'bg-white border-slate-300 text-slate-900 shadow-xs font-medium'
                }`}
              >
                {!notif.read && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-indigo-600"></span>
                )}
                
                <div className="flex items-start space-x-2.5">
                  <div className="mt-0.5">
                    {notif.type === 'warning' && <ShieldAlert className="w-4 h-4 text-amber-500" />}
                    {notif.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                    {notif.type === 'info' && <Info className="w-4 h-4 text-indigo-600" />}
                    {notif.type === 'action' && <Sparkles className="w-4 h-4 text-purple-600" />}
                    {notif.type === 'market_drop' && <Store className="w-4 h-4 text-purple-600 animate-pulse" />}
                    {notif.type === 'payment' && <CreditCard className="w-4 h-4 text-indigo-600 animate-pulse" />}
                  </div>

                  <div className="flex-1 pr-3">
                    <h4 className="font-bold text-slate-900">{notif.title}</h4>
                    <p className="text-slate-600 mt-1 leading-relaxed text-[11px]">{notif.message}</p>
                    <p className="text-[10px] text-slate-400 mt-2 font-medium">{notif.timestamp}</p>

                    {notif.actionTarget && (
                      <button
                        onClick={() => {
                          onSelectActionTarget(notif.actionTarget!);
                          onClose();
                        }}
                        className={`mt-2.5 inline-flex items-center space-x-1 px-3 py-1 rounded-full text-white text-[11px] font-bold transition-colors shadow-xs ${
                          notif.type === 'market_drop'
                            ? 'bg-purple-600 hover:bg-purple-700'
                            : notif.type === 'payment'
                            ? 'bg-emerald-600 hover:bg-emerald-700'
                            : 'bg-slate-900 hover:bg-slate-800'
                        }`}
                      >
                        <span>
                          {notif.actionTarget === 'discovery'
                            ? 'View Market Drop'
                            : notif.actionTarget === 'applications'
                            ? 'Pay Invoice (48h)'
                            : 'Take Action'}
                        </span>
                        <ChevronRight className="w-3 h-3 text-slate-200" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
