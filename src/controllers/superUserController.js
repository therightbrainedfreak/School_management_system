import 'dotenv/config'
import { logger } from '../utils/logger.js';
import { generateNewUserNotification } from '../utils/mailNotificationService.js';

import admin from '../models/admin.js';
import student from '../models/student.js';
import teacher from '../models/teacher.js';
import parent from '../models/parent.js';

const modelRoleMap = {
    admin: admin,
    student: student,
    teacher: teacher,
    parent: parent
}

// Creation, modification and deletion of super user account can be done manually directly into the database
// as it is the user who can create a admin and backoffice.

export const createUser = async (req, res) => {
    // Extract payload from the req body.
    const userModel = req.body || {};
    // Extact data from the authoriser for logger.
    const userId = req.user?.id;
    const userType = req.user?.role;
    // Check if model exist.
    if (!userModel) {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INCOMPLETE_DATA",
                message: "User data is required to create a user."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        })
    };
    // Check if the data provided by client contains role for mapping.
    const newUserRole = userModel?.role || null;
    if (!newUserRole) {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INCOMPLETE_DATA",
                message: "User role is required to create a user."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    };
    // Map model to the role.
    const MODEL = modelRoleMap[newUserRole];
        if ( !MODEL ) {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INVALID_ROLE_MAP",
                message: "Invalid role provided."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    };
    // Proceed for user creation.
    try {
        // Create model from the payload.
        const newUser = new MODEL(userModel);
        // Attemp to save the model.
        await newUser.save();
        // Record Acknowledgement
        const receiptData = newUser;
        // Attemp a notification for the new admin created.
        generateNewUserNotification(
            receiptData.name,
            receiptData.userId,
            receiptData.role,
            receiptData.createdAt,
            receiptData.email
        );
        // Log user creation success;
        logger({
            level: 'info',
            origin: 'mainService',
            originName: 'superUserController',
            message: `Created new User: ${receiptData.userId}`,
            metadata: {
                userId: userId,
                userType: userType
            },
        });
        // Respond with success.
        res.status(201).json({
            success: true,
            status: 201,
            message: "User created!",
            data: {
                user: {
                    userId: receiptData.userId,
                    username: receiptData.name,
                    role: receiptData.Role
                }
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    } catch (error) {
        // Check and respond accordingly if the error is a validation error.
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
                    message: "Incomplete or incorrect data provided.",
                    eFields: errors
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        };
        // Check for error regarding duplicate user creation
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                status: 409,
                error: {
                    code: "DUPLICACY_ERROR",
                    message: "User already exist."
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        };
        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'superUserController',
            message: 'error creating new user',
            metadata: {
                userId: userId,
                userType: userType
            },
            stackTrace: error.message
        });
        // Respond for any other unexpected errors.
        res.status(500).json({
            success: false,
            status: 500,
            error: {
                code: "INTERNAL_ERROR",
                message: "Unexpected error happended while creating user."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    };
};

export const deactivateAdmin = async (req, res) => {
    // Extract data from request payload.
    const { adminId, reason } = req.body || {};
    // Id is required it cannot be empty.
    if (!adminId) {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INCOMPLETE_DATA",
                message: "Details to deactivate admin required."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    };
    const data = {
        status: 'deactivated',
        deactivationR: reason || 'unspecified'
    }
    try {
        // Set status to deactivated in database.
        const deactivatedUser = await admin.findOneAndUpdate({ userId: adminId }, { $set: data });
        if (!deactivatedUser) {
            return res.status(404).json({
                success: false,
                status: 404,
                error: {
                    code: "USER_NOT_FOUND",
                    message: "Requested user no longer exists on the server."
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        };
        logger({
            level: 'info',
            origin: 'mainService',
            originName: 'superUserController',
            message: 'admin deactivated',
            metadata: {
                userId: req.user?.id,
                userType: req.user?.role
            }
        });
        return res.json({
            success: true,
            status: 200,
            data: {
                user: {
                    id: deactivatedUser.userId,
                    username: deactivatedUser.name,
                    role: deactivatedUser.role,
                    status: deactivatedUser.status
                }
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    } catch (error) {
        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'superUserController',
            message: 'Error deactivating admin.',
            metadata: {
                userId: req.user?.id,
                userType: req.user?.role
            },
            stackTrace: error
        });
        return res.status(500).json({
            success: false,
            status: 500,
            error: {
                code: "INTERNAL_ERROR",
                message: "Unexpected error happended while deactivating user."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    };
};

export const activateAdmin = async (req, res) => {
    // Extract data from body.
    const { adminId } = req.body || {};
    // Check if required fields are present.
    if (!adminId) {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INCOMPLETE_DATA",
                message: "Required data is not present."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    };
    const data = {
        status: 'active',
        deactivationR: ''
    }
    try {
        // Find the user and set it the status to activated.
        const activatedUser = await admin.findOneAndUpdate({ userId: adminId }, { $set: data });
        if (!activatedUser) {
            return res.status(404).json({
                success: false,
                status: 404,
                error: {
                    code: "USER_NOT_FOUND",
                    message: "User no  longer exists on the server."
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        }
        logger({
            level: 'info',
            origin: 'mainService',
            originName: 'superUserController',
            message: 'Activated admin successfully!',
            metadata: {
                userId: req.user?.id,
                userType: req.user?.role
            }
        });
        return res.json({
            success: true,
            status: 200,
            data: {
                user: {
                    id: activatedUser.userId,
                    username: activatedUser.name,
                    role: activatedUser.role,
                    status: activatedUser.status
                }
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    } catch (error) {
        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'superUserController',
            message: 'Error Activating admin.',
            metadata: {
                userId: req.user?.id,
                userType: req.user?.role
            },
            stackTrace: error.message
        });
    };
    return res.status(500).json({
        success: false,
        status: 500,
        error: {
            code: "INTERNAL_ERROR",
            message: "Unexpected error happended while activating user."
        },
        metadata: {
            server_time: Date.now(),
            version: "v1.0.0"
        }
    });
};