export type CalendarEvent = {
  name: string;
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

