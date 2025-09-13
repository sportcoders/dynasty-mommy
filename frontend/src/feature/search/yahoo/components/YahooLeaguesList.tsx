// -------------------- Imports --------------------

import {
    Box,
    Paper,
    Typography,
} from "@mui/material";

import type { League } from "@services/sleeper";

import { useNavigate } from "@tanstack/react-router";
import { type YahooLeague } from "@services/api/yahoo";
import ListTest from "./ListTest";
import useSaveLeague from "@feature/leagues/yahoo/hooks/useSaveLeague";
import useDeleteLeague from "@feature/leagues/yahoo/hooks/useDeleteLeague";
import useGetAllSavedYahooLeagues from "../hooks/useGetAllSavedYahooLeagues";

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
    const { mutate: saveLeague, isPending: isSavingLeague, isSuccess: saveLeagueSuccess } = useSaveLeague();
    const { mutate: removeLeague, isPending: isRemovingLeague, isSuccess: removeLeagueSuccess } = useDeleteLeague();
    const { data: savedLeagues, loading: loadingSavedLeagues } = useGetAllSavedYahooLeagues();
    const navigateToLeague = (league_key: string) => {
        navigate({ to: `/league/yahoo/${league_key}` });
    };
    const handleSaveLeague = async (league_id: string) => {
        try {
            saveLeague({ league_key: league_id });
            return saveLeagueSuccess;
        } catch {
            return false;
        }
    };
    const handleRemoveLeague = async (league_id: string) => {
        try {
            removeLeague({ league_key: league_id });
            return removeLeagueSuccess;
        } catch {
            return false;
        }
    };
    // -------------------- Render --------------------
    return (
        <Paper
            elevation={3}
            sx={(theme) => ({
                borderRadius: 3,
                m: 2,
                p: 1.5,
                maxHeight: '60vh',
                maxWidth: 800,
                mx: "auto",
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
                height: "auto",
                scrollbarColor: `${theme.palette.primary.main} ${theme.palette.background.paper}`,
                '&::-webkit-scrollbar-track': {
                    backgroundColor: theme.palette.background.paper,
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: theme.palette.primary.main,
                },

            })}
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
                <Box>
                    <ListTest leagues={yahooLeagueResult} displayAvatar={true} loggedIn={true} onLeagueClick={navigateToLeague}
                        saveDelete={savedLeagues ? {
                            saveLeague: handleSaveLeague,
                            deleteLeague: handleRemoveLeague,
                            userLeagues: savedLeagues.map((league) => league.league_key)
                        } : undefined}
                    />
                </Box>
            )}
        </Paper>
    );
}
