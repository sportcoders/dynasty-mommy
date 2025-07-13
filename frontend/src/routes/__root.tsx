import NavBar from "@components/navbar";
import { Box } from "@mui/material";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useState } from "react";


export const Route = createRootRoute({
    component: () => {
        const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
        return (
            <>
                <NavBar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
                <Box
                    component="main"
                    sx={{
                        marginLeft: drawerOpen ? '250px' : '0',
                        // transition: 'margin-left 0.3s ease',
                        minHeight: '100vh',
                        paddingTop: '3rem',
                        // paddingX: '0.75rem',
                    }}
                >
                    <Outlet />
                </Box>
                <TanStackRouterDevtools />
            </>
        )
    },
    // component: () => <Outlet />
})