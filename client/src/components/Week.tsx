import { addDays, eachDayOfInterval, subDays } from "date-fns";
import { useState } from "react";

type CalendarEvent = {
  name: string;
  start: string;
  end: string;
}

export default function Week(props: { calendarEvents?: CalendarEvent[] }) {
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

  const groupedCalendarEvents = Object.groupBy(props.calendarEvents, ({ start }) => (new Date(start).toLocaleDateString()))

  return (
    <>
      <div className="flex gap-3">
        <button className="border border-black hover:cursor-pointer"
          onClick={() => setFirstVisibleDate(subDays(firstVisibleDate, 7))}>Previous Week</button>
        <button className="border border-black hover:cursor-pointer"
          onClick={() => setFirstVisibleDate(addDays(firstVisibleDate, 7))}>Next Week</button>
      </div>

      <div className="flex flex-col gap-5 mt-10">
        {datesToShow.map(dateItem => {
          const dateEvents = groupedCalendarEvents?.[dateItem.toLocaleDateString()];
          return (
            <div key={dateItem.toLocaleDateString()} className="border border-black p-2">
              <p className="font-bold">{dateItem.toLocaleDateString()}</p>
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
          )
        })}
      </div>
    </>
  )
}
