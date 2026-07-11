import 'dotenv/config'
import blog from "../models/blog.js";
import blogComment from "../models/blogComment.js";
import { sanitizeHTML } from "../utils/utils.js";
import { errRes, sucRes } from "../utils/utils.js";
import mongoose, { connect } from 'mongoose'
import { logger } from '../utils/logger.js';
import { format } from 'date-fns';
import pino_logger from '../utils/pino.js';
import { blogTags, blogCategories, blogSearchSuggestions } from "../utils/utils.js";

const formatDate = (date) => format(new Date(date), 'dd/MM/yyyy HH:mm');

const sanitizeText = (val, max) =>
    typeof val === 'string' ? val.trim().replace(/\s+/g, ' ').slice(0, max) : undefined;

export const composeBlog = async (req, res) => {
    // Safe extract Author data
    const authorId = req.user?.id;
    const authorRole = req.user?.role;
    const autherName = req.user?.name;

    // Safe extract Blog data (e.g., title, content, )
    const category = req.body?.category;
    const title = req.body?.title;
    const content = req.body?.content;
    const tags = req.body?.tags;
    const isNew = req.body?.isNew;

    // Null check
    if (!category || !title || !content || !tags || !isNew) {
        return errRes(res, 400, "INVALID_DATA", "Incomplete data provided");
    }

    if (isNew !== true) {
        return errRes(res, 422, "UNINTENTIONAL", "Unintensional route hit");
    }

    // Malformation check
    if (typeof (category) !== 'string' || typeof (title) !== 'string' || typeof (content) !== 'string') {
        return errRes(res, 400, "INVALID_DATA", "Malformed data received");
    }

    // tags array check
    if (!Array.isArray(req.body.tags)) {
        return errRes(res, 422, "INVALID_DATA", "Malformed data received");
    }

    // Sanitize data
    const s_category = sanitizeText(category, 40);
    const s_title = sanitizeText(title, 100);
    const s_tags = tags.map(tag => sanitizeText(tag, 20));
    const s_content = sanitizeHTML(content);

    // Define blog payload
    const blogPayload = {
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

    // Mongoose transaction for safe write.
    const tSession = await mongoose.startSession()

    try {
        // Transaction start.
        tSession.startTransaction();

        // Define new Blog.
        const newBlog = new blog(blogPayload);

        // Save new blog to database.
        await newBlog.save({
            session: tSession
        });

        // Commit successfulll transactions.
        await tSession.commitTransaction();

        // Response
        return sucRes(res, "New blog created and will be live after review");

    } catch (error) {
        // Rollback if something goes wrong.
        await tSession.abortTransaction();

        // Get the enviroment type fromt enviroment variables.
        const NODE_ENV = process.env.NODE_ENV || 'development';

        // Log to terminal for debugging if service is not in production.
        if (NODE_ENV !== 'production') {
            pino_logger.debug(error, 'Error occured while creating new comment');
        }

        // Format mongoose validation errors.
        if (error.name === "ValidationError") {
            let errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return errRes(res, 422, "VALIDATION_ERROR", "Incomplete data received", {eFields: errors});
        };

        // Log to database.
        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'blogController',
            message: 'Error creating new blog',
            metadata: {
                userType: req.user?.role
            },
            stackTrace: error
        });

        // Error response
        return errRes(res, 500, "INTERNAL_ERROR", "Unexpected error occured while creating new blog");
    } finally {
        // Finally close the session.
        await tSession.endSession;
    }
}

export const categories = (req, res) => {
    try {
        return sucRes(res, "done", { categories: blogCategories } )
    } catch (error) {
        // Get the enviroment type fromt enviroment variables.
        const NODE_ENV = process.env.NODE_ENV || 'development';

        // Log to terminal for debugging if service is not in production.
        if (NODE_ENV !== 'production') {
            pino_logger.debug(error, 'Error occured while serving categories');
        }

        // Log to database.
        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'categoriesServer',
            message: 'Error serving categories',
            stackTrace: error
        });

        // Error response
        return errRes(res, 500, "INTERNAL_ERROR", "Unexpected error occured while getting categories");
    }
}

export const suggestions = (req, res) => {
    const { q } = req.query;
    if (!q) {
        return errRes(res, 400, "INVALID_DATA", "Cannot suggest without query");
    }
    try {
        const r = blogSearchSuggestions.filter(f => f.toLowerCase().includes(q.toLowerCase())).slice(0, 10);
        return sucRes(res, "done", { suggestions: r })
    } catch (error) {
        // Get the enviroment type fromt enviroment variables.
        const NODE_ENV = process.env.NODE_ENV || 'development';

        // Log to terminal for debugging if service is not in production.
        if (NODE_ENV !== 'production') {
            pino_logger.debug(error, 'Error occured while serving suggestions');
        }

        // Log to database.
        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'suggestionsServer',
            message: 'Error serving suggestions',
            stackTrace: error
        });

        // Error response
        return errRes(res, 500, "INTERNAL_ERROR", "Unexpected error occured while getting suggestions");
    }
}

