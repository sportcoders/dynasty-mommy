import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
  useTheme,
  type SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Components
import DisplayRosterByPosition from "@components/DisplayRosterByPosition";
import BackButton from "@components/BackButton";
import SleeperTransactionsTab from "@feature/leagues/components/SleeperTransactionsTab";

// Hooks
import { useNotification } from "@hooks/useNotification";
import { useAppSelector } from "@app/hooks";
import useGetLeagueTeamsSleeper from "@feature/leagues/hooks/useGetLeagueTeamsSleeper";
import useGetLeagueInfo from "@feature/leagues/hooks/useGetLeagueInfo";
import useGetPreviousSeasons from "../hooks/useGetPreviousSeasons";
import useGetSavedTeam from "../hooks/useGetSavedTeam";
import useSaveSleeperLeague from "../hooks/useSaveTeam";
import useSleeperPlayers from "../hooks/useSleeperPlayers";
import useIsUserLeague from "@feature/leagues/hooks/useIsUserLeague";
import useSaveLeague from "@feature/leagues/hooks/useSaveLeague";
import useDeleteLeague from "@feature/search/sleeper/hooks/useDeleteLeague";

// Types
import type { League } from "@services/api/user";

// Component Interfaces
interface SleeperLeaguesHomePageProps {
  league_id: string;
  tab: number;
  parent?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  id: number;
  value: number;
}

interface PreviousSeasonsDropDownProps {
  league_id: string;
  current_tab: number;
  parent?: string;
}

// Utility Components
const CustomTabPanel = ({ children, value, id, ...other }: TabPanelProps) => (
  <div
    role="tabpanel"
    hidden={value !== id}
    id={`simple-tabpanel-${id}`}
    aria-labelledby={`simple-tab-${id}`}
    {...other}
  >
    {value === id && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const PreviousSeasonsDropDown = ({ league_id, current_tab, parent }: PreviousSeasonsDropDownProps) => {
  const { prevSeasons } = useGetPreviousSeasons(parent || league_id);
  const navigate = useNavigate();

  if (!prevSeasons || prevSeasons.length === 0) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography>Previous Seasons</Typography>
      <Select
        value={league_id}
        onChange={(event: SelectChangeEvent) => {
          navigate({
            to: `/leagues/${event.target.value}`,
            search: { tab: current_tab, parent: prevSeasons[0].league_id }
          });
        }}
      >
        {prevSeasons.map((season) => (
          <MenuItem key={season.season} value={season.league_id}>
            {season.season}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

// Main Component
export default function SleeperLeague({
  league_id,
  tab,
  parent
}: SleeperLeaguesHomePageProps) {
  const theme = useTheme();

  const username = useAppSelector((state) => state.auth.username);
  const navigate = useNavigate({ from: `/leagues/$leagueId` });

  // State
  const [showAddTeam, setShowAddTeam] = useState<number>(0);

  // Data fetching hooks
  const {
    leagueInfo,
    loading: leagueLoading,
    error: leagueError
  } = useGetLeagueInfo(league_id);

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

  // User-specific data (only fetch if logged in)
  const league = { league_id, platform: "sleeper" as const };
  const { data: isUserLeague } = useIsUserLeague(league, !username);
  const { savedTeam } = useGetSavedTeam(league_id, !username);

  // Mutation hooks
  const { mutate: saveLeague, isPending: isSavingLeague } = useSaveLeague();
  const { mutate: removeLeague, isPending: isRemovingLeague } = useDeleteLeague();
  const { mutate: saveSleeperLeague } = useSaveSleeperLeague();

  // Event handlers
  const handleSaveLeague = useCallback(() => {
    const league: League = {
      platform: "sleeper",
      league_id: league_id,
    };
    saveLeague(league);
  }, [league_id, saveLeague]);

  const handleRemoveLeague = useCallback(() => {
    const league: League = {
      platform: "sleeper",
      league_id: league_id,
    };
    removeLeague(league);
  }, [league_id, removeLeague]);


  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        tab: newValue,
      }),
      replace: true
    });
  };

  const handleSetMyTeam = useCallback((event: React.MouseEvent, user_id: string) => {
    event.stopPropagation();
    saveSleeperLeague({ user_id, league_id });
  }, [saveSleeperLeague, league_id]);

  // Accessibility helper
  const a11yProps = useCallback((index: number) => ({
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }), []);


  // Loading state
  if (leagueLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (leagueError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography variant="h6" color="text.primary" textAlign="center">
          Oops! Failed to load league information.
          <br />
          {leagueError || "Please try again later."}
        </Typography>
      </Box>
    );
  }

  // No league data
  if (!leagueInfo) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography variant="h6" color="text.primary" textAlign="center">
          League not found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          height: "100vh",
          overflowY: "scroll",
          scrollbarGutter: "stable",
        }}
      >
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
          {/* Left side - League info */}
          <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
            <BackButton url="/" />
            <Avatar
              src={leagueInfo.avatar}
              alt={`${leagueInfo.name} avatar`}
              sx={{
                width: 60,
                height: 60,
                boxShadow: theme.shadows[3],
              }}
            />
            <Typography variant="h3" component="h1" color="text.primary">
              {leagueInfo.name}
            </Typography>
          </Box>

          {/* Right side - Action buttons */}
          {username && (
            <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
              {!isUserLeague ? (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSaveLeague}
                  disabled={isSavingLeague}
                >
                  Add
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleRemoveLeague}
                  disabled={isRemovingLeague}
                >
                  Remove
                </Button>
              )}
            </Box>
          )}
        </Box>

        {/* Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Tabs value={tab} onChange={handleTabChange} aria-label="league tabs">
              <Tab label="Rosters" {...a11yProps(0)} />
              <Tab label="Transactions" {...a11yProps(1)} />
              <Tab label="Item Three" {...a11yProps(2)} />
            </Tabs>
            <PreviousSeasonsDropDown league_id={league_id} current_tab={tab} parent={parent} />
          </Box>
        </Box>

        {/* Rosters Tab */}
        <CustomTabPanel value={tab} id={0}>
          {/* Team Error State */}
          {teamError && (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
              <Typography variant="h6" color="text.primary" textAlign="center">
                Oops! Failed to load team information.
                <br />
                {teamError || "Please try again later."}
              </Typography>
            </Box>
          )}

          {/* Team Loading State */}
          {!teamError && teamLoading && (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
              <CircularProgress />
            </Box>
          )}

          {/* No Teams State */}
          {!teamError && !teamLoading && !teams && (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
              <Typography variant="h6" color="text.primary" textAlign="center">
                No teams found for this league.
              </Typography>
            </Box>
          )}

          {/* Teams List */}
          {!teamError && !teamLoading && teams && (
            teams.map((team) => (
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
                  <Avatar
                    src={team.avatar || undefined}
                    alt={`${team.display_name} avatar`}
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
            ))
          )}
        </CustomTabPanel>

        {/* Transactions Tab */}
        <CustomTabPanel value={tab} id={1}>
          {teams ? (
            <SleeperTransactionsTab
              teams={teams}
              league_id={league_id}
              last_scored_leg={leagueInfo.settings.last_scored_leg}
            />
          ) : (
            <Typography variant="h6" color="text.primary" textAlign="center">
              Oops! Failed to load transactions.
            </Typography>
          )}
        </CustomTabPanel>

        {/* Third Tab */}
        <CustomTabPanel value={tab} id={2}>
          <Typography variant="h6" color="text.primary" textAlign="center">
            Content for third tab coming soon...
          </Typography>
        </CustomTabPanel>
      </Box>
    </Box>
  );
}