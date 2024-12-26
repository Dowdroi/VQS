import { NavItem } from "@/constants/AppConstant";
import { RouteConfig, BreadcrumbConfig } from "./Routes";

export const buildFullPath = (
  route: RouteConfig,
  parentPath: string = ""
): RouteConfig => {
  const fullPath = `${parentPath}/${route.path}`.replace(/\/+/g, "/");
  return {
    ...route,
    path: fullPath,
    children: route.children?.map((child) => buildFullPath(child, fullPath)),
  };
};

export const getProtectedRoutes = (routes: RouteConfig[]): RouteConfig[] =>
  routes.map((route) => buildFullPath(route));

export const getNavItems = (routes: RouteConfig[]): NavItem[] => {
  const buildNavItems = (
    routes: RouteConfig[],
    parentPath: string = ""
  ): NavItem[] =>
    routes
      .filter((route) => !route.hideInNav)
      .map((route) => {
        const fullPath = `${parentPath}/${route.path}`.replace(/\/+/g, "/");
        return {
          href: fullPath,
          title: route.title,
          img: {
            src: route.img?.src ?? "",
            className: route.img?.className ?? "",
          },
          icon: route.icon,
          children: route.children
            ? buildNavItems(route.children, fullPath)
            : undefined,
        };
      });
  return buildNavItems(routes);
};

export const getBreadcrumbsConfig = (
  routes: RouteConfig[]
): BreadcrumbConfig[] =>
  routes.map((route) => ({
    path: route.path,
    breadcrumb: route.breadcrumb,
    children: route.children ? getBreadcrumbsConfig(route.children) : undefined,
  }));

export const getRoutesWithFullPaths = (routes: RouteConfig[]): RouteConfig[] =>
  routes.map((route) => buildFullPath(route));
