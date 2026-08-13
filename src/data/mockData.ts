import { VendorProfile, MarketEvent, VendorApplication, ChatThread, NotificationItem, WalletTransaction, MarketDropTeaser, FeaturedVendorSpotlight } from '../types';

export const INITIAL_VENDOR_PROFILE: VendorProfile = {
  id: 'vendor-001',
  businessName: "Bo-Kaap Gourmet Bunny Chow & Artisanal Sliders",
  ownerName: "Zainab Hendricks",
  email: "zainab@bokaapgourmet.co.za",
  phone: "+27 82 491 8820",
  category: '#ArtisanalFood',
  bio: "Authentic Durban-style spice blends, gourmet lamb bunny chow, and hand-pressed wagyu sliders crafted fresh in Cape Town.",
  avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&auto=format&fit=crop&q=80",
  vettingStatus: 'vetted',
  vettingFeePaid: true,
  powerRequirementKw: 4.0, // High-draw heavy griddle & commercial fryer
  documents: [
    {
      id: 'doc-001',
      title: 'Certificate of Acceptability (CoA)',
      code: 'COA-CT-2026',
      expiryDate: '2026-11-30',
      status: 'valid',
      issuedBy: 'City of Cape Town Health Dept',
      renewalFeeZar: 0,
      requiredForCategories: ['#ArtisanalFood', '#Halal', '#Vegan']
    },
    {
      id: 'doc-002',
      title: 'LPG Gas Safety Certificate',
      code: 'GAS-SA-8821',
      expiryDate: '2026-08-20', // EXPIRES BEFORE SEPT 12, 2026!
      status: 'expiring_soon',
      issuedBy: 'Liquefied Petroleum Gas Assoc. of SA (LPGASA)',
      renewalFeeZar: 0,
      requiredForCategories: ['#ArtisanalFood', '#Halal']
    },
    {
      id: 'doc-003',
      title: 'Public Liability Insurance (R5,000,000 Cover)',
      code: 'PLI-MUTUAL-994',
      expiryDate: '2027-02-15',
      status: 'valid',
      issuedBy: 'Old Mutual Specialty Insurance',
      renewalFeeZar: 0,
      requiredForCategories: ['#ArtisanalFood', '#GeekCulture', '#VintageFashion', '#Crafts', '#Halal', '#Vegan']
    },
    {
      id: 'doc-004',
      title: 'Fire Safety & Extinguisher Clearance',
      code: 'FIRE-CPT-440',
      expiryDate: '2026-10-15',
      status: 'valid',
      issuedBy: 'Cape Town Fire & Rescue Service',
      renewalFeeZar: 0,
      requiredForCategories: ['#ArtisanalFood', '#Halal']
    }
  ],
  socialReach: {
    instagramFollowers: 14200,
    tiktokFollowers: 22800,
    facebookFollowers: 5600,
    totalReach: 42600,
    instagramHandle: '@bokaapgourmet'
  },
  reliabilityIndex: {
    rating: 4.9,
    onTimeSetupPercent: 98,
    cleanlinessScore: 4.95,
    totalMarketsCompleted: 42
  },
  galleryImages: [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80"
  ],
  subscriptionTier: 'free',
  isVipSubscriber: false,
  locationPreferences: {
    baseAddress: '124 Wale Street, Bo-Kaap',
    baseCity: 'Cape Town',
    baseSuburb: 'Bo-Kaap & City Centre',
    operatingCities: ['Cape Town', 'Stellenbosch', 'Johannesburg'],
    preferredZones: ['Woodstock & Salt River', 'Bo-Kaap & City Centre', 'Sea Point & Atlantic Seaboard', 'Stellenbosch Winelands'],
    maxTravelDistanceKm: 60,
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
      overallRating: 4.9,
      totalVendorReviews: 128,
      satisfactionRatePercent: 96,
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
      reviews: [
        {
          id: 'rev-1',
          vendorName: 'Mama Africa Dumplings',
          vendorCategory: '#ArtisanalFood',
          rating: 5.0,
          comment: 'Incredible foot traffic! Sold out of dombolo dumplings by 2:30 PM. Backup generator kicked in seamlessly during stage 2 loadshedding.',
          date: 'Aug 2026',
          dailyRevenueReportedZar: 12400
        },
        {
          id: 'rev-2',
          vendorName: 'Kirstenbosch Ceramic Studio',
          vendorCategory: '#Crafts',
          rating: 4.8,
          comment: 'High quality local and tourist crowd willing to spend on botanical art. Great stall layout spacing.',
          date: 'July 2026',
          dailyRevenueReportedZar: 7800
        },
        {
          id: 'rev-3',
          vendorName: 'Kloof Street Vintage Threads',
          vendorCategory: '#VintageFashion',
          rating: 5.0,
          comment: 'Gate check-in with QR code was so quick! Load-in slot A avoided all vehicle gridlock on Albert Rd.',
          date: 'July 2026',
          dailyRevenueReportedZar: 8200
        }
      ]
    },
    circuits: [
      {
        id: 'circuit-1',
        name: 'Zone A - Food Alley Grid',
        maxCapacityKw: 12.0,
        currentLoadKw: 9.5,
        isOverloaded: false,
        assignedSpotIds: ['SPOT-A1', 'SPOT-A2', 'SPOT-A3']
      },
      {
        id: 'circuit-2',
        name: 'Zone B - Artisan & Crafts Main',
        maxCapacityKw: 8.0,
        currentLoadKw: 4.2,
        isOverloaded: false,
        assignedSpotIds: ['SPOT-B1', 'SPOT-B2', 'SPOT-B3']
      },
      {
        id: 'circuit-3',
        name: 'Zone C - Fashion & Courtyard',
        maxCapacityKw: 6.0,
        currentLoadKw: 2.1,
        isOverloaded: false,
        assignedSpotIds: ['SPOT-C1', 'SPOT-C2']
      }
    ],
    categoryQuotas: [
      { categoryGroup: 'Food & Beverage', targetCount: 10, bookedCount: 7 },
      { categoryGroup: 'Artisanal & Crafts', targetCount: 15, bookedCount: 9 },
      { categoryGroup: 'Apparel & Vintage', targetCount: 12, bookedCount: 4 },
      { categoryGroup: 'Beauty & Wellness', targetCount: 8, bookedCount: 3 },
      { categoryGroup: 'General Retail', targetCount: 10, bookedCount: 2 }
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
        status: 'occupied',
        occupantVendorId: 'vendor-002',
        occupantVendorName: 'Mama Africa Dumplings',
        occupantCategory: '#ArtisanalFood',
        occupantPowerKw: 3.5,
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
        status: 'occupied',
        occupantVendorId: 'vendor-003',
        occupantVendorName: 'Kirstenbosch Ceramic Studio',
        occupantCategory: '#Crafts',
        occupantPowerKw: 1.0,
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
      overallRating: 4.8,
      totalVendorReviews: 94,
      satisfactionRatePercent: 94,
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
      reviews: [
        {
          id: 'rev-201',
          vendorName: 'Cape Organic Produce',
          vendorCategory: '#LocalProduce',
          rating: 5.0,
          comment: 'Constant stream of loyal locals every Saturday. Highest conversion rate of any Cape Town market.',
          date: 'July 2026',
          dailyRevenueReportedZar: 11800
        },
        {
          id: 'rev-202',
          vendorName: 'Green Point Vegan Deli',
          vendorCategory: '#Vegan',
          rating: 4.7,
          comment: 'Seafront vibe brings enthusiastic buyers. Highly organized electricity and waste disposal.',
          date: 'June 2026',
          dailyRevenueReportedZar: 8400
        }
      ]
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
      overallRating: 4.95,
      totalVendorReviews: 210,
      satisfactionRatePercent: 98,
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
      reviews: [
        {
          id: 'rev-301',
          vendorName: 'Jozi Manga & Merch Alley',
          vendorCategory: '#GeekCulture',
          rating: 5.0,
          comment: 'Massive foot traffic with incredible buying intent! Best sales weekend of the year.',
          date: 'Sept 2025',
          dailyRevenueReportedZar: 28500
        },
        {
          id: 'rev-302',
          vendorName: 'Retro Arcade Pins & Apparel',
          vendorCategory: '#VintageFashion',
          rating: 4.9,
          comment: '70k+ attendees across 3 days. Power grid stayed 100% stable through dual industrial gensets.',
          date: 'Sept 2025',
          dailyRevenueReportedZar: 19200
        }
      ]
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
      overallRating: 4.75,
      totalVendorReviews: 68,
      satisfactionRatePercent: 93,
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
      reviews: [
        {
          id: 'rev-401',
          vendorName: 'Winelands Woodfired Pizza',
          vendorCategory: '#ArtisanalFood',
          rating: 4.8,
          comment: 'Lovely Winelands crowd and great solar battery backup. Zero downtime during loadshedding.',
          date: 'May 2026',
          dailyRevenueReportedZar: 9100
        }
      ]
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
      overallRating: 4.85,
      totalVendorReviews: 88,
      satisfactionRatePercent: 95,
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
      reviews: [
        {
          id: 'rev-501',
          vendorName: 'Midrand Artisanal Bakery',
          vendorCategory: '#ArtisanalFood',
          rating: 4.9,
          comment: 'Night market atmosphere was electric! Constant queue at our sourdough stand.',
          date: 'July 2026',
          dailyRevenueReportedZar: 11200
        }
      ]
    },
    circuits: [],
    stallGrid: []
  }
];

