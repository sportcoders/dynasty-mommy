import { Box, Typography, CircularProgress } from "@mui/material";
import type { getTeamsAndLeagueResponse } from "@services/api/yahoo";
import TeamAccordion from "./TeamAccordion";

function DisplayMessage({ message }: { message: string; }) {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <Typography variant="h6" color="text.primary" textAlign="center">
                {message}
            </Typography>
        </Box>
    );
}
export default function RosterTab({ league, error, loading }: { league: getTeamsAndLeagueResponse, error: boolean, loading: boolean; }) {
    return <>
        {error && <DisplayMessage message="Oops! Failed to load team information." />
        }

        {/* Team Loading State */}
        {loading && (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        )}

        {/* No Teams State */}
        {!league && !loading && <DisplayMessage message="No teams found for this league." />}

        {/* Teams List */}
        {league && !loading && league.standings.teams && (
            league.standings.teams.team.map((team) => (
                <TeamAccordion team={team} key={team.team_id} />
            ))
        )}
    </>;
}