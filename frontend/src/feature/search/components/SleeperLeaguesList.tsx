import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    Paper,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";

import type { SleeperSearchComponentProps } from "./SleeperSearch";
import { useRouter } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Route as LeagueRoute } from "@routes/leagues.$leagueId";
import { DisplayLeaguesList } from "@components/DisplayLeaguesList";
import SelectSeasonDropDown from "@components/SelectSeasonDropDown";

import useGetUserLeaguesSleeper from "@feature/search/hooks/useGetUserLeaguesSleeper";
import useSaveSleeperLeague from "@feature/leagues/hooks/useSaveTeam";

import { useGetSavedLeagues } from "@hooks/useGetSavedLeagues";
import { useAppSelector } from "@app/hooks";

import useDeleteLeague from "../hooks/useDeleteLeague";
import { sleeper_getUser } from "@services/sleeper";
/**
 * Displays a list of Sleeper leagues that match the current search criteria.
 *
 * @param props - {@link SleeperSearchComponentProps}
 * @returns The rendered leagues list with options to save/delete.
 */
export default function SleeperLeaguesList({
    searchType,
    season,
    searchText,
    setSeason,
    setParamsFalse: back,
}: SleeperSearchComponentProps) {
    const username = useAppSelector((state) => state.authReducer.username);

    const { leagues, loading, error } = useGetUserLeaguesSleeper(searchText, season);
    const { data: user_id } = useSuspenseQuery({
        queryKey: ["sleeper_user", searchText],
        queryFn: () => sleeper_getUser(searchText),
        select: (data) => data?.user_id,
    });
    const { data: userLeagues } = useGetSavedLeagues();

    const deleteLeague = useDeleteLeague();
    const saveTeamMutate = useSaveSleeperLeague();

    const sleeperLeagues = userLeagues?.reduce<string[]>((result, league) => {
        if (league.platform === "sleeper") result.push(league.league_id);
        return result;
    }, []);

    const router = useRouter();

    /**
     * Navigates the user to a given league details page.
     *
     * @param id - The league ID to navigate to.
     */
    const handleNavigateToLeague = (id: string) => {
        router.navigate({
            to: LeagueRoute.to,
            params: { leagueId: id },
        });
    };

    /**
     * Saves a league for the logged-in user.
     *
     * @param league_id - The league ID to save.
     * @returns Whether the save was successful.
     */
    const saveLeague = async (league_id: string) => {
        try {
            saveTeamMutate.mutate({ league_id, user_id: user_id! });
            return saveTeamMutate.isSuccess;
        } catch {
            return false;
        }
    };

    /**
     * Deletes a league from the logged-in user's saved list.
     *
     * @param league_id - The league ID to delete.
     * @returns Whether the delete was successful.
     */
    const handleDeleteLeague = async (league_id: string) => {
        deleteLeague.mutate({ platform: "sleeper", league_id });
        return deleteLeague.isSuccess;
    };

    if (loading) return <CircularProgress />;
    if (error) {
        back();
        return <Snackbar open={!!error} message={error} />;
    }

    return (
        <Paper
            elevation={3}
            sx={{
                borderRadius: 3,
                m: 2,
                maxWidth: 800,
                mx: "auto",
                border: "1px solid",
                borderColor: "divider",
            }}
        >
            {/* Search/Filter Section */}
            <Box
                display="flex"
                alignItems="center"
                sx={{
                    p: 3,
                    gap: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Button
                    variant="outlined"
                    onClick={back}
                    color="primary"
                    sx={{
                        height: "56px",
                        borderRadius: 2,
                        textTransform: "none",
                        px: 3,
                        borderColor: "primary.main",
                        transition: "all 0.3s ease",
                        "&:hover": {
                            borderColor: "primary.dark",
                            backgroundColor: "primary.main",
                            color: "primary.contrastText",
                            transform: "translateY(-1px)",
                            boxShadow: "0 2px 8px primary.light",
                        },
                    }}
                >
                    <Typography variant="body1">Back</Typography>
                </Button>

                <Box display="flex" gap={2} sx={{ flex: 1 }}>
                    <TextField disabled label={searchType} value={searchText} />
                    <FormControl sx={{ flex: 1, minWidth: 150 }}>
                        <SelectSeasonDropDown
                            updateSeason={setSeason}
                            selectedYear={season}
                            label_name="Change Year"
                            width={150}
                        />
                    </FormControl>
                </Box>
            </Box>

            {/* Results Section */}
            {!leagues || leagues.length === 0 ? (
                <Box
                    sx={{
                        p: 4,
                        textAlign: "center",
                        backgroundColor: "background.default",
                        color: "text.primary",
                    }}
                >
                    <Typography variant="body1">No Leagues Found</Typography>
                </Box>
            ) : (
                <Box sx={{ p: 2 }}>
                    <DisplayLeaguesList
                        onLeagueClick={handleNavigateToLeague}
                        displayAvatar={true}
                        leagues={leagues}
                        loggedIn={!!username}
                        saveDelete={{
                            saveLeague,
                            userLeagues: sleeperLeagues || [],
                            deleteLeague: handleDeleteLeague,
                        }}
                    />
                </Box>
            )}
        </Paper>
    );
}
