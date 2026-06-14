import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const commentSchema = new mongoose.Schema({
    commentId: { type: String, required: true, index: true, unique: true },
    blogId: { type: String, required: true, index: true },
    parentId: { type: String, default: null, index: true },
    rootId: { type: String, default: null, index: true },
    replyTo: {
        id: { type: String, default: null },
        name: { type: String, default: null }
    },
    author: {
        id: { type: String, required: true },
        role: { type: String, required: true },
        name: { type: String, required: true }
    },
    content: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    metadata: {
        likes: { type: [String], default: [] }
    }
}, { timestamps: true })

commentSchema.pre('validate', function () {
    if (this.isNew && !this.commentId) {
        this.commentId = nanoid(12);
    }
});

const blogComment = mongoose.model('blogComment', commentSchema);

export default blogComment;