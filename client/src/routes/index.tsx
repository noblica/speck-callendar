import { useUser } from '@clerk/clerk-react';
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  if (isSignedIn) {
    navigate({ to: '/calendar', replace: true })
  }

  navigate({ to: "/login", replace: true })

  return (
    <div className="p-2">
      <h3 className="font-bold">Welcome! Please wait while we redirect you...</h3>
    </div>
  )
}
