import { clerkClient, clerkMiddleware, getAuth, requireAuth } from '@clerk/express';
import cors from "cors";
import { addMonths, endOfDay, startOfDay, subMonths } from 'date-fns';
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import type { Request, Response } from 'express';
import express from "express";
import { google } from 'googleapis';
import { db } from './src/db';
import { eventsTable } from './src/schema';

const app = express();

app.use(cors({
  origin: ["http://localhost:5173"],
}))

app.use(clerkMiddleware())

app.get("/api/events", async (req: Request, res: Response) => {

  const eventsData = await db.select({
    name: eventsTable.name,
    start: eventsTable.start,
    end: eventsTable.end,
  })
    .from(eventsTable)
    .orderBy(eventsTable.start);

  res.json(eventsData);
})

app.get("/api/refresh", requireAuth(), async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return;
  }

  const oauthToken = await clerkClient.users.getUserOauthAccessToken(userId!, "google").then(response => response.data[0].token)
  const user = await clerkClient.users.getUser(userId!)

  const currentDate = new Date();
  const minimumDate = startOfDay(subMonths(currentDate, 6))
  const maximumDate = endOfDay(addMonths(currentDate, 6))

  let nextPageToken: string | null | undefined = '1';
  let eventsToReturn: Array<{ name: string, start: Date, end: Date, email: string }> = [];

  // Recursively fetch the event data, until the nextPageToken is no longer present
  while (nextPageToken) {
    const eventsResponse = await getGoogleCalendarEvents(oauthToken, minimumDate, maximumDate, nextPageToken === '1' ? undefined : nextPageToken)
    const eventsMapped = eventsResponse.data.items?.map(event => ({
      name: event.summary ?? "",
      start: new Date(event.start?.dateTime ?? event.start?.date ?? ""),
      end: new Date(event.end?.dateTime ?? event.end?.date ?? ""),
      email: user.emailAddresses[0].emailAddress,
    })) ?? [];
    eventsToReturn = eventsToReturn.concat(eventsMapped)
    nextPageToken = eventsResponse.data.nextPageToken;
  }

  // Delete all events the user already has in the db, before inputing new data.
  await db.delete(eventsTable).where(eq(eventsTable.email, user.emailAddresses[0].emailAddress))
  await db.insert(eventsTable).values(eventsToReturn)

  res.json(eventsToReturn)
})

app.listen(8080, () => {
  console.log("server started at port 8080")
})

async function getGoogleCalendarEvents(oauthToken: string, minimumDate: Date, maximumDate: Date, nextPageToken?: string) {
  return google.calendar("v3").events.list({
    calendarId: "primary",
    eventTypes: ["default"],
    singleEvents: true,
    timeMin: minimumDate.toISOString(),
    timeMax: maximumDate.toISOString(),
    maxResults: 2500,
    pageToken: nextPageToken,

    oauth_token: oauthToken,
  });
}
