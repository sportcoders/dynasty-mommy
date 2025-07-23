import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Badge,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  Typography,
  useTheme,
  type SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState, type SyntheticEvent } from "react";
import useGetLeagueTeamsSleeper from "@feature/leagues/hooks/useGetLeagueTeamsSleeper";
import useGetPlayersOnRosterSleeper from "@feature/leagues/hooks/useGetPlayersOnRosterSleeper";
import useGetLeagueInfo from "@feature/leagues/hooks/useGetLeagueInfo";
import useDelayedLoading from "@hooks/useDelayedLoading";
import DisplayRosterByPosition from "@components/DisplayRosterByPosition";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNotification } from "@hooks/useNotification";
import SelectSeasonDropDown from "@components/SelectSeasonDropDown";
import useGetAllTransactionsType from "../hooks/useGetAllTransactions";
import { ExpandMore } from "@mui/icons-material";
import type { Transaction } from "@services/sleeper";
import useGetPreviousSeasons from "../hooks/useGetPreviousSeasons";
import { useNavigate } from "@tanstack/react-router";

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
  const { data: transactions, loading: transaction_loading, isError: transaction_error } = useGetAllTransactionsType(league_id);

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

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [value, setValue] = useState(0);
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
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
        <Box display="flex" alignItems="center" gap={2} mb={1}>
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
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Rosters" {...a11yProps(0)} />
              <Tab label="Transactions" {...a11yProps(1)} />
              <Tab label="Item Three" {...a11yProps(2)} />
            </Tabs>
            {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography >Previous Seasons</Typography>
              <SelectSeasonDropDown selectedYear="2025" updateSeason={() => { }} />
            </Box> */}
            <PreviousSeasonsDropDown league_id={league_id} />
          </Box>
        </Box>

        <CustomTabPanel value={value} index={0}>
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
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>

          {!transactions ? <CircularProgress /> : <TransactionDisplay transactions={transactions} />}
        </CustomTabPanel>
      </Box>
    </Box>
  );
}
const TransactionDisplay = ({ transactions }: { transactions: Record<number, Transaction[]>; }) => {
  if (!transactions)
    return (
      <>
        No Transactions Found
      </>
    );


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'trade': return 'primary';
      case 'waiver': return 'secondary';
      case 'commissioner': return 'info';
      case 'free_agent': return 'default';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>

      {Object.entries(transactions).map(([leg, legTransactions]) => (
        <Card key={leg} sx={{ mb: 3, boxShadow: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mr: 2 }}>
                Week {leg}
              </Typography>
              <Badge badgeContent={legTransactions.length} color="primary">
                <Chip label="Transactions" variant="outlined" />
              </Badge>
            </Box>

            {legTransactions.map((transaction, index) => (
              <Accordion key={transaction.transaction_id} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                    <Chip
                      label={transaction.status}
                      color={getStatusColor(transaction.status) as any}
                      size="small"
                    />
                    <Chip
                      label={transaction.type}
                      color={getTypeColor(transaction.type) as any}
                      size="small"
                      variant="outlined"
                    />
                    <Typography sx={{ flexGrow: 1, ml: 2 }}>
                      Transaction ID: {transaction.transaction_id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {/* {formatTimestamp(transaction.)} */}
                    </Typography>
                  </Box>
                </AccordionSummary>

                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid >
                      <List dense>
                        <ListItem>
                          <ListItemText
                            primary="Creator"
                            secondary={transaction.creator}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Roster IDs"
                            secondary={transaction.roster_ids?.join(', ') || 'None'}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Status Updated"
                          // secondary={formatTimestamp(transaction.status_updated)}
                          />
                        </ListItem>
                        {transaction.consenter_ids && (
                          <ListItem>
                            <ListItemText
                              primary="Consenter IDs"
                              secondary={transaction.consenter_ids.join(', ')}
                            />
                          </ListItem>
                        )}
                      </List>
                    </Grid>

                    <Grid >
                      {/* {transaction.metadata && transaction.metadata.notes && (
                        <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Notes
                          </Typography>
                          <Typography variant="body2">
                            {transaction.metadata.notes}
                          </Typography>
                        </Paper>
                      )} */}

                      {transaction.waiver_budget && transaction.waiver_budget.length > 0 && (
                        <Paper sx={{ p: 2, bgcolor: 'warning.50' }}>
                          <Typography variant="subtitle2" color="warning.main" gutterBottom>
                            Waiver Budget Changes
                          </Typography>
                          {transaction.waiver_budget.map((budget, idx) => (
                            <Typography key={idx} variant="body2">
                              {/* ${budget.amount} from Roster {budget.sender} to Roster {budget.receiver} */}
                            </Typography>
                          ))}
                        </Paper>
                      )}
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      ))}

      {Object.keys(transactions).length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No transactions found
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

const PreviousSeasonsDropDown = ({ league_id }: { league_id: string; }) => {
  const { prevSeasons } = useGetPreviousSeasons(league_id);
  const navigate = useNavigate();
  if (!prevSeasons || prevSeasons.length == 0) return null;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography >Previous Seasons</Typography>
      {/* <SelectSeasonDropDown selectedYear={prevSeasons.at(0)?.season ?? "2025"} start_year={Number(prevSeasons.at(-1)?.season)} updateSeason={(season:string) => {
        navigate({to:`/leagues/${season}`})
       }} /> */}
      <Select
        value={prevSeasons.at(0)?.league_id}
        onChange={(event: SelectChangeEvent) => {
          navigate({ to: `/leagues/${event.target.value}` });
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