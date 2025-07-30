import LeagueHome from '@pages/LeaguesHome';
import { createFileRoute } from '@tanstack/react-router';

interface LeagueHomeSearch {
    tab?: number;
    parent?: string;
}
export const Route = createFileRoute('/leagues/$leagueId')({
    component: LeagueHome,
    validateSearch: (search: Record<string, unknown>): LeagueHomeSearch => {
        // validate and parse the search params into a typed state
        return {
            tab: Number(search.tab ?? 0),
            parent: (search.parent as string) || '',
            //   sort: (search.sort as ProductSearchSortOptions) || 'newest',
        };
    },
})

