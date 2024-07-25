import dotenv from 'dotenv';
dotenv.config();

import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoute from "./routes/auth.js";
import accountsRoute from "./routes/accounts.js";
import internalRoute from "./routes/internal.js";
import taskRoute from "./routes/task.js";

const app = express();
const server = app.listen(process.env.PORT);
app.use(helmet());

app.use(cors());
app.use(compression());
app.use(express.json());
app.set('trust proxy', true);

mongoose.connect(process.env.MONGO_URI)
    .then(async () => console.log('Connected to MongoDB')) 
    .catch((err) => console.error('Failed to connect to MongoDB:', err));


app.use("/auth", authRoute)
app.use("/accounts", accountsRoute)
app.use("/internal", internalRoute)
app.use("/tasks", taskRoute)


app.use('*', function (req, res) {
    res.json({
        no:true
    });
}); 