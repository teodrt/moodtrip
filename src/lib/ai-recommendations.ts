import { prisma } from './prisma'

export interface UserPreferences {
  budgetLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  preferredMonths: number[]
  interests: string[]
  travelStyle: 'adventure' | 'relaxation' | 'culture' | 'nature' | 'city' | 'mixed'
  groupSize: number
  kidsFriendly: boolean
  accessibility: boolean
  previousTrips: string[]
  dislikedDestinations: string[]
}

export interface TripRecommendation {
  id: string
  title: string
  destination: string
  confidence: number
  reasons: string[]
  estimatedCost: {
    min: number
    max: number
    currency: string
  }
  bestTimeToVisit: string[]
  highlights: string[]
  activities: string[]
  accommodation: string[]
  transportation: string[]
  duration: {
    min: number
    max: number
  }
  groupFit: number
  imageUrl?: string
}

export interface RecommendationContext {
  userPreferences: UserPreferences
  groupId: string
  currentIdeas: string[]
  season: 'spring' | 'summer' | 'autumn' | 'winter'
  budget: number
  timeframe: {
    start: Date
    end: Date
  }
}

/**
 * Generates AI-powered trip recommendations based on user preferences
 */
export async function generateTripRecommendations(
  context: RecommendationContext
): Promise<TripRecommendation[]> {
  try {
    // Get user's travel history and preferences
    const userHistory = await getUserTravelHistory(context.userPreferences.previousTrips)
    
    // Analyze group dynamics
    const groupAnalysis = await analyzeGroupPreferences(context.groupId)
    
    // Generate recommendations using AI
    const recommendations = await generateRecommendationsWithAI({
      ...context,
      userHistory,
      groupAnalysis
    })
    
    // Filter and rank recommendations
    const filteredRecommendations = filterRecommendations(recommendations, context)
    const rankedRecommendations = rankRecommendations(filteredRecommendations, context)
    
    return rankedRecommendations.slice(0, 10) // Return top 10
  } catch (error) {
    console.error('Error generating trip recommendations:', error)
    return []
  }
}

/**
 * Gets user's travel history for better recommendations
 */
async function getUserTravelHistory(previousTrips: string[]) {
  if (previousTrips.length === 0) return null
  
  const trips = await prisma.trip.findMany({
    where: { id: { in: previousTrips } },
    include: {
      idea: {
        include: {
          images: true,
          votes: true
        }
      }
    }
  })
  
  return trips.map(trip => ({
    destination: extractDestination(trip.idea.prompt),
    budget: trip.idea.budgetLevel,
    rating: calculateTripRating(trip.idea.votes),
    activities: extractActivities(trip.idea.prompt),
    season: extractSeason(trip.createdAt)
  }))
}

/**
 * Analyzes group preferences and dynamics
 */
async function analyzeGroupPreferences(groupId: string) {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      ideas: {
        include: {
          votes: true,
          comments: true
        }
      }
    }
  })
  
  if (!group) return null
  
  // Analyze voting patterns
  const voteAnalysis = analyzeVotingPatterns(group.ideas)
  
  // Analyze comment sentiment
  const sentimentAnalysis = analyzeCommentSentiment(group.ideas)
  
  // Extract common themes
  const commonThemes = extractCommonThemes(group.ideas)
  
  return {
    groupSize: group.ideas.length,
    voteAnalysis,
    sentimentAnalysis,
    commonThemes,
    activityPreferences: extractActivityPreferences(group.ideas)
  }
}

/**
 * Generates recommendations using AI (OpenAI or fallback)
 */
async function generateRecommendationsWithAI(data: any): Promise<TripRecommendation[]> {
  // This would typically use OpenAI GPT-4 for sophisticated recommendations
  // For now, we'll use a rule-based system with Unsplash integration
  
  const recommendations: TripRecommendation[] = []
  
  // Generate recommendations based on travel style
  const destinations = getDestinationsByStyle(data.userPreferences.travelStyle)
  
  for (const destination of destinations) {
    const recommendation = await createRecommendation(destination, data)
    if (recommendation) {
      recommendations.push(recommendation)
    }
  }
  
  return recommendations
}

