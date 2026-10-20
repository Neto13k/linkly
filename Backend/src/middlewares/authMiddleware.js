import jwt from 'jsonwebtoken';
const secretKey = process.env.JWT_SECRET;

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']?.startsWith('Bearer ') ? req.headers['authorization'] : null;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Token Inválido' });
        }
        req.user = user;
        next();
    });
}