export const tags = (req, res) => {
    try {
        return sucRes(res, "done", { tags: blogTags } )
    } catch (error) {
        // Get the enviroment type fromt enviroment variables.
        const NODE_ENV = process.env.NODE_ENV || 'development';

        // Log to terminal for debugging if service is not in production.
        if (NODE_ENV !== 'production') {
            pino_logger.debug(error, 'Error occured while serving tags');
        }

        // Log to database.
        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'tagsServer',
            message: 'Error serving tags',
            stackTrace: error
        });

        // Error response
        return errRes(res, 500, "INTERNAL_ERROR", "Unexpected error occured while getting tags");
    }
}

export const getMyBlogs = async (req, res) => {
    // Safe extract user details from the request token
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const userName = req.user?.name;

    try {
        const userBlogs = await blog.find({ 'author.id': userId, isAvailable: true })
            .select('author metadata title status blogId createdAt updatedAt')
            .sort({ createdAt: -1 })

        if (userBlogs.length <= 0) {
            return errRes(res, 404, "NOT_FOUND", "Blogs not found");
        }

        const alteredBlogs = [];

        for (const blog of userBlogs) {
            const payload = {
                author: {
                    name: blog.author.name,
                    role: blog.author.role
                },
                metadata: {
                    category: blog.metadata.category,
                    tags: blog.metadata.tags,
                    likes: blog.metadata.likes.length
                },
                title: blog.title,
                status: blog.status,
                blogId: blog.blogId,
                createdAt: formatDate(blog.createdAt),
                updatedAt: formatDate(blog.updatedAt)
            }
            alteredBlogs.push(payload)
        }

        return sucRes(res, "Done", { blogs: alteredBlogs });

    } catch (error) {
        // Get the enviroment type fromt enviroment variables.
        const NODE_ENV = process.env.NODE_ENV || 'development';

        // Log to terminal for debugging if service is not in production.
        if (NODE_ENV !== 'production') {
            pino_logger.debug(error, 'Error occured while serving tags');
        }

        // Log to database.
        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'tagsServer',
            message: 'Error serving tags',
            metadata: {
                userId: userId,
                usertype: userRole
            },
            stackTrace: error
        });

        // Error response
        return errRes(res, 500, "INTERNAL_ERROR", "Unexpected error occured while getting tags");
    }
}

export const getSpBlog = async (req, res) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const userName = req.user?.name;

    const blogId = req.params.viewId

    if (!blogId) {
        res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INCOMPLETE_DATA",
                message: "Blog id not provided."
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });
    }

    try {
        const ublog = await blog.findOne({ blogId: blogId, isAvailable: true, 'author.id': userId })
        if (!ublog) {
            return res.status(404).json({
                success: false,
                status: 404,
                error: {
                    code: "NOT_FOUND",
                    message: "No blog found or Invalid blog id",
                },
                metadata: {
                    server_time: Date.now(),
                    version: process.env.API_VERSION || 'v0.0.0'
                }
            });
        }

        const payload = {
            author: {
                name: ublog.author.name,
                role: ublog.author.role
            },
            metadata: {
                category: ublog.metadata.category,
                tags: ublog.metadata.tags,
                likes: ublog.metadata.likes.length
            },
            title: ublog.title,
            content: ublog.content,
            isAvailable: ublog.isAvailable,
            status: ublog.status
        }

        res.json({
            success: true,
            status: 200,
            data: {
                blog: payload
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });

    } catch (error) {
        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'getSpBlog',
            message: 'Error finding blog',
            metadata: {
                userType: req.userRole
            },
            stackTrace: error
        });
        res.status(500).json({
            success: false,
            status: 500,
            error: {
                code: "INTERNAL_ERROR",
                message: "Unexpected error occured while finding blog."
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });
    }
}

