import React, { useState, useEffect } from 'react';
import { MarketEvent, CategoryTag, VendorProfile, DocumentItem, MarketDropTeaser, FeaturedVendorSpotlight, VendorApplication, LoadInSlot } from '../../types';
import { INITIAL_MARKET_DROPS, INITIAL_FEATURED_VENDORS } from '../../data/mockData';
import { VendorPassQRModal } from './VendorPassQRModal';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Check, 
  X, 
  ChevronRight, 
  Search, 
  Users, 
  Zap,
  Grid,
  Layers,
  Star,
  Compass,
  Navigation,
  Target,
  Bell,
  BellRing,
  Play,
  Image as ImageIcon,
  Ticket,
  ShieldCheck,
  Award,
  Clock,
  ChevronLeft,
  Share2,
  ExternalLink,
  QrCode,
  CheckCircle2,
  CreditCard
} from 'lucide-react';

interface MarketDiscoveryProps {
  mode?: 'explore' | 'applications_active';
  markets: MarketEvent[];
  vendorProfile: VendorProfile;
  applications?: VendorApplication[];
  availableLoadInSlots?: LoadInSlot[];
  onSelectMarketForBooking: (market: MarketEvent) => void;
  onOpenDocVault: () => void;
  onTriggerDocumentWarningModal: (market: MarketEvent, expiringDoc: DocumentItem) => void;
  onOpenMarketPerformance?: (market: MarketEvent) => void;
  onOpenAuthModal?: () => void;
  onOpenLocationPreferences?: () => void;
  onSwitchToMarketsTab?: () => void;
  onOpenVendorPass?: (app: VendorApplication) => void;
  onTriggerPayment?: (app: VendorApplication) => void;
  onSelectLoadInSlot?: (applicationId: string, slotId: string, timeWindow: string) => void;
}

