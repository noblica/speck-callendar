import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
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
          <button className="border border-1 cursor-pointer">Sign In</button>
        </SignInButton>
      </SignedOut>
    </header>
  )
}