export const INITIAL_APPLICATIONS: VendorApplication[] = [
  {
    id: 'app-101',
    marketId: 'market-001',
    marketTitle: 'Neighbourgoods Market - Spring Artisanal Festival',
    coverImage: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&auto=format&fit=crop&q=80',
    eventDate: '2026-09-12',
    vendorId: 'vendor-001',
    vendorName: "Bo-Kaap Gourmet Bunny Chow & Artisanal Sliders",
    vendorCategory: '#ArtisanalFood',
    selectedSpotId: 'SPOT-A1',
    selectedSpotZone: 'Corner Spot (3x3m)',
    status: 'approved_pending_payment',
    appliedAt: '2026-08-05 14:30',
    unpaidHoursRemaining: 48,
    paymentDeadline: '2026-08-12 18:00',
    feeBreakdown: {
      baseStallFeeZar: 1250,
      vendrPlatformFeeZar: 62.50,
      docVerificationFeeZar: 0,
      totalZar: 1312.50
    },
    payfastReference: 'PF-2026-88192'
  },
  {
    id: 'app-102',
    marketId: 'market-003',
    marketTitle: 'Comic Con Africa 2026 - Vendor Alley',
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    eventDate: '2026-09-25',
    vendorId: 'vendor-001',
    vendorName: "Bo-Kaap Gourmet Bunny Chow & Artisanal Sliders",
    vendorCategory: '#ArtisanalFood',
    selectedSpotId: 'CC-01',
    selectedSpotZone: 'Corner Spot (3x3m)',
    status: 'pending_planner_review',
    appliedAt: '2026-08-06 09:15',
    feeBreakdown: {
      baseStallFeeZar: 3500,
      vendrPlatformFeeZar: 175,
      docVerificationFeeZar: 0,
      totalZar: 3675
    }
  },
  {
    id: 'app-103',
    marketId: 'market-001',
    marketTitle: 'Neighbourgoods Market - Spring Artisanal Festival',
    coverImage: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&auto=format&fit=crop&q=80',
    eventDate: '2026-09-12',
    vendorId: 'vendor-002',
    vendorName: "Mama Africa Dumplings & Samp Bar",
    vendorCategory: '#ArtisanalFood',
    selectedSpotId: 'SPOT-A1 (Standby)',
    selectedSpotZone: 'Food Zone A (Backup)',
    status: 'waitlisted',
    waitlistPosition: 1,
    appliedAt: '2026-08-06 11:20',
    feeBreakdown: {
      baseStallFeeZar: 1250,
      vendrPlatformFeeZar: 62.50,
      docVerificationFeeZar: 0,
      totalZar: 1312.50
    }
  },
  {
    id: 'app-104',
    marketId: 'market-001',
    marketTitle: 'Neighbourgoods Market - Spring Artisanal Festival',
    coverImage: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&auto=format&fit=crop&q=80',
    eventDate: '2026-09-12',
    vendorId: 'vendor-004',
    vendorName: "Kloof Street Vintage Threads",
    vendorCategory: '#VintageFashion',
    selectedSpotId: 'SPOT-B4 (Standby)',
    selectedSpotZone: 'Fashion Zone B (Backup)',
    status: 'waitlisted',
    waitlistPosition: 2,
    appliedAt: '2026-08-07 08:45',
    feeBreakdown: {
      baseStallFeeZar: 950,
      vendrPlatformFeeZar: 47.50,
      docVerificationFeeZar: 0,
      totalZar: 997.50
    }
  }
];

