import YahooLeague from "@feature/leagues/yahoo/components/YahooLeague";
import { getRouteApi } from "@tanstack/react-router";

export default function YahooLeaguePage() {
    const route = getRouteApi('/league/yahoo/$league_key');
    const { league_key } = route.useParams();

    return <YahooLeague league_key={league_key} tab={0} />;
}