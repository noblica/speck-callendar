import { ClerkProvider } from '@clerk/clerk-react'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

const RootLayout = () => (
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <div className="p-2 flex items-center gap-2">
      <SignedOut>
        <Link to="/login" className="[&.active]:font-bold">
          Login
        </Link>{' '}
      </SignedOut>
      <Link to="/calendar" className="[&.active]:font-bold">
        Calendar
      </Link>
      <div className="ml-auto">
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
    <hr />
    <Outlet />
    <TanStackRouterDevtools />
  </ClerkProvider>
)

export const Route = createRootRoute({ component: RootLayout })
