import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => (
  <div className={`h-screen bg-cover bg-center bg-no-repeat bg-[#fbfbfb]`}>
    <div className="flex h-screen overflow-hidden">
      <div className="relative min-h-screen w-full overflow-auto">
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  </div>
);

export default AuthLayout;
