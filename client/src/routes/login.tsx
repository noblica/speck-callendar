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


  return <div>Hello "/login"!</div>
}
