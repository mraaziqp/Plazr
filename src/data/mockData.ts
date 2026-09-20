import { VendorProfile, MarketEvent, VendorApplication, ChatThread, NotificationItem, WalletTransaction, MarketDropTeaser, FeaturedVendorSpotlight } from '../types';

export const INITIAL_VENDOR_PROFILE: VendorProfile = {
  id: 'guest-001',
  businessName: "",
  ownerName: "",
  email: "",
  phone: "",
  category: '#ArtisanalFood',
  bio: "South African street market vendor & artisan.",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  vettingStatus: 'unvetted',
  vettingFeePaid: false,
  powerRequirementKw: 0.0,
  documents: [
    {
      id: 'doc-001',
      title: 'Certificate of Acceptability (CoA)',
      code: 'Pending Upload',
      expiryDate: '',
      status: 'pending_verification',
      issuedBy: 'City of Cape Town Health Dept',
      renewalFeeZar: 0,
      requiredForCategories: ['#ArtisanalFood', '#Halal', '#Vegan']
    },
    {
      id: 'doc-002',
      title: 'LPG Gas Safety Certificate',
      code: 'Pending Upload',
      expiryDate: '',
      status: 'pending_verification',
      issuedBy: 'Liquefied Petroleum Gas Assoc. of SA (LPGASA)',
      renewalFeeZar: 0,
      requiredForCategories: ['#ArtisanalFood', '#Halal']
    },
    {
      id: 'doc-003',
      title: 'Public Liability Insurance (R5,000,000 Cover)',
      code: 'Pending Upload',
      expiryDate: '',
      status: 'pending_verification',
      issuedBy: 'Old Mutual / Santam / Mutual & Federal',
      renewalFeeZar: 0,
      requiredForCategories: ['#ArtisanalFood', '#GeekCulture', '#VintageFashion', '#Crafts', '#Halal', '#Vegan']
    },
    {
      id: 'doc-004',
      title: 'Fire Safety & Extinguisher Clearance',
      code: 'Pending Upload',
      expiryDate: '',
      status: 'pending_verification',
      issuedBy: 'Municipal Fire & Rescue Service',
      renewalFeeZar: 0,
      requiredForCategories: ['#ArtisanalFood', '#Halal']
    }
  ],
  socialReach: {
    instagramFollowers: 0,
    tiktokFollowers: 0,
    facebookFollowers: 0,
    totalReach: 0,
    instagramHandle: ''
  },
  reliabilityIndex: {
    rating: 5.0,
    onTimeSetupPercent: 100,
    cleanlinessScore: 5.0,
    totalMarketsCompleted: 0
  },
  galleryImages: [],
  subscriptionTier: 'free',
  isVipSubscriber: false,
  locationPreferences: {
    baseAddress: '',
    baseCity: 'Cape Town',
    baseSuburb: 'City Centre',
    operatingCities: ['Cape Town', 'Stellenbosch', 'Johannesburg', 'Durban'],
    preferredZones: ['Woodstock & Salt River', 'Bo-Kaap & City Centre', 'Sea Point & Atlantic Seaboard'],
    maxTravelDistanceKm: 50,
    preferredMarketTypes: ['Weekend Street Markets', 'Night Food Festivals', 'Artisanal Indoor Halls', 'Coastal Pop-ups']
  }
};

