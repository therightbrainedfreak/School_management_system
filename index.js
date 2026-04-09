// *imports

import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './src/config/db.js';
import jsonHandler from './src/middlewares/jsonHandler.js';
import cron from 'node-cron';
import { generateTimePeriod } from './src/config/timeScheduleGenerator.js';
import { globalLimiter } from './src/middlewares/rateLimiter.js';

// *declarations / configs

const port = process.env.PORT || 3000;

const app = express();

connectDB();

// Only run while needed or running first time, running this will wipe out all the info linked to the master calender such as holidays, schedules events.

import { initCalenderGenerator } from './src/config/masterCalenderGenerator.js';

initCalenderGenerator(false); // run it with true to reset and generate a fresh master calender.

// *daily cron job for creating timeschedule for every user.

cron.schedule('0 6 * * *', () => {
    generateTimePeriod();
}, {
    scheduled: true
});

// *middlewares

app.use(globalLimiter);
app.set('trust proxy', 1)
app.use(express.json());
app.use(jsonHandler);
app.use(cookieParser());

// *routes

app.get('/', (req, res) => {
    res.json({
        message: 'Welome to school management system.',
        metadata: {
            api: "v1.0.0",
            node: "v24.6.0",
            npm: "v11.5.1",
            mongodb: "v8.0.0"
        }
    });
});

import authRoutes from './src/routes/authRoutes.js';
import publicRoutes from './src/routes/publicRoutes.js';
import superUserRoutes from './src/routes/superUserRoutes.js';
import systemRoutes from './src/routes/systemRoutes.js';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/public', publicRoutes);
app.use('/api/v1/su', superUserRoutes);
app.use('/api/v1', systemRoutes);

// *listener

app.listen(port, () => {
    console.log(`Listening on port => ${port}`);
});