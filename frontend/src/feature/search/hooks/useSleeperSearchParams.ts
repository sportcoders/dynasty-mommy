// React related hooks
import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";


// Custom Hooks
import useGetLeagueSleeper from "./useGetLeagueSleeper";

// Custom Providers
import { useNotification } from "@hooks/useNotification";

// Type for Sleeper Search Params
interface SleeperSearchParams {
    searchType: string,
    season: string,
    searchText: string,
    validParams: boolean,
    showAccount: boolean;
}

// Global Variables for the hook
const SESSION_STORAGE_PARAMS_KEY = 'SleeperSearchParams';
const QUERY_KEY = ['sleeperSearchParams'] as const;
const defaultSearchParams: SleeperSearchParams = {
    searchType: 'Username',
    season: '',
    searchText: '',
    validParams: false,
    showAccount: true,

};

// Storage operation functions
const getStoredParams = async (): Promise<SleeperSearchParams> => {
    try {
        const storage = sessionStorage.getItem(SESSION_STORAGE_PARAMS_KEY);
        return storage ? { ...defaultSearchParams, ...JSON.parse(storage) } : defaultSearchParams;
    } catch (error) {
        console.error("Error reading from sessionStorage: ", error);
        return defaultSearchParams;
    }
};

const saveToSessionStorage = (params: SleeperSearchParams): void => {
    try {
        sessionStorage.setItem(SESSION_STORAGE_PARAMS_KEY, JSON.stringify(params));
    } catch (error) {
        console.error("Error saving to sessionStorage: ", error);
    }
};

const clearSessionStorage = (): void => {
    try {
        sessionStorage.removeItem(SESSION_STORAGE_PARAMS_KEY);
    } catch (error) {
        console.error("Error clearing sessionStorage: ", error);
    }
};

