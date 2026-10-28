import { useState } from "react";
import { register } from "../services/authService"
import { saveToken, saveUser } from "../services/sessionService";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
        await register(username, email, password).then((response) => {
            saveToken(response.token);
            saveUser(response.user);
        });
  } catch {
        setError("Failed to register");
    }
    finally {
        setLoading(false);
    }
};
return (
    <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
        </button>
        {error && <p>{error}</p>}
    </form>
);}