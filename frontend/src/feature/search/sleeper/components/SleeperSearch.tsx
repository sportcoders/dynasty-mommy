// -------------------- Imports --------------------
import { useDispatch } from "react-redux";

import { useAppSelector } from "@app/hooks";

import SleeperLeaguesList from "@feature/search/sleeper/components/SleeperLeaguesList";
import SleeperSearchForm from "@feature/search/sleeper/components/SleeperSearchForm";
import useGetLeagueSleeper from "@feature/search/sleeper/hooks/useGetLeagueSleeper";
import { setSeason, setSearchText, setSearchType, setSubmit } from "@feature/search/sleeper/sleeperSearchSlice";

import { Stack, Typography } from "@mui/material";

import { useNavigate } from "@tanstack/react-router";

/**
 * Top-level component that manages the Sleeper League Search feature.
 *
 * It switches between the **SleeperSearchForm** (input stage)
 * and the **SleeperLeaguesList** results view based on state.
 *
 * @returns The rendered Sleeper League Search interface.
 */
export default function SleeperSearch() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { season, searchText, searchType, submit } = useAppSelector((state) => state.sleeperSearch);

  const { refetch } = useGetLeagueSleeper(searchType !== "Username" ? searchText : "");

  // -------------------- Handlers --------------------
  const handleLeagueSearch = async (): Promise<boolean> => {
    const result = await refetch();

    if (result?.data) {
      navigate({ to: `/leagues/${searchText}` });
      return true;
    }
    return false;
  };

  const handleSearchTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    if (value === "Username" || value === "League ID") {
      dispatch(setSearchType(value));
      dispatch(setSearchText(""));
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    dispatch(setSearchText(value));
  };

  const checkValidParams = () => {
    if (season && searchText) {
      dispatch(setSubmit(true));
      navigate({
        to: `/`,
        search: {
          submit: true,
          searchText,
          season: String(season),
          searchType,
        },
      });
    }
  };

  const handleSeasonChange = (newSeason: string) => {
    navigate({
      to: `/`,
      search: (prev) => ({ ...prev, season: String(newSeason) }),
    });

    dispatch(setSeason(newSeason));
  };

  const validParams = Boolean(season && searchText);
  const showLeagues = searchType === "Username" && validParams && submit;

  // -------------------- Render --------------------
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

      {showLeagues ? (
        <SleeperLeaguesList
          season={season}
          searchText={searchText}
          searchType={searchType}
          validParams={validParams}
          setSeason={handleSeasonChange}
          checkValidParams={checkValidParams}
        />
      ) : (
        <SleeperSearchForm
          season={season}
          searchText={searchText}
          searchType={searchType}
          validParams={validParams}
          setSeason={handleSeasonChange}
          checkValidParams={checkValidParams}
          handleLeagueSearch={handleLeagueSearch}
          handleSearchTypeChange={handleSearchTypeChange}
          handleTextChange={handleTextChange}
        />
      )}
    </Stack>
  );
}
