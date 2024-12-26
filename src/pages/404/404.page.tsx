import { Button } from "@/components/ui/Button";
import { HomeIcon } from "lucide-react";
import React from "react";

const ComingSoonPage: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div className="max-w-lg w-full space-y-8 text-center">
      <div className="animate-pulse">
        <h1 className="text-6xl font-extrabold text-brand-01">Coming Soon</h1>
      </div>
      <h2 className="mt-6 text-3xl font-bold text-gray-900">
        We're working on something awesome!
      </h2>
      <p className="mt-2 text-lg text-gray-600">
        Our new feature is under construction. We'll be launching soon, so stay
        tuned!
      </p>
      <div className="mt-6">
        <Button onClick={() => (window.location.href = "/")} className="">
          <HomeIcon className="h-5 w-5 mr-2" /> Go back home
        </Button>
      </div>
    </div>
  </div>
);

export default ComingSoonPage;
