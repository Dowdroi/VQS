import {
  BrowserRouter,
  Outlet,
  // Outlet,
  Route,
  Routes,
  useLocation,
  // useLocation,
} from "react-router-dom";
import { RouteConfig } from "./Routes";
import { Suspense, useEffect, useState } from "react";
import protectedRoutes from "./ProtectedRoutes";
import ProtectedRoute from "@/providers/ProtectedRoute";
import NotFoundPage from "@/pages/404/404.page";
import AuthenCallbackPage from "@/pages/callbacks/AuthenCallback.page";
import Layout from "@/pages/layout";
import Loader from "@/components/common/Loader";
import AuthRoute from "@/providers/AuthRoute.component";
import AuthLayout from "@/pages/auth.layout";
import authRoutes from "./Authroutes";
import Stores from "@/stores/Stores";
import { observer } from "mobx-react";

const Router = observer(() => {
  const RouteWithLayout = ({
    component: Component,
    layout: Layout,
    path,
    hideSidebar,
  }: RouteConfig) => {
    const location = useLocation();
    const isExactPath = location.pathname === path;

    return Layout ? (
      <Layout hideSidebar={hideSidebar}>
        {isExactPath && <Component />}
        <Outlet />
      </Layout>
    ) : (
      <>
        {isExactPath && <Component />}
        <Outlet />
      </>
    );
  };

  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    // Set a 5-second timeout
    const timer = setTimeout(() => {
      setIsTimeout(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const renderRoutes = (routes: RouteConfig[]) =>
    routes.map((route) => (
      <Route
        key={route.path}
        path={route.path}
        element={<RouteWithLayout {...route} />}
      >
        {route.children && renderRoutes(route.children)}
      </Route>
    ));

  if (
    Stores?.organizationStore?.currentOrganization?.id === undefined &&
    !isTimeout
  ) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader className=" animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <div className="min-h-screen font-tomato">
          <Routes>
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                {renderRoutes(
                  protectedRoutes.map((route) => ({
                    ...route,
                    breadcrumb: "",
                    title: "",
                  }))
                )}
              </Route>
            </Route>
            {/* Auth routes */}
            <Route element={<AuthRoute />}>
              <Route element={<AuthLayout />}>
                {renderRoutes(
                  authRoutes.map((route: any) => ({
                    ...route,
                    breadcrumb: "",
                    title: "",
                  }))
                )}
              </Route>
            </Route>
            <Route path="/authen-callback" element={<AuthenCallbackPage />} />
            {/* Not Found route */}
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Suspense>
    </BrowserRouter>
  );
});

export default Router;