export const updateBlog = async (req, res) => {
    const userId = req.user?.id;
    const blogId = req.params?.blogId

    const category = req.body?.category;
    const title = req.body?.title;
    const content = req.body?.content;
    const tags = req.body?.tags;
    const isNew = req.body?.isNew;

    // Null check and blog Id is just a custom string
    if (!category || !title || !content || !tags || !blogId) {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INVALID_DATA",
                message: "Incomplete data provided."
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });
    }

    if (isNew !== false) {
        return res.status(422).json({
            success: false,
            status: 422,
            error: {
                code: "UNINTENTIONAL",
                message: "Unintentional route hit."
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });
    }

    // Malformation check
    if (typeof (category) !== 'string' || typeof (title) !== 'string' || typeof (content) !== 'string') {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INVALID_DATA",
                message: "Malformed data provided."
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });
    }

    // tags array check
    if (!Array.isArray(tags)) {
        return res.status(422).json({
            success: false,
            status: 422,
            error: {
                code: "INVALID_DATA",
                message: "Tags must be an Array."
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });
    }

    // Sanitize data (every tag is isolated means its first fetched from the server predefined and chosen by the client and then sent back to then sanitized)
    const s_category = sanitizeText(category, 40);
    const s_title = sanitizeText(title, 100);
    const s_tags = tags.map(tag => sanitizeText(tag, 20));
    const s_content = sanitizeHTML(content);

    const tSession = await mongoose.startSession()

    try {
        tSession.startTransaction();

        const userBlog = await blog.findOne({ blogId: blogId }, null, { session: tSession }).select('author');

        if (!userBlog) {
            await tSession.abortTransaction();
            return res.status(404).json({
                success: false,
                status: 404,
                error: {
                    code: "NOT_FOUND",
                    message: "requested data not found."
                },
                metadata: {
                    server_time: Date.now(),
                    version: process.env.API_VERSION || 'v0.0.0'
                }
            });
        }

        if (userBlog.author.id !== userId) {
            await tSession.abortTransaction();
            return res.status(403).json({
                success: false,
                status: 403,
                error: {
                    code: "NOT_ALLOWED",
                    message: "User not allowed to perform this action."
                },
                metadata: {
                    server_time: Date.now(),
                    version: process.env.API_VERSION || 'v0.0.0'
                }
            });
        }

        const pushUpdate = await blog.updateOne(
            { blogId: blogId },
            {
                $set: {
                    'metadata.category': s_category,
                    'metadata.tags': s_tags,
                    title: s_title,
                    content: s_content,
                    'status.state': "DRAFT",
                }
            },
            { session: tSession }
        )

        if (!pushUpdate.acknowledged) {
            throw new Error('Not updated')
        }

        await tSession.commitTransaction()

        res.json({
            success: true,
            status: 200,
            data: {
                message: 'Updated!'
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });


    } catch (error) {
        await tSession.abortTransaction()
        if (error.name === "ValidationError") {
            let errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(422).json({
                success: false,
                status: 422,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Incomplete data provided.",
                    eFields: errors
                },
                metadata: {
                    server_time: Date.now(),
                    version: process.env.API_VERSION || 'v0.0.0'
                }
            });
        };
        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'updateBlog',
            message: 'Error updating blog',
            metadata: {
                userType: req.user?.role,
                userId: req.user?.id,
                orderId: blogId
            },
            stackTrace: error
        });
        res.status(500).json({
            success: false,
            status: 500,
            error: {
                code: "INTERNAL_ERROR",
                message: "Unexpected error occured while updating."
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });
    } finally {
        await tSession.endSession();
    }
}

export const softDeleteBlog = async (req, res) => {
    // Extract user data & blog id from request
    const userId = req.user?.id;
    const blogId = req.params.blogId;

    // Null check blog id
    if (!blogId) {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INVALID_DATA",
                message: "Incomplete data provided."
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });
    }

    // Create mongoose transaction session.
    const tSession = await mongoose.startSession();

    try {
        // Start the transaction.
        tSession.startTransaction();

        // Find the requested blog from the server.
        const requestedBlog = await blog.findOne({ blogId: blogId }, null, { session: tSession }).select('author status isAvailable');

        // Check if the requested blog exists.
        if (!requestedBlog) {
            await tSession.abortTransaction();
            return res.status(404).json({
                success: false,
                status: 404,
                error: {
                    code: "NOT_FOUND",
                    message: "Requested content is not available"
                },
                metadata: {
                    server_time: Date.now(),
                    version: process.env.API_VERSION || 'v0.0.0'
                }
            })
        }

        // Check if the author made the deletion
        if (requestedBlog.author.id !== userId) {
            await tSession.abortTransaction();
            return res.status(403).json({
                success: false,
                status: 403,
                error: {
                    code: "NOT_ALLOWED",
                    message: "User not allowed to perform this action."
                },
                metadata: {
                    server_time: Date.now(),
                    version: process.env.API_VERSION || 'v0.0.0'
                }
            });
        }

        // Update the blog availability flag to false.
        const alterAvailability = await blog.updateOne(
            { blogId: blogId },
            {
                $set: {
                    isAvailable: false
                }
            },
            { session: tSession }
        )

        // Check if the update is acknowledged.
        if (!alterAvailability.acknowledged) {
            throw new Error('Not disabled/ soft deleted')
        }

        // Log the deletion for audit purposes
        logger({
            level: 'info',
            origin: 'mainService',
            originName: 'softDeleteBlog',
            message: 'Blog made unavailable',
            metadata: {
                userType: req.user?.role,
                userId: req.user?.id,
                orderId: blogId
            }
        });

        // Commit all db transactions.
        await tSession.commitTransaction();

        res.json({
            success: true,
            status: 200,
            data: {
                message: 'Updated!'
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });

    } catch (error) {
        // Abort transaction on error
        await tSession.abortTransaction();

        // Check for mongoose validation errors
        if (error.name === "ValidationError") {
            let errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(422).json({
                success: false,
                status: 422,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Incomplete data provided.",
                    eFields: errors
                },
                metadata: {
                    server_time: Date.now(),
                    version: process.env.API_VERSION || 'v0.0.0'
                }
            });
        };

        // Log the error
        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'softDeleteBlog',
            message: 'Error deleting blog',
            metadata: {
                userType: req.user?.role,
                userId: req.user?.id,
                orderId: blogId
            },
            stackTrace: error
        });

        // Respond with error
        res.status(500).json({
            success: false,
            status: 500,
            error: {
                code: "INTERNAL_ERROR",
                message: "Unexpected error occured while deleting."
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });
    } finally {
        // Final close the session
        await tSession.endSession();
    }
}

