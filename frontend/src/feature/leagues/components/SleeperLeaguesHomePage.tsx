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
import { useEffect, useState, type SyntheticEvent } from "react";
import useGetLeagueTeamsSleeper from "@feature/leagues/hooks/useGetLeagueTeamsSleeper";
import useGetLeagueInfo from "@feature/leagues/hooks/useGetLeagueInfo";
import DisplayRosterByPosition from "@components/DisplayRosterByPosition";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNotification } from "@hooks/useNotification";
import useGetPreviousSeasons from "../hooks/useGetPreviousSeasons";
import { useNavigate } from "@tanstack/react-router";
import BackButton from "@components/BackButton";
import useGetSavedTeam from "../hooks/useGetSavedTeam";
import { useAppSelector } from "@app/hooks";
import useSaveSleeperLeague from "../hooks/useSaveTeam";
import useSleeperPlayers from "../hooks/useSleeperPlayers";
import useCheckUserLeague from "@feature/leagues/hooks/useCheckUserLeague";

// Saving League
import type { League } from "@services/api/user"; // TODO: Find a way to not need this import
import useSaveLeague from "@feature/leagues/hooks/useSaveLeague";

// TODO: Move out of search hooks as it is used in league feature too?
import useDeleteLeague from "@feature/search/hooks/useDeleteLeague";
import { TransactionTab } from "@feature/leagues/components/sleeper_TransactionsTab";

interface SleeperLeaguesHomePage {
  league_id: string;
  tab: number;
  parent?: string;
}

