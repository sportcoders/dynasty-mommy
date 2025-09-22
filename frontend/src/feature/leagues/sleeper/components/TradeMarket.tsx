import { Box, Button, CircularProgress, Container, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import useGetTradeMarket from "../hooks/trade_market/useGetTradeMarket";

export default function SleeperTradeMarket() {
    const [searchText, setSearchText] = useState("");
    const { data, loading, refetch } = useGetTradeMarket(searchText);

    if (loading)
        return <CircularProgress />;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        refetch();
    };
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%', gap: '8px' }}>
                    <TextField
                        label='Search For A Player'
                        sx={{ '& .MuiInputBase-root': { height: '56px' } }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        fullWidth
                    />

                    <Button variant="contained" sx={{ height: '56px', padding: '8px 16px' }} type="submit">
                        Search
                    </Button>
                </form>
            </Box>
            {data && data.length != 0 ?
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell>Trades</TableCell>
                            <TableCell>Receives</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.map((trade) => {
                            return (
                                <TableRow>
                                    {trade.trades.map((team) => {
                                        return (
                                            <TableCell>
                                                {team.map((players, index) => <Box key={`${trade._id} ${index}`} sx={{ display: 'block' }}>{players.first_name} {players.last_name}</Box>)}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                :
                <Typography variant="h5" color="text.primary" textAlign="center" sx={{ m: 6 }}>No Trades Found</Typography>
            }
        </Container >
    );
}