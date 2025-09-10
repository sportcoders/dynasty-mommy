// -------------------- Imports --------------------

import { Box, Button, Stack, Typography } from "@mui/material";

import { useNavigate } from "@tanstack/react-router";
import { getLeagues, start_oauth, type YahooLeague } from "@services/api/yahoo";
import { useState } from "react";
import YahooLeaguesList from "./YahooLeaguesList";
import { useAppSelector } from "@app/hooks";
import { useGetLeagues } from "../hooks/useGetLeagues";

/**
 * Top-level component that manages the Yahoo Search feature.
 *
 * It allows users to view their Yahoo Leagues after authenticating with Yahoo
 *
 * @returns The rendered Yahoo Search interface.
 */
export default function YahooLeagueSearch() {
    const navigate = useNavigate();
    const username = useAppSelector((state) => state.auth.username);

    const { data, loading, error } = useGetLeagues(!!username);
    //need to check if user is logged in, if user is logged in we can fetch leagues without requesting login to yahoo
    //can only fetch leagues if we have refresh token for user stored
    console.log(!data);
    const handleRedirect = async () => {
        // Define URL parameters
        const data = await start_oauth();
        window.open(data.url);
    };
    // -------------------- Render --------------------
    return (
        <Stack
            spacing={4}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "90vh",
                width: "100%",
            }}
        >
            <Typography variant="h2" component="h1" color="primary">
                Yahoo League Search
            </Typography>

            {(data && !(typeof data == "string")) && <>
                <Box
                    sx={{
                        width: '60%',
                        maxWidth: 900,
                        mt: 2,
                        animation: 'fadeInUp 0.6s ease-out',
                        '@keyframes fadeInUp': {
                            from: {
                                opacity: 0,
                                transform: 'translateY(30px)',
                            },
                            to: {
                                opacity: 1,
                                transform: 'translateY(0)',
                            },
                        },
                    }}
                >
                    <YahooLeaguesList leagues={data} />
                </Box>
                <Button
                    onClick={() => { }}
                    variant="outlined"
                    color="error"
                    size="medium"
                    sx={{
                        mt: 2,
                        px: 3,
                        py: 1,
                        borderRadius: 3,
                        textTransform: 'none',
                        '&:hover': {
                            transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                >
                    Remove Linked Account
                </Button>
            </>}

            {(!data || (typeof data == "string")) && <Button
                onClick={handleRedirect}
                variant="contained"
                size="large"
                sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: 3,
                    textTransform: 'none',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                Link Yahoo Account
            </Button>}
            {!username && <Button
                onClick={() => navigate({ to: '/login' })}
                variant="contained"
                size="large"
                sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: 3,
                    textTransform: 'none',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                Sign In To View Linked Account
            </Button>}
        </Stack>
    );
}
