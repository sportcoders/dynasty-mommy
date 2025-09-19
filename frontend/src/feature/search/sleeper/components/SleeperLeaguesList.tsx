// -------------------- Imports --------------------
import { useDispatch } from "react-redux";

import { useAppSelector } from "@app/hooks";

import { DisplayLeaguesList, type UserSavedLeagueListDisplay } from "@components/DisplayLeaguesList";
import SelectSeasonDropDown from "@components/SelectSeasonDropDown";

import useSaveSleeperLeague from "@feature/leagues/sleeper/hooks/team/useSaveTeam";
import useDeleteLeague from "@feature/search/sleeper/hooks/useDeleteLeague";
import useGetUserLeaguesSleeper from "@feature/search/sleeper/hooks/useGetUserLeaguesSleeper";
import { setSubmit } from "@feature/search/sleeper/sleeperSearchSlice";
import type { SleeperSearchProps } from "@feature/search/sleeper/types";


import { useGetSavedLeagues } from "@hooks/useGetSavedLeagues";

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

import { Route as LeagueRoute } from "@routes/leagues.$leagueId";

import { sleeper_getUser, type League } from "@services/sleeper";

import { useRouter, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

/**
 * Displays a list of Sleeper leagues that match the current search criteria.
 *
 * @param props - {@link SleeperSearchProps}
 * @returns The rendered leagues list with options to save/delete.
 */
export default function SleeperLeaguesList({
    season,
    searchText,
    searchType,
    setSeason,
}: SleeperSearchProps) {
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const username = useAppSelector((state) => state.auth.username);

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

    // -------------------- Handlers --------------------
    const handleNavigateToLeague = (id: string) => {
        router.navigate({
            to: LeagueRoute.to,
            params: { leagueId: id },
        });
    };

    const saveLeague = async (league_id: string) => {
        try {
            saveTeamMutate.mutate({ league_id, user_id: user_id! });
            return saveTeamMutate.isSuccess;
        } catch {
            return false;
        }
    };

    const handleDeleteLeague = async (league_id: string) => {
        deleteLeague.mutate({ platform: "sleeper", league_id });
        return deleteLeague.isSuccess;
    };

    const handleBack = async () => {
        dispatch(setSubmit(false));

        navigate({
            to: '/',
            search: {
                searchText,
                searchType,
                season,
                submit: false,
            }
        });
    };

    if (loading) return <CircularProgress />;
    if (error) {
        navigate({
            to: '/',
        });
        return <Snackbar open={!!error} message={error} />;
    }

    // -------------------- Render --------------------
    return (
        <Paper
            elevation={3}
            sx={{
                borderRadius: 3,
                m: 2,
                height: 600,
                maxWidth: 800,
                mx: "auto",
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                flexDirection: "column"
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
                    height: "auto"
                }}
            >
                <Button
                    variant="outlined"
                    onClick={handleBack}
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
                <Box sx={(theme) => ({
                    p: 2,
                    overflowY: "auto",
                    height: "auto",
                    scrollbarColor: `${theme.palette.primary.main} ${theme.palette.background.paper}`,
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: theme.palette.background.paper,
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme.palette.primary.main,
                    },
                })}>
                    <DisplayLeaguesList
                        onLeagueClick={handleNavigateToLeague}
                        displayAvatar={true}
                        leagues={leagues.map((league) => sleeperLeagueToListDisplay(league))}
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

function sleeperLeagueToListDisplay(league: League): UserSavedLeagueListDisplay {
    return {
        league_id: league.league_id,
        name: league.name,
        avatar: league.avatar,
        platform: "sleeper"
    };
}