import pool from '../db/db.js';

export const getLinkById = async (id) => {
    const query = 'SELECT id, destination_url, slug, click_count, created_at FROM links WHERE id = $1';
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0];
}