export const MarketDiscovery: React.FC<MarketDiscoveryProps> = ({
  mode = 'explore',
  markets,
  vendorProfile,
  applications = [],
  availableLoadInSlots = [],
  onSelectMarketForBooking,
  onOpenDocVault,
  onTriggerDocumentWarningModal,
  onOpenMarketPerformance,
  onOpenAuthModal,
  onOpenLocationPreferences,
  onSwitchToMarketsTab,
  onOpenVendorPass,
  onTriggerPayment,
  onSelectLoadInSlot,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyPreferredLocations, setOnlyPreferredLocations] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Drops State
  const [marketDrops, setMarketDrops] = useState<MarketDropTeaser[]>(INITIAL_MARKET_DROPS);
  const [activeTeaserGallery, setActiveTeaserGallery] = useState<MarketDropTeaser | null>(null);
  const [galleryImageIdx, setGalleryImageIdx] = useState(0);

  // Vendor Spotlights State
  const [featuredVendors] = useState<FeaturedVendorSpotlight[]>(INITIAL_FEATURED_VENDORS);
  const [selectedVendorModal, setSelectedVendorModal] = useState<FeaturedVendorSpotlight | null>(null);

  // Filtered Vendor Spotlights (respecting selectedCategory & selectedCity)
  const filteredVendors = featuredVendors.filter(v => {
    const matchesCity = selectedCity === 'All' || v.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesCategory = selectedCategory === 'all' || v.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      v.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.bio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesCategory && matchesSearch;
  });

  // Vendor Pass Modal State for Secured Spots
  const [selectedAppForPassQR, setSelectedAppForPassQR] = useState<VendorApplication | null>(null);

  // Helper functions to check secured or pending spots for this vendor
  const getSecuredApp = (marketId: string) => {
    return applications.find(a => a.marketId === marketId && a.status === 'paid_and_confirmed');
  };

  const getPendingApp = (marketId: string) => {
    return applications.find(a => a.marketId === marketId && a.status === 'approved_pending_payment');
  };

  const handleOpenPass = (app: VendorApplication) => {
    if (onOpenVendorPass) {
      onOpenVendorPass(app);
    } else {
      setSelectedAppForPassQR(app);
    }
  };

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Real-time Countdown Timer effect for Market Drops
  useEffect(() => {
    const timer = setInterval(() => {
      setMarketDrops(prev =>
        prev.map(drop => ({
          ...drop,
          targetSecondsRemaining: Math.max(0, drop.targetSecondsRemaining - 1)
        }))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format seconds into "02d : 14h : 05m : 32s"
  const formatCountdown = (totalSecs: number) => {
    if (totalSecs <= 0) return '00d : 00h : 00m : 00s';
    const days = Math.floor(totalSecs / (3600 * 24));
    const hours = Math.floor((totalSecs % (3600 * 24)) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${pad(days)}d : ${pad(hours)}h : ${pad(mins)}m : ${pad(secs)}s`;
  };

  // Remind Me Toggle Handler
  const handleToggleRemind = (dropId: string) => {
    setMarketDrops(prev =>
      prev.map(d => {
        if (d.id === dropId) {
          const newStatus = !d.isReminded;
          const newCount = newStatus ? d.remindCount + 1 : d.remindCount - 1;
          if (newStatus) {
            showToast(`🔔 Remind Me active for "${d.title}"! Push alert set for 2 days prior to registration.`);
          }
          return { ...d, isReminded: newStatus, remindCount: newCount };
        }
        return d;
      })
    );
  };

  // Helper to check if a market matches vendor's operating location preferences
  const isLocationMatch = (market: MarketEvent) => {
    const prefs = vendorProfile.locationPreferences;
    if (!prefs) return true;
    
    const cityMatch = prefs.operatingCities.some(c => 
      c.toLowerCase().includes(market.city.toLowerCase()) || market.city.toLowerCase().includes(c.toLowerCase())
    );
    
    const zoneMatch = prefs.preferredZones.some(z => 
      z.toLowerCase().includes(market.city.toLowerCase()) || 
      (market.suburb && z.toLowerCase().includes(market.suburb.toLowerCase())) ||
      market.locationName.toLowerCase().includes(z.toLowerCase())
    );

    return cityMatch || zoneMatch;
  };

  // Filtered Drops based on selectedCity & searchQuery
  const filteredDrops = marketDrops.filter(d => {
    const matchesCity = selectedCity === 'All' || d.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  // Filtered Markets with FEATURED MARKETS ALWAYS ON TOP
  const filteredMarkets = markets
    .filter((m) => {
      const matchesCity = selectedCity === 'All' || m.city.toLowerCase() === selectedCity.toLowerCase();
      const matchesCategory = selectedCategory === 'all' || m.categories.includes(selectedCategory as CategoryTag);
      const matchesSearch = 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocationFilter = !onlyPreferredLocations || isLocationMatch(m);

      return matchesCity && matchesCategory && matchesSearch && matchesLocationFilter;
    })
    .sort((a, b) => {
      const aFeatured = (a.isPromoted || a.promotionTier === 'featured_gold' || a.id === 'market-001' || a.id === 'market-003') ? 1 : 0;
      const bFeatured = (b.isPromoted || b.promotionTier === 'featured_gold' || b.id === 'market-001' || b.id === 'market-003') ? 1 : 0;
      return bFeatured - aFeatured; // Featured markets stay strictly at the TOP
    });

  // Featured Markets Row
  const featuredMarketsThisWeekend = markets
    .filter(m => m.isPromoted || m.promotionTier === 'featured_gold' || m.id === 'market-001' || m.id === 'market-003')
    .sort((a, b) => (b.isPromoted ? 1 : 0) - (a.isPromoted ? 1 : 0));

  const cityHubs = [
    { name: 'All', label: 'All South Africa', flag: '🇿🇦' },
    { name: 'Cape Town', label: 'Cape Town', flag: '🌊' },
    { name: 'Johannesburg', label: 'Johannesburg', flag: '🦁' },
    { name: 'Durban', label: 'Durban', flag: '🏖️' },
    { name: 'Stellenbosch', label: 'Stellenbosch', flag: '🍷' },
    { name: 'Pretoria', label: 'Pretoria', flag: '🏛️' }
  ];

  const categoriesList: { tag: string; label: string }[] = [
    { tag: 'all', label: 'All Categories' },
    { tag: '#ArtisanalFood', label: '#ArtisanalFood' },
    { tag: '#Crafts', label: '#Crafts' },
    { tag: '#VintageFashion', label: '#VintageFashion' },
    { tag: '#Halal', label: '#Halal' },
    { tag: '#Vegan', label: '#Vegan' },
    { tag: '#Sanitation', label: '#Sanitation' },
    { tag: '#Equipment', label: '#Equipment' },
    { tag: '#Security', label: '#Security' },
    { tag: '#GeekCulture', label: '#GeekCulture' },
  ];

  // DOCUMENT EXPIRY VALIDATION ENGINE
  const validateVendorForMarket = (market: MarketEvent) => {
    const eventStartDate = new Date(market.eventStartDate);

    const expiredOrExpiringDoc = vendorProfile.documents.find((doc) => {
      const docExpiry = new Date(doc.expiryDate);
      return docExpiry < eventStartDate;
    });

    if (expiredOrExpiringDoc) {
      onTriggerDocumentWarningModal(market, expiredOrExpiringDoc);
    } else {
      onSelectMarketForBooking(market);
    }
  };

  const handleSwipeRight = (market: MarketEvent) => {
    validateVendorForMarket(market);
    if (currentIndex < filteredMarkets.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSwipeLeft = () => {
    if (currentIndex < filteredMarkets.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const currentMarket = filteredMarkets[currentIndex];

  return (
    <div className="space-y-8 pb-12">

      {/* Floating Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3 text-xs font-bold max-w-sm"
          >
            <BellRing className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
            <span className="flex-1">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
          {/* EXPLORE MODE: SCROLLING PAGE (FEATURED MARKETS ON TOP, DROPS, SPOTLIGHTS, SUPPLIERS) */}
      {mode === 'explore' && (
        <div className="space-y-8">
          
          {/* 1. FEATURED MARKETS THIS WEEKEND (PROMINENT AT THE VERY TOP OF EXPLORE) */}
          <div className="space-y-4 pt-1">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
              <div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">⭐ Featured Markets This Weekend</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black border border-amber-300 uppercase tracking-wide">
                    FEATURED SPOTLIGHT
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Top-tier live events with priority discovery. Browse interactive floorplans and book stalls immediately.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredMarketsThisWeekend.map((market) => (
                <div
                  key={`featured-${market.id}`}
                  className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-5 rounded-3xl border-2 border-amber-400 shadow-xl flex flex-col sm:flex-row items-stretch gap-5 relative overflow-hidden group"
                >
                  <div className="sm:w-5/12 h-48 sm:h-auto rounded-2xl overflow-hidden relative bg-slate-900 shrink-0">
                    <img
                      src={market.coverImage}
                      alt={market.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] shadow-md flex items-center space-x-1 border border-amber-300">
                      <Star className="w-3 h-3 fill-slate-950 text-slate-950" />
                      <span>FEATURED EVENT</span>
                    </div>
                    <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-slate-950/90 text-white font-extrabold text-[10px] border border-white/20">
                      📍 {market.city}
                    </span>
                  </div>

                  <div className="sm:w-7/12 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span>{market.organizer}</span>
                      </span>
                      <h3 className="text-lg font-black text-white leading-snug mt-1 drop-shadow-sm">
                        {market.title}
                      </h3>
                      <p className="text-xs text-slate-300 font-medium mt-1 line-clamp-2">
                        {market.description}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] font-semibold text-slate-200 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Dates:</span>
                        <strong className="text-white font-extrabold">{market.displayDates}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Stall Fee:</span>
                        <strong className="text-emerald-400 font-extrabold">From R {market.pricing.standardStallZar}/day</strong>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      {(() => {
                        const securedApp = getSecuredApp(market.id);
                        const pendingApp = getPendingApp(market.id);
                        if (securedApp) {
                          return (
                            <button
                              onClick={() => handleOpenPass(securedApp)}
                              className="flex-1 py-3 px-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-lg transition-all flex items-center justify-center space-x-1.5 active:scale-95"
                            >
                              <QrCode className="w-4 h-4 text-slate-950" />
                              <span>View Vendor Pass (Spot {securedApp.selectedSpotId})</span>
                            </button>
                          );
                        }
                        if (pendingApp) {
                          return (
                            <button
                              onClick={() => {
                                if (onTriggerPayment) onTriggerPayment(pendingApp);
                                else if (onSwitchToMarketsTab) onSwitchToMarketsTab();
                              }}
                              className="flex-1 py-3 px-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-lg transition-all flex items-center justify-center space-x-1.5 active:scale-95"
                            >
                              <CreditCard className="w-4 h-4 text-amber-300" />
                              <span>PayFast to Unlock Pass</span>
                            </button>
                          );
                        }
                        return (
                          <button
                            onClick={() => validateVendorForMarket(market)}
                            className="flex-1 py-3 px-4 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-lg transition-all flex items-center justify-center space-x-1.5 active:scale-95"
                          >
                            <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                            <span>Browse Stall Map & Apply</span>
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. TRADING HUB CITIES & CATEGORY GEO-FILTERS */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            
            {/* City Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Trading Hub Cities • Local Area Filter</span>
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">Filter upcoming market drops & verified suppliers in your region</p>
              </div>
              {selectedCity !== 'All' && (
                <button
                  onClick={() => setSelectedCity('All')}
                  className="text-[11px] font-extrabold text-indigo-600 hover:text-indigo-800 underline self-start sm:self-auto"
                >
                  Reset City Filter (Show All)
                </button>
              )}
            </div>

            {/* City Filter Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1">
              {cityHubs.map((hub) => {
                const isActive = selectedCity === hub.name;
                return (
                  <button
                    key={hub.name}
                    onClick={() => {
                      setSelectedCity(hub.name);
                      setCurrentIndex(0);
                    }}
                    className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center space-x-2 border shrink-0 ${
                      isActive
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span>{hub.flag}</span>
                    <span>{hub.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Category Filter Pills on Explore */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                {categoriesList.map((cat) => (
                  <button
                    key={`explore-${cat.tag}`}
                    onClick={() => {
                      setSelectedCategory(cat.tag);
                      setCurrentIndex(0);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                      selectedCategory === cat.tag
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. THE "DROPS & TEASERS" FEED (INSTAGRAM-STYLE CAROUSEL) */}
          <div className="space-y-4">
            
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
              <div>
                <div className="flex items-center space-x-2">
                  <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">🔥 Upcoming Market Drops</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black border border-rose-200 uppercase tracking-wide">
                    INSTAGRAM TEASERS
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Live market teaser drops, application countdown timers & interactive venue preview reels
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {filteredDrops.length} drops available
              </span>
            </div>

            {/* Drops Reel Carousel */}
            {filteredDrops.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-500 font-semibold">
                No upcoming drops scheduled for <strong className="text-slate-800">{selectedCity}</strong> right now. Try switching city filter to "All".
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {filteredDrops.map((drop) => {
                  const badgeBg = 
                    drop.badgeStatus === 'opening_soon' ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white border-amber-300' :
                    drop.badgeStatus === 'stalls_filling_fast' ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 border-amber-300' :
                    'bg-gradient-to-r from-emerald-600 to-teal-500 text-white border-teal-300';

                  return (
                    <div
                      key={drop.id}
                      className="bg-slate-950 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-xl flex flex-col justify-between group relative transition-transform duration-300 hover:-translate-y-1"
                    >
                      {/* Visual Header / Cover Image */}
                      <div className="relative h-64 w-full bg-slate-900 overflow-hidden">
                        <img
                          src={drop.coverImage}
                          alt={drop.title}
                          className="w-full h-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                        {/* Top Status Badges */}
                        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md border ${badgeBg}`}>
                            {drop.badgeLabel}
                          </span>
                          <span className="px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md text-white font-black text-[10px] border border-white/20 flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-rose-400" />
                            <span>{drop.city}</span>
                          </span>
                        </div>

                        {/* Vibe Gallery Trigger Button */}
                        <button
                          onClick={() => {
                            setActiveTeaserGallery(drop);
                            setGalleryImageIdx(0);
                          }}
                          className="absolute top-16 right-3.5 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md hover:bg-slate-900 text-white text-[10px] font-extrabold border border-white/20 flex items-center space-x-1.5 shadow-lg transition-all"
                        >
                          <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                          <span>Preview Vibe ({drop.galleryImages.length})</span>
                        </button>

                        {/* Bottom Title & Countdown Box */}
                        <div className="absolute bottom-3 left-3.5 right-3.5 space-y-1.5">
                          <p className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                            {drop.organizer}
                          </p>
                          <h3 className="text-base font-black text-white leading-snug drop-shadow-md">
                            {drop.title}
                          </h3>
                        </div>
                      </div>

                      {/* Card Content & Interactive Countdown */}
                      <div className="p-4 space-y-3.5 bg-slate-950 flex-1 flex flex-col justify-between">
                        
                        {/* Live Ticking Countdown Box */}
                        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1 text-center">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-center space-x-1">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>Stall Applications Open In:</span>
                          </p>
                          <p className="text-sm font-black text-amber-300 tracking-wider font-mono">
                            {formatCountdown(drop.targetSecondsRemaining)}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            Opens: {drop.applicationsOpenDateLabel}
                          </p>
                        </div>

                        {/* Key Info */}
                        <div className="space-y-2 text-[11px] text-slate-300">
                          <div className="flex items-center justify-between text-slate-400 font-medium">
                            <span className="flex items-center space-x-1">
                              <Users className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Expected Footfall:</span>
                            </span>
                            <strong className="text-white font-extrabold">~{drop.expectedFootfall.toLocaleString()} Visitors</strong>
                          </div>

                          {/* Category Pills */}
                          <div className="flex flex-wrap gap-1 pt-1">
                            {drop.categories.map((cat) => (
                              <span
                                key={cat}
                                className="px-2 py-0.5 rounded-md bg-slate-900 text-[10px] font-bold text-slate-300 border border-slate-800"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Interactive Actions: Remind Me & View Teaser */}
                        <div className="pt-1 flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleRemind(drop.id)}
                            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 shadow-md ${
                              drop.isReminded
                                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                                : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:opacity-95'
                            }`}
                          >
                            <Bell className={`w-3.5 h-3.5 ${drop.isReminded ? 'fill-slate-950' : ''}`} />
                            <span>{drop.isReminded ? '✓ Reminded' : `Remind Me (${drop.remindCount})`}</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveTeaserGallery(drop);
                              setGalleryImageIdx(0);
                            }}
                            className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 transition-all"
                            title="View Photo & Clip Reel"
                          >
                            <ImageIcon className="w-4 h-4 text-indigo-400" />
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. FEATURED VENDOR & SUPPLIER SPOTLIGHTS */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
              <div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">🏆 Featured Vendor & Supplier Spotlights</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 text-[10px] font-black border border-indigo-200 uppercase tracking-wide">
                    VETTED SUPPLIERS & MERCHANTS
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Top-rated South African merchants, event suppliers (sanitation, equipment, security) & artisanal creators
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {filteredVendors.length} verified vendors
              </span>
            </div>

            {filteredVendors.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-500 font-semibold">
                No vendors found matching category <strong className="text-slate-800">{selectedCategory}</strong> in <strong className="text-slate-800">{selectedCity}</strong>.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      
                      {/* Hero Product Photo */}
                      <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-100">
                        <img
                          src={vendor.heroProductImage}
                          alt={vendor.businessName}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-slate-950/90 backdrop-blur-md text-emerald-300 font-extrabold text-[10px] border border-emerald-400/40 shadow-xs">
                          {vendor.category}
                        </span>
                        <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-white/95 text-slate-900 font-black text-[10px] shadow-xs">
                          📍 {vendor.city}
                        </span>
                      </div>

                      {/* Vendor Avatar & Title */}
                      <div className="flex items-start space-x-3">
                        <img
                          src={vendor.avatar}
                          alt={vendor.ownerName}
                          className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1">
                            <h4 className="text-xs font-black text-slate-900 truncate">{vendor.businessName}</h4>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" title="Plazr Certified Vendor" />
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium truncate">{vendor.ownerName}</p>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-[11px] text-slate-600 font-medium line-clamp-2 leading-relaxed">
                        {vendor.bio}
                      </p>

                      {/* Stats Pill */}
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px] font-bold">
                        <span className="flex items-center space-x-1 text-amber-800">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{vendor.rating.toFixed(1)} ({vendor.reviewsCount})</span>
                        </span>
                        <span className="text-slate-600">
                          {vendor.totalEventsCompleted} Events Completed
                        </span>
                      </div>

                    </div>

                    <button
                      onClick={() => setSelectedVendorModal(vendor)}
                      className="w-full py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-900 font-extrabold text-xs transition-all flex items-center justify-center space-x-1 border border-slate-200"
                    >
                      <span>View Vendor / Supplier Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Banner to Switch to Active Markets Taking Applications */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-indigo-800/50 mt-6">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  NOW ACCEPTING STALL APPLICATIONS
                </span>
              </div>
              <h3 className="text-lg font-black text-white">Ready to book your stall spot?</h3>
              <p className="text-xs text-slate-300 font-medium">Browse live interactive stall layouts for Cape Town, Joburg & Durban markets taking applications now.</p>
            </div>
            {onSwitchToMarketsTab && (
              <button
                onClick={onSwitchToMarketsTab}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs shadow-lg hover:scale-105 transition-all shrink-0 flex items-center space-x-2"
              >
                <span>Open Active Markets Window</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      )}

      {/* MARKETS MODE: ACTUAL APPLICATION WINDOW (MARKETS ACTIVELY TAKING APPLICATIONS) */}
      {(mode === 'applications_active' || mode as string === 'markets') && (
        <div className="space-y-6">
          
          {/* Active Markets Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-900 via-slate-900 to-indigo-950 text-white shadow-lg border border-emerald-800/40 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Flame className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Markets Actively Taking Stall Applications</h2>
                  <p className="text-xs text-slate-300 font-medium">Select a market below to open the interactive stall layout picker and apply immediately.</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black tracking-wider uppercase self-start sm:self-auto border border-emerald-400">
                ⚡ Live Stall Booking
              </span>
            </div>
          </div>

          {/* 3. TRADING HUB CITIES GEO-FILTER */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Trading Hub Cities • Local Area Filter</span>
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">Filter upcoming markets taking applications in your region</p>
              </div>
              {selectedCity !== 'All' && (
                <button
                  onClick={() => setSelectedCity('All')}
                  className="text-[11px] font-extrabold text-indigo-600 hover:text-indigo-800 underline self-start sm:self-auto"
                >
                  Reset City Filter (Show All)
                </button>
              )}
            </div>

            {/* City Filter Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1">
              {cityHubs.map((hub) => {
                const isActive = selectedCity === hub.name;
                return (
                  <button
                    key={hub.name}
                    onClick={() => {
                      setSelectedCity(hub.name);
                      setCurrentIndex(0);
                    }}
                    className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center space-x-2 border shrink-0 ${
                      isActive
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span>{hub.flag}</span>
                    <span>{hub.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center space-x-2">
                <Compass className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {selectedCity === 'All' ? 'All Live Markets Taking Applications' : `${selectedCity} Active Markets`}
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium">Browse market editions, check stall map availability & reserve your spot</p>
            </div>

            {/* View Switcher & Search */}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 sm:w-52">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Cape Town, Joburg, Durban..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-full pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 transition-all ${
                    viewMode === 'list' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Vertical Stack</span>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 transition-all ${
                    viewMode === 'grid' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Grid View</span>
                </button>
              </div>
            </div>
          </div>

        {/* User Interests Quick Filter Bar */}
        {vendorProfile.interests && vendorProfile.interests.length > 0 && (
          <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2 overflow-x-auto">
              <span className="font-black text-emerald-900 shrink-0 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Your Interests:</span>
              </span>
              <div className="flex items-center space-x-1.5 shrink-0">
                {vendorProfile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-2.5 py-1 rounded-full bg-white text-emerald-900 border border-emerald-300 font-extrabold text-[11px] shadow-xs shrink-0 flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>{interest}</span>
                  </span>
                ))}
              </div>
            </div>

            {onOpenAuthModal && (
              <button
                onClick={onOpenAuthModal}
                className="text-[11px] font-extrabold text-emerald-700 hover:text-emerald-900 underline shrink-0 text-right"
              >
                Edit Interests & Role
              </button>
            )}
          </div>
        )}

        {/* Category Pills Filters & Location Preference Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {categoriesList.map((cat) => (
              <button
                key={cat.tag}
                onClick={() => {
                  setSelectedCategory(cat.tag);
                  setCurrentIndex(0);
                }}
                className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === cat.tag
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setOnlyPreferredLocations(!onlyPreferredLocations)}
              className={`px-3.5 py-1.5 rounded-full font-extrabold text-xs transition-all border flex items-center space-x-1.5 ${
                onlyPreferredLocations
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-indigo-900 border-indigo-200 hover:bg-indigo-50'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>{onlyPreferredLocations ? 'Showing Preferred Zones Only' : 'Filter My Zones'}</span>
            </button>

            {onOpenLocationPreferences && (
              <button
                onClick={onOpenLocationPreferences}
                className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-xs flex items-center space-x-1.5 transition-all"
              >
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>Operating Locations</span>
              </button>
            )}
          </div>

        </div>

        {/* VERTICAL STACK VIEW: EVENTS TAKING APPLICATIONS ONE BELOW THE OTHER */}
        {viewMode === 'list' && (
          <div className="space-y-6">
            {filteredMarkets.length === 0 ? (
              <div className="text-center py-16 text-slate-500 bg-white border border-slate-200 rounded-3xl w-full max-w-md mx-auto p-8 shadow-xs">
                <p className="text-sm font-bold text-slate-800">No markets match your filter criteria.</p>
                <p className="text-xs text-slate-500 mt-1">Try resetting search keywords or selecting all categories.</p>
                <button
                  onClick={() => {
                    setSelectedCity('All');
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all"
                >
                  Reset Search Filters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredMarkets.map((market) => {
                  const isFeatured = market.isPromoted || market.promotionTier === 'featured_gold' || market.id === 'market-001' || market.id === 'market-003';
                  const isZoneMatch = isLocationMatch(market);

                  return (
                    <div
                      key={market.id}
                      className={`bg-white border rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col lg:flex-row items-stretch group relative ${
                        isFeatured
                          ? 'border-2 border-amber-400 ring-2 ring-amber-400/20'
                          : 'border-slate-200/90 hover:border-slate-300'
                      }`}
                    >
                      {/* Left: Cover Image Banner */}
                      <div className="lg:w-5/12 min-h-[240px] lg:min-h-[300px] relative bg-slate-950 overflow-hidden shrink-0">
                        <img
                          src={market.coverImage}
                          alt={market.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-950/40"></div>

                        {/* Top Badges */}
                        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 items-start">
                          {isFeatured && (
                            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] shadow-lg flex items-center space-x-1.5 border border-amber-300">
                              <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                              <span>FEATURED MARKET</span>
                            </span>
                          )}

                          {(() => {
                            const secured = getSecuredApp(market.id);
                            if (secured) {
                              return (
                                <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-black text-[10px] shadow-md flex items-center space-x-1 border border-emerald-300">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>SPOT SECURED • BAY {secured.selectedSpotId}</span>
                                </span>
                              );
                            }
                            const pending = getPendingApp(market.id);
                            if (pending) {
                              return (
                                <span className="px-3 py-1 rounded-full bg-indigo-500 text-white font-black text-[10px] shadow-md flex items-center space-x-1 border border-indigo-400">
                                  <CreditCard className="w-3 h-3 text-amber-300" />
                                  <span>APPROVED • PAYMENT REQUIRED</span>
                                </span>
                              );
                            }
                            return null;
                          })()}

                          {isZoneMatch && (
                            <span className="px-2.5 py-0.5 rounded-full bg-indigo-600/95 backdrop-blur-md text-white font-extrabold text-[10px] shadow-md flex items-center space-x-1 border border-indigo-400/50">
                              <Navigation className="w-3 h-3 text-amber-300" />
                              <span>IN YOUR OPERATING ZONE</span>
                            </span>
                          )}
                        </div>

                        {/* City Badge */}
                        <span className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-white font-black text-xs border border-white/20 shadow-md flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-400" />
                          <span>{market.city}</span>
                        </span>

                        {/* Bottom Overlay Info on Image (Mobile) */}
                        <div className="absolute bottom-3.5 left-4 right-4 lg:hidden">
                          <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{market.organizer}</span>
                          </span>
                          <h3 className="text-xl font-black text-white leading-snug drop-shadow-md">
                            {market.title}
                          </h3>
                        </div>
                      </div>

                      {/* Right: Detailed Content & Booking Actions */}
                      <div className="lg:w-7/12 p-5 sm:p-6 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          
                          {/* Desktop Organizer & Title */}
                          <div className="hidden lg:block">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 flex items-center space-x-1">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{market.organizer}</span>
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="text-xs font-bold text-slate-500">Edition #{market.id.replace('market-', '')}</span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mt-1 leading-snug">
                              {market.title}
                            </h3>
                          </div>

                          {/* Key Meta Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center space-x-2.5">
                              <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                              <div>
                                <span className="text-[10px] text-slate-600 font-bold block uppercase">Event Dates</span>
                                <span className="font-extrabold text-slate-900">{market.displayDates}</span>
                              </div>
                            </div>

                            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center space-x-2.5">
                              <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                              <div className="truncate">
                                <span className="text-[10px] text-slate-600 font-bold block uppercase">Venue & Location</span>
                                <span className="font-extrabold text-slate-900 truncate block">{market.locationName}</span>
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">
                            {market.description}
                          </p>

                          {/* Category Tags */}
                          <div className="flex flex-wrap gap-1.5 items-center">
                            {market.categories.map((cat) => (
                              <span
                                key={cat}
                                className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] border border-slate-200"
                              >
                                {cat}
                              </span>
                            ))}
                            {market.hasLoadsheddingBackup && (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[10px] border border-amber-300 flex items-center space-x-1">
                                <Zap className="w-3 h-3 text-amber-600" />
                                <span>Generator Backup</span>
                              </span>
                            )}
                          </div>

                          {/* Live Stall Availability & Rate */}
                          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex items-center space-x-2">
                              <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
                              <div>
                                <span className="font-bold text-emerald-950 block">Live Stall Availability</span>
                                <span className="text-[11px] font-extrabold text-emerald-700">
                                  {market.inventory.foodSpotsLeft} Food Spots • {market.inventory.apparelSpotsLeft} Apparel / Craft Spots Left
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-600 block uppercase font-bold">Stall Fee</span>
                              <span className="text-xs font-black text-slate-900">From R {market.pricing.standardStallZar}/day</span>
                            </div>
                          </div>

                          {/* Historical Performance Analytics Button */}
                          {market.performance && (
                            <button
                              onClick={() => onOpenMarketPerformance && onOpenMarketPerformance(market)}
                              className="w-full py-2.5 px-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-between text-xs font-bold transition-all shadow-xs"
                            >
                              <span className="flex items-center space-x-2">
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                <span>{market.performance.overallRating.toFixed(1)} Rating ({market.performance.totalVendorReviews} Reviews)</span>
                              </span>
                              <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-black flex items-center space-x-1">
                                <span>Avg R {market.performance.avgDailyVendorRevenueZar.toLocaleString()}/day Revenue</span>
                                <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                              </span>
                            </button>
                          )}

                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                          {(() => {
                            const securedApp = getSecuredApp(market.id);
                            const pendingApp = getPendingApp(market.id);

                            if (securedApp) {
                              return (
                                <>
                                  <button
                                    onClick={() => handleOpenPass(securedApp)}
                                    className="w-full sm:flex-1 py-3.5 px-5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
                                  >
                                    <QrCode className="w-4 h-4 text-slate-950" />
                                    <span>View Official Vendor Pass (Spot {securedApp.selectedSpotId})</span>
                                  </button>
                                  <button
                                    onClick={() => validateVendorForMarket(market)}
                                    className="w-full sm:w-auto py-3.5 px-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs border border-slate-300 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                                  >
                                    <Layers className="w-4 h-4 text-slate-600" />
                                    <span>View Floorplan</span>
                                  </button>
                                </>
                              );
                            }

                            if (pendingApp) {
                              return (
                                <>
                                  <button
                                    onClick={() => {
                                      if (onTriggerPayment) onTriggerPayment(pendingApp);
                                      else if (onSwitchToMarketsTab) onSwitchToMarketsTab();
                                    }}
                                    className="w-full sm:flex-1 py-3.5 px-5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
                                  >
                                    <CreditCard className="w-4 h-4 text-amber-300" />
                                    <span>PayFast Now (R {pendingApp.feeBreakdown.totalZar.toFixed(2)}) to Unlock Vendor Pass</span>
                                  </button>
                                  <button
                                    onClick={() => validateVendorForMarket(market)}
                                    className="w-full sm:w-auto py-3.5 px-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs border border-slate-300 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                                  >
                                    <span>View Spot</span>
                                  </button>
                                </>
                              );
                            }

                            return (
                              <button
                                onClick={() => validateVendorForMarket(market)}
                                className="w-full py-3.5 px-5 rounded-full bg-gradient-to-r from-amber-400 via-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
                              >
                                <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
                                <span>Select Stall on Floorplan & Apply</span>
                              </button>
                            );
                          })()}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* GRID LIST VIEW */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarkets.map((market) => (
              <div
                key={market.id}
                className={`bg-white border rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group ${
                  market.isPromoted || market.promotionTier === 'featured_gold' || market.id === 'market-001'
                    ? 'border-2 border-amber-400/90 ring-2 ring-amber-400/20'
                    : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={market.coverImage}
                      alt={market.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                    <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                      {(market.isPromoted || market.promotionTier === 'featured_gold' || market.id === 'market-001') && (
                        <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] shadow-md flex items-center gap-1 border border-amber-300">
                          <Star className="w-3 h-3 fill-slate-950 text-slate-950" />
                          <span>FEATURED EVENT</span>
                        </span>
                      )}

                      {(() => {
                        const secured = getSecuredApp(market.id);
                        if (secured) {
                          return (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black text-[9px] shadow-xs flex items-center gap-1 border border-emerald-300">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span>SPOT SECURED ({secured.selectedSpotId})</span>
                            </span>
                          );
                        }
                        return null;
                      })()}

                      {isLocationMatch(market) && (
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-600/90 backdrop-blur-md text-white font-black text-[9px] shadow-xs flex items-center gap-1 border border-indigo-400">
                          <Navigation className="w-2.5 h-2.5 text-amber-300" />
                          <span>OPERATING ZONE</span>
                        </span>
                      )}
                    </div>

                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 text-slate-900 font-extrabold text-xs border border-slate-200/80 shadow-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      <span>{market.city}</span>
                    </span>

                    <div className="absolute bottom-3 left-3.5 right-3.5">
                      <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span>{market.organizer}</span>
                      </span>
                      <h3 className="font-extrabold text-white text-base leading-snug drop-shadow-xs">
                        {market.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="text-xs text-slate-600 space-y-1.5 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="flex items-center gap-2 font-bold text-slate-900">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>{market.displayDates}</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">{market.locationName}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <span className="text-slate-600 font-bold flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>Spots Left:</span>
                      </span>
                      <span className="font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {market.inventory.foodSpotsLeft} Food • {market.inventory.apparelSpotsLeft} Apparel
                      </span>
                    </div>

                    {market.performance && (
                      <button
                        onClick={() => onOpenMarketPerformance && onOpenMarketPerformance(market)}
                        className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-950 border border-amber-200 flex items-center justify-between text-xs font-bold transition-all shadow-2xs"
                      >
                        <span className="flex items-center space-x-1.5">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{market.performance.overallRating.toFixed(1)} ({market.performance.totalVendorReviews})</span>
                        </span>
                        <span className="text-[10px] text-emerald-800 font-black uppercase">
                          R {market.performance.avgDailyVendorRevenueZar.toLocaleString()}/day ➔
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0">
                  {(() => {
                    const securedApp = getSecuredApp(market.id);
                    const pendingApp = getPendingApp(market.id);
                    if (securedApp) {
                      return (
                        <button
                          onClick={() => handleOpenPass(securedApp)}
                          className="w-full py-3 px-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5 text-slate-950" />
                          <span>View Vendor Pass (Spot {securedApp.selectedSpotId})</span>
                        </button>
                      );
                    }
                    if (pendingApp) {
                      return (
                        <button
                          onClick={() => {
                            if (onTriggerPayment) onTriggerPayment(pendingApp);
                            else if (onSwitchToMarketsTab) onSwitchToMarketsTab();
                          }}
                          className="w-full py-3 px-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-amber-300" />
                          <span>PayFast to Unlock Pass</span>
                        </button>
                      );
                    }
                    return (
                      <button
                        onClick={() => validateVendorForMarket(market)}
                        className="w-full py-3 px-4 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                        <span>Select Stall & Apply</span>
                      </button>
                    );
                  })()}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
      )}

      {/* TEASER CLIP & GALLERY LIGHTBOX MODAL */}
      {activeTeaserGallery && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 text-white border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-0">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <div className="flex items-center space-x-2">
                <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                <div>
                  <h3 className="text-sm font-black text-white">{activeTeaserGallery.title}</h3>
                  <p className="text-[10px] text-slate-400">Venue & Past Edition Visual Preview Reel</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTeaserGallery(null)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Lightbox Media Player View */}
            <div className="relative h-80 sm:h-96 w-full bg-black flex items-center justify-center">
              <img
                src={activeTeaserGallery.galleryImages[galleryImageIdx]}
                alt={`Gallery ${galleryImageIdx}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

              {/* Prev / Next Controls */}
              {activeTeaserGallery.galleryImages.length > 1 && (
                <>
                  <button
                    onClick={() => setGalleryImageIdx(prev => (prev === 0 ? activeTeaserGallery.galleryImages.length - 1 : prev - 1))}
                    className="absolute left-3 p-2 rounded-full bg-black/60 hover:bg-black text-white border border-white/20"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setGalleryImageIdx(prev => (prev === activeTeaserGallery.galleryImages.length - 1 ? 0 : prev + 1))}
                    className="absolute right-3 p-2 rounded-full bg-black/60 hover:bg-black text-white border border-white/20"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/80 text-[11px] font-bold text-white border border-white/20">
                {galleryImageIdx + 1} / {activeTeaserGallery.galleryImages.length}
              </span>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-white">{activeTeaserGallery.locationName}</p>
                <p className="text-[11px] text-slate-400">Expected Footfall: ~{activeTeaserGallery.expectedFootfall.toLocaleString()} visitors</p>
              </div>

              <button
                onClick={() => {
                  handleToggleRemind(activeTeaserGallery.id);
                  setActiveTeaserGallery(null);
                }}
                className={`py-2 px-4 rounded-xl text-xs font-black flex items-center space-x-1.5 ${
                  activeTeaserGallery.isReminded
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950'
                }`}
              >
                <Bell className="w-3.5 h-3.5 fill-slate-950" />
                <span>{activeTeaserGallery.isReminded ? '✓ Reminded' : 'Set Remind Me Push'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FEATURED VENDOR PROFILE PREVIEW MODAL */}
      {selectedVendorModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl space-y-0">
            <div className="relative h-44 w-full bg-slate-100">
              <img
                src={selectedVendorModal.heroProductImage}
                alt={selectedVendorModal.businessName}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedVendorModal(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 hover:bg-black text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedVendorModal.avatar}
                  alt={selectedVendorModal.ownerName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500 shrink-0"
                />
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-1">
                    <span>{selectedVendorModal.businessName}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">{selectedVendorModal.ownerName} • 📍 {selectedVendorModal.city}</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-semibold text-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Certified Category:</span>
                  <span className="font-bold text-amber-900">{selectedVendorModal.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Top Selling Offering:</span>
                  <span className="font-bold text-slate-900">{selectedVendorModal.topSellingProduct}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Markets Completed:</span>
                  <span className="font-bold text-emerald-700">{selectedVendorModal.totalEventsCompleted} Editions</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                "{selectedVendorModal.bio}"
              </p>

              <button
                onClick={() => {
                  setSelectedVendorModal(null);
                  showToast(`Connected with ${selectedVendorModal.businessName}! Profile catalog link copied to clipboard.`);
                }}
                className="w-full py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all"
              >
                Connect & View Product Catalog
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL VENDOR PASS MODAL (ONLY FOR SECURED SPOTS) */}
      {selectedAppForPassQR && (
        <VendorPassQRModal
          isOpen={true}
          onClose={() => setSelectedAppForPassQR(null)}
          application={selectedAppForPassQR}
          availableLoadInSlots={availableLoadInSlots}
          onSelectLoadInSlot={(appId, slotId, timeWindow) => {
            if (onSelectLoadInSlot) onSelectLoadInSlot(appId, slotId, timeWindow);
          }}
        />
      )}

    </div>
  );
};