export const INITIAL_APPLICANT_QUEUE: VendorProfile[] = [
  {
    id: 'vendor-002',
    businessName: "Mama Africa Dumplings & Samp Bar",
    ownerName: "Nomvula Dlamini",
    email: "nomvula@mamaafricadumplings.co.za",
    phone: "+27 73 992 1104",
    category: '#ArtisanalFood',
    bio: "Steamed traditional dombolo dumplings served with slow-cooked beef shin stew and chakalaka relish.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    vettingStatus: 'vetted',
    vettingFeePaid: true,
    powerRequirementKw: 3.5,
    documents: [],
    socialReach: {
      instagramFollowers: 18400,
      tiktokFollowers: 34100,
      facebookFollowers: 8200,
      totalReach: 60700,
      instagramHandle: '@mamaafricadumplings'
    },
    reliabilityIndex: {
      rating: 4.95,
      onTimeSetupPercent: 100,
      cleanlinessScore: 5.0,
      totalMarketsCompleted: 58
    },
    galleryImages: [
      "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: 'vendor-003',
    businessName: "Kirstenbosch Botanical Ceramics",
    ownerName: "Liam van der Merwe",
    email: "liam@kirstenboschceramics.co.za",
    phone: "+27 83 221 0092",
    category: '#Crafts',
    bio: "Hand-thrown porcelain tableware infused with real Protea leaf imprints and indigenous Cape floral glazes.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    vettingStatus: 'vetted',
    vettingFeePaid: true,
    powerRequirementKw: 0.8,
    documents: [],
    socialReach: {
      instagramFollowers: 29500,
      tiktokFollowers: 12100,
      facebookFollowers: 11400,
      totalReach: 53000,
      instagramHandle: '@kirstenbosch_ceramics'
    },
    reliabilityIndex: {
      rating: 4.85,
      onTimeSetupPercent: 96,
      cleanlinessScore: 4.9,
      totalMarketsCompleted: 31
    },
    galleryImages: [
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: 'vendor-004',
    businessName: "Kloof Street Vintage Threads",
    ownerName: "Anzi Mbeki",
    email: "anzi@kloofthreads.co.za",
    phone: "+27 61 883 4021",
    category: '#VintageFashion',
    bio: "Curated 90s streetwear, upcycled denim jackets with local Xhosa print embroidery, and retro sunglasses.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
    vettingStatus: 'vetted',
    vettingFeePaid: true,
    powerRequirementKw: 0.5,
    documents: [],
    socialReach: {
      instagramFollowers: 41200,
      tiktokFollowers: 58900,
      facebookFollowers: 3200,
      totalReach: 103300,
      instagramHandle: '@kloofstreet_vintage'
    },
    reliabilityIndex: {
      rating: 4.92,
      onTimeSetupPercent: 99,
      cleanlinessScore: 4.85,
      totalMarketsCompleted: 64
    },
    galleryImages: [
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&auto=format&fit=crop&q=80"
    ]
  }
];

export const INITIAL_CHAT_THREADS: ChatThread[] = [
  {
    id: 'chat-001',
    marketId: 'market-001',
    marketTitle: 'Neighbourgoods Market - Spring Artisanal Festival',
    vendorId: 'vendor-001',
    vendorName: 'Bo-Kaap Gourmet Bunny Chow',
    plannerName: 'Woodstock Collective Operations',
    lastMessage: 'Your spot A1 is confirmed! Please ensure LPG certificate is updated before Sept 12.',
    lastTimestamp: '10:42 AM',
    unreadByVendor: true,
    unreadByPlanner: false,
    messages: [
      {
        id: 'm1',
        sender: 'vendor',
        text: 'Hi team! We require a 15A socket for our commercial slider griddle on Zone A1.',
        timestamp: '10:15 AM'
      },
      {
        id: 'm2',
        sender: 'planner',
        text: 'Hi Zainab! Zone A1 is wired directly to our 12kW Zone A Substation board with 16A breaker protection. Perfect for heavy griddles.',
        timestamp: '10:30 AM'
      },
      {
        id: 'm3',
        sender: 'planner',
        text: 'Your spot A1 is confirmed! Please ensure LPG certificate is updated before Sept 12.',
        timestamp: '10:42 AM'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-2day-open',
    title: '⏰ Market Opening in 2 Days: Stellenbosch Winelands Harvest Pop-Up',
    message: 'Applications for Stellenbosch Winelands Harvest Pop-Up open in 48 hours (2 days prior notice)! Get your preferred stall spot ready.',
    timestamp: '10 mins ago',
    type: 'market_drop',
    read: false,
    actionTarget: 'discovery'
  },
  {
    id: 'notif-drop-1',
    title: '🚀 NEW MARKET DROP: Waterfront Artisanal Night Market',
    message: 'A brand new artisanal night market in V&A Waterfront has officially dropped! Applications open for food & craft vendors.',
    timestamp: '25 mins ago',
    type: 'market_drop',
    read: false,
    actionTarget: 'discovery'
  },
  {
    id: 'notif-1',
    title: '⚠️ Compliance Outdated Warning: LPG Certificate',
    message: 'Your LPG Gas Safety Certificate is expiring soon or outdated before your next event date. Please update it in Document Vault.',
    timestamp: '1 hour ago',
    type: 'warning',
    read: false,
    actionTarget: 'document_vault'
  },
  {
    id: 'notif-2',
    title: '💳 Application Approved — Payment Required',
    message: 'Neighbourgoods Market approved your application for Spot A1 (Corner Spot 3x3m)! PayFast checkout is required within 48 hours to lock your stall.',
    timestamp: '2 hours ago',
    type: 'payment',
    read: false,
    actionTarget: 'applications'
  },
  {
    id: 'notif-3',
    title: '⚡ Loadshedding Backup Verified (verifiedbizlink.co.za)',
    message: 'Woodstock Collective confirmed 45 kVA Generator backup active for Neighbourgoods Market Sept 12-13.',
    timestamp: 'Yesterday',
    type: 'info',
    read: true
  }
];

export const INITIAL_WALLET_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-001',
    description: 'Wallet Top-Up via Instant EFT',
    amountZar: 2500,
    type: 'credit',
    date: '2026-08-01',
    reference: 'EFT-ZA-991204'
  },
  {
    id: 'tx-002',
    description: 'Plazr Vendor Vetting Fee',
    amountZar: -50,
    type: 'debit',
    date: '2026-08-01',
    reference: 'VNDR-VET-8821'
  }
];

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
    remindCount: 342,
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
    remindCount: 819,
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
    remindCount: 520,
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
    remindCount: 215,
    isReminded: false
  }
];

