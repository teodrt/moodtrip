export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🧳 MoodTrip
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          AI-Powered Travel Planning
        </p>
        <div className="space-y-4">
          <a 
            href="/g/family" 
            className="block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            View Family Group
          </a>
          <a 
            href="/g/family/new" 
            className="block bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Create New Idea
          </a>
        </div>
      </div>
    </div>
  )
}