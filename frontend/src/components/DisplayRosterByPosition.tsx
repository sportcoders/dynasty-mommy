import { Stack, Typography } from "@mui/material";
import type { Player } from "@services/sleeper";

interface DisplayRosterByPositionProps {
    roster: Player[];
    position: string;
}

/**
 * Displays a list of players from a roster filtered by basketball position.
 *
 * @param props - The props for the component.
 * @param props.roster - The full roster of players.
 * @param props.position - The basketball position to filter by (e.g., "PG", "SG", "SF", "PF", "C").
 * @returns A stack displaying the position and the names of players at that position.
 */
export default function DisplayRosterByPosition({ roster, position }: DisplayRosterByPositionProps) {
    const players = roster.filter((player) => player.position == position)
    return (
        <Stack spacing={1}>
            <Typography variant="h3">{position}</Typography>
            {players.map((player, index) => <Typography key={index} variant="h5">{player.first_name + " " + player.last_name}</Typography>)}
        </Stack>
    )
}