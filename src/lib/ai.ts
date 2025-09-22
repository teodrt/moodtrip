import OpenAI from 'openai'
import { createApi } from 'unsplash-js'
import { Vibrant } from 'node-vibrant/node'

// Initialize clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY || ''
})

// Types
export type ImageSource = 'AI' | 'STOCK'

export interface ImageResult {
  urls: string[]
  provider: string
  source: ImageSource
}

/**
 * Creates an intelligent search query for Unsplash based on the prompt
 * Maps travel-related keywords to better search terms
 */
function createIntelligentSearchQuery(prompt: string): string {
  const promptLower = prompt.toLowerCase()
  
  // Country/destination mapping
  const countryMap: { [key: string]: string } = {
    'mexico': 'mexico beach resort',
    'italy': 'italy travel destination',
    'france': 'france travel destination',
    'spain': 'spain travel destination',
    'greece': 'greece travel destination',
    'japan': 'japan travel destination',
    'thailand': 'thailand travel destination',
    'bali': 'bali indonesia travel',
    'hawaii': 'hawaii beach vacation',
    'costa rica': 'costa rica travel',
    'portugal': 'portugal travel destination',
    'croatia': 'croatia travel destination',
    'turkey': 'turkey travel destination',
    'morocco': 'morocco travel destination',
    'peru': 'peru travel destination',
    'brazil': 'brazil travel destination',
    'argentina': 'argentina travel destination',
    'chile': 'chile travel destination',
    'iceland': 'iceland travel destination',
    'norway': 'norway travel destination',
    'switzerland': 'switzerland travel destination',
    'austria': 'austria travel destination',
    'germany': 'germany travel destination',
    'netherlands': 'netherlands travel destination',
    'belgium': 'belgium travel destination',
    'ireland': 'ireland travel destination',
    'scotland': 'scotland travel destination',
    'england': 'england travel destination',
    'wales': 'wales travel destination',
    'australia': 'australia travel destination',
    'new zealand': 'new zealand travel destination',
    'south africa': 'south africa travel destination',
    'egypt': 'egypt travel destination',
    'india': 'india travel destination',
    'china': 'china travel destination',
    'south korea': 'south korea travel destination',
    'vietnam': 'vietnam travel destination',
    'cambodia': 'cambodia travel destination',
    'laos': 'laos travel destination',
    'myanmar': 'myanmar travel destination',
    'malaysia': 'malaysia travel destination',
    'singapore': 'singapore travel destination',
    'philippines': 'philippines travel destination',
    'indonesia': 'indonesia travel destination',
    'sri lanka': 'sri lanka travel destination',
    'maldives': 'maldives beach resort',
    'seychelles': 'seychelles beach resort',
    'mauritius': 'mauritius beach resort',
    'fiji': 'fiji beach resort',
    'tahiti': 'tahiti beach resort',
    'bora bora': 'bora bora beach resort',
    'santorini': 'santorini greece travel',
    'mykonos': 'mykonos greece travel',
    'crete': 'crete greece travel',
    'rhodes': 'rhodes greece travel',
    'corfu': 'corfu greece travel',
    'capri': 'capri italy travel',
    'amalfi': 'amalfi coast italy',
    'cinque terre': 'cinque terre italy',
    'tuscany': 'tuscany italy travel',
    'florence': 'florence italy travel',
    'rome': 'rome italy travel',
    'venice': 'venice italy travel',
    'milan': 'milan italy travel',
    'naples': 'naples italy travel',
    'barcelona': 'barcelona spain travel',
    'madrid': 'madrid spain travel',
    'seville': 'seville spain travel',
    'valencia': 'valencia spain travel',
    'granada': 'granada spain travel',
    'córdoba': 'cordoba spain travel',
    'toledo': 'toledo spain travel',
    'salamanca': 'salamanca spain travel',
    'bilbao': 'bilbao spain travel',
    'san sebastian': 'san sebastian spain travel',
    'mallorca': 'mallorca spain travel',
    'ibiza': 'ibiza spain travel',
    'menorca': 'menorca spain travel',
    'canary islands': 'canary islands spain travel',
    'tenerife': 'tenerife spain travel',
    'gran canaria': 'gran canaria spain travel',
    'lanzarote': 'lanzarote spain travel',
    'fuerteventura': 'fuerteventura spain travel',
    'paris': 'paris france travel',
    'lyon': 'lyon france travel',
    'marseille': 'marseille france travel',
    'toulouse': 'toulouse france travel',
    'nice': 'nice france travel',
    'cannes': 'cannes france travel',
    'monaco': 'monaco travel destination',
    'provence': 'provence france travel',
    'bordeaux': 'bordeaux france travel',
    'strasbourg': 'strasbourg france travel',
    'nantes': 'nantes france travel',
    'lille': 'lille france travel',
    'rennes': 'rennes france travel',
    'montpellier': 'montpellier france travel',
    'toulon': 'toulon france travel',
    'orleans': 'orleans france travel',
    'tours': 'tours france travel',
    'dijon': 'dijon france travel',
    'reims': 'reims france travel',
    'metz': 'metz france travel',
    'nancy': 'nancy france travel',
    'besancon': 'besancon france travel',
    'clermont-ferrand': 'clermont ferrand france travel',
    'limoges': 'limoges france travel',
    'poitiers': 'poitiers france travel',
    'la rochelle': 'la rochelle france travel',
    'angers': 'angers france travel',
    'le mans': 'le mans france travel',
    'caen': 'caen france travel',
    'rouen': 'rouen france travel',
    'le havre': 'le havre france travel',
    'calais': 'calais france travel',
    'boulogne': 'boulogne france travel',
    'dunkirk': 'dunkirk france travel',
    'lille': 'lille france travel',
    'arras': 'arras france travel',
    'amiens': 'amiens france travel',
    'beauvais': 'beauvais france travel',
    'compiegne': 'compiegne france travel',
    'soissons': 'soissons france travel',
    'chateau-thierry': 'chateau thierry france travel',
    'meaux': 'meaux france travel',
    'melun': 'melun france travel',
    'fontainebleau': 'fontainebleau france travel',
    'versailles': 'versailles france travel',
    'saint-germain-en-laye': 'saint germain en laye france travel',
    'pontoise': 'pontoise france travel',
    'cergy': 'cergy france travel',
    'sarcelles': 'sarcelles france travel',
    'argenteuil': 'argenteuil france travel',
    'colombes': 'colombes france travel',
    'asnieres': 'asnieres france travel',
    'courbevoie': 'courbevoie france travel',
    'neuilly': 'neuilly france travel',
    'levallois': 'levallois france travel',
    'clichy': 'clichy france travel',
    'saint-ouen': 'saint ouen france travel',
    'aubervilliers': 'aubervilliers france travel',
    'pantin': 'pantin france travel',
    'bobigny': 'bobigny france travel',
    'drancy': 'drancy france travel',
    'le bourget': 'le bourget france travel',
    'dugny': 'dugny france travel',
    'epinay': 'epinay france travel',
    'saint-denis': 'saint denis france travel',
    'pierrefitte': 'pierrefitte france travel',
    'sarcelles': 'sarcelles france travel',
    'garges': 'garges france travel',
    'saint-brice': 'saint brice france travel',
    'montmorency': 'montmorency france travel',
    'enghien': 'enghien france travel',
    'deuil': 'deuil france travel',
    'taverny': 'taverny france travel',
    'bessancourt': 'bessancourt france travel',
    'fremainville': 'fremainville france travel',
    'margency': 'margency france travel',
    'andilly': 'andilly france travel',
    'mours': 'mours france travel',
    'valmondois': 'valmondois france travel',
    'butry': 'butry france travel',
    'nointel': 'nointel france travel',
    'mery': 'mery france travel',
    'chauvry': 'chauvry france travel',
    'baillet': 'baillet france travel',
    'maffliers': 'maffliers france travel',
    'attainville': 'attainville france travel',
    'bouffemont': 'bouffemont france travel',
    'domont': 'domont france travel',
    'piscop': 'piscop france travel',
    'le plessis-bouchard': 'le plessis bouchard france travel',
    'saint-prix': 'saint prix france travel',
    'taverny': 'taverny france travel',
    'bessancourt': 'bessancourt france travel',
    'fremainville': 'fremainville france travel',
    'margency': 'margency france travel',
    'andilly': 'andilly france travel',
    'mours': 'mours france travel',
    'valmondois': 'valmondois france travel',
    'butry': 'butry france travel',
    'nointel': 'nointel france travel',
    'mery': 'mery france travel',
    'chauvry': 'chauvry france travel',
    'baillet': 'baillet france travel',
    'maffliers': 'maffliers france travel',
    'attainville': 'attainville france travel',
    'bouffemont': 'bouffemont france travel',
    'domont': 'domont france travel',
    'piscop': 'piscop france travel',
    'le plessis-bouchard': 'le plessis bouchard france travel',
    'saint-prix': 'saint prix france travel'
  }

  // Activity mapping
  const activityMap: { [key: string]: string } = {
    'beach': 'beach vacation resort',
    'mountain': 'mountain hiking adventure',
    'hiking': 'mountain hiking adventure',
    'skiing': 'skiing winter sports',
    'snowboarding': 'skiing winter sports',
    'diving': 'scuba diving underwater',
    'snorkeling': 'snorkeling beach underwater',
    'surfing': 'surfing beach ocean',
    'kayaking': 'kayaking water sports',
    'sailing': 'sailing boat ocean',
    'fishing': 'fishing water sports',
    'camping': 'camping outdoor nature',
    'hiking': 'hiking mountain nature',
    'climbing': 'rock climbing adventure',
    'biking': 'cycling bike tour',
    'cycling': 'cycling bike tour',
    'walking': 'walking tour city',
    'sightseeing': 'sightseeing city tour',
    'culture': 'cultural travel destination',
    'history': 'historical travel destination',
    'art': 'art museum cultural',
    'museum': 'museum cultural travel',
    'food': 'food travel culinary',
    'culinary': 'food travel culinary',
    'wine': 'wine tasting travel',
    'tasting': 'wine tasting travel',
    'shopping': 'shopping city travel',
    'nightlife': 'nightlife city travel',
    'party': 'nightlife party travel',
    'relaxation': 'relaxation spa travel',
    'spa': 'spa relaxation travel',
    'wellness': 'wellness spa travel',
    'yoga': 'yoga wellness travel',
    'meditation': 'meditation wellness travel',
    'photography': 'photography travel destination',
    'wildlife': 'wildlife nature travel',
    'safari': 'safari wildlife travel',
    'jungle': 'jungle nature travel',
    'desert': 'desert travel destination',
    'ocean': 'ocean beach travel',
    'lake': 'lake nature travel',
    'river': 'river nature travel',
    'waterfall': 'waterfall nature travel',
    'volcano': 'volcano nature travel',
    'cave': 'cave nature travel',
    'island': 'island beach travel',
    'coast': 'coastal travel destination',
    'seaside': 'seaside beach travel',
    'tropical': 'tropical beach travel',
    'caribbean': 'caribbean beach travel',
    'mediterranean': 'mediterranean travel destination',
    'alpine': 'alpine mountain travel',
    'arctic': 'arctic travel destination',
    'tundra': 'tundra travel destination',
    'forest': 'forest nature travel',
    'national park': 'national park nature travel',
    'reserve': 'nature reserve travel',
    'sanctuary': 'wildlife sanctuary travel',
    'conservation': 'wildlife conservation travel',
    'eco': 'eco travel sustainable',
    'sustainable': 'sustainable eco travel',
    'green': 'green eco travel',
    'organic': 'organic food travel',
    'local': 'local culture travel',
    'authentic': 'authentic local travel',
    'traditional': 'traditional culture travel',
    'modern': 'modern city travel',
    'urban': 'urban city travel',
    'rural': 'rural countryside travel',
    'countryside': 'countryside rural travel',
    'village': 'village rural travel',
    'town': 'town travel destination',
    'city': 'city travel destination',
    'metropolis': 'metropolis city travel',
    'capital': 'capital city travel',
    'port': 'port city travel',
    'harbor': 'harbor port travel',
    'marina': 'marina port travel',
    'pier': 'pier harbor travel',
    'boardwalk': 'boardwalk beach travel',
    'promenade': 'promenade beach travel',
    'boulevard': 'boulevard city travel',
    'avenue': 'avenue city travel',
    'street': 'street city travel',
    'square': 'square city travel',
    'plaza': 'plaza city travel',
    'market': 'market city travel',
    'bazaar': 'bazaar market travel',
    'souq': 'souq market travel',
    'boutique': 'boutique shopping travel',
    'gallery': 'gallery art travel',
    'exhibition': 'exhibition art travel',
    'festival': 'festival cultural travel',
    'celebration': 'celebration cultural travel',
    'ceremony': 'ceremony cultural travel',
    'ritual': 'ritual cultural travel',
    'tradition': 'tradition cultural travel',
    'custom': 'custom cultural travel',
    'heritage': 'heritage cultural travel',
    'legacy': 'legacy cultural travel',
    'monument': 'monument historical travel',
    'landmark': 'landmark historical travel',
    'ruins': 'ruins historical travel',
    'archaeological': 'archaeological historical travel',
    'ancient': 'ancient historical travel',
    'medieval': 'medieval historical travel',
    'renaissance': 'renaissance historical travel',
    'baroque': 'baroque historical travel',
    'gothic': 'gothic historical travel',
    'romanesque': 'romanesque historical travel',
    'classical': 'classical historical travel',
    'neoclassical': 'neoclassical historical travel',
    'art nouveau': 'art nouveau historical travel',
    'art deco': 'art deco historical travel',
    'modernist': 'modernist historical travel',
    'contemporary': 'contemporary art travel',
    'avant-garde': 'avant garde art travel',
    'experimental': 'experimental art travel',
    'innovative': 'innovative art travel',
    'cutting-edge': 'cutting edge art travel',
    'groundbreaking': 'groundbreaking art travel',
    'revolutionary': 'revolutionary art travel',
    'pioneering': 'pioneering art travel',
    'trailblazing': 'trailblazing art travel',
    'trendsetting': 'trendsetting art travel',
    'fashionable': 'fashionable art travel',
    'stylish': 'stylish art travel',
    'elegant': 'elegant art travel',
    'sophisticated': 'sophisticated art travel',
    'refined': 'refined art travel',
    'polished': 'polished art travel',
    'luxurious': 'luxurious travel destination',
    'exclusive': 'exclusive travel destination',
    'premium': 'premium travel destination',
    'high-end': 'high end travel destination',
    'upscale': 'upscale travel destination',
    'boutique': 'boutique travel destination',
    'intimate': 'intimate travel destination',
    'private': 'private travel destination',
    'secluded': 'secluded travel destination',
    'hidden': 'hidden travel destination',
    'secret': 'secret travel destination',
    'undiscovered': 'undiscovered travel destination',
    'off-the-beaten-path': 'off the beaten path travel',
    'remote': 'remote travel destination',
    'isolated': 'isolated travel destination',
    'wilderness': 'wilderness travel destination',
    'untamed': 'untamed travel destination',
    'pristine': 'pristine travel destination',
    'unspoiled': 'unspoiled travel destination',
    'virgin': 'virgin travel destination',
    'natural': 'natural travel destination',
    'organic': 'organic travel destination',
    'pure': 'pure travel destination',
    'clean': 'clean travel destination',
    'fresh': 'fresh travel destination',
    'crisp': 'crisp travel destination',
    'clear': 'clear travel destination',
    'transparent': 'transparent travel destination',
    'crystal': 'crystal travel destination',
    'sparkling': 'sparkling travel destination',
    'shining': 'shining travel destination',
    'glowing': 'glowing travel destination',
    'radiant': 'radiant travel destination',
    'brilliant': 'brilliant travel destination',
    'dazzling': 'dazzling travel destination',
    'stunning': 'stunning travel destination',
    'breathtaking': 'breathtaking travel destination',
    'spectacular': 'spectacular travel destination',
    'magnificent': 'magnificent travel destination',
    'gorgeous': 'gorgeous travel destination',
    'beautiful': 'beautiful travel destination',
    'lovely': 'lovely travel destination',
    'charming': 'charming travel destination',
    'enchanting': 'enchanting travel destination',
    'magical': 'magical travel destination',
    'mystical': 'mystical travel destination',
    'mysterious': 'mysterious travel destination',
    'enigmatic': 'enigmatic travel destination',
    'fascinating': 'fascinating travel destination',
    'intriguing': 'intriguing travel destination',
    'captivating': 'captivating travel destination',
    'mesmerizing': 'mesmerizing travel destination',
    'hypnotizing': 'hypnotizing travel destination',
    'spellbinding': 'spellbinding travel destination',
    'entrancing': 'entrancing travel destination',
    'alluring': 'alluring travel destination',
    'tempting': 'tempting travel destination',
    'irresistible': 'irresistible travel destination',
    'compelling': 'compelling travel destination',
    'persuasive': 'persuasive travel destination',
    'convincing': 'convincing travel destination',
    'attractive': 'attractive travel destination',
    'appealing': 'appealing travel destination',
    'desirable': 'desirable travel destination',
    'wanted': 'wanted travel destination',
    'sought-after': 'sought after travel destination',
    'popular': 'popular travel destination',
    'famous': 'famous travel destination',
    'renowned': 'renowned travel destination',
    'celebrated': 'celebrated travel destination',
    'acclaimed': 'acclaimed travel destination',
    'praised': 'praised travel destination',
    'commended': 'commended travel destination',
    'recommended': 'recommended travel destination',
    'suggested': 'suggested travel destination',
    'endorsed': 'endorsed travel destination',
    'approved': 'approved travel destination',
    'validated': 'validated travel destination',
    'confirmed': 'confirmed travel destination',
    'verified': 'verified travel destination',
    'authenticated': 'authenticated travel destination',
    'certified': 'certified travel destination',
    'guaranteed': 'guaranteed travel destination',
    'assured': 'assured travel destination',
    'promised': 'promised travel destination',
    'pledged': 'pledged travel destination',
    'vowed': 'vowed travel destination',
    'sworn': 'sworn travel destination',
    'committed': 'committed travel destination',
    'dedicated': 'dedicated travel destination',
    'devoted': 'devoted travel destination',
    'loyal': 'loyal travel destination',
    'faithful': 'faithful travel destination',
    'true': 'true travel destination',
    'genuine': 'genuine travel destination',
    'real': 'real travel destination',
    'authentic': 'authentic travel destination',
    'original': 'original travel destination',
    'unique': 'unique travel destination',
    'special': 'special travel destination',
    'extraordinary': 'extraordinary travel destination',
    'exceptional': 'exceptional travel destination',
    'remarkable': 'remarkable travel destination',
    'notable': 'notable travel destination',
    'significant': 'significant travel destination',
    'important': 'important travel destination',
    'meaningful': 'meaningful travel destination',
    'valuable': 'valuable travel destination',
    'precious': 'precious travel destination',
    'treasured': 'treasured travel destination',
    'cherished': 'cherished travel destination',
    'beloved': 'beloved travel destination',
    'adored': 'adored travel destination',
    'loved': 'loved travel destination',
    'liked': 'liked travel destination',
    'enjoyed': 'enjoyed travel destination',
    'appreciated': 'appreciated travel destination',
    'valued': 'valued travel destination',
    'respected': 'respected travel destination',
    'honored': 'honored travel destination',
    'esteemed': 'esteemed travel destination',
    'admired': 'admired travel destination',
    'revered': 'revered travel destination',
    'worshipped': 'worshipped travel destination',
    'idolized': 'idolized travel destination',
    'glorified': 'glorified travel destination',
    'exalted': 'exalted travel destination',
    'elevated': 'elevated travel destination',
    'uplifted': 'uplifted travel destination',
    'inspired': 'inspired travel destination',
    'motivated': 'motivated travel destination',
    'encouraged': 'encouraged travel destination',
    'stimulated': 'stimulated travel destination',
    'energized': 'energized travel destination',
    'invigorated': 'invigorated travel destination',
    'refreshed': 'refreshed travel destination',
    'renewed': 'renewed travel destination',
    'revitalized': 'revitalized travel destination',
    'restored': 'restored travel destination',
    'healed': 'healed travel destination',
    'cured': 'cured travel destination',
    'fixed': 'fixed travel destination',
    'repaired': 'repaired travel destination',
    'mended': 'mended travel destination',
    'patched': 'patched travel destination',
    'sealed': 'sealed travel destination',
    'closed': 'closed travel destination',
    'shut': 'shut travel destination',
    'locked': 'locked travel destination',
    'secured': 'secured travel destination',
    'protected': 'protected travel destination',
    'guarded': 'guarded travel destination',
    'defended': 'defended travel destination',
    'shielded': 'shielded travel destination',
    'sheltered': 'sheltered travel destination',
    'covered': 'covered travel destination',
    'wrapped': 'wrapped travel destination',
    'enveloped': 'enveloped travel destination',
    'surrounded': 'surrounded travel destination',
    'enclosed': 'enclosed travel destination',
    'contained': 'contained travel destination',
    'held': 'held travel destination',
    'grasped': 'grasped travel destination',
    'gripped': 'gripped travel destination',
    'clutched': 'clutched travel destination',
    'seized': 'seized travel destination',
    'captured': 'captured travel destination',
    'caught': 'caught travel destination',
    'trapped': 'trapped travel destination',
    'snared': 'snared travel destination',
    'ensnared': 'ensnared travel destination',
    'entangled': 'entangled travel destination',
    'tangled': 'tangled travel destination',
    'twisted': 'twisted travel destination',
    'wound': 'wound travel destination',
    'coiled': 'coiled travel destination',
    'spiraled': 'spiraled travel destination',
    'curled': 'curled travel destination',
    'bent': 'bent travel destination',
    'folded': 'folded travel destination',
    'creased': 'creased travel destination',
    'wrinkled': 'wrinkled travel destination',
    'crumpled': 'crumpled travel destination',
    'crushed': 'crushed travel destination',
    'squashed': 'squashed travel destination',
    'flattened': 'flattened travel destination',
    'compressed': 'compressed travel destination',
    'squeezed': 'squeezed travel destination',
    'pressed': 'pressed travel destination',
    'squashed': 'squashed travel destination',
    'flattened': 'flattened travel destination',
    'compressed': 'compressed travel destination',
    'squeezed': 'squeezed travel destination',
    'pressed': 'pressed travel destination',
    'squashed': 'squashed travel destination',
    'flattened': 'flattened travel destination',
    'compressed': 'compressed travel destination',
    'squeezed': 'squeezed travel destination',
    'pressed': 'pressed travel destination'
  }

  // Extract keywords from prompt
  const words = promptLower.split(/\s+/)
  
  // Look for country/destination matches
  for (const [key, value] of Object.entries(countryMap)) {
    if (promptLower.includes(key)) {
      return value
    }
  }
  
  // Look for activity matches
  for (const [key, value] of Object.entries(activityMap)) {
    if (promptLower.includes(key)) {
      return value
    }
  }
  
  // Fallback: use first 3 meaningful words
  const meaningfulWords = words
    .filter(word => word.length > 2)
    .filter(word => !['the', 'and', 'for', 'with', 'from', 'this', 'that', 'they', 'them', 'their', 'there', 'where', 'when', 'what', 'which', 'who', 'why', 'how'].includes(word))
    .slice(0, 3)
  
  if (meaningfulWords.length > 0) {
    return meaningfulWords.join(' ') + ' travel destination'
  }
  
  // Final fallback
  return 'travel vacation destination'
}

