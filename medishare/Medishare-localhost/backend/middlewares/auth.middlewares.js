import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            return next();
        } catch (error) {
            console.log("JWT Error:", error);
            return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }
    }

    if (req.cookies.token) {
        try {
            token = req.cookies.token;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            console.log("User injected in req.user:", decoded);
            return next();
        } catch (error) {
            console.log("JWT Error:", error);
            return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }
    }

    return res.status(401).json({ success: false, message: 'User not logged in' });
};
const verifyAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        console.log("verify admin called")
        return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
    }
    next();
};

export { authMiddleware, verifyAdmin };
