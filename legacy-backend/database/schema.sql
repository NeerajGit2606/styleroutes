-- Cubwear core schema (Postgres)
-- Covers: users, categories, brands, products, cart_items, orders
-- Everything else (addresses, coupons, reviews, wishlist, OTP/password-reset,
-- Google OAuth) is still on the parked Mongoose models under backend/models —
-- not part of this phase.

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT true,
    is_admin BOOLEAN NOT NULL DEFAULT false,
    is_guest BOOLEAN NOT NULL DEFAULT false,
    wallet_balance NUMERIC(10,2) NOT NULL DEFAULT 0,
    loyalty_points INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS brands (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    discount_percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
    category_id BIGINT NOT NULL REFERENCES categories(id),
    brand_id BIGINT NOT NULL REFERENCES brands(id),
    stock_quantity INTEGER NOT NULL,
    thumbnail TEXT NOT NULL,
    images TEXT[] NOT NULL DEFAULT '{}',
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    variants JSONB NOT NULL DEFAULT '[]',          -- [{size, color, colorHex, stock}]
    available_sizes TEXT[] NOT NULL DEFAULT '{}',
    available_colors JSONB NOT NULL DEFAULT '[]',  -- [{label, hex}]
    average_rating NUMERIC(2,1) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_is_deleted ON products(is_deleted);

CREATE TABLE IF NOT EXISTS cart_items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    reminder_sent BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);

CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    item JSONB NOT NULL,        -- snapshot of purchased line items
    address JSONB NOT NULL,     -- shipping address snapshot
    status VARCHAR(30) NOT NULL DEFAULT 'Pending'
        CHECK (status IN ('Pending','Dispatched','Out for delivery','Delivered','Cancelled')),
    payment_mode VARCHAR(10) NOT NULL
        CHECK (payment_mode IN ('COD','UPI','CARD')),
    payment_status VARCHAR(10) NOT NULL DEFAULT 'unpaid'
        CHECK (payment_status IN ('unpaid','paid','failed')),
    payment_intent_id VARCHAR(255),
    total NUMERIC(10,2) NOT NULL,
    coupon_code VARCHAR(50),
    discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    wallet_amount_used NUMERIC(10,2) NOT NULL DEFAULT 0,
    loyalty_points_earned INTEGER NOT NULL DEFAULT 0,
    status_history JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
