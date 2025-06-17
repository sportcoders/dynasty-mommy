import { useEffect, useState } from "react"

export default function useSearchParamsSleeper() {
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
    const [searchType, setSearchType] = useState<string>("Username")
    const [season, setSeason] = useState<string>('')
    const [searchText, setSearchText] = useState("")
    const [validParams, setValidParams] = useState<boolean>(false)

    useEffect(() => {
        if (season && searchText) {
            setValidParams(true)
        }
    }, [season, searchText])
    const handleSearchTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchType(event.target.value)
    }
    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value)
    }

    return { validParams, searchText, season, handleTextChange, setSeason, searchType, handleSearchTypeChange }
}