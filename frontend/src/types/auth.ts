// Tipos relacionados à autenticação e ao usuário.
// Espelham o formato retornado pelo backend nas rotas /api/auth e /api/users.
// Dados públicos de um usuário (o backend nunca expõe o hash da senha).
// created_at chega como string ISO, pois é serializado no JSON da resposta.
export interface User {
    id: number;
    username: string;
    email: string;
    created_at: string
}

// Resposta das rotas de login e registro: token JWT e dados do usuário autenticado.
// `message` é opcional e vem apenas no registro (mensagem de sucesso).
export interface AuthResponse {
    token: string;
    user: User;
    message?: string;
}