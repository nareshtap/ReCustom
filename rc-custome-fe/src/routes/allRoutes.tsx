import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import DashboardLayout from "../layout";
import UserMetrics from "../pages/userMetrics";

export const allRoutes = [
	{
		path: "/",
		element: (
			<DashboardLayout>
				<Suspense fallback={<>Loading...</>}>
					<Outlet />
				</Suspense>
			</DashboardLayout>
		),
		children: [
			{
				path: "/",
				element: <Dashboard />,
			},
			{
				path: "/users-matrix/:userId",
				element: <UserMetrics />,
			},
		],
	},
];
