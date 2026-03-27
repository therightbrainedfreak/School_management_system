import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import { generateUniqueId } from "../utils/utils.js";

const adminSchema = new mongoose.Schema({
    userId: {type: String, required: true, trim: true, index: true, unique: true},
    password: {type: String, required: true, trim: true},
    name: {type: String, required: true},
    surname: {type: String},
    dob: {type: String, required: true},
    gender: {type: String, required: true},
    fatherName: {type: String, required: true},
    motherName: {type: String, required: true},
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
        identityDocNumber: {type: String, unique: true, required: true},
        isVerified: {type: Boolean, default: false}
    },
    role: {type: String, required: true, enum: ['admin']},
    profilePicturePath: {type: String},
    preferences: {type: Object},
    jwtTokenVersion: {type: Number, default: 1},
    status: {type: String, default: "active", enum: ['active', 'suspended', 'drop', 'deactivated']},
    deactivationR: {type: String}
},{timestamps: true});

adminSchema.pre('validate', function() {
    if (this.isNew && !this.userId) {
        let genId = generateUniqueId("admin");
        this.userId = genId;
    }
});

adminSchema.pre('save', function() {
    if (this.isModified('password')) {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    };
});

const admin = mongoose.model('admin', adminSchema);

export default admin;