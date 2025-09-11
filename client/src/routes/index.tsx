import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-2">
      <h3 className="font-bold">Welcome! Please login to use the calendar.</h3>
    </div>
  )
}
