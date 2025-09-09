// -------------------- Imports --------------------

import { Button, Stack, Typography } from "@mui/material";

import { useNavigate } from "@tanstack/react-router";
import { getLeagues, start_oauth, type YahooLeague } from "@services/api/yahoo";
import { useState } from "react";
import YahooLeaguesList from "./YahooLeaguesList";
import { useAppSelector } from "@app/hooks";

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

    const canShowLeagues = true;
    const [data, setData] = useState<YahooLeague[]>([]);
    //need to check if user is logged in, if user is logged in we can fetch leagues without requesting login to yahoo
    //can only fetch leagues if we have refresh token for user stored

    const handleRedirect = async () => {
        // Define URL parameters
        const data = await start_oauth();
        window.open(data.url);
    };
    const handleGetGames = async () => {
        const leagues = await getLeagues();
        setData(leagues);
    };
    // -------------------- Render --------------------
    return (
        <Stack
            spacing={4}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                width: "100%",
            }}
        >
            <Typography variant="h2" component="h1" color="primary">
                Yahoo League Search
            </Typography>
            <Button onClick={handleGetGames}>Get Leagues</Button>
            <Button onClick={handleRedirect}>Link Yahoo Account</Button>
            {data && <YahooLeaguesList leagues={data} />}
        </Stack>
    );
}
