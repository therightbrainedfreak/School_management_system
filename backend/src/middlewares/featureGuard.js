import { errRes } from "../utils/utils.js"

const featureGuard = (req, res, next) => {
    const flagId = req.get("X-Feature-Id");
    if (!flagId) return errRes(res, 400, "INVALID_HEADERS", "Missing required header for feature id.");
    next();
}
export default featureGuard;