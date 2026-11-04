//componente para proteger rotas, redirecionando para a página de login caso o usuário não esteja autenticado
// Guarda de rota no lado do cliente: verifica apenas a presença do token no sessionStorage.
// A validade/expiração do token é confirmada pelo backend a cada chamada de API
// (erros 401 são convertidos em 'SESSION_EXPIRED' e tratados por useSessionError).

import type { ReactNode } from 'react';
import { Navigate } from "react-router";
import { getToken } from "../services/sessionService";

// Recebe o conteúdo protegido via children e o libera somente quando há token.
// O `replace` substitui a entrada no histórico, evitando voltar à rota protegida pelo botão "voltar".
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
    return children;
}
