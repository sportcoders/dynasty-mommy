import Home from '@pages/HomePage';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

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
});
