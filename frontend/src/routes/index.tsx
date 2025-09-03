// -------------------- Imports --------------------
import { z } from 'zod';

import { store } from '@app/store/store';

import { setSeason, setSearchText, setSearchType, setSubmit } from '@feature/search/sleeper/sleeperSearchSlice';

import Home from '@pages/HomePage';

import { createFileRoute } from '@tanstack/react-router';

const sleeperSearchSchema = z.object({
    searchType: z.enum(["Username", "League ID"]).default("Username"),
    searchText: z.string().default(""),
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
        // Sync URL params to Redux before component loads
        const { season, searchText, searchType, submit } = search;

        if (season) store.dispatch(setSeason(season));
        if (searchText) store.dispatch(setSearchText(searchText));
        if (searchType) store.dispatch(setSearchType(searchType));
        if (submit !== undefined) store.dispatch(setSubmit(submit));

        return { search };
    },
});
