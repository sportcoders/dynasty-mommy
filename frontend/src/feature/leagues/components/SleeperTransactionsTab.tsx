import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
    Container,
    Card,
    CardHeader,
    Typography,
    IconButton,
    CardContent,
    Accordion,
    AccordionSummary,
    Box,
    Chip,
    AccordionDetails,
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper,
    CircularProgress,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    Button,
    Popover
} from "@mui/material";
import { type SelectChangeEvent } from "@mui/material/Select";

import {
    type TeamInfo,
    type Transaction,
    sleeper_getPlayer,
    type Player,
    type sleeper_draftPick
} from "@services/sleeper";

import { useState, useEffect, type SyntheticEvent, useMemo } from "react";
import useGetTransactionByWeek from "../hooks/useGetTransactionByWeek";

import { formatUnixTime } from "@utils/formatUnixTime";

// ===== MAIN COMPONENT =====
export default function TransactionTab({
    league_id,
    teams,
    last_scored_leg
}: {
    league_id: string;
    teams: TeamInfo[];
    last_scored_leg: number | undefined;
}) {
    //if last_scored_leg exists we use it, otherwise it means season has not started yet so we use first week
    const max_week = last_scored_leg || 1;
    const display_weeks = Array.from({ length: max_week }, (_, i) => i + 1).reverse();

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {display_weeks.map((week) => {
                return (
                    <TransactionCard
                        week={String(week)}
                        league_id={league_id}
                        teams={teams}
                        open={week == display_weeks.length}
                        key={week}
                    />
                );
            })}
        </Container>
    );
}

// ===== TRANSACTION CARD COMPONENT =====
/**
 * JSX component used the render each transaction week
 * used to allow toggle of each card per week
 * 
 * @param week - the week the transaction belongs to
 * @param league_id - the sleeper_id of the league we are viewing transactions for
 * @param teams - the array of teams(sleeper team objects) in the league
 * @param open - boolean to set the transaction card open by default
 */
