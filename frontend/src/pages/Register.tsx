// Página de registro.
// Coleta username, e-mail e senha, cria a conta via authService e, em sucesso, já autentica
// o usuário (salva a sessão) e o redireciona para o dashboard. As validações de formato e
// unicidade são feitas no backend e suas mensagens são exibidas no alerta.
import { useState } from "react";
import { useNavigate } from 'react-router';
import { register } from "../services/authService"
import { saveToken, saveUser } from "../services/sessionService";
import { Link } from "react-router";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
        await register(username, email, password).then((response) => {
            // O backend já devolve o token no registro; persistimos a sessão antes de navegar
            saveToken(response.token);
            saveUser(response.user);
            // Redirecionar para o dashboard após o registro
            navigate('/dashboard');
        });
  } catch (err) {  // Catch para capturar erros de registro e puxar a mensagem de erro do backend
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("Falha ao registrar. Por favor, tente novamente.");
        }
    }
    finally {
        setLoading(false);
    }
};
return (
    <main className="auth">
        <form className="card auth__card" onSubmit={handleSubmit}>
            <h1 className="auth__title">Criar conta</h1>

            <div className="form__field">
                <label htmlFor="register-username">Username</label>
                <input id="register-username" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
            </div>

            <div className="form__field">
                <label htmlFor="register-email">Email</label>
                <input id="register-email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </div>

            <div className="form__field">
                <label htmlFor="register-password">Senha</label>
                <input id="register-password" type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
            </div>

            <button type="submit" className="btn btn--primary" disabled={loading}>
                {loading ? "Registrando..." : "Registrar"}
            </button>
            {error && <p className="alert alert--error" role="alert">{error}</p>}

            <p className="auth__switch">Já possui uma conta? <Link to="/login">Login</Link></p>
        </form>
    </main>
);}