import { clerkMiddleware } from '@clerk/express';
import cors from "cors";
import 'dotenv/config';
import express from "express";
import baseRouter from './src/routes';
import path from 'path';

const app = express();

// Serve the client app
app.use(express.static(path.join(__dirname, '../client/dist')));

app.use(cors({
  origin: ["http://localhost:5173"],
}))
app.use(clerkMiddleware())
app.use(express.json())

// Defined BE routes
app.use("/api", baseRouter)

// All undefined BE routes get forwarded to the client navigation
app.get(/(.*)/, (_, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.listen(8080, () => {
  console.log("server started at port 8080")
})

