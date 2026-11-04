// Pool de conexões com o PostgreSQL, compartilhado por todos os services.
// O pool reaproveita conexões abertas, evitando o custo de abrir uma nova a cada consulta.
import { Pool } from 'pg';

// Escolhe a configuração de conexão conforme o ambiente:
// em produção usa a connection string do Neon (DATABASE_URL); localmente usa as variáveis DB_*.
const pool = new Pool(
    process.env.DATABASE_URL
        ? {
            connectionString: process.env.DATABASE_URL,
        }
        : {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT) || 5432,
        }
);

export default pool;