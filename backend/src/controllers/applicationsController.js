import { logger } from '../utils/logger.js';
import { newNotificationBasic } from '../utils/mailNotificationService.js';
import multer from 'multer';
import applicationLog from '../models/applicationLog.js'
import mongoose from 'mongoose';
import studentApplication from '../models/studentApplication.js';
import kycInstance from '../models/kyc.js';
import path, { dirname } from 'node:path';
import fs from 'fs/promises'
import { fileURLToPath } from 'node:url';
import XMLHandler from './kycController.js';
import { isBefore, subMinutes } from 'date-fns';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const validRoles = ['student', 'teacher', 'parent', 'backoffice'];
const aadharUploadPath = path.join(__dirname, '..', '..', 'uploads', 'kyc');
const imageUploadPath = path.join(__dirname, '..', '..', 'uploads', 'pictures');

const aadharStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, aadharUploadPath);
    },
    filename: (req, file, cb) => {
        // const safeName = req.params.appRef.replace(/[^a-zA-Z0-9-_]/g, "");
        const ref = req.params.appRef.replace(/[^a-zA-Z0-9-_]/g, '');
        const ext = path.extname(file.originalname)
        const file_name = `${ref}_KYC_AADHAR${ext}`;
        cb(null, file_name);
    }
});

const zipFilter = (req, file, cb) => {
    if (
        file.mimetype === 'application/zip' || 
        file.mimetype === 'application/x-zip-compressed'
    ) {
        cb(null, true);
    } else {
        cb(new Error('Only .zip files are allowed!'), false);
    }
};

const uploadZip = multer({
    storage: aadharStorage,
    fileFilter: zipFilter
});

// Sanitizers >> Learned from Claude.ai

const sanitizeText = (val, max) => 
    typeof val === 'string' ? val.trim().replace(/\s+/g, ' ').replace(/[^\x20-\x7E]/g, '').slice(0, max) : undefined;

const sanitizeEmail = (val) => {
    if (typeof val !== 'string') return undefined;
    const trimmed = val.trim().toLowerCase().slice(0, 80);
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? trimmed : undefined;
};

const sanitizePhone = (val) =>
    typeof val === 'string' ? val.replace(/[^\d+]/g, '').slice(0, 15) : undefined;

const sanitizeDob = (val) => {
    const d = new Date(val);
    return isNaN(d.getTime()) ? undefined : d.toLocaleString();
};

const uploadFileAsync = (req, res, middleware) => {
    return new Promise((resolve, reject) => {
        middleware(req, res, (err) => {
            if (err) {
                // catch the ugly multer error and replace with friendly message
                if (err.message === 'Unexpected end of form') {
                    reject(new Error('No file uploaded!'));
                } else {
                    reject(err);
                }
            }
            else resolve();
        });
    });
};

