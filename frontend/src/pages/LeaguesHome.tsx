import DisplayTeamsInLeauge from "@components/DisplayTeamsInLeague";
import { Stack } from "@mui/material";
import { Route as LeagueRoute } from '@routes/leagues.$leaugeId'
import { getRouteApi } from '@tanstack/react-router'
import { useState } from "react";

export default function LeagueHome() {
    const route = getRouteApi(LeagueRoute.id)
    const { leaugeId } = route.useParams()
    const [activeRoster, setActiveRoster] = useState("")
    return (
        <Stack>
            <h1>
                League
            </h1>
            <DisplayTeamsInLeauge league_id={leaugeId} onTeamClick={(team_id: string) => console.log(team_id)} />
        </Stack>
    )
}