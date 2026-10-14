import 'dotenv/config';
import { app } from './src/app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
    if (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
        return;
    }

    console.log(`Server is running on port ${PORT}`);
});