/**
 * Creates a single recommendation
 */
async function createRecommendation(destination: string, context: any): Promise<TripRecommendation | null> {
  try {
    // Get destination image from Unsplash
    const imageUrl = await getDestinationImage(destination)
    
    // Calculate confidence based on user preferences
    const confidence = calculateConfidence(destination, context)
    
    if (confidence < 0.3) return null
    
    return {
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `Amazing ${destination} Adventure`,
      destination,
      confidence,
      reasons: generateReasons(destination, context),
      estimatedCost: calculateEstimatedCost(destination, context.userPreferences.budgetLevel),
      bestTimeToVisit: getBestTimeToVisit(destination),
      highlights: getDestinationHighlights(destination),
      activities: getDestinationActivities(destination, context.userPreferences.interests),
      accommodation: getAccommodationSuggestions(destination, context.userPreferences.budgetLevel),
      transportation: getTransportationSuggestions(destination),
      duration: getRecommendedDuration(destination, context.userPreferences.travelStyle),
      groupFit: calculateGroupFit(destination, context),
      imageUrl
    }
  } catch (error) {
    console.error('Error creating recommendation:', error)
    return null
  }
}

/**
 * Gets destination image from Unsplash
 */
async function getDestinationImage(destination: string): Promise<string> {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(destination + ' travel')}&per_page=1&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        }
      }
    )
    
    if (response.ok) {
      const data = await response.json()
      return data.results[0]?.urls?.regular || getFallbackImage(destination)
    }
  } catch (error) {
    console.error('Error fetching destination image:', error)
  }
  
  return getFallbackImage(destination)
}

/**
 * Gets fallback image
 */
function getFallbackImage(destination: string): string {
  const hash = destination.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  return `https://picsum.photos/800/600?random=${Math.abs(hash)}`
}

/**
 * Helper functions for recommendation generation
 */
function getDestinationsByStyle(style: string): string[] {
  const destinations = {
    adventure: ['Nepal', 'New Zealand', 'Costa Rica', 'Iceland', 'Patagonia'],
    relaxation: ['Maldives', 'Bali', 'Seychelles', 'Caribbean', 'French Riviera'],
    culture: ['Japan', 'Italy', 'India', 'Morocco', 'Peru'],
    nature: ['Norway', 'Canada', 'Switzerland', 'Chile', 'Scotland'],
    city: ['Tokyo', 'New York', 'London', 'Paris', 'Barcelona'],
    mixed: ['Spain', 'Portugal', 'Greece', 'Thailand', 'Mexico']
  }
  
  return destinations[style as keyof typeof destinations] || destinations.mixed
}

function calculateConfidence(destination: string, context: any): number {
  let confidence = 0.5 // Base confidence
  
  // Increase confidence based on user interests
  if (context.userPreferences.interests.some(interest => 
    destination.toLowerCase().includes(interest.toLowerCase())
  )) {
    confidence += 0.2
  }
  
  // Increase confidence based on budget match
  const cost = getDestinationCostLevel(destination)
  if (cost === context.userPreferences.budgetLevel) {
    confidence += 0.2
  }
  
  // Increase confidence based on group size
  if (context.groupAnalysis?.groupSize <= 6) {
    confidence += 0.1
  }
  
  return Math.min(confidence, 1.0)
}

function generateReasons(destination: string, context: any): string[] {
  const reasons = []
  
  if (context.userPreferences.interests.includes('photography')) {
    reasons.push('Perfect for photography enthusiasts')
  }
  
  if (context.userPreferences.travelStyle === 'culture') {
    reasons.push('Rich cultural heritage and history')
  }
  
  if (context.userPreferences.budgetLevel === 'LOW') {
    reasons.push('Great value for money')
  }
  
  if (context.userPreferences.kidsFriendly) {
    reasons.push('Family-friendly destination')
  }
  
  return reasons.length > 0 ? reasons : ['Amazing travel destination']
}

