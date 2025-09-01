import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    Paper,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from "@mui/material";


import SelectSeasonDropDown from "@components/SelectSeasonDropDown";



import { useNotification } from "@hooks/useNotification";


import type { SleeperSearchComponentProps } from "./SleeperSearch";
/**
 * A form component for searching Sleeper leagues by **Username** or **League ID**.
 *
 * - If searching by `League ID`, it will attempt direct navigation to the league.
 * - If searching by `Username`, the user must also select a season.
 *
 * @param props - {@link SleeperSearchComponentProps}
 * @returns The rendered league search form.
 */
export default function SleeperSearchForm({
    searchType,
    season,
    searchText,
    handleTextChange,
    setSeason,
    handleSearchTypeChange,
    checkValidParams,
    handleLeagueSearch,
}: SleeperSearchComponentProps) {
    const { showSuccess, showError } = useNotification();

    /**
     * Handles form submission and executes the correct search action.
     *
     * @param e - The form submit event.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (searchType === "League ID" && searchText !== "") {
            const success = await handleLeagueSearch!();
            if (success) {
                showSuccess("Navigating to League");
            } else {
                showError("League not found");
            }
        } else {
            checkValidParams();
        }
    };

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
            <Box sx={{ textAlign: "center", mb: 3 }}>
                <Typography variant="h4" component="h2" gutterBottom color="primary">
                    Find League
                </Typography>
                <Typography variant="body2" color="text.main">
                    Search by username or league ID
                </Typography>
            </Box>

            {/* Form */}
            <FormControl fullWidth>
                {/* Radio Selection */}
                <RadioGroup
                    row
                    value={searchType}
                    onChange={handleSearchTypeChange}
                    sx={{
                        mb: 3,
                        justifyContent: "center",
                        "& .MuiFormControlLabel-root": { mx: 2 },
                    }}
                >
                    <FormControlLabel
                        value="Username"
                        control={<Radio />}
                        label="Username"
                        sx={{ "& .MuiFormControlLabel-label": { fontWeight: 500 } }}
                    />
                    <FormControlLabel
                        value="League ID"
                        control={<Radio />}
                        label="League ID"
                        sx={{ "& .MuiFormControlLabel-label": { fontWeight: 500 } }}
                    />
                </RadioGroup>

                {/* Input Fields */}
                <Box sx={{ mb: 3 }} display="flex" gap={2}>
                    <TextField
                        label={searchType}
                        required
                        variant="outlined"
                        onChange={handleTextChange}
                        value={searchText}
                        sx={{
                            flex: 2,
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                        }}
                    />
                    {searchType === "Username" && (
                        <Box sx={{ flex: 1 }}>
                            <SelectSeasonDropDown
                                updateSeason={setSeason}
                                selectedYear={season}
                                label_name="Year"
                                disabled={false}
                            />
                        </Box>
                    )}
                </Box>

                {/* Submit Button */}
                <Button
                    onClick={handleSubmit}
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
                        Search League
                    </Typography>
                </Button>
            </FormControl>
        </Paper>
    );
}

