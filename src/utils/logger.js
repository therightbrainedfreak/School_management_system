import log from '../models/log.js';
import accountHistory from '../models/accountHistory.js';

export const logger = async (payload) => {
    try {
        const newLog = new log(payload);
        await newLog.save();
    } catch (error) {
        console.log('Error while writing log:', error.message);
    };
};

export const saveAuditLog = async (payload) => {
    try {
        const newAuditLog = new accountHistory(payload);
        await newAuditLog.save();
    } catch (error) {
        console.log('Error while writing audit log:', error);
    };
};