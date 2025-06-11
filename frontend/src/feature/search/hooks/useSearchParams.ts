import { useEffect, useState } from "react"

export default function useSearchParams() {
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