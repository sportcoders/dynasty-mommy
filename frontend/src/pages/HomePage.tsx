// -------------------- Imports --------------------
import SleeperSearch from "@feature/search/sleeper/components/SleeperSearch";
import YahooLeagueSearch from "@feature/search/yahoo/components/YahooLeagueSearch";
import { Route } from "@routes/index";
import { getRouteApi } from "@tanstack/react-router";

export default function Home() {
    const route = getRouteApi(Route.id);
    const { platform } = route.useSearch();

    switch (platform) {
        case "sleeper": return <SleeperSearch />;
        case "yahoo": return <YahooLeagueSearch />;
        default: return <SleeperSearch />;
    }

}