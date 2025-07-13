import {
    Box,
    Button,
    Typography,
} from '@mui/material';
import { Login, PersonAdd, Logout } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { logout } from '@feature/auth/authSlice';
import { Link } from '@tanstack/react-router';

export default function AuthSection() {
    const username = useAppSelector((state) => state.authReducer.username)
    const dispatch = useAppDispatch()

    const handleSignOut = () => {
        dispatch(logout())
    }

    return (
        <>
            <Box sx={{
                position: 'fixed',
                top: 16,
                left: 16,
                zIndex: 1000,

            }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    <Link to='/' >
                        Dynasty Mommy
                    </Link>
                </Typography>
            </Box>
            <Box sx={{
                position: 'fixed',
                top: 16,
                right: 16,
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
};