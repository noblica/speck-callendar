import type { Request, Response } from 'express';
import 'dotenv/config'
import express from "express";
import cors from "cors";
import { clerkMiddleware } from '@clerk/express';

const app = express();

app.use(cors({
  origin: ["http://localhost:5173"],
}))

app.use(clerkMiddleware())

app.get("/api", (req: Request, res: Response) => {
  res.json({ "fruits": ["apples", "oranges", "bananas"] })
})

app.listen(8080, () => {
  console.log("server started at port 8080")
})
