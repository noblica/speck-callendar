import { useAuth } from '@clerk/clerk-react'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react';
import Week from '../components/Week';
import Day from '../components/Day';
import Month from '../components/Month';

type GroupedEvents = {
  name: string;
  start: string;
  end: string;
}[]

export const Route = createFileRoute('/calendar')({
  component: Calendar,
})

function Calendar() {
  const { getToken } = useAuth();

  const [calendarEvents, setCalendarEvents] = useState<GroupedEvents>()
  const [selectedView, setSelectedView] = useState("week")

  const refreshEventData = async () => {
    const token = await getToken()
    await fetch("http://localhost:8080/api/refresh", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => res.json())

    getEvents();
  }

  const getEvents = async () => {
    const token = await getToken()
    const events: Array<{ name: string, start: string, end: string }> = await fetch("http://localhost:8080/api/events", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => res.json())

    setCalendarEvents(events);
  }

  useEffect(() => {
    getEvents()
  }, [])

  return (
    <div className="p-2">
      <button className="border border-black hover:cursor-pointer" onClick={() => refreshEventData()}>Refresh Calendar Data</button>
      <br />

      <select
        className="border border-black"
        value={selectedView}
        onChange={(event) => setSelectedView(event.target.value)}
      >
        <option value="day">Day</option>
        <option value="week">Week</option>
        <option value='month'>Month</option>
      </select>


      {selectedView === "day" && (
        <Day calendarEvents={calendarEvents} />
      )}
      {selectedView === "week" && (
        <Week calendarEvents={calendarEvents} />
      )}
      {selectedView === "month" && (
        <Month calendarEvents={calendarEvents} />
      )}

    </div>
  )
}

