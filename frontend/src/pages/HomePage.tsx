// import '../App.css'
// import '../styles/main.scss'
import { getAvatarThumbnail, getLeaguesForUser, getUser, getPlayer, getLeagueInfo, getPlayersForRosters } from '../services/sleeper'
import { useEffect, useState } from 'react'
import type { League, Players, Player, LeagueInfo } from '@services/sleeper/types'
import { TextField, Select, RadioGroup, Box, FormControl, InputLabel, FormLabel, FormControlLabel, Radio, MenuItem, type SelectChangeEvent, Button, CircularProgress, Stack, List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemButton, ListItemIcon, Snackbar, type SnackbarCloseReason, IconButton, TableHead, Table, TableRow, TableCell, TableBody } from '@mui/material'
import { DisplayLeaguesList } from '../components/DisplayLeaguesList'
import DisplayTeamsInLeauge from '@components/DisplayTeamsInLeague'
import { Navigate, useNavigate, useRouter } from '@tanstack/react-router'
import { Route as LeagueRoute } from '@routes/leagues.$leaugeId'
type SleeperAccountProps = {
    onSearch: (searchType: string, value: string, season: string) => void
    //function tha takes in those parameters and returns void
}
type SleeperLeaguesProps = {
    searchType: string
    value: string
    season: string
    back: () => void
}

type SelectSeasonProps = {
    updateSeason: (season: string) => void
    selectedYear?: string
    label_name?: string
    width?: number
}
function SelectSeasonForm({ updateSeason, selectedYear, label_name, width }: SelectSeasonProps) {
    const currentDate: Date = new Date()
    const currentYear = currentDate.getFullYear()
    const validYears = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => i + 2000).reverse();

    const [season, setSeason] = useState<string>('')

    const handleSeasonChange = (event: SelectChangeEvent) => {
        setSeason((event.target.value))
        //update season for component that called it
        updateSeason(event.target.value)
    }
    useEffect(() => {
        setSeason(selectedYear ? selectedYear : String(currentYear))
        updateSeason(selectedYear ? selectedYear : String(currentYear))
    }, [selectedYear])
    return (
        <FormControl>
            <InputLabel id='select-season-input-label'>{label_name ? label_name : "Year"}</InputLabel>
            <Select
                labelId='select-season-input-label'
                value={season}
                label={label_name ? label_name : "Year"}
                onChange={handleSeasonChange}
                sx={
                    { ...(width && { minWidth: width }) }
                }
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
    )

}



function ViewLeagueInfo({ league_id }: { league_id: string }) {
    const [leagueInfo, setLeagueInfo] = useState<LeagueInfo | null>(null)

    useEffect(() => {
        const loadLeagueInfo = async () => {
            try {
                const response = await getLeagueInfo(league_id)

                setLeagueInfo(response)
            }
            catch (error) {
                console.log(error)
            }
        }
        loadLeagueInfo()
    }, [])

    return (<>
        {leagueInfo ?
            <Box>
                <h1>{leagueInfo.name}</h1>
                <h3>{leagueInfo.status}</h3>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Stat</TableCell>
                            <TableCell>Points Per</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(leagueInfo.scoring_settings).map(([string, value]) => (
                            <TableRow>
                                <TableCell>{string}</TableCell>
                                <TableCell>{value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </Box>
            :
            <CircularProgress />}
        {/* <DisplayTeamsInLeauge league_id={'1215921738601218048'} onTeamClick={(team_id: string) => console.log(team_id)} /> */}
    </>)
}
export default function Home() {
    const [searchParams, setSearchParams] = useState<{ searchType: string; value: string; season: string } | null>(null)
    //search params is either a dict that has those types or null
    const handleSearch = (searchType: string, value: string, season: string) => {
        setSearchParams({ searchType, value, season })
        //setting values to later be used in call
    }

    const [players, setPlayers] = useState<Player[] | null>(null)

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const players = await getPlayersForRosters('1206147191521935360')
                setPlayers(players)
            } catch (error) {
                console.error('Error fetching player:', error)
            }
        }

        fetchPlayers();
    }, []);

    useEffect(() => {
        console.log(players)
    }, [players])

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

            <ViewLeagueInfo league_id="1215921738601218048" />
        </Stack>
    )
}

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
                    <SelectSeasonForm updateSeason={setSeason} />
                </Box>
                <Button onClick={handleSubmit} variant="contained" sx={{ m: 1 }}>Submit</Button>
            </FormControl>
        </Box>
    )
}

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
                leagues = await getLeaguesForUser(value, year)
            } else if (searchType === 'League ID') {
                setError('Search by League ID not implemented yet')
                setLoading(false)
                return
            }
            for (const league of leagues) {
                if (league.avatar) {
                    const blob = await getAvatarThumbnail(league.avatar)
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

                    <SelectSeasonForm updateSeason={setYear} selectedYear={year} label_name={'Change Year'} width={150} />
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

