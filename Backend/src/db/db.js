import { Pool } from 'pg';

const pool = new Pool(
    process.env.DATABASE_URL
        ? {
            // Conexão com o Neon (produção)
            connectionString: process.env.DATABASE_URL,
        }
        : {
            // Conexão com o PostgreSQL local
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT) || 5432,
        }
);

export default pool;