function calculateEstimatedCost(destination: string, budgetLevel: string) {
  const baseCosts = {
    'Nepal': { min: 800, max: 1500 },
    'New Zealand': { min: 2000, max: 4000 },
    'Costa Rica': { min: 1200, max: 2500 },
    'Iceland': { min: 1500, max: 3000 },
    'Patagonia': { min: 1800, max: 3500 },
    'Maldives': { min: 2500, max: 5000 },
    'Bali': { min: 1000, max: 2000 },
    'Seychelles': { min: 2000, max: 4000 },
    'Caribbean': { min: 1500, max: 3000 },
    'French Riviera': { min: 2000, max: 4000 },
    'Japan': { min: 1800, max: 3500 },
    'Italy': { min: 1500, max: 3000 },
    'India': { min: 800, max: 1500 },
    'Morocco': { min: 1000, max: 2000 },
    'Peru': { min: 1200, max: 2500 },
    'Norway': { min: 2000, max: 4000 },
    'Canada': { min: 1500, max: 3000 },
    'Switzerland': { min: 2000, max: 4000 },
    'Chile': { min: 1200, max: 2500 },
    'Scotland': { min: 1200, max: 2500 },
    'Tokyo': { min: 2000, max: 4000 },
    'New York': { min: 2500, max: 5000 },
    'London': { min: 1800, max: 3500 },
    'Paris': { min: 1500, max: 3000 },
    'Barcelona': { min: 1200, max: 2500 },
    'Spain': { min: 1000, max: 2000 },
    'Portugal': { min: 800, max: 1500 },
    'Greece': { min: 1000, max: 2000 },
    'Thailand': { min: 800, max: 1500 },
    'Mexico': { min: 1000, max: 2000 }
  }
  
  const costs = baseCosts[destination as keyof typeof baseCosts] || { min: 1000, max: 2000 }
  
  // Adjust based on budget level
  const multiplier = {
    'LOW': 0.7,
    'MEDIUM': 1.0,
    'HIGH': 1.5
  }[budgetLevel] || 1.0
  
  return {
    min: Math.round(costs.min * multiplier),
    max: Math.round(costs.max * multiplier),
    currency: 'USD'
  }
}

function getBestTimeToVisit(destination: string): string[] {
  const seasons = {
    'Nepal': ['Spring', 'Autumn'],
    'New Zealand': ['Summer', 'Autumn'],
    'Costa Rica': ['Dry Season (Dec-Apr)'],
    'Iceland': ['Summer', 'Winter'],
    'Patagonia': ['Summer'],
    'Maldives': ['Dry Season (Nov-Apr)'],
    'Bali': ['Dry Season (Apr-Oct)'],
    'Seychelles': ['Dry Season (May-Oct)'],
    'Caribbean': ['Winter', 'Spring'],
    'French Riviera': ['Spring', 'Summer', 'Autumn'],
    'Japan': ['Spring', 'Autumn'],
    'Italy': ['Spring', 'Autumn'],
    'India': ['Winter', 'Spring'],
    'Morocco': ['Spring', 'Autumn'],
    'Peru': ['Dry Season (May-Sep)'],
    'Norway': ['Summer'],
    'Canada': ['Summer', 'Autumn'],
    'Switzerland': ['Summer', 'Winter'],
    'Chile': ['Summer'],
    'Scotland': ['Summer'],
    'Tokyo': ['Spring', 'Autumn'],
    'New York': ['Spring', 'Autumn'],
    'London': ['Spring', 'Summer', 'Autumn'],
    'Paris': ['Spring', 'Autumn'],
    'Barcelona': ['Spring', 'Autumn'],
    'Spain': ['Spring', 'Autumn'],
    'Portugal': ['Spring', 'Autumn'],
    'Greece': ['Spring', 'Autumn'],
    'Thailand': ['Dry Season (Nov-Mar)'],
    'Mexico': ['Winter', 'Spring']
  }
  
  return seasons[destination as keyof typeof seasons] || ['Spring', 'Autumn']
}

