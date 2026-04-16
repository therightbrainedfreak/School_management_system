import mongoose from 'mongoose';
import { generateMailRef } from "../utils/utils.js";

const applicationHistorySchema = new mongoose.Schema({
    referenceId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    recipient: {
        appRef: { type: String, required: true },
        name: { type: String, required: true },
        mail: { type: String, required: true },
        role: { type: String, required: true }
    },
    message: { type: String, required: true },
    referrer: {
        userId: { type: String, required: true },
        role: { type: String, required: true }
    },
    createdAt: { type: Date, default: Date.now }
});

applicationHistorySchema.pre('validate', function() {
    if (this.isNew && !this.referenceId) {
        let genId = generateMailRef();
        this.referenceId = genId;
    };
});

const applicationHistory = mongoose.model('applicationHistory', applicationHistorySchema);

export default applicationHistory;