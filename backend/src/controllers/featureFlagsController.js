import { sucRes, errRes } from "../utils/utils.js";
import { logger } from "../utils/logger.js";
import pino_logger from "../utils/pino.js";
import featureFlag from "../models/FeatureFlag.js";
import { allowedRoles } from "../utils/utils.js";

const sanitizeText = (val, max) =>
    typeof val === 'string' ? val.trim().replace(/\s+/g, ' ').slice(0, max) : undefined;

export const createFeatureFlag = async (req, res) => {
    // Extract userId & userRole from authoriser.
    const userId = req.user?.id;
    const userRole = req.user?.role;

    // Extract user provided data safely.
    const label = req.body?.label;
    const module = req.body?.module;
    const allowedTo = req.body?.allowedTo;
    const path = req.body?.path;
    const description = req.body?.description;

    // Pre-checks.
    if (!label || !module || !path || !description) return errRes(res, 400, "INVALID_DATA", "Invalid or incomplete data provided");
    if (typeof (label) !== 'string' || typeof (module) !== 'string' || typeof (path) !== 'string' || typeof (description) !== 'string') return errRes(res, 400, "INVALID_DATA", "Invalid or incomplete data provided");
    if (!Array.isArray(allowedTo)) return errRes(res, 400, "INVALID_DATA", "typeof allowedTo must be an array");

    // Data Sanitisation
    const s_label = sanitizeText(label, 80);
    const s_module = sanitizeText(module, 80);
    const s_path = sanitizeText(path, 100);
    const s_desc = sanitizeText(description, 200);
    const s_allowedTo = allowedTo.map(e => {
        if (allowedRoles.includes(e)) {
            return sanitizeText(e, 30);
        }
        return errRes(res, 400, "INVALID_DATA", "Invalid data provided");
    })

    try {
        //
    } catch (error) {
        // Get the enviroment type from enviroment variables.
        const NODE_ENV = process.env.NODE_ENV || 'development';

        // Log to terminal for debugging if service is not in production.
        if (NODE_ENV !== 'production') {
            pino_logger.debug(error, 'Error occured while serving tags');
        }

        // Log to database.
        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'createFeatureFlag',
            message: 'Error creating feature flag',
            metadata: {
                userId: userId,
                usertype: userRole
            },
            stackTrace: error
        });

        // Error response
        return errRes(res, 500, "INTERNAL_ERROR", "Unexpected error occured while creating new feature flag");
    }

};