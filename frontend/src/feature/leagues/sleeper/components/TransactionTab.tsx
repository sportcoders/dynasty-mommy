// -------------------- Imports -------------------
import { Container } from "@mui/material";

import { TransactionCard } from "@feature/leagues/sleeper/components/TransactionCard";

import {
    type TeamInfo,
} from "@services/sleeper";

// -------------------- Main Component --------------------
/**
 * A component that displays a list of weekly transaction cards for a fantasy football league.
 *
 * This component fetches the `last_scored_leg` to determine the number of weeks to display.
 * It then renders a `TransactionCard` for each week, starting from the most recent week,
 * and passes the necessary league and team data down to each card.
 *
 * @param {object} props - The component props.
 * @param {string} props.league_id - The unique ID of the fantasy league.
 * @param {TeamInfo[]} props.teams - An array of team information objects for the league.
 * @param {number | undefined} props.last_scored_leg - The last week number that has been scored in the league. If undefined, the season has not started.
 * @returns A container with a list of `TransactionCard` components.
 */
export default function TransactionTab({
    league_id,
    teams,
    last_scored_leg
}: {
    league_id: string;
    teams: TeamInfo[];
    last_scored_leg: number | undefined;
}) {
    //if last_scored_leg exists we use it, otherwise it means season has not started yet so we use first week
    const max_week = last_scored_leg || 1;
    const display_weeks = Array.from({ length: max_week }, (_, i) => i + 1).reverse();

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {display_weeks.map((week) => {
                return (
                    <TransactionCard
                        week={String(week)}
                        league_id={league_id}
                        teams={teams}
                        open={week == display_weeks.length}
                        key={week}
                    />
                );
            })}
        </Container>
    );
}
