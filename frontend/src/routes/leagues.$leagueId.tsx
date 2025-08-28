import LeagueHome from '@pages/LeaguesHome';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

export const Route = createFileRoute('/leagues/$leagueId')({
    component: LeagueHome,
    validateSearch: z.object({
        tab: z.number().optional(),
        parent: z.string().optional(),
    }),
});