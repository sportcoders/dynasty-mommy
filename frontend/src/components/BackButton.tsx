import { IconButton, Tooltip } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "@tanstack/react-router";

interface BackButtonProps {
    url?: string;
}

export default function BackButton({ url = "/" }: BackButtonProps) {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate({ to: url });
    };

    return (
        <Tooltip title="Go back">
            <IconButton
                onClick={handleBack}
                sx={{
                    mr: 2,
                    '&:hover': {
                        backgroundColor: 'action.hover',
                    }
                }}
            >
                <ArrowBack />
            </IconButton>
        </Tooltip>
    );
}