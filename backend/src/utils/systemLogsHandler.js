import sysLog from '../models/sysLog.js';

/**
 * @description Function that creates general log entries, call using sysLog.info
 */

const sysLogEnt = {
    async info(origin, message, actionBy, relId, Stacktrace) {
        try {
            const type = "info";
            const newSysLog = new sysLog(type, origin, message, actionBy, relId, Stacktrace);
            await newSysLog.save();
        } catch (error) {
            // Temporarily ignore errors here.
        }
    },

    async error(origin, message, actionBy, relId, Stacktrace) {
        try {
            const type = "error";
            const newSysLog = new sysLog(type, origin, message, actionBy, relId, Stacktrace);
            await newSysLog.save();
        } catch (error) {
            // Temporarily ignore errors here.
        }
    },

    async warn(origin, message, actionBy, relId, Stacktrace) {
        try {
            const type = "warn";
            const newSysLog = new sysLog(type, origin, message, actionBy, relId, Stacktrace);
            await newSysLog.save();
        } catch (error) {
            // Temporarily ignore errors here.
        }
    },

    async debug(origin, message, actionBy, relId, Stacktrace) {
        try {
            const type = "debug";
            const newSysLog = new sysLog(type, origin, message, actionBy, relId, Stacktrace);
            await newSysLog.save();
        } catch (error) {
            // Temporarily ignore errors here.
        }
    },
};

export default sysLogEnt;