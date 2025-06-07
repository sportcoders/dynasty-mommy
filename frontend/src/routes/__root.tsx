import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";


export const Route = createRootRoute({
    // component: () => (
    //     <>
    //         {/* <div className="p-2 flex gap-2">
    //             <Link to="/LeaguesHome" className="[&.active]:font-bold">
    //                 LeaguesHome
    //             </Link>{' '}
    //             <Link to="/Home" className="[&.active]:font-bold">
    //                 Search
    //             </Link>
    //         </div>
    //         <hr /> */}
    //         <Outlet />
    //         {/* <TanStackRouterDevtools /> */}
    //     </>
    // ),
    component: () => <Outlet />
})