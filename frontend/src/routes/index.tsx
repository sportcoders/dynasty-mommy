// -------------------- Imports --------------------
import { z } from 'zod';

import { store } from '@app/store/store';

import { setSeason, setSearchText, setSearchType, setSubmit } from '@feature/search/sleeper/sleeperSearchSlice';

import Home from '@pages/HomePage';

import { createFileRoute, redirect } from '@tanstack/react-router';

export const supportedFantasyPlatforms = ["yahoo", 'sleeper', 'espn'] as const;
export type SupportedFantasyPlatform = typeof supportedFantasyPlatforms[number];

const sleeperSearchSchema = z.object({
    platform: z.enum(supportedFantasyPlatforms).default("sleeper"),
    searchText: z.string().default(""),
    searchType: z.enum(["Username", "League ID"]).default("Username"),
    season: z
        .union([z.string(), z.number()])
        .transform((val) => String(val)) // normalize to string
        .default("2025"),
    submit: z.boolean().default(false),
});

export const Route = createFileRoute('/')({
    component: Home,
    validateSearch: sleeperSearchSchema,
    beforeLoad: ({ search }) => {
        // Current Redux state
        const currentState = store.getState().sleeperSearch;

        // Sync URL params to Redux before component loads
        const { season, searchText, searchType, submit } = search;

        // Use Redux state as the source of truth for searchText
        const preservedSearchText = currentState.searchText || searchText;

        // Search Type validation
        const validSearchTypes = ["Username", "League ID"];
        const isValidSearchType = validSearchTypes.includes(searchType);
        const validSearchType = isValidSearchType ? searchType : "Username";

        if (!isValidSearchType) {
            throw redirect({
                to: '/',
                search: {
                    searchText: preservedSearchText,
                    searchType: validSearchType,
                    season,
                    submit
                }
            });
        }

        // Season validation
        const currentYear = new Date().getFullYear();
        const seasonNumber = Number(season);
        const isValidSeason = seasonNumber >= 2017 && seasonNumber <= currentYear;
        const validSeason = isValidSeason ? season : String(currentYear);

        if (!isValidSeason) {
            throw redirect({
                to: '/',
                search: {
                    searchText: preservedSearchText,
                    searchType: validSearchType,
                    season: validSeason,
                    submit
                }
            });
        }

        // Submit validation
        const isValid = Boolean(searchText && validSearchType && validSeason);

        if (submit && !isValid) {
            throw redirect({
                to: '/',
                search: {
                    searchText: preservedSearchText,
                    searchType: validSearchType,
                    season: validSeason,
                    submit: false
                }
            });
        }

        store.dispatch(setSearchText(preservedSearchText));
        store.dispatch(setSearchType(validSearchType));
        store.dispatch(setSeason(validSeason));
        store.dispatch(setSubmit(submit));

        return { search };
    },
});
