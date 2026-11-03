import { useState } from "react";
import { login } from "../services/authService"
import { useNavigate, Link } from 'react-router';
import { saveToken, saveUser } from "../services/sessionService";

export default function Login() {
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
        await login(email, password).then((response) => {
            saveToken(response.token);
            saveUser(response.user);
            // Redirecionar para o dashboard após o login
            navigate('/dashboard');
        });
  } catch (err) {  // Catch para capturar erros de login e puxar a mensagem de erro do backend
    if (err instanceof Error) {
        setError(err.message);
    } else {
        setError("Falha ao fazer login");
    }
    } finally {
        setLoading(false);
    }
};

return (
    <main className="auth">
        <form className="card auth__card" onSubmit={handleSubmit}>
            <h1 className="auth__title">Entrar</h1>

            <div className="form__field">
                <label htmlFor="login-email">Email</label>
                <input id="login-email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </div>

            <div className="form__field">
                <label htmlFor="login-password">Senha</label>
                <input id="login-password" type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
            </div>

            <button type="submit" className="btn btn--primary" disabled={loading}>{loading ? "Entrando..." : "Login"}</button>
            {error && <p className="alert alert--error" role="alert">{error}</p>}

            <p className="auth__switch">Não possui uma conta? <Link to="/register">Registre-se</Link></p>
        </form>
    </main>
);
}