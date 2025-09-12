import { useAuth, useUser } from '@clerk/clerk-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { getCalendarEvents } from '../api/events';
import { refreshCalendarData } from '../api/refresh';
import Day from '../components/Day';
import Month from '../components/Month';
import Week from '../components/Week';
import BaseButton from '../components/BaseButton';

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
      // Invalidate events and refetch
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
    },
  });

  if (calendarEventsQuery.isLoading) {
    return <p>Loading...</p>
  }

  return (
    <div className="p-2 flex flex-col gap-5 max-w-xl mx-auto">
      <BaseButton
        onClick={() => refreshDataMutation.mutate()}
        disabled={refreshDataMutation.isPending}
      >
        {refreshDataMutation.isPending && "Refreshing DB data..."}
        {!refreshDataMutation.isPending && "Refresh Calendar Data"}
      </BaseButton>

      <div>
        <label htmlFor="view-by" className="block text-sm/6 font-medium text-white">View By</label>
        <div className="mt-2 grid grid-cols-1">
          <select
            id="view-by"
            name="view-by"
            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white/5 py-1.5 pr-8 pl-3 text-base text-white outline-1 -outline-offset-1 outline-white/10 *:bg-gray-800 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-500 sm:text-sm/6"
            value={selectedView}
            onChange={(event) => setSelectedView(event.target.value)}
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value='month'>Month</option>
          </select>
          <svg viewBox="0 0 16 16" fill="currentColor" data-slot="icon" aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-400 sm:size-4"
          >
            <path d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" fill-rule="evenodd" />
          </svg>
        </div>
      </div>

      {calendarEventsQuery.isFetching && (
        <p>Fetching calendar events...</p>
      )}

      {/* If the fetching is done, but the user has no events in the DB, show the empty state suggesting the next action. */}
      {calendarEventsQuery.isSuccess &&
        calendarEventsQuery.data?.length === 0 && (
          <div className="text-center mt-5">
            <p className="font-bold text-lg">You have no calendar events!</p>
            <p>Please try clicking the "Refresh Calendar Data" button.</p>
          </div>
        )}

      {calendarEventsQuery.isSuccess &&
        (calendarEventsQuery.data?.length ?? 0) > 0 && (
          <>
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
          </>
        )}

    </div>
  )
}


