import mongoose from 'mongoose';

const blog = new mongoose.Schema({
    blogId: { type: String, index: true, required: true, unique: true },
    author: {
        id: { type: String, required: true },
        role: { type: String, required: true },
        name: { type: String, required: true }
    },
    reviewer: {
        id: { type: String},
        role: { type: String},
        name: { type: String}
    },
    metadata: {
        category: {type: String, required: true},
        tags: {type: Array, required: true},
        likes: {type: Number},
        comments: {}
    },
}, {timestamps: true})