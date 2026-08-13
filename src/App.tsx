/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  VendorProfile, 
  MarketEvent, 
  VendorApplication, 
  ChatThread, 
  NotificationItem, 
  WalletTransaction,
  StallSpot,
  DocumentItem,
  MarketReview,
  VendorLocationPreferences,
  RegisteredUser
} from './types';
import { 
  INITIAL_VENDOR_PROFILE, 
  INITIAL_MARKETS, 
  INITIAL_APPLICATIONS, 
  INITIAL_APPLICANT_QUEUE, 
  INITIAL_CHAT_THREADS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_WALLET_TRANSACTIONS 
} from './data/mockData';

import { Header } from './components/Header';
import { WalletModal } from './components/WalletModal';
import { NotificationCenter } from './components/NotificationCenter';
import { DocumentVaultModal } from './components/DocumentVaultModal';
import { InAppChatModal } from './components/InAppChatModal';
import { PayFastModal } from './components/PayFastModal';
import { MarketPerformanceModal } from './components/MarketPerformanceModal';
import { PromoteMarketModal } from './components/planner/PromoteMarketModal';
import { RegisterAuthModal } from './components/common/RegisterAuthModal';
import { VendorLocationPreferencesModal } from './components/vendor/VendorLocationPreferencesModal';
import { AddEditMarketLocationModal } from './components/planner/AddEditMarketLocationModal';
import { CoBrandedGraphicGenerator } from './components/CoBrandedGraphicGenerator';

import { MarketDiscovery } from './components/vendor/MarketDiscovery';
import { StallPicker } from './components/vendor/StallPicker';
import { VendorApplicationsList } from './components/vendor/VendorApplicationsList';

import { ApplicantSwipeDashboard } from './components/planner/ApplicantSwipeDashboard';
import { FloorPlanManager } from './components/planner/FloorPlanManager';
import { RevenueAnalytics } from './components/planner/RevenueAnalytics';
import { PromotedMarketToggle } from './components/planner/PromotedMarketToggle';
import { LoadInGateManager } from './components/planner/LoadInGateManager';
import { QRGateScannerModal } from './components/planner/QRGateScannerModal';
import { ComplianceRegisterModal } from './components/planner/ComplianceRegisterModal';
import { SplashScreen } from './components/SplashScreen';

import { 
  Flame, 
  Calendar, 
  ShieldCheck, 
  Compass, 
  ShieldAlert, 
  LayoutDashboard, 
  Smartphone, 
  Users, 
  Map, 
  TrendingUp,
  X,
  AlertTriangle,
  ArrowRight,
  MessageSquare,
  Clock,
  QrCode,
  FileSpreadsheet,
  Sparkles
} from 'lucide-react';

