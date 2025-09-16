// -------------------- Imports -------------------
import { Container, Typography } from "@mui/material";
import { getTransactions } from "@services/api/yahoo";
import { useQuery } from "@tanstack/react-query";
import { TransactionAccordion } from "./TransactionAccordion";
import AccordionSkeleton from "@components/AccordionSkeleton";

// -------------------- Main Component --------------------
/**
 * A component that displays a list of weekly transaction cards for a fantasy football league.
 *
 * This component fetches the `last_scored_leg` to determine the number of weeks to display.
 * It then renders a `TransactionCard` for each week, starting from the most recent week,
 * and passes the necessary league and team data down to each card.
 *
 * @param {object} props - The component props.
 * @param {string} props.league_key - The unique key of the fantasy league.
 * @returns A container with a list of `TransactionCard` components.
 */
export default function TransactionTab({
    league_key,
}: {
    league_key: string;
}) {
    const { data, isPending: loading, isError } = useQuery({
        queryKey: ['yahooLeagueTransaction', league_key],
        queryFn: () => getTransactions(league_key)
    });

    if (loading) return <AccordionSkeleton />;

    if (isError)
        return (
            <Typography variant="h6" color="text.primary" textAlign="center">
                Oops! Failed to load transactions.
            </Typography>
        );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {data ? data.map((week) => {
                return (
                    <TransactionAccordion
                        transaction={week}
                    />
                );
            }) :
                <Typography variant="h6" color="text.primary" textAlign="center">
                    No Transactions Found
                </Typography>
            }
        </Container>
    );
}
