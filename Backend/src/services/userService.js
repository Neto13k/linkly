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
    const values = [email.trim().toLowerCase()];
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

export const updateUser = async (id, email) => {
    const query = 'UPDATE users SET email = $1 WHERE id = $2 RETURNING id, username, email, created_at';
    const values = [email.trim().toLowerCase(), id];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export const deleteUser = async (id) => {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id, username'; // Retorna o id e o username do usuário deletado
    const connection = await pool.connect(); // Obter uma conexão do pool para iniciar uma transação
    try { 
        await connection.query('BEGIN');// Iniciar a transação e consultar o usuário antes de deletar para obter o username
        const result = await connection.query(query, [id]); 

        if (!result.rows[0]) { // Se não houver usuário com o ID fornecido, faça rollback e retorne undefined
            await connection.query('ROLLBACK');
            return undefined;
        }
        const username = result.rows[0].username;
        await connection.query('INSERT INTO blocked_names (name) VALUES ($1) ON CONFLICT DO NOTHING', [username]); // Adicionar o username à tabela blocked_names, ignorando se já existir
        await connection.query('COMMIT'); // Commit da transação
        return result.rows[0];
    } catch (error) { // Em caso de erro, faça rollback da transação
        await connection.query('ROLLBACK');
        throw error;
    } finally { // Garantir que a conexão seja liberada de volta para o pool
        connection.release();
    }
}

export const getUserForAuthentication = async (email) => {
    const query = 'SELECT id, username, email, password_hash FROM users WHERE email = $1';
    const values = [email.trim().toLowerCase()];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export const authenticateUser = async (email, password) => {
    const user = await getUserForAuthentication(email);
    if (!user) {
        return null ;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
        return null;
    }
    return { id: user.id, username: user.username, email: user.email };
}

export const isUsernameBlocked = async (username) => {
    const query = 'SELECT COUNT(*) FROM blocked_names WHERE name = $1';
    const values = [username.trim().toLowerCase()];
    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count, 10) > 0;
}
