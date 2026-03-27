import { startOfMonth, endOfMonth, format } from 'date-fns';
import masterCalender from '../models/masterCalender.js';

function generateCal(year, month) {
    const specifiedMonth = new Date(year, month);
    const firstDay = startOfMonth(specifiedMonth).getDate();
    const lastDay = endOfMonth(specifiedMonth).getDate();
    const days = [];
    for ( let i = firstDay; i <= lastDay; i++ ) {
        const currentDate = new Date(year, month, i);
        const tt = format(currentDate, 'eeee').toLowerCase() === 'sunday' ? 'holiday' : 'working';
        const data = {
            day: i,
            dayName: format(currentDate, 'eeee').toLowerCase(),
            status: tt,
            title: "",
            isGlobal: true,
            note: ""
        };
        days.push(data);
    };
    return days;
};

function generateBucket(year, month) {
    const bucket = {
        assessmentYear: year,
        assessmentMonth: month,
        monthOf: format(new Date(year, month), 'MMMM'),
        days: generateCal(year, month),
        metadata: {}
    };
    return bucket;
};

async function saveBucket(bucket) {
    try {
        const newCalender = new masterCalender(bucket);
        await newCalender.save();
        return {status: true, message: "Bucket Created!"};
    } catch (err) {
        return {status: false, message: err.message};
    };
};

export async function main(year) {
    const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    for (const month of months) {
        const bucket = generateBucket(year, month);
        const success = await saveBucket(bucket);
        if (!success.status) {
            return console.log(success.message)
        } else {
            console.log(success.message)
        }
    };
};