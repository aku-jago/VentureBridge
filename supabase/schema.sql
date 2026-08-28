-- ==============================================================================
-- WEAVEN / VENTUREBRIDGE SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- Jalankan skrip ini di SQL Editor pada Dashboard Supabase Anda (supabase.com)
-- ==============================================================================

-- 1. Profiles / Users Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT NOT NULL,
  initials TEXT,
  title TEXT,
  role TEXT DEFAULT 'founder',
  roles TEXT[] DEFAULT ARRAY['founder'],
  company TEXT,
  location TEXT,
  bio TEXT,
  avatar_color TEXT DEFAULT '#2563eb',
  is_verified BOOLEAN DEFAULT FALSE,
  profile_completion INTEGER DEFAULT 80,
  token_balance INTEGER DEFAULT 0,
  founder_token_balance INTEGER DEFAULT 0,
  unlocked_opportunities TEXT[] DEFAULT ARRAY[]::TEXT[],
  password TEXT, -- For simple demo auth sync
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Business Listings Table
CREATE TABLE IF NOT EXISTS public.listings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  author_name TEXT,
  title TEXT NOT NULL,
  company_name TEXT,
  category TEXT DEFAULT 'Teknologi',
  stage TEXT DEFAULT 'Seed',
  target_amount NUMERIC DEFAULT 0,
  valuation NUMERIC DEFAULT 0,
  location TEXT DEFAULT 'Indonesia',
  description TEXT,
  traction TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active',
  views_count INTEGER DEFAULT 0,
  requests_count INTEGER DEFAULT 0,
  avg_match INTEGER DEFAULT 85,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Access Requests Table
CREATE TABLE IF NOT EXISTS public.access_requests (
  id TEXT PRIMARY KEY,
  listing_id TEXT,
  listing_title TEXT,
  founder_id TEXT NOT NULL,
  investor_id TEXT NOT NULL,
  investor_name TEXT NOT NULL,
  investor_initials TEXT,
  investor_role TEXT DEFAULT 'investor',
  investor_avatar_color TEXT DEFAULT '#2563eb',
  message TEXT,
  match_score INTEGER DEFAULT 90,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Chat Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  receiver_name TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  is_delivered BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Top Up Requests Table
CREATE TABLE IF NOT EXISTS public.topup_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_initials TEXT,
  package_id TEXT NOT NULL,
  package_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  tokens INTEGER NOT NULL,
  status TEXT DEFAULT 'waiting', -- waiting, confirmed, rejected
  payment_proof_note TEXT,
  requested_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  confirmed_at TIMESTAMPTZ
);

-- 6. Withdraw Requests Table
CREATE TABLE IF NOT EXISTS public.withdraw_requests (
  id TEXT PRIMARY KEY,
  founder_id TEXT NOT NULL,
  founder_name TEXT NOT NULL,
  founder_initials TEXT,
  tokens INTEGER NOT NULL,
  estimated_rupiah NUMERIC NOT NULL,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, processed, rejected
  requested_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  processed_at TIMESTAMPTZ
);

-- 7. Token Transactions History
CREATE TABLE IF NOT EXISTS public.token_transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL, -- topup, unlock, receive, withdraw, withdraw_pending
  amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  related_opportunity_id TEXT,
  related_opportunity_title TEXT,
  related_user_id TEXT,
  related_user_name TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Inbound Offers Table
CREATE TABLE IF NOT EXISTS public.inbound_offers (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_initials TEXT,
  sender_role TEXT,
  sender_avatar_color TEXT,
  target_user_id TEXT NOT NULL,
  target_user_name TEXT NOT NULL,
  related_post_id TEXT,
  related_post_snippet TEXT,
  offer_type TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  status TEXT DEFAULT 'pending', -- pending, accepted, declined
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ENABLE REALTIME ON KEY TABLES
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.topup_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.access_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.listings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inbound_offers;

-- ==============================================================================
-- DISABLE RLS FOR DEMO PROTOTYPE ACCESS (Or Set Open Policies)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public all access on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public all access on listings" ON public.listings FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public all access on access_requests" ON public.access_requests FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public all access on messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.topup_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public all access on topup_requests" ON public.topup_requests FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.withdraw_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public all access on withdraw_requests" ON public.withdraw_requests FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.token_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public all access on token_transactions" ON public.token_transactions FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.inbound_offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public all access on inbound_offers" ON public.inbound_offers FOR ALL USING (true) WITH CHECK (true);

-- SEED INITIAL ADMIN AND DEFAULT USERS IF EMPTY
INSERT INTO public.profiles (id, email, name, initials, title, role, roles, location, avatar_color, is_verified, profile_completion, token_balance, founder_token_balance, password)
VALUES 
  ('admin-1', 'admin@weaven.id', 'Admin Weaven', 'AW', 'Super Administrator', 'admin', ARRAY['admin'], 'Jakarta, Indonesia', '#7c3aed', true, 100, 9999, 9999, 'admin123'),
  ('user-1', 'founder@weaven.id', 'Dzakki Naufal', 'DN', 'Founder EDUKITA', 'founder', ARRAY['founder', 'cofounder'], 'Yogyakarta, Indonesia', '#2563eb', true, 85, 40, 20, 'founder123'),
  ('user-3', 'investor@weaven.id', 'Andi Wijaya', 'AW', 'Angel Investor & Venture Partner', 'investor', ARRAY['investor', 'capex_provider'], 'Jakarta, Indonesia', '#059669', true, 92, 120, 0, 'investor123')
ON CONFLICT (id) DO NOTHING;
