import { logger } from '../utils/logger.js';

import newApplication from '../models/newApplication.js';
import nHistory from '../models/notificationHistory.js';
import { newNotificationBasic } from '../utils/mailNotificationService.js';
import mongoose from 'mongoose';

const validRoles = ['student', 'teacher', 'parent', 'backoffice'];

export const newApplicationHandler = async (req, res) => {
    // Extract the application from the request body.
    const applicationModel = req.body || {};
    if (!applicationModel) {
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

export const getApplications = async (req, res) => {
    // Extract filtering options from queries.
    const { isVerified, role, status } = req.query;
    let filter = {};
    // Add role filter to the search query.
    if (role) {
        filter.role = role;
    };
    // Add isVerified filer to the search query.
    if (isVerified === 'true') {
        filter.isAppVerified = true;
    } else {
        filter.isAppVerified = false;
    };
    // add status filter to the filters list.
    if (status) {
        const validStatus = ["ACCEPTED", "REJECTED", "DRAFT", "PROCESSING"];
        if (validStatus.includes(status.toUpperCase())) {
            filter.appStatus = status.toUpperCase()
        };
    };
    try {
        // Find applications in the server.
        const applications = await newApplication.find(filter).sort({ createdAt: -1 });
        // Error is applications not found.
        if (applications.length <= 0) {
            return res.status(404).json({
                success: false,
                status: 404,
                error: {
                    code: "NOT_FOUND",
                    message: "Applications not found."
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
    } catch (error) {
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

export const getApplication = async (req, res) => {
    // Extract userId from the param.
    const reference = req.params?.appRef;
    // Process userId.
    try {
        // Find the requested application from the database.
        const application = await newApplication.findOne({ appRef: reference });
        // Respond with error if application was not found.
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
        // Define payload for sending to user.
        const rPayload = {
            appRef: application.appRef,
            appStatus: application.appStatus,
            name: application.name,
            gender: application.gender,
            fatherName: application.fatherName,
            motherName: application.motherName,
            address: application.address,
            email: application.email,
            role: application.role
        }
        // Return the payload to the client.
        res.json({
            success: true,
            status: 200,
            data: {
                application: rPayload
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

export const applicationReview = async (req, res) => {
    // extract reference number from url.
    const appRefe = req.params?.appRef;
    // extract referrer from the jwt token.
    const refferer = req.user;
    // check if the application reference is valid or nt undefined, more checks can be performed.
    if (!appRefe || appRefe === undefined) {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INVALID_DATA",
                message: "Application reference not provided or invalid."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    };
    // Create a mongoose session for db queries.
    const session = await mongoose.startSession();
    try {
        // Start the database transaction.
        session.startTransaction();
        // I dont know if i am doing it right. Get the requested applicaition from the database.
        const application = await newApplication.findOne({ appRef: appRefe }, null, { session });
        // Return an error response if application not found.
        if (!application) {
            return res.status(400).json({
                success: false,
                status: 400,
                error: {
                    code: "NOT_FOUND",
                    message: "Application not found for the provided reference."
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        };
        // Extract required fields from the applciation fetched from the database.
        const { name, appRef, email, role, appStatus } = application;
        // Stop the process if the application status is not draft.
        if (appStatus !== "DRAFT") {
            return res.status(400).json({
                success: false,
                status: 400,
                error: {
                    code: "INVALID_ACTION",
                    message: "Cannot proceed the application is already processed or under process."
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        };
        // Set the application status to processing.
        await newApplication.findOneAndUpdate({ appRef: appRefe }, { appStatus: "PROCESSING" }, { session });
        // Define details for the history saver and the notifier.
        const nTitle = "Application Under Review.";
        const nMessage = `Your application with reference: ${appRef}, is under review. After performing required validation you will be notified with the application status.`;
        // Create a new notification history.
        const notificationHistory = new nHistory({
            title: nTitle,
            recipient: {
                appRef: appRef,
                name: name,
                mail: email,
                role: role
            },
            message: nMessage,
            referrer: {
                userId: refferer.id,
                role: refferer.role
            }
        });
        // Save it to database.
        await notificationHistory.save({ session });
        // extract referenceId from the new history db document.
        const nReference = notificationHistory.referenceId;
        // Define paylad for notifier.
        const notificationPayload = {
            options: {
                referenceId: nReference,
                title: nTitle,
                message: nMessage
            },
            recipient: {
                name: name,
                mail: email,
                role: role
            }
        };
        // Commit all the db queries performed above.
        await session.commitTransaction();
        // Send a notification to the user without awaiting for success.
        newNotificationBasic(notificationPayload);
        // Respond with success.
        res.json({
            success: true,
            status: 200,
            data: {
                appRef: appRef,
                message: "Status updated to processing"
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });

    } catch (error) {
        // Abort the db transaction performed above if anything goes wrong.
        await session.abortTransaction();
        // Log the error to the database.
        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'newApplicationsController',
            message: 'Unexpected error while forwarding application for review.',
            metadata: {
            },
            stackTrace: error.message
        });
        // Respond with error.
        res.status(500).json({
            success: false,
            status: 500,
            error: {
                code: "INTERNAL_ERROR",
                message: "Unexpected error occured while forwarding application for review."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    } finally {
        // Finally close the mongoose session.
        await session.endSession();
    };
};

export const applicationReject = async (req, res) => {
    // Get the reson provided for rejection.
    const { reasonForRejection } = req.body || {};
    // Get the user id of which the application is entitled for rejection.
    const applicationReference = req.params?.appRef;
    // Get the referer from the req.user provided by jwt payload.
    const referer = req.user || {};
    // Check if the application reference is provided.
    if (!applicationReference) {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INVALID_DATA",
                message: "Application reference number is required."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    };
    // Check if the user provided the reason for rejection.
    if (!reasonForRejection || reasonForRejection === "") {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INVALID_DATA",
                message: "Reason is required for rejection."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    };
    // Create a mongoose session.
    const tSession = await mongoose.startSession();
    try {
        // Start the database transaction.
        tSession.startTransaction();
        const application = await newApplication.findOne({ appRef: applicationReference }, null, { tSession });
        // Check if the session exists.
        if (!application) {
            return res.status(404).json({
                success: false,
                status: 404,
                error: {
                    code: "NOT_FOUND",
                    message: "Application does not exists."
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        };
        // Extra checks for the application.
        if (application.appStatus === "ACCEPTED") {
            return res.status(400).json({
                success: false,
                status: 400,
                error: {
                    code: "INVALID_ACTION",
                    message: "Application cannot be rejected as it is already have been approved."
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        };
        if (application.appStatus === "REJECTED") {
            return res.status(400).json({
                success: false,
                status: 400,
                error: {
                    code: "INVALID_ACTION",
                    message: "This application has been rejected already."
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        };
        if (application.appStatus === "DRAFT") {
            return res.status(400).json({
                success: false,
                status: 400,
                error: {
                    code: "INVALID_ACTION",
                    message: "Cannot reject application without reviewing it."
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        };
        // update the status.
        await newApplication.findOneAndUpdate({ appRef: applicationReference }, { appStatus: "REJECTED" }, { tSession });
        // Define configurations for notification.
        const nTitle = "Application Rejected";
        const nMessage = `Your application with the reference id: ${application.appRef}, has been rejected due to the following reason(s). ${reasonForRejection}`;
        // Create a new notification history.
        const notificationHistory = new nHistory({
            title: nTitle,
            recipient: {
                appRef: application.appRef,
                name: application.name,
                mail: application.email,
                role: application.role
            },
            message: nMessage,
            referrer: {
                userId: referer.id,
                role: referer.role
            }
        });
        // Save it to database.
        await notificationHistory.save({ tSession });
        // extract referenceId from the new history db document.
        const nReference = notificationHistory.referenceId;
        // Define paylad for notifier.
        const notificationPayload = {
            options: {
                referenceId: nReference,
                title: nTitle,
                message: nMessage
            },
            recipient: {
                name: application.name,
                mail: application.email,
                role: application.role
            }
        };
        // Commit all the db queries performed above.
        await tSession.commitTransaction();
        // Send a notification to the user without awaiting for success.
        newNotificationBasic(notificationPayload);
        // Respond with success.
        res.json({
            success: true,
            status: 200,
            data: {
                appRef: application.appRef,
                message: "Status updated"
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    } catch (error) {
        // Abort the db transaction performed above if anything goes wrong.
        await tSession.abortTransaction();
        // Log the error to the database.
        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'newApplicationsController',
            message: 'Unexpected error while trying to reject application.',
            metadata: {
            },
            stackTrace: error.message
        });
        // Respond with error.
        res.status(500).json({
            success: false,
            status: 500,
            error: {
                code: "INTERNAL_ERROR",
                message: "Unexpected error occured while rejecting application."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    } finally {
        // Finally close the mongoose session.
        await tSession.endSession();
    };
};