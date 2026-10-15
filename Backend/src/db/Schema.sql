CREATE TABLE users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_username_unique UNIQUE (username),
    CONSTRAINT users_email_unique UNIQUE (email),
    CONSTRAINT users_username_format CHECK (
        char_length(username) >= 3
        AND username ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    ),
    CONSTRAINT users_email_lowercase CHECK (email = lower(email))
);

CREATE TABLE links (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    slug VARCHAR(30) NOT NULL,
    destination_url TEXT NOT NULL,
    click_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT links_user_slug_unique UNIQUE (user_id, slug),
    CONSTRAINT links_slug_format CHECK (
        char_length(slug) >= 3
        AND slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    ),
    CONSTRAINT links_destination_url_format CHECK (
        char_length(destination_url) <= 2048
        AND destination_url ~* '^https?://[^[:space:]]+$'
    ),
    CONSTRAINT links_click_count_nonnegative CHECK (click_count >= 0)
);

CREATE TABLE blocked_names (
    name VARCHAR(30) PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT blocked_names_lowercase CHECK (name = lower(name))
);