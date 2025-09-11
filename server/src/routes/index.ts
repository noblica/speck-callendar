import { Router, Request, Response } from 'express';
import { db } from '../db/db';
import { eventsTable } from '../db/schema';
import { clerkClient, getAuth, requireAuth } from '@clerk/express';
import { addMonths, endOfDay, startOfDay, subMonths } from 'date-fns';
import { getGoogleCalendarEvents } from '../services/google';
import { eq } from 'drizzle-orm';

const baseRouter = Router();

baseRouter.get("/api/events", async (req: Request, res: Response) => {
  const eventsData = await db.select({
    name: eventsTable.name,
    start: eventsTable.start,
    end: eventsTable.end,
  })
    .from(eventsTable)
    .orderBy(eventsTable.start);

  res.json(eventsData);
})

baseRouter.get("/api/refresh", requireAuth(), async (req: Request, res: Response) => {
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

export default baseRouter;
