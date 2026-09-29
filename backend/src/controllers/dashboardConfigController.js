import { sucRes, errRes } from "../utils/utils.js";
import featureFlag from "../models/FeatureFlag.js";
import { logger } from "../utils/logger.js";
import pino_logger from "../utils/pino.js";

export const returnConfig = async (req, res) => {
    // Extract client identity data forwarded from the authoriser middleware.
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const userName = req.user?.name;

    try {
        const flags = await featureFlag.find({ allowedRoles: userRole, enabled: true }).lean();

        if (!flags || flags.length < 1) {
            return errRes(res, 404, "NOT_FOUND", "Cannot find content correspondence to the user.");
        }

        const cleanedFlags = flags.map(({_id, enabled, allowedRoles, restrictTo, reason, ...rest}) => rest);

        sucRes(res, "Success", { flags: cleanedFlags });

    } catch (error) {
        // Get the enviroment type fromt enviroment variables.
        const NODE_ENV = process.env.NODE_ENV || 'development';

        // Log to terminal for debugging if service is not in production.
        if (NODE_ENV !== 'production') {
            pino_logger.debug(error, 'Error occured while serving tags');
        }

        // Log to database.
        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'dashboardConfigController',
            message: 'Error serving dashboard config',
            metadata: {
                userId: userId,
                usertype: userRole
            },
            stackTrace: error
        });

        // Error response
        return errRes(res, 500, "INTERNAL_ERROR", "Unexpected error occured while serving dashboard config");
    }
};