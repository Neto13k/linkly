import { useState } from "react";
import { login } from "../services/authService"
import { saveToken, saveUser } from "../services/sessionService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
        await login(email, password).then((response) => {
            saveToken(response.token);
            saveUser(response.user);
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