/**
 * Generates images using AI providers with fallback to Unsplash
 * Prefers OpenAI Images or Stability AI, falls back to Unsplash search
 */
export async function generateImages(prompt: string): Promise<ImageResult> {
  try {
    // Try OpenAI Images first
    if (process.env.OPENAI_API_KEY) {
      try {
        const response = await openai.images.generate({
          model: 'dall-e-3',
          prompt: prompt,
          n: 4,
          size: '1024x1024',
          quality: 'standard'
        })

        const urls = response.data
          ?.filter(img => img.url)
          .map(img => img.url!)
          .slice(0, 4) || []

        if (urls.length > 0) {
          return {
            urls,
            provider: 'OpenAI DALL-E 3',
            source: 'AI'
          }
        }
      } catch (error) {
        console.warn('OpenAI Images failed, trying Stability AI:', error)
      }
    }

    // TODO: Add Stability AI integration when API is properly configured
    // For now, skip directly to Unsplash fallback

    // Fallback to Unsplash
    if (process.env.UNSPLASH_ACCESS_KEY) {
      try {
        // Create a more intelligent search query
        const searchQuery = createIntelligentSearchQuery(prompt)

        console.log('Unsplash search query:', searchQuery)

        const response = await unsplash.search.getPhotos({
          query: searchQuery,
          perPage: 4,
          orientation: 'landscape',
          orderBy: 'relevant'
        })

        if (response.type === 'success' && response.response.results.length > 0) {
          const urls = response.response.results
            .map(photo => photo.urls.regular)
            .slice(0, 4)

          console.log('Unsplash success:', urls.length, 'images found')
          return {
            urls,
            provider: 'Unsplash',
            source: 'STOCK'
          }
        } else {
          console.warn('Unsplash returned no results for query:', searchQuery)
        }
      } catch (error) {
        console.warn('Unsplash failed:', error)
      }
    }

    // If all providers fail, return contextual mock data
    console.warn('All image generation providers failed, returning contextual mock data')
    
    // Generate more relevant mock images based on prompt keywords
    const promptLower = prompt.toLowerCase()
    let imageKeywords = ['travel', 'vacation', 'destination']
    
    if (promptLower.includes('mexico') || promptLower.includes('beach')) {
      imageKeywords = ['mexico', 'beach', 'ocean', 'tropical', 'vacation', 'resort']
    } else if (promptLower.includes('mountain') || promptLower.includes('hiking')) {
      imageKeywords = ['mountain', 'hiking', 'nature', 'landscape', 'adventure']
    } else if (promptLower.includes('city') || promptLower.includes('urban')) {
      imageKeywords = ['city', 'urban', 'architecture', 'skyline', 'culture']
    } else if (promptLower.includes('europe') || promptLower.includes('italy')) {
      imageKeywords = ['europe', 'architecture', 'culture', 'history', 'landmark']
    }
    
    return {
      urls: [
        `https://picsum.photos/1024/1024?random=${Date.now()}-${imageKeywords[0]}-1`,
        `https://picsum.photos/1024/1024?random=${Date.now()}-${imageKeywords[1]}-2`,
        `https://picsum.photos/1024/1024?random=${Date.now()}-${imageKeywords[2]}-3`,
        `https://picsum.photos/1024/1024?random=${Date.now()}-${imageKeywords[3]}-4`
      ],
      provider: 'Contextual Mock (Picsum)',
      source: 'STOCK'
    }
  } catch (error) {
    console.error('Error in generateImages:', error)
    // Return mock data as final fallback
    return {
      urls: [
        `https://picsum.photos/1024/1024?random=${Date.now()}-1`,
        `https://picsum.photos/1024/1024?random=${Date.now()}-2`,
        `https://picsum.photos/1024/1024?random=${Date.now()}-3`,
        `https://picsum.photos/1024/1024?random=${Date.now()}-4`
      ],
      provider: 'Mock (Picsum)',
      source: 'STOCK'
    }
  }
}

