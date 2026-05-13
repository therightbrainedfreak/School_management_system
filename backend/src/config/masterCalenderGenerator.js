import { startOfMonth, endOfMonth, format } from 'date-fns';
import masterCalender from '../models/masterCalender.js';
import pino_logger from '../utils/pino.js'

export async function initCalenderGenerator(allowGenerate) {
    const currentYear = new Date().getFullYear();
    try {
        const currentCalender = await masterCalender.find({ assessmentYear: currentYear });
        if (currentCalender.length !== 12) {
            pino_logger.error('Missing or invalid master calender');
            await masterCalender.deleteMany({});
            if (allowGenerate) {
                pino_logger.info('Generating new master calender')
                main(currentYear);
            }
        };
    } catch (error) {
        pino_logger.error({error: error}, 'Unknown error occured while initializing calender generator');
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

async function main(year) {
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
            pino_logger.error({error: error}, 'Unknown error occured on the second stage of master calender generation')
        };
    };
    pino_logger.info('Master calender generared!')
};