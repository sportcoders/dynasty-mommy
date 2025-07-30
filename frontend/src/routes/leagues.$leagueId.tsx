import type { league_tabs } from '@app/types/queryParams';
import LeagueHome from '@pages/LeaguesHome';
import { createFileRoute } from '@tanstack/react-router';

interface LeagueHomeSearch {
    tab?: league_tabs;
}
export const Route = createFileRoute('/leagues/$leagueId')({
    component: LeagueHome,
    validateSearch: (search: Record<string, unknown>): LeagueHomeSearch => {
        // validate and parse the search params into a typed state
        return {
            tab: (search.tab as league_tabs) || 'transactions',
            //   filter: (search.filter as string) || '',
            //   sort: (search.sort as ProductSearchSortOptions) || 'newest',
        };
    },
})

