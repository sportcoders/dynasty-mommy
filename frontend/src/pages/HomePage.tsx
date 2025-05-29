import '../App.css'
import { getLeaguesForUser, getUser } from '../services/sleeper'
import { useEffect, useState } from 'react'
import type { League } from '../services/sleeper/types'
import { TextField, Select, RadioGroup, FormControl, InputLabel, FormLabel, FormControlLabel, Radio, MenuItem, type SelectChangeEvent, Button, CircularProgress } from '@mui/material'

type SleeperAccountProps = {
    onSearch: (searchType: string, value: string, season: string) => void
    //function tha takes in those parameters and returns void
}
type SleeperLeaguesProps = {
    searchType: string
    value: string
    season: string
}
export default function Home() {
    const [searchParams, setSearchParams] = useState<{ searchType: string; value: string; season: string } | null>(null)
    //search params is either a dict that has those types or null

    const handleSearch = (searchType: string, value: string, season: string) => {
        setSearchParams({ searchType, value, season })
        //setting values to later be used in call
    }

    return (
        <>
            <h1>Sleeper League Search</h1>
            <SleeperAccount onSearch={handleSearch} />
            {searchParams && (
                <SleeperLeagues
                    searchType={searchParams.searchType}
                    value={searchParams.value}
                    season={searchParams.season}
                />
            )}
        </>
    )
}

function SleeperAccount({ onSearch }: SleeperAccountProps) {
    const currentDate: Date = new Date()
    const currentYear = currentDate.getFullYear()
    const validYears = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => i + 2000).reverse();

    const [searchType, setSearchType] = useState<string>("Username")
    const [season, setSeason] = useState<string>(String(currentYear))
    const [searchParams, setSearchParams] = useState("")
    const handleSeasonChange = (event: SelectChangeEvent) => {
        setSeason((event.target.value))
    }
    const handleSearchTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchType((event.target as HTMLInputElement).value)
    }
    const handleTextFieldEntry = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchParams(event.target.value)
    }
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch(searchType, searchParams.trim(), season)
    }
    return (
        <div>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel>Find Leauge By</InputLabel>
                <RadioGroup
                    value={searchType}
                    onChange={handleSearchTypeChange}>
                    <FormControlLabel value='Username' control={<Radio />} label="Username" />
                    <FormControlLabel value='Leauge ID' control={<Radio />} label="League ID" />
                </RadioGroup>
                <TextField label={searchType} required variant='outlined' onChange={handleTextFieldEntry}></TextField>
                <Select
                    label='Year'
                    value={season}
                    onChange={handleSeasonChange}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 48 * 4 + 8, // 4 items visible at a time
                                //48 is default height if menu item in MUI
                                //"+8 is for padding"
                                //maxHeight = default height for menu item * number of items to show + padding
                            },
                        },
                    }}>
                    {validYears.map((year) => {
                        return <MenuItem key={year} value={year}>{year}</MenuItem>;
                    })}
                </Select>
            </FormControl>
            <Button onClick={handleSubmit}>Submit</Button>
        </div>
    )
}

function SleeperLeagues({ searchType, value, season }: SleeperLeaguesProps) {
    const [leagues, setLeagues] = useState<League[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchLeagues() {
            setLoading(true)
            setError(null)
            setLeagues([])
            try {
                let leagues: League[] = []
                if (searchType === 'Username') {
                    leagues = await getLeaguesForUser(value, season)
                } else if (searchType === 'League ID') {
                    setError('Search by League ID not implemented yet')
                    setLoading(false)
                    return
                }
                setLeagues(leagues)
            } catch (err) {
                setError('Error fetching leagues')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchLeagues()
    }, [searchType, value, season])

    if (loading) return <CircularProgress />

    if (error) return <div style={{ color: 'red' }}>{error}</div>

    if (leagues.length === 0) return <div>No leagues found.</div>

    return (
        <ul>
            {leagues.map((league) => (
                <li key={league.league_id}>
                    <strong>{league.name}</strong> (Season: {league.season})
                </li>
            ))}
        </ul>
    )
}