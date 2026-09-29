import mongoose from "mongoose";
import { generateFeatureFlagId } from "../utils/utils.js";

const featureFlagSchema = new mongoose.Schema ({
    flagId: { type: String, required: true, index: true, unique: true },
    key: { type: String, required: true, trim: true},
    module: { type: String, required: true, trim: true },
    label: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    allowedRoles: { type: [String], default: ["superuser"] },
    restrictTo: { type: [String], default: [] },
    reason: { type: String }
})

featureFlagSchema.pre('validate', function () {
    if (this.isNew && !this.flagId) {
        const ffId = generateFeatureFlagId();
        this.flagId = ffId;
    }
})

const featureFlag = mongoose.model('featureFlag', featureFlagSchema);

export default featureFlag;