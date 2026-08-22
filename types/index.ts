// ===========================
// VentureBridge Core Types
// ===========================

export type UserRole = "founder" | "investor" | "cofounder" | "mentor" | "asset_owner";

export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";

export type BusinessStage = "ideation" | "pre_seed" | "seed" | "early_stage" | "series_a" | "series_b";

export type AccessStatus = "pending" | "approved" | "rejected";

export type RequestStatus = "pending" | "approved" | "rejected";

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
