import { useRoutes } from "react-router-dom";
import { allRoutes } from "./allRoutes";

export default function Router() {
	return useRoutes([...allRoutes, { path: "*", element: <>404</> }]);
}
