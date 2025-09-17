import {
    Box,
    Modal,
    Typography,
    Button,
    Tabs,
    Tab,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    TextField,
    Divider,
} from "@mui/material";
import { useState } from "react";
import ExtensionIcon from '@mui/icons-material/Extension';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const modalDefaultProps = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxHeight: '85vh',
    bgcolor: 'background.paper',
    overflow: 'auto',
    boxShadow: 24,
    borderRadius: 2,
};
function TabPanel({ children, value, index }: TabPanelProps) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`cookie-tabpanel-${index}`}
            aria-labelledby={`cookie-tab-${index}`}
        >
            {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
        </div>
    );
}

export default function EspnCookieInstructions({
    open,
    handleClose
}: {
    open: boolean;
    handleClose: () => void;
}) {
    const [tabValue, setTabValue] = useState(0);
    const [instructionsOpen, setInstructionsOpen] = useState(false);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                ...modalDefaultProps,
                width: { xs: '90%', sm: 600 },
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 3,
                    pb: 1
                }}>
                    <Typography variant="h5" component="h2" fontWeight="bold">
                        ESPN Cookie Setup
                    </Typography>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box sx={{ px: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Choose your preferred method to connect your ESPN account
                    </Typography>

                    <Paper elevation={0} sx={{ bgcolor: 'grey.50' }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            variant="fullWidth"
                            sx={{ borderBottom: 1, borderColor: 'divider' }}
                        >
                            <Tab
                                icon={<ExtensionIcon />}
                                label="Chrome Extension"
                                id="cookie-tab-0"
                                iconPosition="start"
                                sx={{ textTransform: 'none' }}
                            />
                            <Tab
                                icon={<EditIcon />}
                                label="Manual Entry"
                                id="cookie-tab-1"
                                iconPosition="start"
                                sx={{ textTransform: 'none' }}
                            />
                        </Tabs>

                        <TabPanel value={tabValue} index={0}>
                            <ChromeExtensionTab />
                        </TabPanel>

                        <TabPanel value={tabValue} index={1}>
                            <CookieInputTab openInstructions={() => setInstructionsOpen(true)} />
                        </TabPanel>
                    </Paper>
                </Box>
                <EspnManualCookieInstructions open={instructionsOpen} close={() => setInstructionsOpen(false)} />
            </Box>
        </Modal>
    );
}

function ChromeExtensionTab() {
    return (
        <Box sx={{ p: 3 }}>
            <List sx={{ mb: 3 }}>
                <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                        <Typography variant="body2" fontWeight="bold" color="primary">1.</Typography>
                    </ListItemIcon>
                    <ListItemText
                        primary="Install the Chrome extension"
                        secondary="Click the button below to add our extension from the Chrome Web Store"
                    />
                </ListItem>
                <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                        <Typography variant="body2" fontWeight="bold" color="primary">2.</Typography>
                    </ListItemIcon>
                    <ListItemText
                        primary="Log in to ESPN"
                        secondary="Visit ESPN.com and sign in to your account"
                    />
                </ListItem>
                <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                        <Typography variant="body2" fontWeight="bold" color="primary">3.</Typography>
                    </ListItemIcon>
                    <ListItemText
                        primary="Automatic sync"
                        secondary="The extension will automatically detect and sync your ESPN cookies"
                    />
                </ListItem>
            </List>

            <Button
                variant="contained"
                size="large"
                startIcon={<ExtensionIcon />}
                fullWidth
                sx={{ mb: 2 }}
            >
                Install Chrome Extension
            </Button>
            <Typography variant="caption" color="text.secondary" align="center" display="block">
                Extension will open in a new tab
            </Typography>
        </Box>
    );
}
function CookieInputTab({ openInstructions }: { openInstructions: () => void; }) {
    return (
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
            <Typography variant="h6" gutterBottom>
                Manual Cookie Entry
            </Typography>

            <Button
                variant="outlined"
                size="small"
                sx={{ mb: 3 }}
                onClick={openInstructions}
            >
                View Instructions
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', gap: 2 }} >
                <TextField
                    label="ESPN_s2 Cookie"
                    placeholder="ESPN_s2 Cookie"
                    sx={{ mb: 3 }}
                    helperText="Paste your ESPN_s2 cookie"
                />
                <TextField
                    label="ESPN SWID"
                    placeholder="SWID Cookie"
                    sx={{ mb: 3 }}
                    helperText="Paste your SWID Cookie cookie"
                />
            </Box>
            <Button
                variant="contained"
                size="large"
                fullWidth
            >
                Save Cookies
            </Button>
        </Box>
    );
}
function EspnManualCookieInstructions({ open, close }: { open: boolean, close: () => void; }) {
    return (
        <Modal open={open} onClose={close}>
            <Box sx={{
                ...modalDefaultProps,
                width: { xs: '90%', sm: 500 },
                p: 4
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 3
                }}>
                    <Typography variant="h6" component="h3" fontWeight="bold">
                        How to Get ESPN Cookies
                    </Typography>
                    <IconButton onClick={close} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <List sx={{ bgcolor: 'grey.50', borderRadius: 1, p: 0 }}>
                    <ListItem sx={{ py: 2 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <Box sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.875rem',
                                fontWeight: 'bold'
                            }}>
                                1
                            </Box>
                        </ListItemIcon>
                        <ListItemText
                            primary="Open ESPN.com in Chrome"
                            secondary="Navigate to ESPN.com and log in to your account"
                        />
                    </ListItem>
                    <Divider />
                    <ListItem sx={{ py: 2 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <Box sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.875rem',
                                fontWeight: 'bold'
                            }}>
                                2
                            </Box>
                        </ListItemIcon>
                        <ListItemText
                            primary="Open Developer Tools"
                            secondary="Press F12 or right-click and select 'Inspect Element'"
                        />
                    </ListItem>
                    <Divider />
                    <ListItem sx={{ py: 2 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <Box sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.875rem',
                                fontWeight: 'bold'
                            }}>
                                3
                            </Box>
                        </ListItemIcon>
                        <ListItemText
                            primary="Navigate to Application tab"
                            secondary="Go to Application > Storage > Cookies > https://espn.com"
                        />
                    </ListItem>
                    <Divider />
                    <ListItem sx={{ py: 2 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <Box sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.875rem',
                                fontWeight: 'bold'
                            }}>
                                4
                            </Box>
                        </ListItemIcon>
                        <ListItemText
                            primary="Copy cookie values"
                            secondary="Find and copy the required cookie values (espn_s2, SWID, etc.)"
                        />
                    </ListItem>
                </List>

                <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                    <Typography variant="body2" color="info.dark">
                        <strong>Tip:</strong> Look for cookies named "espn_s2" and "SWID" - these are typically the most important ones for authentication.
                    </Typography>
                </Box>
            </Box>
        </Modal>
    );
}