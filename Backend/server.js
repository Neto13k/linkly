import 'dotenv/config';
import { app } from './src/app.js';

// Definir a porta do servidor
const PORT = process.env.PORT || 3000;

// Verificar se a variável de ambiente JWT_SECRET está definida
if (!process.env.JWT_SECRET?.trim()) {
    console.error('JWT_SECRET não está definido. Defina a variável de ambiente JWT_SECRET.');
    process.exit(1);
}

// Iniciar o servidor
app.listen(PORT, (error) => {
    if (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
        return;
    }

    console.log(`Server is running on port ${PORT}`);
});