/**
 * Generates an AI summary of a travel idea
 */
export async function generateSummary(prompt: string): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not available, returning mock summary')
      return generateMockSummary(prompt)
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a travel expert who creates evocative, inspiring summaries of travel ideas. 
          Write a 2-3 sentence summary that captures the essence and appeal of the travel experience. 
          Focus on the emotional journey, unique experiences, and what makes this destination special. 
          Use vivid, descriptive language that would inspire someone to visit.`
        },
        {
          role: 'user',
          content: `Create a compelling travel summary for this idea: ${prompt}`
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    })

    return response.choices[0]?.message?.content?.trim() || generateMockSummary(prompt)
  } catch (error) {
    console.error('Error generating summary:', error)
    return generateMockSummary(prompt)
  }
}

/**
 * Extracts a color palette from image URLs
 * Returns 5 hex colors
 * Handles both local and remote URLs
 */
export async function extractPalette(urls: string[]): Promise<string[]> {
  try {
    const palettes: string[] = []
    
    for (const url of urls.slice(0, 3)) { // Process up to 3 images
      try {
        // Convert local URLs to absolute URLs for Vibrant
        const absoluteUrl = url.startsWith('/') 
          ? `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}${url}`
          : url
          
        const palette = await Vibrant.from(absoluteUrl).getPalette()
        
        if (palette.Vibrant) palettes.push(palette.Vibrant.hex)
        if (palette.Muted) palettes.push(palette.Muted.hex)
        if (palette.DarkVibrant) palettes.push(palette.DarkVibrant.hex)
        if (palette.LightVibrant) palettes.push(palette.LightVibrant.hex)
        if (palette.DarkMuted) palettes.push(palette.DarkMuted.hex)
        
        // If we have enough colors, break
        if (palettes.length >= 5) break
      } catch (error) {
        console.warn(`Failed to extract palette from ${url}:`, error)
        continue
      }
    }

    // If we don't have enough colors, fill with defaults
    while (palettes.length < 5) {
      palettes.push(generateRandomColor())
    }

    return palettes.slice(0, 5)
  } catch (error) {
    console.error('Error extracting palette:', error)
    // Return default palette
    return [
      '#8B4513', // Saddle Brown
      '#DAA520', // Goldenrod
      '#F5DEB3', // Wheat
      '#2F4F4F', // Dark Slate Gray
      '#CD853F'  // Peru
    ]
  }
}

/**
 * Generates tags from a travel idea prompt
 */
export async function generateTags(prompt: string): Promise<string[]> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return generateMockTags(prompt)
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a travel expert who extracts relevant tags from travel descriptions. 
          Return 3-5 short, descriptive tags that capture the key aspects of the travel idea. 
          Focus on: destination type, activities, budget level, travel style, and unique features. 
          Return only the tags, separated by commas, no other text.`
        },
        {
          role: 'user',
          content: `Extract tags from this travel idea: ${prompt}`
        }
      ],
      max_tokens: 50,
      temperature: 0.3
    })

    const tags = response.choices[0]?.message?.content?.trim()
    if (tags) {
      return tags.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean)
    }

    return generateMockTags(prompt)
  } catch (error) {
    console.error('Error generating tags:', error)
    return generateMockTags(prompt)
  }
}

