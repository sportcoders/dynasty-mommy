import YahooLeaguePage from '@pages/YahooLeaguePage';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

export const Route = createFileRoute('/league/yahoo/$league_key')({
    component: YahooLeaguePage,
    validateSearch: z.object({
        tab: z.number().optional(),
    }),
});

