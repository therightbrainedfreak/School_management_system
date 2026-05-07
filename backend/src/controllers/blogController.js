import blog from "../models/blog.js";
import blogComment from "../models/blogComment.js";
import { sanitizeHTML } from "../utils/utils.js";

const sanitizeText = (val, max) => 
    typeof val === 'string' ? val.trim().replace(/\s+/g, ' ').replace(/[^\x20-\x7E]/g, '').slice(0, max) : undefined;

export const composeBlog = async (req, res) => {
    // Extract Author data
    const authorId = req.user?.id;
    const authorRole = req.user?.role;
    const autherName = req.user?.name;

    // Extract Blog data (e.g., title, content, )
    const category = req.body?.category;
    const title = req.body?.title;
    const content = req.body?.content;
    const tags = req.body?.tags;

    if (!category || !title || !content || !tags) {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INVALID_DATA",
                message: "Incomplete data provided."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    }

    if (!Array.isArray(req.body.tags)) {
        return res.status(422).json({
            success: false,
            status: 422,
            error: {
                code: "INVALID_DATA",
                message: "Tags must be an Array."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    }

    // Sanitize data
    const s_category = sanitizeText(category, 20);
    const s_title = sanitizeText(title, 70);
    const s_tags = tags.map(tag => sanitizeText(tag, 20));
    const s_content = sanitizeHTML(content);
    
    const blog = {
        author: {
            id: authorId,
            role: authorRole,
            name: autherName
        },
        metadata: {
            category: s_category,
            tags: s_tags
        },
        title: s_title,
        content: s_content
    }

    res.json({blog})
}