import Home from '@pages/HomePage';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const Sleeper_searchSchema = z.object({
    searchType: z.string().optional(),
    searchText: z.string().optional(),
    season: z.string().optional() || z.number().optional(),
    submit: z.boolean().optional()
});


export const Route = createFileRoute('/')({
    component: Home,
    validateSearch: Sleeper_searchSchema
});