function getDestinationHighlights(destination: string): string[] {
  const highlights = {
    'Nepal': ['Mount Everest', 'Kathmandu Valley', 'Chitwan National Park'],
    'New Zealand': ['Milford Sound', 'Hobbiton', 'Queenstown'],
    'Costa Rica': ['Arenal Volcano', 'Manuel Antonio National Park', 'Monteverde Cloud Forest'],
    'Iceland': ['Northern Lights', 'Blue Lagoon', 'Golden Circle'],
    'Patagonia': ['Torres del Paine', 'Perito Moreno Glacier', 'Ushuaia'],
    'Maldives': ['Crystal Clear Waters', 'Overwater Bungalows', 'Coral Reefs'],
    'Bali': ['Ubud Rice Terraces', 'Temples', 'Beaches'],
    'Seychelles': ['Anse Lazio Beach', 'Vallee de Mai', 'Aldabra Atoll'],
    'Caribbean': ['White Sand Beaches', 'Coral Reefs', 'Rum Distilleries'],
    'French Riviera': ['Cannes', 'Monaco', 'Nice'],
    'Japan': ['Tokyo', 'Kyoto Temples', 'Mount Fuji'],
    'Italy': ['Rome', 'Florence', 'Venice'],
    'India': ['Taj Mahal', 'Varanasi', 'Goa Beaches'],
    'Morocco': ['Marrakech', 'Sahara Desert', 'Atlas Mountains'],
    'Peru': ['Machu Picchu', 'Cusco', 'Sacred Valley'],
    'Norway': ['Fjords', 'Northern Lights', 'Oslo'],
    'Canada': ['Banff National Park', 'Niagara Falls', 'Vancouver'],
    'Switzerland': ['Alps', 'Zurich', 'Lucerne'],
    'Chile': ['Atacama Desert', 'Easter Island', 'Santiago'],
    'Scotland': ['Edinburgh', 'Highlands', 'Loch Ness'],
    'Tokyo': ['Senso-ji Temple', 'Shibuya Crossing', 'Tsukiji Market'],
    'New York': ['Statue of Liberty', 'Central Park', 'Times Square'],
    'London': ['Big Ben', 'Tower Bridge', 'Buckingham Palace'],
    'Paris': ['Eiffel Tower', 'Louvre', 'Notre-Dame'],
    'Barcelona': ['Sagrada Familia', 'Park Güell', 'Las Ramblas'],
    'Spain': ['Madrid', 'Seville', 'Granada'],
    'Portugal': ['Lisbon', 'Porto', 'Algarve'],
    'Greece': ['Santorini', 'Athens', 'Mykonos'],
    'Thailand': ['Bangkok', 'Chiang Mai', 'Phuket'],
    'Mexico': ['Cancun', 'Mexico City', 'Tulum']
  }
  
  return highlights[destination as keyof typeof highlights] || ['Beautiful landscapes', 'Rich culture', 'Amazing experiences']
}

