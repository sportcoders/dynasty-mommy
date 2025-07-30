import SleeperLeaguesHomePage from "@feature/leagues/components/SleeperLeaguesHomePage";
import { Route as LeagueRoute } from '@routes/leagues.$leagueId';
import { getRouteApi } from '@tanstack/react-router';

export default function LeagueHome() {
    const route = getRouteApi(LeagueRoute.id);
    const { leagueId } = route.useParams();
    const { tab } = route.useSearch();
    return (
        <SleeperLeaguesHomePage league_id={leagueId} tab={tab!} />
    );
}
