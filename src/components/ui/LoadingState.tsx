import { Skeleton } from "./Skeleton";

export const LoadingState = () => (
  <div className="max-w-7xl mx-auto w-full mt-6">
    <div className="space-y-6">
      <Skeleton className="h-8 w-1/4" />
      <Skeleton className="h-10 w-full" />

      <div className="space-y-2">
        <Skeleton className="h-8 w-1/4" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-16" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-64" />
      </div>

      <div className="flex justify-center space-x-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  </div>
);
