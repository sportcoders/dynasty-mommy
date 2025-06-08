import { Accordion, AccordionDetails, AccordionSummary, Box, Button, CircularProgress, Icon, Stack, Typography } from "@mui/material";
import { Route as LeagueRoute } from '@routes/leagues.$leaugeId'
import { type TeamInfo, getTeamInfo } from "@services/sleeper";
import { getRouteApi } from '@tanstack/react-router'
import { useEffect, useState, type SyntheticEvent } from "react";

export default function LeagueHome() {
    const route = getRouteApi(LeagueRoute.id)
    const { leaugeId } = route.useParams()

    const [teams, setTeams] = useState<TeamInfo[] | null>(null)
    const [expanded, setExpanded] = useState<number | false>()

    const handleAccordionChange = (panel: number) => (event: SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false)
    }
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const res = await getTeamInfo(leaugeId)
                console.log(res)
                if (res)
                    setTeams(res)
            }
            catch (e) {
                console.log(e)
            }
        }
        fetchTeams()
    }, [])

    return (
        <Stack>
            <h1>
                League
            </h1>
            {teams ?
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
                                <Box display='flex' alignItems='center' justifyContent='center'>
                                    <Button>Compare</Button>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    )}
                </div>
                :
                <CircularProgress />}
        </Stack>
    )
}
