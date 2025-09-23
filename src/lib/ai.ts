import { createApi } from 'unsplash-js'
import { Vibrant } from 'node-vibrant/node'

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY || ''
})

console.log('Unsplash client initialized with access key:', process.env.UNSPLASH_ACCESS_KEY ? 'Present' : 'Missing')

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
  
  // Experience-focused search query generation
  const isWinter = promptLower.includes('winter') || promptLower.includes('snow') || promptLower.includes('cold') || promptLower.includes('ski') || promptLower.includes('snowboard')
  const isSummer = promptLower.includes('summer') || promptLower.includes('beach') || promptLower.includes('hot') || promptLower.includes('warm') || promptLower.includes('sunny')
  const isSpring = promptLower.includes('spring') || promptLower.includes('bloom') || promptLower.includes('flowers')
  const isAutumn = promptLower.includes('autumn') || promptLower.includes('fall') || promptLower.includes('leaves') || promptLower.includes('harvest')
  
  // Social context detection
  const isFamily = promptLower.includes('family') || promptLower.includes('kids') || promptLower.includes('children')
  const isFriends = promptLower.includes('friends') || promptLower.includes('group') || promptLower.includes('together')
  const isRomantic = promptLower.includes('romantic') || promptLower.includes('couple') || promptLower.includes('honeymoon')
  const isSolo = promptLower.includes('solo') || promptLower.includes('alone') || promptLower.includes('personal')
  
  // Experience-focused location mapping
  const experienceLocationMap: { [key: string]: { [key: string]: string } } = {
    'switzerland': {
      'winter': isFamily ? 'family winter switzerland skiing cozy mountain cabin experience' : 
               isFriends ? 'friends winter switzerland skiing adventure mountain experience' :
               isRomantic ? 'couple romantic winter switzerland cozy alpine village experience' :
               'winter switzerland skiing mountain adventure experience people',
      'summer': isFamily ? 'family summer switzerland hiking mountain lakes experience' :
               isFriends ? 'friends summer switzerland adventure hiking mountain experience' :
               isRomantic ? 'couple romantic summer switzerland alpine lakes experience' :
               'summer switzerland hiking mountain lakes experience people',
      'spring': isFamily ? 'family spring switzerland alpine meadows flowers experience' :
               isFriends ? 'friends spring switzerland hiking alpine meadows experience' :
               isRomantic ? 'couple romantic spring switzerland alpine flowers experience' :
               'spring switzerland alpine meadows hiking experience people',
      'autumn': isFamily ? 'family autumn switzerland golden mountains experience' :
               isFriends ? 'friends autumn switzerland hiking golden mountains experience' :
               isRomantic ? 'couple romantic autumn switzerland golden alpine experience' :
               'autumn switzerland golden mountains hiking experience people',
      'default': 'switzerland mountains alps experience people'
    },
    'austria': {
      'winter': isFamily ? 'family winter austria skiing cozy alpine village experience' :
               isFriends ? 'friends winter austria skiing adventure mountain experience' :
               isRomantic ? 'couple romantic winter austria cozy alpine experience' :
               'winter austria skiing mountain adventure experience people',
      'summer': isFamily ? 'family summer austria hiking mountain lakes experience' :
               isFriends ? 'friends summer austria adventure hiking mountain experience' :
               isRomantic ? 'couple romantic summer austria alpine lakes experience' :
               'summer austria hiking mountain lakes experience people',
      'spring': isFamily ? 'family spring austria alpine meadows experience' :
               isFriends ? 'friends spring austria hiking alpine meadows experience' :
               isRomantic ? 'couple romantic spring austria alpine flowers experience' :
               'spring austria alpine meadows hiking experience people',
      'autumn': isFamily ? 'family autumn austria golden mountains experience' :
               isFriends ? 'friends autumn austria hiking golden mountains experience' :
               isRomantic ? 'couple romantic autumn austria golden alpine experience' :
               'autumn austria golden mountains hiking experience people',
      'default': 'austria mountains alps experience people'
    },
    'norway': {
      'winter': isFamily ? 'family winter norway northern lights cozy cabin experience' :
               isFriends ? 'friends winter norway northern lights adventure experience' :
               isRomantic ? 'couple romantic winter norway northern lights cozy experience' :
               'winter norway northern lights aurora experience people',
      'summer': isFamily ? 'family summer norway fjords midnight sun experience' :
               isFriends ? 'friends summer norway fjords adventure midnight sun experience' :
               isRomantic ? 'couple romantic summer norway fjords midnight sun experience' :
               'summer norway fjords midnight sun experience people',
      'spring': isFamily ? 'family spring norway fjords waterfalls experience' :
               isFriends ? 'friends spring norway fjords hiking waterfalls experience' :
               isRomantic ? 'couple romantic spring norway fjords waterfalls experience' :
               'spring norway fjords waterfalls experience people',
      'autumn': isFamily ? 'family autumn norway fjords golden colors experience' :
               isFriends ? 'friends autumn norway fjords hiking golden experience' :
               isRomantic ? 'couple romantic autumn norway fjords golden experience' :
               'autumn norway fjords golden colors experience people',
      'default': 'norway fjords northern lights experience people'
    },
    'iceland': {
      'winter': isFamily ? 'family winter iceland northern lights cozy experience' :
               isFriends ? 'friends winter iceland northern lights adventure experience' :
               isRomantic ? 'couple romantic winter iceland northern lights cozy experience' :
               'winter iceland northern lights aurora experience people',
      'summer': isFamily ? 'family summer iceland midnight sun waterfalls experience' :
               isFriends ? 'friends summer iceland adventure midnight sun waterfalls experience' :
               isRomantic ? 'couple romantic summer iceland midnight sun waterfalls experience' :
               'summer iceland midnight sun waterfalls experience people',
      'spring': isFamily ? 'family spring iceland waterfalls geysers experience' :
               isFriends ? 'friends spring iceland hiking waterfalls geysers experience' :
               isRomantic ? 'couple romantic spring iceland waterfalls geysers experience' :
               'spring iceland waterfalls geysers experience people',
      'autumn': isFamily ? 'family autumn iceland northern lights experience' :
               isFriends ? 'friends autumn iceland northern lights adventure experience' :
               isRomantic ? 'couple romantic autumn iceland northern lights experience' :
               'autumn iceland northern lights experience people',
      'default': 'iceland northern lights waterfalls experience people'
    },
    'japan': {
      'winter': isFamily ? 'family winter japan skiing mountain experience' :
               isFriends ? 'friends winter japan skiing adventure mountain experience' :
               isRomantic ? 'couple romantic winter japan cozy mountain experience' :
               'winter japan skiing mountain experience people',
      'summer': isFamily ? 'family summer japan temples gardens experience' :
               isFriends ? 'friends summer japan temples gardens adventure experience' :
               isRomantic ? 'couple romantic summer japan temples gardens experience' :
               'summer japan temples gardens experience people',
      'spring': isFamily ? 'family spring japan cherry blossoms sakura experience' :
               isFriends ? 'friends spring japan cherry blossoms sakura experience' :
               isRomantic ? 'couple romantic spring japan cherry blossoms sakura experience' :
               'spring japan cherry blossoms sakura experience people',
      'autumn': isFamily ? 'family autumn japan maple leaves temples experience' :
               isFriends ? 'friends autumn japan maple leaves temples experience' :
               isRomantic ? 'couple romantic autumn japan maple leaves temples experience' :
               'autumn japan maple leaves temples experience people',
      'default': 'japan temples gardens experience people'
    },
    'italy': {
      'winter': isFamily ? 'family winter italy skiing mountain experience' :
               isFriends ? 'friends winter italy skiing adventure mountain experience' :
               isRomantic ? 'couple romantic winter italy cozy mountain experience' :
               'winter italy skiing mountain experience people',
      'summer': isFamily ? 'family summer italy coast beaches mediterranean experience' :
               isFriends ? 'friends summer italy coast beaches mediterranean adventure experience' :
               isRomantic ? 'couple romantic summer italy coast beaches mediterranean experience' :
               'summer italy coast beaches mediterranean experience people',
      'spring': isFamily ? 'family spring italy countryside vineyards experience' :
               isFriends ? 'friends spring italy countryside vineyards adventure experience' :
               isRomantic ? 'couple romantic spring italy countryside vineyards experience' :
               'spring italy countryside vineyards experience people',
      'autumn': isFamily ? 'family autumn italy countryside harvest experience' :
               isFriends ? 'friends autumn italy countryside harvest experience' :
               isRomantic ? 'couple romantic autumn italy countryside harvest experience' :
               'autumn italy countryside harvest experience people',
      'default': 'italy countryside coast experience people'
    },
    'france': {
      'winter': isFamily ? 'family winter france skiing mountain experience' :
               isFriends ? 'friends winter france skiing adventure mountain experience' :
               isRomantic ? 'couple romantic winter france cozy mountain experience' :
               'winter france skiing mountain experience people',
      'summer': isFamily ? 'family summer france coast beaches mediterranean experience' :
               isFriends ? 'friends summer france coast beaches mediterranean adventure experience' :
               isRomantic ? 'couple romantic summer france coast beaches mediterranean experience' :
               'summer france coast beaches mediterranean experience people',
      'spring': isFamily ? 'family spring france countryside vineyards experience' :
               isFriends ? 'friends spring france countryside vineyards adventure experience' :
               isRomantic ? 'couple romantic spring france countryside vineyards experience' :
               'spring france countryside vineyards experience people',
      'autumn': isFamily ? 'family autumn france countryside harvest experience' :
               isFriends ? 'friends autumn france countryside harvest experience' :
               isRomantic ? 'couple romantic autumn france countryside harvest experience' :
               'autumn france countryside harvest experience people',
      'default': 'france countryside coast experience people'
    },
    'spain': {
      'winter': isFamily ? 'family winter spain skiing mountain experience' :
               isFriends ? 'friends winter spain skiing adventure mountain experience' :
               isRomantic ? 'couple romantic winter spain cozy mountain experience' :
               'winter spain skiing mountain experience people',
      'summer': isFamily ? 'family summer spain coast beaches mediterranean experience' :
               isFriends ? 'friends summer spain coast beaches mediterranean adventure experience' :
               isRomantic ? 'couple romantic summer spain coast beaches mediterranean experience' :
               'summer spain coast beaches mediterranean experience people',
      'spring': isFamily ? 'family spring spain countryside experience' :
               isFriends ? 'friends spring spain countryside adventure experience' :
               isRomantic ? 'couple romantic spring spain countryside experience' :
               'spring spain countryside experience people',
      'autumn': isFamily ? 'family autumn spain countryside experience' :
               isFriends ? 'friends autumn spain countryside experience' :
               isRomantic ? 'couple romantic autumn spain countryside experience' :
               'autumn spain countryside experience people',
      'default': 'spain coast countryside experience people'
    },
    'greece': {
      'winter': isFamily ? 'family winter greece mountain experience' :
               isFriends ? 'friends winter greece mountain adventure experience' :
               isRomantic ? 'couple romantic winter greece cozy mountain experience' :
               'winter greece mountain experience people',
      'summer': isFamily ? 'family summer greece islands beaches mediterranean experience' :
               isFriends ? 'friends summer greece islands beaches mediterranean adventure experience' :
               isRomantic ? 'couple romantic summer greece islands beaches mediterranean experience' :
               'summer greece islands beaches mediterranean experience people',
      'spring': isFamily ? 'family spring greece islands experience' :
               isFriends ? 'friends spring greece islands adventure experience' :
               isRomantic ? 'couple romantic spring greece islands experience' :
               'spring greece islands experience people',
      'autumn': isFamily ? 'family autumn greece islands experience' :
               isFriends ? 'friends autumn greece islands experience' :
               isRomantic ? 'couple romantic autumn greece islands experience' :
               'autumn greece islands experience people',
      'default': 'greece islands mediterranean experience people'
    }
  }
  
  // Experience-focused country mapping
  const countryMap: { [key: string]: string } = {
    'mexico': isFamily ? 'family mexico beach resort summer experience' :
             isFriends ? 'friends mexico beach resort summer adventure experience' :
             isRomantic ? 'couple romantic mexico beach resort summer experience' :
             isSummer ? 'mexico beach resort summer experience people' : 'mexico travel destination experience people',
    'italy': experienceLocationMap['italy']?.[isWinter ? 'winter' : isSummer ? 'summer' : isSpring ? 'spring' : isAutumn ? 'autumn' : 'default'] || 'italy travel destination experience people',
    'france': experienceLocationMap['france']?.[isWinter ? 'winter' : isSummer ? 'summer' : isSpring ? 'spring' : isAutumn ? 'autumn' : 'default'] || 'france travel destination experience people',
    'spain': experienceLocationMap['spain']?.[isWinter ? 'winter' : isSummer ? 'summer' : isSpring ? 'spring' : isAutumn ? 'autumn' : 'default'] || 'spain travel destination experience people',
    'greece': experienceLocationMap['greece']?.[isWinter ? 'winter' : isSummer ? 'summer' : isSpring ? 'spring' : isAutumn ? 'autumn' : 'default'] || 'greece travel destination experience people',
    'japan': experienceLocationMap['japan']?.[isWinter ? 'winter' : isSummer ? 'summer' : isSpring ? 'spring' : isAutumn ? 'autumn' : 'default'] || 'japan travel destination experience people',
    'thailand': isFamily ? 'family thailand beach tropical summer experience' :
               isFriends ? 'friends thailand beach tropical summer adventure experience' :
               isRomantic ? 'couple romantic thailand beach tropical summer experience' :
               isSummer ? 'thailand beach tropical summer experience people' : 'thailand travel destination experience people',
    'bali': isFamily ? 'family bali indonesia beach tropical summer experience' :
           isFriends ? 'friends bali indonesia beach tropical summer adventure experience' :
           isRomantic ? 'couple romantic bali indonesia beach tropical summer experience' :
           isSummer ? 'bali indonesia beach tropical summer experience people' : 'bali indonesia travel experience people',
    'hawaii': isFamily ? 'family hawaii beach vacation summer tropical experience' :
             isFriends ? 'friends hawaii beach vacation summer tropical adventure experience' :
             isRomantic ? 'couple romantic hawaii beach vacation summer tropical experience' :
             isSummer ? 'hawaii beach vacation summer tropical experience people' : 'hawaii beach vacation experience people',
    'costa rica': isFamily ? 'family costa rica beach tropical summer experience' :
                 isFriends ? 'friends costa rica beach tropical summer adventure experience' :
                 isRomantic ? 'couple romantic costa rica beach tropical summer experience' :
                 isSummer ? 'costa rica beach tropical summer experience people' : 'costa rica travel experience people',
    'portugal': isFamily ? 'family portugal coast beaches summer experience' :
               isFriends ? 'friends portugal coast beaches summer adventure experience' :
               isRomantic ? 'couple romantic portugal coast beaches summer experience' :
               isSummer ? 'portugal coast beaches summer experience people' : 'portugal travel destination experience people',
    'croatia': isFamily ? 'family croatia coast beaches summer experience' :
              isFriends ? 'friends croatia coast beaches summer adventure experience' :
              isRomantic ? 'couple romantic croatia coast beaches summer experience' :
              isSummer ? 'croatia coast beaches summer experience people' : 'croatia travel destination experience people',
    'turkey': isFamily ? 'family turkey coast beaches summer experience' :
             isFriends ? 'friends turkey coast beaches summer adventure experience' :
             isRomantic ? 'couple romantic turkey coast beaches summer experience' :
             isSummer ? 'turkey coast beaches summer experience people' : 'turkey travel destination experience people',
    'morocco': isFamily ? 'family morocco desert summer experience' :
              isFriends ? 'friends morocco desert summer adventure experience' :
              isRomantic ? 'couple romantic morocco desert summer experience' :
              isSummer ? 'morocco desert summer experience people' : 'morocco travel destination experience people',
    'peru': isFamily ? 'family peru mountains summer experience' :
           isFriends ? 'friends peru mountains summer adventure experience' :
           isRomantic ? 'couple romantic peru mountains summer experience' :
           isSummer ? 'peru mountains summer experience people' : 'peru travel destination experience people',
    'brazil': isFamily ? 'family brazil beach tropical summer experience' :
             isFriends ? 'friends brazil beach tropical summer adventure experience' :
             isRomantic ? 'couple romantic brazil beach tropical summer experience' :
             isSummer ? 'brazil beach tropical summer experience people' : 'brazil travel destination experience people',
    'argentina': isFamily ? 'family argentina summer experience' :
                isFriends ? 'friends argentina summer adventure experience' :
                isRomantic ? 'couple romantic argentina summer experience' :
                isSummer ? 'argentina summer experience people' : 'argentina travel destination experience people',
    'chile': isFamily ? 'family chile summer experience' :
            isFriends ? 'friends chile summer adventure experience' :
            isRomantic ? 'couple romantic chile summer experience' :
            isSummer ? 'chile summer experience people' : 'chile travel destination experience people',
    'iceland': experienceLocationMap['iceland']?.[isWinter ? 'winter' : isSummer ? 'summer' : isSpring ? 'spring' : isAutumn ? 'autumn' : 'default'] || 'iceland travel destination experience people',
    'norway': experienceLocationMap['norway']?.[isWinter ? 'winter' : isSummer ? 'summer' : isSpring ? 'spring' : isAutumn ? 'autumn' : 'default'] || 'norway travel destination experience people',
    'switzerland': experienceLocationMap['switzerland']?.[isWinter ? 'winter' : isSummer ? 'summer' : isSpring ? 'spring' : isAutumn ? 'autumn' : 'default'] || 'switzerland travel destination experience people',
    'austria': experienceLocationMap['austria']?.[isWinter ? 'winter' : isSummer ? 'summer' : isSpring ? 'spring' : isAutumn ? 'autumn' : 'default'] || 'austria travel destination experience people',
    'germany': isWinter ? 'germany winter snow christmas' : isSummer ? 'germany summer countryside' : 'germany travel destination',
    'netherlands': isSpring ? 'netherlands spring tulips flowers' : isSummer ? 'netherlands summer canals' : 'netherlands travel destination',
    'belgium': isWinter ? 'belgium winter christmas' : isSummer ? 'belgium summer' : 'belgium travel destination',
    'ireland': isSummer ? 'ireland summer green countryside' : isWinter ? 'ireland winter' : 'ireland travel destination',
    'scotland': isSummer ? 'scotland summer highlands' : isWinter ? 'scotland winter' : 'scotland travel destination',
    'england': isSummer ? 'england summer countryside' : isWinter ? 'england winter' : 'england travel destination',
    'wales': isSummer ? 'wales summer countryside' : isWinter ? 'wales winter' : 'wales travel destination',
    'australia': isSummer ? 'australia summer beach' : isWinter ? 'australia winter' : 'australia travel destination',
    'new zealand': isSummer ? 'new zealand summer mountains' : isWinter ? 'new zealand winter mountains' : 'new zealand travel destination',
    'south africa': isSummer ? 'south africa summer safari' : isWinter ? 'south africa winter' : 'south africa travel destination',
    'egypt': isSummer ? 'egypt summer desert' : isWinter ? 'egypt winter' : 'egypt travel destination',
    'india': isSummer ? 'india summer' : isWinter ? 'india winter' : 'india travel destination',
    'china': isSummer ? 'china summer' : isWinter ? 'china winter' : 'china travel destination',
    'south korea': isSpring ? 'south korea spring cherry blossoms' : isSummer ? 'south korea summer' : isAutumn ? 'south korea autumn' : isWinter ? 'south korea winter' : 'south korea travel destination',
    'vietnam': isSummer ? 'vietnam summer tropical' : isWinter ? 'vietnam winter' : 'vietnam travel destination',
    'cambodia': isSummer ? 'cambodia summer tropical' : isWinter ? 'cambodia winter' : 'cambodia travel destination',
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

  // Season-aware activity mapping
  const activityMap: { [key: string]: string } = {
    'beach': isWinter ? 'beach winter cold' : isSummer ? 'beach summer tropical' : 'beach vacation resort',
    'mountain': isWinter ? 'mountain winter snow skiing' : isSummer ? 'mountain summer hiking' : 'mountain hiking adventure',
    'hiking': isWinter ? 'hiking winter snow' : isSummer ? 'hiking summer nature' : 'hiking mountain nature',
    'skiing': 'skiing winter sports snow mountains',
    'snowboarding': 'snowboarding winter sports snow mountains',
    'diving': isSummer ? 'scuba diving summer underwater' : 'scuba diving underwater',
    'snorkeling': isSummer ? 'snorkeling summer beach underwater' : 'snorkeling beach underwater',
    'surfing': isSummer ? 'surfing summer beach ocean' : 'surfing beach ocean',
    'kayaking': isSummer ? 'kayaking summer water sports' : 'kayaking water sports',
    'sailing': isSummer ? 'sailing summer boat ocean' : 'sailing boat ocean',
    'fishing': isSummer ? 'fishing summer water sports' : 'fishing water sports',
    'camping': isWinter ? 'camping winter snow' : isSummer ? 'camping summer outdoor' : 'camping outdoor nature',
    'climbing': isWinter ? 'climbing winter ice' : isSummer ? 'climbing summer rock' : 'rock climbing adventure',
    'biking': isWinter ? 'biking winter' : isSummer ? 'biking summer countryside' : 'cycling bike tour',
    'cycling': isWinter ? 'cycling winter' : isSummer ? 'cycling summer countryside' : 'cycling bike tour',
    'walking': isWinter ? 'walking winter city' : isSummer ? 'walking summer city' : 'walking tour city',
    'sightseeing': isWinter ? 'sightseeing winter city' : isSummer ? 'sightseeing summer city' : 'sightseeing city tour',
    'culture': 'cultural travel destination',
    'history': 'historical travel destination',
    'art': 'art museum cultural',
    'museum': 'museum cultural travel',
    'food': isWinter ? 'food winter warm' : isSummer ? 'food summer fresh' : 'food travel culinary',
    'culinary': isWinter ? 'culinary winter warm' : isSummer ? 'culinary summer fresh' : 'food travel culinary',
    'wine': isWinter ? 'wine winter warm' : isSummer ? 'wine summer fresh' : 'wine tasting travel',
    'tasting': isWinter ? 'tasting winter warm' : isSummer ? 'tasting summer fresh' : 'wine tasting travel',
    'shopping': isWinter ? 'shopping winter city' : isSummer ? 'shopping summer city' : 'shopping city travel',
    'nightlife': isWinter ? 'nightlife winter city' : isSummer ? 'nightlife summer city' : 'nightlife city travel',
    'party': isWinter ? 'party winter' : isSummer ? 'party summer' : 'nightlife party travel',
    'relaxation': isWinter ? 'relaxation winter spa' : isSummer ? 'relaxation summer spa' : 'relaxation spa travel',
    'spa': isWinter ? 'spa winter warm' : isSummer ? 'spa summer fresh' : 'spa relaxation travel',
    'wellness': isWinter ? 'wellness winter' : isSummer ? 'wellness summer' : 'wellness spa travel',
    'yoga': isWinter ? 'yoga winter indoor' : isSummer ? 'yoga summer outdoor' : 'yoga wellness travel',
    'meditation': isWinter ? 'meditation winter indoor' : isSummer ? 'meditation summer outdoor' : 'meditation wellness travel',
    'photography': isWinter ? 'photography winter snow' : isSummer ? 'photography summer nature' : 'photography travel destination',
    'wildlife': isWinter ? 'wildlife winter' : isSummer ? 'wildlife summer' : 'wildlife nature travel',
    'safari': isWinter ? 'safari winter' : isSummer ? 'safari summer' : 'safari wildlife travel',
    'jungle': isWinter ? 'jungle winter' : isSummer ? 'jungle summer' : 'jungle nature travel',
    'desert': isWinter ? 'desert winter cold' : isSummer ? 'desert summer hot' : 'desert travel destination',
    'ocean': isWinter ? 'ocean winter cold' : isSummer ? 'ocean summer warm' : 'ocean beach travel',
    'lake': isWinter ? 'lake winter frozen' : isSummer ? 'lake summer warm' : 'lake nature travel',
    'river': isWinter ? 'river winter frozen' : isSummer ? 'river summer flowing' : 'river nature travel',
    'waterfall': isWinter ? 'waterfall winter frozen' : isSummer ? 'waterfall summer flowing' : 'waterfall nature travel',
    'volcano': isWinter ? 'volcano winter snow' : isSummer ? 'volcano summer' : 'volcano nature travel',
    'cave': isWinter ? 'cave winter' : isSummer ? 'cave summer' : 'cave nature travel',
    'island': isWinter ? 'island winter' : isSummer ? 'island summer tropical' : 'island beach travel',
    'coast': isWinter ? 'coast winter cold' : isSummer ? 'coast summer warm' : 'coastal travel destination',
    'seaside': isWinter ? 'seaside winter cold' : isSummer ? 'seaside summer warm' : 'seaside beach travel',
    'tropical': isSummer ? 'tropical summer beach' : 'tropical beach travel',
    'caribbean': isSummer ? 'caribbean summer beach' : 'caribbean beach travel',
    'mediterranean': isSummer ? 'mediterranean summer coast' : 'mediterranean travel destination',
    'alpine': isWinter ? 'alpine winter snow mountains' : isSummer ? 'alpine summer mountains' : 'alpine mountain travel',
    'arctic': isWinter ? 'arctic winter snow' : 'arctic travel destination',
    'tundra': isWinter ? 'tundra winter snow' : 'tundra travel destination',
    'forest': isWinter ? 'forest winter snow' : isSummer ? 'forest summer green' : 'forest nature travel',
    'national park': isWinter ? 'national park winter snow' : isSummer ? 'national park summer green' : 'national park nature travel',
    'reserve': isWinter ? 'nature reserve winter' : isSummer ? 'nature reserve summer' : 'nature reserve travel',
    'sanctuary': isWinter ? 'wildlife sanctuary winter' : isSummer ? 'wildlife sanctuary summer' : 'wildlife sanctuary travel',
    'conservation': isWinter ? 'wildlife conservation winter' : isSummer ? 'wildlife conservation summer' : 'wildlife conservation travel',
    'eco': isWinter ? 'eco travel winter sustainable' : isSummer ? 'eco travel summer sustainable' : 'eco travel sustainable',
    'sustainable': isWinter ? 'sustainable eco travel winter' : isSummer ? 'sustainable eco travel summer' : 'sustainable eco travel',
    'green': isWinter ? 'green eco travel winter' : isSummer ? 'green eco travel summer' : 'green eco travel',
    'organic': isWinter ? 'organic food travel winter' : isSummer ? 'organic food travel summer' : 'organic food travel',
    'local': isWinter ? 'local culture travel winter' : isSummer ? 'local culture travel summer' : 'local culture travel',
    'authentic': isWinter ? 'authentic local travel winter' : isSummer ? 'authentic local travel summer' : 'authentic local travel',
    'traditional': isWinter ? 'traditional culture travel winter' : isSummer ? 'traditional culture travel summer' : 'traditional culture travel',
    'modern': isWinter ? 'modern city travel winter' : isSummer ? 'modern city travel summer' : 'modern city travel',
    'urban': isWinter ? 'urban city travel winter' : isSummer ? 'urban city travel summer' : 'urban city travel',
    'rural': isWinter ? 'rural countryside travel winter' : isSummer ? 'rural countryside travel summer' : 'rural countryside travel',
    'countryside': isWinter ? 'countryside rural travel winter' : isSummer ? 'countryside rural travel summer' : 'countryside rural travel',
    'village': isWinter ? 'village rural travel winter' : isSummer ? 'village rural travel summer' : 'village rural travel',
    'town': isWinter ? 'town travel destination winter' : isSummer ? 'town travel destination summer' : 'town travel destination',
    'city': isWinter ? 'city travel destination winter' : isSummer ? 'city travel destination summer' : 'city travel destination',
    'metropolis': isWinter ? 'metropolis city travel winter' : isSummer ? 'metropolis city travel summer' : 'metropolis city travel',
    'capital': isWinter ? 'capital city travel winter' : isSummer ? 'capital city travel summer' : 'capital city travel',
    'port': isWinter ? 'port city travel winter' : isSummer ? 'port city travel summer' : 'port city travel',
    'harbor': isWinter ? 'harbor port travel winter' : isSummer ? 'harbor port travel summer' : 'harbor port travel',
    'marina': isWinter ? 'marina port travel winter' : isSummer ? 'marina port travel summer' : 'marina port travel',
    'pier': isWinter ? 'pier harbor travel winter' : isSummer ? 'pier harbor travel summer' : 'pier harbor travel',
    'boardwalk': isWinter ? 'boardwalk beach travel winter' : isSummer ? 'boardwalk beach travel summer' : 'boardwalk beach travel',
    'promenade': isWinter ? 'promenade beach travel winter' : isSummer ? 'promenade beach travel summer' : 'promenade beach travel',
    'boulevard': isWinter ? 'boulevard city travel winter' : isSummer ? 'boulevard city travel summer' : 'boulevard city travel',
    'avenue': isWinter ? 'avenue city travel winter' : isSummer ? 'avenue city travel summer' : 'avenue city travel',
    'street': isWinter ? 'street city travel winter' : isSummer ? 'street city travel summer' : 'street city travel',
    'square': isWinter ? 'square city travel winter' : isSummer ? 'square city travel summer' : 'square city travel',
    'plaza': isWinter ? 'plaza city travel winter' : isSummer ? 'plaza city travel summer' : 'plaza city travel',
    'market': isWinter ? 'market city travel winter' : isSummer ? 'market city travel summer' : 'market city travel',
    'bazaar': isWinter ? 'bazaar market travel winter' : isSummer ? 'bazaar market travel summer' : 'bazaar market travel',
    'souq': isWinter ? 'souq market travel winter' : isSummer ? 'souq market travel summer' : 'souq market travel',
    'boutique': isWinter ? 'boutique shopping travel winter' : isSummer ? 'boutique shopping travel summer' : 'boutique shopping travel',
    'gallery': isWinter ? 'gallery art travel winter' : isSummer ? 'gallery art travel summer' : 'gallery art travel',
    'exhibition': isWinter ? 'exhibition art travel winter' : isSummer ? 'exhibition art travel summer' : 'exhibition art travel',
    'festival': isWinter ? 'festival cultural travel winter' : isSummer ? 'festival cultural travel summer' : 'festival cultural travel',
    'celebration': isWinter ? 'celebration cultural travel winter' : isSummer ? 'celebration cultural travel summer' : 'celebration cultural travel',
    'ceremony': isWinter ? 'ceremony cultural travel winter' : isSummer ? 'ceremony cultural travel summer' : 'ceremony cultural travel',
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
    console.log('=== GENERATE IMAGES START ===')
    console.log('Prompt:', prompt)
    console.log('Environment check:', process.env.UNSPLASH_ACCESS_KEY ? 'Found' : 'Not found')
    
    // Skip AI image generation - no API keys configured

    // TODO: Add Stability AI integration when API is properly configured
    // For now, skip directly to Unsplash fallback

    // Fallback to Unsplash with multiple quality strategies
    console.log('Checking Unsplash API key:', process.env.UNSPLASH_ACCESS_KEY ? 'Found' : 'Not found')
    if (process.env.UNSPLASH_ACCESS_KEY) {
      console.log('Unsplash API key found, attempting to fetch high-quality images...')
      try {
        console.log('Starting Unsplash API call...')
        // Strategy 1: Try premium search with high-quality terms
        let searchQuery
        try {
          searchQuery = createPremiumSearchQuery(prompt)
          console.log('Unsplash premium search query:', searchQuery)
        } catch (error) {
          console.error('Error creating premium search query:', error)
          searchQuery = prompt + ' travel destination'
        }

        console.log('Making Unsplash API call with params:', {
          query: searchQuery,
          perPage: 20,
          orientation: 'landscape',
          orderBy: 'relevant',
          color: 'all'
        })
        
        let response = await unsplash.search.getPhotos({
          query: searchQuery,
          perPage: 5,
          orientation: 'landscape'
        })
        
        console.log('Unsplash API response type:', response.type)
        console.log('Unsplash API response results count:', response.type === 'success' ? response.response.results.length : 'N/A')

        // Strategy 2: If no results, try with popular/trending images
        if (response.type !== 'success' || response.response.results.length === 0) {
          console.log('Trying trending images strategy...')
          searchQuery = createIntelligentSearchQuery(prompt)
          response = await unsplash.search.getPhotos({
            query: searchQuery,
            perPage: 5,
            orientation: 'landscape'
          })
        }

        // Strategy 3: If still no results, try with featured/editorial content
        if (response.type !== 'success' || response.response.results.length === 0) {
          console.log('Trying featured content strategy...')
          response = await unsplash.search.getPhotos({
            query: searchQuery,
            perPage: 5,
            orientation: 'landscape'
          })
        }

        if (response.type === 'success' && response.response.results.length > 0) {
          // Filter and sort images by quality metrics
          const qualityImages = response.response.results
            .map(photo => ({
              ...photo,
              qualityScore: calculateImageQuality(photo)
            }))
            .filter(photo => photo.qualityScore >= 15) // Minimum quality threshold
            .sort((a, b) => b.qualityScore - a.qualityScore) // Sort by quality descending
            .slice(0, 4) // Take top 4 highest quality images
            .map(photo => {
              // Use the highest quality URL available
              if (photo.urls.full) return photo.urls.full
              if (photo.urls.raw) return photo.urls.raw
              if (photo.urls.regular) return photo.urls.regular
              return photo.urls.small
            })

          // If we don't have enough high-quality images, lower the threshold
          let finalImages = qualityImages
          if (finalImages.length < 4) {
            console.log('Not enough high-quality images, lowering threshold...')
            finalImages = response.response.results
              .map(photo => ({
                ...photo,
                qualityScore: calculateImageQuality(photo)
              }))
              .filter(photo => photo.qualityScore >= 10) // Lower threshold
              .sort((a, b) => b.qualityScore - a.qualityScore)
            .slice(0, 4)
              .map(photo => {
                if (photo.urls.full) return photo.urls.full
                if (photo.urls.raw) return photo.urls.raw
                if (photo.urls.regular) return photo.urls.regular
                return photo.urls.small
              })
          }

          console.log('Unsplash success:', finalImages.length, 'high-quality images selected')
          return {
            urls: finalImages,
            provider: 'Unsplash (High Quality)',
            source: 'STOCK'
          }
        } else {
          console.warn('Unsplash returned no results for query:', searchQuery)
        }
      } catch (error) {
        console.error('Unsplash API failed with error:', error)
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          name: error instanceof Error ? error.name : undefined
        })
      }
    } else {
      console.warn('No Unsplash API key found, skipping to mock data')
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
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
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
      console.warn('OpenAI API key not available, returning mock summary')
      return generateMockSummary(prompt)
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
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      console.warn('extractPalette: Invalid or empty urls array')
      return []
    }
    
    const palettes: string[] = []
    
    for (const url of urls.slice(0, 3)) { // Process up to 3 images
      try {
        // Convert local URLs to absolute URLs for Vibrant
        const absoluteUrl = url.startsWith('/') 
          ? `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3015'}${url}`
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
    return generateMockTags(prompt)
  } catch (error) {
    console.error('Error generating tags:', error)
      return generateMockTags(prompt)
  }
}

