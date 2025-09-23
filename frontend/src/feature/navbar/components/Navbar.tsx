// -------------------- Imports --------------------
import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '@app/hooks';

import { logout } from '@feature/auth/authSlice';
import { DarkModeToggle } from '@feature/navbar/components/DarkModeToggle';
import { MyLeaguesList } from '@feature/navbar/components/MyLeaguesList';
import { resetSearch } from "@feature/search/sleeper/sleeperSearchSlice";

import {
    ExpandMore,
    ExpandLess,
    Login,
    Logout,
    Menu,
    Person,
    Search,
    SportsBasketball,
    SwapHoriz
} from '@mui/icons-material';

import {
    Box,
    Button,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';

import { Link, useLocation, useRouter } from '@tanstack/react-router';
import { logoutUser } from '@services/api/user';

/**
 * Navigation bar component with collapsible drawer and user authentication features.
 * Provides navigation to different sections of the application, user login/logout functionality,
 * and a collapsible "My Leagues" section for authenticated users.
 * 
 * @component
 * @param props - The component props
 * @param props.drawerOpen - Controls whether the navigation drawer is open or closed
 * @param props.setDrawerOpen - Callback function to update the drawer open state
 * @returns JSX element containing the navigation drawer and fixed header buttons
 */
export default function NavBar({ drawerOpen, setDrawerOpen }: { drawerOpen: boolean, setDrawerOpen: (newVal: boolean) => void; }) {
    const router = useRouter();

    const [myLeaguesOpen, setMyLeaguesOpen] = useState<boolean>(false);

    const username = useAppSelector((state) => state.auth.username);

    const dispatch = useAppDispatch();

    const location = useLocation();

    // -------------------- Handlers --------------------
    const handleFindLeagueClick = () => {
        dispatch(resetSearch());

        router.navigate({
            to: "/",
            search: {
                searchText: "",
                searchType: "Username",
                season: "2025",
                submit: false,

            },
        });
    };

    const handleSignOut = async () => {
        await logoutUser();
        dispatch(logout());
    };

    const handleToggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    // -------------------- Navigation Configuration --------------------
    const drawerItems = [
        { text: 'Find League', icon: <Search />, link: '/', onClick: handleFindLeagueClick },
        { text: 'Trade Market', icon: <SwapHoriz />, link: '/tradeMarket', onClick: () => { } },
    ];

    return (
        <>
            {/* Navigation Drawer */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={handleToggleDrawer}
                variant='persistent'
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 250,
                        backdropFilter: 'blur(10px)',
                        borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                        pt: '0.5rem',
                    }
                }}
            >
                {/* Drawer Header - Menu Toggle & App Title */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <Button
                        onClick={handleToggleDrawer}
                        sx={{
                            minWidth: 'auto',
                            color: 'primary',
                            '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.08)'
                            },

                        }}
                    >
                        <Menu />
                    </Button>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,

                        }}
                        color="primary"
                    >
                        <Link to='/' style={{ textDecoration: 'none', color: 'inherit' }}>
                            Dynasty Mommy
                        </Link>
                    </Typography>
                </Box>

                {/* Drawer Content Container */}
                <Box sx={{ px: '0.75rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {/* Main Navigation List */}
                    <List sx={{ flexGrow: 1 }}>
                        {/* Static Navigation Items */}
                        {drawerItems.map((item, index) => (
                            <ListItem key={index}
                                sx={{
                                    cursor: 'pointer',
                                    color: 'primary.main',
                                    backgroundColor: location.pathname == item.link ? 'rgba(67, 139, 212, 0.51)' : "transparent",
                                    borderRadius: '16px',
                                }}
                                component={Link} to={item.link}
                                onClick={item.onClick}
                            >
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    sx={{
                                        '& .MuiListItemText-primary': {
                                            fontWeight: 500,
                                        }
                                    }}
                                />
                            </ListItem>
                        ))}

                        {/* Authentication-Based Navigation */}
                        {username ?
                            /* Authenticated User Section */
                            <>
                                {/* My Leagues Expandable Section */}
                                <ListItem component={Button} onClick={() => setMyLeaguesOpen(!myLeaguesOpen)} sx={{
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    color: 'primary.main',

                                }}>
                                    <ListItemIcon>
                                        <SportsBasketball />
                                    </ListItemIcon>
                                    <ListItemText primary="My Leagues" sx={{
                                        '& .MuiListItemText-primary': {
                                            fontWeight: 500,
                                        }
                                    }} />
                                    {myLeaguesOpen ? <ExpandLess /> : <ExpandMore />}

                                </ListItem>

                                {/* Collapsible My Leagues List */}
                                {myLeaguesOpen && <MyLeaguesList myLeaguesOpen={myLeaguesOpen} />}
                            </> :
                            /* Unauthenticated User Section - Login Link */
                            <ListItem sx={{
                                cursor: 'pointer',
                                color: 'primary.main',
                                backgroundColor: location.pathname == '/login' ? 'rgba(67, 139, 212, 0.51)' : "transparent",
                                borderRadius: '16px',
                            }} component={Link} to={'/login'}>
                                <ListItemIcon>
                                    <Person />
                                </ListItemIcon>
                                <ListItemText
                                    primary='Login'
                                    sx={{
                                        '& .MuiListItemText-primary': {
                                            fontWeight: 500,
                                        }
                                    }}
                                />
                            </ListItem>
                        }
                    </List>

                    {/* Drawer Footer - Dark Mode Toggle */}
                    <Box sx={{ pb: 1 }}>
                        <DarkModeToggle />
                    </Box>
                </Box>
            </Drawer >

            {/* Fixed Header Elements */}

            {/* Fixed Menu Button - Top Left */}
            <Box sx={{
                position: 'fixed',
                top: '0.75rem',
                left: '0.75rem',
                zIndex: 1000,
                display: 'flex',
                p: 0,
                alignItems: 'center',
                gap: 2,
            }}>
                <Button
                    onClick={handleToggleDrawer}
                    sx={{
                        p: 0,
                        minWidth: 'auto',
                        color: 'primary',
                        '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.08)'
                        }
                    }}
                >
                    <Menu />
                </Button>
            </Box>

            {/* Fixed Authentication Section - Top Right */}
            <Box sx={{
                position: 'fixed',
                top: '0.75rem',
                right: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                zIndex: 1000,
            }}>
                {!username ? (
                    /* Unauthenticated State - Sign In Button */
                    <Button
                        component={Link}
                        to='/login'
                        variant="outlined"
                        startIcon={<Login />}
                        size="small"
                        sx={{
                            color: '#1976d2',
                            borderColor: '#1976d2',
                            textTransform: 'none',
                            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
                            minWidth: '90px',
                            '&:hover': {
                                borderColor: '#1565c0',
                                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                transform: 'translateY(-1px)'
                            }
                        }}
                    >
                        Sign In
                    </Button>
                ) : (
                    /* Authenticated State - Username Display & Logout Button */
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {/* Username Display */}
                        <Typography
                            variant="body1"
                            sx={{
                                color: "primary.main",
                                fontWeight: 600,

                            }}
                        >
                            {username}
                        </Typography>

                        {/* Logout Button */}
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Logout />}
                            onClick={handleSignOut}
                            sx={{
                                color: '#d32f2f',
                                borderColor: '#d32f2f',
                                fontWeight: 600,
                                textTransform: 'none',
                                boxShadow: '0 2px 8px rgba(211, 47, 47, 0.2)',
                                '&:hover': {
                                    borderColor: '#c62828',
                                    backgroundColor: 'rgba(211, 47, 47, 0.08)',
                                    boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
                                    transform: 'translateY(-1px)'
                                }
                            }}
                        >
                            Logout
                        </Button>
                    </Box>
                )}
            </Box>
        </>
    );
}

