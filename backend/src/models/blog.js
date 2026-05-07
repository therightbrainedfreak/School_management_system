import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

const blogSchema = new mongoose.Schema({
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
        tags: {type: [String], required: true},
        likes: [{
            id: { type: String },
            role: { type: String },
            name: { type: String }
        }]
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    isAvailable: { type: Boolean, default: true }
}, {
    timestamps: true
})

blogSchema.pre('validate', function() {
    if (this.isNew && !this.blogId) {
        this.blogId = nanoid(12);
    }
});

const blog = mongoose.model('blog', blogSchema);

export default blog;