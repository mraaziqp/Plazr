export type UserRole = 'vendor' | 'planner' | 'admin';

export interface UserActivityLog {
  id: string;
  userId?: string;
  userEmail: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'auth' | 'booking' | 'payout' | 'document' | 'admin' | 'system';
}

export interface SalesTransaction {
  id: string;
  marketId: string;
  marketTitle: string;
  eventDate: string;
  amountZar: number;
  platformFeeZar: number;
  netEarningsZar: number;
  status: 'completed' | 'pending' | 'payout_requested' | 'paid_out';
  spotId: string;
  paymentMethod: 'payfast' | 'wallet' | 'eft';
  createdAt: string;
}

export interface MonthlySalesStat {
  month: string;
  grossSalesZar: number;
  netPayoutsZar: number;
  bookingsCount: number;
}


export type CategoryTag = 
  | '#ArtisanalFood'
  | '#GeekCulture'
  | '#VintageFashion'
  | '#Crafts'
  | '#Halal'
  | '#Vegan'
  | '#LocalProduce'
  | '#BeautyWellness'
  | '#Sanitation'
  | '#Equipment'
  | '#Security';

export interface DocumentItem {
  id: string;
  title: string;
  code: string; // e.g. "CoA", "LPG-SAFETY", "PLI-R5M"
  expiryDate: string; // ISO date string "2026-08-20"
  status: 'valid' | 'expiring_soon' | 'expired' | 'pending_verification';
  issuedBy: string;
  documentUrl?: string;
  renewalFeeZar: number; // e.g. 25
  requiredForCategories: CategoryTag[];
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'stall_lead' | 'assistant' | 'loadin_helper';
  addedAt: string;
  status: 'active' | 'pending';
}

export interface VendorProfile {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  category: CategoryTag;
  bio: string;
  avatar: string;
  vettingStatus: 'vetted' | 'unvetted' | 'pending_review';
  vettingFeePaid: boolean;
  powerRequirementKw: number; // e.g. 3.5 kW
  documents: DocumentItem[];
  socialReach: {
    instagramFollowers: number;
    tiktokFollowers: number;
    facebookFollowers: number;
    totalReach: number;
    instagramHandle: string;
  };
  reliabilityIndex: {
    rating: number; // 0 to 5
    onTimeSetupPercent: number; // e.g. 98
    cleanlinessScore: number; // e.g. 4.9
    totalMarketsCompleted: number;
  };
  galleryImages: string[];
  interests?: string[];
  subscriptionTier?: 'free' | 'vip';
  isVipSubscriber?: boolean;
  vipRenewalDate?: string;
  staffMembers?: StaffMember[];
  locationPreferences?: VendorLocationPreferences;
}

export interface VendorLocationPreferences {
  baseAddress: string;
  baseCity: string;
  baseSuburb: string;
  operatingCities: string[];
  preferredZones: string[];
  maxTravelDistanceKm: number;
  preferredMarketTypes: string[];
}

export interface RegisteredUser {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  phone: string;
  businessOrOrgName: string;
  categoryOrVenue: string;
  city: string;
  interests: string[];
  registeredAt: string;
}

export type SpotCategoryGroup = 
  | 'Food & Beverage'
  | 'Artisanal & Crafts'
  | 'Apparel & Vintage'
  | 'Beauty & Wellness'
  | 'General Retail';

export interface CategoryQuota {
  categoryGroup: SpotCategoryGroup;
  targetCount: number;
  bookedCount: number;
}

export interface StallSpot {
  id: string;
  label: string; // e.g. "Spot A1 - Corner"
  zoneType: string;
  dimensions: string; // e.g. "3m x 3m", "2m x 2m", "5m x 3m"
  categoryGroup: SpotCategoryGroup; // For color coding
  basePriceZar: number;
  isHighFootTraffic?: boolean; // Organiser highlighted prime foot traffic spot
  footTrafficLabel?: string; // e.g. "🔥 Main Entrance Hub"
  premiumSurchargeZar?: number; // Higher rate for high traffic spot
  maxPowerWatts: number; // Maximum wattage allowed e.g. 3500 W
  powerKw: number; // e.g. 3.5 kW
  circuitId: 'circuit-1' | 'circuit-2' | 'circuit-3';
  status: 'available' | 'reserved' | 'selected' | 'occupied';
  occupantVendorId?: string;
  occupantVendorName?: string;
  occupantCategory?: CategoryTag;
  occupantPowerKw?: number;
  xRatio?: number; // 0-100% position on canvas
  yRatio?: number;
}

export interface PowerCircuit {
  id: 'circuit-1' | 'circuit-2' | 'circuit-3';
  name: string;
  maxCapacityKw: number; // e.g. 10 kW
  currentLoadKw: number;
  isOverloaded: boolean;
  assignedSpotIds: string[];
}

export interface MarketReview {
  id: string;
  vendorName: string;
  vendorCategory: CategoryTag;
  rating: number; // e.g. 5.0
  comment: string;
  date: string;
  dailyRevenueReportedZar: number; // e.g. 8500
}

export interface MarketPerformanceAnalytics {
  overallRating: number; // e.g. 4.9
  totalVendorReviews: number; // e.g. 128
  satisfactionRatePercent: number; // e.g. 96
  avgDailyVendorRevenueZar: number; // e.g. 8450
  footTrafficConversionRatePercent: number; // e.g. 28
  repeatVendorRatePercent: number; // e.g. 88
  topSellingCategory: CategoryTag;
  salesVelocityScore: 'High' | 'Very High' | 'Exceptional';
  categoryDemandBreakdown: { category: CategoryTag; demandSharePercent: number; avgRevenueZar: number }[];
  reviews: MarketReview[];
}

