-- ============================================================================
-- SUPABASE / POSTGRESQL DATABASE SCHEMA FOR CHEF SRINIVAS KITCHEN APP
-- ============================================================================
-- How to run:
-- 1. Log in to your Supabase dashboard (https://supabase.com/dashboard)
-- 2. Open your project
-- 3. In the left navigation bar, click on "SQL Editor"
-- 4. Click "+ New query", paste this entire file, and click "Run"
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Contacts Table (Customer inquiries & messages)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contacts (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 2. Orders Table (Chef bookings & catering orders)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(255),
  dish_name VARCHAR(255) NOT NULL,
  dish_price VARCHAR(100) NOT NULL,
  booking_date VARCHAR(100) NOT NULL,
  number_of_guests INTEGER NOT NULL,
  delivery_address TEXT NOT NULL,
  special_requests TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 3. Users Table (Admin authentication)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 4. Performance Indexes
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- ----------------------------------------------------------------------------
-- 5. Seed Default Admin User
-- Username: admin
-- Password: Praveen@123 (stored as bcrypt hash with 10 salt rounds)
-- ----------------------------------------------------------------------------
INSERT INTO users (username, password_hash, role)
VALUES ('admin', '$2b$10$gkxp.k6nvWBiTcTwauPuKevOdC46IHFVXODe7NCEfEjdtx64Mfiwq', 'admin')
ON CONFLICT (username) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Optional: Enable Row Level Security (RLS) if accessing directly via Supabase client
-- (When your Node.js backend connects via DATABASE_URL postgres user, it bypasses RLS)
-- ----------------------------------------------------------------------------
-- ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
