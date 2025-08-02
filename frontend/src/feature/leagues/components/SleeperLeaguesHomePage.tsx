import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  useTheme,
  type SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState, type SyntheticEvent } from "react";
import useGetLeagueTeamsSleeper from "@feature/leagues/hooks/useGetLeagueTeamsSleeper";
import useGetPlayersOnRosterSleeper from "@feature/leagues/hooks/useGetPlayersOnRosterSleeper";
import useGetLeagueInfo from "@feature/leagues/hooks/useGetLeagueInfo";
import DisplayRosterByPosition from "@components/DisplayRosterByPosition";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNotification } from "@hooks/useNotification";
import useGetAllTransactionsType from "../hooks/useGetAllTransactions";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { sleeper_getPlayer, type Player, type TeamInfo, type Transaction } from "@services/sleeper";
import useGetPreviousSeasons from "../hooks/useGetPreviousSeasons";
import { useNavigate } from "@tanstack/react-router";
import BackButton from "@components/BackButton";
import useGetTransactionByWeek from "../hooks/useGetTransactionByWeek";
import useGetSleeperState from "../hooks/useGetSleeperState";


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
    players: roster,
    error: rosterError,
    loading: rosterLoading,
    refreshRoster,
  } = useGetPlayersOnRosterSleeper(league_id);

  const [expanded, setExpanded] = useState<number | false>(false);

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
      showError(rosterError);
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

  if (!leagueInfo || !teams) {
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
        <Box display="flex" alignItems="center" gap={2} mb={1}>
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
                  onClick={() => refreshRoster(team.roster_id)}
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
                      {rosterError || "Unknown error"}
                    </Typography>
                  )}

                  {/* Loading State: Roster */}
                  {!rosterError && rosterLoading && (
                    <Box display="flex" justifyContent="center" py={3}>
                      <CircularProgress size={32} />
                    </Box>
                  )}

                  {/* Roster Render if there are players on roster */}
                  {!rosterError && !rosterLoading && roster && (
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

                  {/* Roster Render if there are no players on roster */}
                  {!rosterError && !rosterLoading && roster && roster.length === 0 && (
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
            ))
          )}
        </CustomTabPanel>

        {/* Transactions */}
        <CustomTabPanel value={value} id={1}>
          <TransactionTab teams={teams} league_id={league_id} league_season={leagueInfo.season} />
        </CustomTabPanel>
      </Box>
    </Box>
  );
}
const TransactionTab = ({ league_id, teams, league_season }: { league_id: string, league_season: string, teams: TeamInfo[]; }) => {
  const { data: state } = useGetSleeperState();
  /*finding the max week, week set to current week from sleeper state get if it is the current season,
  otherwise it will be the max number of weeks in a season(which is 20)
  */
  const max_week = league_season == state?.league_season ? state.week : 19;
  //display week max is 20
  const display_weeks = Array.from({ length: max_week + 1 }, (_, i) => i + 1).reverse();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>

      {display_weeks.map((week) => {
        return (
          <TransactionCard week={String(week)} league_id={league_id} teams={teams} open={week == display_weeks.length} key={week} />);
      })}
    </Container>
  );
};
const TransactionCard = ({ week, league_id, teams, open }: { week: string, league_id: string, teams: TeamInfo[]; open: boolean; }) => {
  const [showWeek, setShowWeek] = useState<boolean>(open);

  const toggleCard = () => {
    setShowWeek((prev) => !prev);
  };
  return (
    <Card key={week} sx={{ mb: 3, boxShadow: 3 }}>
      <CardHeader title={
        <Typography variant="h5" sx={{ fontWeight: 'bold', }}>
          {`Week ${week}`}
        </Typography>}
        action={
          <IconButton onClick={toggleCard}>
            {showWeek ?
              <ExpandLess /> : <ExpandMore />}
          </IconButton>
        }
      />
      {showWeek && <TransactionInWeekDisplay week={week} league_id={league_id} teams={teams} />}
    </Card>
  );

};
const TransactionInWeekDisplay = ({ week, league_id, teams }: { week: string, league_id: string, teams: TeamInfo[]; }) => {
  const [expanded, setExpanded] = useState<string | false>("");
  const { data: transactions } = useGetTransactionByWeek(league_id, Number(week));

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
  const handleAccordionChange =
    (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  return (
    <CardContent>

      {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mr: 2 }}>
              Week {leg}
            </Typography>
            <Badge badgeContent={legTransactions.length} color="primary">
              <Chip label="Transactions" variant="outlined" />
            </Badge>
          </Box>
          <IconButton onClick={toggleCard}>
            {showWeek ?
              <ExpandMore /> : <ExpandLess />
            }
          </IconButton>
        </Box> */}


      {transactions ? transactions.map((transaction, index) => (
        <Accordion key={transaction.transaction_id} sx={{ mb: 2 }} expanded={expanded === transaction.transaction_id} onChange={handleAccordionChange(transaction.transaction_id)}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
              <Chip
                label={transaction.type}
                color={getTypeColor(transaction.type) as any}
                size="small"
                variant="outlined"
                sx={{ width: 100, justifyContent: 'center' }}
              />
              <Typography sx={{ flexGrow: 1, ml: 2, fontWeight: 600 }}>
                {
                  // transaction.roster_ids.length > 1 ?
                  transaction.roster_ids.map((id) => teams[id - 1].display_name).join(' ')
                }
              </Typography>
              <Chip
                label={transaction.status}
                color={getStatusColor(transaction.status) as any}
                size="small"
                sx={{ width: 80, justifyContent: 'center' }}
              />
            </Box>
          </AccordionSummary>
          {expanded === transaction.transaction_id &&
            <AccordionDetails>
              {transaction.type == "trade" ?
                <DisplayTrades transaction={transaction} teams={[teams[transaction.roster_ids[0] - 1], teams[transaction.roster_ids[1] - 1]]} /> :
                <DisplayAddDrop transaction={transaction} team={teams[transaction.roster_ids[0] - 1]} />
              }
            </AccordionDetails>
          }
        </Accordion>
      )) :
        <>No transactions found</>
      }
    </CardContent>

  );
};

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

