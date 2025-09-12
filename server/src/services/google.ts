// This service facilitates communication with the needed google endpoints.

import { clerkClient } from "@clerk/express";
import { google } from "googleapis";

export async function getGoogleCalendarEvents(
  clerkUserId: string,
  minimumDate: Date,
  maximumDate: Date,
  nextPageToken?: string
) {
  const oAuthClient = await getOAuthClient(clerkUserId);

  return google.calendar("v3").events.list({
    calendarId: "primary",
    eventTypes: ["default"],
    singleEvents: true,
    timeMin: minimumDate.toISOString(),
    timeMax: maximumDate.toISOString(),
    maxResults: 2500,
    pageToken: nextPageToken,

    auth: oAuthClient
  });
}

export async function createGoogleCalendarEvent(
  clerkUserId: string,
  newEvent: { summary: string, start: string, end: string }
) {
  const oAuthClient = await getOAuthClient(clerkUserId);

  return google.calendar("v3").events.insert({
    calendarId: "primary",
    auth: oAuthClient,
    requestBody: {
      summary: newEvent.summary,
      start: {
        dateTime: newEvent.start
      },
      end: {
        dateTime: newEvent.end
      },
    }
  }, { responseType: 'json' });
}

async function getOAuthClient(clerkUserId: string) {
  const googleAccessToken = await clerkClient.users.getUserOauthAccessToken(clerkUserId, "google")
    .then(response => response.data[0].token)

  const client = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    process.env.GOOGLE_OAUTH_REDIRECT_URL,
  );

  client.setCredentials({ access_token: googleAccessToken })
  return client;
}

