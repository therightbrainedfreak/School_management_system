import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 120, // Limit each IP to 100 requests per window
    message: {
        success: false,
        status: 429,
        error: {
            code: "TOO_MANY_REQUESTS",
            message: "Too many requests please try again after 15 minutes."
        },
        metadata: {
            server_time: Date.now(),
            version: "v1.0.0"
        }
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Only 5 login attempts allowed!
    message: {
        success: false,
        status: 429,
        error: {
            code: "TOO_MANY_REQUESTS",
            message: "Too many login attempts please try again after 15 minutes."
        },
        metadata: {
            server_time: Date.now(),
            version: "v1.0.0"
        }
    }
});