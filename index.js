import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './src/config/db.js';
import jsonHandler from './src/middlewares/jsonHandler.js';
import cron from 'node-cron';
import { generateTimePeriod } from './src/config/timeScheduleGenerator.js';

const port = process.env.PORT || 3000;
const app = express();

connectDB();

// Only run while needed or running first time, running this will wipe out all the info linked to the master calender suck as holidays, schedules events.

import { initCalenderGenerator } from './src/config/masterCalenderGenerator.js';
initCalenderGenerator(false); // run it with true to reset and generate a fresh master calender.

cron.schedule('0 6 * * *', () => {
    generateTimePeriod();
}, {
    scheduled: true
});

app.use(express.json());
app.use(jsonHandler);
app.use(cookieParser());

import authRoutes from './src/routes/authRoutes.js';
import publicRoutes from './src/routes/publicRoutes.js';
import superUserRoutes from './src/routes/superUserRoutes.js';
import systemRoutes from './src/routes/systemRoutes.js';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/public', publicRoutes);
app.use('/api/v1/su', superUserRoutes);
app.use('/api/v1', systemRoutes);

app.get('/', (req, res) => {
    res.json({message: 'Welome to school management backend.', api: "v1.0.0"});
});

app.listen(port, () => {
    console.log(`Listening on port => ${port}`);
});