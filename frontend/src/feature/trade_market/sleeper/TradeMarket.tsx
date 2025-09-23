import { Box, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import useGetTradeMarket from "@app/feature/trade_market/hooks/useGetTradeMarket";
import { useRouter } from "@tanstack/react-router";

export default function SleeperTradeMarket({ searchText: initText }: { searchText?: string; }) {
    const [searchText, setSearchText] = useState(initText);
    const { data, loading, refetch } = useGetTradeMarket(searchText);
    const theme = useTheme();
    const router = useRouter();
    if (loading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.navigate({
            to: '/tradeMarket',
            search: {
                searchText: searchText
            }
        });
        refetch();
    };
    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h2" component="h1" color="primary" textAlign='center'>
                Trade Market
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', my: 4, px: 5 }}>
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
            <TableContainer
                sx={{
                    px: 5,
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    height: "80vh",
                    overflowY: "scroll",
                    scrollbarGutter: "stable",
                }}
            >
                {data && data.length != 0 ?
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Trades</TableCell>
                                <TableCell>Receives</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody sx={{ mb: 4 }}>
                            {data?.map((trade) => {
                                return (
                                    <TableRow>
                                        {trade.trades.map((team) => {
                                            return (
                                                <TableCell >
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
            </TableContainer>
        </Box>
    );
}