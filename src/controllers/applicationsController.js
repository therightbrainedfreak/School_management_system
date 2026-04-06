import { logger } from '../utils/logger.js';

import newApplication from '../models/newApplication.js';

const validRoles = ['student', 'teacher', 'parent', 'backoffice'];

export const newApplicationHandler = async ( req, res ) => {
    // Extract the application from the request body.
    const applicationModel = req.body || {};
    if ( !applicationModel ) {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INVALID_DATA",
                message: "Application data is required to create an applicaion."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    };
    // Extract role from from the application model.
    const applicantRole = applicationModel.role || null;
    // Check if the role is valid;
    if (!validRoles.includes(applicantRole)) {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INVALID_ROLE_MAP",
                message: "Provided role is not available."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    };
    // Start processing the application.
    try {
        const application = new newApplication(applicationModel);
        await application.save();
        const acknowledgement = application;
        logger({
            level: 'info',
            origin: 'mainService',
            originName: 'draftStudentApplicationController',
            message: 'new application draft created!',
            metadata: {
                orderId: acknowledgement.appRef
            }
        });
        res.json({
            success: true,
            status: 200,
            data: {
                user: acknowledgement
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    } catch (error) {
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
                    version: "v1.0.0"
                }
            });
        };
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                status: 404,
                error: {
                    code: "DUPLICACY_ERROR",
                    message: "Application already exists."
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
            originName: 'draftApplicationsController',
            message: 'Error creating draft student application',
            metadata: {
                userId: 'publicroute',
                userType: 'student'
            },
            stackTrace: error
        });
        res.status(500).json({
            success: false,
            status: 401,
            error: {
                code: "INTERNAL_ERROR",
                message: "Unexpected error occured while creating new application."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    };
};

export const getApplications = async ( req, res ) => {
    try {
        // Find applications in the server.
        const applications = await newApplication.find();
        // Error is applications not found.
        if ( applications.length <= 0 ) {
            return res.status(404).json({
                success: false,
                status: 404,
                error: {
                    code: "NOT_FOUND",
                    message: "Applications not found or empyt."
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            })
        };
        // Send all the applications to the client.
        const responseApplications = [];
        // Map only specific details for sending to the client.
        for (const app of applications) {
            const entry = {
                appRef: app.appRef,
                role: app.role,
                username: app.name,
                fatherName: app.fatherName,
                email: app.email,
                phone: app.address.phoneNumber
            };
            responseApplications.push(entry);
        };
        // Return applications.
        res.json({
            success: true,
            status: 200,
            data: {
                applications: responseApplications
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    } catch ( error ) {
        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'newApplicationsController',
            message: 'Unexpected error while fetching applications',
            metadata: {
            },
            stackTrace: error.message
        });
        res.status(500).json({
            success: false,
            status: 500,
            error: {
                code: "INTERNAL_ERROR",
                message: "Unexpected error occured while getting applications."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    };
};

export const getApplication = async ( req, res ) => {
    // Extract userId from the param.
    const reference = req.params?.appRef;
    // Process userId.
    try {
        const application = await newApplication.findOne({appRef: reference});
        if (!application) {
            return res.status(404).json({
                success: false,
                status: 404,
                error: {
                    code: "NOT_FOUND",
                    message: "Requested application no longer exists on the server."
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        };
        res.json({
            success: true,
            status: 200,
            data: {
                application: application
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        })
    } catch (error) {
        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'newApplicationsController',
            message: 'Unexpected error while fetching application.',
            metadata: {
            },
            stackTrace: error.message
        });
        res.status(500).json({
            success: false,
            status: 500,
            error: {
                code: "INTERNAL_ERROR",
                message: "Unexpected error occured while getting application."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    };
};