import { useEffect, useRef, useState } from "react"

interface SearchParamsSleeperStorage {
    searchType: string,
    season: string,
    searchText: string
}
const SESSION_STORAGE_PARAMS_KEY = 'SearchParamsSleeper'
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
    const savedParams = useRef<SearchParamsSleeperStorage | null>(null)

    useEffect(() => {
        const storage = sessionStorage.getItem(SESSION_STORAGE_PARAMS_KEY)
        if (storage) {
            try {
                const params: SearchParamsSleeperStorage = JSON.parse(storage)
                if (params) {
                    savedParams.current = params
                    setSearchText(params.searchText)
                    setSeason(params.season)
                    setSearchType(params.searchType)
                    setValidParams(true)
                }
            }
            catch (e) {
                console.error("Item not found in storage")
            }
        }

        return () => {
            if (savedParams.current) {
                sessionStorage.setItem(SESSION_STORAGE_PARAMS_KEY, JSON.stringify(savedParams.current))
            }
        }
    }, [])

    const handleSearchTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchType(event.target.value)
    }
    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value)
    }
    const checkValidParams = () => {
        if (season && searchText) {
            setValidParams(true)
            savedParams.current = {
                searchText: searchText,
                season: season,
                searchType: searchType
            }
        }
    }
    const setParamsFalse = () => {
        setValidParams(false)
        savedParams.current = null
        sessionStorage.removeItem(SESSION_STORAGE_PARAMS_KEY)
    }

    return { validParams, searchText, season, handleTextChange, setSeason, searchType, handleSearchTypeChange, checkValidParams, setParamsFalse }
}