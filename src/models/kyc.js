import mongoose from 'mongoose';
import { generateKycId } from '../utils/utils.js';

const kycSchema = new mongoose.Schema({
    kycId: { type: String, required: true, index: true },
    appRef: { type: String, required: true },
}, {
    timestamps: true
});

kycSchema.pre('validate', function() {
    if (this.isNew && !this.kycId) {
        let kyc_id = generateKycId();
        this.kycId = kyc_id;
    };
});

const kycInstance = mongoose.model('kycInstance', kycSchema);

export default kycInstance;