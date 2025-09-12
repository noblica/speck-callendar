export type CalendarEvent = {
  name: string;
  start: string;
  end: string;
}

export type GoogleCalendarEvent = {
  summary: string;
  start: string;
  end: string;
}

export const getCalendarEvents = async (token: string) => {
  const calendarEvents: CalendarEvent[] = await fetch("http://localhost:8080/api/events", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(res => res.json())
  return calendarEvents;
}

export const createCalendarEvent = async (token: string, calendarEvent: GoogleCalendarEvent) => {
  const createdCalendarEvent: CalendarEvent[] = await fetch("http://localhost:8080/api/events", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(calendarEvent),
  }).then(res => res.json())

  return createdCalendarEvent;
}

