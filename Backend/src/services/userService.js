import pool from '../db/db.js';

export const getUserById = async (id) => {
    const query = 'SELECT id, username, email, created_at FROM users WHERE id = $1';
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0];
}