import DisplayTeamsInLeauge from "@components/DisplayTeamsInLeague";
import { Route as LeagueRoute } from '@routes/leagues.$leaugeId'
import { getRouteApi } from '@tanstack/react-router'

const route = getRouteApi(LeagueRoute.id)
export default function LeagueHome() {
    const { leaugeId } = route.useParams()
    console.log(leaugeId)
    return (
        <DisplayTeamsInLeauge league_id={leaugeId} onTeamClick={(team_id: string) => console.log(team_id)} />
    )
}