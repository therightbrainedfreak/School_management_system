import mongoose from 'mongoose';
import { generateMailRef } from "../utils/utils.js";

const notificationHistorySchema = new mongoose.Schema({
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

notificationHistorySchema.pre('validate', function() {
    if (this.isNew && !this.referenceId) {
        let genId = generateMailRef();
        this.referenceId = genId;
    };
});

const nHistory = mongoose.model('nHistory', notificationHistorySchema);

export default nHistory;