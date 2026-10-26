import mongoose from "mongoose";

const sysLogSchemaLayout = new mongoose.Schema({
    // Type of the log.
    type: { type: String, required: true, enum: ['info', 'error', 'warn', 'debug'] },
    // Origin of the log (where the action is performed).
    origin: { type: String, required: true },
    // Main message defining the log.
    message: { type: String, required: true },
    // Id of the related entity responsible e.g, user, admin.
    actionBy: { type: String, default: "NOT_REG" },
    // Id of the related entity (if any) for which the request it made.
    relId: { type: String, default: "NOT_DEF" },
    // Stacktrace for error, warning & debugging.
    stackTrace: { type: String }
}, {
    timestamps: true
});

sysLogSchemaLayout.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 * 1000 });

const sysLog = mongoose.model('sysLog', sysLogSchemaLayout);

export default sysLog;