import 'dotenv/config'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import admin from "../models/admin.js";
import { logger } from '../utils/logger.js';

export const getAdmin = async (req, res) => {
    const userId = req.params.id;
    try {
        const searchAdmin = await admin.findOne({ userId: userId }).select('name fatherName motherName dob gender address email')
        const last4Phone = searchAdmin.address.phoneNumber.slice(-4);
        const maskedPhone = last4Phone.padStart(searchAdmin.address.phoneNumber.length, 'X');
        const mailParts = searchAdmin.email.split('@')[0];
        const lastMailPart = searchAdmin.email.split('@')[1];
        const last4Mail = mailParts.slice(-4);
        const maskedMail = last4Mail.padStart(mailParts.length, 'X') + "@" + lastMailPart;
        searchAdmin.address.phoneNumber = maskedPhone;
        searchAdmin.email = maskedMail;
        res.json(searchAdmin);
    } catch (error) {
        logger({
            level: 'info',
            origin: 'mainService',
            originName: 'adminController',
            message: 'error getting user info',
            metadata: {
                userId: userId,
                userType: req.user.role
            },
            stackTrace: error
        })
        res.status(500).json({ data: false, message: "Internal server error" });
    }
};

export const loginAdmin = async (req, res) => {
    const { userId, password } = req.body || {};
    if (!userId || !password) {
        return res.status(400).json({ login: false, message: "Incomplete credentials!" });
    }
    const user = await admin.findOne({ userId: userId }).select('email userId role jwtTokenVersion password status');
    if (!user) {
        return res.status(404).json({ login: false, message: "Admin not found!" });
    }
    if (user.status !== 'active') {
        return res.status(403).json({ login: false, message: "Admin inactive!" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({ login: false, message: "Incorrect password!" });
    }
    const jwtPayload = {
        id: user.userId,
        role: user.role,
        email: user.email,
        tokenVersion: user.jwtTokenVersion
    }
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '24h' });
    logger({
        level: 'info',
        origin: 'mainService',
        originName: 'adminController',
        message: 'user logged in',
        metadata: {
            userId: userId,
            userType: user.role
        }
    })
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'strict'
    });
    res.json({ login: true, message: "Logged in successfully!" });
};

export const logoutAdmin = async (req, res) => {
    const id = req.user.id;
    try {
        const user = await admin.findOne({ userId: id }).select('jwtTokenVersion');
        if (!user) {
            return res.status(404).json({ logout: false, message: "User not found!" });
        };
        logger({
            level: 'info',
            origin: 'mainService',
            originName: 'adminController',
            message: 'user logged out',
            metadata: {
                userId: id,
                userType: req.user.role
            }
        });
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.json({ logout: true, message: "User logged out successfully!" });
    } catch (error) {
        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'adminController',
            message: 'error logging out user',
            metadata: {
                userId: id,
                userType: 'admin'
            },
            stackTrace: error
        });
        return res.status(500).json({ logout: false, message: "Error Logging out!" });
    };
};

export const updateAdmin = async (req, res) => {
    const updatePayload = req.body || {};
    const id = req.params.id;
    try {
        const updatedAdmin = await admin.findOneAndUpdate(
            { userId: id },
            { $set: updatePayload },
            { returnDocument: 'after', runValidators: true }
        );
        if (!updatedAdmin) {
            return res.status(404).json({ updated: false, message: "Not found" });
        };
        logger({
            level: 'info',
            origin: 'mainService',
            originName: 'adminController',
            message: 'user updated',
            metadata: {
                userId: updatedAdmin.userId,
                userType: updatedAdmin.role
            }
        });
        res.json({ updated: true, message: "Admin successfully updated!" });
    } catch (error) {
        logger({
            level: 'error',
            origin: 'mainService',
            originName: 'adminController',
            message: 'error updating user',
            metadata: {
                userId: id,
                userType: 'admin'
            },
            stackTrace: error
        });
        return res.status(500).json({ updated: false,  message: "Internal server error" });
    };
};