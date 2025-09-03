import {
    Box,
    Button,
    CircularProgress,
    Collapse,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    useColorScheme,
} from '@mui/material';
import { Menu, Person, Login, Logout, Search, DarkMode, LightMode, SportsBasketball, ExpandMore, ExpandLess } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { logout } from '@feature/auth/authSlice';
import { Link, useLocation, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { DisplayLeaguesList } from '@components/DisplayLeaguesList';
import { useGetSavedLeaguesNavBar } from '@feature/navbar/hooks/useGetSavedLeaguesNavBar';
import { Route as LeagueRoute } from '@routes/leagues.$leagueId';
import useSleeperSearchParams from '@feature/search/sleeper/hooks/useSleeperSearchParams';


const MyLeaguesNestedList = ({ myLeaguesOpen }: { myLeaguesOpen: boolean; }) => {
    const { leagues, loading, error } = useGetSavedLeaguesNavBar();

    const router = useRouter();

    const handleNavigateToLeague = (id: string) => {
        router.navigate({
            to: LeagueRoute.to,
            params: { leagueId: id },
        });
    };

    if (!leagues || error) return null;

    return (
        <Collapse in={myLeaguesOpen} timeout="auto" unmountOnExit>
            <Box sx={{ ml: 5, }}>
                {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 50 }}>
                    <CircularProgress />
                </Box> :
                    <DisplayLeaguesList leagues={leagues}
                        onLeagueClick={handleNavigateToLeague}
                        displayAvatar={false}
                        loggedIn={true}
                        stylingOptions={{
                            background_color: 'transparent',
                            fontSize: '1rem',
                            fontWeight: '500',
                            padding: '0',
                            border_radius: '16px',
                            text_color: 'primary.main'
                        }}
                    />
                }
            </Box>
        </Collapse>
    );
};

const DarkModeToggle = () => {
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
export default function NavBar({ drawerOpen, setDrawerOpen }: { drawerOpen: boolean, setDrawerOpen: (new_val: boolean) => void; }) {
    const [myLeaguesOpen, setMyLeaguesOpen] = useState<boolean>(false);

    const { setParamsFalse } = useSleeperSearchParams();

    const username = useAppSelector((state) => state.authReducer.username);

    const dispatch = useAppDispatch();

    const location = useLocation();

    const handleFindLeagueClick = () => {
        setParamsFalse();
    };

    const handleSignOut = () => {
        dispatch(logout());
    };
    const drawerItems = [
        { text: 'Find League', icon: <Search />, link: '/', onClick: handleFindLeagueClick },
        // { text: 'Login', icon: <Person />, link: '/login' },
    ];

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };
    return (
        <>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer}
                variant='persistent'
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 250,
                        backdropFilter: 'blur(10px)',
                        borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                        pt: '0.5rem',
                        // pl: '0.75rem',
                    }
                }}
            >
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <Button
                        onClick={toggleDrawer}
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
                <Box sx={{ px: '0.75rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <List sx={{ flexGrow: 1 }}>
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
                        {username ?
                            <>
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

                                {myLeaguesOpen && <MyLeaguesNestedList myLeaguesOpen={myLeaguesOpen} />}
                            </> :
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
                    <Box sx={{ pb: 1 }}>
                        <DarkModeToggle />
                    </Box>
                </Box>
            </Drawer >

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
                    onClick={toggleDrawer}
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography
                            variant="body1"
                            sx={{
                                color: "primary.main",
                                fontWeight: 600,

                            }}
                        >
                            {username}
                        </Typography>
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