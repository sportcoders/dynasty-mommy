import { Box, Button, FormControl, Paper, TextField, Typography } from "@mui/material";

export default function EspnLeagueForm() {
    return (
        <Paper
            elevation={3}
            sx={{
                borderRadius: 3,
                p: 4,
                m: 2,
                width: "90%",
                maxWidth: 400,
                mx: "auto",
                border: "1px solid",
                borderColor: "divider",
            }}
        >
            {/* Header */}
            <Box sx={{ textAlign: "center", mb: 2 }}>
                <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    Save Your ESPN League
                </Typography>
            </Box>

            {/* Form */}
            <FormControl fullWidth>
                {/* Input Fields */}
                <Box sx={{ mb: 3 }} display="flex" gap={2}>
                    <TextField
                        label="ESPN League ID"
                        required
                        variant="outlined"
                        // onChange={handleTextChange}
                        // value={searchText}
                        sx={{
                            flex: 2,
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                        }}
                    />
                </Box>

                {/* Submit Button */}
                <Button
                    // onClick={handleSubmit}
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                        py: 1.5,
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "&:hover": { transform: "translateY(-2px)" },
                    }}
                >
                    <Typography variant="button" color="primary.contrastText">
                        Save League
                    </Typography>
                </Button>
            </FormControl>
        </Paper>
    );
}