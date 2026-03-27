import draftStudentApplication from '../models/draftStudentApplication.js'
import { logger } from '../utils/logger.js';

export const newStudentDraftApplication = async (req, res) => {
    const applicationModel = req.body || {};
    try {
        const newApplication = new draftStudentApplication(applicationModel);
        await newApplication.save();
        const acknowledgement = newApplication;
        logger({
            level: 'info',
            origin: 'mainService',
            originName: 'draftStudentApplicationController',
            message: 'new application draft created!',
            metadata: {
                orderId: acknowledgement.appRef
            }
        });
        res.status(201).json({
            status: true,
            message: "Application created",
            data: {
                appRef: acknowledgement.appRef,
                name: acknowledgement.name
            }
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            let errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(422).json({ status: false, message: "Validation failed!", data: errors });
        }
        if (error.code === 11000) {
            logger({
                level: 'warn',
                origin: 'mainService',
                originName: 'draftApplicationsController',
                message: 'duplicate application creation prevented',
                metadata: {
                    userId: 'publicroute',
                    userType: 'student'
                },
                stackTrace: error
            });
            return res.status(409).json({ status: false, message: "Application already exists" });
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
        res.status(400).json({ status: false, message: error.message, });
    };
};

export const getDraftApplications = async (req, res) => {
    const role = req.query.role || 'students';
    if (role === 'students') {
        let drafts = [];
        const data = await draftStudentApplication.find({role: 'student'});
        for (const cData of data) {
            drafts.push({
                appref: cData.appRef,
                name: cData.name,
                status: cData.appStatus
            })
        }
        return res.json({ status: true, message: 'Fetched draft applications.', data: drafts });
    }
    res.status(404).json({status: false, message: 'not found'});
};

export const previewDraftApplication = async (req, res) => {
    const { appRef } = req.params || {};
    try {
        const data = await draftStudentApplication.find({appRef: appRef});
        if (data.length <= 0) {
            return res.status(404).json({status: false, message: 'no applications found'});
        }
        return res.json({status: true, message: `Preview for application: ${appRef}`, data: data[0]});
    } catch (error) {
        return res.status(500).json({status: false, message: error.message});
    };
};