import mongoose from "mongoose";
import { generateAppRef } from "../utils/utils.js";
import uniqueValidator from "mongoose-unique-validator";

const draftStudentApplicationSchema = new mongoose.Schema({
    appRef: {type: String, required: true, trim: true, index: true, unique: true},
    appStatus: {type: String, default: 'DRAFT', enum: ['DRAFT', 'ACCEPTED', 'REJECTED', 'PROCESSING']},
    name: {type: String, required: true},
    surname: {type: String},
    dob: {type: String, required: true},
    gender: {type: String, required: true, enum: ['male', 'female', 'others']},
    fatherName: {type: String, required: true},
    motherName: {type: String, required: true},
    class: {type: String, required: true},
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
    role: {type: String, required: true, enum: ['student'], default: 'student'},
    isAppVerified: {type: Boolean, default: false},
    appVerifier: {type: String},
    vAppointment: {
        isAppointed: {type: Boolean, default: false},
        date: {type: Date},
        verifier: {type: String}
    }
}, {
    timestamps: true
});

draftStudentApplicationSchema.plugin(uniqueValidator, { message: 'Error, filed value {PATH} already exists.' });

draftStudentApplicationSchema.pre('validate', function() {
    if (this.isNew && !this.appRef) {
        let genAppRef = generateAppRef();
        this.appRef = genAppRef;
    };
});

const draftStudentApplication = mongoose.model('draftStudentApplication', draftStudentApplicationSchema);

export default draftStudentApplication;