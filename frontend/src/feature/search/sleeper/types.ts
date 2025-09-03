// -------------------- Types --------------------

export type SleeperSearchTypeOptions = "Username" | "League ID";

export type SleeperSearchProps = {
    searchType: SleeperSearchTypeOptions;
    season: string;
    searchText: string;
    validParams: boolean;
    setSeason: (s: string) => void;
    checkValidParams: () => void;
    handleLeagueSearch?: () => Promise<boolean>;
    handleSearchTypeChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleTextChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
