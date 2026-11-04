// Ponto de entrada da aplicação React.
// Monta o App no elemento #root (definido no index.html), envolve tudo no BrowserRouter
// (base das rotas do react-router) e no StrictMode (avisos de más práticas em desenvolvimento).
// Também importa o SCSS global, ponto único de entrada dos estilos.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.scss'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </StrictMode>,
)