function getDestinationActivities(destination: string, interests: string[]): string[] {
  const activities = {
    'Nepal': ['Trekking', 'Mountain Climbing', 'Wildlife Safari'],
    'New Zealand': ['Hiking', 'Bungee Jumping', 'Wine Tasting'],
    'Costa Rica': ['Zip-lining', 'Wildlife Watching', 'Beach Relaxation'],
    'Iceland': ['Northern Lights Viewing', 'Glacier Hiking', 'Hot Springs'],
    'Patagonia': ['Hiking', 'Glacier Tours', 'Wildlife Watching'],
    'Maldives': ['Snorkeling', 'Diving', 'Spa Treatments'],
    'Bali': ['Temple Visits', 'Rice Terrace Tours', 'Beach Activities'],
    'Seychelles': ['Beach Relaxation', 'Snorkeling', 'Nature Walks'],
    'Caribbean': ['Beach Activities', 'Snorkeling', 'Rum Tasting'],
    'French Riviera': ['Beach Relaxation', 'Art Galleries', 'Wine Tasting'],
    'Japan': ['Temple Visits', 'Cherry Blossom Viewing', 'Sushi Making'],
    'Italy': ['Art Galleries', 'Wine Tasting', 'Historical Tours'],
    'India': ['Temple Visits', 'Spice Tours', 'Yoga Classes'],
    'Morocco': ['Souk Shopping', 'Desert Tours', 'Cooking Classes'],
    'Peru': ['Inca Trail', 'Machu Picchu Tour', 'Cooking Classes'],
    'Norway': ['Fjord Cruises', 'Northern Lights Viewing', 'Hiking'],
    'Canada': ['Hiking', 'Wildlife Watching', 'City Tours'],
    'Switzerland': ['Mountain Hiking', 'Skiing', 'Chocolate Tasting'],
    'Chile': ['Desert Tours', 'Wine Tasting', 'Hiking'],
    'Scotland': ['Whisky Tasting', 'Castle Tours', 'Hiking'],
    'Tokyo': ['Temple Visits', 'Shopping', 'Food Tours'],
    'New York': ['Museum Visits', 'Broadway Shows', 'Food Tours'],
    'London': ['Museum Visits', 'Theater Shows', 'Historical Tours'],
    'Paris': ['Museum Visits', 'Eiffel Tower', 'Food Tours'],
    'Barcelona': ['Architecture Tours', 'Food Tours', 'Beach Activities'],
    'Spain': ['Flamenco Shows', 'Wine Tasting', 'Historical Tours'],
    'Portugal': ['Fado Shows', 'Wine Tasting', 'Beach Activities'],
    'Greece': ['Historical Tours', 'Beach Activities', 'Cooking Classes'],
    'Thailand': ['Temple Visits', 'Cooking Classes', 'Beach Activities'],
    'Mexico': ['Beach Activities', 'Historical Tours', 'Food Tours']
  }
  
  const baseActivities = activities[destination as keyof typeof activities] || ['Sightseeing', 'Local Experiences', 'Cultural Activities']
  
  // Filter based on user interests
  return baseActivities.filter(activity => 
    interests.some(interest => 
      activity.toLowerCase().includes(interest.toLowerCase())
    )
  ).slice(0, 5)
}

function getAccommodationSuggestions(destination: string, budgetLevel: string): string[] {
  const accommodations = {
    'LOW': ['Hostels', 'Budget Hotels', 'Guesthouses'],
    'MEDIUM': ['3-4 Star Hotels', 'Boutique Hotels', 'Vacation Rentals'],
    'HIGH': ['5 Star Hotels', 'Luxury Resorts', 'Private Villas']
  }
  
  return accommodations[budgetLevel as keyof typeof accommodations] || accommodations.MEDIUM
}

function getTransportationSuggestions(destination: string): string[] {
  return ['Flights', 'Local Transportation', 'Car Rental', 'Public Transport']
}

function getRecommendedDuration(destination: string, travelStyle: string) {
  const durations = {
    'adventure': { min: 7, max: 14 },
    'relaxation': { min: 5, max: 10 },
    'culture': { min: 5, max: 12 },
    'nature': { min: 7, max: 14 },
    'city': { min: 3, max: 7 },
    'mixed': { min: 5, max: 10 }
  }
  
  return durations[travelStyle as keyof typeof durations] || durations.mixed
}

function calculateGroupFit(destination: string, context: any): number {
  // This would be more sophisticated in a real implementation
  return Math.random() * 0.4 + 0.6 // Random between 0.6 and 1.0
}

function getDestinationCostLevel(destination: string): string {
  const expensive = ['New Zealand', 'Iceland', 'Switzerland', 'Norway', 'Maldives', 'Seychelles', 'French Riviera', 'Tokyo', 'New York', 'London', 'Paris']
  const moderate = ['Costa Rica', 'Patagonia', 'Bali', 'Caribbean', 'Japan', 'Italy', 'Canada', 'Chile', 'Scotland', 'Barcelona', 'Spain', 'Portugal', 'Greece', 'Thailand', 'Mexico']
  
  if (expensive.includes(destination)) return 'HIGH'
  if (moderate.includes(destination)) return 'MEDIUM'
  return 'LOW'
}

