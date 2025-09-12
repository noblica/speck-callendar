import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

const queryClient = new QueryClient()

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

const RootLayout = () => (

  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>

    <QueryClientProvider client={queryClient}>
      <div className="p-2 flex items-center gap-2">
        <SignedOut>
          <Link to="/login" className="[&.active]:font-bold">
            Login
          </Link>{' '}
        </SignedOut>
        <SignedIn>
          <Link to="/calendar" className="[&.active]:font-bold">
            Calendar
          </Link>
          <Link to="/create-event" className="[&.active]:font-bold">
            Create Event
          </Link>
          <div className="ml-auto">
            <UserButton />
          </div>
        </SignedIn>
      </div>
      <hr />
      <Outlet />
    </QueryClientProvider>
  </ClerkProvider>
)

export const Route = createRootRoute({ component: RootLayout })
