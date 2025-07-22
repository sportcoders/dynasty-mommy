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
import { Route as LeagueRoute } from "@routes/leagues.$leaugeId";
import { DisplayLeaguesList } from "@components/DisplayLeaguesList";
import SelectSeasonDropDown from "@components/SelectSeasonDropDown";
import useSearchParamsSleeper from "@feature/search/hooks/useSearchParamsSleeper";
import useGetUserLeaguesSleeper from "@feature/search/hooks/useGetUserLeaguesSleeper";
import { useGetSavedLeagues } from "@hooks/useGetSavedLeagues";
import useDeleteLeague from "../hooks/useDeleteLeague";
import useSaveLeague from "../hooks/useSaveLeague";
import { useAppSelector } from "@app/hooks";
import { useNotification } from "@hooks/useNotification";

type SleeperSearchComponentProps = {
  searchType: string;
  season: string;
  searchText: string;
  validParams: boolean;
  handleTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSeason: (s: string) => void;
  handleSearchTypeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checkValidParams: () => void;
  setParamsFalse: () => void;
  searchByLeagueIdSuccess?: boolean;
  handleLeagueSearch?: () => Promise<boolean>;
};

/**
 * SleeperSearch is a component for the Sleeper League Search feature.
 *
 * It manages the search state for leagues, allowing users to search by a specified type,
 * value, and season. When search parameters are set, it displays the SleeperLeagues component
 * with the current search criteria. Otherwise, it renders the SleeperAccount component to allow
 * the user to initiate a new search.
 *
 * This component is intended to be used as part of a larger feature, not as a standalone page.
 *
 * @returns The rendered search interface for Sleeper leagues.
 */
export default function SleeperSearch() {
  const {
    searchType,
    season,
    searchText,
    validParams,
    handleTextChange,
    setSeason,
    handleSearchTypeChange,
    checkValidParams,
    setParamsFalse,
    handleLeagueSearch,
  } = useSearchParamsSleeper();
  return (
    <Stack
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100%",
      }}
      spacing={4}
    >
      <Typography variant="h2" component="h1" color="primary">
        Sleeper League Search
      </Typography>
      {validParams ? (
        <SleeperLeagues
          searchType={searchType}
          season={season}
          searchText={searchText}
          validParams={validParams}
          handleTextChange={handleTextChange}
          setSeason={setSeason}
          handleSearchTypeChange={handleSearchTypeChange}
          checkValidParams={checkValidParams}
          setParamsFalse={setParamsFalse}
        />
      ) : (
        <SleeperAccount
          searchType={searchType}
          season={season}
          searchText={searchText}
          validParams={validParams}
          handleTextChange={handleTextChange}
          setSeason={setSeason}
          handleSearchTypeChange={handleSearchTypeChange}
          checkValidParams={checkValidParams}
          setParamsFalse={setParamsFalse}
          handleLeagueSearch={handleLeagueSearch}

        />
      )}
    </Stack>
  );
}

/**
 * SleeperAccount is a component and form for searching leagues via username/league id and season year.
 *
 * This component is a smaller part of the SleeperSearch feature.
 *
 * @returns The rendered form for searching league(s) via username/league id and season year.
 */
function SleeperAccount({
  searchType,
  season,
  searchText,
  handleTextChange,
  setSeason,
  handleSearchTypeChange,
  checkValidParams,
  handleLeagueSearch,
}: SleeperSearchComponentProps) {
  const { showSuccess, showError, showInfo, showWarning, showNotification } =
    useNotification();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchType == 'League ID' && searchText != "") {
      const success = await handleLeagueSearch!();
      if (success)
        showSuccess("Navigating to Leauge");
      else
        showError("League not found");
    }
    else
      checkValidParams();
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
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom color="primary">
          Find League
        </Typography>
        <Typography variant="body2" color="text.main">
          Search by username or league ID
        </Typography>
      </Box>

      <FormControl fullWidth>
        <RadioGroup
          row
          value={searchType}
          onChange={handleSearchTypeChange}
          sx={{
            mb: 3,
            justifyContent: "center",
            "& .MuiFormControlLabel-root": {
              mx: 2,
            },
          }}
        >
          <FormControlLabel
            value="Username"
            control={<Radio />}
            label="Username"
            sx={{
              "& .MuiFormControlLabel-label": {
                fontWeight: 500,
              },
            }}
          />
          <FormControlLabel
            value="League ID"
            control={<Radio />}
            label="League ID"
            sx={{
              "& .MuiFormControlLabel-label": {
                fontWeight: 500,
              },
            }}
          />
        </RadioGroup>

        <Box sx={{ mb: 3 }} display="flex" gap={2}>
          <TextField
            label={searchType}
            required
            variant="outlined"
            onChange={handleTextChange}
            value={searchText}
            sx={{
              flex: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
          {
            searchType == "Username" &&
            <Box sx={{ flex: 1 }}>
              <SelectSeasonDropDown
                updateSeason={setSeason}
                selectedYear={season}
                label_name="Year"
                disabled={false}
              />
            </Box>
          }
        </Box>

        <Button
          onClick={handleSubmit}
          variant="contained"
          size="large"
          fullWidth
          sx={{
            py: 1.5,
            borderRadius: 2,
            "&:hover": {
              transform: "translateY(-2px)",
            },
            transition: "all 0.3s ease",
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
 * SleeperLeagues is a component that displays the resulting leagues based on the form parameters.
 *
 * This component is a smaller part of the SleeperSearch feature.
 *
 * @returns The rendered leagues list.
 */
function SleeperLeagues({
  searchType,
  season,
  searchText,
  setSeason,
  setParamsFalse: back,
}: SleeperSearchComponentProps) {
  const username = useAppSelector(state => state.authReducer.username);

  const { leagues, loading, error } = useGetUserLeaguesSleeper(
    searchText,
    season
  );
  const { data: userLeagues } = useGetSavedLeagues();
  const deleteLeauge = useDeleteLeague();
  const saveLeagueMutate = useSaveLeague();
  const sleeperLeagues = userLeagues?.reduce<string[]>((result, league) => {
    if (league.platform == 'sleeper')
      result.push(league.league_id);
    return result;
  }, []);
  const router = useRouter();
  const handleNavigateToLeague = (id: string) => {
    router.navigate({
      to: LeagueRoute.to,
      params: { leaugeId: id },
    });
  };
  const saveLeague = async (league_id: string) => {
    try {
      saveLeagueMutate.mutate({ platform: "sleeper", league_id: league_id });
      return saveLeagueMutate.isSuccess;
    } catch (e) {
      return false;
    }
  };
  const handleDeleteLeague = async (league_id: string) => {
    deleteLeauge.mutate({ platform: "sleeper", league_id: league_id });
    return deleteLeauge.isSuccess;
  };
  if (loading) return <CircularProgress />;

  if (error) {
    back();
    return <Snackbar open={error ? true : false} message={error} />;
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
          onClick={back}
          color="primary"
          sx={{
            height: "56px", // Standard Material-UI TextField height
            borderRadius: 2,
            textTransform: "none",
            px: 3,
            borderColor: "primary.main",
            "&:hover": {
              borderColor: "primary.dark",
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              transform: "translateY(-1px)",
              boxShadow: "0 2px 8px primary.light",
            },
            transition: "all 0.3s ease",
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
            saveLeague={saveLeague}
            loggedIn={username != null}
            userLeagues={sleeperLeagues}
            deleteLeague={handleDeleteLeague}
          />
        </Box>
      )}
    </Paper>
  );
}
