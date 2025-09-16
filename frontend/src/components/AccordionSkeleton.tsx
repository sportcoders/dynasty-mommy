import { Box, Skeleton } from "@mui/material";
/**
 * A skeleton loader component that simulates a list of accordions.
 *
 * This component renders a series of placeholder boxes with a skeleton
 * animation to provide a visual loading state for a list of accordions.
 * It's useful for improving user experience while data is being fetched.
 *
 * @param props - The component's props.
 * @returns A `Box` component containing multiple skeleton placeholders.
 */
export default function AccordionSkeleton({ count = 5 }) {
    return (
        <Box>
            {Array.from({ length: count }).map((_, index) => (
                <Box key={index} sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
                    <Skeleton variant="text" width='100%' height={30} />
                </Box>
            ))}
        </Box>
    );
};