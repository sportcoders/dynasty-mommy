import { useMutation } from '@tanstack/react-query';
import { syncAccount } from '../services/espn';
import type { ESPNCookies } from '../types';

export function useSyncAccount() {
    return useMutation({
        mutationFn: (payload: ESPNCookies) => syncAccount(payload),
    });
}
