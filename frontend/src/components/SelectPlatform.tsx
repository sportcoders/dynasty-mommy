import { Box, Button } from "@mui/material";
import type { SupportedFantasyPlatform } from "@routes/index";
import { useNavigate } from "@tanstack/react-router";

export default function SelectPlatform({ platform }: { platform: SupportedFantasyPlatform; }) {
    const navigate = useNavigate({ from: '/' });
    const setPlatform = (new_platform: SupportedFantasyPlatform) => {
        navigate({
            to: '/',
            search: (prev) => ({
                ...prev,
                platform: new_platform
            })
        });
    };
    return (
        <Box sx={{
            display: 'flex',
            gap: 1,
            p: 0.5,
            bgcolor: 'action.hover',
            borderRadius: 2,
            border: 'none',
            boxShadow: 'none',
            background: 'grey'
        }}>
            <Button
                variant="text"
                onClick={() => setPlatform('sleeper')}
                sx={{
                    bgcolor: platform === 'sleeper' ? '#5f5396d1' : 'transparent',
                    color: platform === 'sleeper' ? '#00d4aa' : 'text.secondary',
                    border: platform === 'sleeper' ? '1px solid rgba(0, 212, 170, 0.3)' : 'none',
                    '&:hover': {
                        bgcolor: '#5f5396',
                        color: '#00d4aa',
                    },
                    textTransform: 'none',
                    fontWeight: platform === 'sleeper' ? 600 : 400,
                    minWidth: 70,
                    px: 2,
                    py: 1,
                    borderRadius: 1.5,
                    transition: 'all 0.2s ease'
                }}
            >
                <img src="/SleeperWhite.svg" />
            </Button>

            <Button
                variant="text"
                onClick={() => setPlatform('espn')}
                sx={{
                    bgcolor: platform === 'espn' ? 'rgba(204, 0, 0, 0.8)' : 'transparent',
                    color: platform === 'espn' ? '#cc0000' : 'text.secondary',
                    border: platform === 'espn' ? '1px solid rgba(204, 0, 0, 0.3)' : 'none',
                    '&:hover': {
                        bgcolor: 'rgba(204, 0, 0, 1)',
                        color: '#cc0000',
                    },
                    textTransform: 'none',
                    fontWeight: platform === 'espn' ? 600 : 400,
                    fontFamily: 'monospace',
                    minWidth: 70,
                    px: 2,
                    py: 1,
                    borderRadius: 1.5,
                    transition: 'all 0.2s ease'
                }}
            >
                <img src="/ESPNWhite.svg" />
            </Button>

            <Button
                variant="text"
                onClick={() => setPlatform('yahoo')}
                sx={{
                    bgcolor: platform === 'yahoo' ? 'rgba(123, 0, 153, 0.8)' : 'transparent',
                    color: platform === 'yahoo' ? '#7b0099' : 'text.secondary',
                    border: platform === 'yahoo' ? '1px solid rgba(123, 0, 153, 0.3)' : 'none',
                    '&:hover': {
                        bgcolor: 'rgba(123, 0, 153, 1)',
                        color: '#7b0099',
                    },
                    textTransform: 'none',
                    fontWeight: platform === 'yahoo' ? 600 : 400,
                    minWidth: 70,
                    px: 2,
                    py: 1,
                    borderRadius: 1.5,
                    transition: 'all 0.2s ease'
                }}
            >
                <img src="/YahooWhite.svg" />
            </Button>
        </Box>
    );
}