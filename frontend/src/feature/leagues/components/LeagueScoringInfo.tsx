import { Box, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from "@mui/material"
import { type LeagueInfo, getLeagueInfo } from "@services/sleeper"
import { useState, useEffect } from "react"

export function ViewLeagueInfo({ league_id }: { league_id: string }) {
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
    </>)
}