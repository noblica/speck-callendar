import { addMonths, eachWeekOfInterval, endOfMonth, endOfWeek, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { useState } from "react";

type CalendarEvent = {
  name: string;
  start: string;
  end: string;
}

export default function Month(props: { calendarEvents?: CalendarEvent[] }) {
  const currentDate = new Date();

  const [firstVisibleDate, setFirstVisibleDate] = useState(startOfMonth(currentDate))

  const datesToShow = eachWeekOfInterval({
    start: firstVisibleDate,
    end: endOfMonth(firstVisibleDate)
  })

  if (!props.calendarEvents) {
    return (
      <p>No Events to Show!</p>
    )
  }

  const groupedCalendarEvents = Object.groupBy(props.calendarEvents, ({ start }) => (startOfWeek(new Date(start)).toLocaleDateString()))

  return (
    <>
      <div className="flex gap-3">
        <button className="border border-black hover:cursor-pointer"
          onClick={() => setFirstVisibleDate(subMonths(firstVisibleDate, 1))}>Previous Month</button>
        <button className="border border-black hover:cursor-pointer"
          onClick={() => setFirstVisibleDate(addMonths(firstVisibleDate, 1))}>Next Month</button>
      </div>

      <div className="flex flex-col gap-5 mt-10">
        {datesToShow.map(dateItem => {
          const dateEvents = groupedCalendarEvents?.[dateItem.toLocaleDateString()];
          return (
            <div key={dateItem.toLocaleDateString()} className="border border-black p-2">
              <p className="font-bold">{dateItem.toLocaleDateString()} - {endOfWeek(dateItem).toLocaleDateString()}</p>
              <ul>
                {!dateEvents && <p>No events scheduled for this date!</p>}
                {dateEvents?.map((event: { name: string, start: string, end: string }) => (
                  <li key={event.start}>
                    <p className="font-bold">{event.name}</p>
                    <p>{(new Date(event.start)).toLocaleString()} - {(new Date(event.end)).toLocaleString()}</p>
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
