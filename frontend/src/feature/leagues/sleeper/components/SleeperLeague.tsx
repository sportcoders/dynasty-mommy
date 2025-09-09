// -------------------- Imports --------------------
import { useCallback } from "react";

import { useAppSelector } from "@app/hooks";

import BackButton from "@components/BackButton";

import SleeperTransactionsTab from "@feature/leagues/sleeper/components/TransactionTab";

import useGetLeagueTeamsSleeper from "@feature/leagues/sleeper/hooks/team/useGetLeagueTeamsSleeper";
import useGetLeagueInfo from "@feature/leagues/sleeper/hooks/league/useGetLeagueInfo";
import useGetPreviousSeasons from "@feature/leagues/sleeper/hooks/league/useGetPreviousSeasons";

import RosterTab from "@feature/leagues/sleeper/components/RosterTab";
import useIsUserLeague from "@feature/leagues/sleeper/hooks/league/useIsUserLeague";
import useSaveLeague from "@feature/leagues/sleeper/hooks/league/useSaveLeague";
import useDeleteLeague from "@feature/search/sleeper/hooks/useDeleteLeague";

import { useNavigate } from "@tanstack/react-router";

import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
  useTheme,
  type SelectChangeEvent,
} from "@mui/material";

import type { League } from "@services/api/user";

// -------------------- Interfaces --------------------
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

// -------------------- Components --------------------
/**
 * A custom tab panel component that displays content based on the active tab value.
 * 
 * Only renders its children when the panel's ID matches the current tab value,
 * providing proper accessibility attributes and conditional visibility.
 *
 * @param children - The content to display within the tab panel
 * @param value - The currently active tab value used to determine visibility
 * @param id - The unique identifier for this tab panel, compared against value
 * @param other - Additional props spread to the root div element
 * @returns A div element with proper ARIA attributes and conditional content rendering
 */
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

/**
 * A dropdown component that allows users to navigate between different seasons of a league.
 * 
 * Fetches and displays all previous seasons for a league, allowing users to switch between
 * seasons while maintaining the current tab context. If no previous seasons exist, the
 * component renders nothing.
 *
 * @param league_id - The ID of the currently selected league/season
 * @param current_tab - The active tab to preserve when navigating between seasons
 * @param parent - Optional parent league ID to use for fetching seasons instead of league_id
 * @returns A dropdown select component with previous seasons, or null if no seasons exist
 */
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

// -------------------- Main Component --------------------
/**
 * Main page component for displaying a Sleeper fantasy league with tabbed navigation.
 * 
 * Provides a comprehensive view of a Sleeper league including rosters, transactions, 
 * and user management features. Handles multiple loading states, error scenarios,
 * and user interactions for saving/removing leagues and setting team preferences.
 * 
 * Features:
 * - League information display with avatar and name
 * - Tabbed interface for rosters, transactions, and additional content
 * - Team roster management with expandable accordions
 * - User authentication-based league saving/removal
 * - Previous seasons navigation dropdown
 * - Responsive design for various screen sizes
 *
 * @param league_id - The unique identifier for the Sleeper league to display
 * @param tab - The currently active tab index (0: Rosters, 1: Transactions, 2: Other)
 * @param parent - Optional parent league ID for navigating between related seasons
 * @returns A full-page league interface with tabbed content, or loading/error states
 */
export default function SleeperLeague({
  league_id,
  tab,
  parent
}: SleeperLeaguesHomePageProps) {
  const theme = useTheme();

  const username = useAppSelector((state) => state.auth.username);
  const navigate = useNavigate({ from: `/leagues/$leagueId` });

  // Data fetching hooks
  const {
    leagueInfo,
    loading: leagueLoading,
    error: leagueError
  } = useGetLeagueInfo(league_id);

  const {
    teams,
  } = useGetLeagueTeamsSleeper(league_id);

  // User-specific data (only fetch if logged in)
  const league = { league_id, platform: "sleeper" as const };
  const { data: isUserLeague } = useIsUserLeague(league, !username);

  // Mutation hooks
  const { mutate: saveLeague, isPending: isSavingLeague } = useSaveLeague();
  const { mutate: removeLeague, isPending: isRemovingLeague } = useDeleteLeague();

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
          <RosterTab league_id={league_id} />
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