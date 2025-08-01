import express from 'express'
import cors from "cors"

const app  = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
})

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import parkingSpaceRouter from './routes/parkingSpace.routes.js';


app.use('/api/parking-space', parkingSpaceRouter);

export {app};

