import { addDays, eachDayOfInterval, subDays } from "date-fns";
import { useState } from "react";
import type { CalendarEvent } from "../api/events";
import BaseButton from "./BaseButton";

export default function Week(props: {
  calendarEvents?: CalendarEvent[] | null;
}) {
  const [firstVisibleDate, setFirstVisibleDate] = useState(new Date())

  const datesToShow = eachDayOfInterval({
    start: firstVisibleDate,
    end: addDays(firstVisibleDate, 6)
  })

  if (!props.calendarEvents) {
    return (
      <p>No Events to Show!</p>
    )
  }

  // Generate an object where the keys are dates, and values are arrays containing all the events belonging to that date.
  // We do this on the FE, because we want the grouping to work in local time, not in UTC.
  const groupedCalendarEvents = Object.groupBy(props.calendarEvents, ({ start }) => (new Date(start).toLocaleDateString()))

  return (
    <>
      <div className="flex items-center justify-center gap-3">
        <BaseButton
          onClick={() => setFirstVisibleDate(subDays(firstVisibleDate, 7))}
        >Previous Week</BaseButton>
        <BaseButton
          onClick={() => setFirstVisibleDate(addDays(firstVisibleDate, 7))}
        >Next Week</BaseButton>
      </div>

      <div className="flex flex-col gap-5 mt-5">
        {datesToShow.map(dateItem => {
          const dateEvents = groupedCalendarEvents?.[dateItem.toLocaleDateString()];
          return (
            <div key={dateItem.toLocaleDateString()} className="border border-black p-2">
              <p className="font-bold">{dateItem.toLocaleDateString()}</p>
              <ul>
                {/* If we have no events to display for a selected date */}
                {!dateEvents && <p>No events scheduled for this date!</p>}

                {dateEvents?.map((event: { name: string, start: string, end: string }) => (
                  <li key={event.start}>
                    <p className="font-bold">{event.name}</p>
                    <p>{(new Date(event.start)).toLocaleTimeString()} - {(new Date(event.end)).toLocaleTimeString()}</p>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </>
  )
}
