import pool from '../db/db.js';

export const getLinkById = async (id) => {
    const query = 'SELECT id, destination_url, slug, click_count, created_at FROM links WHERE id = $1';
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export const getLinksByUserId = async (userId) => {
    const query = 'SELECT id, destination_url, slug, click_count, created_at FROM links WHERE user_id = $1';
    const values = [userId];
    const result = await pool.query(query, values);
    return result.rows;
}

export const createLink = async (userId, destinationUrl, slug) => {
    const query = 'INSERT INTO links (user_id, destination_url, slug) VALUES ($1, $2, $3) RETURNING id, destination_url, slug, click_count, created_at';
    const values = [userId, destinationUrl.trim(), slug.trim()];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export const updateLink = async (id, user_id, destinationUrl, slug) => {
    const query = 'UPDATE links SET destination_url = $1, slug = $2 WHERE id = $3 AND user_id = $4 RETURNING id, destination_url, slug, click_count, created_at';
    const values = [destinationUrl.trim(), slug.trim(), id, user_id];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export const deleteLink = async (id, user_id) => {
    const query = 'DELETE FROM links WHERE id = $1 AND user_id = $2 RETURNING id';
    const values = [id, user_id];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export const incrementClickCount = async (id) => {
    const query = 'UPDATE links SET click_count = click_count + 1 WHERE id = $1 RETURNING id, destination_url, slug, click_count, created_at';
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0];
}