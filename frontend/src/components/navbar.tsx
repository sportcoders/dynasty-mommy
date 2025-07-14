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
import { Menu, Person, Settings, Dashboard, Login, PersonAdd, Logout, Search, DarkMode, LightMode } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { logout } from '@feature/auth/authSlice';
import { Link, useLocation } from '@tanstack/react-router';


export default function NavBar({ drawerOpen, setDrawerOpen }: { drawerOpen: boolean, setDrawerOpen: (new_val: boolean) => void }) {
    const username = useAppSelector((state) => state.authReducer.username);
    const dispatch = useAppDispatch();
    const location = useLocation()

    const handleSignOut = () => {
        dispatch(logout());
    };
    const darkMode = false
    const drawerItems = [
        { text: 'Dashboard', icon: <Dashboard />, link: '' },
        { text: 'Find League', icon: <Search />, link: '/' },
        { text: 'Login', icon: <Person />, link: '/login' },
        { text: 'Settings', icon: <Settings />, link: '' },
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
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
                            color: '#1976d2',
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
                            color: "text.primary",

                        }}
                    >
                        <Link to='/' style={{ textDecoration: 'none' }}>
                            Dynasty Mommy
                        </Link>
                    </Typography>
                </Box>
                <List sx={{ px: '0.75rem' }}>
                    {drawerItems.map((item, index) => (
                        <ListItem key={index} sx={{
                            cursor: 'pointer',
                            backgroundColor: location.pathname == item.link ? 'rgba(67, 139, 212, 0.51)' : "transparent",
                            borderRadius: '16px',
                        }} component={Link} to={item.link}>
                            <ListItemIcon sx={{ color: '#1976d2' }}>
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
                    <ListItem sx={{
                        borderRadius: '16px',
                        cursor: 'pointer',
                    }}>
                        <ListItemIcon>{darkMode ? <LightMode /> : <DarkMode />}</ListItemIcon>
                        <ListItemText
                            primary="Change Mode"
                            sx={{
                                '& .MuiListItemText-primary': {
                                    fontWeight: 500,
                                }
                            }}
                        />

                    </ListItem>
                </List>
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
                        color: '#1976d2',
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
                    <>
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
                        <Button
                            component={Link}
                            to='/signup'
                            variant="contained"
                            startIcon={<PersonAdd />}
                            size="small"
                            sx={{
                                backgroundColor: '#1976d2',
                                fontWeight: 600,
                                textTransform: 'none',
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                                minWidth: '90px',
                                '&:hover': {
                                    backgroundColor: '#1565c0',
                                    boxShadow: '0 6px 16px rgba(25, 118, 210, 0.5)',
                                    transform: 'translateY(-1px)'
                                }
                            }}
                        >
                            Sign Up
                        </Button>
                    </>
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography
                            variant="body1"
                            sx={{
                                color: "text.primary",
                                fontWeight: 600,
                                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
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