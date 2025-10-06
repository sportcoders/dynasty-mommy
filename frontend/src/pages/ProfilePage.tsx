import Profile from "@feature/profile/components/Profile";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Suspense } from "react";
import { ErrorBoundary } from 'react-error-boundary';

const DisplayMessage = ({ children }: { children?: React.ReactNode; }) => {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh'
        }}>
            {children}
        </Box>
    );
};
const ErrorMessage = () => {
    return (<Typography>
        User Not Found, Try Logging in Again
    </Typography>);
};
export default function ProfilePage() {
    return (
        <ErrorBoundary fallback={DisplayMessage({ children: ErrorMessage() })}>
            <Suspense fallback={DisplayMessage({ children: <CircularProgress /> })}>
                <Profile />
            </Suspense>
        </ErrorBoundary>
    );
}
