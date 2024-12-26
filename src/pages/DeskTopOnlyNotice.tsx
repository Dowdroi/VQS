import React from "react";
import { useViewportWidth } from "../hooks/UseViewportWidth";

interface DesktopOnlyNoticeProps {
  minWidth?: number;
  children: React.ReactNode;
}

export const DesktopOnlyNotice: React.FC<DesktopOnlyNoticeProps> = ({
  minWidth = 800,
  children,
}) => {
  const width = useViewportWidth();

  if (width >= minWidth) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Desktop Only</h2>
        <p className="mb-4">
          We're sorry, but this application is only supported on desktop
          devices.
        </p>
        <p>
          Please access this site from a device with a larger screen for the
          best experience.
        </p>
      </div>
    </div>
  );
};
