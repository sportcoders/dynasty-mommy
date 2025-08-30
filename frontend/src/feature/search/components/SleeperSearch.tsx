// -------------------- Imports --------------------
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useRouter } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Route as LeagueRoute } from "@routes/leagues.$leagueId";
import { DisplayLeaguesList } from "@components/DisplayLeaguesList";
import SelectSeasonDropDown from "@components/SelectSeasonDropDown";

import useGetUserLeaguesSleeper from "@feature/search/hooks/useGetUserLeaguesSleeper";
import useSleeperSearchParams from "@feature/search/hooks/useSleeperSearchParams";
import useSaveSleeperLeague from "@feature/leagues/hooks/useSaveTeam";

import { useGetSavedLeagues } from "@hooks/useGetSavedLeagues";
import { useNotification } from "@hooks/useNotification";
import { useAppSelector } from "@app/hooks";

import useDeleteLeague from "../hooks/useDeleteLeague";
import { sleeper_getUser } from "@services/sleeper";

// -------------------- Types --------------------
/**
 * Props shared between SleeperSearch sub-components.
 */
type SleeperSearchComponentProps = {
  searchType: string;
  season: string;
  searchText: string;
  validParams: boolean;
  handleTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSeason: (s: string) => void;
  handleSearchTypeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checkValidParams: () => void;
  setShowAccount: (value: boolean) => void;
  setParamsFalse: () => void;
  searchByLeagueIdSuccess?: boolean;
  handleLeagueSearch?: () => Promise<boolean>;
};

// -------------------- Parent Component --------------------
/**
 * Top-level component that manages the Sleeper League Search feature.
 *
 * It switches between the **SleeperAccount** form (input stage)
 * and the **SleeperLeagues** results view based on state.
 *
 * @returns The rendered Sleeper League Search interface.
 */
export default function SleeperSearch() {
  const {
    searchType,
    season,
    searchText,
    validParams,
    showAccount,
    handleTextChange,
    setSeason,
    handleSearchTypeChange,
    checkValidParams,
    setShowAccount,
    setParamsFalse,
    handleLeagueSearch,
  } = useSleeperSearchParams();

  return (
    <Stack
      spacing={4}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100%",
      }}
    >
      <Typography variant="h2" component="h1" color="primary">
        Sleeper League Search
      </Typography>

      {validParams && !showAccount && (
        <SleeperLeagues
          searchType={searchType}
          season={season}
          searchText={searchText}
          validParams={validParams}
          handleTextChange={handleTextChange}
          setSeason={setSeason}
          handleSearchTypeChange={handleSearchTypeChange}
          checkValidParams={checkValidParams}
          setShowAccount={setShowAccount}
          setParamsFalse={setParamsFalse}
        />
      )}

      {showAccount && (
        <SleeperAccount
          searchType={searchType}
          season={season}
          searchText={searchText}
          validParams={validParams}
          handleTextChange={handleTextChange}
          setSeason={setSeason}
          handleSearchTypeChange={handleSearchTypeChange}
          checkValidParams={checkValidParams}
          setShowAccount={setShowAccount}
          setParamsFalse={setParamsFalse}
          handleLeagueSearch={handleLeagueSearch}
        />
      )}
    </Stack>
  );
}

// -------------------- Child Components --------------------
/**
 * A form component for searching Sleeper leagues by **Username** or **League ID**.
 *
 * - If searching by `League ID`, it will attempt direct navigation to the league.
 * - If searching by `Username`, the user must also select a season.
 *
 * @param props - {@link SleeperSearchComponentProps}
 * @returns The rendered league search form.
 */
function SleeperAccount({
  searchType,
  season,
  searchText,
  handleTextChange,
  setSeason,
  handleSearchTypeChange,
  setShowAccount,
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
        setShowAccount(false);
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

/**
 * Displays a list of Sleeper leagues that match the current search criteria.
 *
 * @param props - {@link SleeperSearchComponentProps}
 * @returns The rendered leagues list with options to save/delete.
 */
function SleeperLeagues({
  searchType,
  season,
  searchText,
  setSeason,
  setShowAccount,
  setParamsFalse: back,
}: SleeperSearchComponentProps) {
  const username = useAppSelector((state) => state.authReducer.username);

  const { leagues, loading, error } = useGetUserLeaguesSleeper(searchText, season);
  const { data: user_id } = useSuspenseQuery({
    queryKey: ["sleeper_user", searchText],
    queryFn: () => sleeper_getUser(searchText),
    select: (data) => data?.user_id,
  });
  const { data: userLeagues } = useGetSavedLeagues();

  const deleteLeague = useDeleteLeague();
  const saveTeamMutate = useSaveSleeperLeague();

  const sleeperLeagues = userLeagues?.reduce<string[]>((result, league) => {
    if (league.platform === "sleeper") result.push(league.league_id);
    return result;
  }, []);

  const router = useRouter();

  /**
   * Navigates the user to a given league details page.
   *
   * @param id - The league ID to navigate to.
   */
  const handleNavigateToLeague = (id: string) => {
    router.navigate({
      to: LeagueRoute.to,
      params: { leagueId: id },
    });
  };

  /**
   * Saves a league for the logged-in user.
   *
   * @param league_id - The league ID to save.
   * @returns Whether the save was successful.
   */
  const saveLeague = async (league_id: string) => {
    try {
      saveTeamMutate.mutate({ league_id, user_id: user_id! });
      return saveTeamMutate.isSuccess;
    } catch {
      return false;
    }
  };

  /**
   * Deletes a league from the logged-in user's saved list.
   *
   * @param league_id - The league ID to delete.
   * @returns Whether the delete was successful.
   */
  const handleDeleteLeague = async (league_id: string) => {
    deleteLeague.mutate({ platform: "sleeper", league_id });
    return deleteLeague.isSuccess;
  };

  if (loading) return <CircularProgress />;
  if (error) {
    back();
    return <Snackbar open={!!error} message={error} />;
  }

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 3,
        m: 2,
        maxWidth: 800,
        mx: "auto",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Search/Filter Section */}
      <Box
        display="flex"
        alignItems="center"
        sx={{
          p: 3,
          gap: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button
          variant="outlined"
          onClick={() => setShowAccount(true)}
          color="primary"
          sx={{
            height: "56px",
            borderRadius: 2,
            textTransform: "none",
            px: 3,
            borderColor: "primary.main",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "primary.dark",
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              transform: "translateY(-1px)",
              boxShadow: "0 2px 8px primary.light",
            },
          }}
        >
          <Typography variant="body1">Back</Typography>
        </Button>

        <Box display="flex" gap={2} sx={{ flex: 1 }}>
          <TextField disabled label={searchType} value={searchText} />
          <FormControl sx={{ flex: 1, minWidth: 150 }}>
            <SelectSeasonDropDown
              updateSeason={setSeason}
              selectedYear={season}
              label_name="Change Year"
              width={150}
            />
          </FormControl>
        </Box>
      </Box>

      {/* Results Section */}
      {!leagues || leagues.length === 0 ? (
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            backgroundColor: "background.default",
            color: "text.primary",
          }}
        >
          <Typography variant="body1">No Leagues Found</Typography>
        </Box>
      ) : (
        <Box sx={{ p: 2 }}>
          <DisplayLeaguesList
            onLeagueClick={handleNavigateToLeague}
            displayAvatar={true}
            leagues={leagues}
            loggedIn={!!username}
            saveDelete={{
              saveLeague,
              userLeagues: sleeperLeagues || [],
              deleteLeague: handleDeleteLeague,
            }}
          />
        </Box>
      )}
    </Paper>
  );
}
