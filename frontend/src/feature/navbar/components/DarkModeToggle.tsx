// -------------------- Imports --------------------
import {
    DarkMode,
    LightMode,
} from '@mui/icons-material';

import {
    ListItem,
    ListItemIcon,
    ListItemText,
    useColorScheme,
} from '@mui/material';

/**
 * A toggle component that allows users to switch between light and dark color modes.
 * Displays the appropriate icon based on the current mode and provides a click handler
 * to toggle between modes. Returns null if no color mode is available.
 * 
 * @component
 * @returns JSX element containing a clickable list item with mode toggle functionality, or null if mode is unavailable
 */
export const DarkModeToggle = () => {
    const { mode, setMode } = useColorScheme();

    if (!mode) return null;

    const toggleMode = () => {
        setMode(mode === 'light' ? 'dark' : 'light');
    };

    return (
        <ListItem sx={{
            borderRadius: '16px',
            cursor: 'pointer',
            color: 'primary.main',
        }}
            onClick={toggleMode}>
            <ListItemIcon>{mode == "dark" ? <LightMode /> : <DarkMode />}</ListItemIcon>
            <ListItemText
                primary="Change Mode"
                sx={{
                    '& .MuiListItemText-primary': {
                        fontWeight: 500,
                    }
                }}
            />

        </ListItem>
    );
};