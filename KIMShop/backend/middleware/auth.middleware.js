import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';  

export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({ message: "Unauthorized - No access token provided" });
        }

        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRETE); 
            const foundUser = await User.findById(decoded.userId).select("-password"); 
            
            if (!foundUser) {
                return res.status(401).json({ message: "User not found" });
            }

            req.user = foundUser;
            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {  
                return res.status(401).json({ message: "Unauthorized - Access token expired" });
            }
            throw error;
        }

    } catch (error) {
        console.error('Error in protectRoute middleware:', error.message);
        return res.status(401).json({ message: "Unauthorized - Invalid access token" });
    }
};

export const adminRoute = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: "Access Denied - Admin only" });
    }
};
