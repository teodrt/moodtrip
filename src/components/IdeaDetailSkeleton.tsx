import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function IdeaDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-8 w-96 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="md:col-span-2 space-y-8">
            {/* Image Mosaic Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="grid grid-cols-2 gap-2 h-64 rounded-lg overflow-hidden">
                <div className="row-span-2">
                  <Skeleton className="w-full h-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="w-full h-32" />
                  <Skeleton className="w-full h-32" />
                </div>
              </div>
            </div>

            {/* Color Palette Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-12 rounded-lg" />
                ))}
              </div>
            </div>

            {/* AI Summary Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Voting and Comments Skeleton */}
            <div className="space-y-6">
              <div className="flex gap-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
              
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="md:col-span-1 space-y-6">
            {/* Author Card Skeleton */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Idea Details Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Promote to Trip Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
