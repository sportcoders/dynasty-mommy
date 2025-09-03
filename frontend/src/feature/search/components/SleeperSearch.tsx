// -------------------- Imports --------------------
import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";

import useGetLeagueSleeper from "@feature/search/hooks/useGetLeagueSleeper";
import SleeperLeaguesList from "./SleeperLeaguesList";
import SleeperSearchForm from "./SleeperSearchForm";

// -------------------- Types --------------------
/**
 * Props shared between SleeperSearch sub-components.
 */
type SleeperSearchTypeOptions = "Username" | "League ID";

export type SleeperSearchComponentProps = {
  searchType: SleeperSearchTypeOptions;
  season: string;
  searchText: string;
  validParams: boolean;
  handleTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSeason: (s: string) => void;
  handleSearchTypeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checkValidParams: () => void;
  setParamsFalse: () => void;
  handleLeagueSearch?: () => Promise<boolean>;
};

/**
 * Top-level component that manages the Sleeper League Search feature.
 *
 * It switches between the **SleeperSearchForm** (input stage)
 * and the **SleeperLeaguesList** results view based on state.
 *
 * @returns The rendered Sleeper League Search interface.
 */
export default function SleeperSearch({
  season: initSeason = "2025",
  searchType: initType = "Username",
  searchText: initText = "",
  submit = false,
}: {
  season?: string;
  searchType?: SleeperSearchTypeOptions;
  searchText?: string;
  submit?: boolean;
}) {
  // -------------------- Local state --------------------
  const [searchType, setSearchType] = useState<SleeperSearchTypeOptions>(initType);
  const [season, setSeasonState] = useState<string>(initSeason);
  const [searchText, setSearchText] = useState(initText);

  const navigate = useNavigate();

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
      setSearchType(value);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const checkValidParams = () => {
    if (season && searchText) {
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

  const setParamsFalse = () => {
    navigate({
      to: `/`,
      search: (prev) => ({ ...prev, submit: false }),
    });
  };

  const handleSeasonChange = (newSeason: string) => {
    navigate({
      to: `/`,
      search: (prev) => ({ ...prev, season: String(newSeason) }),
    });
    setSeasonState(newSeason);
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
          searchType={searchType}
          season={season}
          searchText={searchText}
          validParams={validParams}
          handleTextChange={handleTextChange}
          setSeason={handleSeasonChange}
          handleSearchTypeChange={handleSearchTypeChange}
          checkValidParams={checkValidParams}
          setParamsFalse={setParamsFalse}
        />
      ) : (
        <SleeperSearchForm
          searchType={searchType}
          season={season}
          searchText={searchText}
          validParams={validParams}
          handleTextChange={handleTextChange}
          setSeason={handleSeasonChange}
          handleSearchTypeChange={handleSearchTypeChange}
          checkValidParams={checkValidParams}
          setParamsFalse={setParamsFalse}
          handleLeagueSearch={handleLeagueSearch}
        />
      )}
    </Stack>
  );
}
