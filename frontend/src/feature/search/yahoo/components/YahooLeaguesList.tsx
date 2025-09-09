// -------------------- Imports --------------------
import type { SleeperSearchProps } from "@feature/search/sleeper/types";


import {
    Box,
    Paper,
    Typography,
} from "@mui/material";

import type { League } from "@services/sleeper";

import { useNavigate } from "@tanstack/react-router";
import { getTeamsInLeague, type YahooLeague } from "@services/api/yahoo";
import ListTest from "./ListTest";

/**
 * Displays a list of Sleeper leagues that match the current search criteria.
 *
 * @param props - {@link SleeperSearchProps}
 * @returns The rendered leagues list with options to save/delete.
 */
function mapYahooLeagueToLeague(yahooLeague: YahooLeague): League {
    return {
        league_id: yahooLeague.league_key,
        name: yahooLeague.name,
        season: String(yahooLeague.season),
        avatar: yahooLeague.logo_url,
    };
}
export default function YahooLeaguesList({ leagues }: { leagues: YahooLeague[]; }) {
    const yahooLeagueResult = leagues.map((league) => mapYahooLeagueToLeague(league));
    const navigate = useNavigate();

    const navigateToLeague = (league_key: string) => {
        const getTeams = async () => {
            const response = await getTeamsInLeague(league_key);
            console.log(response);
        };
        getTeams();
    };
    // -------------------- Render --------------------
    return (
        <Paper
            elevation={3}
            sx={{
                borderRadius: 3,
                m: 2,
                height: '50vh',
                maxWidth: 800,
                minWidth: 500,
                mx: "auto",
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                flexDirection: "column",
            }}
        >


            {/* Results Section */}
            {!leagues || leagues.length === 0 ? (
                <Box
                    sx={{
                        p: 4,
                        textAlign: "center",
                        backgroundColor: "background.default",
                        color: "text.primary",
                        flexGrow: 1,
                    }}
                >
                    <Typography variant="body1">No Leagues Found</Typography>
                </Box>
            ) : (
                <Box sx={(theme) => ({
                    p: 2,
                    overflowY: "auto",
                    height: "auto",
                    maxHeight: '100%',
                    scrollbarColor: `${theme.palette.primary.main} ${theme.palette.background.paper}`,
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: theme.palette.background.paper,
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme.palette.primary.main,
                    },
                })}>
                    <ListTest leagues={yahooLeagueResult} displayAvatar={true} loggedIn={false} onLeagueClick={navigateToLeague} />
                </Box>
            )}
        </Paper>
    );
}
