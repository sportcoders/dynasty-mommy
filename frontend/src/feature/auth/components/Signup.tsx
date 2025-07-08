import { Container, Box, Paper, Typography, TextField, Button } from "@mui/material";
import { useSignUpFrom } from "../hooks/useSignUpForm";

export default function SignUpForm() {
    const { username, email, password, confirmPassword, setPassword, setConfirmPassword, error, emailError, passwordError, usernameError, handleUsernameChange, handleEmailChange, handleSubmit } = useSignUpFrom()
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
                            Sign Up
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Create your account and track your teams
                        </Typography>
                    </Box>

                    <Box>
                        <TextField
                            fullWidth
                            name="username"
                            label="Username"
                            type="text"
                            margin="normal"
                            sx={{ mb: usernameError ? 1 : 2 }}
                            value={username}
                            onChange={handleUsernameChange}
                        />
                        {usernameError && <Typography variant="body2" color="red" sx={{ mb: 1 }}>{usernameError}</Typography>}

                        <TextField
                            fullWidth
                            name="email"
                            label="Email Address"
                            type="email"
                            margin="normal"
                            sx={{ mb: emailError ? 1 : 2 }}
                            value={email}
                            onChange={handleEmailChange}
                        />
                        {emailError && <Typography color="red" variant="body2" sx={{ mb: 1 }}>{emailError}</Typography>}
                        <TextField
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            margin="normal"
                            sx={{ mb: passwordError ? 1 : 2 }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {passwordError && <Typography color='red' variant="body2" sx={{ mb: 1 }}>{passwordError}</Typography>}
                        <TextField
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            margin="normal"
                            sx={{ mb: error ? 1 : 3 }}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {error && <Typography color="red" variant="body2" sx={{ mb: 2 }}>{error}</Typography>}
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
                            Create Account
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )
}