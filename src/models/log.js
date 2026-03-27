import mongoose, { Mongoose } from "mongoose";

const logSchema = new mongoose.Schema({
    level: {type: String, required: true, enum: ['info', 'error', 'warn']},
    origin: {type: String, required: true, enum: ['microService', 'localService', 'mainService', 'authService']},
    originName: {type: String, required: true},
    message: {type: String, required: true},
    metadata: {
        userId: {type: String,},
        orderId: {type: String},
        userType: {type: String}
    },
    stackTrace: {type: String}
}, {
    timestamps: true
});

logSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 * 1000 });

const log = mongoose.model('log', logSchema);

export default log;