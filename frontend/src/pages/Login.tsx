import { useState } from "react";
import { login } from "../services/authService"
import { useNavigate } from 'react-router';
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
  } catch {
        setError("Failed to login");
    } finally {
        setLoading(false);
    }
};

return (
    <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" disabled={loading}>Login</button>
        {error && <p>{error}</p>
        }
    </form>
);
}