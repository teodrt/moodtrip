import { IdeaDetailSkeleton } from "@/components/IdeaDetailSkeleton";
import { getIdeaById } from "@/app/actions";
import { IdeaDetailClient } from "./IdeaDetailClient";

export default async function IdeaDetailPage({ params }: { params: { id: string } }) {
  const idea = await getIdeaById(params.id);

  if (!idea) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Idea Not Found</h1>
          <p className="text-gray-600">The idea you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        </div>
      </div>
    );
  }

  // Show skeleton if idea is still being generated
  if (idea.status === 'DRAFT') {
    return <IdeaDetailSkeleton />;
  }

  return <IdeaDetailClient idea={idea} />;
}