import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionSummary, Box, Chip, Typography, AccordionDetails } from "@mui/material";
import { type YahooTransaction, type YahooTransactionPlayer } from "@services/api/yahoo";
import { useState, type SyntheticEvent } from "react";
import { DisplayAddDrop, DisplayTrades } from "./TransactionContent";
import { NormalizeToArray } from "@app/utils/adapter";

export const TransactionAccordion = ({
    transaction
}: {
    transaction: YahooTransaction;
}) => {
    const [expanded, setExpanded] = useState<string | false>("");


    // -------------------- Util Functions --------------------
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'successful': return 'success';
            case 'pending': return 'warning';
            case 'failed': return 'error';
            default: return 'default';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'trade': return 'primary';
            case 'commissioner': return 'info';
            case 'free_agent': return 'default';
            case 'add/drop':
            case 'add':
            case 'drop':
                return 'secondary';
            default: return 'default';
        }
    };

    // -------------------- Handlers --------------------
    const handleAccordionChange = (panel: string) => (_: SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
    };



    const players = NormalizeToArray<YahooTransactionPlayer>(transaction.players.player);
    const teams = new Set<string>();
    for (const player of players) {
        if (!!player.transaction_data.destination_team_name)
            teams.add(player.transaction_data.destination_team_name);
        if (!!player.transaction_data.source_team_name)
            teams.add(player.transaction_data.source_team_name);
    }


    // if (loading) return <AccordionSkeleton />;

    return (
        <Accordion
            key={transaction.transaction_id}
            sx={{ mb: 2 }}
            expanded={expanded === String(transaction.transaction_id)}
            onChange={handleAccordionChange(String(transaction.transaction_id))}
        >
            <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                    <Chip
                        label={transaction.type}
                        color={getTypeColor(transaction.type)}
                        size="small"
                        variant="outlined"
                        sx={{ width: 100, justifyContent: 'center' }}
                    />
                    <Typography sx={{ flexGrow: 1, ml: 2, fontWeight: 600 }}>
                        {Array.from(teams).map((team) => team).join(' ')}
                    </Typography>
                    <Chip
                        label={transaction.status}
                        color={getStatusColor(transaction.status)}
                        size="small"
                        sx={{ width: 80, justifyContent: 'center' }}
                    />
                </Box>
            </AccordionSummary>
            {expanded === String(transaction.transaction_id) && (
                <AccordionDetails>
                    {transaction.type == "trade" ? (
                        <DisplayTrades
                            transaction={transaction}
                        />
                    ) : (
                        <DisplayAddDrop
                            transaction={transaction}
                        />
                    )}
                </AccordionDetails>
            )}
        </Accordion>
    );
};