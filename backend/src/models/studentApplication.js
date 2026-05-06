import mongoose from "mongoose";
import { generateAppRef } from "../utils/utils.js";
import uniqueValidator from "mongoose-unique-validator";

const studentApplicationSchema = new mongoose.Schema({
    appRef: {type: String, required: true, trim: true, index: true, unique: true},
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true },
    standard: { type: String, required: true },
    role: { type: String, default: "student", enum: ["student"] },
    address: {
        houseNo: { type: String },
        street: { type: String, required: true },
        district: { type: String, required: true },
        state: { type: String, required: true },
        postcode: { type: String, required: true },
        country: { type: String, default: "india", enum: ['india'] }
    },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    appointment: {
        state: { type: Boolean, default: false },
        appointmentId: { type: String }
    },
    status: {
        state: { type: String, default: "DRAFT", enum: ["DRAFT", "PROCESSING", "VERIFIED", "REJECTED", "ACCEPTED", "KYC"] },
        note: { type: String }
    },
    payment: {
        state: { type: String, default: "NA", enum: ["NA", "PENDING", "DONE"] },
        paymentId: { type: String }
    },
    kyc: {
        state: { type: String, default: "PENDING", enum: ["PENDING", "VERIFIED", "REJECTED"] },
        note: { type: String }
    },
    kycIdentifier: {
        iv: { type: String },
        authTag: { type: String },
        encryptedData: { type: String }
    },
    paths: { type: Object },
    configurations: { type: Object }
}, {
    timestamps: true
});

studentApplicationSchema.plugin(uniqueValidator, { message: 'Error, value {PATH} already exists.' });

studentApplicationSchema.pre('validate', function() {
    if (this.isNew && !this.appRef) {
        let genAppRef = generateAppRef();
        this.appRef = genAppRef;
    };
});

const studentApplication = mongoose.model('studentApplication', studentApplicationSchema);

export default studentApplication;