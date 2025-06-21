import { Box, Button, CircularProgress, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Snackbar, Stack, TextField, Typography } from '@mui/material'
import { useRouter } from '@tanstack/react-router'
import { Route as LeagueRoute } from '@routes/leagues.$leaugeId'
import { DisplayLeaguesList } from '@components/DisplayLeaguesList'
import SelectSeasonDropDown from '@components/SelectSeasonDropDown'
import useSearchParamsSleeper from '@feature/search/hooks/useSearchParamsSleeper'
import useGetUserLeaguesSleeper from '@feature/search/hooks/useGetUserLeaguesSleeper'

type SleeperSearchComponentProps = {
    searchType: string
    season: string
    searchText: string
    validParams: boolean
    handleTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    setSeason: (s: string) => void
    handleSearchTypeChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    checkValidParams: () => void
    setParamsFalse: () => void
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
    const {
        searchType,
        season,
        searchText,
        validParams,
        handleTextChange,
        setSeason,
        handleSearchTypeChange,
        checkValidParams,
        setParamsFalse
    } = useSearchParamsSleeper();

    return (
        // <>

        <Stack sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100%' }} spacing={4}>
            <Typography
                variant='h4'
                component='label'
                sx={{
                    fontWeight: '600',
                    display: 'block',
                    letterSpacing: '0.05em'
                }}>
                Sleeper League Search
            </Typography>
            {validParams ?
                (
                    <SleeperLeagues
                        searchType={searchType}
                        season={season}
                        searchText={searchText}
                        validParams={validParams}
                        handleTextChange={handleTextChange}
                        setSeason={setSeason}
                        handleSearchTypeChange={handleSearchTypeChange}
                        checkValidParams={checkValidParams}
                        setParamsFalse={setParamsFalse} />
                ) :
                <SleeperAccount
                    searchType={searchType}
                    season={season}
                    searchText={searchText}
                    validParams={validParams}
                    handleTextChange={handleTextChange}
                    setSeason={setSeason}
                    handleSearchTypeChange={handleSearchTypeChange}
                    checkValidParams={checkValidParams}
                    setParamsFalse={setParamsFalse} />
            }

        </Stack>
        // </>
    )
}

/**
 * SleeperAccount is a component and form for searching leagues via username/league id and season year.
 * 
 * This component is a smaller part of the SleeperSearch feature.
 * 
 * @returns The rendered form for searching league(s) via username/league id and season year.
 */
function SleeperAccount({ searchType,
    season,
    searchText,
    handleTextChange,
    setSeason,
    handleSearchTypeChange,
    checkValidParams }: SleeperSearchComponentProps) {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        checkValidParams()
    }

    return (
        <Box sx={{ borderRadius: 2, bgcolor: '#D3D3D3', p: 3, m: 2, boxShadow: 1, borderColor: 'black', border: 1, display: 'flex', minWidth: 1 / 4, maxHeight: 3 / 4, maxWidth: 3 / 4, alignItems: 'center', justifyItems: 'center' }}>
            <FormControl fullWidth sx={{ alignItems: 'center' }}>
                <FormLabel >Find Leauge By</FormLabel>
                <RadioGroup
                    row
                    value={searchType}
                    onChange={handleSearchTypeChange}
                >
                    <FormControlLabel value='Username' control={<Radio />} label="Username" />
                    <FormControlLabel value='Leauge ID' control={<Radio />} label="League ID" />
                </RadioGroup>
                <Box sx={{ m: 2, width: '100%' }} display='flex' gap={1}>
                    <TextField label={searchType} required variant='outlined' onChange={handleTextChange} value={searchText} sx={{ flex: 3 }} ></TextField>
                    <Box sx={{ flex: 1 }}>
                        <SelectSeasonDropDown updateSeason={setSeason} selectedYear={season} />
                    </Box>
                </Box>
                <Button onClick={handleSubmit} variant="contained" sx={{ m: 1, width: '100%' }}>Submit</Button>
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
function SleeperLeagues({ searchType,
    season,
    searchText,
    setSeason,
    setParamsFalse: back }: SleeperSearchComponentProps) {
    const { leagues, loading, error } = useGetUserLeaguesSleeper(searchType, searchText, season)
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
                    defaultValue={searchText}
                />
                <FormControl>

                    <SelectSeasonDropDown updateSeason={setSeason} selectedYear={season} label_name={'Change Year'} width={150} />
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