export const blogsFeed = async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 10));
    const search = req.query.search || null

    try {
        const skip = (page - 1) * limit;

        if (!search || search.trim() === "") {
            const filter = { isAvailable: true, "status.state": "LIVE" };

            const [blogs, total] = await Promise.all([
                blog.find(filter)
                    .sort({ createdAt: -1 })
                    .select('author blogId metadata title content isAvailable status createdAt')
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                blog.countDocuments(filter)
            ]);

            let uBlogs = [];

            for (const cBlog of blogs) {
                const payload = {
                    author: {
                        name: cBlog.author.name,
                        role: cBlog.author.role
                    },
                    metadata: {
                        category: cBlog.metadata.category,
                        tags: cBlog.metadata.tags,
                        likes: cBlog.metadata.likes.length,
                        reads: cBlog.metadata.reads.length
                    },
                    title: cBlog.title,
                    blogId: cBlog.blogId,
                    createdAt: formatDate(cBlog.createdAt)
                }
                uBlogs.push(payload);

            }

            return res.json({
                success: true,
                status: 200,
                data: {
                    blogs: uBlogs,
                    pagination: {
                        page,
                        limit,
                        totalPages: Math.ceil(total / limit),
                        hasNextPage: page * limit < total,
                    }
                },
                metadata: {
                    server_time: Date.now(),
                    version: process.env.API_VERSION || 'v0.0.0'
                }
            });

        }

        const keywords = search.trim().split(" ").filter(Boolean);

        const results = await blog.aggregate([
            {
                $match: {
                    isAvailable: true,
                    "status.state": "LIVE",
                    $or: keywords.map(k => ({
                        title: { $regex: k, $options: "i" }
                    }))
                }
            },
            {
                $addFields: {
                    score: {
                        $add: keywords.map(k => ({
                            $cond: [
                                { $regexMatch: { input: "$title", regex: k, options: "i" } },
                                10, 0
                            ]
                        }))
                    }
                }
            },

            { $match: { score: { $gt: 0 } } },
            { $sort: { score: -1 } },

            {
                $facet: {
                    blogs: [
                        { $skip: skip },
                        { $limit: limit },
                        { $project: { author: 1, blogId: 1, metadata: 1, title: 1, content: 1, isAvailable: 1, status: 1, createdAt: 1 } }
                    ],
                    totalCount: [
                        { $count: "total" }
                    ]
                }
            }
        ])

        const blogs = results[0].blogs;
        const total = results[0].totalCount[0]?.total || 0;

        let uBlogs = [];

        for (const cBlog of blogs) {
            const payload = {
                author: {
                    name: cBlog.author.name,
                    role: cBlog.author.role
                },
                metadata: {
                    category: cBlog.metadata.category,
                    tags: cBlog.metadata.tags,
                    likes: cBlog.metadata.likes.length,
                    reads: cBlog.metadata.reads.length
                },
                title: cBlog.title,
                blogId: cBlog.blogId,
                createdAt: formatDate(cBlog.createdAt)
            }
            uBlogs.push(payload);

        }

        return res.json({
            success: true,
            status: 200,
            data: {
                blogs: uBlogs,
                pagination: {
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                    hasNextPage: page * limit < total,
                }
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });

    } catch (error) {

        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'blogsFeed',
            message: 'Error finding blogs',
            metadata: {},
            stackTrace: error
        });

        // Respond with error
        res.status(500).json({
            success: false,
            status: 500,
            error: {
                code: "INTERNAL_ERROR",
                message: "Unexpected error occured while finding recomended blogs."
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });
    }
}

