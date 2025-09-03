import { useState } from "react";
import useGetLeagueSleeper from "./useGetLeagueSleeper";
import { useNavigate } from "@tanstack/react-router";

export default function useSleeperSearchParams({ initSeason = '2025', initType = "Username", initText = '' }: { initSeason?: string, initType?: string, initText?: string; } = {}) {
    /**
     * Custom React hook to manage search params for finding sleeper leagues
     * 
     * 
    * @returns {object} An object containing:
    * @returns {string} searchText - The current search text.
    * @returns {string} season - The selected fantasy season.
    * @returns {string} searchType - The selected search type.
    * @returns {boolean} validParams - `true` if both season and search text are filled in.
    * @returns {function} handleTextChange - Event handler to update the search text.
    * @returns {function} setSeason - Setter for the selected season.
    * @returns {function} handleSearchTypeChange - Event handler to update the search type.
     */
    const [searchType, setSearchType] = useState<string>(initType);
    const [season, setSeason] = useState<string>(initSeason);
    const [searchText, setSearchText] = useState(initText);
    const { isSuccess, data, refetch, error: league_id_search_error, isError: is_league_id_search_error } = useGetLeagueSleeper(searchType != "Username" ? searchText : "");
    const navigate = useNavigate();


    const handleLeagueSearch = async (): Promise<boolean> => {
        await refetch();
        if (data && isSuccess) {
            navigate({ to: `/leagues/${searchText}` });
            return true;
        }
        return false;
    };

    const handleSearchTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchType(event.target.value);
    };
    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };
    const checkValidParams = () => {
        if (season && searchText) {
            navigate({
                to: `/`,
                search: {
                    submit: true, searchText: searchText,
                    season: String(season),
                    searchType: searchType
                }
            });
        }
    };
    const setParamsFalse = () => {
        navigate({
            to: `/`,
            search: (prev) => ({ ...prev, submit: false })
        });
    };

    const handleSeasonChange = (season: React.SetStateAction<string>) => {
        navigate({
            to: `/`,
            search: (prev) => ({ ...prev, season: String(season) })
        });
        setSeason(season);
    };
    return { searchText, season, handleTextChange, setSeason: handleSeasonChange, searchType, handleSearchTypeChange, checkValidParams, setParamsFalse, handleLeagueSearch, is_league_id_search_error };
}