const TransactionCard = ({
    week,
    league_id,
    teams,
    open
}: {
    week: string;
    league_id: string;
    teams: TeamInfo[];
    open: boolean;
}) => {
    const [showWeek, setShowWeek] = useState<boolean>(open);

    const toggleCard = () => {
        setShowWeek((prev) => !prev);
    };

    return (
        <Card key={week} sx={{ mb: 3, boxShadow: 3 }}>
            <CardHeader
                title={
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {`Week ${week}`}
                    </Typography>
                }
                action={
                    <IconButton onClick={toggleCard}>
                        {showWeek ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                }
            />
            {showWeek && (
                <TransactionInWeekDisplay
                    week={week}
                    league_id={league_id}
                    teams={teams}
                />
            )}
        </Card>
    );
};

// ===== TRANSACTION IN WEEK DISPLAY COMPONENT =====
/**
 * Component used to fetch each weeks transactions
 * Used so only selected week(s) are fetched instead of all weeks
 * 
 * @param week - the week being displayed
 * @param league_id - sleeper league id for league
 * @param teams - array of team objects in sleeper league
 */
const TransactionInWeekDisplay = ({
    week,
    league_id,
    teams
}: {
    week: string;
    league_id: string;
    teams: TeamInfo[];
}) => {
    // ===== STATE MANAGEMENT =====
    const [expanded, setExpanded] = useState<string | false>("");
    const [filterBy, setFilterBy] = useState('');
    const [teamFilter, setTeamFilter] = useState<number[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    // ===== DATA FETCHING =====
    const { data: transactions } = useGetTransactionByWeek(league_id, Number(week));

    // ===== UTILITY FUNCTIONS =====
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

    // ===== EVENT HANDLERS =====
    const handleAccordionChange = (panel: string) => (_: SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
    };

    const handleFilterChange = (event: SelectChangeEvent) => {
        setFilterBy(event.target.value);
    };

    const handleTeamSelect = (rosterId: number) => {
        setTeamFilter(prev => {
            if (prev.includes(rosterId)) {
                // Remove team if already selected
                return prev.filter(id => id !== rosterId);
            } else {
                // Add team if not selected
                return [...prev, rosterId];
            }
        });
    };

    const handleTeamMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleTeamMenuClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    // ===== COMPUTED VALUES =====
    const getTeamsInTransactions = useMemo(() => {
        if (!transactions) return [];

        const teamIds = new Set<number>();
        transactions.forEach(transaction => {
            transaction.roster_ids.forEach(id => teamIds.add(id));
        });

        return Array.from(teamIds)
            .map(id => teams.find(team => team.roster_id === id))
            .filter(Boolean) as TeamInfo[];
    }, [transactions, teams]);

    const filteredTransactions = useMemo(() => {
        if (!transactions) return null;

        let filtered = [...transactions];



        // Apply filter
        if (filterBy) {
            filtered = filtered.filter(transaction => {
                switch (filterBy) {
                    case 'trade':
                    case 'waiver':
                    case 'free_agent':
                    case 'commisioner':
                        return transaction.type === filterBy;
                    case 'team':
                        if (teamFilter.length === 0) return true;
                        return transaction.roster_ids.some(id => teamFilter.includes(id));
                    default:
                        return true;
                }
            });
        }

        if (teamFilter) {
            filtered = filtered.filter(transaction => {
                if (teamFilter.length === 0) return true;
                return transaction.roster_ids.some(id => teamFilter.includes(id));
            });
        }

        return filtered;
    }, [transactions, filterBy, teamFilter]);

    // ===== RENDER =====
    return (
        <CardContent>
            {/* ===== FILTER CONTROLS ===== */}
            {transactions && transactions.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1, alignItems: 'center', mb: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Filter</InputLabel>
                        <Select
                            value={filterBy}
                            label="Filter"
                            onChange={handleFilterChange}
                        >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="trade">Trades</MenuItem>
                            <MenuItem value="waiver">Waivers</MenuItem>
                            <MenuItem value="free_agent">Free Agent</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Button to open team menu */}
                    <Button aria-describedby={id} variant="contained" onClick={handleTeamMenuOpen}>
                        Teams
                    </Button>

                    {/* Show selected teams as chips */}
                    {teamFilter.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                                Filtering by:
                            </Typography>
                            {teamFilter.map(rosterId => {
                                const team = teams.find(t => t.roster_id === rosterId);
                                return team ? (
                                    <Chip
                                        key={rosterId}
                                        label={team.display_name}
                                        size="small"
                                        onDelete={() => handleTeamSelect(rosterId)}
                                        color="primary"
                                        variant="outlined"
                                    />
                                ) : null;
                            })}
                        </Box>
                    )}

                    {/* Popover sidebar menu */}
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleTeamMenuClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}

                        slotProps={{
                            paper: {
                                sx: {
                                    maxHeight: '300px',
                                    minWidth: '200px',
                                    overflow: 'auto',
                                    mt: 0.5,
                                }
                            },
                        }}

                        disableAutoFocus={false}
                        disableEnforceFocus={false}
                    >
                        {getTeamsInTransactions.length > 0 ? (
                            <Box sx={{ p: 1 }}>
                                {getTeamsInTransactions.map((team) => (
                                    <Box
                                        key={team.roster_id}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            px: 1,
                                            py: 0.5,
                                            cursor: 'pointer',
                                            borderRadius: 1,
                                            '&:hover': { bgcolor: 'action.hover' },
                                            minHeight: '40px',
                                        }}
                                        onClick={() => handleTeamSelect(team.roster_id)}
                                    >
                                        <Checkbox
                                            checked={teamFilter.includes(team.roster_id)}
                                            size="small"
                                            sx={{ mr: 1 }}
                                        />
                                        <ListItemText
                                            primary={team.display_name}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                textAlign="center"
                            >
                                No teams in transactions
                            </Typography>
                        )}
                    </Popover>
                </Box>
            )}

            {/* ===== TRANSACTION LIST ===== */}
            {filteredTransactions ?
                filteredTransactions.map((transaction) => (
                    <Accordion
                        key={transaction.transaction_id}
                        sx={{ mb: 2 }}
                        expanded={expanded === transaction.transaction_id}
                        onChange={handleAccordionChange(transaction.transaction_id)}
                    >
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                                <Chip
                                    label={transaction.type}
                                    color={getTypeColor(transaction.type)}
                                    size="small"
                                    variant="outlined"
                                    sx={{ width: 100, justifyContent: 'center' }}
                                />
                                <Typography sx={{ flexGrow: 1, ml: 2, fontWeight: 600 }}>
                                    {transaction.roster_ids.map((id) => teams[id - 1].display_name).join(' ')}
                                </Typography>
                                <Chip
                                    label={transaction.status}
                                    color={getStatusColor(transaction.status)}
                                    size="small"
                                    sx={{ width: 80, justifyContent: 'center' }}
                                />
                            </Box>
                        </AccordionSummary>
                        {expanded === transaction.transaction_id && (
                            <AccordionDetails>
                                {transaction.type == "trade" ? (
                                    <DisplayTrades
                                        transaction={transaction}
                                        teams={[teams[transaction.roster_ids[0] - 1], teams[transaction.roster_ids[1] - 1]]}
                                    />
                                ) : (
                                    <DisplayAddDrop
                                        transaction={transaction}
                                        team={teams[transaction.roster_ids[0] - 1]}
                                    />
                                )}
                            </AccordionDetails>
                        )}
                    </Accordion>
                )) :
                <>No transactions found</>
            }
        </CardContent>
    );
};

// ===== DISPLAY ADD/DROP COMPONENT =====
/**
 * Used to display free agent pickups/waiver wire pickups
 * @param transaction - the transaction object to show
 * @param team - the team associated with the transaction
 */
