// -------------------- Imports --------------------
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface SleeperSearchState {
    season: string;
    searchText: string;
    searchType: "Username" | "League ID";
    submit: boolean;
}

const initialState: SleeperSearchState = {
    season: String(new Date().getFullYear()),
    searchText: "",
    searchType: "Username",
    submit: false,
};

const sleeperSearchSlice = createSlice({
    name: "sleeperSearch",
    initialState,
    reducers: {
        setSeason: (state, action: PayloadAction<string>) => {
            state.season = action.payload;
        },
        setSearchText: (state, action: PayloadAction<string>) => {
            state.searchText = action.payload;
        },
        setSearchType: (state, action: PayloadAction<"Username" | "League ID">) => {
            state.searchType = action.payload;
        },
        setSubmit: (state, action: PayloadAction<boolean>) => {
            state.submit = action.payload;
        },
        resetSearch: (state) => {
            state.season = String(new Date().getFullYear());
            state.searchText = "";
            state.searchType = "Username";
            state.submit = false;
        },
    },
});

export const { setSeason, setSearchText, setSearchType, resetSearch, setSubmit } =
    sleeperSearchSlice.actions;
export default sleeperSearchSlice.reducer;
