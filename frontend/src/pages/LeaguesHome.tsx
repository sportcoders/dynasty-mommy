import DisplayTeamsInLeauge from "@components/DisplayTeamsInLeague";

import { getRouteApi } from '@tanstack/react-router'

const route = getRouteApi('/LeaguesHome/$leaugeId')
export default function LeagueHome() {
    const id = route.useParams()
    console.log(id)
    return (
        <DisplayTeamsInLeauge league_id={'1206147191521935360'} onTeamClick={(team_id: string) => console.log(team_id)} />
    )
}