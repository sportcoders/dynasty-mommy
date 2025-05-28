import './App.css'
import { getLeaguesForUser } from './services/sleeper'
import { useEffect, useState } from 'react'
import type { League } from './services/sleeper/types'

function App() {
  const [leagues, setLeagues] = useState<League[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leagues = await getLeaguesForUser('1030058668634619904', '2025')
        setLeagues(leagues)
      } catch (error) {
        setError('Error fetching leagues')
        console.error('Error fetching leagues:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <h1>Hello</h1>
      <p>This is inside a fragment.</p>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {leagues.map(league => (
          <li key={league.league_id}>
            <strong>{league.name}</strong> (Season: {league.season})
          </li>
        ))}
      </ul>
    </>
  )
}

export default App