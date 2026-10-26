import admin from '../models/admin.js';
import student from '../models/student.js';
import teacher from '../models/teacher.js';
import parent from '../models/parent.js';
import su from '../models/superUser.js';
import pino_logger from '../utils/pino.js';

import { errRes } from '../utils/utils.js';
import sysLogEnt from '../utils/systemLogsHandler.js';

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
        if (!MODEL) return errRes(res, 403, "INVALID_ROLE_MAP", "Role configuration error")

        // Check if user is allowed
        if (!allowedRoles.includes(req.user.role)) return errRes(res, 401, "UNAUTHORISED", "User is not allowed.")

        try {
            // Find the user info from the data base (database crosscheck).
            const info = await MODEL.findOne({ userId: userId }).select('status jwtTokenVersion');
            if (!info) return errRes(res, 404, "USER_NOT_FOUND", "User no longer exists.")

            // Check user status.
            if (info.status !== 'active') return errRes(res, 403, "USER_DEACTIVATED", "User is not allowed or deactivated.")

            // Validate data.
            if (req.user.token_version < info.jwtTokenVersion) return errRes(res, 401, "SESSION_EXPIRED", "You've been logged out.")

            next();

        } catch (error) {

            const NODE_ENV = process.env.NODE_ENV || 'development';

            // Log to terminal for debugging if service is not in production.
            if (NODE_ENV !== 'production') pino_logger.debug(error, 'Error occured while serving tags');

            sysLogEnt.error("Authoriser", "Error while trying to authorise user.", userId, undefined, error.message);

            return errRes(res, 500, 'INTERNAL_ERROR', 'Internal server error.');
        };
    };
};