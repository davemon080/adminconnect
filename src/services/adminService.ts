import { supabase } from '../supabase';
import {
  AdminComment,
  AdminJob,
  AdminMarketItem,
  AdminMarketSettings,
  AdminMessageSummary,
  AdminPartnerRequest,
  AdminPost,
  AdminProposal,
  AdminSnapshot,
  AdminTab,
  AdminUserCommandCenter,
  AdminUserMetrics,
  AdminUserProfile,
  AdminUserRole,
  AdminWallet,
  AdminWalletTransaction,
  AdminConnectionSummary,
  AdminFriendRequestSummary,
} from '../types';

type DbAdminUserProfile = {
  uid: string;
  public_id?: string | null;
  email: string;
  display_name: string;
  photo_url: string;
  cover_photo_url?: string | null;
  role: AdminUserRole;
  bio?: string | null;
  phone_number?: string | null;
  status?: string | null;
  location?: string | null;
  skills?: string[] | null;
  education?: AdminUserProfile['education'] | null;
  social_links?: AdminUserProfile['socialLinks'] | null;
  company_info?: AdminUserProfile['companyInfo'] | null;
  created_at?: string | null;
};

type DbAdminPartnerRequest = {
  id: string;
  user_uid: string;
  company_name: string;
  company_logo_url: string;
  website_url?: string | null;
  social_links?: string[] | null;
  about: string;
  location: string;
  registration_urls?: string[] | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

type DbAdminJob = {
  id: string;
  client_uid: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  is_remote: boolean;
  status: 'open' | 'closed';
  created_at: string;
};

type DbAdminMarketItem = {
  id: string;
  seller_uid: string;
  title: string;
  category: string;
  price: number;
  price_currency?: string | null;
  stock_quantity: number;
  is_anonymous: boolean;
  created_at: string;
};

type DbAdminPost = {
  id: string;
  author_uid: string;
  author_name: string;
  content: string;
  type: 'social' | 'job';
  created_at: string;
};

type DbAdminComment = {
  id: string;
  post_id: string;
  user_uid: string;
  author_name: string;
  content: string;
  created_at: string;
};

type DbAdminWalletTransaction = {
  id: string;
  user_uid: string;
  currency: 'USD' | 'NGN' | 'EUR';
  type: 'topup' | 'withdraw';
  method: 'card' | 'transfer';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  reference?: string | null;
  created_at: string;
};

type DbAdminWallet = {
  id: string;
  user_uid: string;
  usd_balance: number;
  ngn_balance: number;
  eur_balance: number;
  updated_at: string;
};

type DbAdminMarketSettings = {
  user_uid: string;
  phone_number?: string | null;
  location?: string | null;
  brand_name?: string | null;
  is_registered?: boolean | null;
  registered_at?: string | null;
  admin_access_override?: 'inherit' | 'force_unlock' | 'force_lock' | null;
  admin_override_updated_at?: string | null;
  show_phone_number?: boolean | null;
  show_location?: boolean | null;
  show_brand_name?: boolean | null;
};

type DbAdminProposal = {
  id: string;
  freelancer_uid: string;
  job_id: string;
  content: string;
  budget: number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
};

type DbAdminMessage = {
  id: string;
  sender_uid: string;
  receiver_uid: string;
  content?: string | null;
  created_at: string;
};

type DbAdminFriendRequest = {
  id: string;
  from_uid: string;
  from_name: string;
  to_uid: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
};

type DbAdminConnection = {
  id: string;
  uids: string[];
  created_at: string;
};

function mapUser(row: DbAdminUserProfile): AdminUserProfile {
  return {
    uid: row.uid,
    publicId: row.public_id || undefined,
    email: row.email,
    displayName: row.display_name,
    photoURL: row.photo_url,
    coverPhotoURL: row.cover_photo_url || undefined,
    role: row.role,
    bio: row.bio || undefined,
    phoneNumber: row.phone_number || undefined,
    status: row.status || undefined,
    location: row.location || undefined,
    skills: row.skills || [],
    education: row.education || undefined,
    socialLinks: row.social_links || undefined,
    companyInfo: row.company_info || undefined,
    createdAt: row.created_at || undefined,
  };
}

function mapPartnerRequest(row: DbAdminPartnerRequest): AdminPartnerRequest {
  return {
    id: row.id,
    userUid: row.user_uid,
    companyName: row.company_name,
    companyLogoUrl: row.company_logo_url,
    websiteUrl: row.website_url || undefined,
    socialLinks: row.social_links || [],
    about: row.about,
    location: row.location,
    registrationUrls: row.registration_urls || [],
    status: row.status,
    createdAt: row.created_at,
  };
}

function mapJob(row: DbAdminJob): AdminJob {
  return {
    id: row.id,
    clientUid: row.client_uid,
    title: row.title,
    description: row.description,
    category: row.category,
    budget: row.budget,
    isRemote: row.is_remote,
    status: row.status,
    createdAt: row.created_at,
  };
}

function mapMarketItem(row: DbAdminMarketItem): AdminMarketItem {
  return {
    id: row.id,
    sellerUid: row.seller_uid,
    title: row.title,
    category: row.category,
    price: row.price,
    priceCurrency: row.price_currency || 'USD',
    stockQuantity: row.stock_quantity,
    isAnonymous: row.is_anonymous,
    createdAt: row.created_at,
  };
}

function mapPost(row: DbAdminPost): AdminPost {
  return {
    id: row.id,
    authorUid: row.author_uid,
    authorName: row.author_name,
    content: row.content,
    type: row.type,
    createdAt: row.created_at,
  };
}

function mapComment(row: DbAdminComment): AdminComment {
  return {
    id: row.id,
    postId: row.post_id,
    userUid: row.user_uid,
    authorName: row.author_name,
    content: row.content,
    createdAt: row.created_at,
  };
}

function mapWalletTransaction(row: DbAdminWalletTransaction): AdminWalletTransaction {
  return {
    id: row.id,
    userUid: row.user_uid,
    currency: row.currency,
    type: row.type,
    method: row.method,
    amount: row.amount,
    status: row.status,
    reference: row.reference || undefined,
    createdAt: row.created_at,
  };
}

function mapWallet(row: DbAdminWallet): AdminWallet {
  return {
    id: row.id,
    userUid: row.user_uid,
    usdBalance: row.usd_balance,
    ngnBalance: row.ngn_balance,
    eurBalance: row.eur_balance,
    updatedAt: row.updated_at,
  };
}

function mapMarketSettings(row: DbAdminMarketSettings | null, uid: string): AdminMarketSettings {
  const accessOverride = row?.admin_access_override || 'inherit';
  const isRegistered =
    accessOverride === 'force_unlock' ? true : accessOverride === 'force_lock' ? false : !!row?.is_registered;
  const accessSource =
    accessOverride === 'force_unlock'
      ? 'admin_override_unlock'
      : accessOverride === 'force_lock'
      ? 'admin_override_lock'
      : row?.is_registered
      ? 'payment'
      : 'unregistered';
  return {
    userUid: uid,
    phoneNumber: row?.phone_number || undefined,
    location: row?.location || undefined,
    brandName: row?.brand_name || undefined,
    isRegistered,
    registeredAt: row?.registered_at || undefined,
    accessOverride,
    accessSource,
    adminOverrideUpdatedAt: row?.admin_override_updated_at || undefined,
    showPhoneNumber: row?.show_phone_number ?? false,
    showLocation: row?.show_location ?? false,
    showBrandName: row?.show_brand_name ?? true,
  };
}

function mapProposal(row: DbAdminProposal): AdminProposal {
  return {
    id: row.id,
    freelancerUid: row.freelancer_uid,
    jobId: row.job_id,
    content: row.content,
    budget: row.budget,
    status: row.status,
    createdAt: row.created_at,
  };
}

async function runQuery<T>(promise: any, context: string): Promise<T> {
  const { data, error } = await promise;
  if (error) {
    throw new Error(error.message || `Failed to ${context}.`);
  }
  return data;
}

async function getCount(table: string, filter?: (query: any) => any): Promise<number> {
  const base = supabase.from(table).select('*', { count: 'exact', head: true });
  const query = filter ? filter(base) : base;
  const { count, error } = await query;
  if (error) {
    throw new Error(error.message || `Failed to count ${table}.`);
  }
  return count || 0;
}

async function fetchUsersByUids(uids: string[]): Promise<Map<string, AdminUserProfile>> {
  const unique = Array.from(new Set(uids.filter(Boolean)));
  if (unique.length === 0) return new Map();
  const rows = await runQuery<DbAdminUserProfile[]>(
    supabase
      .from('users')
      .select('uid,public_id,email,display_name,photo_url,cover_photo_url,role,bio,phone_number,status,location,skills,education,social_links,company_info,created_at')
      .in('uid', unique),
    'load related users'
  );
  return new Map(rows.map((row) => [row.uid, mapUser(row)]));
}

async function getOrCreateWallet(uid: string): Promise<AdminWallet> {
  const existing = await runQuery<DbAdminWallet | null>(
    supabase.from('wallets').select('*').eq('user_uid', uid).maybeSingle(),
    'load wallet'
  );
  if (existing) return mapWallet(existing);

  const created = await runQuery<DbAdminWallet>(
    supabase
      .from('wallets')
      .upsert(
        {
          user_uid: uid,
          usd_balance: 0,
          ngn_balance: 0,
          eur_balance: 0,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_uid' }
      )
      .select('*')
      .single(),
    'create wallet'
  );
  return mapWallet(created);
}

export const adminService = {
  async signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error(error.message || 'Unable to sign in.');
    }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message || 'Unable to sign out.');
    }
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw new Error(error.message || 'Unable to get session.');
    }
    return data.session;
  },

  async getAdminProfile(uid: string): Promise<AdminUserProfile | null> {
    const row = await runQuery<DbAdminUserProfile | null>(
      supabase
        .from('users')
        .select('uid,public_id,email,display_name,photo_url,cover_photo_url,role,bio,phone_number,status,location,skills,education,social_links,company_info,created_at')
        .eq('uid', uid)
        .maybeSingle(),
      'load admin profile'
    );
    return row ? mapUser(row) : null;
  },

  async getSnapshot(): Promise<AdminSnapshot> {
    const [overviewCounts, users, partnerRequests, jobs, marketItems, posts, comments, walletTransactions] = await Promise.all([
      Promise.all([
        getCount('users'),
        getCount('users', (query) => query.eq('role', 'admin')),
        getCount('company_partner_requests', (query) => query.eq('status', 'pending')),
        getCount('jobs', (query) => query.eq('status', 'open')),
        getCount('market_items'),
        getCount('posts'),
        getCount('post_comments'),
        getCount('wallet_transactions'),
      ]),
      runQuery<DbAdminUserProfile[]>(
        supabase
          .from('users')
          .select('uid,public_id,email,display_name,photo_url,cover_photo_url,role,bio,phone_number,status,location,skills,education,social_links,company_info,created_at')
          .order('created_at', { ascending: false })
          .limit(100),
        'load users'
      ),
      runQuery<DbAdminPartnerRequest[]>(
        supabase.from('company_partner_requests').select('*').order('created_at', { ascending: false }).limit(50),
        'load partner requests'
      ),
      runQuery<DbAdminJob[]>(
        supabase.from('jobs').select('*').order('created_at', { ascending: false }).limit(50),
        'load jobs'
      ),
      runQuery<DbAdminMarketItem[]>(
        supabase
          .from('market_items')
          .select('id,seller_uid,title,category,price,price_currency,stock_quantity,is_anonymous,created_at')
          .order('created_at', { ascending: false })
          .limit(50),
        'load market items'
      ),
      runQuery<DbAdminPost[]>(
        supabase.from('posts').select('id,author_uid,author_name,content,type,created_at').order('created_at', { ascending: false }).limit(50),
        'load posts'
      ),
      runQuery<DbAdminComment[]>(
        supabase.from('post_comments').select('id,post_id,user_uid,author_name,content,created_at').order('created_at', { ascending: false }).limit(50),
        'load comments'
      ),
      runQuery<DbAdminWalletTransaction[]>(
        supabase
          .from('wallet_transactions')
          .select('id,user_uid,currency,type,method,amount,status,reference,created_at')
          .order('created_at', { ascending: false })
          .limit(50),
        'load wallet transactions'
      ),
    ]);

    const [totalUsers, totalAdmins, pendingPartners, openJobs, totalMarketItems, totalPosts, totalComments, totalWalletTransactions] =
      overviewCounts;

    return {
      overview: {
        totalUsers,
        totalAdmins,
        pendingPartners,
        openJobs,
        marketItems: totalMarketItems,
        posts: totalPosts,
        comments: totalComments,
        walletTransactions: totalWalletTransactions,
      },
      users: users.map(mapUser),
      partnerRequests: partnerRequests.map(mapPartnerRequest),
      jobs: jobs.map(mapJob),
      marketItems: marketItems.map(mapMarketItem),
      posts: posts.map(mapPost),
      comments: comments.map(mapComment),
      walletTransactions: walletTransactions.map(mapWalletTransaction),
    };
  },

  async getUserCommandCenter(uid: string): Promise<AdminUserCommandCenter> {
    const [
      profileRow,
      walletRow,
      marketSettingsRow,
      partnerRequestRow,
      postsRows,
      commentsRows,
      jobsRows,
      proposalsRows,
      marketItemRows,
      walletTransactionRows,
      messageRows,
      friendRequestRows,
      connectionRows,
    ] = await Promise.all([
      runQuery<DbAdminUserProfile | null>(
        supabase
          .from('users')
          .select('uid,public_id,email,display_name,photo_url,cover_photo_url,role,bio,phone_number,status,location,skills,education,social_links,company_info,created_at')
          .eq('uid', uid)
          .maybeSingle(),
        'load user profile'
      ),
      runQuery<DbAdminWallet | null>(supabase.from('wallets').select('*').eq('user_uid', uid).maybeSingle(), 'load user wallet'),
      runQuery<DbAdminMarketSettings | null>(
        supabase.from('market_settings').select('*').eq('user_uid', uid).maybeSingle(),
        'load market settings'
      ),
      runQuery<DbAdminPartnerRequest | null>(
        supabase.from('company_partner_requests').select('*').eq('user_uid', uid).maybeSingle(),
        'load partner request'
      ),
      runQuery<DbAdminPost[]>(
        supabase.from('posts').select('id,author_uid,author_name,content,type,created_at').eq('author_uid', uid).order('created_at', { ascending: false }).limit(20),
        'load user posts'
      ),
      runQuery<DbAdminComment[]>(
        supabase.from('post_comments').select('id,post_id,user_uid,author_name,content,created_at').eq('user_uid', uid).order('created_at', { ascending: false }).limit(20),
        'load user comments'
      ),
      runQuery<DbAdminJob[]>(
        supabase.from('jobs').select('*').eq('client_uid', uid).order('created_at', { ascending: false }).limit(20),
        'load user jobs'
      ),
      runQuery<DbAdminProposal[]>(
        supabase.from('proposals').select('*').eq('freelancer_uid', uid).order('created_at', { ascending: false }).limit(20),
        'load user proposals'
      ),
      runQuery<DbAdminMarketItem[]>(
        supabase
          .from('market_items')
          .select('id,seller_uid,title,category,price,price_currency,stock_quantity,is_anonymous,created_at')
          .eq('seller_uid', uid)
          .order('created_at', { ascending: false })
          .limit(20),
        'load user market items'
      ),
      runQuery<DbAdminWalletTransaction[]>(
        supabase
          .from('wallet_transactions')
          .select('id,user_uid,currency,type,method,amount,status,reference,created_at')
          .eq('user_uid', uid)
          .order('created_at', { ascending: false })
          .limit(20),
        'load user wallet transactions'
      ),
      runQuery<DbAdminMessage[]>(
        supabase
          .from('messages')
          .select('id,sender_uid,receiver_uid,content,created_at')
          .or(`sender_uid.eq.${uid},receiver_uid.eq.${uid}`)
          .order('created_at', { ascending: false })
          .limit(20),
        'load user messages'
      ),
      runQuery<DbAdminFriendRequest[]>(
        supabase
          .from('friend_requests')
          .select('id,from_uid,from_name,to_uid,status,created_at')
          .or(`from_uid.eq.${uid},to_uid.eq.${uid}`)
          .order('created_at', { ascending: false })
          .limit(20),
        'load user friend requests'
      ),
      runQuery<DbAdminConnection[]>(
        supabase.from('connections').select('id,uids,created_at').contains('uids', [uid]).order('created_at', { ascending: false }).limit(20),
        'load user connections'
      ),
    ]);

    if (!profileRow) {
      throw new Error('User was not found.');
    }

    const profile = mapUser(profileRow);
    const relatedUserIds = new Set<string>();
    messageRows.forEach((message) => relatedUserIds.add(message.sender_uid === uid ? message.receiver_uid : message.sender_uid));
    friendRequestRows.forEach((request) => relatedUserIds.add(request.from_uid === uid ? request.to_uid : request.from_uid));
    connectionRows.forEach((connection) => connection.uids.filter((item) => item !== uid).forEach((item) => relatedUserIds.add(item)));
    const relatedUsers = await fetchUsersByUids(Array.from(relatedUserIds));

    const messages: AdminMessageSummary[] = messageRows.map((message) => {
      const counterpartyUid = message.sender_uid === uid ? message.receiver_uid : message.sender_uid;
      return {
        id: message.id,
        direction: message.sender_uid === uid ? 'sent' : 'received',
        counterpartyUid,
        counterpartyName: relatedUsers.get(counterpartyUid)?.displayName || 'Unknown user',
        content: message.content?.trim() || 'Attachment or empty message',
        createdAt: message.created_at,
      };
    });

    const friendRequests: AdminFriendRequestSummary[] = friendRequestRows.map((request) => {
      const outgoing = request.from_uid === uid;
      const otherUid = outgoing ? request.to_uid : request.from_uid;
      return {
        id: String(request.id),
        direction: outgoing ? 'outgoing' : 'incoming',
        status: request.status,
        otherUid,
        otherName: relatedUsers.get(otherUid)?.displayName || request.from_name || 'Unknown user',
        createdAt: request.created_at,
      };
    });

    const connections: AdminConnectionSummary[] = connectionRows.map((connection) => {
      const otherUid = connection.uids.find((item) => item !== uid) || uid;
      return {
        id: String(connection.id),
        otherUid,
        otherName: relatedUsers.get(otherUid)?.displayName || 'Unknown user',
        createdAt: connection.created_at,
      };
    });

    const metrics: AdminUserMetrics = {
      posts: postsRows.length,
      comments: commentsRows.length,
      jobs: jobsRows.length,
      marketItems: marketItemRows.length,
      proposals: proposalsRows.length,
      walletTransactions: walletTransactionRows.length,
      messages: messageRows.length,
      connections: connectionRows.length,
      pendingRequests: friendRequestRows.filter((request) => request.status === 'pending').length,
    };

    return {
      profile,
      wallet: walletRow ? mapWallet(walletRow) : null,
      marketSettings: mapMarketSettings(marketSettingsRow, uid),
      partnerRequest: partnerRequestRow ? mapPartnerRequest(partnerRequestRow) : null,
      metrics,
      posts: postsRows.map(mapPost),
      comments: commentsRows.map(mapComment),
      jobs: jobsRows.map(mapJob),
      proposals: proposalsRows.map(mapProposal),
      marketItems: marketItemRows.map(mapMarketItem),
      walletTransactions: walletTransactionRows.map(mapWalletTransaction),
      messages,
      friendRequests,
      connections,
    };
  },

  subscribeToAdminChanges(onChange: () => void) {
    const tables = ['users', 'company_partner_requests', 'jobs', 'market_items', 'posts', 'post_comments', 'wallet_transactions', 'wallets', 'market_settings', 'proposals', 'messages', 'friend_requests', 'connections'];
    const channels = tables.map((table) =>
      supabase.channel(`admin-watch:${table}`).on('postgres_changes', { event: '*', schema: 'public', table }, onChange).subscribe()
    );

    return () => {
      channels.forEach((channel) => {
        void supabase.removeChannel(channel);
      });
    };
  },

  async updatePartnerRequestStatus(id: string, status: 'approved' | 'rejected') {
    await runQuery(supabase.from('company_partner_requests').update({ status }).eq('id', id), 'update partner request');
  },

  async deleteJob(id: string) {
    await runQuery(supabase.from('jobs').delete().eq('id', id), 'delete job');
  },

  async updateJobStatus(id: string, status: 'open' | 'closed') {
    await runQuery(supabase.from('jobs').update({ status }).eq('id', id), 'update job status');
  },

  async deleteMarketItem(id: string) {
    await runQuery(supabase.from('market_items').delete().eq('id', id), 'delete market item');
  },

  async deletePost(id: string) {
    await runQuery(supabase.from('posts').delete().eq('id', id), 'delete post');
  },

  async deleteComment(id: string) {
    await runQuery(supabase.from('post_comments').delete().eq('id', id), 'delete comment');
  },

  async updateUserProfile(
    uid: string,
    updates: {
      displayName: string;
      email: string;
      role: AdminUserRole;
      phoneNumber?: string;
      status?: string;
      location?: string;
      bio?: string;
      skills: string[];
      companyName?: string;
      companyAbout?: string;
    }
  ) {
    await runQuery(
      supabase
        .from('users')
        .update({
          display_name: updates.displayName,
          email: updates.email,
          role: updates.role,
          phone_number: updates.phoneNumber || null,
          status: updates.status || null,
          location: updates.location || null,
          bio: updates.bio || null,
          skills: updates.skills,
          company_info: {
            name: updates.companyName || '',
            about: updates.companyAbout || '',
          },
          updated_at: new Date().toISOString(),
        })
        .eq('uid', uid),
      'update user profile'
    );
  },

  async adjustUserWallet(
    uid: string,
    currency: 'USD' | 'NGN' | 'EUR',
    amount: number,
    note: string
  ) {
    if (!Number.isFinite(amount) || amount === 0) {
      throw new Error('Enter a valid adjustment amount.');
    }

    const wallet = await getOrCreateWallet(uid);
    const next = {
      usdBalance: wallet.usdBalance,
      ngnBalance: wallet.ngnBalance,
      eurBalance: wallet.eurBalance,
    };

    if (currency === 'USD') next.usdBalance += amount;
    if (currency === 'NGN') next.ngnBalance += amount;
    if (currency === 'EUR') next.eurBalance += amount;

    if (next.usdBalance < 0 || next.ngnBalance < 0 || next.eurBalance < 0) {
      throw new Error('This adjustment would make the wallet negative.');
    }

    const timestamp = new Date().toISOString();
    await runQuery(
      supabase
        .from('wallets')
        .update({
          usd_balance: Number(next.usdBalance.toFixed(2)),
          ngn_balance: Number(next.ngnBalance.toFixed(2)),
          eur_balance: Number(next.eurBalance.toFixed(2)),
          updated_at: timestamp,
        })
        .eq('user_uid', uid),
      'adjust wallet'
    );

    await runQuery(
      supabase.from('wallet_transactions').insert({
        user_uid: uid,
        currency,
        type: amount > 0 ? 'topup' : 'withdraw',
        method: 'transfer',
        amount: Math.abs(Number(amount.toFixed(2))),
        status: 'completed',
        reference: `Admin adjustment: ${note || 'Manual update'}`,
        created_at: timestamp,
      }),
      'record wallet adjustment'
    );
  },

  async updateMarketplaceAccess(
    uid: string,
    updates: {
      isRegistered: boolean;
      accessOverride: 'inherit' | 'force_unlock' | 'force_lock';
      phoneNumber?: string;
      location?: string;
      brandName?: string;
      showPhoneNumber: boolean;
      showLocation: boolean;
      showBrandName: boolean;
    }
  ) {
    await runQuery(
      supabase
        .from('market_settings')
        .upsert(
          {
            user_uid: uid,
            phone_number: updates.phoneNumber || null,
            location: updates.location || null,
            brand_name: updates.brandName || null,
            is_registered: updates.isRegistered,
            registered_at: updates.isRegistered ? new Date().toISOString() : null,
            admin_access_override: updates.accessOverride,
            admin_override_updated_at: new Date().toISOString(),
            show_phone_number: updates.showPhoneNumber,
            show_location: updates.showLocation,
            show_brand_name: updates.showBrandName,
          },
          { onConflict: 'user_uid' }
        ),
      'update marketplace access'
    );
  },
};
