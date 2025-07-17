import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState, type SyntheticEvent } from "react";
import useGetLeagueTeamsSleeper from "@feature/leagues/hooks/useGetLeagueTeamsSleeper";
import useGetPlayersOnRosterSleeper from "@feature/leagues/hooks/useGetPlayersOnRosterSleeper";
import useGetLeagueInfo from "@feature/leagues/hooks/useGetLeagueInfo";
import useDelayedLoading from "@hooks/useDelayedLoading";
import DisplayRosterByPosition from "@components/DisplayRosterByPosition";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNotification } from "@hooks/useNotification";

interface SleeperLeaguesHomePage {
  league_id: string;
}

export default function SleeperLeaguesHomePage({
  league_id,
}: SleeperLeaguesHomePage) {
  const theme = useTheme();
  const {
    teams,
    error: team_error,
    loading: team_loading,
  } = useGetLeagueTeamsSleeper(league_id);

  const {
    players: roster,
    error: roster_error,
    loading: roster_loading,
    refreshRoster,
  } = useGetPlayersOnRosterSleeper(league_id);

  const { leagueInfo, loading, error } = useGetLeagueInfo(league_id);

  const [expanded, setExpanded] = useState<number | false>(false);

  const [showTeamLoading, showRosterLoading, showLeagueLoading] =
    useDelayedLoading([team_loading, roster_loading, loading], 1000);

  const { showError } = useNotification();

  useEffect(() => {
    if (error) {
      showError(`Failed to load league info: ${error}`);
    }
  }, [error, showError]);

  useEffect(() => {
    if (team_error) {
      showError(`Failed to load teams: ${team_error}`);
    }
  }, [team_error, showError]);

  useEffect(() => {
    if (roster_error) {
      showError(`Failed to load roster: ${roster_error}`);
    }
  }, [roster_error, showError]);

  const handleAccordionChange =
    (panel: number) => (event: SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  if (showLeagueLoading || showTeamLoading) {
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

  if (error || team_error) {
    const errorMessage = error || team_error;
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography variant="h6" color="error" textAlign="center">
          Oops! Failed to load league information.
          <br />
          {errorMessage || "Please try again later."}
        </Typography>
      </Box>
    );
  }

  if (!leagueInfo || !teams) {
    return null;
  }

  return (
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
      <Box display="flex" alignItems="center" gap={2} mb={4}>
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

      {teams.map((team) => (
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
        >
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
            onClick={() => refreshRoster(team.roster_id)}
          >
            {team.avatar ? (
              <Avatar src={team.avatar} alt={`${team.display_name} avatar`} />
            ) : (
              <Avatar />
            )}
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
                  fontWeight: expanded === team.roster_id ? 600 : 500,
                  color:
                    expanded === team.roster_id
                      ? theme.palette.text.primary
                      : theme.palette.text.secondary,
                }}
              >
                {team.team_name || team.display_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({team.record.wins} - {team.record.ties} - {team.record.losses})
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              backgroundColor: theme.palette.background.default,
              borderTop: `1px dashed ${theme.palette.divider}`,
              p: { xs: 2, sm: 3 },
            }}
          >
            {roster_error && (
              <Typography color="error" sx={{ textAlign: "center", py: 2 }}>
                Failed to load roster: {roster_error || "Unknown error"}
              </Typography>
            )}

            {showRosterLoading && (
              <Box display="flex" justifyContent="center" py={3}>
                <CircularProgress size={32} />
              </Box>
            )}

            {!showRosterLoading && roster && (
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
                    roster={roster}
                    position={position}
                  />
                ))}
              </Box>
            )}
            {!showRosterLoading && !roster && !roster_error && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", py: 2 }}
              >
                No roster data available for this team.
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