const DisplayAddDrop = ({
    transaction,
    team
}: {
    transaction: Transaction;
    team: TeamInfo | undefined;
}) => {
    // ===== STATE MANAGEMENT =====
    const [addsNames, setAddsNames] = useState<string[]>([]);
    const [dropsNames, setDropsNames] = useState<string[]>([]);

    // ===== DATA FETCHING =====
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

    if (!team) return;

    // ===== RENDER =====
    return (
        <Grid container spacing={3}>
            <Grid>
                <List dense>
                    <ListItem>
                        <ListItemText
                            primary="Team"
                            secondary={team.display_name}
                        />
                    </ListItem>

                    {addsNames.length > 0 && (
                        <ListItem>
                            <ListItemText primary="Adds" />
                        </ListItem>
                    )}

                    {addsNames.map((player, index) => {
                        return (
                            <ListItem key={index}>
                                <ListItemText secondary={player} />
                            </ListItem>
                        );
                    })}

                    <ListItem>
                        {dropsNames.length > 0 && (
                            <ListItemText
                                primary="Drops"
                                secondary={dropsNames}
                            />
                        )}
                    </ListItem>

                    <ListItem>
                        <ListItemText secondary={formatUnixTime(transaction.status_updated)} />
                    </ListItem>
                </List>
            </Grid>

            <Grid>
                {transaction.waiver_budget && transaction.waiver_budget.length > 0 && (
                    <Paper sx={{ p: 2, bgcolor: 'warning.50' }}>
                        <Typography variant="subtitle2" color="warning.main" gutterBottom>
                            Waiver Budget Changes
                        </Typography>

                        {/* TODO: Check if we need this or find a way to incoporate if league waiver system is FAAB */}
                        {transaction.waiver_budget.map((budget, idx) => (
                            <Typography key={idx} variant="body2">
                                {/* ${budget.amount} from Roster {budget.sender} to Roster {budget.receiver} */}
                            </Typography>
                        ))}
                    </Paper>
                )}
            </Grid>
        </Grid>
    );
};

// ===== DISPLAY TRADES COMPONENT =====
/**
 * Used to display trades
 * @param transaction - the transaction to show
 * @param teams - an array of teams involved with the trade, sleeper team objects
 */
const DisplayTrades = ({
    transaction,
    teams
}: {
    transaction: Transaction;
    teams: TeamInfo[] | undefined;
}) => {
    // ===== UTILITY FUNCTIONS =====
    const formatUnixTime = (time: string) => {
        const day = new Date(time);
        return day.toString().substring(4, 21);
    };

    // ===== STATE MANAGEMENT =====
    const [playerMap, setPlayerMap] = useState<Record<string, Player>>({});
    const [loading, setLoading] = useState<boolean>(true);

    // ===== DATA FETCHING =====
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

        if (transaction.adds || transaction.drops || transaction.draft_picks) {
            loadPlayerMap();
        } else {
            setLoading(false);
        }
    }, [transaction]);

    if (!teams) return;


    // ===== LOADING STATE =====
    if (loading) return <CircularProgress />;

    // ===== RENDER =====
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
                                .filter(([rosterId]) => Number(rosterId) === team.roster_id)
                                .map(([playerName]) => playerName)
                            : [];

                        const teamDrops = transaction.drops
                            ? Object.entries(transaction.drops)
                                .filter(([rosterId]) => Number(rosterId) === team.roster_id)
                                .map(([playerName]) => playerName)
                            : [];

                        const pickAdds: sleeper_draftPick[] = [];
                        const pickDrops: sleeper_draftPick[] = [];

                        transaction.draft_picks.map((pick) => {
                            if (pick.owner_id == team.roster_id)
                                pickAdds.push(pick);
                            else
                                pickDrops.push(pick);
                        });

                        return (
                            <TableRow key={team.roster_id} hover>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        {team.display_name}
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    {teamAdds.length > 0 || pickAdds.length > 0 ? (
                                        <Box>
                                            {teamAdds.map((playerName) => (
                                                <Box key={playerName} sx={{ display: 'block' }}>
                                                    {`${playerMap[playerName].first_name} ${playerMap[playerName].last_name}`}
                                                </Box>
                                            ))}
                                            {pickAdds.map((pick, index) => (
                                                <Box key={index} sx={{ display: 'block', mb: 0.5 }}>
                                                    {`${pick.season} Round ${pick.round}`}
                                                </Box>
                                            ))}
                                        </Box>
                                    ) : (
                                        <Typography variant="body2">
                                            —
                                        </Typography>
                                    )}
                                </TableCell>

                                <TableCell>
                                    {teamDrops.length > 0 || pickDrops.length > 0 ? (
                                        <Box>
                                            {teamDrops.map((playerName) => (
                                                <Box key={playerName} sx={{ display: 'block' }}>
                                                    {`${playerMap[playerName].first_name} ${playerMap[playerName].last_name}`}
                                                </Box>
                                            ))}
                                            {pickDrops.map((pick, index) => (
                                                <Box key={index} sx={{ display: 'block', mb: 0.5 }}>
                                                    {`${pick.season} Round ${pick.round}`}
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