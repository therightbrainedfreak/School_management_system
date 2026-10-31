import sysLog from '../models/sysLog.js';
import pino_logger from './pino.js';

/**
 * @description Function that creates general log entries, call using sysLog.info
 * @methods info, error, debug, warn
 */

const sysLogEnt = {
    async info(origin, message, actionBy, relId, Stacktrace) {
        try {
            const type = "info";
            const newSysLog = new sysLog({type, origin, message, actionBy, relId, Stacktrace});
            await newSysLog.save();
        } catch (error) {
            pino_logger.warn(`Couldn't save log: ${error.message}`);
        }
    },

    async error(origin, message, actionBy, relId, Stacktrace) {
        try {
            const type = "error";
            const newSysLog = new sysLog({type, origin, message, actionBy, relId, Stacktrace});
            await newSysLog.save();
        } catch (error) {
            pino_logger.warn(`Couldn't save log: ${error.message}`);
        }
    },

    async warn(origin, message, actionBy, relId, Stacktrace) {
        try {
            const type = "warn";
            const newSysLog = new sysLog({type, origin, message, actionBy, relId, Stacktrace});
            await newSysLog.save();
        } catch (error) {
            pino_logger.warn(`Couldn't save log: ${error.message}`);
        }
    },

    async debug(origin, message, actionBy, relId, Stacktrace) {
        try {
            const type = "debug";
            const newSysLog = new sysLog({type, origin, message, actionBy, relId, Stacktrace});
            await newSysLog.save();
        } catch (error) {
            pino_logger.warn(`Couldn't save log: ${error.message}`);
        }
    },
};

export default sysLogEnt;