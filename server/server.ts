import type { Request, Response } from 'express';
import 'dotenv/config'
import express from "express";
import cors from "cors";
import { clerkMiddleware } from '@clerk/express';
import { db } from './src/db';
import { eventsTable } from './src/schema';

const app = express();

app.use(cors({
  origin: ["http://localhost:5173"],
}))

app.use(clerkMiddleware())

app.get("/api", (req: Request, res: Response) => {
  res.json({ "fruits": ["apples", "oranges", "bananas"] })
})

app.get("/api/events", async (req: Request, res: Response) => {
  const eventsData = await db.select().from(eventsTable);
  res.json(eventsData);
})

app.listen(8080, () => {
  console.log("server started at port 8080")
})
