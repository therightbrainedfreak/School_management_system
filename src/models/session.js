import mongoose from "mongoose";
import { nanoid } from "nanoid";

const sessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, index: true, unique: true },
    sessionUserId: { type: String, required: true },
    sessionUsername: { type: String, required: true },
    sessionAge: { type: Date, required: true },
    metaData: { type: Object }
}, { timestamps: true });

sessionSchema.pre('validate', function () {
    if (this.isNew && !this.sessionId) {
        this.sessionId = nanoid();
    };
    if (this.isNew && !this.sessionAge) {
        const twelveHoursInMs = 12 * 60 * 60 * 1000;
        this.sessionAge = new Date(Date.now() + twelveHoursInMs).toUTCString();
    };
});

const session = mongoose.model('session', sessionSchema);

export default session;