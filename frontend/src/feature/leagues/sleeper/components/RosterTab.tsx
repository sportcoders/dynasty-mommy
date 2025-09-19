// -------------------- Imports -------------------
import { useState, useCallback } from "react";

import DisplayRosterByPosition from "@components/DisplayRosterByPosition";

import useGetLeagueTeamsSleeper from "@feature/leagues/sleeper/hooks/team/useGetLeagueTeamsSleeper";
import useSleeperPlayers from "@feature/leagues/sleeper/hooks/players/useSleeperPlayers";
import useGetSavedTeam from "@feature/leagues/sleeper/hooks/team/useGetSavedTeam";
import useSaveSleeperLeague from "@feature/leagues/sleeper/hooks/team/useSaveTeam";

import { useAppSelector } from "@app/hooks";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Box,
    Chip,
    CircularProgress,
    Typography,
    useTheme,
} from "@mui/material";
import { DisplayAvatar } from "@components/DisplayAvatar";

// -------------------- Interfaces --------------------
interface RosterTabProps {
    league_id: string,
}

// -------------------- Main Component --------------------
/**
 * A component to display the rosters for a Sleeper league.
 *
 * Fetches and displays all teams in a league with their respective rosters.
 * Allows a user to set a specific team as "My Team" if they are logged in.
 * Handles various loading and error states for teams and player data.
 *
 * @param league_id The unique identifier for the Sleeper league.
 * @returns A list of expandable accordions, each representing a team with its roster.
 */
export default function RosterTab({ league_id }: RosterTabProps) {
    const theme = useTheme();
    const username = useAppSelector((state) => state.auth.username);

    const [showAddTeam, setShowAddTeam] = useState<number>(0);

    const {
        teams,
        error: teamError,
        loading: teamLoading,
    } = useGetLeagueTeamsSleeper(league_id);

    const {
        data: roster,
        error: rosterError,
        isLoading: rosterLoading,
    } = useSleeperPlayers(league_id);

    const { savedTeam } = useGetSavedTeam(league_id, !username);
    const { mutate: saveSleeperLeague } = useSaveSleeperLeague();

    // -------------------- Handler --------------------
    const handleSetMyTeam = useCallback((event: React.MouseEvent, user_id: string) => {
        event.stopPropagation();
        saveSleeperLeague({ user_id, league_id });
    }, [saveSleeperLeague, league_id]);

    // Error state for teams
    if (teamError) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Typography variant="h6" color="text.primary" textAlign="center">
                    Oops! Failed to load team information.
                    <br />
                    {teamError || "Please try again later."}
                </Typography>
            </Box>
        );
    }

    // Loading state for teams
    if (teamLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    // No teams found state
    if (!teams) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Typography variant="h6" color="text.primary" textAlign="center">
                    No teams found for this league.
                </Typography>
            </Box>
        );
    }

    return (
        <>
            {teams.map((team) => (
                <Accordion
                    key={team.roster_id}
                    disableGutters
                    sx={{
                        borderRadius: `${theme.shape.borderRadius}px`,
                        overflow: "hidden",
                        border: `1px solid ${theme.palette.divider}`,
                        backgroundColor: theme.palette.background.paper,
                        mb: 2,
                        boxShadow: theme.shadows[1],
                    }}
                    onMouseEnter={() => setShowAddTeam(team.roster_id)}
                    onMouseLeave={() => setShowAddTeam(0)}
                >
                    {/* Team Header */}
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                            minHeight: "64px",
                            px: { xs: 2, sm: 3 },
                            "& .MuiAccordionSummary-content": {
                                alignItems: "center",
                                gap: 2,
                                my: 1,
                            },
                        }}
                    >
                        <DisplayAvatar
                            avatar_url={team.avatar ?? undefined}
                            platform="sleeper"
                            size={40}
                        />

                        <Box
                            display="flex"
                            flexDirection={{ xs: "column", sm: "row" }}
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            gap={{ xs: 0.5, sm: 1 }}
                        >
                            <Typography
                                variant="body1"
                                component="span"
                                sx={{
                                    fontWeight: 500,
                                    color: theme.palette.text.primary
                                }}
                            >
                                {team.team_name || team.display_name}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                ({team.record.wins} - {team.record.ties} - {team.record.losses})
                            </Typography>

                            {/* Team Action Chips */}
                            {savedTeam && team.user_id && (
                                savedTeam.saved_user === team.user_id ? (
                                    <Chip label="My Team" />
                                ) : (
                                    showAddTeam === team.roster_id && (
                                        <Chip
                                            label="Set As My Team"
                                            onClick={(e) => handleSetMyTeam(e, team.user_id!)}
                                        />
                                    )
                                )
                            )}
                        </Box>
                    </AccordionSummary>

                    {/* Team Roster Details */}
                    <AccordionDetails
                        sx={{
                            backgroundColor: theme.palette.background.default,
                            borderTop: `1px dashed ${theme.palette.divider}`,
                            p: { xs: 2, sm: 3 },
                        }}
                    >
                        {/* Roster Error */}
                        {rosterError && (
                            <Typography color="text.primary" sx={{ textAlign: "center", py: 2 }}>
                                Unable to load players for this team. Please refresh and try again.
                            </Typography>
                        )}

                        {/* Roster Loading */}
                        {!rosterError && rosterLoading && (
                            <Box display="flex" justifyContent="center" py={3}>
                                <CircularProgress size={32} />
                            </Box>
                        )}

                        {/* No Roster Data */}
                        {!rosterError && !rosterLoading && !roster && (
                            <Typography variant="h6" color="text.primary" textAlign="center">
                                Oops! Failed to load roster.
                            </Typography>
                        )}

                        {/* Roster Display */}
                        {!rosterError && !rosterLoading && roster && roster[team.roster_id] && (
                            <>
                                <Box
                                    display="grid"
                                    gridTemplateColumns={{
                                        xs: "repeat(auto-fill, minmax(100px, 1fr))",
                                        sm: "repeat(3, 1fr)",
                                        md: "repeat(5, 1fr)",
                                    }}
                                    gap={2}
                                >
                                    {["PG", "SG", "SF", "PF", "C"].map((position) => (
                                        <DisplayRosterByPosition
                                            key={position}
                                            roster={roster[team.roster_id]}
                                            position={position}
                                        />
                                    ))}
                                </Box>
                                {roster[team.roster_id].length === 0 && (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ textAlign: "center", py: 2, gridColumn: "1 / -1" }}
                                    >
                                        No players on this roster.
                                    </Typography>
                                )}
                            </>
                        )}
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    );
}