export default function SleeperLeaguesHomePage({
  league_id,
  tab,
  parent
}: SleeperLeaguesHomePage) {
  const theme = useTheme();

  const { showError } = useNotification();

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

  // Checking if league saved for user 
  const league = { league_id, platform: "sleeper" };
  const {
    data: isUserLeague,
  } = useCheckUserLeague(league);

  // Save Sleeper League Mutate Function From User via User Action Buttons
  const {
    mutate: saveLeague,
    isPending: isSavingLeague,
  } = useSaveLeague();

  /**
   * Event handler function that saves the current league to the user's account
   * 
   * @returns void
   */
  const handleSaveLeague = () => {
    const leagueId = league_id;
    const platform = "sleeper";
    const league: League = {
      platform: platform,
      league_id: leagueId,
    };

    saveLeague(league);
  };

  // Remove Sleeper League Mutate Function From User via User Action Buttons
  const {
    mutate: removeLeague,
    isPending: isRemovingLeague
  } = useDeleteLeague();

  const handleRemoveLeague = () => {
    const leagueId = league_id;
    const platform = "sleeper";
    const league: League = {
      platform: platform,
      league_id: leagueId,
    };

    removeLeague(league);
  };



  const [expanded, setExpanded] = useState<number | false>(false);
  const username = useAppSelector((state) => state.authReducer.username);
  const { savedTeam } = useGetSavedTeam(league_id, !username);
  const { mutate } = useSaveSleeperLeague();

  const [showAddTeam, setShowAddTeam] = useState<number>(0);

  // Error Notification useEffect
  useEffect(() => {
    if (leagueError) {
      showError(leagueError);
    }
  }, [leagueError, showError]);

  useEffect(() => {
    if (teamError) {
      showError(teamError);
    }
  }, [teamError, showError]);

  useEffect(() => {
    if (rosterError) {
      showError(rosterError.message);
    }
  }, [rosterError, showError]);

  const handleAccordionChange =
    (panel: number) => (event: SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  interface TabPanelProps {
    children?: React.ReactNode;
    id: number;
    value: number;
  }

  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, id, ...other } = props;

    return (
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
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [value, setValue] = useState<number>(tab);

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  // Loading State: League Info 
  if (leagueLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Error State: League
  if (leagueError) {
    const errorMessage = leagueError;
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography variant="h6" color="text.primary" textAlign="center">
          Oops! Failed to load league information.
          <br />
          {errorMessage || "Please try again later."}
        </Typography>
      </Box>
    );
  }

  // Null: League
  if (!leagueInfo) {
    return null;
  }

  return (
    <Box sx={{ width: '100%' }}>

      {/* Heading */}
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

        {/* Top Box */}
        <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>

          {/* Left Box */}
          <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
            <BackButton url="/" />

            {/* League Avatar */}
            <Avatar
              src={leagueInfo.avatar}
              alt={`${leagueInfo.name} avatar`}
              sx={{
                width: 60,
                height: 60,
                boxShadow: theme.shadows[3],
              }}
            />

            {/* League Name */}
            <Typography variant="h3" component="h1" color="text.primary">
              {leagueInfo.name}
            </Typography>
          </Box>

          {/* Right Box */}
          <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
            {username && (
              <>
                {/* If isUserLeague = false, then user is able to add. Otherwise, user is able to remove */}
                {!isUserLeague ? (
                  <Button variant="contained" color="success" onClick={handleSaveLeague} disabled={isSavingLeague}>
                    <Typography>Add</Typography>
                  </Button>
                ) : (
                  <Button variant="contained" color="error" onClick={handleRemoveLeague} disabled={isRemovingLeague}>
                    <Typography>Remove</Typography>
                  </Button>
                )}
              </>
            )}
          </Box>
        </Box>

        {/* Bottom Box */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>

          {/* Navigation Tabs & Dropdown */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Rosters" {...a11yProps(0)} />
              <Tab label="Transactions" {...a11yProps(1)} />
              <Tab label="Item Three" {...a11yProps(2)} />
            </Tabs>

            <PreviousSeasonsDropDown league_id={league_id} current_tab={value} parent={parent} />
          </Box>
        </Box>

        {/* Rosters */}
        <CustomTabPanel value={value} id={0}>

          {/* Error: Team */}
          {teamError && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="60vh"
            >
              <Typography variant="h6" color="text.primary" textAlign="center">
                Oops! Failed to load league information.
                <br />
                {teamError || "Please try again later."}
              </Typography>
            </Box>
          )}

          {/* Loading State: Team */}
          {!teamError && teamLoading && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="60vh"
            >
              <CircularProgress />
            </Box>
          )}

          {/* Null: Team */}
          {!teamError && !teamLoading && !teams && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="60vh"
            >
              <Typography variant="h6" color="text.primary" textAlign="center">
                Oops! Failed to load team information.
                <br />
              </Typography>
            </Box>
          )}

          {/* Teams Render */}
          {!teamError && !teamLoading && teams && (
            teams.map((team) => (

              // Team Box
              <Accordion
                key={team.roster_id}
                expanded={expanded === team.roster_id}
                onChange={handleAccordionChange(team.roster_id)}
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

                {/* Team Content */}
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

                  {/* Team Avatar */}
                  {team.avatar ? (
                    <Avatar src={team.avatar} alt={`${team.display_name} avatar`} />
                  ) : (
                    <Avatar />
                  )}

                  {/* Team Description */}
                  <Box
                    display="flex"
                    flexDirection={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    gap={{ xs: 0.5, sm: 1 }}
                  >

                    {/* Team Name */}
                    <Typography
                      variant="body1"
                      component="span"
                      sx={{
                        fontWeight: expanded === team.roster_id ? 600 : 500,
                        color:
                          expanded === team.roster_id
                            ? theme.palette.text.primary
                            : theme.palette.text.secondary,
                      }}
                    >
                      {team.team_name || team.display_name}
                    </Typography>

                    {/* Team Record */}
                    <Typography variant="body2" color="text.secondary">
                      ({team.record.wins} - {team.record.ties} - {team.record.losses})
                    </Typography>

                    {savedTeam && team.user_id && (savedTeam.saved_user == team.user_id ? <Chip label="My Team" /> :
                      showAddTeam == team.roster_id && (<Chip label="Set As My Team" onClick={(e) => {
                        e.stopPropagation();
                        mutate({ user_id: team.user_id!, league_id: league_id });
                      }} />)
                    )}

                  </Box>
                </AccordionSummary>

                {/* Roster */}
                <AccordionDetails
                  sx={{
                    backgroundColor: theme.palette.background.default,
                    borderTop: `1px dashed ${theme.palette.divider}`,
                    p: { xs: 2, sm: 3 },
                  }}
                >

                  {/* Error: Roster */}
                  {rosterError && (
                    <Typography color="text.primary" sx={{ textAlign: "center", py: 2 }}>
                      Unable to load players for this team. Please refresh and try again.
                    </Typography>
                  )}

                  {/* Loading State: Roster */}
                  {!rosterError && rosterLoading && (
                    <Box display="flex" justifyContent="center" py={3}>
                      <CircularProgress size={32} />
                    </Box>
                  )}

                  {/* Null: Roster */}
                  {!rosterError && !rosterLoading && !roster && (
                    <Typography variant="h6" color="text.primary" textAlign="center"
                    >
                      Oops! Failed to load roster.
                    </Typography>
                  )}

                  {/* Roster Render for players*/}
                  {!rosterError && !rosterLoading && roster && roster[team.roster_id] && roster[team.roster_id].length > 0 && (
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
                  )}

                  {!rosterError && !rosterLoading && roster && roster[team.roster_id] && roster[team.roster_id].length === 0 && (
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
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: "center", py: 2 }}
                      >
                        No players on this roster.
                      </Typography>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </CustomTabPanel>

        {/* Transactions */}
        <CustomTabPanel value={value} id={1}>

          {/* Render Transaction Tab Component if teams is not null */}
          {teams ? (
            <TransactionTab teams={teams} league_id={league_id} league_season={leagueInfo.season} />

          ) : (
            <Typography variant="h6" color="text.primary" textAlign="center"
            >
              Oops! Failed to load transactions.
            </Typography>
          )}
        </CustomTabPanel>
      </Box>
    </Box >
  );
}


// Move later
const PreviousSeasonsDropDown = ({ league_id, current_tab, parent }: { league_id: string; current_tab: number; parent?: string; }) => {
  const { prevSeasons } = useGetPreviousSeasons(parent ? parent : league_id);
  const navigate = useNavigate();
  if (!prevSeasons || prevSeasons.length == 0) return null;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography >Previous Seasons</Typography>
      <Select
        value={league_id}
        onChange={(event: SelectChangeEvent) => {
          navigate({ to: `/leagues/${event.target.value}`, search: { tab: current_tab, parent: prevSeasons[0].league_id } });
        }}
      >
        {prevSeasons.map((season) => {
          return <MenuItem key={season.season} value={season.league_id}>
            {season.season}
          </MenuItem>;
        })}
      </Select>
    </Box>
  );
};
