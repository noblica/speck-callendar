export async function refreshCalendarData(token: string) {
  await fetch("http://localhost:8080/api/refresh", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(res => res.json())

}
