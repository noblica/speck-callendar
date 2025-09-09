import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/calendar')({
  component: Calendar,
})

function Calendar() {
  return <div className="p-2">Hello from Calendar!</div>
}