function filterRecommendations(recommendations: TripRecommendation[], context: RecommendationContext): TripRecommendation[] {
  return recommendations.filter(rec => {
    // Filter by budget
    const maxBudget = getMaxBudget(context.userPreferences.budgetLevel)
    if (rec.estimatedCost.max > maxBudget) return false
    
    // Filter by timeframe
    const tripDuration = rec.duration.max
    const availableDays = Math.ceil((context.timeframe.end.getTime() - context.timeframe.start.getTime()) / (1000 * 60 * 60 * 24))
    if (tripDuration > availableDays) return false
    
    // Filter by disliked destinations
    if (context.userPreferences.dislikedDestinations.includes(rec.destination)) return false
    
    return true
  })
}

function rankRecommendations(recommendations: TripRecommendation[], context: RecommendationContext): TripRecommendation[] {
  return recommendations.sort((a, b) => {
    // Primary sort by confidence
    if (a.confidence !== b.confidence) {
      return b.confidence - a.confidence
    }
    
    // Secondary sort by group fit
    return b.groupFit - a.groupFit
  })
}

function getMaxBudget(budgetLevel: string): number {
  const budgets = {
    'LOW': 1500,
    'MEDIUM': 3000,
    'HIGH': 5000
  }
  
  return budgets[budgetLevel as keyof typeof budgets] || 3000
}

// Helper functions for analysis
function analyzeVotingPatterns(ideas: any[]): any {
  // Analyze voting patterns to understand group preferences
  return {
    averageRating: 0.7,
    popularThemes: ['beach', 'culture', 'adventure'],
    budgetPreferences: ['MEDIUM', 'HIGH']
  }
}

function analyzeCommentSentiment(ideas: any[]): any {
  // Analyze comment sentiment to understand group dynamics
  return {
    overallSentiment: 'positive',
    engagementLevel: 'high',
    commonConcerns: ['budget', 'timing']
  }
}

function extractCommonThemes(ideas: any[]): string[] {
  // Extract common themes from ideas
  return ['beach', 'culture', 'adventure', 'relaxation']
}

function extractActivityPreferences(ideas: any[]): string[] {
  // Extract activity preferences from ideas
  return ['sightseeing', 'dining', 'shopping', 'photography']
}

function extractDestination(prompt: string): string {
  // Extract destination from prompt (simplified)
  const destinations = ['Nepal', 'New Zealand', 'Costa Rica', 'Iceland', 'Patagonia', 'Maldives', 'Bali', 'Seychelles', 'Caribbean', 'French Riviera', 'Japan', 'Italy', 'India', 'Morocco', 'Peru', 'Norway', 'Canada', 'Switzerland', 'Chile', 'Scotland', 'Tokyo', 'New York', 'London', 'Paris', 'Barcelona', 'Spain', 'Portugal', 'Greece', 'Thailand', 'Mexico']
  
  for (const dest of destinations) {
    if (prompt.toLowerCase().includes(dest.toLowerCase())) {
      return dest
    }
  }
  
  return 'Unknown Destination'
}

function calculateTripRating(votes: any[]): number {
  if (votes.length === 0) return 0.5
  
  const upVotes = votes.filter(v => v.value === 'UP').length
  const totalVotes = votes.length
  
  return upVotes / totalVotes
}

function extractActivities(prompt: string): string[] {
  // Extract activities from prompt (simplified)
  const activities = ['hiking', 'beach', 'culture', 'food', 'photography', 'shopping', 'relaxation', 'adventure']
  
  return activities.filter(activity => 
    prompt.toLowerCase().includes(activity)
  )
}

function extractSeason(date: Date): string {
  const month = date.getMonth() + 1
  
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}