export const getFeedBlog = async (req, res) => {
    const userId = req.user?.id ?? null;
    const blogId = req.params.blogId;

    if (!blogId) {
        res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INCOMPLETE_DATA",
                message: "Blog id not provided."
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });
    }

    try {
        const ublog = await blog.findOne({ blogId: blogId, isAvailable: true })
        if (!ublog) {
            return res.status(404).json({
                success: false,
                status: 404,
                error: {
                    code: "NOT_FOUND",
                    message: "No blog found or Invalid blog id",
                },
                metadata: {
                    server_time: Date.now(),
                    version: process.env.API_VERSION || 'v0.0.0'
                }
            });
        }

        const payload = {
            author: {
                name: ublog.author.name,
                role: ublog.author.role
            },
            metadata: {
                category: ublog.metadata.category,
                tags: ublog.metadata.tags,
                likes: ublog.metadata.likes.length,
                isLiked: userId ? ublog.metadata.likes.includes(userId) : false,
                reads: ublog.metadata.reads.length,
                isRead: userId ? ublog.metadata.reads.includes(userId) : false
            },
            title: ublog.title,
            content: ublog.content,
            createdAt: formatDate(ublog.createdAt),
            updatedAt: formatDate(ublog.updatedAt)
        }

        res.json({
            success: true,
            status: 200,
            data: {
                blog: payload
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });

    } catch (error) {
        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'getFeedBlog',
            message: 'Error finding blog',
            metadata: {
                orderId: blogId
            },
            stackTrace: error
        });
        res.status(500).json({
            success: false,
            status: 500,
            error: {
                code: "INTERNAL_ERROR",
                message: "Unexpected error occured while finding blog."
            },
            metadata: {
                server_time: Date.now(),
                version: process.env.API_VERSION || 'v0.0.0'
            }
        });
    }
}

export const recordBlogLike = async (req, res) => {

    const userId = req.user?.id;
    const blogId = req.params.blogId;

    if (!blogId) return errRes(res, 400, "INCOMPLETE_DATA", "Necessary fields missing");

    const tSession = await mongoose.startSession();

    try {

        tSession.startTransaction();

        const rBlog = await blog.findOne({ blogId: blogId, isAvailable: true }, null, { session: tSession });

        if (!rBlog) {
            await tSession.abortTransaction();
            return errRes(res, 404, "NOT_FOUND", "Dependant data not found");
        }

        const ownerId = rBlog.author.id;
        if (userId !== ownerId) {
            await tSession.abortTransaction();
            return errRes(res, 402, "NOT_ALLOWED", "Action now allowed");
        }

        const isLiked = rBlog.metadata.likes.includes(userId);
        const updatedBlog = await blog.findOneAndUpdate(
            { blogId },
            isLiked
                ? { $pull: { 'metadata.likes': userId } }
                : { $push: { 'metadata.likes': userId } },
            { returnDocument: 'after', projection: { 'metadata.likes': 1 } },
            { session: tSession }
        );

        await tSession.commitTransaction();

        const data = {
            liked: !isLiked,
            likesCount: updatedBlog.metadata.likes.length
        }

        sucRes(res, "Toggled like", data);

    } catch (error) {
        // Abort db transaction on failure
        await tSession.abortTransaction();

        // Get the enviroment type fromt enviroment variables
        const NODE_ENV = process.env.NODE_ENV || 'development';

        // Log to terminal for debugging if service is not in production
        if (NODE_ENV !== 'production') {
            pino_logger.debug(error, 'Error occured while processing blog like');
        }

        // Log to main logbook
        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'recordBlogLike',
            message: 'Error occured while sending processing blog likes',
            metadata: {
                orderId: blogId
            },
            stackTrace: error
        });

        // Respond with server error
        return errRes(res, 500, "INTERNAL_ERROR", "Unexpected error occured while toggling blog like")

    } finally {
        await tSession.endSession();
    }

}

export const registerRead = async (req, res) => {
    const userId = req.user?.id ?? null;
    const blogId = req.params.blogId;

    if (!blogId) return errRes(res, 400, "INCOMPLETE_DATA", "Necessary fields missing.")

    // create mongoose session
    const tSession = await mongoose.startSession();

    try {
        // Start the tranaction
        tSession.startTransaction();

        // Find the blog from the database
        const update = await blog.updateOne(
            { blogId: blogId },
            { $push: { 'metadata.reads': userId ? userId : "GUEST" } },
            { session: tSession }
        )

        if (!update.acknowledged) {
            throw new Error('Not updated')
        }

        await tSession.commitTransaction()

        sucRes(res, "Read Recorded!")

    } catch (error) {

        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'registerRead',
            message: 'Error registering blog read',
            metadata: {
                orderId: blogId
            },
            stackTrace: error
        });

        return errRes(res, 500, "INTERNAL_ERROR", "Unexpected error occured while registering a read to the blog")

    } finally {
        await tSession.endSession()
    }
}

// ****************************************** DEPRECATED COMMENTING ********************************** //

// export const toggleLike = async (req, res) => {
//     // Load initial data
//     const userId = req.user?.id;
//     const commentId = req.params.commentId;

