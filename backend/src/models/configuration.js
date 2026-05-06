import mongoose from 'mongoose';

const configurationSchema = mongoose.Schema({
    confName: { type: String, required: true },
    confData: mongoose.Schema.Types.Mixed
}, {
    timestamps: true
});

const configuration = mongoose.model('configuration', configurationSchema);

export default configuration;