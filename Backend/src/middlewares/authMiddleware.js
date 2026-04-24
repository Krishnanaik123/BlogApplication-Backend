const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
                
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "No token provided. Authorization header required."
            });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format. Use 'Bearer <token>'"
            });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token has expired. Please login again."
            });
        }

        if (error.name === 'JsonWebTokenError') {
           return res.status(403).json({ 
            success: false,
            message: "Invalid Token. Someone tampered with your session!" 
        });
        }

        return res.status(500).json({
            success: false,
            message: "Token verification failed: " + error.message
        });
    }
};

module.exports = { verifyToken };
