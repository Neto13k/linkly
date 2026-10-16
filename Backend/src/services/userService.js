import pool from '../db/db.js';
import bcrypt from 'bcrypt';

async function hashPassword(password) {
    const saltRounds = 10;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error(`Erro ao gerar hash de senha: ${error.message}`);
    }
}

export const getUserById = async (id) => {
    const query = 'SELECT id, username, email, created_at FROM users WHERE id = $1';
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export const getUserByEmail = async (email) => {
    const query = 'SELECT id, username, email, created_at FROM users WHERE email = $1';
    const values = [email];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export const createUser = async (username, email, password) => {
    const hashedPassword = await hashPassword(password);
    const query = 'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at';
    const values = [username, email.trim().toLowerCase(), hashedPassword];
    const result = await pool.query(query, values);
    return result.rows[0];
}

