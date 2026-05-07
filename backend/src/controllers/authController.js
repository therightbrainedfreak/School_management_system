import 'dotenv/config';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';

import admin from '../models/admin.js';
import student from '../models/student.js';
import teacher from '../models/teacher.js';
import parent from '../models/parent.js';
import su from '../models/superUser.js';
import backoffice from '../models/backoffice.js'

const modelRoleMap = {
    admin: admin,
    student: student,
    teacher: teacher,
    parent: parent,
    superuser: su,
    backoffice: backoffice
}

export const loginController = async (req, res) => {
    // Extract credentials from the request.
    let { user_id, role, password } = req.body || {};
    // response with error if creadentials are incomplete.
    if ( !user_id || !role || !password ) {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INCOMPLETE_CREDS",
                message: "Incomplete credentials"
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    };

    // always set user id to uppercase
    user_id = user_id.toUpperCase();
    // Map the database model to the role provided
    const MODEL = modelRoleMap[role];
    // Respond with error if map doesn't have the provided role.
    if ( !MODEL ) {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INVALID_ROLE_MAP",
                message: "Invalid Credentials"
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    };
    try {
        // find the user from the database.
        const user = await MODEL.findOne({ userId: user_id}).select('username status userId password role jwtTokenVersion');
        // Respond with error if user is not found.
        if ( !user ) {
            return res.status(400).json({
                success: false,
                status: 400,
                error: {
                    code: "INVALID_CREDS",
                    message: "Invalid User ID or Password"
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        };
        // Respond with error if user exists but the role in the databse entry is different from the role provided by the client.
        if ( user.role !== role ) {
            return res.status(400).json({
                success: false,
                status: 400,
                error: {
                    code: "INVALID_CREDS",
                    message: "Invalid credentials"
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        };
        // Check password.
        const passwordMatch = await bcrypt.compare(password, user.password);
        // Respond with password if password is incorrect.
        if (!passwordMatch) {
            return res.status(400).json({
                success: false,
                status: 400,
                error: {
                    code: "INVALID_CREDS",
                    message: "Invalid User ID or Password"
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        };
        // Check if the user is active or not after userid and password verification
        if (user.status !== 'active') {
            return res.status(403).json({
                success: false,
                status: 403,
                error: {
                    code: "UNAUTHORISED",
                    message: "User is inactive"
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        }
        // ********** Process jwt Token sign and set cookie to the client ********** //
        const payload = {
            id: user.userId,
            role: user.role,
            token_version: user.jwtTokenVersion,
            token_type: "individual"
        };
        // Get the secret signing key from the env.
        const signingKey = process.env.JWT_SECRET;
        if (!signingKey) {
            throw new Error("INTERNAL_CONFIG_ERROR: JWT_SECRET is not defined");
        }
        // Sign the payload with jwt.
        const token = jwt.sign(payload, signingKey, { expiresIn: '6h' });
        // Set cookie to the client.
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            maxAge: 6 * 60 * 60 * 1000,
            sameSite: 'lax'
        })
        // Log successful signing log.
        logger({
            level: 'info',
            origin: 'authService',
            originName: 'authController',
            message: `User: ${user.userId}, Logged in.`,
            metadata: {
                userId: user.userId,
                userType: user.role
            }
        });
        // Respond with success to the client.
        res.json({
            success: true,
            status: 200,
            data: {
                user: {
                    id: user.userId,
                    username: user.username,
                    role: user.role
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
            origin: 'authService',
            originName: 'authController',
            message: 'internal server error while logging user in',
            metadata: {
                userId: user?.userId,
                username: user?.username,
                userType: user?.role
            },
            stackTrace: error.message
        });
        res.status(500).json({
            success: false,
            status: 500,
            error: {
                code: "INTERNAL_ERROR",
                message: "Unexpected error happened"
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    };
};

export const logoutController = async (req, res) => {
    // Extract credentials from the user object provided by the authenticator
    const user_id = req.user?.id;
    const role = req.user?.role;
    res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    });
    res.json({
        success: true,
        status: 200,
        data: {
            user: {
                id: user_id,
                role: role
            }
        },
        metadata: {
            server_time: Date.now(),
            version: "v1.0.0"
        }
    });
};

export const logoutAllController = async (req, res) => {
    // Extract data from the request user object.
    const user_id = req.user?.id;
    const role = req.user?.role;
    // Map the user role.
    const MODEL = modelRoleMap[role];
    if (!MODEL) {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INVALID_ROLE_MAP",
                message: "Error while mapping role."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    };

    user_Id = user_id.toUpperCase();

    try {
        await MODEL.findOneAndUpdate(
            { userId: user_id },
            { $inc: { jwtTokenVersion: 1 } }
        );
        res.clearCookie('token', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        });
        res.json({
            success: true,
            status: 200,
            data: {
                user: {
                    id: user_id,
                    role: role
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
            origin: 'authService',
            originName: 'authController',
            message: 'internal server error while logging user out from all.',
            metadata: {
                userId: user_id,
                userType: role
            },
            stackTrace: error.message
        });
        res.status(500).json({
            success: false,
            status: 500,
            error: {
                code: "INTERNAL_ERROR",
                message: "Cannot logout from all devices."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        })
    };
};

export const identifier = async (req, res) => {
    // Get user data from the jwt token.
    const user = req?.user;

    // Map role.
    const MODEL = modelRoleMap[user.role];

    if (!MODEL) {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INVALID_ROLE_MAP",
                message: "Error while mapping role."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    };

    try {
        const ac = await MODEL.findOne({ userId: user?.id });
        if (!ac) {
            return res.status(404).json({
                success: false,
                status: 404,
                error: {
                    code: "NOT_FOUND",
                    message: "User doesn't exists."
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        }

        res.json({
            success: true,
            status: 200,
            data: {
                user: {
                    userId: ac.userId,
                    userType: user.role,
                    username: ac.name,
                    fatherName: ac.fatherName,
                    status: ac.status
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
            origin: 'authService',
            originName: 'authController',
            message: 'internal server error while identifying user.',
            metadata: {
                user_id: user.id,
                userType: user.role
            },
            stackTrace: error.message
        });
        res.status(500).json({
            success: false,
            status: 500,
            error: {
                code: "INTERNAL_ERROR",
                message: "An unknow error occured."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        })
    };
};