const DisplayAddDrop = ({ transaction, team }: { transaction: Transaction, team: TeamInfo | undefined; }) => {
  if (!team) return;
  const formatUnixTime = (time: string) => {
    const day = new Date(time);
    return day.toString().substring(4, 21);
  };
  const [addsNames, setAddsNames] = useState<string[]>([]);
  const [dropsNames, setDropsNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchPlayerNames = async () => {
      if (transaction.adds) {
        const addEntries = await Promise.all(
          Object.entries(transaction.adds).map(async ([key]) => {
            const player = await sleeper_getPlayer(key);
            return `${player[0].first_name} ${player[0].last_name}`;
          })
        );
        setAddsNames(addEntries);
      }

      if (transaction.drops) {
        const dropEntries = await Promise.all(
          Object.entries(transaction.drops).map(async ([key]) => {
            const player = await sleeper_getPlayer(key);
            return `${player[0].first_name} ${player[0].last_name}`;
          })
        );
        setDropsNames(dropEntries);
      }
    };

    fetchPlayerNames();
  }, [transaction]);
  return (<Grid container spacing={3}>
    <Grid >
      <List dense>
        <ListItem>
          <ListItemText
            primary="Team"
            secondary={team.display_name}
          />
        </ListItem>

        {addsNames.length > 0 &&
          <ListItem>
            <ListItemText
              primary="Adds"
            />
          </ListItem>
        }
        {addsNames.map((player) => {
          return <ListItem>
            <ListItemText

              secondary={player} />
          </ListItem>;
        })}
        <ListItem>
          {dropsNames.length > 0 &&
            <ListItemText
              primary="Drops"
              secondary={dropsNames}
            />
          }
        </ListItem>
        <ListItem>
          <ListItemText
            // primary="Status Updated"
            secondary={formatUnixTime(transaction.status_updated)}
          />
        </ListItem>
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
  </Grid>);
};
const DisplayTrades = ({ transaction, teams }: { transaction: Transaction, teams: TeamInfo[] | undefined; }) => {
  if (!teams) return;
  const formatUnixTime = (time: string) => {
    const day = new Date(time);
    return day.toString().substring(4, 21);
  };
  const [playerMap, setPlayerMap] = useState<Record<string, Player>>({});
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const loadPlayerMap = async () => {
      const ids: string[] = [];
      if (transaction.adds) {
        Object.entries(transaction.adds).map(([key]) => {
          ids.push(key);
        });
      }
      if (transaction.drops) {
        Object.entries(transaction.drops).map(([key]) => {
          ids.push(key);
        });
      }
      const players = await sleeper_getPlayer(ids.join("&"));
      const tmap: Record<string, Player> = {};
      for (const player of players) {
        tmap[player.id] = player;
      }

      setPlayerMap(tmap);
      setLoading(false);
    };
    loadPlayerMap();
  }, [transaction]);

  if (loading) return <CircularProgress />;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Team</TableCell>
            <TableCell>Additions</TableCell>
            <TableCell>Drops</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teams.map((team) => {
            const teamAdds = transaction.adds
              ? Object.entries(transaction.adds)
                .filter(([_, rosterId]) => rosterId === team.roster_id)
                .map(([playerName]) => playerName)
              : [];

            const teamDrops = transaction.drops
              ? Object.entries(transaction.drops)
                .filter(([_, rosterId]) => rosterId === team.roster_id)
                .map(([playerName]) => playerName)
              : [];

            return (
              <TableRow key={team.roster_id} hover>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {team.display_name}
                  </Typography>
                </TableCell>

                <TableCell>
                  {teamAdds.length > 0 ? (
                    <Box>
                      {teamAdds.map((playerName, index) => (
                        <Box key={playerName} sx={{ display: 'block', mb: 0.5 }}>
                          {`${playerMap[playerName].first_name} ${playerMap[playerName].last_name}`}
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" >
                      —
                    </Typography>
                  )}
                </TableCell>

                <TableCell>
                  {teamDrops.length > 0 ? (
                    <Box>
                      {teamDrops.map((playerName, index) => (
                        <Box key={playerName} sx={{ display: 'block', mb: 0.5 }}>
                          {`${playerMap[playerName].first_name} ${playerMap[playerName].last_name}`}
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      —
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Box sx={{ p: 2, textAlign: 'right', borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">
          Completed: {formatUnixTime(transaction.status_updated)}
        </Typography>
      </Box>
    </TableContainer>
  );
};