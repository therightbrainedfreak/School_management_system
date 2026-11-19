import { endOfMonth, format } from 'date-fns';
import masterCalender from '../models/masterCalender.js';
import pino_logger from '../utils/pino.js';

const monthsHasToBe = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export async function init() {
  const currentYear = new Date().getFullYear();
  pino_logger.info('Performing calendar checks');

  try {
    const existing = await masterCalender
      .find({ assessmentYear: currentYear })
      .select('assessmentMonth')
      .lean();

    const availableMonths = existing.map(item => item.assessmentMonth);
    const missingMonths = getUnavailableMonths(availableMonths);

    if (missingMonths.length === 0) {
      pino_logger.info(`Calendar complete for ${currentYear}`);
      return;
    }

    pino_logger.warn(
      `Missing ${missingMonths.length} month(s) for ${currentYear}, available ${availableMonths.length}/${monthsHasToBe.length}`
    );
    pino_logger.info('Generating missing months');

    await generateMonths(currentYear, missingMonths);

    pino_logger.info(`Generated missing month(s) for ${currentYear}`);
  } catch (error) {
    pino_logger.error({ err: error }, 'Calendar initialisation failed');
  }
}

function getUnavailableMonths(availableMonths) {
  if (!Array.isArray(availableMonths)) throw new Error('Invalid parameters');
  return monthsHasToBe.filter(month => !availableMonths.includes(month));
}

async function generateMonths(year, monthArr) {
  if (!Array.isArray(monthArr)) throw new Error('Invalid input: monthArr must be an array');
  if (monthArr.length < 1 || monthArr.length > 12) {
    throw new Error('Invalid input: monthArr must contain 1 to 12 months');
  }

  for (const month of monthArr) {
    const doc = {
      assessmentYear: year,
      assessmentMonth: month,
      monthOf: format(new Date(year, month - 1), 'MMMM'),
      days: generateDaysForMonth(year, month),
      metadata: {}
    };

    try {
      await masterCalender.create(doc);
    } catch (error) {
      // Another instance already created this month (unique index on year + month)
      if (error.code === 11000) {
        pino_logger.info(`Month ${month} already exists for ${year}, skipping`);
        continue;
      }
      throw error;
    }
  }

  return true;
}

function generateDaysForMonth(year, month) {
  const monthIndex = month - 1;
  const lastDay = endOfMonth(new Date(year, monthIndex)).getDate();
  const days = [];

  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(year, monthIndex, day);
    const dayName = format(date, 'eeee').toLowerCase();

    days.push({
      day,
      dayName,
      status: dayName === 'sunday' ? 'holiday' : 'working',
      title: '',
      isGlobal: true,
      note: ''
    });
  }

  return days;
}