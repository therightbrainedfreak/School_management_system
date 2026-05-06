import mongoose from "mongoose";
import { generateUniqueId } from "../utils/utils.js";

const studentSchema = new mongoose.Schema({
    userId: {type: String, required: true, trim: true, index: true, unique: true},
    parentId: {type: String},
    password: {type: String, required: true, trim: true},
    name: {type: String, required: true},
    surname: {type: String},
    dob: {type: String, required: true},
    gender: {type: String, required: true},
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
        identityDocNumber: {type: String, required: true},
        isVerified: {type: Boolean, default: false}
    },
    role: {type: String, required: true, enum: ['student'], default: 'student'},
    profilePicturePath: {type: String},
    preferences: {type: Object},
    jwtTokenVersion: {type: Number, default: 1},
    deactivationR: {type: String},
    status: {type: String, default: "active", enum: ['active', 'suspended', 'drop', 'deactivated']},
    disclaimerAccepted: { type: Boolean, default: false },
    acceptedAt: Date
},{timestamps: true});

studentSchema.pre('validate', function() {
    if (this.isNew && !this.userId) {
        let genId = generateUniqueId("student");
        this.userId = genId;
    };
});

studentSchema.pre('save', function() {
    if (this.isModified('password')) {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    };
});

const student = mongoose.model('student', studentSchema);

export default student;