import React from "react";
import { ClipboardCheckIcon } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";
import TaskIcon from "@assets/icons/check-done-icon.png";

export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  breadcrumb: string;
  title: string;
  img?: {
    src?: string;
    className?: string;
  };
  icon?: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, "ref"> & RefAttributes<SVGSVGElement>
  >;
  children?: RouteConfig[];
  href?: string;
  layout?: React.LazyExoticComponent<React.ComponentType<any>>;
  hideInNav?: boolean | undefined;
  hideSidebar?: boolean | undefined;
}

export interface BreadcrumbConfig {
  path: string;
  breadcrumb: string;
  children?: BreadcrumbConfig[];
}

export const routes: RouteConfig[] = [
  {
    path: "/",
    component: React.lazy(() => import("@/pages/task/TaskList.page")),
    breadcrumb: "Task list",
    title: "Task list",
    img: {
      src: TaskIcon,
      className: "h-6 w-6",
    },
    hideInNav: false,
    icon: ClipboardCheckIcon,
    children: [],
  },
  {
    path: "/task",
    component: React.lazy(() => import("@/pages/task/detail/TaskDetail")),
    layout: React.lazy(() => import("@/pages/task/detail/TaskDetail")),
    breadcrumb: "Task Detail",
    title: "Task Detail",
    hideInNav: true,
    children: [
      {
        path: "/:taskType/:taskId",
        component: React.lazy(() => import("@/pages/task/TaskList.page")),
        breadcrumb: "Task Detail",
        title: "Task Detail",
        hideInNav: true,
        children: [],
      },
    ],
  },
];
