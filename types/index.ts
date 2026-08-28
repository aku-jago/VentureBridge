// ===========================
// VentureBridge Core Types
// ===========================

export type UserRole = "founder" | "investor" | "cofounder" | "mentor" | "asset_owner";

export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";

export type BusinessStage = "ideation" | "pre_seed" | "seed" | "early_stage" | "series_a" | "series_b";

export type AccessStatus = "pending" | "approved" | "rejected";

export type RequestStatus = "pending" | "approved" | "rejected";

// ===========================
// Token System Types
// ===========================

export interface TokenPackage {
  id: string;
  name: string;
  price: number;        // Harga dalam Rupiah
  tokens: number;       // Jumlah token yang didapat
  isPopular?: boolean;
}

export type TokenTransactionType =
  | "topup"           // Investor top up token
  | "unlock"          // Investor pakai token untuk buka ide bisnis
  | "receive"         // Founder terima token dari investor
  | "withdraw"        // Founder tarik token (withdraw)
  | "withdraw_pending"; // Founder request withdraw, belum diproses

export interface TokenTransaction {
  id: string;
  userId: string;
  type: TokenTransactionType;
  amount: number;           // Jumlah token (positif = masuk, negatif = keluar)
  description: string;
  relatedOpportunityId?: string;
  relatedOpportunityTitle?: string;
  relatedUserId?: string;
  relatedUserName?: string;
  createdAt: string;
  status: "completed" | "pending" | "failed" | "rejected";
}

export interface TopUpRequest {
  id: string;
  userId: string;
  userName: string;
  userInitials: string;
  packageId: string;
  packageName: string;
  amount: number;         // Harga Rupiah
  tokens: number;         // Jumlah token yang akan didapat
  status: "waiting" | "confirmed" | "rejected";
  paymentProofNote?: string;
  requestedAt: string;
  confirmedAt?: string;
}

export interface WithdrawRequest {
  id: string;
  founderId: string;
  founderName: string;
  founderInitials: string;
  tokens: number;           // Jumlah token yang ingin ditarik
  estimatedRupiah: number;  // Estimasi nilai rupiah
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: "pending" | "processed" | "rejected";
  requestedAt: string;
  processedAt?: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  initials: string;
  title: string;
  company?: string;
  location: string;
  bio?: string;
  isVerified: boolean;
  verificationBadges: VerificationBadge[];
  joinedAt: string;
}

export interface VerificationBadge {
  type: "identity" | "business" | "campus" | "investor" | "lead_syndicate";
  label: string;
  issuedBy?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  sector: string[];
  stage: BusinessStage;
  targetFunding: number;
  location: string;
  founderId: string;
  founder: Pick<User, "id" | "name" | "initials" | "avatar">;
  seekingRoles: ("investor" | "cofounder" | "mentor")[];
  verificationStatus: VerificationStatus;
  matchScore?: number;
  createdAt: string;
  traction?: string;
  teamSize?: number;
  website?: string;
  imageUrl?: string;
}

export interface InvestorProfile extends User {
  preferredSectors: string[];
  capitalRangeMin: number;
  capitalRangeMax: number;
  preferredStages: BusinessStage[];
  yearsInvesting: number;
  trackRecord: TrackRecord[];
  affiliations: Affiliation[];
  typicalResponseHours: number;
  investmentPhilosophy?: string;
  activeInvestments?: number;
}

export interface TrackRecord {
  id: string;
  companyName: string;
  sector: string;
  stage: string;
  round: string;
}

export interface Affiliation {
  id: string;
  organizationName: string;
  role: string;
  since?: string;
  isVerified: boolean;
}

export interface AccessRequest {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  requesterId: string;
  requester: Pick<User, "id" | "name" | "initials" | "avatar" | "title" | "isVerified" | "verificationBadges">;
  status: RequestStatus;
  message: string;
  matchScore: number;
  requestedAt: string;
  isHighMatch?: boolean;
  requesterType: "investor" | "cofounder" | "mentor";
}

export interface Match {
  id: string;
  userId: string;
  targetId: string;
  target: Pick<User, "id" | "name" | "initials" | "avatar" | "title" | "company">;
  matchScore: number;
  aiAnalysis: string;
  status: "new" | "pending" | "matched" | "declined";
  matchType: "investor" | "opportunity" | "cofounder";
  createdAt: string;
}

export interface FeedPost {
  id: string;
  authorId: string;
  author: Pick<User, "id" | "name" | "initials" | "avatar" | "title">;
  content: string;
  postType: "idea" | "funding" | "cofounder" | "mentor" | "insight" | "update";
  tags: string[];
  likes: number;
  comments: number;
  createdAt: string;
  isLiked?: boolean;
}

export interface DashboardStats {
  activeListings: number;
  accessRequests: number;
  investorReadinessScore: number;
  newListingsThisMonth: number;
  pendingRequests: number;
}

// ===========================
// Ads System Types
// ===========================

export interface AdsPackage {
  id: string;
  name: string;
  price: number;           // Harga dalam Rupiah
  durationDays: number;    // Durasi iklan aktif
  label?: string;          // Misal "Terlaris"
  features: string[];
}

export interface AdsRequest {
  id: string;
  userId: string;
  userName: string;
  userInitials: string;
  listingId: string;
  listingTitle: string;
  listingType: "idea" | "capex"; // kategori listing
  packageId: string;
  packageName: string;
  amount: number;           // Harga Rupiah
  durationDays: number;
  status: "waiting" | "active" | "expired" | "rejected";
  paymentProofNote?: string;
  requestedAt: string;
  activatedAt?: string;
  expiresAt?: string;
}

// ===========================
// Capex Listing Types
// ===========================

export type CapexType = "sell" | "rent" | "invest";
export type PropertyType = "land" | "building" | "ruko" | "warehouse" | "office" | "mixed";

export interface CapexListing {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  ownerId: string;
  owner: Pick<User, "id" | "name" | "initials">;
  propertyType: PropertyType;
  capexType: CapexType;
  price: number;             // Harga jual / sewa per bulan / investasi
  location: string;
  area: number;              // Luas dalam m2
  sector?: string[];         // Sektor bisnis yang cocok
  verificationStatus: VerificationStatus;
  images?: string[];
  facilities?: string[];
  createdAt: string;
  isAds?: boolean;
  adsExpiresAt?: string;
}

// ===========================
// Inbound Offer Types (Feed Reach Out)
// ===========================

export interface InboundOffer {
  id: string;
  senderId: string;
  senderName: string;
  senderInitials: string;
  senderRole: string;
  senderAvatarColor?: string;
  targetUserId: string; // Target Investor ID
  targetUserName: string;
  relatedPostId?: string;
  relatedPostSnippet?: string;
  offerType: "capex" | "idea" | "collaboration" | "general";
  title: string;
  message: string;
  contactEmail?: string;
  contactPhone?: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}
