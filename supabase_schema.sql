-- ============================================================
-- YM BRANDS - Supabase Database Schema
-- Run this script in your Supabase Dashboard -> SQL Editor
-- ============================================================

-- ==========================================
-- 1. Create the 'orders' table (Orders & Transactions)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL DEFAULT 'standard',
    status TEXT NOT NULL DEFAULT 'pending',
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    customer JSONB NOT NULL,
    items JSONB NOT NULL,
    total NUMERIC,
    deposit_amount NUMERIC,
    remaining_balance NUMERIC,
    payment_method TEXT DEFAULT 'cod',
    receipt_image_base64 TEXT,
    special_request_details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to orders"
ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public select on orders"
ON public.orders FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public update on orders"
ON public.orders FOR UPDATE TO anon, authenticated USING (true);

CREATE POLICY "Allow public delete on orders"
ON public.orders FOR DELETE TO anon, authenticated USING (true);

-- Enable Realtime on the 'orders' table
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- ==========================================
-- 2. Create the 'products' table (Cloud-Synced Catalog)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.products (
    id BIGINT PRIMARY KEY,
    slug TEXT NOT NULL,
    brand TEXT NOT NULL,
    name JSONB NOT NULL,
    category TEXT NOT NULL,
    sub_category TEXT,
    gender TEXT DEFAULT 'Unisex',
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    image TEXT NOT NULL,
    images JSONB,
    sizes JSONB,
    colors JSONB,
    accent TEXT DEFAULT '#111111',
    description JSONB,
    details JSONB,
    is_new BOOLEAN DEFAULT true,
    is_best_seller BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_by_order BOOLEAN DEFAULT false,
    rating NUMERIC DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    in_stock BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read products"
ON public.products FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public write products"
ON public.products FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public update products"
ON public.products FOR UPDATE TO anon, authenticated USING (true);

CREATE POLICY "Allow public delete products"
ON public.products FOR DELETE TO anon, authenticated USING (true);

-- Enable Realtime on 'products' table
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
