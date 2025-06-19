import { useState } from 'react'
import { Box, Button, CircularProgress, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Snackbar, Stack, TextField } from '@mui/material'
import { useRouter } from '@tanstack/react-router'
import { Route as LeagueRoute } from '@routes/leagues.$leaugeId'
import { DisplayLeaguesList } from '@components/DisplayLeaguesList'
import SelectSeasonDropDown from '@components/SelectSeasonDropDown'
import useSearchParamsSleeper from '@feature/search/hooks/useSearchParamsSleeper'
import useGetUserLeaguesSleeper from '@feature/search/hooks/useGetUserLeaguesSleeper'

/** React Typed Props for SleeperAccount function */
type SleeperAccountProps = {
    onSearch: (searchType: string, value: string, season: string) => void
}

/** React Typed Props for SleeperLeagues function */
type SleeperLeaguesProps = {
    searchType: string
    value: string
    season: string
    back: () => void
}

/**
 * SleeperSearch is a component for the Sleeper League Search feature.
 * 
 * It manages the search state for leagues, allowing users to search by a specified type,
 * value, and season. When search parameters are set, it displays the SleeperLeagues component
 * with the current search criteria. Otherwise, it renders the SleeperAccount component to allow
 * the user to initiate a new search.
 * 
 * This component is intended to be used as part of a larger feature, not as a standalone page.
 * 
 * @returns The rendered search interface for Sleeper leagues.
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
 * SleeperAccount is a component and form for searching leagues via username/league id and season year.
 * 
 * This component is a smaller part of the SleeperSearch feature.
 * 
 * @returns The rendered form for searching league(s) via username/league id and season year.
 */
function SleeperAccount({ onSearch }: SleeperAccountProps) {

    const {
        searchType, 
        season, 
        searchText,
        validParams,
        handleTextChange,
        setSeason,
        handleSearchTypeChange
    } = useSearchParamsSleeper();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validParams) {
            onSearch(searchType, searchText.trim(), season)
        }
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
                    <TextField label={searchType} required variant='outlined' onChange={handleTextChange}></TextField>
                    <SelectSeasonDropDown updateSeason={setSeason} selectedYear={season} />
                </Box>
                <Button onClick={handleSubmit} variant="contained" sx={{ m: 1 }}>Submit</Button>
            </FormControl>
        </Box>
    )
}

/**
 * SleeperLeagues is a component that displays the resulting leagues based on the form parameters.
 * 
 * This component is a smaller part of the SleeperSearch feature.
 * 
 * @returns The rendered leagues list.
 */
function SleeperLeagues({ searchType, value, season, back }: SleeperLeaguesProps) {
    const [year, setYear] = useState<string>(season)
    const { leagues, loading, error } = useGetUserLeaguesSleeper(searchType, value, year)
    const router = useRouter()
    
    const handleNavigateToLeague = (id: string) => {
        router.navigate({
            to: LeagueRoute.to,
            params: { leaugeId: id }
        })
    }

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

