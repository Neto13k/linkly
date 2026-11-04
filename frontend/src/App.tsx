// Definição das rotas da aplicação.
// As rotas /dashboard e /profile são envolvidas por ProtectedRoute, exigindo autenticação;
// a rota raiz redireciona para /login.
import { Routes, Route, Navigate } from 'react-router';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import Regras from './pages/Regras';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} /> {/*redirecionar a rota raiz para a rota de login*/}
      <Route path="/login" element={<Login />} /> {/*rota de login*/}
      <Route path="/register" element={<Register />} /> {/*rota de registro*/}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> {/*rota do dashboard protegida caso não esteja autenticado*/}
      <Route path="/regras" element={<Regras />} /> {/*rota das regras*/}
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} /> {/*rota do perfil protegida caso não esteja autenticado*/}
    </Routes>
  );
}