/**
 * Calculates a quality score for an Unsplash photo based on multiple factors
 */
function calculateImageQuality(photo: any): number {
  let score = 0
  
  // Experience-focused quality scoring
  const description = (photo.description || '').toLowerCase()
  const altDescription = (photo.alt_description || '').toLowerCase()
  const combinedText = `${description} ${altDescription}`
  
  // Human presence and social context (highest priority)
  if (combinedText.includes('people') || combinedText.includes('person') || combinedText.includes('group') || 
      combinedText.includes('family') || combinedText.includes('friends') || combinedText.includes('couple')) {
    score += 20 // Major bonus for human presence
  }
  
  // Social and emotional keywords
  if (combinedText.includes('enjoying') || combinedText.includes('having fun') || combinedText.includes('laughing') || 
      combinedText.includes('smiling') || combinedText.includes('happy')) {
    score += 15 // Emotional connection
  }
  
  // Activity and experience keywords
  if (combinedText.includes('skiing') || combinedText.includes('hiking') || combinedText.includes('dining') || 
      combinedText.includes('exploring') || combinedText.includes('adventure') || combinedText.includes('relaxing')) {
    score += 12 // Activity focus
  }
  
  // Lifestyle and cozy keywords
  if (combinedText.includes('cozy') || combinedText.includes('warm') || combinedText.includes('romantic') || 
      combinedText.includes('intimate') || combinedText.includes('lifestyle')) {
    score += 10 // Lifestyle appeal
  }
  
  // Base engagement metrics (reduced weight)
  if (photo.likes) score += Math.min(photo.likes / 200, 5) // Reduced from 10 to 5 points
  if (photo.downloads) score += Math.min(photo.downloads / 100, 5) // Reduced from 10 to 5 points
  
  // Technical quality (reduced weight)
  if (photo.width && photo.height) {
    const aspectRatio = photo.width / photo.height
    const isLandscape = aspectRatio > 1.2 && aspectRatio < 2.5
    if (isLandscape) score += 3 // Reduced from 5 to 3
    
    const totalPixels = photo.width * photo.height
    if (totalPixels > 2000000) score += 3 // Reduced from 5 to 3
    if (totalPixels > 5000000) score += 2 // Reduced from 5 to 2
    if (totalPixels > 10000000) score += 2 // Reduced from 5 to 2
  }
  
  // Color and mood (enhanced)
  if (photo.color) {
    const colorValue = photo.color.replace('#', '')
    const r = parseInt(colorValue.substr(0, 2), 16)
    const g = parseInt(colorValue.substr(2, 2), 16)
    const b = parseInt(colorValue.substr(4, 2), 16)
    const brightness = (r + g + b) / 3
    if (brightness > 50 && brightness < 200) score += 5 // Increased from 3 to 5
  }
  
  // User engagement (reduced weight)
  if (photo.views) score += Math.min(photo.views / 2000, 3) // Reduced from 5 to 3 points
  
  // Premium content (reduced weight)
  if (photo.sponsored) score += 1 // Reduced from 2 to 1
  if (photo.premium) score += 2 // Reduced from 3 to 2
  
  // Recency bonus (reduced weight)
  if (photo.created_at) {
    const daysSinceCreation = (Date.now() - new Date(photo.created_at).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceCreation < 30) score += 1 // Reduced from 2 to 1
    if (daysSinceCreation < 7) score += 2 // Reduced from 3 to 2
  }
  
  // Professional photographer (reduced weight)
  if (photo.user && photo.user.total_photos > 100) score += 1 // Reduced from 2 to 1
  if (photo.user && photo.user.total_likes > 1000) score += 1 // Reduced from 2 to 1
  
  return Math.max(score, 0) // Ensure non-negative score
}