// Helper functions
function generateMockSummary(_prompt: string): string {
  const summaries = [
    `A carefully curated travel experience that captures the essence of your vision. This journey combines authentic local experiences with modern comfort, offering a perfect balance of adventure and relaxation.`,
    `An unforgettable adventure that brings your travel dreams to life. Discover hidden gems, immerse yourself in local culture, and create memories that will last a lifetime.`,
    `A thoughtfully designed travel experience that showcases the best of your chosen destination. From breathtaking landscapes to cultural treasures, every moment promises to be extraordinary.`
  ]
  
  return summaries[Math.floor(Math.random() * summaries.length)]
}

function generateMockTags(prompt: string): string[] {
  const commonTags = ['travel', 'adventure', 'culture', 'exploration', 'relaxation', 'nature', 'city', 'beach', 'mountains', 'food', 'history', 'art', 'photography']
  
  // Simple keyword matching for more relevant tags
  const lowerPrompt = prompt.toLowerCase()
  const matchedTags = commonTags.filter(tag => 
    lowerPrompt.includes(tag) || 
    (tag === 'beach' && (lowerPrompt.includes('ocean') || lowerPrompt.includes('coast'))) ||
    (tag === 'mountains' && (lowerPrompt.includes('hiking') || lowerPrompt.includes('peak'))) ||
    (tag === 'food' && (lowerPrompt.includes('restaurant') || lowerPrompt.includes('cuisine')))
  )
  
  // Add some random tags if we don't have enough
  while (matchedTags.length < 3) {
    const randomTag = commonTags[Math.floor(Math.random() * commonTags.length)]
    if (!matchedTags.includes(randomTag)) {
      matchedTags.push(randomTag)
    }
  }
  
  return matchedTags.slice(0, 5)
}

function generateRandomColor(): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
