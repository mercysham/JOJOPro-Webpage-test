-- JOJOPro Database Schema
-- Run this in Supabase SQL Editor

-- 1. 用戶資料表 (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  user_type TEXT CHECK (user_type IN ('renter', 'owner', 'both')) DEFAULT 'renter',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. 鋪位資料表
CREATE TABLE IF NOT EXISTS public.properties (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  price_unit TEXT DEFAULT 'per_month',
  area TEXT,
  district TEXT NOT NULL,
  address TEXT,
  property_type TEXT NOT NULL CHECK (property_type IN ('popup', 'market', 'fixed', 'shared', 'other')),
  size_sqft INTEGER,
  images JSONB DEFAULT '[]'::jsonb,
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  amenities JSONB DEFAULT '[]'::jsonb,
  available_from DATE,
  available_to DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'rented', 'inactive', 'draft'))
);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- 3. 預約查詢表
CREATE TABLE IF NOT EXISTS public.bookings (
  id BIGSERIAL PRIMARY KEY,
  property_id BIGINT REFERENCES public.properties(id) ON DELETE CASCADE,
  renter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT,
  preferred_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 4. 地區分類表
CREATE TABLE IF NOT EXISTS public.districts (
  id SERIAL PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  region TEXT NOT NULL CHECK (region IN ('hk', 'kowloon', 'nt')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====== Row Level Security Policies ======

-- Profiles: 用戶可以睇/改自己嘅 profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Properties: 公開可睇 active listings，業主可管理自己嘅
CREATE POLICY "Anyone can view active properties"
  ON public.properties FOR SELECT
  USING (status = 'active' OR owner_id = auth.uid());

CREATE POLICY "Owners can insert properties"
  ON public.properties FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update own properties"
  ON public.properties FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Owners can delete own properties"
  ON public.properties FOR DELETE
  USING (owner_id = auth.uid());

-- Bookings: 租客睇自己 booking，業主睇自己鋪位嘅 booking
CREATE POLICY "Users can view own bookings"
  ON public.bookings FOR SELECT
  USING (
    renter_id = auth.uid() OR 
    property_id IN (SELECT id FROM public.properties WHERE owner_id = auth.uid())
  );

CREATE POLICY "Renters can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (renter_id = auth.uid());

CREATE POLICY "Owner can update booking status"
  ON public.bookings FOR UPDATE
  USING (
    property_id IN (SELECT id FROM public.properties WHERE owner_id = auth.uid())
  );

-- ====== Seed Data: 香港地區分類 ======
INSERT INTO public.districts (name_en, name_zh, region) VALUES
  ('Central & Western', '中西區', 'hk'),
  ('Wan Chai', '灣仔區', 'hk'),
  ('Eastern', '東區', 'hk'),
  ('Southern', '南區', 'hk'),
  ('Yau Tsim Mong', '油尖旺區', 'kowloon'),
  ('Sham Shui Po', '深水埗區', 'kowloon'),
  ('Kowloon City', '九龍城區', 'kowloon'),
  ('Wong Tai Sin', '黃大仙區', 'kowloon'),
  ('Kwun Tong', '觀塘區', 'kowloon'),
  ('Kwai Tsing', '葵青區', 'nt'),
  ('Tsuen Wan', '荃灣區', 'nt'),
  ('Tuen Mun', '屯門區', 'nt'),
  ('Yuen Long', '元朗區', 'nt'),
  ('North', '北區', 'nt'),
  ('Tai Po', '大埔區', 'nt'),
  ('Sha Tin', '沙田區', 'nt'),
  ('Sai Kung', '西貢區', 'nt'),
  ('Islands', '離島區', 'nt')
ON CONFLICT DO NOTHING;
