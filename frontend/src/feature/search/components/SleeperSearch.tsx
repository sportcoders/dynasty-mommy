import { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Snackbar, Stack, TextField } from '@mui/material'
import { useRouter } from '@tanstack/react-router'
import { Route as LeagueRoute } from '@routes/leagues.$leaugeId'
import { sleeper_getAvatarThumbnail, sleeper_getLeagues } from '@services/sleeper'
import type { League } from '@services/sleeper/types'
import { DisplayLeaguesList } from '@components/DisplayLeaguesList'
import SelectSeasonDropDown from '@components/SelectSeasonDropDown'

type SleeperAccountProps = {
    onSearch: (searchType: string, value: string, season: string) => void
}

type SleeperLeaguesProps = {
    searchType: string
    value: string
    season: string
    back: () => void
}

/**
 * SleeperSearch is a reusable component for the Sleeper League Search feature.
 * 
 * It manages the search state for leagues, allowing users to search by a specified type,
 * value, and season. When search parameters are set, it displays the SleeperLeagues component
 * with the current search criteria. Otherwise, it renders the SleeperAccount component to allow
 * the user to initiate a new search.
 * 
 * This component is intended to be used as part of a larger feature, not as a standalone page.
 * 
 * @returns {JSX.Element} The rendered search interface for Sleeper leagues.
 */
export default function SleeperSearch() {
    const [searchParams, setSearchParams] = useState<{ searchType: string; value: string; season: string } | null>(null)
    const handleSearch = (searchType: string, value: string, season: string) => {
        setSearchParams({ searchType, value, season })
    }

    return (
        <Stack>
            <h1>Sleeper League Search</h1>
            {searchParams ?
                (
                    <SleeperLeagues
                        searchType={searchParams.searchType}
                        value={searchParams.value}
                        season={searchParams.season}
                        back={() => setSearchParams(null)}
                    />
                ) :
                <SleeperAccount onSearch={handleSearch} />
            }

        </Stack>
    )
}

/**
 * 
 */
function SleeperAccount({ onSearch }: SleeperAccountProps) {

    const [searchType, setSearchType] = useState<string>("Username")
    const [season, setSeason] = useState<string>('')
    const [searchParams, setSearchParams] = useState("")

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
        <Box sx={{ borderRadius: 2, bgcolor: '#D3D3D3', p: 3, m: 2, boxShadow: 1, borderColor: 'black', border: 1, display: 'inline', minWidth: 1 / 4, minHeight: 1 / 2 }}>
            <FormControl fullWidth>
                <FormLabel>Find Leauge By</FormLabel>
                <RadioGroup
                    value={searchType}
                    onChange={handleSearchTypeChange}>
                    <FormControlLabel value='Username' control={<Radio />} label="Username" />
                    <FormControlLabel value='Leauge ID' control={<Radio />} label="League ID" />
                </RadioGroup>
                <Box sx={{ m: 2 }} display='flex' gap={1}>
                    <TextField label={searchType} required variant='outlined' onChange={handleTextFieldEntry}></TextField>
                    <SelectSeasonDropDown updateSeason={setSeason} selectedYear={season} />
                </Box>
                <Button onClick={handleSubmit} variant="contained" sx={{ m: 1 }}>Submit</Button>
            </FormControl>
        </Box>
    )
}

/**
 * 
 */
function SleeperLeagues({ searchType, value, season, back }: SleeperLeaguesProps) {
    const [leagues, setLeagues] = useState<League[]>([])
    const [year, setYear] = useState<string>(season)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const blobUrls: string[] = []
    const router = useRouter()
    const handleNavigateToLeague = (id: string) => {
        router.navigate({
            to: LeagueRoute.to,
            params: { leaugeId: id }
        })
    }
    async function fetchLeagues() {
        setLoading(true)
        setError(null)
        setLeagues([])
        try {
            let leagues: League[] = []
            if (searchType === 'Username') {
                leagues = await sleeper_getLeagues(value, year)
            } else if (searchType === 'League ID') {
                setError('Search by League ID not implemented yet')
                setLoading(false)
                return
            }
            for (const league of leagues) {
                if (league.avatar) {
                    const blob = await sleeper_getAvatarThumbnail(league.avatar)
                    const url = URL.createObjectURL(blob)
                    league.avatar = url
                    blobUrls.push(url)
                }
            }
            /**TODO: STORE IN LOCAL STORAGE SO USER DOESN'T HAVE TO CALL API EVERY TIME */
            setLeagues(leagues)

        } catch (err) {
            setError('Error fetching leagues')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchLeagues()
        return () => {
            document.querySelectorAll<HTMLImageElement>('img[src^="blob:"]').forEach((img) => {
                img.src = ''
            })
            // console.log('Revoking:', blobUrls)
            blobUrls.forEach((url) => URL.revokeObjectURL(url))
        }
    }, [searchType, value, year])

    if (loading) return <CircularProgress />

    if (error) {
        back()
        return (
            <Snackbar open={error ? true : false}
                message={error}
            />
        )
    }


    return (
        <>
            <Box display='inline-flex' sx={{ maxHeight: "15px", m: 2 }} gap={1}>
                <Button variant="outlined" sx={{ maxHeight: "15px", py: 3.5 }} onClick={back}>Back</Button>
                <TextField
                    disabled
                    id="outlined-disabled"
                    label={searchType}
                    defaultValue={value}
                />
                <FormControl>

                    <SelectSeasonDropDown updateSeason={setYear} selectedYear={year} label_name={'Change Year'} width={150} />
                </FormControl>
            </Box>
            {leagues.length == 0 ? <Snackbar open={leagues.length == 0 ? true : false}
                message="No Leagues Found"
            />
                :
                <DisplayLeaguesList onLeagueClick={handleNavigateToLeague} displayAvatar={true} leagues={leagues} />
            }
        </>
    )
}

