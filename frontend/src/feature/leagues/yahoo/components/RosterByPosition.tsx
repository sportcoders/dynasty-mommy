import { Box, Typography, CircularProgress, Stack } from "@mui/material";
import { getRosterForTeam } from "@services/api/yahoo";
import { useQuery } from "@tanstack/react-query";

export function DisplayRoster({ team_key }: { team_key: string; }) {

    const { data, isPending: loading, isError: error } = useQuery({
        queryKey: ["team_key", team_key],
        queryFn: () => getRosterForTeam(team_key)
    });
    if (loading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%" p={2}>
                <CircularProgress />
            </Box >
        );
    if (error || !data)
        return (
            <Typography variant="h6" color="text.primary" textAlign="center">
                Oops! Failed to load roster.
            </Typography>);

    if (data.team.roster.players.player == null)//this is equal to "" or null when there is no roster
        return (
            < Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    textAlign: "center",
                    py: 2,
                    gridColumn: "1 / -1"
                }}
            >
                No players on this roster.
            </Typography >);

    const mapped_roster: { first_name: string, last_name: string, position: string; }[] = data.team.roster.players.player.map((roster) => {
        return {
            first_name: roster.name.first,
            last_name: roster.name.last,
            position: roster.primary_position
        };
    });
    return (
        <Box display="grid"
            gridTemplateColumns={{
                xs: "repeat(auto-fill, minmax(100px, 1fr))",
                sm: "repeat(3, 1fr)",
                md: "repeat(5, 1fr)",
            }}
            gap={2}
        >
            {
                ["PG", "SG", "SF", "PF", "C"].map((position) => (
                    <DisplayRosterByPositionYahooTemp
                        key={position}
                        roster={mapped_roster}
                        position={position}
                    />
                ))
            }
        </Box>
    );
}
interface DisplayRosterByPositionProps {
    roster: { first_name: string, last_name: string, position: string; }[];
    position: string;
}
function DisplayRosterByPositionYahooTemp({
    roster,
    position,
}: DisplayRosterByPositionProps) {
    const players = roster.filter((player) => player.position == position);
    return (
        <Stack>
            <Typography variant="h5">{position}</Typography>
            {players.map((player, index) => (
                <Typography key={index} variant="body1">
                    {player.first_name + " " + player.last_name}
                </Typography>
            ))}
        </Stack>
    );
}
