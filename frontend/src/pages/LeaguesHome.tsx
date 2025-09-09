import SleeperLeague from "@feature/leagues/sleeper/components/SleeperLeague";
import { Route as LeagueRoute } from '@routes/leagues.$leagueId';
import { getRouteApi } from '@tanstack/react-router';

export default function LeagueHome() {
    const route = getRouteApi(LeagueRoute.id);
    const { leagueId } = route.useParams();
    const { tab, parent } = route.useSearch();
    return (
        <SleeperLeague league_id={leagueId} tab={tab || 0} parent={parent} />
    );
}
