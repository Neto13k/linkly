import { Routes, Route, Navigate } from 'react-router';
import Login from './pages/Login';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} /> {/*redirecionar a rota raiz para a rota de login*/}
      <Route path="/login" element={<Login />} /> {/*rota de login*/}
    </Routes>
  );
};