import { addMinutes, subMinutes, set,} from 'date-fns';

import masterCalender from '../models/masterCalender.js';
import configuration from '../models/configuration.js';
import admin from '../models/admin.js';
import student from '../models/student.js';
import teacher from '../models/teacher.js';
import backoffice from '../models/backoffice.js';
import superuser from '../models/superUser.js'
import timePeriod from '../models/timePeriod.js';

const modelRoleMap = {
    admin: admin,
    student: student,
    teacher: teacher,
    backoffice: backoffice,
    superuser: superuser
};

async function fetchDay(month, day) {
    const currentYear = new Date().getFullYear();
    try {
        const cBucket = await masterCalender.findOne({ assessmentMonth: month });
        if (!cBucket) throw new Error("Bucket not found.");

        // Fix: Use strict equality ===
        const requestedDay = cBucket.days.find(d => d.day === day);
        if (!requestedDay) throw new Error("Incorrect day");

        return {
            day: requestedDay.day,
            month: cBucket.monthOf,
            dayName: requestedDay.dayName,
            status: requestedDay.status,
            // Use requestedDay.day (consistency)
            dString: set(new Date(), { year: currentYear, month: month, date: requestedDay.day })
        };
    } catch (error) {
        throw new Error(`Error fetching day: ${error.message}`);
    }
}

const getTimeSpan = async (day, month) => {
    try {
        const timeSchedule = await configuration.findOne({ confName: "timeSchedule" });
        const s = await fetchDay(month, day);
        const currentYear = new Date().getFullYear();

        let startH = 0, startM = 0, endH = 0, endM = 0;

        if (s.status === 'working') {
            startH = timeSchedule.confData.startHours;
            startM = timeSchedule.confData.startMinutes;
            endH = timeSchedule.confData.endHours;
            endM = timeSchedule.confData.endMinutes;
        } else if (s.status === 'event') {
            startH = timeSchedule.confData.eventStartHours;
            startM = timeSchedule.confData.eventStartMinutes;
            endH = timeSchedule.confData.eventEndHours;
            endM = timeSchedule.confData.eventEndMinutes;
        }

        const startDate = set(new Date(), { year: currentYear, month, date: s.day, hours: startH, minutes: startM, seconds: 0, milliseconds: 0 });
        const endDate = set(new Date(), { year: currentYear, month, date: s.day, hours: endH, minutes: endM, seconds: 0, milliseconds: 0 });

        return { startDate, endDate, status: s.status };
    } catch (error) {
        throw new Error(`Cannot get timestamp: ${error.message}`);
    }
};

export const generateTimePeriod = async () => {
    const roles = ['admin', 'student', 'teacher', 'backoffice'];
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();

    try {
        const { startDate, endDate, status } = await getTimeSpan(day, month);

        for (const role of roles) {
            const MODEL = modelRoleMap[role];
            const data = await MODEL.find();
            if (data.length === 0) continue;

            // 1. Define the time bounds for "Today" (00:00:00 to 23:59:59)
            const dayStart = set(startDate, { hours: 0, minutes: 0, seconds: 0 });
            const dayEnd = set(startDate, { hours: 23, minutes: 59, seconds: 59 });

            // 2. Get all User IDs for this role
            const userIds = data.map(d => d.userId);

            // 3. Find which users ALREADY have a record for this specific day
            const existingRecords = await timePeriod.find({
                targetId: { $in: userIds },
                startTime: { $gte: dayStart, $lte: dayEnd }
            });

            // Create a Set of IDs that already have a schedule today for O(1) lookup
            const skipIds = new Set(existingRecords.map(r => r.targetId));

            // 4. Filter data to only include users NOT in the skipIds set
            const newEntries = data
                .filter(d => !skipIds.has(d.userId))
                .map(d => {
                    // Adjust times for students
                    const finalStart = role === 'student' ? addMinutes(startDate, 30) : startDate;
                    const finalEnd = role === 'student' ? subMinutes(endDate, 30) : endDate;

                    return {
                        targetId: d.userId,
                        onModel: d.role,
                        startTime: finalStart,
                        endTime: finalEnd,
                        status: status
                    };
                });

            // 5. Batch insert only the missing ones
            if (newEntries.length > 0) {
                await timePeriod.insertMany(newEntries);
                console.log(`Added ${newEntries.length} new records for ${role}.`);
            } else {
                console.log(`All ${role}s already have records for today.`);
            }
        }
    } catch (error) {
        console.error("Scheduler Failed:", error);
    }
};

generateTimePeriod();