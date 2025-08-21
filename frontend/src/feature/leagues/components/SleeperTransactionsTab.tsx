import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Container, Card, CardHeader, Typography, IconButton, CardContent, Accordion, AccordionSummary, Box, Chip, AccordionDetails, Grid, List, ListItem, ListItemText, Paper, CircularProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { type TeamInfo, type Transaction, sleeper_getPlayer, type Player, type sleeper_draftPick } from "@services/sleeper";
import { useState, useEffect, type SyntheticEvent } from "react";
import useGetSleeperState from "../hooks/useGetSleeperState";
import useGetTransactionByWeek from "../hooks/useGetTransactionByWeek";
import { formatUnixTime } from "@utils/formatUnixTime";

export default function TransactionTab({ league_id, teams, league_season }: { league_id: string, league_season: string, teams: TeamInfo[]; }) {
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
/**
 * JSX component used the render each transaction week
 * used to allow toggle of each card per week
 * 
 * @param week - the week the transaction belongs to
 * @param league_id - the sleeper_id of the league we are viewing transactions for
 * @param teams - the array of teams(sleeper team objects) in the league
 * @param open - boolean to set the transaction card open by default
 * @returns 
 */
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
/**
 * Component used to fetch each weeks transactions
 * Used so only selected week(s) are fetched instead of all weeks
 * 
 * @param week - the week being displayed
 * @param league_id - sleeper league id for league
 * @param teams - array of team objects in sleeper league
 * @returns 
 */
const TransactionInWeekDisplay = ({ week, league_id, teams }: { week: string, league_id: string, teams: TeamInfo[]; }) => {
    //this is used for expanding each transaction
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
/**
 * Used to display free agent pickups/waiver wire pickups
 * @param transaction - the transaction object to show
 * @param team - the team associated with the transaciton
 * @returns 
 */
const DisplayAddDrop = ({ transaction, team }: { transaction: Transaction, team: TeamInfo | undefined; }) => {
    if (!team) return;

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
                {addsNames.map((player, index) => {
                    return <ListItem key={index}>
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
/**
 * Used to display trades
 * @param transaction - the transation to show
 * @param teams - an array of teams involved with the trade, sleeper team objects
 * @returns 
 */
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
        (!!transaction.adds || !!transaction.drops || !!transaction.draft_picks) ? loadPlayerMap() : setLoading(false);
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
                                            {teamAdds.map((playerName, index) => (
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
                                        <Typography variant="body2" >
                                            —
                                        </Typography>
                                    )}
                                </TableCell>

                                <TableCell>
                                    {teamDrops.length > 0 || pickDrops.length > 0 ? (
                                        <Box>
                                            {teamDrops.map((playerName, index) => (
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