// -------------------- Types --------------------

export type SleeperSearchTypeOptions = "Username" | "League ID";

export type SleeperSearchProps = {
    searchType: SleeperSearchTypeOptions;
    season: string;
    searchText: string;
    validParams: boolean;
    handleTextChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    setSeason: (s: string) => void;
    handleSearchTypeChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    checkValidParams: () => void;
    handleLeagueSearch?: () => Promise<boolean>;
};
