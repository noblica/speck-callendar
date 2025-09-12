import { Router, Request, Response } from 'express';
import { db } from '../db/db';
import { eventsTable } from '../db/schema';
import { clerkClient, getAuth, requireAuth } from '@clerk/express';
import { addMonths, endOfDay, startOfDay, subMonths } from 'date-fns';
import { createGoogleCalendarEvent, getGoogleCalendarEvents } from '../services/google';
import { eq } from 'drizzle-orm';

const baseRouter = Router();

// Fetch events from db, and sort them by start time
baseRouter.get("/events", requireAuth(), async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return;
  }

  const user = await clerkClient.users.getUser(userId);

  const eventsData = await db.select({
    name: eventsTable.name,
    start: eventsTable.start,
    end: eventsTable.end,
  })
    .from(eventsTable)
    .where(eq(eventsTable.email, user.emailAddresses[0].emailAddress))
    .orderBy(eventsTable.start);

  res.json(eventsData);
})

// Create new event
baseRouter.post("/events", requireAuth(), async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return;
  }

  const newEvent: { summary: string, start: string, end: string } = req.body
  await createGoogleCalendarEvent(userId, newEvent)

  const user = await clerkClient.users.getUser(userId);

  const dbResult = await db.insert(eventsTable).values([{
    name: newEvent.summary,
    start: new Date(newEvent.start),
    end: new Date(newEvent.end),
    email: user.emailAddresses[0].emailAddress,
  }])
  res.json(dbResult)
});

// Refetch the google calendar events for the logged in user, and replace the old event data with the new event data in our db.
baseRouter.get("/refresh", requireAuth(), async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return;
  }

  // Get user google data from clerk 
  const user = await clerkClient.users.getUser(userId)

  const currentDate = new Date();
  const minimumDate = startOfDay(subMonths(currentDate, 6))
  const maximumDate = endOfDay(addMonths(currentDate, 6))

  let nextPageToken: string | null | undefined = '1';
  let eventsToReturn: Array<{ name: string, start: Date, end: Date, email: string }> = [];

  // Recursively fetch the event data from the google API, until the nextPageToken is no longer present
  while (nextPageToken) {
    const eventsResponse = await getGoogleCalendarEvents(userId, minimumDate, maximumDate, nextPageToken === '1' ? undefined : nextPageToken)
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
  if (eventsToReturn.length > 0) {
    await db.insert(eventsTable).values(eventsToReturn)
  }

  res.json(eventsToReturn)
})

export default baseRouter;
