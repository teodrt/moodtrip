'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Star, 
  Clock, 
  Plane, 
  Hotel, 
  Car,
  Sparkles,
  TrendingUp,
  Heart,
  Share2,
  Bookmark
} from 'lucide-react'
import { generateTripRecommendations, TripRecommendation, RecommendationContext } from '@/lib/ai-recommendations'
import { useToastActions } from '@/components/ToastSystem'
import { OptimizedImage } from '@/components/OptimizedImage'

interface AIRecommendationsProps {
  groupId: string
  userPreferences?: {
    budgetLevel: 'LOW' | 'MEDIUM' | 'HIGH'
    preferredMonths: number[]
    interests: string[]
    travelStyle: 'adventure' | 'relaxation' | 'culture' | 'nature' | 'city' | 'mixed'
    groupSize: number
    kidsFriendly: boolean
    accessibility: boolean
  }
  className?: string
}

export function AIRecommendations({ 
  groupId, 
  userPreferences,
  className 
}: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<TripRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedRecommendation, setSelectedRecommendation] = useState<TripRecommendation | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const { success, error } = useToastActions()

  const defaultPreferences = {
    budgetLevel: 'MEDIUM' as const,
    preferredMonths: [6, 7, 8], // Summer
    interests: ['culture', 'nature', 'food'],
    travelStyle: 'mixed' as const,
    groupSize: 4,
    kidsFriendly: false,
    accessibility: false,
    previousTrips: [],
    dislikedDestinations: []
  }

  const context: RecommendationContext = {
    userPreferences: { ...defaultPreferences, ...userPreferences },
    groupId,
    currentIdeas: [],
    season: 'summer',
    budget: 3000,
    timeframe: {
      start: new Date(),
      end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    }
  }

  const loadRecommendations = async () => {
    setLoading(true)
    try {
      const recs = await generateTripRecommendations(context)
      setRecommendations(recs)
      success('AI recommendations loaded successfully!')
    } catch (err) {
      error('Failed to load recommendations', 'Please try again later')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecommendations()
  }, [groupId])

  const handleRecommendationClick = (recommendation: TripRecommendation) => {
    setSelectedRecommendation(recommendation)
    setShowDetails(true)
  }

  const handleCreateIdea = (recommendation: TripRecommendation) => {
    // This would typically navigate to create idea page with pre-filled data
    success('Creating idea from recommendation...')
    console.log('Creating idea from:', recommendation)
  }

  const handleSaveRecommendation = (recommendation: TripRecommendation) => {
    // This would save the recommendation to user's saved items
    success('Recommendation saved!')
  }

  const handleShareRecommendation = (recommendation: TripRecommendation) => {
    // This would share the recommendation
    success('Recommendation shared!')
  }

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-blue-500 animate-pulse" />
          <h2 className="text-xl font-semibold">AI-Powered Recommendations</h2>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-bold">AI-Powered Recommendations</h2>
        </div>
        <Button 
          onClick={loadRecommendations}
          variant="outline"
          size="sm"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {recommendations.map((recommendation, index) => (
            <motion.div
              key={recommendation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card 
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => handleRecommendationClick(recommendation)}
              >
                <div className="relative">
                  {recommendation.imageUrl && (
                    <OptimizedImage
                      src={recommendation.imageUrl}
                      alt={recommendation.destination}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge 
                      variant="secondary" 
                      className="bg-white/90 text-gray-900"
                    >
                      {Math.round(recommendation.confidence * 100)}% match
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                  <CardDescription className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{recommendation.destination}</span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Confidence Score */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Match Score</span>
                      <span>{Math.round(recommendation.confidence * 100)}%</span>
                    </div>
                    <Progress value={recommendation.confidence * 100} className="h-2" />
                  </div>
                  
                  {/* Key Info */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span>${recommendation.estimatedCost.min}-{recommendation.estimatedCost.max}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>{recommendation.duration.min}-{recommendation.duration.max} days</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-purple-500" />
                      <span>{Math.round(recommendation.groupFit * 100)}% group fit</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{recommendation.highlights.length} highlights</span>
                    </div>
                  </div>
                  
                  {/* Reasons */}
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-gray-700">Why this trip?</h4>
                    <div className="flex flex-wrap gap-1">
                      {recommendation.reasons.slice(0, 2).map((reason, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {reason}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCreateIdea(recommendation)
                      }}
                    >
                      Create Idea
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSaveRecommendation(recommendation)
                      }}
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleShareRecommendation(recommendation)
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Recommendation Details Modal */}
      <AnimatePresence>
        {showDetails && selectedRecommendation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">{selectedRecommendation.title}</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowDetails(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                {selectedRecommendation.imageUrl && (
                  <OptimizedImage
                    src={selectedRecommendation.imageUrl}
                    alt={selectedRecommendation.destination}
                    width={800}
                    height={400}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}
                
                <div className="space-y-6">
                  {/* Overview */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Overview</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <DollarSign className="h-6 w-6 mx-auto text-green-500 mb-1" />
                        <div className="text-sm font-medium">Cost</div>
                        <div className="text-lg font-bold">${selectedRecommendation.estimatedCost.min}-{selectedRecommendation.estimatedCost.max}</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Clock className="h-6 w-6 mx-auto text-blue-500 mb-1" />
                        <div className="text-sm font-medium">Duration</div>
                        <div className="text-lg font-bold">{selectedRecommendation.duration.min}-{selectedRecommendation.duration.max} days</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Users className="h-6 w-6 mx-auto text-purple-500 mb-1" />
                        <div className="text-sm font-medium">Group Fit</div>
                        <div className="text-lg font-bold">{Math.round(selectedRecommendation.groupFit * 100)}%</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Star className="h-6 w-6 mx-auto text-yellow-500 mb-1" />
                        <div className="text-sm font-medium">Confidence</div>
                        <div className="text-lg font-bold">{Math.round(selectedRecommendation.confidence * 100)}%</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Highlights */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Highlights</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecommendation.highlights.map((highlight, i) => (
                        <Badge key={i} variant="secondary" className="text-sm">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Activities */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Activities</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedRecommendation.activities.map((activity, i) => (
                        <div key={i} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Best Time to Visit */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Best Time to Visit</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecommendation.bestTimeToVisit.map((time, i) => (
                        <Badge key={i} variant="outline" className="text-sm">
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Accommodation & Transportation */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-3 flex items-center">
                        <Hotel className="h-5 w-5 mr-2" />
                        Accommodation
                      </h4>
                      <div className="space-y-1">
                        {selectedRecommendation.accommodation.map((acc, i) => (
                          <div key={i} className="text-sm text-gray-600">• {acc}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-3 flex items-center">
                        <Car className="h-5 w-5 mr-2" />
                        Transportation
                      </h4>
                      <div className="space-y-1">
                        {selectedRecommendation.transportation.map((trans, i) => (
                          <div key={i} className="text-sm text-gray-600">• {trans}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4 border-t">
                    <Button 
                      onClick={() => handleCreateIdea(selectedRecommendation)}
                      className="flex-1"
                    >
                      Create Idea from This
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleSaveRecommendation(selectedRecommendation)}
                    >
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleShareRecommendation(selectedRecommendation)}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}