import { Box, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from "@mui/material"
import useGetLeagueInfo from "../hooks/useGetLeagueInfo"

export default function ViewLeagueInfo({ league_id }: { league_id: string }) {
    const leagueInfo = useGetLeagueInfo(league_id)

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