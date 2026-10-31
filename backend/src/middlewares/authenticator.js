// AUTHENTICATOR FOR CHECKING OR VALIDATING JWT TOKEN ON COOKIES.

import jwt from 'jsonwebtoken';
import { errRes } from '../utils/utils.js';

/**
 * @description Middleware validates cookie and JWT Token, returns unauthorised on error.
 * @param {object} req Express provided request object.
 * @param {object} res Express provided response object.
 * @param {function} next Callback. 
 */

export const authenticate = (req, res, next) => {
    // Extract token cookie from the client
    const token = req.cookies.token;

    if (!token) {
        return errRes(res, 401, "UNAUTHORISED", "Please login first");
    }

    // Verify and decode the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Join the decoded payload to the user object for call back function.
        req.user = decoded;
        // Callback next.
        next();
    } catch (error) {
        return errRes(res, 401, "UNKNOWN_TOKEN", "Couldn't recognise token.");
    }
};

/**
 * @description Middleware validates cookie and JWT Token, continues as guest if no token found or token is incorrect.
 * @param {object} req Express provided request object.
 * @param {function} next Callback. 
 */

export const softAuthenticate = (req, res, next) => {
    // Verify and decode the token
    try {
        // Extract token cookie from the client
        const token = req.cookies?.token;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Join the decoded payload to the user object for call back function.
            req.user = decoded;
        }
    } catch (error) {
        // invalid or expired token, continue as guest
    }
    next();
};