//     // Precheck blogId
//     if (!commentId) return errRes(res, 400, "INCOMPLETE DATA", "Necessary data fields missing")

//     // Create a mongoose session
//     const tSession = await mongoose.startSession();

//     try {
//         // Start mongoose transaction
//         tSession.startTransaction();

//         // Find the corresponding comment
//         const comment = await blogComment.findOne({ commentId: commentId }, null, { session: tSession });

//         // Check if the comment exists
//         if (!comment) {
//             // Abort further transaction
//             await tSession.abortTransaction();
//             return errRes(res, 404, "NOT_FOUND", "Dependent data not found")
//         }

//         // Check if the owner requested the content
//         const ownerId = comment.author.id;
//         if (userId !== ownerId) {
//             // Abort further transaction
//             await tSession.abortTransaction();
//             return errRes(res, 402, "NOT_ALLOWED", "Action now allowed")
//         }

//         // Store if the user is already liked or not
//         const isLiked = comment.metadata.likes.includes(userId);

//         // Update the comment
//         const updatedComment = await blogComment.findOneAndUpdate(
//             { commentId },
//             isLiked
//                 ? { $pull: { 'metadata.likes': userId } }
//                 : { $push: { 'metadata.likes': userId } },
//             { returnDocument: 'after', projection: { 'metadata.likes': 1 } },
//             { session: tSession }
//         );

//         // Commit transactions
//         await tSession.commitTransaction();

//         const data = {
//             liked: !isLiked,
//             likesCount: updatedComment.metadata.likes.length
//         }

//         return sucRes(res, "Operation success", data);

//     } catch (error) {

//         // Abort db transaction on failure
//         await tSession.abortTransaction();

//         // Get the enviroment type fromt enviroment variables
//         const NODE_ENV = process.env.NODE_ENV || 'development';

//         // Log to terminal for debugging if service is not in production
//         if (NODE_ENV !== 'production') {
//             pino_logger.debug(error, 'Error occured while processing likes');
//         }

//         // Log to main logbook
//         logger({
//             level: 'error',
//             origin: 'mainService',
//             originName: 'toggleLIke',
//             message: 'Error occured while sending processing likes',
//             metadata: {
//                 orderId: commentId
//             },
//             stackTrace: error
//         });

//         // Respond with server error
//         return errRes(res, 500, "INTERNAL_ERROR", "Unexpected error occured while processing likes")

//     } finally {
//         await tSession.endSession();
//     }

// }

// // comments controller new version with replies aggregation
// export const getComments = async (req, res) => {
//     // Initial data load
//     const page = Math.max(1, parseInt(req.query.page) || 1);
//     const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 10));
//     const blogId = req.params.blogId;
//     const userId = req.user?.id ?? null;

//     // Precheck blog id
//     if (!blogId) return errRes(res, 400, "INCOMPLETE_DATA", "Missing necessary fields");

//     // Perform all critical tasks in try catch isolation
//     try {

//         // Start the db transaction
//         tSession.startTransaction();

//         // Search parameters for db
//         const searchParameters = {
//             blogId: blogId,
//             parentId: null,
//             rootId: null
//         }

//         const total = await blogComment.countDocuments(searchParameters);

//         const results = await blogComment.aggregate([
//             // Get all the comments for a specific blog
//             { $match: searchParameters },

//             // Sort to newest first
//             { $sort: { createdAt: -1 } },

//             // Pagination
//             { $skip: (page - 1) * limit },
//             { $limit: limit },

//             // Join replies
//             {
//                 $lookup: {
//                     from: 'blogcomments',
//                     localField: 'commentId',
//                     foreignField: 'parentId',
//                     as: 'replies'
//                 }
//             },

//             // Add field for replies and likes count
//             {
//                 $addFields: {
//                     repliesCount: { $size: '$replies' },
//                     likesCount: { $size: '$metadata.likes' },
//                     isLiked: { $in: [userId, '$metadata.likes'] }
//                 }
//             },

//             // remove replies array leaving only count
//             { $unset: 'replies' },

//             // Return required fields
//             {
//                 $project: {
//                     commentId: 1,
//                     blogId: 1,
//                     content: 1,
//                     author: 1,
//                     isAvailable: 1,
//                     repliesCount: 1,
//                     likesCount: 1,
//                     isLiked: 1,
//                     createdAt: 1
//                 }
//             }
//         ])

//         // Post process comments
//         const processedComments = results.map((
//             { _id, blogId, author: { id, ...restAuthor }, content, isAvailable, createdAt, ...rest }
//         ) => ({
//             ...rest,
//             author: restAuthor,
//             content: isAvailable ? content : "[Comment removed]",
//             isAvailable: isAvailable,
//             createdAt: formatDate(createdAt),
//             isOwned: id === userId ? true : false
//         }))

