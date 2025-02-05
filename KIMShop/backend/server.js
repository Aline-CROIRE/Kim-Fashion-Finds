
import express from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/auth.route.js"
import { connectDB } from './lib/db.js';


dotenv.config();



const app=express();
const PORT=process.env.PORT || 5000


app.use(express.json());// to parse body
app.use(cookieParser());
app.use('/api/auth',authRoutes)



    app.listen(5000,()=>{
        console.log('sever is running on http://localhost:' +PORT);
        connectDB();
    });
