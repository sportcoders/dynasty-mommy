import { Container, Box, Paper, Typography, TextField, Button } from "@mui/material";

export default function SignUpForm() {
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

                    <Box component="form" noValidate>
                        <TextField
                            fullWidth
                            name="username"
                            label="Username"
                            type="text"
                            margin="normal"
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            name="email"
                            label="Email Address"
                            type="email"
                            margin="normal"
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            margin="normal"
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            margin="normal"
                            sx={{ mb: 3 }}
                        />

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
                        >
                            Create Account
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )
}