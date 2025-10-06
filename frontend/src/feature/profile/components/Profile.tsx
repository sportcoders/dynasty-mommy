import { Email, Person, Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, TextField, InputAdornment, Container, Alert, Avatar, Box, Button, Divider, Paper, Typography } from "@mui/material";
import { email } from "zod";
import { useGetProfile } from "../hooks/useGetProfile";
import { useState } from "react";

export default function Profile() {
    const { data } = useGetProfile();

    const [username, setUsername] = useState(data?.username);
    const [email, setEmail] = useState(data?.email);
    if (!data) return <Typography alignSelf='center' justifySelf='center'>User Not Found</Typography>;
    return (
        <Box sx={{ height: '100vh', overflowY: 'auto' }}>
            <Container sx={{ py: 4 }} maxWidth="md">
                <Paper elevation={3} sx={{ p: 4 }} >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', mr: 2 }}>
                            <Person sx={{ fontSize: 50 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" component="h1">
                                Profile Settings
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Manage your account information
                            </Typography>
                        </Box>
                    </Box>

                    {/* {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )} */}

                    {/* Username Section */}
                    <Box component="form" sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Person sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="h6">Username</Typography>
                        </Box>
                        <TextField
                            fullWidth
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            sx={{ mb: 2 }}
                        />
                        <Button variant="contained" type="submit">
                            Change Username
                        </Button>
                    </Box>

                    <Divider sx={{ my: 4 }} />

                    {/* Email Section */}
                    <Box component="form" sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Email sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="h6">Email Address</Typography>
                        </Box>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            sx={{ mb: 2 }}
                        />
                        <Button variant="contained" type="submit">
                            Update Email
                        </Button>
                    </Box>

                    <Divider sx={{ my: 4 }} />

                    {/* Password Section */}
                    <Box component="form" >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            {/* <Lock sx={{ mr: 1, color: 'text.secondary' }} /> */}
                            <Typography variant="h6">Change Password</Typography>
                        </Box>

                        <TextField
                            fullWidth
                            label="Current Password"
                            // type={showCurrentPassword ? 'text' : 'password'}
                            // value={currentPassword}
                            // onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            sx={{ mb: 2 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            // onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            edge="end"
                                        >
                                            {/* {showCurrentPassword ? <VisibilityOff /> : <Visibility />} */}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            label="New Password"
                            // type={showNewPassword ? 'text' : 'password'}
                            // value={newPassword}
                            // onChange={(e) => setNewPassword(e.target.value)}
                            required
                            sx={{ mb: 2 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            // onClick={() => setShowNewPassword(!showNewPassword)}
                                            edge="end"
                                        >
                                            {/* {showNewPassword ? <VisibilityOff /> : <Visibility />} */}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Confirm New Password"
                            // type={showConfirmPassword ? 'text' : 'password'}
                            // value={confirmPassword}
                            // onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            sx={{ mb: 2 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            // onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                        >
                                            {/* {showConfirmPassword ? <VisibilityOff /> : <Visibility />} */}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button variant="contained" color="secondary" type="submit">
                            Change Password
                        </Button>
                    </Box>
                    <Button variant="contained" fullWidth sx={{ mt: 3 }} >Delete Account</Button>
                </Paper>
            </Container>
        </Box>
    );
}