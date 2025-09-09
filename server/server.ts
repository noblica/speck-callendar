import type { Request, Response } from 'express';
const express = require("express");

const app = express();

const cors = require("cors");
app.use(cors({
  origin: ["http://localhost:5173"],
}))


app.get("/api", (req: Request, res: Response) => {
  res.json({ "fruits": ["apples", "oranges", "bananas"] })
})

app.listen(8080, () => {
  console.log("server started at port 8080")
})