export default function App() {
  // Startup Animation Splash State
  const [showSplash, setShowSplash] = useState(true);

  // Global Application State
  const [activeRole, setActiveRole] = useState<UserRole>('vendor');
  const [vendorProfile, setVendorProfile] = useState<VendorProfile>(INITIAL_VENDOR_PROFILE);
  const [markets, setMarkets] = useState<MarketEvent[]>(INITIAL_MARKETS);
  const [applications, setApplications] = useState<VendorApplication[]>(INITIAL_APPLICATIONS);
  const [applicantQueue, setApplicantQueue] = useState<VendorProfile[]>(INITIAL_APPLICANT_QUEUE);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(INITIAL_CHAT_THREADS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(INITIAL_WALLET_TRANSACTIONS);
  const [walletBalanceZar, setWalletBalanceZar] = useState<number>(2850.00);

  // Vendor Active Tab: 'discovery' | 'applications' | 'vault'
  const [vendorActiveTab, setVendorActiveTab] = useState<'discovery' | 'applications' | 'vault'>('discovery');
  const [vendorDiscoveryMode, setVendorDiscoveryMode] = useState<'explore' | 'applications_active'>('explore');

  // Planner Active Tab: 'queue' | 'floorplan' | 'revenue' | 'gate_loadin'
  const [plannerActiveTab, setPlannerActiveTab] = useState<'queue' | 'floorplan' | 'revenue' | 'gate_loadin'>('queue');

  // Device Frame View Option for Vendor Mobile App View
  const [mobileFrameMode, setMobileFrameMode] = useState<boolean>(false);

  // Modal / Overlay States
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isDocVaultOpen, setIsDocVaultOpen] = useState(false);
  const [isNotifCenterOpen, setIsNotifCenterOpen] = useState(false);
  const [activeChatThreadId, setActiveChatThreadId] = useState<string | null>(null);

  // Feature Modal States
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isComplianceExportOpen, setIsComplianceExportOpen] = useState(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLocationPreferencesOpen, setIsLocationPreferencesOpen] = useState(false);
  const [isAddMarketModalOpen, setIsAddMarketModalOpen] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<RegisteredUser | null>(null);
  const [showSuccessGraphicApp, setShowSuccessGraphicApp] = useState<VendorApplication | null>(null);
  const [authModalInitialRole, setAuthModalInitialRole] = useState<UserRole>('vendor');

  const handleOpenAuthModal = (role: UserRole = 'vendor') => {
    setAuthModalInitialRole(role);
    setIsAuthModalOpen(true);
  };

  // Helper to send native Web Push Notifications to all users if granted
  const sendPushAlert = (title: string, message: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100'
        });
      } catch (err) {
        console.error('Push alert error:', err);
      }
    }
  };

  // Role Protection Guard: Restrict Organiser Dashboard unless explicitly registered as an organiser
  useEffect(() => {
    if (activeRole === 'planner' && registeredUser?.role !== 'planner') {
      setActiveRole('vendor');
    }
  }, [activeRole, registeredUser]);

  // Load saved user session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('plazr_user');
      if (saved) {
        const parsedUser: RegisteredUser = JSON.parse(saved);
        setRegisteredUser(parsedUser);
        if (parsedUser.role) {
          setActiveRole(parsedUser.role);
        }
        setVendorProfile(prev => ({
          ...prev,
          ownerName: parsedUser.fullName || prev.ownerName,
          businessName: parsedUser.businessOrOrgName || prev.businessName,
          email: parsedUser.email || prev.email,
          phone: parsedUser.phone || prev.phone,
          city: parsedUser.city || prev.city,
          category: parsedUser.categoryOrVenue || prev.category,
          interests: parsedUser.interests || prev.interests
        }));
      }
    } catch (err) {
      console.error('Error restoring user session:', err);
    }
  }, []);

  const handleRegisterComplete = (user: RegisteredUser) => {
    setRegisteredUser(user);
    try {
      localStorage.setItem('plazr_user', JSON.stringify(user));
    } catch (err) {
      console.error('Error saving user session:', err);
    }

    setActiveRole(user.role);

    setVendorProfile(prev => ({
      ...prev,
      ownerName: user.fullName || prev.ownerName,
      businessName: user.businessOrOrgName || prev.businessName,
      email: user.email || prev.email,
      phone: user.phone || prev.phone,
      city: user.city || prev.city,
      category: user.categoryOrVenue || prev.category,
      interests: user.interests || prev.interests
    }));

    setNotifications(prev => [
      {
        id: `notif-welcome-${Date.now()}`,
        title: '🎉 Welcome to Plazr SA!',
        message: `Your account as an ${user.role === 'planner' ? 'Event Organiser' : 'Market Vendor'} is active and synchronized with Neon DB.`,
        timestamp: 'Just now',
        read: false,
        type: 'success',
        actionTarget: 'discovery'
      },
      ...prev
    ]);
  };

  const handleLogout = () => {
    setRegisteredUser(null);
    try {
      localStorage.removeItem('plazr_user');
    } catch (err) {
      console.error('Error removing user session:', err);
    }
    setVendorProfile(INITIAL_VENDOR_PROFILE);
    setActiveRole('vendor');

    setNotifications(prev => [
      {
        id: `notif-logout-${Date.now()}`,
        title: '👋 Logged Out Successfully',
        message: 'You have been signed out of your Plazr account.',
        timestamp: 'Just now',
        read: false,
        type: 'system',
        actionTarget: 'discovery'
      },
      ...prev
    ]);

    setIsAuthModalOpen(true);
  };

  // Automated Push Notification Checker for Outdated Compliance & 2-Day Market Opening Alerts
  useEffect(() => {
    // 1. Check for outdated/expiring documents or unvetted status
    const outdatedDoc = vendorProfile.documents.find(d => d.status === 'expiring_soon' || d.status === 'expired');
    if (outdatedDoc) {
      const docNotifId = `notif-doc-check-${outdatedDoc.id}`;
      setNotifications(prev => {
        if (!prev.some(n => n.id === docNotifId)) {
          const title = `⚠️ Compliance Update Required: ${outdatedDoc.title}`;
          const message = `Your ${outdatedDoc.title} (${outdatedDoc.code}) is outdated or expiring soon on ${outdatedDoc.expiryDate}. Update it in Document Vault to maintain active market eligibility.`;
          sendPushAlert(title, message);
          return [
            {
              id: docNotifId,
              title,
              message,
              timestamp: 'Just now',
              type: 'warning',
              read: false,
              actionTarget: 'document_vault'
            },
            ...prev
          ];
        }
        return prev;
      });
    }

    // 2. Check for upcoming market drops opening applications in 2 days
    const upcomingMarket = markets.find(m => m.isEarlyAccessOnly || m.id === 'market-002');
    if (upcomingMarket) {
      const mktNotifId = `notif-2day-${upcomingMarket.id}`;
      setNotifications(prev => {
        if (!prev.some(n => n.id === mktNotifId)) {
          const title = `⏰ Applications Open in 2 Days: ${upcomingMarket.title}`;
          const message = `Notice: Applications for "${upcomingMarket.title}" in ${upcomingMarket.locationName} open in exactly 48 hours! Prepare your stall selection now.`;
          sendPushAlert(title, message);
          return [
            {
              id: mktNotifId,
              title,
              message,
              timestamp: 'Just now',
              type: 'market_drop',
              read: false,
              actionTarget: 'discovery'
            },
            ...prev
          ];
        }
        return prev;
      });
    }
  }, [vendorProfile.documents, markets]);

  const handleSaveLocationPreferences = (updatedPrefs: VendorLocationPreferences) => {
    setVendorProfile(prev => ({
      ...prev,
      locationPreferences: updatedPrefs
    }));

    setNotifications(prev => [
      {
        id: `notif-loc-${Date.now()}`,
        title: '📍 Operating Locations Saved',
        message: `Base location set to ${updatedPrefs.baseCity} with ${updatedPrefs.operatingCities.length} active market trading hubs.`,
        timestamp: 'Just now',
        read: false,
        type: 'success',
        actionTarget: 'discovery'
      },
      ...prev
    ]);
  };

  const handleSaveMarketLocation = (savedMarket: MarketEvent, broadcastDropAlert?: boolean) => {
    setMarkets(prev => {
      const exists = prev.some(m => m.id === savedMarket.id);
      if (exists) {
        return prev.map(m => m.id === savedMarket.id ? savedMarket : m);
      } else {
        return [savedMarket, ...prev];
      }
    });

    if (broadcastDropAlert !== false) {
      setNotifications(prev => [
        {
          id: `notif-mkt-drop-${Date.now()}`,
          title: `🚀 NEW MARKET DROP: ${savedMarket.title}`,
          message: `"${savedMarket.title}" in ${savedMarket.locationName}, ${savedMarket.city} has dropped! 48-hour priority application window is now active for vendors.`,
          timestamp: 'Just now',
          read: false,
          type: 'market_drop',
          actionTarget: 'discovery'
        },
        ...prev
      ]);
    }
  };



  // Selected Market for Interactive Stall Picker Overlay
  const [selectedMarketForStallPicker, setSelectedMarketForStallPicker] = useState<MarketEvent | null>(null);

  // PayFast Checkout Modal Data
  const [payfastCheckoutData, setPayfastCheckoutData] = useState<{
    applicationId?: string;
    marketTitle: string;
    eventDate: string;
    spotZone: string;
    feeBreakdown: {
      baseStallFeeZar: number;
      vendrPlatformFeeZar: number;
      docVerificationFeeZar: number;
      totalZar: number;
    };
  } | null>(null);

  // Document Expiry Warning Modal Data (from Validation Engine)
  const [docWarningData, setDocWarningData] = useState<{
    market: MarketEvent;
    expiringDoc: DocumentItem;
  } | null>(null);

  // Market Performance Modal State
  const [selectedMarketForPerformance, setSelectedMarketForPerformance] = useState<MarketEvent | null>(null);

  const handleAddReview = (marketId: string, review: Omit<MarketReview, 'id' | 'date'>) => {
    setMarkets(prev => prev.map(m => {
      if (m.id !== marketId || !m.performance) return m;
      const newRevItem: MarketReview = {
        ...review,
        id: `rev-${Date.now()}`,
        date: 'Just now'
      };
      const updatedReviews = [newRevItem, ...m.performance.reviews];
      const newTotal = m.performance.totalVendorReviews + 1;
      return {
        ...m,
        performance: {
          ...m.performance,
          totalVendorReviews: newTotal,
          reviews: updatedReviews
        }
      };
    }));
  };

  // Unread Notification Count
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  // Active Market for Planner Dashboard
  const activePlannerMarket = markets[0]; // Neighbourgoods Market

  // Top Up Wallet Handler
  const handleTopUpWallet = (amount: number, reference: string) => {
    setWalletBalanceZar(prev => prev + amount);
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      description: 'Wallet Deposit via PayFast / Instant EFT',
      amountZar: amount,
      type: 'credit',
      date: new Date().toISOString().split('T')[0],
      reference
    };
    setWalletTransactions(prev => [newTx, ...prev]);
  };

  // Update Document Renewal Handler (Free)
  const handleUpdateDocument = (docId: string, newExpiryDate: string) => {
    setVendorProfile(prev => ({
      ...prev,
      documents: prev.documents.map(d => 
        d.id === docId ? { ...d, expiryDate: newExpiryDate, status: 'valid' } : d
      )
    }));

    const newTx: WalletTransaction = {
      id: `tx-doc-${Date.now()}`,
      description: 'Document Re-verification (Free Update)',
      amountZar: 0,
      type: 'credit',
      date: new Date().toISOString().split('T')[0],
      reference: `VNDR-DOC-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setWalletTransactions(prev => [newTx, ...prev]);
  };

  // Pay Initial Vetting Fee (R50)
  const handlePayVettingFee = () => {
    setVendorProfile(prev => ({ ...prev, vettingFeePaid: true, vettingStatus: 'vetted' }));
    setWalletBalanceZar(prev => prev - 50);
    const newTx: WalletTransaction = {
      id: `tx-vet-${Date.now()}`,
      description: 'Plazr Vendor Vetting Onboarding Fee (R50)',
      amountZar: -50,
      type: 'debit',
      date: new Date().toISOString().split('T')[0],
      reference: 'VNDR-ONBOARD-50'
    };
    setWalletTransactions(prev => [newTx, ...prev]);
  };

  // Open Chat Thread or Create if missing
  const handleOpenChatForMarket = (marketId: string) => {
    let thread = chatThreads.find(t => t.marketId === marketId);
    if (!thread) {
      thread = {
        id: `chat-${Date.now()}`,
        marketId,
        marketTitle: markets.find(m => m.id === marketId)?.title || 'Market Event',
        vendorId: vendorProfile.id,
        vendorName: vendorProfile.businessName,
        plannerName: 'Market Organizer Team',
        lastMessage: 'Negotiation channel initialized',
        lastTimestamp: 'Just now',
        unreadByVendor: false,
        unreadByPlanner: false,
        messages: [
          {
            id: 'm-init',
            sender: 'planner',
            text: 'Welcome! Let us know if you need specific power circuit allocation or load-in details.',
            timestamp: 'Just now'
          }
        ]
      };
      setChatThreads(prev => [thread!, ...prev]);
    }
    setActiveChatThreadId(thread.id);
  };

  // Send Message in Chat
  const handleSendMessage = (threadId: string, text: string) => {
    setChatThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        const newMsg = {
          id: `m-${Date.now()}`,
          sender: activeRole,
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        return {
          ...t,
          lastMessage: text,
          lastTimestamp: 'Just now',
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    }));
  };

  // Market Planner Purchase Advertising & Promotion Tier
  const handleConfirmPromotion = (marketId: string, tier: 'recommended' | 'featured_gold' | 'headline_sponsor', priceZar: number) => {
    setMarkets(prev => prev.map(m => {
      if (m.id === marketId) {
        return {
          ...m,
          isPromoted: true,
          promotionTier: tier,
          adSponsorshipPaid: true,
          adSponsorshipPriceZar: priceZar
        };
      }
      return m;
    }));

    setWalletBalanceZar(prev => Math.max(0, prev - priceZar));

    setWalletTransactions(prev => [
      {
        id: `tx-promo-${Date.now()}`,
        type: 'market_sponsorship_fee',
        amountZar: priceZar,
        description: `Plazr Advertising Sponsorship (${tier.replace('_', ' ').toUpperCase()})`,
        timestamp: new Date().toISOString(),
        status: 'completed',
        referenceNumber: `PLZ-AD-${Math.floor(100000 + Math.random() * 900000)}`
      },
      ...prev
    ]);

    setNotifications(prev => [
      {
        id: `notif-promo-${Date.now()}`,
        title: '⭐ Market Promotion Tier Activated!',
        message: `Your market event is now spotlighted in Plazr Recommended Markets with +350% vendor views boost.`,
        timestamp: 'Just now',
        read: false,
        type: 'system',
        actionTarget: 'discovery'
      },
      ...prev
    ]);
  };

  // Confirm Stall Selection -> Launch PayFast Checkout
  const handleConfirmStallSelection = (
    selectedSpot: StallSpot,
    feeBreakdown: { baseStallFeeZar: number; vendrPlatformFeeZar: number; docVerificationFeeZar: number; totalZar: number }
  ) => {
    if (!selectedMarketForStallPicker) return;

    setPayfastCheckoutData({
      marketTitle: selectedMarketForStallPicker.title,
      eventDate: selectedMarketForStallPicker.displayDates,
      spotZone: `${selectedSpot.id} - ${selectedSpot.zoneType}`,
      feeBreakdown
    });

    setSelectedMarketForStallPicker(null);
  };

  // PayFast Payment Completed -> Lock Booking & Create Application Record
  const handlePayFastSuccess = (payfastRef: string) => {
    if (!payfastCheckoutData) return;

    let confirmedApp: VendorApplication;

    if (payfastCheckoutData.applicationId) {
      // Existing application updated after payment
      setApplications(prev => prev.map(app => {
        if (app.id === payfastCheckoutData.applicationId) {
          const updated: VendorApplication = {
            ...app,
            status: 'paid_and_confirmed',
            payfastReference: payfastRef,
            paidAt: new Date().toISOString()
          };
          confirmedApp = updated;
          return updated;
        }
        return app;
      }));
    } else {
      // New direct booking
      confirmedApp = {
        id: `app-${Date.now()}`,
        marketId: 'market-001',
        marketTitle: payfastCheckoutData.marketTitle,
        eventDate: payfastCheckoutData.eventDate,
        locationName: 'The Old Biscuit Mill, Woodstock',
        vendorId: vendorProfile.id,
        vendorName: vendorProfile.businessName,
        vendorCategory: vendorProfile.category,
        selectedSpotId: payfastCheckoutData.spotZone.split(' - ')[0],
        selectedSpotZone: payfastCheckoutData.spotZone,
        status: 'paid_and_confirmed',
        appliedAt: new Date().toISOString(),
        feeBreakdown: payfastCheckoutData.feeBreakdown,
        payfastReference: payfastRef,
        paidAt: new Date().toISOString()
      };
      setApplications(prev => [confirmedApp, ...prev]);
    }

    setPayfastCheckoutData(null);

    // Add Success Notification
    const notif: NotificationItem = {
      id: `notif-paid-${Date.now()}`,
      title: '🎉 Payment Approved & Stall Secured!',
      message: `Your booking for ${payfastCheckoutData.marketTitle} is confirmed. Generate your co-branded social graphic now!`,
      timestamp: 'Just now',
      type: 'success',
      read: false,
      actionTarget: 'applications'
    };
    setNotifications(prev => [notif, ...prev]);

    // Switch vendor active tab to applications and automatically trigger graphic generator modal!
    setVendorActiveTab('applications');
    setShowSuccessGraphicApp(confirmedApp!);
  };

  // Planner Approves Applicant from Queue
  const handlePlannerApprove = (vendor: VendorProfile, stallSpotId: string) => {
    const newApp: VendorApplication = {
      id: `app-planner-${Date.now()}`,
      marketId: activePlannerMarket.id,
      marketTitle: activePlannerMarket.title,
      eventDate: activePlannerMarket.displayDates,
      vendorId: vendor.id,
      vendorName: vendor.businessName,
      vendorCategory: vendor.category,
      selectedSpotId: stallSpotId,
      selectedSpotZone: 'Corner Spot 3x3m',
      status: 'approved_pending_payment',
      appliedAt: new Date().toISOString(),
      unpaidHoursRemaining: 48,
      feeBreakdown: {
        baseStallFeeZar: 1250,
        vendrPlatformFeeZar: 62.50,
        docVerificationFeeZar: 0,
        totalZar: 1312.50
      }
    };
    setApplications(prev => [newApp, ...prev]);
    setApplicantQueue(prev => prev.filter(v => v.id !== vendor.id));

    const notifTitle = '💳 Stall Application Approved (48h Payment Window)';
    const notifMessage = `Application for ${vendor.businessName} (Spot ${stallSpotId}) approved! PayFast invoice issued with 48 hours to complete checkout and confirm stall.`;
    sendPushAlert(notifTitle, notifMessage);

    setNotifications(prev => [
      {
        id: `notif-app-approved-${Date.now()}`,
        title: notifTitle,
        message: notifMessage,
        timestamp: 'Just now',
        read: false,
        type: 'payment',
        actionTarget: 'applications'
      },
      ...prev
    ]);
  };

  // Planner Places Applicant on Standby Backup Waitlist
  const handlePlannerWaitlist = (vendor: VendorProfile, stallSpotId: string) => {
    const currentWaitlistCount = applications.filter(a => a.marketId === activePlannerMarket.id && a.status === 'waitlisted').length;
    const newApp: VendorApplication = {
      id: `app-waitlist-${Date.now()}`,
      marketId: activePlannerMarket.id,
      marketTitle: activePlannerMarket.title,
      eventDate: activePlannerMarket.displayDates,
      vendorId: vendor.id,
      vendorName: vendor.businessName,
      vendorCategory: vendor.category,
      selectedSpotId: `${stallSpotId} (Standby)`,
      selectedSpotZone: 'Standby Backup Spot',
      status: 'waitlisted',
      waitlistPosition: currentWaitlistCount + 1,
      appliedAt: new Date().toISOString(),
      feeBreakdown: {
        baseStallFeeZar: 1250,
        vendrPlatformFeeZar: 62.50,
        docVerificationFeeZar: 0,
        totalZar: 1312.50
      }
    };
    setApplications(prev => [...prev, newApp]);
    setApplicantQueue(prev => prev.filter(v => v.id !== vendor.id));

    setNotifications(prev => [
      {
        id: `notif-waitlist-${Date.now()}`,
        title: 'Added to Standby Backup Waitlist',
        message: `${vendor.businessName} has been placed on standby position #${currentWaitlistCount + 1}.`,
        timestamp: 'Just now',
        read: false,
        type: 'system',
        actionTarget: 'applications'
      },
      ...prev
    ]);
  };

  // Expire Unpaid Application & Auto-Promote Top Waitlist Vendor
  const handleExpirePaymentAndPromoteWaitlist = (expiredApplicationId: string) => {
    setApplications(prev => {
      const expiredApp = prev.find(a => a.id === expiredApplicationId);
      if (!expiredApp) return prev;

      // Find top waitlisted application for this market
      const waitlistApps = prev
        .filter(a => a.marketId === expiredApp.marketId && a.status === 'waitlisted')
        .sort((a, b) => (a.waitlistPosition || 99) - (b.waitlistPosition || 99));

      const topWaitlistApp = waitlistApps[0];

      return prev.map(app => {
        if (app.id === expiredApplicationId) {
          return { ...app, status: 'payment_expired' as const };
        }
        if (topWaitlistApp && app.id === topWaitlistApp.id) {
          return {
            ...app,
            status: 'approved_pending_payment' as const,
            unpaidHoursRemaining: 48,
            promotedFromWaitlistAt: new Date().toISOString(),
            selectedSpotId: expiredApp.selectedSpotId.replace(' (Standby)', '')
          };
        }
        return app;
      });
    });

    setNotifications(prev => [
      {
        id: `notif-auto-promote-${Date.now()}`,
        title: '💳 Spot Unlocked from Standby Waitlist (48h Window)',
        message: 'A primary vendor failed to complete payment in 48 hours. The #1 Standby Waitlist Vendor was automatically promoted with a fresh 48-hour PayFast window!',
        timestamp: 'Just now',
        read: false,
        type: 'payment',
        actionTarget: 'applications'
      },
      ...prev
    ]);
  };

  // Manually Promote Waitlist Vendor to Approved
  const handlePromoteWaitlistVendor = (waitlistApplicationId: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === waitlistApplicationId) {
        return {
          ...app,
          status: 'approved_pending_payment' as const,
          unpaidHoursRemaining: 48,
          promotedFromWaitlistAt: new Date().toISOString()
        };
      }
      return app;
    }));

    setNotifications(prev => [
      {
        id: `notif-manual-promote-${Date.now()}`,
        title: '💳 Vendor Promoted from Waitlist (48h Payment)',
        message: 'Standby application promoted to Approved with a 48-hour PayFast invoice window.',
        timestamp: 'Just now',
        read: false,
        type: 'payment',
        actionTarget: 'applications'
      },
      ...prev
    ]);
  };

  // Planner Declines Applicant
  const handlePlannerDecline = (vendor: VendorProfile, reason: string) => {
    setApplicantQueue(prev => prev.filter(v => v.id !== vendor.id));
  };

  // Planner Promotes Market
  const handleTogglePromoteMarket = (isPromoted: boolean) => {
    setMarkets(prev => prev.map(m => m.id === activePlannerMarket.id ? { ...m, isPromoted } : m));
  };

  // Planner Reassigns Circuit Board
  const handleUpdateCircuitAssignment = (spotId: string, newCircuitId: 'circuit-1' | 'circuit-2' | 'circuit-3') => {
    setMarkets(prev => prev.map(m => {
      if (m.id === activePlannerMarket.id) {
        return {
          ...m,
          stallGrid: m.stallGrid.map(s => s.id === spotId ? { ...s, circuitId: newCircuitId } : s)
        };
      }
      return m;
    }));
  };

  // Gate Check-In Vendor Pass Handler
  const handleCheckInVendor = (applicationId: string) => {
    const checkInTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        return {
          ...app,
          checkInStatus: 'checked_in',
          checkedInAt: checkInTime
        };
      }
      return app;
    }));

    // Add notification
    const app = applications.find(a => a.id === applicationId);
    if (app) {
      const notif: NotificationItem = {
        id: `notif-checkin-${Date.now()}`,
        title: '✅ Vendor Gate Pass Scanned & Checked In!',
        message: `${app.vendorName} checked in at venue gate (${checkInTime}). Stall ${app.selectedSpotId} marked active on floor plan.`,
        timestamp: 'Just now',
        type: 'success',
        read: false
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  // Select Load-In Arrival Slot Handler
  const handleSelectLoadInSlot = (applicationId: string, slotId: string, timeWindow: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        return {
          ...app,
          loadInSlotId: slotId,
          loadInSlotTime: timeWindow
        };
      }
      return app;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col">
      
      {/* GLOBAL PERSISTENT HEADER BAR */}
      <Header
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        vendorProfile={vendorProfile}
        registeredUser={registeredUser}
        walletBalanceZar={walletBalanceZar}
        notifications={notifications}
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenDocVault={() => setIsDocVaultOpen(true)}
        onOpenNotifications={() => setIsNotifCenterOpen(true)}
        unreadNotifCount={unreadNotifCount}
        mobileFrameMode={mobileFrameMode}
        onToggleMobileFrameMode={() => setMobileFrameMode(!mobileFrameMode)}
        vendorActiveTab={vendorActiveTab}
        onSelectVendorTab={setVendorActiveTab}
        plannerActiveTab={plannerActiveTab}
        onSelectPlannerTab={setPlannerActiveTab}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
        onOpenComplianceExport={() => setIsComplianceExportOpen(true)}
        onOpenMarketPerformance={() => setSelectedMarketForPerformance(activePlannerMarket)}
        onOpenPromoteModal={() => setIsPromoteModalOpen(true)}
        onOpenAuthModal={handleOpenAuthModal}
        onOpenLocationPreferences={() => setIsLocationPreferencesOpen(true)}
        onOpenAddMarketModal={() => setIsAddMarketModalOpen(true)}
        onReplaySplash={() => setShowSplash(true)}
        onLogout={handleLogout}
      />

      {/* MOBILE APP STARTUP SPLASH ANIMATION */}
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {/* DOCUMENT EXPIRY VALIDATION ENGINE WARNING MODAL */}
      {docWarningData && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setDocWarningData(null)}
        >
          <div 
            className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start space-x-3">
              <div className="p-3 rounded-xl bg-amber-100 text-amber-700 border border-amber-200">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Document Expiry Notice</h3>
                <p className="text-xs text-amber-800 font-medium mt-1">
                  Target Event: <strong>{docWarningData.market.title}</strong> ({docWarningData.market.displayDates})
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
              <p>
                ⚠️ Your <strong>{docWarningData.expiringDoc.title}</strong> expires on{' '}
                <strong className="text-slate-950">{docWarningData.expiringDoc.expiryDate}</strong>, which is BEFORE the event date (12 Sept 2026).
              </p>
              <p className="text-slate-600 text-[11px]">
                Under South African Municipal Bylaws, all food & craft stall applications require valid compliance certificates active on the event trading date.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setDocWarningData(null)}
                className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setDocWarningData(null);
                  setIsDocVaultOpen(true);
                }}
                className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md"
              >
                <span>Re-verify Document (Free)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* VENDOR PORTAL VIEW */}
        {activeRole === 'vendor' && (
          <div className={mobileFrameMode ? "max-w-md mx-auto border-4 border-slate-300 rounded-[38px] p-4 bg-white shadow-2xl overflow-hidden min-h-[750px]" : "space-y-6"}>
            
            {/* Vendor Sub-Navigation Bar */}
            <div className="flex items-center justify-between p-1 bg-white rounded-full border border-slate-200 shadow-xs">
              <button
                onClick={() => {
                  setVendorActiveTab('discovery');
                  setVendorDiscoveryMode('explore');
                }}
                className={`flex-1 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                  vendorActiveTab === 'discovery' && vendorDiscoveryMode === 'explore'
                    ? 'bg-slate-900 text-white shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-indigo-500" />
                <span>Explore Feed</span>
              </button>

              <button
                onClick={() => {
                  setVendorActiveTab('discovery');
                  setVendorDiscoveryMode('applications_active');
                }}
                className={`flex-1 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                  vendorActiveTab === 'discovery' && vendorDiscoveryMode === 'applications_active'
                    ? 'bg-slate-900 text-white shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-emerald-500" />
                <span>Active Markets</span>
              </button>

              <button
                onClick={() => setVendorActiveTab('applications')}
                className={`flex-1 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                  vendorActiveTab === 'applications'
                    ? 'bg-slate-900 text-white shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>Application Progress ({applications.length})</span>
              </button>

              <button
                onClick={() => setIsDocVaultOpen(true)}
                className="py-2 px-4 rounded-full text-xs font-bold transition-all text-slate-600 hover:text-slate-900 flex items-center space-x-1 hover:bg-slate-100"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Compliance</span>
              </button>
            </div>

            {/* TAB CONTENT: Discovery Engine */}
            {vendorActiveTab === 'discovery' && (
              <MarketDiscovery
                mode={vendorDiscoveryMode}
                markets={markets}
                vendorProfile={vendorProfile}
                applications={applications}
                availableLoadInSlots={activePlannerMarket.loadInSlots || []}
                onSelectMarketForBooking={(m) => setSelectedMarketForStallPicker(m)}
                onOpenDocVault={() => setIsDocVaultOpen(true)}
                onTriggerDocumentWarningModal={(m, doc) => setDocWarningData({ market: m, expiringDoc: doc })}
                onOpenMarketPerformance={(m) => setSelectedMarketForPerformance(m)}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
                onOpenLocationPreferences={() => setIsLocationPreferencesOpen(true)}
                onSwitchToMarketsTab={() => setVendorDiscoveryMode('applications_active')}
                onTriggerPayment={(app) => {
                  setPayfastCheckoutData({
                    applicationId: app.id,
                    marketTitle: app.marketTitle,
                    eventDate: app.eventDate,
                    spotZone: app.selectedSpotZone,
                    feeBreakdown: app.feeBreakdown
                  });
                }}
                onSelectLoadInSlot={handleSelectLoadInSlot}
              />
            )}

            {/* TAB CONTENT: Vendor Applications List */}
            {vendorActiveTab === 'applications' && (
              <VendorApplicationsList
                applications={applications}
                availableLoadInSlots={activePlannerMarket.loadInSlots || []}
                onTriggerPayment={(app) => {
                  setPayfastCheckoutData({
                    applicationId: app.id,
                    marketTitle: app.marketTitle,
                    eventDate: app.eventDate,
                    spotZone: app.selectedSpotZone,
                    feeBreakdown: app.feeBreakdown
                  });
                }}
                onOpenChat={handleOpenChatForMarket}
                onSelectLoadInSlot={handleSelectLoadInSlot}
              />
            )}

          </div>
        )}

        {/* MARKET PLANNER PORTAL VIEW */}
        {activeRole === 'planner' && (
          <div className="space-y-6">
            
            {/* Promoted Market Spot Toggle */}
            <PromotedMarketToggle
              market={activePlannerMarket}
              onTogglePromote={handleTogglePromoteMarket}
            />

            {/* Planner Sub-Navigation Bar */}
            <div className="flex items-center space-x-2 p-1 bg-white rounded-full border border-slate-200 shadow-xs overflow-x-auto text-xs">
              <button
                onClick={() => setPlannerActiveTab('queue')}
                className={`py-2 px-4 rounded-full font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                  plannerActiveTab === 'queue'
                    ? 'bg-slate-900 text-white shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                <span>Vendor Applications</span>
              </button>

              <button
                onClick={() => setPlannerActiveTab('gate_loadin')}
                className={`py-2 px-4 rounded-full font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                  plannerActiveTab === 'gate_loadin'
                    ? 'bg-slate-900 text-white shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Load-In Schedule</span>
              </button>

              <button
                onClick={() => setPlannerActiveTab('floorplan')}
                className={`py-2 px-4 rounded-full font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                  plannerActiveTab === 'floorplan'
                    ? 'bg-slate-900 text-white shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Map className="w-3.5 h-3.5 text-purple-500" />
                <span>Interactive Layout & Utilities</span>
              </button>

              <button
                onClick={() => setPlannerActiveTab('revenue')}
                className={`py-2 px-4 rounded-full font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                  plannerActiveTab === 'revenue'
                    ? 'bg-slate-900 text-white shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span>Analytics & Revenue</span>
              </button>
            </div>

            {/* TAB CONTENT: Applicant Queue & Backup Waitlist */}
            {plannerActiveTab === 'queue' && (
              <ApplicantSwipeDashboard
                applicants={applicantQueue}
                activeMarket={activePlannerMarket}
                applications={applications}
                onApproveApplicant={handlePlannerApprove}
                onWaitlistApplicant={handlePlannerWaitlist}
                onDeclineApplicant={handlePlannerDecline}
                onExpirePaymentAndPromoteWaitlist={handleExpirePaymentAndPromoteWaitlist}
                onPromoteWaitlistVendor={handlePromoteWaitlistVendor}
                onOpenChatWithVendor={(vendorId) => handleOpenChatForMarket(activePlannerMarket.id)}
              />
            )}

            {/* TAB CONTENT: Load-In Schedule & Gate Manager */}
            {plannerActiveTab === 'gate_loadin' && (
              <LoadInGateManager
                market={activePlannerMarket}
                applications={applications}
                onCheckInVendor={handleCheckInVendor}
                onOpenQRScanner={() => setIsQRScannerOpen(true)}
                onOpenComplianceExport={() => setIsComplianceExportOpen(true)}
              />
            )}

            {/* TAB CONTENT: Floor Plan & Utility Manager */}
            {plannerActiveTab === 'floorplan' && (
              <FloorPlanManager
                market={activePlannerMarket}
                onUpdateCircuitAssignment={handleUpdateCircuitAssignment}
              />
            )}

            {/* TAB CONTENT: Revenue Analytics */}
            {plannerActiveTab === 'revenue' && (
              <RevenueAnalytics
                market={activePlannerMarket}
                totalGrossRentZar={42500.00}
                onOpenPerformance={() => setSelectedMarketForPerformance(activePlannerMarket)}
              />
            )}

          </div>
        )}

      </main>

      {/* MODAL OVERLAYS */}

      {/* Interactive Stall Picker Overlay */}
      {selectedMarketForStallPicker && (
        <StallPicker
          market={selectedMarketForStallPicker}
          vendorProfile={vendorProfile}
          onClose={() => setSelectedMarketForStallPicker(null)}
          onConfirmStallSelection={handleConfirmStallSelection}
        />
      )}

      {/* PayFast Checkout Modal */}
      {payfastCheckoutData && (
        <PayFastModal
          isOpen={true}
          onClose={() => setPayfastCheckoutData(null)}
          marketTitle={payfastCheckoutData.marketTitle}
          eventDate={payfastCheckoutData.eventDate}
          spotZone={payfastCheckoutData.spotZone}
          feeBreakdown={payfastCheckoutData.feeBreakdown}
          onSuccessPayment={handlePayFastSuccess}
        />
      )}

      {/* Wallet Modal */}
      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        balanceZar={walletBalanceZar}
        transactions={walletTransactions}
        onTopUp={handleTopUpWallet}
      />

      {/* Document Vault Modal */}
      <DocumentVaultModal
        isOpen={isDocVaultOpen}
        onClose={() => setIsDocVaultOpen(false)}
        vendorProfile={vendorProfile}
        walletBalanceZar={walletBalanceZar}
        onUpdateDocument={handleUpdateDocument}
        onPayVettingFee={handlePayVettingFee}
      />

      {/* Notification Center */}
      <NotificationCenter
        isOpen={isNotifCenterOpen}
        onClose={() => setIsNotifCenterOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
        onSelectActionTarget={(target) => {
          if (target === 'document_vault') setIsDocVaultOpen(true);
          if (target === 'applications') setVendorActiveTab('applications');
        }}
      />

      {/* In-App Chat Modal */}
      {activeChatThreadId && (
        <InAppChatModal
          isOpen={true}
          onClose={() => setActiveChatThreadId(null)}
          thread={chatThreads.find(t => t.id === activeChatThreadId) || chatThreads[0]}
          currentUserRole={activeRole}
          onSendMessage={handleSendMessage}
        />
      )}

      {/* Gate Pass Scanner Simulator Modal */}
      <QRGateScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        market={activePlannerMarket}
        applications={applications}
        onCheckInVendor={handleCheckInVendor}
      />

      {/* Municipal Health & Safety Compliance Register Export Modal */}
      <ComplianceRegisterModal
        isOpen={isComplianceExportOpen}
        onClose={() => setIsComplianceExportOpen(false)}
        market={activePlannerMarket}
        approvedApplications={applications.filter(a => a.status === 'paid_and_confirmed' || a.status === 'approved_pending_payment')}
        vendorProfiles={[vendorProfile, ...applicantQueue]}
      />

      {/* Market Performance Analytics & Ratings Modal */}
      <MarketPerformanceModal
        isOpen={!!selectedMarketForPerformance}
        onClose={() => setSelectedMarketForPerformance(null)}
        market={selectedMarketForPerformance}
        onAddReview={handleAddReview}
      />

      {/* Market Planner Advertising & Promotion Modal */}
      <PromoteMarketModal
        isOpen={isPromoteModalOpen}
        onClose={() => setIsPromoteModalOpen(false)}
        markets={markets}
        walletBalanceZar={walletBalanceZar}
        onConfirmPromotion={handleConfirmPromotion}
      />

      {/* Onboarding & Registration Role/Interests Modal */}
      <RegisterAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onRegisterComplete={handleRegisterComplete}
        initialRole={authModalInitialRole}
      />

      {/* Vendor Operating Location & Area Preferences Modal */}
      <VendorLocationPreferencesModal
        vendorProfile={vendorProfile}
        isOpen={isLocationPreferencesOpen}
        onClose={() => setIsLocationPreferencesOpen(false)}
        onSavePreferences={handleSaveLocationPreferences}
      />

      {/* Publish / Edit Market Event Location Modal */}
      <AddEditMarketLocationModal
        isOpen={isAddMarketModalOpen}
        onClose={() => setIsAddMarketModalOpen(false)}
        onSaveMarket={handleSaveMarketLocation}
      />

      {/* CELEBRATORY SOCIAL GRAPHIC AUTO-POPUP MODAL ON PAYMENT SUCCESS */}
      {showSuccessGraphicApp && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden animate-in fade-in duration-200"
          onClick={() => setShowSuccessGraphicApp(null)}
        >
          <div 
            className="relative flex flex-col w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-slate-100 max-h-[92vh] my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 p-4 sm:p-5 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
                  <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold">Stall Place Secured & Paid!</h3>
                  <p className="text-xs text-emerald-100 font-medium">
                    Personalized graphic generated for <strong className="underline decoration-amber-300 font-bold">{showSuccessGraphicApp.vendorName}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSuccessGraphicApp(null)}
                className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 sm:p-4 overflow-y-auto">
              <CoBrandedGraphicGenerator
                vendorName={showSuccessGraphicApp.vendorName}
                marketTitle={showSuccessGraphicApp.marketTitle}
                eventDate={showSuccessGraphicApp.eventDate}
                locationName={showSuccessGraphicApp.locationName || 'The Old Biscuit Mill, Woodstock'}
                spotNumber={showSuccessGraphicApp.selectedSpotId}
                vendorCategory={showSuccessGraphicApp.vendorCategory}
              />
            </div>
          </div>
        </div>
      )}

      {/* Global Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 font-medium">
        <p>Plazr SA — Connecting South African Street Market Planners & Vendors</p>
        <p className="text-[10px] text-slate-400 mt-1">Cape Town • Johannesburg • Stellenbosch • Durban</p>
      </footer>

    </div>
  );
}
