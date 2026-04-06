import mongoose from 'mongoose';

const timePeriodSchema = mongoose.Schema({
    targetId: { type: String, required: true, refPath: 'onModel' },
    onModel: { type: String, required: true, enum: ['admin', 'superuser', 'student', 'backoffice']},
    status: { type: String, required: true },
    startTime: {type: Date, required: true},
    endTime: {type: Date, required: true},
    createdAt: { type: Date, default: Date.now }
});

const timePeriod = mongoose.model('timePeriod', timePeriodSchema);

export default timePeriod;