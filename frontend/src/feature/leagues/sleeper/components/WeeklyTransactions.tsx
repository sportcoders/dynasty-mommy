// -------------------- Imports -------------------
import { useState, type SyntheticEvent, useMemo } from "react";

import useGetTransactionByWeek from "@feature/leagues/sleeper/hooks/transactions/useGetTransactionByWeek";
import useGetPlayersInTransaction from "@feature/leagues/sleeper/hooks/players/useGetPlayersInTransaction";

import { ExpandMore } from "@mui/icons-material";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    CardContent,
    Checkbox,
    Chip,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Paper,
    Popover,
    Select,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

import { type SelectChangeEvent } from "@mui/material/Select";

import {
    type TeamInfo,
    type Transaction,
    type sleeper_draftPick,
} from "@services/sleeper";

import { formatUnixTime } from "@utils/formatUnixTime";

// -------------------- Components --------------------
/**
 * Used to display free agent pickups/waiver wire pickups
 * 
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
    const { players, loading } = useGetPlayersInTransaction(transaction);

    if (!team) return;

    if (loading || !players) return <CircularProgress />;

    return (
        <Box>
            <Grid sx={{ p: 2, pt: 0 }}>
                <List dense>

                    {!!transaction.adds && (
                        <ListItem>
                            <ListItemText primary="Adds" />
                        </ListItem>
                    )}

                    {!!transaction.adds && Object.keys(transaction.adds).map((key, index) => {
                        return (
                            <ListItem key={`${index}-add`}>
                                <ListItemText secondary={`${players[key].first_name} ${players[key].last_name}`} />
                            </ListItem>
                        );
                    })}

                    <ListItem>
                        {!!transaction.drops && (
                            <ListItemText
                                primary="Drops"
                            />
                        )}
                    </ListItem>
                    {!!transaction.drops && Object.keys(transaction.drops).map((key, index) => {
                        return (
                            <ListItem key={index}>
                                <ListItemText secondary={`${players[key].first_name} ${players[key].last_name}`} />
                            </ListItem>
                        );
                    })}
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
            <Box sx={{ p: 2, textAlign: 'right', borderTop: '1px solid', borderColor: 'divider' }}>
                {loading ?
                    <Skeleton key='completed-time' variant="text" height={20} sx={{ mb: 0.5 }} /> :
                    <Typography variant="caption" color="text.secondary">
                        Completed: {formatUnixTime(transaction.status_updated)}
                    </Typography>
                }
            </Box>
        </Box>
    );
};

/**
 * Used to display trades
 * 
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

    const { players: playerMap, loading, isEnabled } = useGetPlayersInTransaction(transaction);

    if (!teams) return;

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
                {(loading && isEnabled) ? <TransactionSkeleton /> :
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
                                                {!!playerMap && teamAdds.map((playerName) => (
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
                                                {!!playerMap && teamDrops.map((playerName) => (
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
                }
            </Table>

            <Box sx={{ p: 2, textAlign: 'right', borderTop: '1px solid', borderColor: 'divider' }}>
                {(loading && isEnabled) ?
                    <Skeleton key='adds-1' variant="text" width="100%" height={20} sx={{ mb: 0.5 }} /> :
                    <Typography variant="caption" color="text.secondary">
                        Completed: {formatUnixTime(transaction.status_updated)}
                    </Typography>
                }
            </Box>
        </TableContainer>
    );
};

/**
 * A skeleton loader component for displaying a list of transactions.
 * * This component renders a simplified, placeholder version of the transaction table
 * rows while the actual data is being fetched. It helps improve the user experience
 * by providing visual feedback that content is loading. The component displays
 * two placeholder rows with animated skeletons for team names, added players,
 * and dropped players.
 *
 * @returns A `TableBody` component containing multiple `TableRow` components with `Skeleton` loaders.
 */
const TransactionSkeleton = () => {
    return (
        <TableBody>
            {['team', 'team'].map((team, index) =>
                <TableRow key={`${team} ${index}`} hover>
                    <TableCell>
                        <Skeleton variant="text" width={120} height={28} />
                    </TableCell>

                    <TableCell>
                        <Box>
                            <Skeleton key='adds-1' variant="text" width="80%" height={20} sx={{ mb: 0.5 }} />
                        </Box>
                    </TableCell>

                    <TableCell>
                        <Box>
                            <Skeleton key='drops-1' variant="text" width="80%" height={20} sx={{ mb: 0.5 }} />
                        </Box>
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
    );
};

/**
 * A skeleton loader component that simulates a list of accordions.
 *
 * This component renders a series of placeholder boxes with a skeleton
 * animation to provide a visual loading state for a list of accordions.
 * It's useful for improving user experience while data is being fetched.
 *
 * @param props - The component's props.
 * @returns A `Box` component containing multiple skeleton placeholders.
 */
const AccordionSkeleton = ({ count = 5 }) => {
    return (
        <Box>
            {Array.from({ length: count }).map((_, index) => (
                <Box key={index} sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
                    <Skeleton variant="text" width='100%' height={30} />
                </Box>
            ))}
        </Box>
    );
};

// -------------------- Main Component --------------------
/**
 * Component used to fetch each weeks transactions
 * Used so only selected week(s) are fetched instead of all weeks
 * 
 * @param week - the week being displayed
 * @param league_id - sleeper league id for league
 * @param teams - array of team objects in sleeper league
 */
export const WeeklyTransactions = ({
    week,
    league_id,
    teams
}: {
    week: string;
    league_id: string;
    teams: TeamInfo[];
}) => {
    const [expanded, setExpanded] = useState<string | false>("");
    const [filterBy, setFilterBy] = useState('All');
    const [teamFilter, setTeamFilter] = useState<number[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const { data: transactions, loading } = useGetTransactionByWeek(league_id, Number(week));

    // -------------------- Util Functions --------------------
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

    // -------------------- Handlers --------------------
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

    if (loading) return <AccordionSkeleton />;

    return (
        <CardContent>
            {/* Filter Controls */}
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

