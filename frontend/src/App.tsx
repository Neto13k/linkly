import { Routes, Route, Navigate } from 'react-router';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} /> {/*redirecionar a rota raiz para a rota de login*/}
      <Route path="/login" element={<Login />} /> {/*rota de login*/}
      <Route path="/register" element={<Register />} /> {/*rota de registro*/}
      <Route path="/dashboard" element={<Dashboard />} /> {/*rota do dashboard*/}
    </Routes>
  );
};