import admin from '../models/admin.js';
import student from '../models/student.js';
import teacher from '../models/teacher.js';
import parent from '../models/parent.js';
import su from '../models/superUser.js';
import { logger } from '../utils/logger.js';

const modelRoleMap = {
    admin: admin,
    student: student,
    teacher: teacher,
    parent: parent,
    superuser: su
}

export const authorise = (...allowedRoles) => {
    return async (req, res, next) => {
        // Extract data from the user object forwarded by the authenticator after verifying and decoding the jwt token.
        const userRole = req.user?.role;
        const userId = req.user?.id;
        // Map the user role to the user schema.
        const MODEL = modelRoleMap[userRole];
        // Check is the role is correct.
        if (!MODEL) {
            return res.status(403).json({
                success: false,
                status: 403,
                error: {
                    code: "INVALID_ROLE_MAP",
                    message: "Role configuration error"
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        };
        // Check if user is allowed
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(401).json({
                success: false,
                status: 401,
                error: {
                    code: "UNAUTHORISED",
                    message: "Cannot proceed. User is not allowed."
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        };
        try {
            // Find the user info from the data base.
            const info = await MODEL.findOne({ userId: userId }).select('status jwtTokenVersion');
            if (!info) {
                return res.status(404).json({
                    success: false,
                    status: 404,
                    error: {
                        code: "USER_NOT_FOUND",
                        message: "User is no longer exist."
                    },
                    metadata: {
                        server_time: Date.now(),
                        version: "v1.0.0"
                    }
                });
            };
            // Validate data.
            if (req.user.token_version < info.jwtTokenVersion) {
                return res.status(401).json({
                    success: false,
                    status: 401,
                    error: {
                        code: "SESSION_EXPIRED",
                        message: "Your session invalidated. Please login again."
                    },
                    metadata: {
                        server_time: Date.now(),
                        version: "v1.0.0"
                    }
                });
            };
            // Check user status.
            if (info.status !== 'active') {
                return res.status(403).json({
                    success: false,
                    status: 403,
                    error: {
                        code: "USER_DEACTIVATED",
                        message: "Cannot proceed. User is deactivated."
                    },
                    metadata: {
                        server_time: Date.now(),
                        version: "v1.0.0"
                    }
                });
            };
            next();
        } catch (error) {
            logger({
                level: 'error',
                origin: 'mmiddleware',
                originName: 'authoriser',
                message: 'Error authorising.',
                metadata: {
                    userId: req.user?.id,
                    userType: req.user?.role
                },
                stackTrace: error.message
            });
            res.status(500).json({
                success: false,
                status: 500,
                error: {
                    code: "INTERNAL_ERROR",
                    message: "Unexpected error happened while authorising user"
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        };
    };
};