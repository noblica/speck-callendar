import { addDays, subDays } from "date-fns";
import { useState } from "react";
import type { CalendarEvent } from "../api/getCalendarEvents";

export default function Day(props: {
  calendarEvents?: CalendarEvent[] | null
}) {
  const [visibleDate, setVisibleDate] = useState(new Date())

  if (!props.calendarEvents) {
    return (
      <p>No Events to Show!</p>
    )
  }
  const groupedCalendarEvents = Object.groupBy(props.calendarEvents, ({ start }) => (new Date(start).toLocaleDateString()))
  const dateEvents = groupedCalendarEvents?.[visibleDate.toLocaleDateString()];

  return (
    <>
      <div className="flex gap-3">
        <button className="border border-black hover:cursor-pointer"
          onClick={() => setVisibleDate(subDays(visibleDate, 1))}>Previous Day</button>
        <button className="border border-black hover:cursor-pointer"
          onClick={() => setVisibleDate(addDays(visibleDate, 1))}>Next Day</button>
      </div>

      <div className="flex flex-col gap-5 mt-10">
        <div className="border border-black p-2">
          <p className="font-bold">{visibleDate.toLocaleDateString()}</p>
          <ul>
            {!dateEvents && <p>No events scheduled for this date!</p>}
            {dateEvents?.map((event: { name: string, start: string, end: string }) => (
              <li key={event.start}>
                <p className="font-bold">{event.name}</p>
                <p>{(new Date(event.start)).toLocaleTimeString()} - {(new Date(event.end)).toLocaleTimeString()}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
