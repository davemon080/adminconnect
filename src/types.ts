export type AdminTab = 'overview' | 'users' | 'partners' | 'jobs' | 'market' | 'feed' | 'wallet';

export type AdminUserRole = 'freelancer' | 'client' | 'admin';

export interface AdminUserProfile {
  uid: string;
  publicId?: string;
  email: string;
  displayName: string;
  photoURL: string;
  coverPhotoURL?: string;
  role: AdminUserRole;
  bio?: string;
  phoneNumber?: string;
  status?: string;
  location?: string;
  skills: string[];
  education?: {
    university?: string;
    degree?: string;
    year?: string;
    verified?: boolean;
  };
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
  companyInfo?: {
    name?: string;
    about?: string;
  };
  createdAt?: string;
}

export interface AdminPartnerRequest {
  id: string;
  userUid: string;
  companyName: string;
  companyLogoUrl: string;
  websiteUrl?: string;
  socialLinks: string[];
  about: string;
  location: string;
  registrationUrls: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface AdminJob {
  id: string;
  clientUid: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  isRemote: boolean;
  status: 'open' | 'closed';
  createdAt: string;
}

export interface AdminMarketItem {
  id: string;
  sellerUid: string;
  title: string;
  category: string;
  price: number;
  priceCurrency: string;
  stockQuantity: number;
  isAnonymous: boolean;
  createdAt: string;
}

export interface AdminPost {
  id: string;
  authorUid: string;
  authorName: string;
  content: string;
  type: 'social' | 'job';
  createdAt: string;
}

export interface AdminComment {
  id: string;
  postId: string;
  userUid: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface AdminWalletTransaction {
  id: string;
  userUid: string;
  currency: 'USD' | 'NGN' | 'EUR';
  type: 'topup' | 'withdraw';
  method: 'card' | 'transfer';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
  createdAt: string;
}

export interface AdminWallet {
  id: string;
  userUid: string;
  usdBalance: number;
  ngnBalance: number;
  eurBalance: number;
  updatedAt: string;
}

export interface AdminMarketSettings {
  userUid: string;
  phoneNumber?: string;
  location?: string;
  brandName?: string;
  baseIsRegistered: boolean;
  isRegistered: boolean;
  registeredAt?: string;
  accessOverride: 'inherit' | 'force_unlock' | 'force_lock';
  accessSource: 'payment' | 'admin_override_unlock' | 'admin_override_lock' | 'unregistered';
  adminOverrideUpdatedAt?: string;
  showPhoneNumber: boolean;
  showLocation: boolean;
  showBrandName: boolean;
}

export interface AdminCompanyFollowSummary {
  id: string;
  direction: 'followers' | 'following';
  companyUid: string;
  companyName: string;
  createdAt: string;
}

export interface AdminSellerRatingSummary {
  id: string;
  sellerUid: string;
  sellerName: string;
  userUid: string;
  userName: string;
  rating: number;
  createdAt: string;
}

export interface AdminMessageSummary {
  id: string;
  direction: 'sent' | 'received';
  counterpartyUid: string;
  counterpartyName: string;
  content: string;
  createdAt: string;
}

export interface AdminFriendRequestSummary {
  id: string;
  direction: 'incoming' | 'outgoing';
  status: 'pending' | 'accepted' | 'rejected';
  otherUid: string;
  otherName: string;
  createdAt: string;
}

export interface AdminConnectionSummary {
  id: string;
  otherUid: string;
  otherName: string;
  createdAt: string;
}

export interface AdminProposal {
  id: string;
  freelancerUid: string;
  jobId: string;
  content: string;
  budget: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface AdminUserMetrics {
  posts: number;
  comments: number;
  jobs: number;
  marketItems: number;
  proposals: number;
  walletTransactions: number;
  messages: number;
  connections: number;
  pendingRequests: number;
  companyFollows: number;
  sellerRatings: number;
}

export interface AdminUserCommandCenter {
  profile: AdminUserProfile;
  wallet: AdminWallet | null;
  hasTransactionPin: boolean;
  marketSettings: AdminMarketSettings;
  partnerRequest: AdminPartnerRequest | null;
  metrics: AdminUserMetrics;
  posts: AdminPost[];
  comments: AdminComment[];
  jobs: AdminJob[];
  proposals: AdminProposal[];
  marketItems: AdminMarketItem[];
  walletTransactions: AdminWalletTransaction[];
  messages: AdminMessageSummary[];
  friendRequests: AdminFriendRequestSummary[];
  connections: AdminConnectionSummary[];
  companyFollows: AdminCompanyFollowSummary[];
  sellerRatings: AdminSellerRatingSummary[];
}

export interface AdminOverview {
  totalUsers: number;
  totalAdmins: number;
  pendingPartners: number;
  openJobs: number;
  marketItems: number;
  posts: number;
  comments: number;
  walletTransactions: number;
  marketSellerRatings: number;
  companyFollows: number;
  transactionPins: number;
}

export interface AdminSnapshot {
  overview: AdminOverview;
  users: AdminUserProfile[];
  partnerRequests: AdminPartnerRequest[];
  jobs: AdminJob[];
  marketItems: AdminMarketItem[];
  posts: AdminPost[];
  comments: AdminComment[];
  walletTransactions: AdminWalletTransaction[];
}
