import {
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    IconButton,
    MenuItem,
    Select,
    Tab,
    Tabs,
    Tooltip,
    Typography,
    useTheme,
    type SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { getRouteApi, useCanGoBack, useNavigate, useRouter } from "@tanstack/react-router";

// Components
import BackButton from "@components/BackButton";


// Hooks
import { useNotification } from "@hooks/useNotification";
import { useAppSelector } from "@app/hooks";

// Types
import { useGetTeams } from "../hooks/useGetTeams";
import RosterTab from "./RosterTab";
import useSaveLeague from "../hooks/useSaveLeague";
import useGetSavedLeague from "@feature/leagues/yahoo/hooks/useGetSavedLeague";
import useDeleteLeague from "../hooks/useDeleteLeague";
import { ArrowBack } from "@mui/icons-material";
import { DisplayAvatar } from "@components/AvatarGetDisplay";

// Component Interfaces

interface TabPanelProps {
    children?: React.ReactNode;
    id: number;
    value: number;
}


// Utility Components
const CustomTabPanel = ({ children, value, id, ...other }: TabPanelProps) => (
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



// Main Component
export default function YahooLeague({
    league_key,
    tab,
}: { league_key: string, tab: number; }) {
    const theme = useTheme();

    const username = useAppSelector((state) => state.auth.username);
    const navigate = useNavigate({ from: `/leagues/$leagueId` });
    const canGoBack = useCanGoBack();
    const router = useRouter();
    // State
    const { data: league, loading, error, errorMessage } = useGetTeams(league_key);
    const { mutate: saveLeague, isPending: isSavingLeague } = useSaveLeague();
    const { mutate: removeLeague, isPending: isRemovingLeague } = useDeleteLeague();
    const { data: isSavedLeague } = useGetSavedLeague(league_key);

    // Data fetching hooks

    // User-specific data (only fetch if logged in)

    // Mutation hooks
    const handleSaveLeague = useCallback(() => {
        const league = {
            league_key: league_key,
        };
        saveLeague(league);
    }, [league_key, saveLeague]);
    const handleRemoveLeague = useCallback(() => {
        const league = {
            league_key: league_key,
        };
        removeLeague(league);
    }, [league_key, removeLeague]);

    // Event handlers


    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        navigate({
            search: (prev) => ({
                ...prev,
                tab: newValue,
            }),
            replace: true
        });
    };

    // Accessibility helper
    const a11yProps = useCallback((index: number) => ({
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }), []);


    // Loading state
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    // Error state
    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Typography variant="h6" color="text.primary" textAlign="center">
                    Oops! Failed to load league information.
                    <br />
                    {errorMessage?.message || "Please try again later."}
                </Typography>
            </Box>
        );
    }

    // No league data
    if (!league) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Typography variant="h6" color="text.primary" textAlign="center">
                    League not found.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
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
                {/* Header */}
                <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                    {/* Left side - League info */}
                    <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
                        {canGoBack ?
                            <Tooltip title="Go back">
                                <IconButton
                                    onClick={() => router.history.back()}
                                    sx={{
                                        mr: 2,
                                        '&:hover': {
                                            backgroundColor: 'action.hover',
                                        }
                                    }}>
                                    <ArrowBack />
                                </IconButton>
                            </Tooltip>
                            :
                            <BackButton url="/" />}
                        <DisplayAvatar avatar_url={league.logo_url} platform="yahoo" />

                        <Typography variant="h3" component="h1" color="text.primary">
                            {league.name}
                        </Typography>
                    </Box>

                    {/* Right side - Action buttons */}
                    {username && (
                        <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
                            {isSavedLeague == null ? (
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleSaveLeague}
                                    disabled={isSavingLeague}
                                >
                                    Add
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleRemoveLeague}
                                    disabled={isRemovingLeague}
                                >
                                    Remove
                                </Button>
                            )}
                        </Box>
                    )}
                </Box>


                {/* Rosters Tab */}
                <CustomTabPanel value={tab} id={0}>
                    <RosterTab league={league} loading={loading} error={error} />
                </CustomTabPanel>

                {/* Transactions Tab */}
                <CustomTabPanel value={tab} id={1}>

                    <Typography variant="h6" color="text.primary" textAlign="center">
                        Oops! Failed to load transactions.
                    </Typography>
                </CustomTabPanel>

                {/* Third Tab */}
                <CustomTabPanel value={tab} id={2}>
                    <Typography variant="h6" color="text.primary" textAlign="center">
                        Content for third tab coming soon...
                    </Typography>
                </CustomTabPanel>
            </Box>
        </Box >
    );
}