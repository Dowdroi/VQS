import { routes } from "./Routes";
import { getProtectedRoutes } from "./RouteUtils";

const protectedRoutes = getProtectedRoutes(routes);

export default protectedRoutes;
