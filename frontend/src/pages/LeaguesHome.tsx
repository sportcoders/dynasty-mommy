import DisplayTeamsInLeauge from "@components/DisplayTeamsInLeague";
import { Route as LeagueRoute } from '@routes/leagues.$leaugeId'
import { getRouteApi } from '@tanstack/react-router'

export default function LeagueHome() {
    const route = getRouteApi(LeagueRoute.id)
    const { leaugeId } = route.useParams()

    return (
        <DisplayTeamsInLeauge league_id={leaugeId} />
    )
}
