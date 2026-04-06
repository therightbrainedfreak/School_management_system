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

const present = new Date();

async function fetchDay(month, day) {
    const currentYear = present.getFullYear();

    try {
        const cBucket = await masterCalender.findOne({ assessmentMonth: month });
        if (!cBucket) {
            throw new Error("Bucket not found.");
        };
        const days = cBucket.days;
        if (day <= 0 || day > days.length) {
            throw new Error("Incorrect day");
        };
        const requestedDay = days.find(d => d.day = day);
        const date = {
            day: requestedDay.day,
            month: cBucket.monthOf,
            dayName: requestedDay.dayName,
            status: requestedDay.status,
            dString: set(new Date(), { year: currentYear, month: month, date: requestedDay.day })
        }
        return date;
    } catch (error) {
        throw new Error("Error fetching day:", error);
    };
};

const getData = async (role) => {
    const MODEL = modelRoleMap[role];
    if (!MODEL) {
        throw new Error('Incorrect model provided');
    };
    try {
        const users = await MODEL.find();
        return users;
    } catch (error) {
        throw new Error("Error getting user data:", error);
    };
};

const getTimeSchedule = async () => {
    try {
        const timeSchedule = await configuration.findOne({ confName: "timeSchedule" });
        if (!timeSchedule) {
            throw new Error('Cannot get time schedule')
        };
        return timeSchedule;
    } catch (error) {
        throw new Error("Error getting time Schedule:", error);
    };
};

const getTimeSpan = async (day, month) => {
    try {
        const timeSchedule = await getTimeSchedule();
        console.log(`Processing timespan for ${day}/${month + 1}/${present.getFullYear()}`);
        const s = await fetchDay(month, day);
        let startDate = '';
        let endDate = '';

        if (s.status === 'working') {
            startDate = set(new Date(), {
                date: s.Day,
                month: month - 1,
                year: present.getFullYear(),
                hours: timeSchedule.confData.startHours || 0,
                minutes: timeSchedule.confData.startMinutes || 0
            });
            endDate = set(new Date(), {
                date: s.Day,
                month: month - 1,
                year: present.getFullYear(),
                hours: timeSchedule.confData.endHours || 0,
                minutes: timeSchedule.confData.endMinutes || 0
            });
        } else if ( s.status === 'event' ) {
            startDate = set(new Date(), {
                date: s.Day,
                month: month - 1,
                year: present.getFullYear(),
                hours: timeSchedule.confData.eventStartHours || 0,
                minutes: timeSchedule.confData.eventStartMinutes || 0
            });
            endDate = set(new Date(), {
                date: s.Day,
                month: month - 1,
                year: present.getFullYear(),
                hours: timeSchedule.confData.EventEndHours || 0,
                minutes: timeSchedule.confData.EventEndMinutes || 0
            });
        } else {
            startDate = set(new Date(), {
                date: s.Day,
                month: month - 1,
                status: s.status,
                year: present.getFullYear(),
                hours: set(new Date(), { hours: 0, minutes: 0, seconds: 0 }),
                minutes: set(new Date(), { hours: 0, minutes: 0, seconds: 0 })
            });
            endDate = set(new Date(), {
                date: s.Day,
                month: month - 1,
                year: present.getFullYear(),
                hours: set(new Date(), { hours: 0, minutes: 0, seconds: 0 }),
                minutes: set(new Date(), { hours: 0, minutes: 0, seconds: 0 })
            });
        }
        return {
            startDate: startDate,
            endDate: endDate,
            status: s.status
        }
    } catch (error) {
        throw new Error("Cannot get timestamp:", error);
    };
}

const generateTimePeriod = async (userId, userModel, startFrom, endAt, status) => {
    try {
        const previousTp = await timePeriod.find({targetId: userId});
        if (previousTp.length > 0) {
            for (const cTp of previousTp) {
                const sDate = cTp.startTime;
                const eDate = cTp.endTime;
                if (sDate.getDate() === startFrom.getDate() && eDate.getDate() === endAt.getDate()) {
                    return;
                } else {
                    const newTimeP = new timePeriod({
                        targetId: userId,
                        onModel: userModel,
                        startTime: startFrom,
                        endTime: endAt,
                        status: status
                    })
                    await newTimeP.save();
                }
            };
        } else {
            const newTimeP = new timePeriod({
                targetId: userId,
                onModel: userModel,
                startTime: startFrom,
                endTime: endAt,
                status: status
            })
            await newTimeP.save();
        };
        return true;
    } catch (error) {
        throw new Error("Error generating time period:", error);
    };
};

export const generateTimePeriodsForToday = async () => {

    console.log("");
    console.log("---- RUNNING TIME SCHEDULER ----");
    console.log("");

    const roles = ['admin', 'student', 'teacher', 'backoffice'];
    const day = present.getDate();
    const month = present.getMonth();

    try {
        const { startDate, endDate, status } = await getTimeSpan(day, month);
        for (const r of roles) {
            console.log("generating time periods for:", r);
            const data = await getData(r);
            if (r === 'student') {
                let count = 0;
                const studentStartTimestamp = addMinutes(startDate, 30);
                const studentEndTimestamp = subMinutes(endDate, 30);
                if (data.length > 0) {
                    for (const d of data) {
                        console.log(`Progress: ${count}/${data.length}`);
                        await generateTimePeriod(d.userId, d.role, studentStartTimestamp, studentEndTimestamp, status);
                        count++;
                    };
                } else {
                    console.log(`Skipping ${r}s as no user(s) exists in the db.`);
                };
            } else {
                let count = 0;
                if (data.length > 0) {
                    for (const d of data) {
                        console.log(`Progress: ${count}/${data.length}`);
                        await generateTimePeriod(d.userId, d.role, startDate, endDate, status);
                        count ++;
                    };
                } else {
                    console.log(`Skipping ${r}s as no user(s) exists in the db.`);
                };
            };
        };
    } catch (error) {
        throw new Error(error);
    };
};