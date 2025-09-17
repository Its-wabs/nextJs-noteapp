import { Skeleton } from "./ui/skeleton";

export function PageSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <Skeleton className="h-8 w-1/4" /> {/* Heading */}
      <Skeleton className="h-4 w-1/2" /> {/* Paragraph */}
      <Skeleton className="h-64 w-full rounded-md" /> {/* Main content area */}
    </div>
  );
}
