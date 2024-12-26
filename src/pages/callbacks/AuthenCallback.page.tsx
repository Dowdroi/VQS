import React from "react";
import { HomeIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/Button";

const AuthenCallbackPage: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div className="max-w-lg w-full space-y-8 text-center">
      <h2 className="mt-6 text-3xl font-bold text-gray-900">
        Authen callback page
      </h2>
      <div className="mt-6">
        <Button onClick={() => location.replace("/")} className="">
          <HomeIcon className="h-5 w-5 mr-2" /> {"Go to dashboard"}
        </Button>
      </div>
    </div>
  </div>
);

export default AuthenCallbackPage;
