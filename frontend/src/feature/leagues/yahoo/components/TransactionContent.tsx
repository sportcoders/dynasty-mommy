// -------------------- Imports -------------------
import {
    Box,
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";


import { formatUnixTime } from "@utils/formatUnixTime";
import { type YahooTransaction, type YahooTransactionPlayer } from "@services/api/yahoo";

// -------------------- Components --------------------
/**
 * Used to display free agent pickups/waiver wire pickups
 * 
 * @param transaction - the transaction object to show
 */
//trnasaction.type has to be "add/drop"
export const DisplayAddDrop = ({
    transaction,
}: {
    transaction: YahooTransaction;
}) => {

    const transactions = transaction.players.player;
    const adds = transactions.filter((player) => player.transaction_data.type == "add");
    const drops = transactions.filter((player) => player.transaction_data.type == "drop");
    return (
        <Box>
            <Grid sx={{ p: 2, pt: 0 }}>
                <List dense>

                    {adds.length != 0 && (
                        <ListItem>
                            <ListItemText primary="Adds" />
                        </ListItem>
                    )}

                    {adds.length != 0 && adds.map((player, index) => {
                        return (
                            <ListItem key={`${index}-add`}>
                                <ListItemText secondary={`${player.name.first} ${player.name.last}`} />
                            </ListItem>
                        );
                    })}

                    <ListItem>
                        {drops.length != 0 && (
                            <ListItemText
                                primary="Drops"
                            />
                        )}
                    </ListItem>
                    {drops.length != 0 && drops.map((player, index) => {
                        return (
                            <ListItem key={index}>
                                <ListItemText secondary={`${player.name.first} ${player.name.last}`} />
                            </ListItem>
                        );
                    })}
                </List>
            </Grid>


            <Box sx={{ p: 2, textAlign: 'right', borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary">
                    Completed: {formatUnixTime(transaction.timestamp)}
                </Typography>
            </Box>
        </Box>
    );
};

/**
 * Used to display trades
 * 
 * @param transaction - the transaction to show
 */
type TradeDisplayTeam = {
    name: string;
    adds: YahooTransactionPlayer[];
    drops: YahooTransactionPlayer[];
};
export const DisplayTrades = ({
    transaction,
}: {
    transaction: YahooTransaction;
}) => {

    const teams: Record<string, TradeDisplayTeam> = {};

    for (const player of transaction.players.player) {
        if (teams[player.transaction_data.destination_team_key])
            teams[player.transaction_data.destination_team_key].adds.push(player);
        else
            teams[player.transaction_data.destination_team_key] = {
                name: player.transaction_data.destination_team_name,
                adds: [player],
                drops: []
            };
        if (teams[player.transaction_data.source_team_key])
            teams[player.transaction_data.source_team_key].adds.push(player);
        else
            teams[player.transaction_data.source_team_key] = {
                name: player.transaction_data.source_team_name,
                adds: [player],
                drops: []
            };
    }


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
                    {Object.values(teams).map((team) => {
                        return (
                            <TableRow key={team.name} hover>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        {team.name}
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    {team.adds.length != 0 ? (
                                        <Box>
                                            {team.adds.map((player) => (
                                                <Box key={`${player.player_id} ${team.name}`} sx={{ display: 'block' }}>
                                                    {`${player.name.first} ${player.name.last}`}
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
                                    {team.drops.length > 0 ? (
                                        <Box>
                                            {team.drops.map((player) => (
                                                <Box key={`${player.player_id} ${team.name}`} sx={{ display: 'block' }}>
                                                    {`${player.name.first} ${player.name.last}`}
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
                <Skeleton key='adds-1' variant="text" width="100%" height={20} sx={{ mb: 0.5 }} /> :
                <Typography variant="caption" color="text.secondary">
                    Completed: {formatUnixTime(transaction.timestamp)}
                </Typography>
            </Box>
        </TableContainer>
    );
};