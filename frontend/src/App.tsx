import './App.css'
import { getLeaguesForUser, getUser } from './services/sleeper'
import { useEffect, useState } from 'react'
import type { League, User } from './services/sleeper/types'

function App() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leagues = await getLeaguesForUser('1090899317067526144', '2024');
        const user = await getUser('jordannfung');
        setLeagues(leagues);
        setUser(user);
      } catch (error) {
        setError('Error fetching user')
        console.error('Error fetching user:', error)
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
      <p>{user?.username} id is {user?.user_id}</p>
    </>
  )
}

export default App