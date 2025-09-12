import { SignedOut, SignInButton, useUser } from '@clerk/clerk-react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import BaseButton from '../components/BaseButton';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  if (isSignedIn) {
    navigate({ to: '/calendar', replace: true })
  }

  return (
    <header className="p-2 flex justify-center">
      <SignedOut>
        <SignInButton>
          <BaseButton>Sign In</BaseButton>
        </SignInButton>
      </SignedOut>
    </header>
  )
}
