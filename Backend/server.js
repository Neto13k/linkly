// Ponto de entrada do backend do Linkly.
// Valida a configuração obrigatória e inicia o servidor HTTP.
// Carrega o arquivo .env para process.env antes de importar os demais módulos
import 'dotenv/config';
import { app } from './src/app.js';

// Definir a porta do servidor
const PORT = process.env.PORT ||4000;

// Verificar se a variável de ambiente JWT_SECRET está definida
// Fail-fast: sem JWT_SECRET não é possível assinar nem validar os tokens de autenticação.
// O processo é encerrado imediatamente para evitar subir o servidor com a autenticação quebrada.
if (!process.env.JWT_SECRET?.trim()) {
    console.error('JWT_SECRET não está definido. Defina a variável de ambiente JWT_SECRET.');
    process.exit(1);
}

// Iniciar o servidor
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//erros
// Tratamento de falhas de inicialização do servidor (ex.: porta já em uso).
// Encerra o processo para que o gerenciador (nodemon, Docker, etc.) possa reiniciar a aplicação.

server.on('error', (err) => {
    console.error('Erro no servidor:', err);
    process.exit(1);
});