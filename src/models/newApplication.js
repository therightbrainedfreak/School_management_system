import mongoose from "mongoose";
import { generateAppRef } from "../utils/utils.js";
import uniqueValidator from "mongoose-unique-validator";

const newApplicationSchema = new mongoose.Schema({
    appRef: {type: String, required: true, trim: true, index: true, unique: true},
    appStatus: {type: String, default: 'DRAFT', enum: ['DRAFT', 'ACCEPTED', 'REJECTED', 'PROCESSING']},
    reasonForRejection: {type: String},
    name: {type: String, required: true},
    surname: {type: String},
    dob: {type: String, required: true},
    gender: {type: String, required: true, enum: ['male', 'female', 'others']},
    fatherName: {type: String, required: true},
    motherName: {type: String, required: true},
    forStandard: {type: String},
    subjectExpertise: {type: Array},
    address: {
        houseNo: {type: String},
        street: {type: String, required: true},
        district: {type: String, required: true},
        state: {type: String, required: true},
        postCode: {type: String, required: true},
        country: {type: String, default: "india"},
        currency: {type: String, default: "INR"},
        phoneNumber: {type: String, required: true}
    },
    email: {type: String, required: true, trim: true},
    isMailVerified: {type: Boolean, default: false},
    identityDoc: {
        type: {type: String, required: true, enum: ['uidai-aadhar']},
        identityDocNumber: {type: String, required: true, unique: true},
        isVerified: {type: Boolean, default: false}
    },
    role: {type: String, required: true, enum: ['student', 'parent', 'teacher', 'backoffice']},
    isAppVerified: {type: Boolean, default: false},
    verifiedBy: {type: String, enum: ['admin', 'superuser']},
    isAppointed: {type: Boolean, default: false},
    appointmentId: {type: String}
}, {
    timestamps: true
});

newApplicationSchema.plugin(uniqueValidator, { message: 'Error, value {PATH} already exists.' });

newApplicationSchema.pre('validate', function() {
    if (this.isNew && !this.appRef) {
        let genAppRef = generateAppRef();
        this.appRef = genAppRef;
    };
});

const newApplication = mongoose.model('newApplication', newApplicationSchema);

export default newApplication;