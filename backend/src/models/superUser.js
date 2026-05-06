import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import { generateUniqueId } from "../utils/utils.js";

const suSchema = new mongoose.Schema({
    userId: {type: String, required: true, trim: true, index: true, unique: true},
    password: {type: String, required: true, trim: true},
    name: {type: String, required: true},
    email: {type: String, required: true, trim: true},
    isMailVerified: {type: Boolean, default: false},
    role: {type: String, required: true, enum: ['superuser']},
    preferences: {type: Object},
    jwtTokenVersion: {type: Number, default: 1},
    status: {type: String, default: 'active', enum: ['active', 'suspended', 'drop']}
},{timestamps: true});

suSchema.pre('validate', function() {
    if (this.isNew && !this.userId) {
        let genId = generateUniqueId("superuser");
        this.userId = genId;
    }
});

suSchema.pre('save', function() {
    if (this.isModified('password')) {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    };
});

const su = mongoose.model('su', suSchema);

export default su;