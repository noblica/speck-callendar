import { google } from "googleapis";

export async function getGoogleCalendarEvents(oauthToken: string, minimumDate: Date, maximumDate: Date, nextPageToken?: string) {
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
