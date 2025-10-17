import { useAppSelector } from "@app/hooks";
import SelectPlatform from "@components/SelectPlatform";
import { Stack, Typography, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import EspnCookieInstructions from "./EspnCookieInstructions";
import { useState } from "react";
import useEspnSyncStatus from "@feature/search/espn/hooks/useEspnSyncStatus";
import EspnLeagueForm from "./EspnLeagueForm";

export default function EspnLeagueSearch() {
    const navigate = useNavigate();
    const username = useAppSelector((state) => state.auth.username);
    const [openInstructions, setOpenInstructions] = useState<boolean>(false);
    const handleOpen = () => setOpenInstructions(true);
    const handleClose = () => setOpenInstructions(false);
    const { status, loading, error } = useEspnSyncStatus();

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
                ESPN League Search
            </Typography>

            <SelectPlatform platform="espn" />

            {!username ? (<Button
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
            </Button>) : (
                <>
                    {loading && <CircularProgress color="primary" />}

                    {error && (
                        <Typography variant="body2" color="error">
                            Failed to load ESPN sync status. Please try again.
                        </Typography>
                    )}

                    {!loading && !error && (
                        status ? (
                            <EspnLeagueForm />
                        ) : (
                            <Button
                                onClick={handleOpen}
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
                                Find ESPN Leagues With Extension
                            </Button>
                        )
                    )}

                    <EspnCookieInstructions handleClose={handleClose} open={openInstructions} />
                </>)
            }
        </Stack >
    );
}