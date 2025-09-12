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

  <div className="bg-gray-900 min-h-dvh text-white scheme-dark">
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>

      <QueryClientProvider client={queryClient}>
        <div className="mx-auto max-w-7xl p-2 flex items-center gap-2 bg-">
          <SignedOut>
            <Link to="/login" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white [&.active]:bg-gray-950/50 [&.active]:text-white">
              Login
            </Link>{' '}
          </SignedOut>
          <SignedIn>
            <Link to="/calendar" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white [&.active]:bg-gray-950/50 [&.active]:text-white">
              Calendar
            </Link>
            <Link to="/create-event" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white [&.active]:bg-gray-950/50 [&.active]:text-white">
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
  </div>
)

export const Route = createRootRoute({ component: RootLayout })
