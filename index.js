import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './src/config/db.js';
import jsonHandler from './src/middlewares/jsonHandler.js'

const port = process.env.PORT || 3000;
const app = express();
connectDB();

app.use(express.json());
app.use(jsonHandler);
app.use(cookieParser());

import adminRoutes from './src/routes/adminRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import publicRoutes from './src/routes/publicRoutes.js';
import superUserRoutes from './src/routes/superUserRoutes.js';

app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', publicRoutes);
app.use('/api/v1/su', superUserRoutes);

app.get('/', (req, res) => {
    res.json({message: 'Welome to school management backend.'});
});

app.listen(port, () => {
    console.log(`Listening on port => ${port}`);
});