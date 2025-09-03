import SleeperSearch from "@feature/search/sleeper/components/SleeperSearch";
import { Route as SearchRoute } from '@routes/index';
import { getRouteApi } from "@tanstack/react-router";
export default function Home() {
    const route = getRouteApi(SearchRoute.id);
    const { searchText, searchType, season, submit } = route.useSearch();
    return (
        <SleeperSearch searchText={searchText} searchType={searchType} season={season} submit={submit} />
    );
}