import { Container, Box, Paper, Typography, TextField, Button, Link } from "@mui/material";
import useLoginForm from "../hooks/useLoginForm";

interface LoginFormProps {
    changeToSignUp: () => void
}
export default function LoginForm({ changeToSignUp }: LoginFormProps) {
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
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Sign In
                        </Typography>
                        {/* <Typography variant="body2" color="text.secondary">
                            Enter your credentials to access your account
                        </Typography> */}
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
                            <Link component='span' color="primary" variant="body2" underline='hover' sx={{ cursor: "pointer" }} onClick={changeToSignUp}>
                                Sign Up
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )
}