import React from "react";

const authRoutes: any = [
  {
    path: "/sign-in",
    component: React.lazy(() => import("@/pages/sign-in/SignIn.page")),
  },
];

export default authRoutes;
