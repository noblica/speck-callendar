import { SignedOut, SignInButton, useUser } from '@clerk/clerk-react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
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

  const fetchApi = async () => {
    const response = await fetch("http://localhost:8080/api").then(res => res.json())
    console.log(response)
  }
  useEffect(() => {
    fetchApi();
  }, [])


  // return <div>Hello "/login"!</div>
  return (
    <header className="p-2">
      <SignedOut>
        <SignInButton>
          <BaseButton>Sign In</BaseButton>
        </SignInButton>
      </SignedOut>
    </header>
  )
}