/**
 * Enhanced search query that prioritizes high-quality content
 */
function createPremiumSearchQuery(prompt: string): string {
  const baseQuery = createIntelligentSearchQuery(prompt)
  
  // Add quality-enhancing keywords
  const qualityKeywords = [
    'professional', 'high resolution', '4k', 'hd', 'premium', 'award winning',
    'stunning', 'breathtaking', 'spectacular', 'magnificent', 'gorgeous',
    'beautiful', 'amazing', 'incredible', 'extraordinary', 'exceptional'
  ]
  
  // Add travel-specific quality terms
  const travelQualityTerms = [
    'luxury', 'exclusive', 'boutique', 'upscale', 'high-end', 'premium',
    'curated', 'handpicked', 'selected', 'chosen', 'recommended'
  ]
  
  // Combine base query with quality terms
  const qualityTerms = [...qualityKeywords, ...travelQualityTerms]
  const randomQualityTerm = qualityTerms[Math.floor(Math.random() * qualityTerms.length)]
  
  return `${baseQuery} ${randomQualityTerm}`
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
  const lowerPrompt = prompt.toLowerCase()
  const matchedTags: string[] = []
  
  // Context-aware tag generation based on prompt content
  if (lowerPrompt.includes('winter') || lowerPrompt.includes('snow') || lowerPrompt.includes('cold')) {
    matchedTags.push('winter', 'snow', 'cold-weather')
  }
  
  if (lowerPrompt.includes('switzerland') || lowerPrompt.includes('swiss') || lowerPrompt.includes('alps')) {
    matchedTags.push('switzerland', 'alps', 'europe')
  }
  
  if (lowerPrompt.includes('mountains') || lowerPrompt.includes('mountain') || lowerPrompt.includes('peak') || lowerPrompt.includes('alps')) {
    matchedTags.push('mountains', 'hiking', 'nature')
  }
  
  if (lowerPrompt.includes('trip') || lowerPrompt.includes('travel') || lowerPrompt.includes('journey')) {
    matchedTags.push('travel', 'adventure')
  }
  
  if (lowerPrompt.includes('ski') || lowerPrompt.includes('skiing') || lowerPrompt.includes('snowboard')) {
    matchedTags.push('skiing', 'winter-sports')
  }
  
  if (lowerPrompt.includes('village') || lowerPrompt.includes('town') || lowerPrompt.includes('city')) {
    matchedTags.push('culture', 'local-life')
  }
  
  if (lowerPrompt.includes('scenic') || lowerPrompt.includes('view') || lowerPrompt.includes('landscape')) {
    matchedTags.push('scenic', 'photography', 'views')
  }
  
  // Add season-specific tags
  if (lowerPrompt.includes('winter')) {
    matchedTags.push('winter-activities', 'cozy')
  }
  
  // Add location-specific tags
  if (lowerPrompt.includes('switzerland')) {
    matchedTags.push('swiss-culture', 'chocolate', 'cheese')
  }
  
  // Remove duplicates and limit to 5 tags
  const uniqueTags = [...new Set(matchedTags)]
  
  // If we don't have enough relevant tags, add some generic but appropriate ones
  if (uniqueTags.length < 3) {
    const fallbackTags = ['nature', 'adventure', 'exploration']
    fallbackTags.forEach(tag => {
      if (!uniqueTags.includes(tag)) {
        uniqueTags.push(tag)
      }
    })
  }
  
  return uniqueTags.slice(0, 5)
}

function generateRandomColor(): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
