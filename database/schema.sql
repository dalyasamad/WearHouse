-- WearHouse database schema: tables, relationships, and database constraints.

-- ============================================================
-- WearHouse Database Schema
-- CSIS 279 - Advances in Computer Science
-- PostgreSQL
-- ============================================================


-- ============================================================
-- USERS
-- ============================================================

-- Defines the users table and its columns.
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,

    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,

    profile_picture VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- CATEGORIES
-- ============================================================

-- Defines the categories table and its columns.
CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE
);


-- Default WearHouse clothing categories

INSERT INTO categories (name)
VALUES
    ('Tops'),
    ('Shirts'),
    ('Jeans'),
    ('Trousers'),
    ('Shorts'),
    ('Skirts'),
    ('Dresses'),
    ('Jackets'),
    ('Shoes'),
    ('Bags')
ON CONFLICT (name) DO NOTHING;


-- ============================================================
-- CLOTHING ITEMS
-- ============================================================

-- Defines the clothing_items table and its columns.
CREATE TABLE IF NOT EXISTS clothing_items (
    item_id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    name VARCHAR(150) NOT NULL,

    image_url VARCHAR(500),

    color VARCHAR(100),
    size VARCHAR(50),
    season VARCHAR(50),

    is_favorite BOOLEAN DEFAULT FALSE,

    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_clothing_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_clothing_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE RESTRICT
);


-- ============================================================
-- OUTFITS
-- ============================================================

-- Defines the outfits table and its columns.
CREATE TABLE IF NOT EXISTS outfits (
    outfit_id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    name VARCHAR(150) NOT NULL,

    notes TEXT,

    is_favorite BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_outfit_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);


-- ============================================================
-- OUTFIT ITEMS
-- Junction table:
-- Many clothing items can belong to an outfit.
-- ============================================================

-- Defines the outfit_items table and its columns.
CREATE TABLE IF NOT EXISTS outfit_items (
    outfit_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,

    PRIMARY KEY (
        outfit_id,
        item_id
    ),

    CONSTRAINT fk_outfit_items_outfit
        FOREIGN KEY (outfit_id)
        REFERENCES outfits(outfit_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_outfit_items_clothing
        FOREIGN KEY (item_id)
        REFERENCES clothing_items(item_id)
        ON DELETE CASCADE
);


-- ============================================================
-- OUTFIT SCHEDULE
-- One planned outfit per user per date.
-- ============================================================

-- Defines the outfit_schedule table and its columns.
CREATE TABLE IF NOT EXISTS outfit_schedule (
    schedule_id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,
    outfit_id INTEGER NOT NULL,

    scheduled_date DATE NOT NULL,

    CONSTRAINT fk_schedule_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_schedule_outfit
        FOREIGN KEY (outfit_id)
        REFERENCES outfits(outfit_id)
        ON DELETE CASCADE,

    CONSTRAINT unique_user_schedule_date
        UNIQUE (
            user_id,
            scheduled_date
        )
);


-- ============================================================
-- WEAR HISTORY
-- Stores every time the user marks an outfit as worn.
-- ============================================================

-- Defines the wear_history table and its columns.
CREATE TABLE IF NOT EXISTS wear_history (
    history_id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,
    outfit_id INTEGER NOT NULL,

    worn_date DATE NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT fk_history_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_history_outfit
        FOREIGN KEY (outfit_id)
        REFERENCES outfits(outfit_id)
        ON DELETE CASCADE
);


-- ============================================================
-- INDEXES
-- Improve lookups for data belonging to individual users.
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_clothing_user
ON clothing_items(user_id);

CREATE INDEX IF NOT EXISTS idx_clothing_category
ON clothing_items(category_id);

CREATE INDEX IF NOT EXISTS idx_outfits_user
ON outfits(user_id);

CREATE INDEX IF NOT EXISTS idx_outfit_items_outfit
ON outfit_items(outfit_id);

CREATE INDEX IF NOT EXISTS idx_outfit_items_item
ON outfit_items(item_id);

CREATE INDEX IF NOT EXISTS idx_schedule_user
ON outfit_schedule(user_id);

CREATE INDEX IF NOT EXISTS idx_schedule_date
ON outfit_schedule(scheduled_date);

CREATE INDEX IF NOT EXISTS idx_history_user
ON wear_history(user_id);

CREATE INDEX IF NOT EXISTS idx_history_date
ON wear_history(worn_date);