export const INITIAL_MARKETS: MarketEvent[] = [
  {
    id: 'market-001',
    title: 'Neighbourgoods Market - Spring Artisanal Festival',
    organizer: 'The Woodstock Collective',
    locationName: 'The Old Biscuit Mill',
    address: '375 Albert Rd, Woodstock',
    city: 'Cape Town',
    suburb: 'Woodstock',
    operatingZonesInvited: ['Woodstock & Salt River', 'Bo-Kaap & City Centre', 'Sea Point & Atlantic Seaboard', 'Southern Suburbs'],
    targetVendorRadiusKm: 50,
    coordinates: { lat: -33.9275, lng: 18.4571 },
    eventStartDate: '2026-09-12',
    eventEndDate: '2026-09-13',
    displayDates: 'Sept 12 - Sept 13, 2026',
    categories: ['#ArtisanalFood', '#Crafts', '#VintageFashion', '#Halal', '#Vegan'],
    coverImage: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&auto=format&fit=crop&q=80',
    description: 'Cape Town\'s iconic weekly gathering of street food masters, local craft designers, and live musicians in the heart of Woodstock.',
    inventory: {
      foodSpotsLeft: 3,
      apparelSpotsLeft: 8,
      craftsSpotsLeft: 5,
      totalSpotsLeft: 16
    },
    isPromoted: true,
    promotionTier: 'featured_gold',
    adSponsorshipPaid: true,
    adSponsorshipPriceZar: 750,
    isEarlyAccessOnly: true,
    earlyAccessDaysRemaining: 2,
    generalAccessOpensAt: '12 Aug 2026',
    expectedFootTraffic: {
      target: 8500,
      historicalAverage: 7900
    },
    pricing: {
      standardStallZar: 850,
      cornerStallZar: 1250,
      poweredBayZar: 1450,
      foodTruckZar: 1800
    },
    loadsheddingBackup: {
      active: true,
      type: '45 kVA Silent Diesel Generator + 15kW Victron Hybrid Solar Inverter'
    },
    performance: {
      overallRating: 5.0,
      totalVendorReviews: 0,
      satisfactionRatePercent: 100,
      avgDailyVendorRevenueZar: 8450,
      footTrafficConversionRatePercent: 28,
      repeatVendorRatePercent: 91,
      topSellingCategory: '#ArtisanalFood',
      salesVelocityScore: 'Exceptional',
      categoryDemandBreakdown: [
        { category: '#ArtisanalFood', demandSharePercent: 42, avgRevenueZar: 11200 },
        { category: '#Crafts', demandSharePercent: 26, avgRevenueZar: 6800 },
        { category: '#VintageFashion', demandSharePercent: 18, avgRevenueZar: 7100 },
        { category: '#Halal', demandSharePercent: 14, avgRevenueZar: 8900 }
      ],
      reviews: []
    },
    circuits: [
      {
        id: 'circuit-1',
        name: 'Zone A - Food Alley Grid',
        maxCapacityKw: 12.0,
        currentLoadKw: 0.0,
        isOverloaded: false,
        assignedSpotIds: ['SPOT-A1', 'SPOT-A2', 'SPOT-A3']
      },
      {
        id: 'circuit-2',
        name: 'Zone B - Artisan & Crafts Main',
        maxCapacityKw: 8.0,
        currentLoadKw: 0.0,
        isOverloaded: false,
        assignedSpotIds: ['SPOT-B1', 'SPOT-B2', 'SPOT-B3']
      },
      {
        id: 'circuit-3',
        name: 'Zone C - Fashion & Courtyard',
        maxCapacityKw: 6.0,
        currentLoadKw: 0.0,
        isOverloaded: false,
        assignedSpotIds: ['SPOT-C1', 'SPOT-C2']
      }
    ],
    categoryQuotas: [
      { categoryGroup: 'Food & Beverage', targetCount: 10, bookedCount: 0 },
      { categoryGroup: 'Artisanal & Crafts', targetCount: 15, bookedCount: 0 },
      { categoryGroup: 'Apparel & Vintage', targetCount: 12, bookedCount: 0 },
      { categoryGroup: 'Beauty & Wellness', targetCount: 8, bookedCount: 0 },
      { categoryGroup: 'General Retail', targetCount: 10, bookedCount: 0 }
    ],
    stallGrid: [
      {
        id: 'SPOT-A1',
        label: 'A1 - Prime Food Alley Corner',
        zoneType: 'Corner Spot (3x3m)',
        dimensions: '3m x 3m',
        categoryGroup: 'Food & Beverage',
        basePriceZar: 1250,
        isHighFootTraffic: true,
        footTrafficLabel: '🔥 Main Food Alley Entrance',
        premiumSurchargeZar: 350,
        maxPowerWatts: 4000,
        powerKw: 4.0,
        circuitId: 'circuit-1',
        status: 'available',
        xRatio: 15,
        yRatio: 20
      },
      {
        id: 'SPOT-A2',
        label: 'A2 - Powered Food Bay',
        zoneType: 'Powered Bay (3x3m + 15A)',
        dimensions: '3m x 3m',
        categoryGroup: 'Food & Beverage',
        basePriceZar: 1450,
        isHighFootTraffic: true,
        footTrafficLabel: '🔥 Central Courtyard Hub',
        premiumSurchargeZar: 300,
        maxPowerWatts: 3500,
        powerKw: 3.5,
        circuitId: 'circuit-1',
        status: 'available',
        xRatio: 35,
        yRatio: 20
      },
      {
        id: 'SPOT-A3',
        label: 'A3 - Food Truck Bay',
        zoneType: 'Food Truck Bay (5x3m)',
        dimensions: '5m x 3m',
        categoryGroup: 'Food & Beverage',
        basePriceZar: 1800,
        isHighFootTraffic: false,
        maxPowerWatts: 5000,
        powerKw: 5.0,
        circuitId: 'circuit-1',
        status: 'available',
        xRatio: 58,
        yRatio: 20
      },
      {
        id: 'SPOT-B1',
        label: 'B1 - Crafts Corner Spot',
        zoneType: 'Corner Spot (3x3m)',
        dimensions: '3m x 3m',
        categoryGroup: 'Artisanal & Crafts',
        basePriceZar: 1100,
        isHighFootTraffic: true,
        footTrafficLabel: '🔥 High Walkway Corner',
        premiumSurchargeZar: 250,
        maxPowerWatts: 1500,
        powerKw: 1.5,
        circuitId: 'circuit-2',
        status: 'available',
        xRatio: 15,
        yRatio: 55
      },
      {
        id: 'SPOT-B2',
        label: 'B2 - Standard Crafts 2x2',
        zoneType: 'Standard Middle (2x2m)',
        dimensions: '2m x 2m',
        categoryGroup: 'Artisanal & Crafts',
        basePriceZar: 850,
        isHighFootTraffic: false,
        maxPowerWatts: 1000,
        powerKw: 1.0,
        circuitId: 'circuit-2',
        status: 'available',
        xRatio: 35,
        yRatio: 55
      },
      {
        id: 'SPOT-B3',
        label: 'B3 - Standard Crafts 2x2',
        zoneType: 'Standard Middle (2x2m)',
        dimensions: '2m x 2m',
        categoryGroup: 'Artisanal & Crafts',
        basePriceZar: 850,
        isHighFootTraffic: false,
        maxPowerWatts: 1000,
        powerKw: 1.0,
        circuitId: 'circuit-2',
        status: 'available',
        xRatio: 58,
        yRatio: 55
      },
      {
        id: 'SPOT-C1',
        label: 'C1 - Vintage Apparel Bay',
        zoneType: 'Standard Middle (2x2m)',
        dimensions: '2m x 2m',
        categoryGroup: 'Apparel & Vintage',
        basePriceZar: 900,
        isHighFootTraffic: false,
        maxPowerWatts: 1000,
        powerKw: 1.0,
        circuitId: 'circuit-3',
        status: 'available',
        xRatio: 80,
        yRatio: 35
      },
      {
        id: 'SPOT-C2',
        label: 'C2 - Vintage Apparel Corner',
        zoneType: 'Corner Spot (3x3m)',
        dimensions: '3m x 3m',
        categoryGroup: 'Apparel & Vintage',
        basePriceZar: 1200,
        isHighFootTraffic: true,
        footTrafficLabel: '🔥 Stage Gate View',
        premiumSurchargeZar: 300,
        maxPowerWatts: 1500,
        powerKw: 1.0,
        circuitId: 'circuit-3',
        status: 'available',
        xRatio: 80,
        yRatio: 70
      }
    ]
  },
  {
    id: 'market-002',
    title: 'Oranjezicht City Farm Market - Waterfront Edition',
    organizer: 'OZCF Community Trust',
    locationName: 'Granger Bay, V&A Waterfront',
    address: 'Haul Rd, Granger Bay, Cape Town',
    city: 'Cape Town',
    eventStartDate: '2026-09-19',
    eventEndDate: '2026-09-20',
    displayDates: 'Sept 19 - Sept 20, 2026',
    categories: ['#ArtisanalFood', '#LocalProduce', '#Vegan', '#Halal', '#BeautyWellness'],
    coverImage: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&auto=format&fit=crop&q=80',
    description: 'Cape Town\'s leading farmers market with sea views, organic vegetables, fresh bread, and artisanal deli products.',
    inventory: {
      foodSpotsLeft: 2,
      apparelSpotsLeft: 4,
      craftsSpotsLeft: 6,
      totalSpotsLeft: 12
    },
    isPromoted: false,
    expectedFootTraffic: {
      target: 11000,
      historicalAverage: 10400
    },
    pricing: {
      standardStallZar: 950,
      cornerStallZar: 1350,
      poweredBayZar: 1600,
      foodTruckZar: 2000
    },
    loadsheddingBackup: {
      active: true,
      type: '60 kVA Eco-Generator'
    },
    performance: {
      overallRating: 5.0,
      totalVendorReviews: 0,
      satisfactionRatePercent: 100,
      avgDailyVendorRevenueZar: 9200,
      footTrafficConversionRatePercent: 32,
      repeatVendorRatePercent: 88,
      topSellingCategory: '#LocalProduce',
      salesVelocityScore: 'High',
      categoryDemandBreakdown: [
        { category: '#LocalProduce', demandSharePercent: 38, avgRevenueZar: 12500 },
        { category: '#ArtisanalFood', demandSharePercent: 32, avgRevenueZar: 9800 },
        { category: '#Vegan', demandSharePercent: 20, avgRevenueZar: 7400 },
        { category: '#BeautyWellness', demandSharePercent: 10, avgRevenueZar: 5600 }
      ],
      reviews: []
    },
    circuits: [],
    stallGrid: [
      {
        id: 'OZ-1',
        label: 'OZ1 - Ocean Front Corner',
        zoneType: 'Corner Spot (3x3m)',
        basePriceZar: 1350,
        powerKw: 3.5,
        maxPowerWatts: 3500,
        dimensions: '3x3m',
        categoryGroup: 'Food & Beverage',
        isHighFootTraffic: true,
        footTrafficLabel: '🔥 Ocean Promenade Entrance',
        premiumSurchargeZar: 400,
        circuitId: 'circuit-1',
        status: 'available',
        xRatio: 20,
        yRatio: 30
      },
      {
        id: 'OZ-2',
        label: 'OZ2 - Organic Food Bay',
        zoneType: 'Powered Bay (3x3m + 15A)',
        basePriceZar: 1600,
        powerKw: 4.0,
        maxPowerWatts: 4000,
        dimensions: '3x3m',
        categoryGroup: 'Food & Beverage',
        circuitId: 'circuit-1',
        status: 'available',
        xRatio: 50,
        yRatio: 30
      }
    ]
  },
  {
    id: 'market-003',
    title: 'Comic Con Africa 2026 - Vendor Alley',
    organizer: 'Reed Exhibitions Africa',
    locationName: 'Johannesburg Expo Centre',
    address: 'NASREC, Johannesburg',
    city: 'Johannesburg',
    eventStartDate: '2026-09-25',
    eventEndDate: '2026-09-27',
    displayDates: 'Sept 25 - Sept 27, 2026',
    categories: ['#GeekCulture', '#Crafts', '#VintageFashion', '#ArtisanalFood'],
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    description: 'Africa\'s largest pop culture, gaming, cosplay and merch festival attracting over 70,000 visitors.',
    inventory: {
      foodSpotsLeft: 5,
      apparelSpotsLeft: 12,
      craftsSpotsLeft: 18,
      totalSpotsLeft: 35
    },
    isPromoted: true,
    promotionTier: 'recommended',
    adSponsorshipPaid: true,
    adSponsorshipPriceZar: 350,
    isEarlyAccessOnly: true,
    earlyAccessDaysRemaining: 1,
    generalAccessOpensAt: '10 Aug 2026',
    expectedFootTraffic: {
      target: 72000,
      historicalAverage: 68000
    },
    pricing: {
      standardStallZar: 2200,
      cornerStallZar: 3500,
      poweredBayZar: 3800,
      foodTruckZar: 4500
    },
    loadsheddingBackup: {
      active: true,
      type: 'Industrial Substation + Dual 250 kVA Backup Generators'
    },
    performance: {
      overallRating: 5.0,
      totalVendorReviews: 0,
      satisfactionRatePercent: 100,
      avgDailyVendorRevenueZar: 18500,
      footTrafficConversionRatePercent: 41,
      repeatVendorRatePercent: 95,
      topSellingCategory: '#GeekCulture',
      salesVelocityScore: 'Exceptional',
      categoryDemandBreakdown: [
        { category: '#GeekCulture', demandSharePercent: 55, avgRevenueZar: 24000 },
        { category: '#VintageFashion', demandSharePercent: 22, avgRevenueZar: 15800 },
        { category: '#Crafts', demandSharePercent: 13, avgRevenueZar: 12100 },
        { category: '#ArtisanalFood', demandSharePercent: 10, avgRevenueZar: 19500 }
      ],
      reviews: []
    },
    circuits: [],
    stallGrid: [
      {
        id: 'CC-01',
        label: 'CC01 - Artist Alley Prime Corner',
        zoneType: 'Corner Spot (3x3m)',
        basePriceZar: 3500,
        powerKw: 2.0,
        maxPowerWatts: 2000,
        dimensions: '3x3m',
        categoryGroup: 'Artisanal & Crafts',
        isHighFootTraffic: true,
        footTrafficLabel: '🔥 Main Exhibition Stage Entrance',
        premiumSurchargeZar: 800,
        circuitId: 'circuit-2',
        status: 'available',
        xRatio: 25,
        yRatio: 25
      }
    ]
  },
  {
    id: 'market-004',
    title: 'Root44 Market Stellenbosch',
    organizer: 'Audacia Estate',
    locationName: 'Root44 Wine & Cultural Hub',
    address: 'Corner R44 & Annandale Rd, Stellenbosch',
    city: 'Stellenbosch',
    eventStartDate: '2026-10-03',
    eventEndDate: '2026-10-04',
    displayDates: 'Oct 03 - Oct 04, 2026',
    categories: ['#ArtisanalFood', '#Crafts', '#LocalProduce', '#Vegan'],
    coverImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80',
    description: 'Surrounded by Stellenbosch vineyards, Root44 offers craft beer, artisan wine, woodfired pizza, and handmade leather goods.',
    inventory: {
      foodSpotsLeft: 4,
      apparelSpotsLeft: 6,
      craftsSpotsLeft: 8,
      totalSpotsLeft: 18
    },
    isPromoted: false,
    expectedFootTraffic: {
      target: 6200,
      historicalAverage: 5800
    },
    pricing: {
      standardStallZar: 750,
      cornerStallZar: 1100,
      poweredBayZar: 1300,
      foodTruckZar: 1600
    },
    loadsheddingBackup: {
      active: true,
      type: 'Solar Microgrid & Battery Bank'
    },
    performance: {
      overallRating: 5.0,
      totalVendorReviews: 0,
      satisfactionRatePercent: 100,
      avgDailyVendorRevenueZar: 7400,
      footTrafficConversionRatePercent: 26,
      repeatVendorRatePercent: 86,
      topSellingCategory: '#ArtisanalFood',
      salesVelocityScore: 'High',
      categoryDemandBreakdown: [
        { category: '#ArtisanalFood', demandSharePercent: 45, avgRevenueZar: 9200 },
        { category: '#Crafts', demandSharePercent: 30, avgRevenueZar: 6400 },
        { category: '#LocalProduce', demandSharePercent: 25, avgRevenueZar: 6100 }
      ],
      reviews: []
    },
    circuits: [],
    stallGrid: []
  },
  {
    id: 'market-005',
    title: 'Prison Break Market - Spring Night Feast',
    organizer: 'Lonehill Events Management',
    locationName: 'Prison Break Market Village',
    address: '10 MacMillan Rd, Glenferness AH, Midrand',
    city: 'Johannesburg',
    eventStartDate: '2026-10-10',
    eventEndDate: '2026-10-11',
    displayDates: 'Oct 10 - Oct 11, 2026',
    categories: ['#ArtisanalFood', '#Halal', '#Crafts', '#VintageFashion'],
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    description: 'An eclectic Joburg destination with 7 distinct sheds including Craft Beer, Clay Pottery, Gourmet Eats, and Artisan Distilleries.',
    inventory: {
      foodSpotsLeft: 6,
      apparelSpotsLeft: 10,
      craftsSpotsLeft: 14,
      totalSpotsLeft: 30
    },
    isPromoted: false,
    expectedFootTraffic: {
      target: 9200,
      historicalAverage: 8700
    },
    pricing: {
      standardStallZar: 900,
      cornerStallZar: 1300,
      poweredBayZar: 1500,
      foodTruckZar: 1900
    },
    loadsheddingBackup: {
      active: true,
      type: '100 kVA Automatic Diesel Backup'
    },
    performance: {
      overallRating: 5.0,
      totalVendorReviews: 0,
      satisfactionRatePercent: 100,
      avgDailyVendorRevenueZar: 8900,
      footTrafficConversionRatePercent: 29,
      repeatVendorRatePercent: 89,
      topSellingCategory: '#ArtisanalFood',
      salesVelocityScore: 'Very High',
      categoryDemandBreakdown: [
        { category: '#ArtisanalFood', demandSharePercent: 40, avgRevenueZar: 11500 },
        { category: '#Halal', demandSharePercent: 25, avgRevenueZar: 9800 },
        { category: '#Crafts', demandSharePercent: 20, avgRevenueZar: 7200 },
        { category: '#VintageFashion', demandSharePercent: 15, avgRevenueZar: 6800 }
      ],
      reviews: []
    },
    circuits: [],
    stallGrid: []
  }
];

