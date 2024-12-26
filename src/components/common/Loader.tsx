import { cn } from "@/lib/utils";
import React from "react";

interface LoaderProps {
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ className }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
    <div className={cn("relative", className)}>
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

export default Loader;