export interface MarketEvent {
  id: string;
  title: string;
  organizer: string;
  locationName: string;
  address: string;
  city: 'Cape Town' | 'Johannesburg' | 'Stellenbosch' | 'Durban' | string;
  suburb?: string;
  operatingZonesInvited?: string[];
  targetVendorRadiusKm?: number;
  coordinates?: { lat: number; lng: number };
  eventStartDate: string; // "2026-09-12"
  eventEndDate: string; // "2026-09-13"
  displayDates: string; // "Sept 12 - Sept 13, 2026"
  categories: CategoryTag[];
  coverImage: string;
  description: string;
  inventory: {
    foodSpotsLeft: number;
    apparelSpotsLeft: number;
    craftsSpotsLeft: number;
    totalSpotsLeft: number;
  };
  isPromoted: boolean; // Featured Gold Badge
  promotionTier?: 'recommended' | 'featured_gold' | 'headline_sponsor';
  adSponsorshipPaid?: boolean;
  adSponsorshipPriceZar?: number;
  isEarlyAccessOnly?: boolean;
  earlyAccessDaysRemaining?: number;
  generalAccessOpensAt?: string;
  promotedUntil?: string;
  expectedFootTraffic: {
    target: number;
    historicalAverage: number;
  };
  pricing: {
    standardStallZar: number;
    cornerStallZar: number;
    poweredBayZar: number;
    foodTruckZar: number;
  };
  stallGrid: StallSpot[];
  circuits: PowerCircuit[];
  categoryQuotas?: CategoryQuota[];
  loadsheddingBackup: {
    active: boolean;
    type: string; // e.g., "45 kVA Silent Diesel Generator + Inverter Hybrid"
  };
  loadInSlots?: LoadInSlot[];
  performance?: MarketPerformanceAnalytics;
}

export interface LoadInSlot {
  id: string;
  timeWindow: string; // e.g. "06:00 - 06:30 AM"
  title: string; // e.g. "Slot A - Heavy Food Rigs & Gas Equipment"
  description: string;
  maxCapacity: number;
  assignedVendorCount: number;
  categoryRestriction?: CategoryTag;
}

export type ApplicationStatus = 
  | 'pending_planner_review'
  | 'approved_pending_payment'
  | 'waitlisted'
  | 'paid_and_confirmed'
  | 'declined'
  | 'payment_expired'
  | 'counter_offer_received';

export interface VendorApplication {
  id: string;
  marketId: string;
  marketTitle: string;
  coverImage?: string;
  eventDate: string;
  locationName?: string;
  vendorId: string;
  vendorName: string;
  vendorCategory: CategoryTag;
  selectedSpotId: string;
  selectedSpotZone: string;
  status: ApplicationStatus;
  appliedAt: string;
  paymentDeadline?: string;
  unpaidHoursRemaining?: number;
  waitlistPosition?: number;
  promotedFromWaitlistAt?: string;
  feeBreakdown: {
    baseStallFeeZar: number;
    vendrPlatformFeeZar: number; // 5%
    docVerificationFeeZar: number;
    totalZar: number;
  };
  declineReason?: string;
  counterOfferDetails?: {
    suggestedSpotId: string;
    discountedPriceZar: number;
    note: string;
  };
  payfastReference?: string;
  paidAt?: string;
  loadInSlotId?: string;
  loadInSlotTime?: string;
  checkInStatus?: 'pending' | 'checked_in' | 'delayed';
  checkedInAt?: string;
  qrSecurityToken?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'vendor' | 'planner';
  text: string;
  timestamp: string;
  type?: 'text' | 'counter_offer' | 'doc_request' | 'system';
}

export interface ChatThread {
  id: string;
  marketId: string;
  marketTitle: string;
  vendorId: string;
  vendorName: string;
  plannerName: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadByVendor: boolean;
  unreadByPlanner: boolean;
  messages: ChatMessage[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'warning' | 'success' | 'info' | 'action' | 'market_drop' | 'payment';
  read: boolean;
  actionTarget?: 'document_vault' | 'applications' | 'chat' | 'floorplan' | 'discovery';
}

export interface WalletTransaction {
  id: string;
  description: string;
  amountZar: number; // positive for topup/refund, negative for payment
  type: 'debit' | 'credit';
  date: string;
  reference: string;
}

export interface MarketDropTeaser {
  id: string;
  title: string;
  organizer: string;
  city: 'Cape Town' | 'Johannesburg' | 'Stellenbosch' | 'Durban' | 'Pretoria' | string;
  suburb?: string;
  locationName: string;
  coverImage: string;
  galleryImages: string[];
  badgeStatus: 'opening_soon' | 'stalls_filling_fast' | 'doors_open_saturday' | 'exclusive_drop';
  badgeLabel: string; // e.g. "🔥 Applications Opening Soon", "⚡ 80% Stalls Filled", "🎉 Doors Open This Saturday"
  targetSecondsRemaining: number; // For live dynamic countdown timer
  applicationsOpenDateLabel: string;
  expectedFootfall: number;
  categories: CategoryTag[];
  marketId?: string;
  remindCount: number;
  isReminded?: boolean;
}

export interface FeaturedVendorSpotlight {
  id: string;
  businessName: string;
  ownerName: string;
  city: string;
  category: CategoryTag;
  avatar: string;
  heroProductImage: string;
  bio: string;
  rating: number;
  reviewsCount: number;
  topSellingProduct: string;
  verified: boolean;
  totalEventsCompleted: number;
}