export const INITIAL_APPLICATIONS: VendorApplication[] = [];

export const INITIAL_APPLICANT_QUEUE: VendorProfile[] = [];

export const INITIAL_CHAT_THREADS: ChatThread[] = [
  {
    id: 'chat-support',
    marketId: 'market-001',
    marketTitle: 'Plazr Platform Support',
    vendorId: 'guest-001',
    vendorName: 'Market Vendor',
    plannerName: 'Plazr Market Concierge',
    lastMessage: 'Welcome to Plazr SA! How can we assist you with stall booking today?',
    lastTimestamp: 'Just now',
    unreadByVendor: true,
    unreadByPlanner: false,
    messages: [
      {
        id: 'm-welcome',
        sender: 'planner',
        text: 'Welcome to Plazr SA! Reach out anytime if you need assistance selecting a stall spot, understanding power circuit limits, or verifying municipal compliance certificates.',
        timestamp: 'Just now'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-welcome',
    title: '👋 Welcome to Plazr SA',
    message: 'South African premier street market platform. Browse markets, select stall spots on interactive floor plans, and pay instantly via PayFast.',
    timestamp: 'Just now',
    type: 'info',
    read: false,
    actionTarget: 'discovery'
  }
];

export const INITIAL_WALLET_TRANSACTIONS: WalletTransaction[] = [];

export const INITIAL_MARKET_DROPS: MarketDropTeaser[] = [
  {
    id: 'drop-001',
    title: 'Stellenbosch Winelands Harvest Pop-Up',
    organizer: 'Winelands Event Guild',
    city: 'Stellenbosch',
    suburb: 'Central Winelands',
    locationName: 'Blaauwklippen Estate grounds',
    coverImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80'
    ],
    badgeStatus: 'opening_soon',
    badgeLabel: '🔥 Applications Opening Soon',
    targetSecondsRemaining: 223500, // 2 days, 14 hours, 05 mins
    applicationsOpenDateLabel: 'Saturday 09:00 AM',
    expectedFootfall: 8500,
    categories: ['#ArtisanalFood', '#Crafts', '#LocalProduce', '#Vegan'],
    marketId: 'market-001',
    remindCount: 0,
    isReminded: false
  },
  {
    id: 'drop-002',
    title: 'Waterfront Artisanal Night Market Drop',
    organizer: 'V&A Events Co',
    city: 'Cape Town',
    suburb: 'Granger Bay',
    locationName: 'Jetty 2 Pier, V&A Waterfront',
    coverImage: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&auto=format&fit=crop&q=80'
    ],
    badgeStatus: 'stalls_filling_fast',
    badgeLabel: '⚡ 80% Stalls Filled',
    targetSecondsRemaining: 22800, // 0 days, 6 hours, 20 mins
    applicationsOpenDateLabel: 'Tonight 18:00 PM',
    expectedFootfall: 12000,
    categories: ['#ArtisanalFood', '#Halal', '#VintageFashion'],
    marketId: 'market-002',
    remindCount: 0,
    isReminded: false
  },
  {
    id: 'drop-003',
    title: 'Fourways Farmers & Craft Collective',
    organizer: 'Gauteng Market Alliance',
    city: 'Johannesburg',
    suburb: 'Fourways',
    locationName: 'Fourways Pines Pavilion',
    coverImage: 'https://images.unsplash.com/photo-1509315811355-57bd3b72b141?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1509315811355-57bd3b72b141?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80'
    ],
    badgeStatus: 'doors_open_saturday',
    badgeLabel: '🎉 Doors Open This Saturday',
    targetSecondsRemaining: 117900, // 1 day, 8 hours, 45 mins
    applicationsOpenDateLabel: 'Friday 12:00 PM',
    expectedFootfall: 9800,
    categories: ['#Crafts', '#ArtisanalFood', '#BeautyWellness'],
    marketId: 'market-003',
    remindCount: 0,
    isReminded: false
  },
  {
    id: 'drop-004',
    title: 'Umhlanga Promenade Beachfront Pop-Up',
    organizer: 'KZN Coastline Markets',
    city: 'Durban',
    suburb: 'Umhlanga Rocks',
    locationName: 'Umhlanga Pier Plaza',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80'
    ],
    badgeStatus: 'opening_soon',
    badgeLabel: '🔥 Applications Opening Soon',
    targetSecondsRemaining: 324600, // 3 days, 18 hours
    applicationsOpenDateLabel: 'Next Monday 08:00 AM',
    expectedFootfall: 14000,
    categories: ['#Halal', '#ArtisanalFood', '#Crafts'],
    marketId: 'market-001',
    remindCount: 0,
    isReminded: false
  }
];

export const INITIAL_FEATURED_VENDORS: FeaturedVendorSpotlight[] = [];

