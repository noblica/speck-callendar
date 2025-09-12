import { useAuth, useUser } from '@clerk/clerk-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { getCalendarEvents } from '../api/events';
import { refreshCalendarData } from '../api/refresh';
import Day from '../components/Day';
import Month from '../components/Month';
import Week from '../components/Week';

export const Route = createFileRoute('/calendar')({
  component: Calendar,
})

function Calendar() {
  const { getToken } = useAuth();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  if (!isSignedIn) {
    navigate({ to: '/login' })
  }

  const [selectedView, setSelectedView] = useState("week")

  const queryClient = useQueryClient()

  // Executed when the user clicks the "Refresh Calendar Data" button
  const refreshDataMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) {
        return null;
      }
      return refreshCalendarData(token)
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] })
    },
  })

  // Executed on load and after refreshDataMutation is done updating the DB.
  const calendarEventsQuery = useQuery({
    queryKey: ['calendar-events'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        return null
      }
      return getCalendarEvents(token)
    }
  });

  if (calendarEventsQuery.isLoading) {
    return <p>Loading...</p>
  }

  return (
    <div className="p-2">
      <button
        className="border border-black hover:cursor-pointer"
        onClick={() => refreshDataMutation.mutate()}
        disabled={refreshDataMutation.isPending}
      >
        {refreshDataMutation.isPending && "Refreshing DB data..."}
        {!refreshDataMutation.isPending && "Refresh Calendar Data"}
      </button>

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

      {calendarEventsQuery.isFetching && (
        <p>Fetching calendar events...</p>
      )}

      {selectedView === "day" && (
        <Day
          calendarEvents={calendarEventsQuery.data}
        />
      )}
      {selectedView === "week" && (
        <Week
          calendarEvents={calendarEventsQuery.data}
        />
      )}
      {selectedView === "month" && (
        <Month calendarEvents={calendarEventsQuery.data} />
      )}

    </div>
  )
}


