import { clerkMiddleware } from '@clerk/express';
import cors from "cors";
import 'dotenv/config';
import express from "express";
import baseRouter from './src/routes';

const app = express();

app.use(cors({
  origin: ["http://localhost:5173"],
}))

app.use(clerkMiddleware())
app.use("/", baseRouter)

app.listen(8080, () => {
  console.log("server started at port 8080")
})

