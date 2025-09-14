// -------------------- Imports --------------------
import { DisplayLeaguesList } from '@components/DisplayLeaguesList';

import { useGetSavedLeaguesNavBar } from '@feature/navbar/hooks/useGetSavedLeaguesNavBar';

import {
    Box,
    CircularProgress,
    Collapse,
} from '@mui/material';

import { Route as LeagueRoute } from '@routes/leagues.$leagueId';

import { useRouter } from '@tanstack/react-router';

/**
 * A collapsible nested list component that displays the user's saved leagues.
 * Shows a loading spinner while fetching data and renders league items with navigation functionality.
 * 
 * @component
 * @param props - The component props
 * @param props.myLeaguesOpen - Controls whether the nested list is expanded or collapsed
 * @returns JSX element containing the collapsible leagues list, or null if no leagues/error
 */
export const MyLeaguesList = ({ myLeaguesOpen }: { myLeaguesOpen: boolean; }) => {
    const { leagues, loading, error } = useGetSavedLeaguesNavBar();
    const router = useRouter();

    if (!leagues || error) return null;

    // -------------------- Handlers --------------------
    const handleNavigateToLeague = (id: string) => {
        const sleeper_pattern = /^\d+$/;
        if (sleeper_pattern.test(id)) {
            router.navigate({
                to: LeagueRoute.to,
                params: { leagueId: id },
            });
        }
        else {
            router.navigate({
                to: `/league/yahoo/${id}`
            });
        }
    };

    return (
        <Collapse in={myLeaguesOpen} timeout="auto" unmountOnExit>
            <Box sx={{ ml: 5, }}>
                {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 50 }}>
                    <CircularProgress />
                </Box> :
                    <DisplayLeaguesList leagues={leagues}
                        onLeagueClick={handleNavigateToLeague}
                        displayAvatar={false}
                        loggedIn={true}
                        stylingOptions={{
                            background_color: 'transparent',
                            fontSize: '1rem',
                            fontWeight: '500',
                            padding: '0',
                            border_radius: '16px',
                            text_color: 'primary.main'
                        }}
                    />
                }
            </Box>
        </Collapse>
    );
};