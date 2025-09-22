import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import Link from "next/link";
import { IdeaCard } from "@/components/IdeaCard";
import { EmptyIdeasFeed } from "@/components/EmptyStates";
import { getIdeasByGroupSlug } from "@/app/actions";

export default async function GroupFeedPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  // Fetch ideas from database
  const ideas = await getIdeasByGroupSlug(slug);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {slug.charAt(0).toUpperCase() + slug.slice(1)} Group
              </h1>
              <p className="text-gray-600 text-lg">
                Discover and share amazing travel ideas with your group
              </p>
            </div>
            <Link href={`/g/${slug}/availability`}>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Availability
              </Button>
            </Link>
          </div>
        </div>

        {/* Ideas Grid */}
        {ideas.length === 0 ? (
          <EmptyIdeasFeed groupSlug={slug} />
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {ideas.map((idea) => (
              <div key={idea.id} className="break-inside-avoid">
                <IdeaCard idea={idea} />
              </div>
            ))}
          </div>
        )}

        {/* Floating Action Button */}
        <Link href={`/g/${slug}/new`} className="fixed bottom-8 right-8 z-50">
          <Button 
            size="icon" 
            className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </div>
  );
}