//         sucRes(res, "done!", {
//             comments: processedComments,
//             pagination: {
//                 page,
//                 limit,
//                 totalPages: Math.ceil(total / limit),
//                 hasNextPage: page * limit < total,
//                 totalDocs: total
//             }
//         })

//     } catch (error) {
//         // Get the enviroment type fromt enviroment variables
//         const NODE_ENV = process.env.NODE_ENV || 'development';

//         // Log to terminal for debugging if service is not in production
//         if (NODE_ENV !== 'production') {
//             pino_logger.debug(error, 'Error occured while sending comments to the client');
//         }

//         // Log to main logbook
//         logger({
//             level: 'error',
//             origin: 'mainService',
//             originName: 'getComments',
//             message: 'Error occured while sending comments to the client',
//             metadata: {
//                 orderId: blogId
//             },
//             stackTrace: error
//         });

//         // Respond with server error
//         return errRes(res, 500, "INTERNAL_ERROR", "Unexpected Error while loading comments");

//     }
//     // **********END OF THE CONTROLLER
// }

// // Replies controller
// export const getReplies = async (req, res) => {
//     // Initial data extraction.
//     const page = Math.max(1, parseInt(req.query.page) || 1);
//     const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 10));
//     const commentId = req.params.commentId;
//     const userId = req.user?.id ?? null;

//     // Precheck blog id.
//     if (!commentId) return errRes(res, 400, "INCOMPLETE_DATA", "Missing necessary data");

//     // Perform all critical tasks in try catch isolation.
//     try {
//         // Count total docs for pagination.
//         const total = await blogComment.countDocuments({ rootId: commentId });

//         // Process requested data.
//         const results = await blogComment.aggregate([

//             // Get all the comments for a specific blog.
//             { $match: { rootId: commentId } },

//             // Sort to newest first.
//             { $sort: { createdAt: -1 } },

//             // Pagination.
//             { $skip: (page - 1) * limit },
//             { $limit: limit },

//             // Add field for replies and likes count.
//             {
//                 $addFields: {
//                     likesCount: { $size: '$metadata.likes' },
//                     isLiked: { $in: [userId, '$metadata.likes'] }
//                 }
//             },

//             // Return required fields.
//             {
//                 $project: {
//                     commentId: 1,
//                     content: 1,
//                     author: 1,
//                     isAvailable: 1,
//                     likesCount: 1,
//                     isLiked: 1,
//                     createdAt: 1,
//                     parentId: 1,
//                 }
//             }

//         ])

//         // Post process comments.
//         const processedReplies = results.map((
//             { _id, author: { id, ...restAuthor }, content, isAvailable, createdAt, ...rest }
//         ) => ({
//             ...rest,
//             author: restAuthor,
//             content: isAvailable ? content : "[Reply removed]",
//             createdAt: formatDate(createdAt),
//             isOwned: id === userId ? true : false,
//             isAvailable: isAvailable
//         }))

//         // Define pagination payload.
//         const pagination = {
//             page,
//             limit,
//             totalPages: Math.ceil(total / limit),
//             hasNextPage: page * limit < total
//         }

//         // Respond with success.
//         sucRes(res, "Fetched success!", { replies: processedReplies, pagination })

//     } catch (error) {
//         // Get the enviroment type fromt enviroment variables.
//         const NODE_ENV = process.env.NODE_ENV || 'development';

//         // Log to terminal for debugging if service is not in production.
//         if (NODE_ENV !== 'production') {
//             pino_logger.debug(error, 'Error occured while sending replies to the client');
//         }

//         // Log to main logbook.
//         logger({
//             level: 'error',
//             origin: 'mainService',
//             originName: 'getReplies',
//             message: 'Error occured while sending replies to the client',
//             metadata: {
//                 orderId: commentId
//             },
//             stackTrace: error
//         });

//         // Respond with server error.
//         return errRes(res, 500, "INTERNAL_ERROR", "Unexpected error occured while loading replies");

//     }
// }

// export const newCommentHandler = async (req, res) => {
//     // Extract user data from authoriser.
//     const authorId = req.user?.id;
//     const authorRole = req.user?.role;
//     const authorName = req.user?.name;

//     // Extract path params, query params and body.
//     const blogId = req.params.blogId;
//     const parentId = req.body.parentId || null;
//     const content = req.body.content || null;

//     let rootId = null;
//     const replyTo = { id: null, name: null };

//     // Check if the necessary fields are present
//     if (!blogId || !content) return errRes(res, 400, "INCOMPLETE_DATA", "Missing necessary data");

//     // Create a mongoose session for safe query executions.
//     const tSession = await mongoose.startSession();

//     try {
//         // start the transaction session.
//         tSession.startTransaction();

