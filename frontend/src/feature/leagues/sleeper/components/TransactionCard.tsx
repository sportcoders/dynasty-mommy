// -------------------- Imports -------------------
import { useState } from "react";

import { WeeklyTransactions } from "@feature/leagues/sleeper/components/WeeklyTransactions";

import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
    Card,
    CardHeader,
    IconButton,
    Typography,
} from "@mui/material";

import {
    type TeamInfo,
} from "@services/sleeper";

// -------------------- Main Component --------------------
/**
 * JSX component used the render each transaction week
 * used to allow toggle of each card per week
 * 
 * @param week - the week the transaction belongs to
 * @param league_id - the sleeper_id of the league we are viewing transactions for
 * @param teams - the array of teams(sleeper team objects) in the league
 * @param open - boolean to set the transaction card open by default
 * @returns the transaction card component
 */
export const TransactionCard = ({
    week,
    league_id,
    teams,
    open
}: {
    week: string;
    league_id: string;
    teams: TeamInfo[];
    open: boolean;
}) => {
    const [showWeek, setShowWeek] = useState<boolean>(open);

    // -------------------- Handlers --------------------
    const handleToggleCard = () => {
        setShowWeek((prev) => !prev);
    };

    return (
        <Card key={week} sx={{ mb: 3, boxShadow: 3 }}>
            <CardHeader
                title={
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {`Week ${week}`}
                    </Typography>
                }
                action={
                    <IconButton onClick={handleToggleCard}>
                        {showWeek ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                }
            />
            {showWeek && (
                <WeeklyTransactions
                    week={week}
                    league_id={league_id}
                    teams={teams}
                />
            )}
        </Card>
    );
};

