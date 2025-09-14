import { Box, Typography, Accordion, AccordionSummary, Avatar, useTheme, AccordionDetails, Chip } from "@mui/material";
import { type YahooTeamWithStandings } from "@services/api/yahoo";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DisplayRoster } from "./RosterByPosition";

export default function TeamAccordion({ team }: { team: YahooTeamWithStandings; }) {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const handleToggleAccordion = () => {
        setOpen((prev) => !prev);
    };
    const isUserTeam = Array.isArray(team.managers.manager) ?
        team.managers.manager.some((manager) => !!manager.is_current_login) :
        !!team.managers.manager.is_current_login;

    return (
        <Accordion
            key={team.team_key}
            expanded={open}
            disableGutters
            onChange={handleToggleAccordion}
            sx={{
                borderRadius: `${theme.shape.borderRadius}px`,
                overflow: "hidden",
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                mb: 2,
                boxShadow: theme.shadows[1],
            }}
        >
            {/* Team Header */}
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                    minHeight: "64px",
                    px: { xs: 2, sm: 3 },
                    "& .MuiAccordionSummary-content": {
                        alignItems: "center",
                        gap: 2,
                        my: 1,
                    },
                }}
            >
                <Avatar
                    // src={team.team_logos || undefined}
                    alt={`${team.name} avatar`}
                />

                <Box
                    display="flex"
                    flexDirection={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    gap={{ xs: 0.5, sm: 1 }}
                >
                    <Typography
                        variant="body1"
                        component="span"
                        sx={{
                            fontWeight: 500,
                            color: theme.palette.text.primary
                        }}
                    >
                        {team.name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        ({team.team_standings.outcome_totals.wins} - {team.team_standings.outcome_totals.ties} - {team.team_standings.outcome_totals.losses})
                    </Typography>
                    {isUserTeam &&
                        <Chip label="My Team" />

                    }
                </Box>
            </AccordionSummary>
            <AccordionDetails
                sx={{
                    backgroundColor: theme.palette.background.default,
                    borderTop: `1px dashed ${theme.palette.divider}`,
                    p: { xs: 2, sm: 3 },
                }}
            >
                {open && <DisplayRoster team_key={team.team_key} />}
            </AccordionDetails>

        </Accordion >
    );
}