//         // Find the corresponding blog.
//         const cBlog = await blog.findOne({ blogId: blogId, isAvailable: true }, null, { session: tSession });
//         if (!cBlog) {
//             await tSession.abortTransaction();
//             return errRes(res, 404, "NOT_FOUND", "Cannot find dependent data");
//         }

//         // Then check if the request is for a reply or a root comment.
//         if (parentId) {
//             const comment = await blogComment.findOne({ commentId: parentId, isAvailable: true }, null, { session: tSession });
//             if (!comment) {
//                 await tSession.abortTransaction();
//                 return errRes(res, 404, "NOT_FOUND", "Cannot find dependent data");
//             }
//             rootId = comment.rootId ?? comment.commentId;
//             replyTo.id = comment.author.id;
//             replyTo.name = comment.author.name;
//         }

//         // Define insertion payload.
//         const payload = {
//             blogId: blogId,
//             parentId: parentId,
//             rootId: rootId,
//             replyTo: replyTo,
//             author: {
//                 id: authorId,
//                 name: authorName,
//                 role: authorRole
//             },
//             content: sanitizeText(content, 2000)
//         }

//         // Insert to db.
//         const newComment = new blogComment(payload);
//         await newComment.save({ session: tSession });

//         // Commit all db transaction.
//         await tSession.commitTransaction();

//         // Respond success.
//         sucRes(res, "Comment added!");

//     } catch (error) {
//         // Abort session on click
//         await tSession.abortTransaction();

//         // Get the enviroment type fromt enviroment variables
//         const NODE_ENV = process.env.NODE_ENV || 'development';

//         // Log to terminal for debugging if service is not in production
//         if (NODE_ENV !== 'production') {
//             pino_logger.debug(error, 'Error occured while creating new comment');
//         }

//         if (error.name === "ValidationError") {
//             let errors = {};
//             Object.keys(error.errors).forEach((key) => {
//                 errors[key] = error.errors[key].message;
//             });
//             return errRes(res, 422, "VALIDATION_ERROR", "Missing necessary Fields")
//         }

//         // Log to main logbook
//         logger({
//             level: 'error',
//             origin: 'mainService',
//             originName: 'newCommentHandler',
//             message: 'Error occured while adding new comment',
//             metadata: {
//                 orderId: blogId,
//                 userId: authorId,
//                 userType: authorRole
//             },
//             stackTrace: error
//         });

//         // Respond with server error.
//         return errRes(res, 500, "INTERNAL_ERROR", "Unexpected error occured");

//     } finally {
//         // Finally end the session.
//         await tSession.endSession();
//     }
// }

// export const editCommentHandler = async (req, res) => {
//     // User data from authoriser.
//     const authorId = req.user?.id;
//     const authorRole = req.user?.role;
//     const authorName = req.user?.name;

//     // New Comment data.
//     const commentId = req.params.commentId;
//     const newContent = req.body.content || null;

//     // Null check incoming data
//     if (!commentId || !newContent) return errRes(res, 400, "INCOMPLETE_DATA", "Missing necessary data");

//     const tSession = await mongoose.startSession();

//     try {
//         // Start mongoose transaction.
//         tSession.startTransaction();

//         const oldComment = await blogComment.findOne({ commentId: commentId, isAvailable: true }, null, { session: tSession });
//         if (!oldComment) {
//             await tSession.abortTransaction();
//             errRes(res, 404, "NOT_FOUND", "Requested content not found");
//         }

//         const ownerId = oldComment.author.id;
//         if (authorId !== ownerId) {
//             // Abort further transaction
//             await tSession.abortTransaction();
//             return errRes(res, 402, "NOT_ALLOWED", "Action now allowed");
//         }

//         const updatedComment = await blogComment.updateOne(
//             { commentId: commentId, isAvailable: true },
//             { $set: { content: sanitizeText(newContent, 2000) } },
//             { session: tSession }
//         );

//         if (!updatedComment.acknowledged) {
//             throw new Error("Not updated");
//         }

//         await tSession.commitTransaction();

//         sucRes(res, "Updated!");

//     } catch (error) {
//         // Abort session on click
//         await tSession.abortTransaction();

//         // Get the enviroment type fromt enviroment variables
//         const NODE_ENV = process.env.NODE_ENV || 'development';

//         // Log to terminal for debugging if service is not in production
//         if (NODE_ENV !== 'production') {
//             pino_logger.debug(error, 'Error occured while creating new comment');
//         }

//         // Log to main logbook
//         logger({
//             level: 'error',
//             origin: 'mainService',
//             originName: 'newCommentHandler',
//             message: 'Error occured while editing comment',
//             metadata: {
//                 orderId: blogId,
//                 userId: authorId,
//                 userType: authorRole
//             },
//             stackTrace: error
//         });

//         // Respond with server error.
//         return errRes(res, 500, "INTERNAL_ERROR", "Unexpected error occured");

//     } finally {
//         await tSession.endSession();
//     }
// }