// Controller for processing he new student application.
export async function studentApplicationHandler(req, res) {

    // Extract body from the request.
    const application = req.body || {};
    const appKeys = Object.keys(application);

    // Check for empty body.
    if (appKeys.length === 0) {
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

    // Extract user role from the body.
    const applicantRole = application?.role

    // Validate provided role
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

    // Input sanitizations for new application.
    const appPayload = {
        name: sanitizeText(application.name, 100),
        fatherName: sanitizeText(application.fatherName, 100),
        motherName: sanitizeText(application.motherName, 100),
        dob: sanitizeDob(application.dob),
        gender: application?.gender?.trim().slice(0, 20),
        standard: application?.standard?.trim().slice(0, 3),
        role: application?.role?.trim().slice(0, 20),
        address: application?.address,
        phoneNumber: application?.phoneNumber?.trim().slice(0, 12),
        email: application?.email?.trim().slice(0, 80)
    };

    // Start mongoose session.
    const tSession = await mongoose.startSession();

    try {
        // Start mongoose transaction.
        tSession.startTransaction();

        // Save the application payload to database.
        const acknowledgement = new studentApplication(appPayload);
        await acknowledgement.save({
            session: tSession
        });
        
        // Define data for keepint track of application.
        const nTitle = "Application Received";
        const nMessage = `Please complete the KYC process, otherwise your application will not be accepted.`;

        const extras = `<div style="border-left: 4px solid cyan; padding: 4px 0 4px 12px; margin-bottom: 8px; border-radius: 4px;">Application Reference: ${acknowledgement.appRef}</div></br>
                        <a href="https://google.com">Proceed for KYC now</a>`;

        // Create new application log.
        const appLog = new applicationLog({
            title: nTitle,
            recipient: {
                appRef: acknowledgement.appRef,
                name: acknowledgement.name,
                mail: acknowledgement.email,
                role: acknowledgement.role
            },
            message: nMessage,
            referrer: {
                userId: "SELF_APPLICANT",
                role: "SELF_APPLICANT"
            }
        });

        // Save the applog to the database.
        await appLog.save({ session: tSession });

        // Log to main logger
        logger({
            level: 'info',
            origin: 'mainService',
            originName: 'applicationsController',
            message: 'new Student application draft created!',
            metadata: {
                orderId: acknowledgement.appRef
            }
        });

        // Commit all db transactions.
        await tSession.commitTransaction();

        // NOtify
        newNotificationBasic(nTitle, appLog.referenceId, nMessage, acknowledgement.email, acknowledgement.name, extras).catch(err => logger({
            level: 'warn',
            origin: 'mainService',
            originName: 'draftApplicationsController',
            message: 'Error notifying user.',
            metadata: {
                userType: 'student'
            },
            stackTrace: err.message
        }));

        // Respond
        res.json({
            success: true,
            status: 200,
            data: {
                user: {
                    appRef: acknowledgement.appRef,
                    name: acknowledgement.name,
                    role: acknowledgement.role,
                    standard: acknowledgement.standard
                }
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });

    } catch (error) {
        // Abort transaction.
        await tSession.abortTransaction();
        // Handle errors
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
                status: 409,
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
                userType: 'student'
            },
            stackTrace: error
        });
        res.status(500).json({
            success: false,
            status: 500,
            error: {
                code: "INTERNAL_ERROR",
                message: "Unexpected error occured while creating new application."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    } finally {
        await tSession.endSession();
    };
};

/**
 * Handles the request for application with a status filter.
 */

export async function getStudentApplications(req, res) {
    // Extract filtering options from queries.
    const { status } = req.query;
    let filter = {};
    // add status filter to the filters list.
    if (status) {
        const validStatus = ["DRAFT", "PROCESSING", "VERIFIED", "REJECTED", "ACCEPTED", "KYC"];
        if (validStatus.includes(status.toUpperCase())) {
            filter.status = { state: status.toUpperCase() };
        };
    };
    try {
        // Find applications in the server.
        const applications = await studentApplication.find(filter).sort({ createdAt: -1 });
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
                phone: app.address.phoneNumber,
                status: app.appStatus
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

/**
 * Handles the request for a specific student application request
 */

export async function getStudentApplication(req, res) {
    // Extract userId from the param.
    const reference = req.params?.appRef;
    // Process userId.
    try {
        // Find the requested application from the database.
        const application = await studentApplication.findOne({ appRef: reference });
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
            status: application.status,
            name: application.name,
            gender: application.gender,
            fatherName: application.fatherName,
            motherName: application.motherName,
            address: application.address,
            phone: application.phoneNumber,
            email: application.email,
            role: application.role,
            kyc: application.kyc,
            standard: application.standard,
            dob: application.dob
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

export async function uploadKycDoc(req, res) {
    // Extract all required data first.
    const arn = req.params?.appRef;
    if (!arn) {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INVALID_DATA",
                message: "Application reference not provided."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    };

    // Create a mongoose session.
    const tSession = await mongoose.startSession();

    // Validate if the application number exists.
    try {
        // Start the transaction.
        tSession.startTransaction();

        // Verify application reference number.
        const application = await studentApplication.findOne({ appRef: arn }, null, { session: tSession });
        if (!application) {
            return res.status(400).json({
                success: false,
                status: 400,
                error: {
                    code: "INVALID_DATA",
                    message: "Incorrect application reference number."
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        }

        // Upload the file to the directory.
        await uploadFileAsync(req, res, uploadZip.single('file'));

        // create a new kyc instance.
        const newKycInstance = new kycInstance({ appRef: application.appRef })
        newKycInstance.save({ session: tSession });

        // Update application status to kyc.
        await studentApplication.findOneAndUpdate({ appRef: arn }, { status: { state: "KYC" } }, { session: tSession });

        // Commit transactions.
        await tSession.commitTransaction();

        // Respond success.
        res.json({
            success: true,
            status: 200,
            data: {
                message: "Uploaded!",
                sessionId: newKycInstance.kycId
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    } catch (error) {
        // Abort db transactions if something went wrong.
        await tSession.abortTransaction();

        // Log the error to the db.
        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'newStudentApplicationsController',
            message: 'Unexpected error while verifying application.',
            stackTrace: error.message
        });

        // Respond with internal server error.
        return res.status(500).json({
            success: false,
            status: 500,
            error: {
                code: "INTERNAL_ERROR",
                message: "Unknown error happened."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    } finally {
        // End the Mongoose session.
        await tSession.endSession();
    };
};

export async function finalKyc(req, res) {
    // Extract reference number, kyc session id and share code from client.
    const arn = req.params?.appRef;
    const kycSessionId = req.body?.sid;
    const shareCode = req.body?.scode;

    // Validations.
    if(!arn) {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INVALID_DATA",
                message: "Application reference number not provided."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    };
    if(!kycSessionId) {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INVALID_DATA",
                message: "kyc session id not provided."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    };
    if(!shareCode) {
        return res.status(400).json({
            success: false,
            status: 400,
            error: {
                code: "INVALID_DATA",
                message: "Share code not provided"
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    };

    // Start mongoose session.
    const tSession = await mongoose.startSession();

    try {
        // Start mongoose transaction.
        tSession.startTransaction();

        // First validate the session id.
        const session = await kycInstance.findOne({ kycId: kycSessionId }, null, { session: tSession });
        if (!session) {
            return res.status(400).json({
                success: false,
                status: 400,
                error: {
                    code: "INVALID_KYC_SESSION",
                    message: "Invalid KYC session."
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        };

        // check if the reference number is correct or not.
        if (session.appRef !== arn) {
            return res.status(400).json({
                success: false,
                status: 400,
                error: {
                    code: "INVALID_REFERENCE",
                    message: "Invalid reference number."
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        };

        // Define time before 10 minutes;
        const expirationThreshold = subMinutes(new Date(), 10);

        // check if the session is created ten minutes before;
        const isValid = !isBefore(new Date(session.createdAt), expirationThreshold);

        const fileName = `${arn}_KYC_AADHAR.zip`;
        const filePath = path.join(__dirname, '..', '..', 'uploads', 'kyc', fileName);

        if (!isValid) {
            // Delete this session.
            await kycInstance.deleteOne({ kycId: kycSessionId }, { session: tSession });

            // Delete related files.
            await fs.unlink(filePath).catch(() => null);

            // Stop with response
            return res.status(400).json({
                success: false,
                status: 400,
                error: {
                    code: "KYC_SESSION_EXPIRED",
                    message: "This Kyc session is expired try again."
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        };

        const application = await studentApplication.findOne({ appRef: arn }, null, { session: tSession });
        if (!application) {
            return res.status(404).json({
                success: false,
                status: 404,
                error: {
                    code: "NOT_FOUND",
                    message: "Application not found."
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        };

        if (application.status.state !== "KYC") {
            return res.status(400).json({
                success: false,
                status: 400,
                error: {
                    code: "INVALID_ACTION",
                    message: "KYC not Initiated for the application."
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        }

        // Initialise ZIP handler.
        let zipHandler;
        let integrity;
        let extractedKycData;

        try {
            zipHandler = new XMLHandler(filePath, shareCode);
        } catch (error) {
            return res.status(422).json({
                success: false,
                status: 422,
                error: {
                    code: "ERR_EXT_XML",
                    message: error.message
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        };

        try {
            integrity = zipHandler.verify();
        } catch (error) {
            return res.status(422).json({
                success: false,
                status: 422,
                error: {
                    code: "ERR_VERIFY_XML",
                    message: error.message
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        };

        try {
            extractedKycData = zipHandler.extractData();
        } catch (error) {
            return res.status(422).json({
                success: false,
                status: 422,
                error: {
                    code: "ERR_EXTDATA_XML",
                    message: error.message
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        };

        if (!integrity) {
            // Delete this session.
            await kycInstance.deleteOne({ kycId: kycSessionId }, { session: tSession });

            // Change kyc status to rejected.
            await studentApplication.findOneAndUpdate({ appRef: arn }, { kyc: { state: "REJECTED", note: "Integrity check failed." } }, { session: tSession });

            return res.status(400).json({
                success: false,
                status: 400,
                error: {
                    code: "KYC_REJECTED",
                    message: "KYC rejected as the integrity of the document cannot be verified."
                },
                metadata: {
                    server_time: Date.now(),
                    version: "v1.0.0"
                }
            });
        };

        // Extract XML data to JSON / JS Object.
        const kycData = extractedKycData;
        const POI = kycData.identity;
        const POA = kycData.address;
        const careOf = POA.careOf.replace(/^(S\/O|D\/O|W\/O|C\/O|s\/o|d\/o|w\/o|c\/o)[.:\s]*/, "").trim();

        const img = kycData.photoBase64;
        const imgName = `${arn}_PROFILE_PIC.jpg`;

        // Define corrections for the application
        const updatePayload = {
            name: POI.name,
            gender: POI.gender,
            dob: POI.dob,
            fatherName: careOf,
            address: {
                district: POA.district,
                state: POA.state,
                postcode: POA.pincode,
                country: POA.country
            },
            status: {
                state: "PROCESSING"
            },
            kyc: {
                state: "VERIFIED"
            }
        };

        // Update the data in database
        await studentApplication.findOneAndUpdate({ appRef: arn }, updatePayload, { session: tSession });

        // Save profile picture.
        await fs.writeFile(path.join(imageUploadPath, imgName), Buffer.from(img, 'base64'));

        // delete the instance after it's used.
        await kycInstance.deleteOne({ kycId: kycSessionId }, { session: tSession });
        await fs.unlink(filePath).catch(() => null);

        // Commit all transactions.
        await tSession.commitTransaction();

        res.json({
            success: true,
            status: 200,
            data: {
                message: "Kyc Verified!"
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });

    } catch (error) {
        // Abort the transaction if something goes wrong.
        await tSession.abortTransaction();

        // Log the error to the db.
        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'newStudentApplicationsController',
            message: 'Unexpected error while performing final kyc.',
            metadata: {
                orderId: arn || "NEW_APPLICATION_SELF"
            },
            stackTrace: error.message
        });

        // Respond with internal server error.
        return res.status(500).json({
            success: false,
            status: 500,
            error: {
                code: "INTERNAL_ERROR",
                message: "Unknown error happened."
            },
            metadata: {
                server_time: Date.now(),
                version: "v1.0.0"
            }
        });
    } finally {
        await tSession.endSession();
    };
};