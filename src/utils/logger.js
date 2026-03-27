import log from '../models/log.js';

export const logger = async (payload) => {
    try {
        const newLog = new log(payload);
        await newLog.save();
    } catch (error) {
        console.log('Error while writing log:', error.message);
    };
};