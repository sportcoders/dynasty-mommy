import { Container, Box, Paper, Typography, TextField, Button } from "@mui/material";
import { Link } from '@tanstack/react-router'
import useLoginForm from "../hooks/useLoginForm";

export default function LoginForm() {
    const { email, password, handleEmailChange, setPassword, handleSubmit, emailError, error } = useLoginForm()
    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 4
                }}
            >
                <Paper
                    elevation={8}
                    sx={{
                        p: 4,
                        width: '100%',
                        maxWidth: 400,
                        borderRadius: 3
                    }}
                >
                    <Box sx={{ textAlign: 'center', mb: 1 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Sign In
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Enter your credentials to access your account
                        </Typography>
                    </Box>

                    <Box >
                        <TextField
                            fullWidth
                            color="primary"
                            name="email"
                            label="Email Address"
                            type="email"
                            margin="normal"
                            error={emailError !== ""}
                            helperText={emailError !== "" && emailError}
                            sx={{ mb: emailError ? 1 : 2 }}
                            value={email}
                            onChange={handleEmailChange}
                        />

                        <TextField
                            fullWidth
                            color="primary"
                            name="password"
                            label="Password"
                            type="password"
                            margin="normal"
                            sx={{ mb: error ? 1 : 3 }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && <Typography sx={{ mb: 2 }} variant="body2" color="error">{error}</Typography>}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{
                                py: 1.5,
                                textTransform: 'none',
                                fontSize: '1.1rem'
                            }}
                            onClick={handleSubmit}
                        >
                            <Typography variant="button" color="primary.contrastText">Sign In</Typography>
                        </Button>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2">
                            Don't Have An Account?{' '}
                            <Typography component={Link} to='/signup' sx={{ textDecoration: "none" }} variant="body2">
                                Sign Up
                            </Typography>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )
}