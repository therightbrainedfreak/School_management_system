import log from '../models/log.js';
import accountHistory from '../models/accountHistory.js';
import pino_logger from '../utils/pino.js'

export const logger = async (payload) => {
    try {
        const newLog = new log(payload);
        await newLog.save();
    } catch (error) {
        pino_logger.error({error: error}, 'Error saving log to database');
    };
};

export const saveAuditLog = async (payload) => {
    try {
        const newAuditLog = new accountHistory(payload);
        await newAuditLog.save();
    } catch (error) {
        pino_logger.error({error: error}, 'Error saving account audit log to database');
    };
};