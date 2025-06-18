import { Accordion, AccordionDetails, AccordionSummary, Box, CircularProgress, Icon, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material";
import { useEffect, useState, type SyntheticEvent } from "react";
import { getTeamInfo, sleeper_getPlayers } from "@services/sleeper";
import type { TeamInfo, Player } from "@services/sleeper";
import useGetLeagueTeamsSleeper from "@feature/leagues/hooks/useGetLeagueTeamsSleeper";
import useGetPlayersSleeper from "@feature/leagues/hooks/useGetPlayersSleeper";
interface DisplayTeamsInLeaugeProps {
    league_id: string,
    // onTeamClick: (team_id: string) => void,
    // displayAvatar?: boolean,
    // displayRecord?: boolean
}

export default function DisplayTeamsInLeauge({ league_id }: DisplayTeamsInLeaugeProps) {
    const { teams, error: team_error, loading: team_loading } = useGetLeagueTeamsSleeper(league_id)
    // const [teams, setTeams] = useState<TeamInfo[] | null>(null)
    const { players, error: player_error, loading: player_loading } = useGetPlayersSleeper(league_id)
    // const [players, setPlayers] = useState<Record<string, Player[]> | null>(null)
    // const [error, setError] = useState("")
    const [expanded, setExpanded] = useState<number | false>()

    const handleAccordionChange = (panel: number) => (event: SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false)
    }
    // useEffect(() => {
    //     const fetchTeams = async () => {
    //         try {
    //             const res = await getTeamInfo(league_id)
    //             console.log(res)
    //             if (res)
    //                 setTeams(res)
    //             setError("")
    //         }
    //         catch (e) {
    //             setError("An error occured")
    //         }
    //     }

    //     const fetchPlayers = async () => {
    //         try {
    //             const res = await sleeper_getPlayers(league_id)
    //             console.log(res)
    //             if (res)
    //                 setPlayers(res)


    //         } catch (e) {
    //             setError("An error occured")
    //         }
    //     }

    //     fetchTeams()
    //     fetchPlayers()

    // }, [league_id])
    // if (team_loading || player_loading) return <CircularProgress />
    if (!teams) return <CircularProgress />
    if (!players) return <CircularProgress />

    return (
        <div>

            {teams!.map((team) =>
                <Accordion expanded={expanded == team.roster_id}
                    onChange={handleAccordionChange(team.roster_id)}
                    square={false}
                    sx={{
                        borderRadius: '5px',
                        minHeight: '60px'
                    }}>
                    <AccordionSummary sx={{ minHeight: '30px' }}>
                        <Icon></Icon>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {team.team_name ? team.team_name : team.display_name}
                            </Typography>

                            <Typography variant="body2" color="textSecondary">
                                ({team.record.wins} - {team.record.ties} - {team.record.losses})
                            </Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List>
                            {players![team.user_id!].map(player => (
                                <ListItem>
                                    <ListItemText primary={`${player.first_name} ${player.last_name}`} />
                                </ListItem>
                            ))}
                        </List>
                    </AccordionDetails>
                </Accordion>
            )}
        </div>
        // <List>
        //     {teams!.map((team) =>
        //     (
        //         <ListItem>
        //             <ListItemButton sx={{ borderRadius: 5 }} onClick={() => onTeamClick(String(team.roster_id))} key={team.user_id}>
        //                 <ListItemAvatar>
        //                     {/* {displayAvatar && <Avatar src={team.avatar && team.avatar}></Avatar>} */}
        //                 </ListItemAvatar>
        //                 <ListItemText
        //                     primary={team.display_name}
        //                     secondary={true ? `${team.record.wins} - ${team.record.ties} - ${team.record.losses}` : undefined}
        //                 ></ListItemText>
        //             </ListItemButton>
        //         </ListItem>
        //     )
        //     )
        //     }
        // </List>

    )
}