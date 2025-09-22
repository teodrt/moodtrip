import { getGroupAvailability } from "@/app/actions";
import { AvailabilityForm } from "./AvailabilityForm";
import { GroupHeatmap } from "./GroupHeatmap";

export default async function AvailabilityPage({ params }: { params: { slug: string } }) {
  const groupAvailability = await getGroupAvailability(params.slug);

  if (!groupAvailability) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Group Not Found</h1>
          <p className="text-gray-600">The group you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Availability for {groupAvailability.groupName}
          </h1>
          <p className="text-gray-600 text-lg">
            Set your availability for each month and see the group&apos;s overall availability
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Availability Form */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Availability</h2>
            <AvailabilityForm 
              groupId={groupAvailability.groupId}
              initialAvailability={groupAvailability.userAvailability}
            />
          </div>

          {/* Group Heatmap */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Group Availability</h2>
            <GroupHeatmap groupAvailability={groupAvailability.groupAvailability} />
          </div>
        </div>
      </div>
    </div>
  );
}
