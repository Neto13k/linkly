//componente para proteger rotas, redirecionando para a página de login caso o usuário não esteja autenticado

import type { ReactNode } from 'react';
import { Navigate } from "react-router";
import { getToken } from "../services/sessionService";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
    return children;
}
