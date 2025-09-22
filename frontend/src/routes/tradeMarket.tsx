import TradeMarket from '@pages/TradeMarket';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

export const Route = createFileRoute('/tradeMarket')({
    component: TradeMarket,
    validateSearch: z.object({
        searchText: z.string().optional()
    }),
})

