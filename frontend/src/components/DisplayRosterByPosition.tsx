import { Stack, Typography } from "@mui/material";
import type { Player } from "@services/sleeper";

interface DisplayRosterByPositionProps {
    roster: Player[];
    position: string;
}
export default function DisplayRosterByPosition({ roster, position }: DisplayRosterByPositionProps) {
    const players = roster.filter((player) => player.position == position)
    return (
        <Stack spacing={1}>
            <Typography variant="h3">{position}</Typography>
            {players.map((player, index) => <Typography key={index} variant="h5">{player.first_name + " " + player.last_name}</Typography>)}
        </Stack>
    )
}