// Custom Hook
export default function useSleeperSearchParams() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { showError } = useNotification();

    // Hook's Single Main Query
    const { data: sleeperSearchParams = defaultSearchParams } = useQuery({
        queryKey: QUERY_KEY,
        queryFn: getStoredParams,
        staleTime: Infinity,
        gcTime: Infinity,
    });

    const { searchType, season, searchText, validParams, showAccount } = sleeperSearchParams;

    // Get current data cache helper
    const getCurrentParams = (): SleeperSearchParams => {
        return queryClient.getQueryData(QUERY_KEY) ?? defaultSearchParams;
    };

    // Mutate functions
    const updateSearchTypeMutation = useMutation({
        mutationFn: async (newSearchType: string) => newSearchType,
        onMutate: async (newSearchType) => {
            const currentParams = getCurrentParams();
            const optimisticParams = { ...currentParams, searchType: newSearchType };

            queryClient.setQueryData(QUERY_KEY, optimisticParams);
            saveToSessionStorage(optimisticParams);

            return { previousParams: currentParams };
        },
        onError: (err, newSearchType, context) => {
            showError("Error updating search type");
            if (context?.previousParams) {
                queryClient.setQueryData(QUERY_KEY, context.previousParams);
            }
        }
    });

    const updateSearchTextMutation = useMutation({
        mutationFn: async (newSearchText: string) => newSearchText,
        onMutate: async (newSearchText) => {
            const currentParams = getCurrentParams();
            const optimisticParams = { ...currentParams, searchText: newSearchText };

            queryClient.setQueryData(QUERY_KEY, optimisticParams);
            saveToSessionStorage(optimisticParams);

            return { previousParams: currentParams };
        },
        onError: (err, newSearchText, context) => {
            if (context?.previousParams) {
                queryClient.setQueryData(QUERY_KEY, context.previousParams);
            }
        },
    });

    const updateSeasonMutation = useMutation({
        mutationFn: async (newSeason: string) => newSeason,
        onMutate: async (newSeason) => {
            const currentParams = getCurrentParams();
            const optimisticParams = { ...currentParams, season: newSeason };

            queryClient.setQueryData(QUERY_KEY, optimisticParams);
            saveToSessionStorage(optimisticParams);

            return { previousParams: currentParams };
        },
        onError: (err, newSeason, context) => {
            if (context?.previousParams) {
                queryClient.setQueryData(QUERY_KEY, context.previousParams);
            }
        },
    });

    const validateParamsMutation = useMutation({
        mutationFn: async () => {
            const currentParams = getCurrentParams();
            return currentParams.season && currentParams.searchText;
        },
        onMutate: async () => {
            const currentParams = getCurrentParams();
            if (currentParams.season && currentParams.searchText) {
                const optimisticParams = { ...currentParams, validParams: true };
                queryClient.setQueryData(QUERY_KEY, optimisticParams);
                saveToSessionStorage(optimisticParams);

                return { previousParams: currentParams };
            }
            return { previousParams: currentParams };
        },
        onSuccess: () => {
            setShowAccount(false);
        },
        onError: (err, variables, context) => {
            showError("Error validating search params");
            if (context?.previousParams) {
                queryClient.setQueryData(QUERY_KEY, context.previousParams);
            }
        }
    });

    const clearParamsMutation = useMutation({
        mutationFn: async () => defaultSearchParams,
        onMutate: async () => {
            const currentParams = getCurrentParams();

            queryClient.setQueryData(QUERY_KEY, defaultSearchParams);
            clearSessionStorage();

            return { previousParams: currentParams };
        },
        onError: (err, variables, context) => {
            showError("Error clearing params");
            if (context?.previousParams) {
                queryClient.setQueryData(QUERY_KEY, context.previousParams);
                saveToSessionStorage(context.previousParams);
            }
        },
    });

    const toggleShowAccountMutation = useMutation({
        mutationFn: async (value: boolean) => value,
        onMutate: async (value) => {
            const currentParams = getCurrentParams();
            const optimisticParams = { ...currentParams, showAccount: value };

            queryClient.setQueryData(QUERY_KEY, optimisticParams);
            saveToSessionStorage(optimisticParams);

            return { previousParams: currentParams };
        },
        onError: (err, value, context) => {
            if (context?.previousParams) {
                queryClient.setQueryData(QUERY_KEY, context.previousParams);
            }
        },
    });

    // League search hook
    const { isSuccess, data, refetch, error: leagueIdSearchError, isError: isLeagueIdSearchError } = useGetLeagueSleeper(searchText !== "Username" ? searchText : "");

    // Event Handlers
    const handleSearchTypeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        updateSearchTypeMutation.mutate(event.target.value);
    }, [updateSearchTypeMutation]);

    const handleTextChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        updateSearchTextMutation.mutate(event.target.value);
    }, [updateSearchTextMutation]);

    const setSeason = useCallback((newSeason: string) => {
        updateSeasonMutation.mutate(newSeason);
    }, [updateSeasonMutation]);

    const checkValidParams = useCallback(() => {
        validateParamsMutation.mutate();
    }, [validateParamsMutation]);

    const setShowAccount = useCallback((value: boolean) => {
        toggleShowAccountMutation.mutate(value);
    }, [toggleShowAccountMutation]);

    // TODO: Might remove
    const setParamsFalse = useCallback(() => {
        clearParamsMutation.mutate();
    }, [clearParamsMutation]);

    const handleLeagueSearch = useCallback(async (): Promise<boolean> => {
        const result = await refetch();
        if (result.data && result.isSuccess) {
            navigate({ to: `/leagues/${searchText}` });
            return true;
        }
        return false;
    }, [refetch, navigate, searchText]);

    return {
        // Data from cache
        validParams,
        searchText,
        season,
        searchType,
        showAccount,

        // Actions
        handleTextChange,
        setSeason,
        handleSearchTypeChange,
        checkValidParams,
        setParamsFalse,
        handleLeagueSearch,
        setShowAccount,

        // Status
        isLeagueIdSearchError,

        // Loading states for each operation
        isUpdatingSearchType: updateSearchTypeMutation.isPending,
        isUpdatingSearchText: updateSearchTextMutation.isPending,
        isUpdatingSeason: updateSeasonMutation.isPending,
        isValidating: validateParamsMutation.isPending,
        isClearing: clearParamsMutation.isPending,
    };
}