export const INITIAL_FEATURED_VENDORS: FeaturedVendorSpotlight[] = [
  {
    id: 'fv-001',
    businessName: 'Cape Organic Produce',
    ownerName: 'Jacob & Sarah Marais',
    city: 'Cape Town',
    category: '#LocalProduce',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    heroProductImage: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600&auto=format&fit=crop&q=80',
    bio: 'Heirloom Stellenbosch tomatoes, farm-fresh organic kale, and cold-pressed olive oils harvested weekly.',
    rating: 4.9,
    reviewsCount: 142,
    topSellingProduct: 'Organic Heirloom Veg Basket',
    verified: true,
    totalEventsCompleted: 38
  },
  {
    id: 'fv-002',
    businessName: 'Protea Ceramics & Fynbos Glazes',
    ownerName: 'Anika van Zyl',
    city: 'Stellenbosch',
    category: '#Crafts',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    heroProductImage: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80',
    bio: 'Hand-thrown stoneware dishes infused with real Cape Protea leaf textures and volcanic ash glazes.',
    rating: 5.0,
    reviewsCount: 98,
    topSellingProduct: 'Handcrafted Protea Platter',
    verified: true,
    totalEventsCompleted: 24
  },
  {
    id: 'fv-003',
    businessName: 'EcoSanity Event Sanitation & Mobile Ablutions',
    ownerName: 'Sipho & Lerato Dlamini',
    city: 'Cape Town',
    category: '#Sanitation',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    heroProductImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
    bio: 'Luxury solar-powered mobile restroom trailers, touchless hand sanitizing stations, and eco-certified waste management.',
    rating: 4.95,
    reviewsCount: 86,
    topSellingProduct: 'VIP Solar Mobile Restroom Trailer Unit',
    verified: true,
    totalEventsCompleted: 64
  },
  {
    id: 'fv-004',
    businessName: 'ProStage & Gazebo Power Equipment',
    ownerName: 'Gareth Thorne',
    city: 'Johannesburg',
    category: '#Equipment',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    heroProductImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    bio: 'Heavy-duty commercial pop-up gazebos, silent diesel generators, distribution boards, and warm festoon lighting.',
    rating: 4.9,
    reviewsCount: 112,
    topSellingProduct: '3x3m Wind-Resistant Pro Gazebo + Lighting Kit',
    verified: true,
    totalEventsCompleted: 88
  },
  {
    id: 'fv-005',
    businessName: 'Guardian Tactical Event Security',
    ownerName: 'Kagiso Mokoena',
    city: 'Durban',
    category: '#Security',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    heroProductImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
    bio: 'PSIRA-certified event security, VIP crowd management, overnight stall guard patrols, and electronic gate scanning.',
    rating: 5.0,
    reviewsCount: 140,
    topSellingProduct: 'Overnight Stall Guard Patrol & Access Team',
    verified: true,
    totalEventsCompleted: 105
  },
  {
    id: 'fv-006',
    businessName: 'Jozi Vintage Thrift & Denim',
    ownerName: 'Thabo Mokoena',
    city: 'Johannesburg',
    category: '#VintageFashion',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    heroProductImage: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80',
    bio: 'Curated 90s streetwear, authentic leather jackets, and custom upcycled denim from Maboneng.',
    rating: 4.8,
    reviewsCount: 210,
    topSellingProduct: 'Upcycled 90s Levi Denim Jacket',
    verified: true,
    totalEventsCompleted: 52
  }
];

