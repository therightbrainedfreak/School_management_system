import { sucRes, errRes } from "../utils/utils.js";
import pino_logger from "../utils/pino.js";
import { allowedRoles } from "../utils/utils.js";
import sysLogEnt from "../utils/systemLogsHandler.js";
import featureFlag from "../models/FeatureFlag.js";

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
    if (!Array.isArray(allowedTo)) return errRes(res, 400, "INVALID_DATA", "Invalid or incomplete data provided");
    if (allowedTo.length < 1) return errRes(res, 400, "INVALID_DATA", "Atlead one allowed role must be included");

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

    const newFeatureFlagPayload = {
        label: s_label,
        module: s_module,
        path: s_path,
        description: s_desc,
        allowedTo: s_allowedTo,
        by: {
            userId,
            userRole
        }
    }

    try {
        // Create new db entry and save it.
        const newFlagObj = new featureFlag(newFeatureFlagPayload);
        await newFlagObj.save();

        sucRes(res, "Created Flag", {
            reload: true
        });

    } catch (error) {
        // Get the enviroment type from enviroment variables.
        const NODE_ENV = process.env.NODE_ENV || 'development';

        // Log to terminal for debugging if service is not in production.
        if (NODE_ENV !== 'production') {
            pino_logger.debug(error, 'Error occured while serving tags');
        }

        // Log to database.
        sysLogEnt.error("createFeatureFlag", "Couldn't create feature flag.", userId, undefined, error.message);

        // Error response
        return errRes(res, 500, "INTERNAL_ERROR", "Unexpected error occured while creating new feature flag");
    }

};