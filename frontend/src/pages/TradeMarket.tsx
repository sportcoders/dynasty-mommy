import SleeperTradeMarket from "@feature/trade_market/sleeper/TradeMarket";
import { Route as LeagueRoute } from '@routes/tradeMarket';
import { getRouteApi } from '@tanstack/react-router';

export default function TradeMarket() {
    const route = getRouteApi(LeagueRoute.id);
    const { searchText } = route.useSearch();
    return (
        <SleeperTradeMarket searchText={searchText} />
    );
}
