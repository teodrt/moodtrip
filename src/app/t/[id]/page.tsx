import { getTripById } from "@/app/actions";
import { TripBoard } from "./TripBoard";

export default async function TripPage({ params }: { params: { id: string } }) {
  const trip = await getTripById(params.id);

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trip Not Found</h1>
          <p className="text-gray-600">The trip you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return <TripBoard trip={trip} />;
}