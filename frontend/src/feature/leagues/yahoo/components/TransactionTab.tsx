// -------------------- Imports -------------------
import { Container, Typography, Button, Box } from "@mui/material";
import { getTransactions } from "@services/api/yahoo";
import { useInfiniteQuery } from "@tanstack/react-query";
import { TransactionAccordion } from "./TransactionAccordion";
import AccordionSkeleton from "@components/AccordionSkeleton";

// -------------------- Main Component --------------------
/**
 * A component that displays a list of weekly transaction cards for a fantasy football league.
 *
 * This component fetches transactions using infinite query for pagination.
 * It renders a `TransactionAccordion` for each transaction and provides
 * a load more button for additional pages.
 *
 * @param {object} props - The component props.
 * @param {string} props.league_key - The unique key of the fantasy league.
 * @returns A container with a list of `TransactionAccordion` components.
 */
export default function TransactionTab({
    league_key,
}: {
    league_key: string;
}) {
    const fetchTransactions = async ({ pageParam = 1 }: { pageParam?: number; }) => {
        const response = await getTransactions(league_key, pageParam);
        if (!response) {
            return { data: [], nextCursor: null };
        }
        return {
            data: response.transactions || [],
            nextCursor: response.hasMore ? pageParam + 1 : null
        };
    };

    const {
        data,
        isPending: loading,
        isError,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage
    } = useInfiniteQuery({
        queryKey: ['yahooLeagueTransaction', league_key],
        queryFn: fetchTransactions,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageParam: 1
    });

    const transactions = data?.pages.flatMap((page) => page.data) ?? [];

    if (loading) return <AccordionSkeleton />;

    if (isError)
        return (
            <Typography variant="h6" color="text.primary" textAlign="center">
                Oops! Failed to load transactions.
            </Typography>
        );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {transactions.length > 0 ? (
                <>
                    {transactions.map((transaction, index) => (
                        <TransactionAccordion
                            key={`transaction-${transaction.transaction_id} ${index}`}
                            transaction={transaction}
                        />
                    ))}
                    {hasNextPage && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                            >
                                {isFetchingNextPage ? 'Loading more...' : 'Load More'}
                            </Button>
                        </Box>
                    )}
                </>
            ) : (
                <Typography variant="h6" color="text.primary" textAlign="center">
                    No Transactions Found
                </Typography>
            )}
        </Container>
    );
}