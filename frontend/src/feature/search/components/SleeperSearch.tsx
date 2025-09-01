// -------------------- Imports --------------------
import {
  Stack,
  Typography,
} from "@mui/material";

import useSleeperSearchParams from "@feature/search/hooks/useSleeperSearchParams";
import SleeperLeaguesList from "./SleeperLeaguesList";
import SleeperSearchForm from "./SleeperSearchForm";

// -------------------- Types --------------------
/**
 * Props shared between SleeperSearch sub-components.
 */
export type SleeperSearchComponentProps = {
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

// -------------------- Parent Component --------------------
/**
 * Top-level component that manages the Sleeper League Search feature.
 *
 * It switches between the **SleeperAccount** form (input stage)
 * and the **SleeperLeagues** results view based on state.
 *
 * @returns The rendered Sleeper League Search interface.
 */
export default function SleeperSearch({ season: initSeason = '2025', searchType: initType = "Username", searchText: initText = '', submit = false }: { season?: string, searchType?: string, searchText?: string, submit?: boolean; }) {
  const {
    searchType,
    season,
    searchText,
    handleTextChange,
    setSeason,
    handleSearchTypeChange,
    setParamsFalse,
    checkValidParams,
    handleLeagueSearch,
  } = useSleeperSearchParams({ initSeason, initType, initText });
  const showLeagues = searchType == "Username" && !!season && !!searchText && submit;
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

      {showLeagues ?
        <SleeperLeaguesList
          searchType={searchType}
          season={season}
          searchText={searchText}
          validParams={submit}
          handleTextChange={handleTextChange}
          setSeason={setSeason}
          handleSearchTypeChange={handleSearchTypeChange}
          checkValidParams={checkValidParams}
          setParamsFalse={setParamsFalse}
        />
        :
        <SleeperSearchForm
          searchType={searchType}
          season={season}
          searchText={searchText}
          validParams={submit}
          handleTextChange={handleTextChange}
          setSeason={setSeason}
          handleSearchTypeChange={handleSearchTypeChange}
          checkValidParams={checkValidParams}
          setParamsFalse={setParamsFalse}
          handleLeagueSearch={handleLeagueSearch}
        />
      }
    </Stack>
  );
}
