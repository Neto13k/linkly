// Camada de acesso a dados dos links.
// Cada função executa uma consulta parametrizada no PostgreSQL e retorna apenas
// as colunas necessárias. O filtro por user_id nas operações de CRUD garante que um
// usuário nunca leia, altere ou exclua links de outro.
import pool from '../db/db.js';

// Busca um link pelo id e pelo dono (user_id); retorna undefined se não existir ou não pertencer ao usuário.
export const getLinkById = async (id, user_id) => {
    const query = 'SELECT id, destination_url, slug, click_count, created_at FROM links WHERE id = $1 AND user_id = $2';
    const values = [id, user_id];
    const result = await pool.query(query, values);
    return result.rows[0];
}

// Retorna todos os links de um usuário (array; vazio se não houver nenhum).
export const getLinksByUserId = async (userId) => {
    const query = 'SELECT id, destination_url, slug, click_count, created_at FROM links WHERE user_id = $1';
    const values = [userId];
    const result = await pool.query(query, values);
    return result.rows;
}

// Insere um novo link e retorna a linha criada.
// A violação da unicidade (user_id, slug) lança erro 23505, tratado no controller como 409.
export const createLink = async (userId, destinationUrl, slug) => {
    const query = 'INSERT INTO links (user_id, destination_url, slug) VALUES ($1, $2, $3) RETURNING id, destination_url, slug, click_count, created_at';
    const values = [userId, destinationUrl.trim(), slug.trim()];
    const result = await pool.query(query, values);
    return result.rows[0];
}

// Atualiza slug e URL de destino de um link do usuário e retorna a linha atualizada.
// Retorna undefined quando o link não existe ou não pertence ao usuário informado.
export const updateLink = async (id, user_id, destinationUrl, slug) => {
    const query = 'UPDATE links SET destination_url = $1, slug = $2 WHERE id = $3 AND user_id = $4 RETURNING id, destination_url, slug, click_count, created_at';
    const values = [destinationUrl.trim(), slug.trim(), id, user_id];
    const result = await pool.query(query, values);
    return result.rows[0];
}

// Remove um link do usuário; retorna a linha removida (id) ou undefined se nada foi excluído.
export const deleteLink = async (id, user_id) => {
    const query = 'DELETE FROM links WHERE id = $1 AND user_id = $2 RETURNING id';
    const values = [id, user_id];
    const result = await pool.query(query, values);
    return result.rows[0];
}

// Incrementa em 1 o contador de cliques de um link, antes do redirecionamento público.
export const incrementClickCount = async (id) => {
    const query = 'UPDATE links SET click_count = click_count + 1 WHERE id = $1 RETURNING id, destination_url, slug, click_count, created_at';
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0];
}

// Resolve o link pela combinação (slug do link + username do dono), usada no redirecionamento.
// O JOIN com users permite localizar o link apenas a partir da URL pública /:username/:slug.
export const getLinkBySlug = async (slug, username) => {
    const query = 'SELECT links.id, links.destination_url, links.slug, links.click_count, links.created_at FROM links JOIN users ON links.user_id = users.id WHERE links.slug = $1 AND users.username = $2';
    const values = [slug, username];
    const result = await pool.query(query, values);
    return result.rows[0];
}