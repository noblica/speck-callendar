import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { createCalendarEvent } from '../api/events';
import { useAuth, useUser } from '@clerk/clerk-react';
import { isBefore } from 'date-fns';
import BaseButton from '../components/BaseButton';

export const Route = createFileRoute('/create-event')({
  component: RouteComponent,
})

type CalendarEvent = {
  summary: string,
  start: string,
  end: string,
}

function RouteComponent() {
  const { getToken } = useAuth();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  if (!isSignedIn) {
    navigate({ to: '/login' })
  }

  const queryClient = useQueryClient()
  const createEventMutation = useMutation({
    mutationFn: async (eventData: { summary: string, start: string, end: string }) => {
      const token = await getToken();
      if (!token) {
        return null;
      }
      return createCalendarEvent(token, eventData)
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] })
      alert("Calendar Event Created Successfully!")
    },
  })

  return <div className="p-2">
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const newEventLocalTime = Object.fromEntries(formData.entries()) as CalendarEvent;
        const startDate = new Date(newEventLocalTime.start);
        const endDate = new Date(newEventLocalTime.end);

        if (isBefore(endDate, startDate)) {
          alert("End Date must be after Start Date!")
          return;
        }

        createEventMutation.mutate({
          summary: newEventLocalTime.summary,
          start: startDate.toISOString(),
          end: endDate.toISOString()
        })

      }}
    >
      <div className="flex gap-2">
        <label htmlFor="summary">Summary</label>
        <input className="border" type="text" name="summary" required />
      </div>

      <div className="flex gap-2">
        <label htmlFor="start">Start Date</label>
        <input className="border" type="datetime-local" name="start" />
      </div>

      <div className="flex gap-2">
        <label htmlFor="end">End Date</label>
        <input className="border" type="datetime-local" name="end" />
      </div>

      <BaseButton
        type="submit">
        {createEventMutation.isPending && "Working..."}
        {!createEventMutation.isPending && "Submit"}
      </BaseButton>
    </form>
  </div>
}
