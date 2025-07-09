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
                    <Box sx={{ textAlign: 'center', mb: 1 }}>
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
                            error={usernameError !== ""}
                            helperText={usernameError !== "" && usernameError}
                            sx={{ mb: usernameError ? 1 : 2 }}
                            value={username}
                            onChange={handleUsernameChange}
                        />
                        <TextField
                            fullWidth
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
                            name="password"
                            label="Password"
                            type="password"
                            margin="normal"
                            error={passwordError !== ""}
                            helperText={passwordError !== "" && passwordError}
                            sx={{ mb: passwordError ? 1 : 2 }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            margin="normal"
                            error={passwordError !== ""}
                            helperText={passwordError !== "" && passwordError}
                            sx={{ mb: error ? 1 : 3 }}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {error && <Typography color="error" variant="body2" sx={{ mb: 2 }}>{error}</Typography>}
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
                            <Typography variant="button" color="primary.contrastText">Create Account</Typography>
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )
}