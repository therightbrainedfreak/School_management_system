import { startOfMonth, endOfMonth, format } from 'date-fns';
import masterCalender from '../models/masterCalender.js';

export async function initCalenderGenerator(allowGenerate) {
    const currentYear = new Date().getFullYear();
    try {
        const currentCalender = await masterCalender.find({ assessmentYear: currentYear });
        if (currentCalender.length !== 12) {
            console.log("Missing or Incorrect master calender, init with true to generate again. All holidays and configured data will be wiped out.")
            await masterCalender.deleteMany({});
            if (allowGenerate) {
                main(currentYear);
            }
        };
    } catch (error) {
        console.error(error);
    }
};

function generateCal(year, month) {
    const specifiedMonth = new Date(year, month);
    const firstDay = startOfMonth(specifiedMonth).getDate();
    const lastDay = endOfMonth(specifiedMonth).getDate();
    const days = [];
    for (let i = firstDay; i <= lastDay; i++) {
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

export async function main(year) {
    // Define months.
    const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    // Run a bucket creation for each month.
    for (const month of months) {
        const bucket = {
            assessmentYear: year,
            assessmentMonth: month,
            monthOf: format(new Date(year, month), 'MMMM'),
            days: generateCal(year, month),
            metadata: {}
        };
        try {
            const newCalender = new masterCalender(bucket);
            await newCalender.save();
        } catch (error) {
            throw new Error(error);
        };
    };
    console.log("Master Calender Generated!");
};