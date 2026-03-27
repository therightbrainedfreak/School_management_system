import 'dotenv/config'
import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    // Extract token cookie from the client
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            success: false,
            status: 401,
            error: {
                code: "UNAUTHORISED",
                message: "You are not authorised. Please login First."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    }
    // Verify and decode the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Join the decoded payload to the user object for call back function.
        req.user = decoded;
        // Callback next.
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            status: 401,
            error: {
                code: "UNKNOWN_TOKEN",
                message: "Coudn't recognise token"
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        })
    }
};