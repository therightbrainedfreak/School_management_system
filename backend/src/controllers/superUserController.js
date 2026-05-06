import 'dotenv/config'
import { logger, saveAuditLog } from '../utils/logger.js';
import { generateNewUserNotification } from '../utils/mailNotificationService.js';

import admin from '../models/admin.js';
import student from '../models/student.js';
import teacher from '../models/teacher.js';
import parent from '../models/parent.js';
import backoffice from '../models/backoffice.js';

const modelRoleMap = {
    admin: admin,
    student: student,
    teacher: teacher,
    parent: parent,
    backoffice: backoffice
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
                message: "Firstly User role must be provided to create user."
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

const accountActions = {
    ACTIVATE: async ( user, reason, referrerObj ) => {
        user.status = 'active';
        user.deactivationR = reason;
        saveAuditLog({
            targetId: user.userId,
            onModel: user.role,
            performedBy: referrerObj.performedBy,
            performerModel: referrerObj.performerModel,
            action: "ACTIVATE",
            reason: reason
        })
        return user.save();
    },
    DEACTIVATE: async ( user, reason, referrerObj ) => {
        user.status = 'deactivated';
        user.deactivationR = reason;
        saveAuditLog({
            targetId: user.userId,
            onModel: user.role,
            performedBy: referrerObj.performedBy,
            performerModel: referrerObj.performerModel,
            action: "DEACTIVATE",
            reason: reason
        })
        return user.save();
    },
    SUSPEND: async ( user, reason, referrerObj ) => {
        user.status = 'suspended';
        user.deactivationR = reason;
        saveAuditLog({
            targetId: user.userId,
            onModel: user.role,
            performedBy: referrerObj.performedBy,
            performerModel: referrerObj.performerModel,
            action: "SUSPEND",
            reason: reason
        })
        return user.save();
    },
    DROP: async ( user, reason, referrerObj ) => {
        user.status = 'drop';
        user.deactivationR = reason;
        saveAuditLog({
            targetId: user.userId,
            onModel: user.role,
            performedBy: referrerObj.performedBy,
            performerModel: referrerObj.performerModel,
            action: "DROP",
            reason: reason
        })
        return user.save();
    }
};

export const handleAccountActions = async ( req, res ) => {
    // Extract action performer details.
    // Create referrer object for audit logs.
    const referrerObj = {
        performedBy: req.user?.id,
        performerModel: req.user?.role
    };
    // Extract data from the request.
    const { action, reason, role } = req.body || {};
    // check if the required fields are provided.
    if ( !action || !reason || !role ) {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INCOMPLETE_DATA",
                message: "The action, user role and reason must be specified."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    }
    // Extract the user_id from the url parameters.
    const user_id = req.params.userId;
    // Map the action.
    const executeAction = accountActions[action.toUpperCase()];
    // Check if the action is valid or not.
    if ( !executeAction ) {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INVALID_ACTION",
                message: "The specified action is not available."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    };
    // Map user role to the specific schema.
    const MODEL = modelRoleMap[role];
    // Check if the role is valid or not.
    if (!MODEL) {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INVALID_ROLE_MAP",
                message: "Provided role is invalid."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    };
    // Start performing action.
    try {
        const user = await MODEL.findOne({userId: user_id});
        // Check if the user exists in the database.
        if (!user) {
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
        // Execute mapped function.
        await executeAction(user, reason, referrerObj);
        res.status(200).json({
            success: true,
            status: 200,
            data: {
                user: {
                    id: user.userId,
                    username: user.name,
                    role: user.role,
                    status: user.status
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
            message: `Error performing action: ${action} "accounts/actions"`,
            metadata: {
                userId: user_id,
                userType: role
            },
            stackTrace: error.message
        });
        return res.status(500).json({
            success: false,
            status: 500,
            error: {
                code: "INTERNAL_ERROR",
                message: "Unexpected error happended while performing this action."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    };
};