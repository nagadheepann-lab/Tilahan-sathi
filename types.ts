import React from 'react';

// For Speech Recognition API
// This will fix the error in ChatbotFAB.tsx
// FIX: Exported SpeechRecognition-related interfaces to make them importable in other modules.
export interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly[index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
}

export interface SpeechRecognition extends EventTarget {
    grammars: any;
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    serviceURI: string;

    start(): void;
    stop(): void;
    abort(): void;

    onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onerror: ((this: SpeechRecognition, ev: any) => any) | null; // SpeechRecognitionErrorEvent is not standard
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

export interface SpeechRecognitionStatic {
    new(): SpeechRecognition;
}

// FIX: Moved the AIStudio interface into the global declaration to resolve type conflicts.
// The error "Subsequent property declarations must have the same type" can occur when an
// interface is defined in module scope and used in a global declaration, creating a naming collision.
// This ensures the interface is consistently in the global scope.
// Augment the global Window interface
declare global {
    interface AIStudio {
        hasSelectedApiKey: () => Promise<boolean>;
        openSelectKey: () => Promise<void>;
    }

    interface Window {
        webkitSpeechRecognition: SpeechRecognitionStatic;
        aistudio: AIStudio;
    }
}


// App-specific types
export type Language = 'en' | 'hi' | 'ta' | 'mr' | 'bn';

export interface User {
    name: string;
    language: Language;
    location: string;
}

export type NavItem =
    | 'dashboard'
    | 'learn'
    | 'tools'
    | 'schemes'
    | 'community'
    | 'profile'
    | 'crop-details'
    | 'scanner'
    | 'soil'
    | 'calendar'
    | 'profit-simulator'
    | 'weather'
    | 'crop-rotation'
    | 'dealer-locator'
    | 'fertilizer-calculator'
    | 'mandi-price-tracker'
    | 'live-conversation';


export interface LocalizedName {
    hi: string;
    ta: string;
    mr: string;
    bn: string;
}

export interface Crop {
    id: string;
    name: string;
    type: 'Oilseed' | 'Traditional';
    avgYield: number; // quintals per acre
    avgPrice: number; // per quintal
    inputCost: number; // per acre
    localized: LocalizedName;
    description: string;
    idealConditions: {
        soil: string;
        climate: string;
    };
    popularVarieties: string[];
    cultivationPractices: string[];
}

export interface Scheme {
    id: number;
    name: string;
    description: string;
    eligibility: string;
    link: string;
}

export interface LearningContent {
    id: number;
    title: string;
    type: 'article' | 'video' | 'guide';
    thumbnail: string;
    readTime?: string;
    duration?: string;
    navId?: NavItem;
    cropId?: string;
}

export interface ForumPost {
    id: number;
    author: string;
    avatar: string;
    timestamp: string;
    title: string;
    content: string;
    replies: number;
}

export interface MarketPrice {
    id: string;
    name: string;
    price: number;
    trend: 'up' | 'down' | 'stable';
    localized: LocalizedName;
}

export interface ChatMessageSource {
    type: 'web' | 'maps';
    uri: string;
    title: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
    sources?: ChatMessageSource[];
}

export interface AnalysisResult {
    diseaseName: string;
    severity: 'Low' | 'Medium' | 'High';
    description: string;
    immediateMeasures: string[];
    preventiveMeasures: string[];
}

export interface SoilData {
    ph: number;
    nitrogen: string;
    phosphorus: string;
    potassium: string;
    organicMatter: number;
    targetCrop: string;
}

export interface SoilAnalysisResult {
    fertilizerRecs: string[];
    amendmentRecs: string[];
    generalAdvice: string[];
}

export interface CalendarEvent {
    date: string;
    title: string;
    description: string;
    category: 'Sowing' | 'Irrigation' | 'Fertilizing' | 'Pest Control' | 'Harvesting' | 'General';
}

export interface CropRotationPlan {
    plan: {
        year: number;
        crop: string;
        justification: string;
    }[];
    summary: string;
}

export interface ToastMessage {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}

export interface Dealer {
    name: string;
    address: string;
    phone: string;
    rating?: number;
    coordinates: { lat: number, lon: number };
}

export interface FertilizerRecommendation {
    recommendations: {
        fertilizer: string;
        amount: string;
    }[];
    advice: string;
}

export interface MandiPriceData {
    trendData: {
        month: string;
        price: number;
    }[];
    analysis: string;
}


export interface Badge {
    id: string;
    name: string;
    cropId: string;
}

export interface LeaderboardUser {
    id: number | string;
    name: string;
    avatar: string;
    score: number;
    rank: number;
}


// Localization types
export const localizedStrings = {
  en: {
    welcomeFarmer: "Your personal oilseed farming assistant",
    loginTitle: "Welcome to Tilahan Sathi",
    loginSubtitle: "Enter your details to get started",
    name: "Name",
    namePlaceholder: "e.g., Suresh Kumar",
    language: "Language",
    location: "Location (State)",
    login: "Enter Farm",
    comparativeEconomics: "Comparative Economics (per Acre)",
    landSizeAcres: "Land Size (Acres)",
    traditionalCrop: "Traditional Crop",
    oilseedCrop: "Oilseed Crop",
    profitPerAcre: "Profit per Acre",
    profitSummary: "By cultivating {oilseedCrop} instead of {traditionalCrop}, you could see a potential profit {changeType} of {amount} for your {landSize} acres of land.",
    increase: "increase",
    decrease: "decrease",
    profitabilitySimulator: "Profitability Simulator",
    yieldAdjustment: "Yield Adjustment",
    marketPriceAdjustment: "Market Price Adjustment",
    liveMarketPrices: "Live Market Prices",
    crop: "Crop",
    pricePerQuintal: "Price (per Quintal)",
    trend: "Trend",
    up: "Up",
    down: "Down",
    stable: "Stable",
    priceTrendsFor: "Price Trends for {crop}",
    weatherAdvisoryFor: "Weather Advisory for {location}",
    learnTitle: "Learning Hub",
    learnSubtitle: "Knowledge and best practices",
    oilseedCropGuides: "Oilseed Crop Guides",
    generalLearning: "General Learning",

    schemesTitle: "Government Schemes",
    schemesSubtitle: "Financial support and insurance for farmers",
    searchSchemes: "Search schemes...",
    eligibility: "Eligibility",
    learnMore: "Learn More",

    communityTitle: "Community Hub",
    communitySubtitle: "Connect, share, and compete with fellow farmers",
    startDiscussion: "Start a New Discussion",
    postTitle: "Title",
    postTitlePlaceholder: "e.g., Best fertilizer for mustard?",
    postContent: "Content",
    postContentPlaceholder: "Describe your question or experience...",
    postDiscussion: "Post Discussion",
    replies: "Replies",
    share: "Share",
    sendReply: "Reply",
    forum: "Forum",
    leaderboard: "Leaderboard",
    rank: "Rank",
    farmer: "Farmer",
    score: "Score",
    yourRank: "Your Rank",
    farmerScore: "Farmer Score",

    fasalSalah: "Fasal Salah (AI Advisor)",
    initialBotMessage: "Hello! I am your AI farming assistant. Ask me anything about oilseed cultivation.",
    askQuestionPlaceholder: "Type your question...",
    send: "Send",
    startRecording: "Ask with Voice",
    stopRecording: "Stop Recording",

    scannerTitle: "Pest & Disease Scanner",
    scannerInstruction: "Point your camera at an affected plant leaf and take a photo.",
    takePhoto: "Take Photo & Analyze",
    retakePhoto: "Retake Photo",
    analyzing: "Analyzing...",
    
    soilAnalysisTitle: "Soil Health Analysis",
    soilAnalysisSubtitle: "Get personalized recommendations for your farm",
    targetCrop: "Target Oilseed Crop",
    phLevel: "pH Level",
    organicMatter: "Organic Matter",
    nitrogenLevel: "Nitrogen Level",
    phosphorusLevel: "Phosphorus Level",
    potassiumLevel: "Potassium Level",
    low: "Low",
    medium: "Medium",
    high: "High",
    analyzeSoil: "Analyze Soil",
    soilAnalysisError: "Failed to get soil analysis. Please try again.",
    fertilizerRecs: "Fertilizer Recommendations",
    amendmentRecs: "Soil Amendment Recommendations",
    generalAdvice: "General Advice",
    
    calendarTitle: "Farming Calendar",
    calendarSubtitle: "Personalized schedule for {crop} in {location}",
    fetchingCalendar: "Generating your calendar...",

    tools: "Farmer Tools",
    toolsDesc: "Utilities to help you farm smarter",
    pestScanner: "Pest & Disease Scanner",
    pestScannerDesc: "Instantly identify crop issues from a photo.",
    soilHealth: "Soil Health Analysis",
    soilHealthDesc: "Get fertilizer and amendment recommendations.",
    cropCalendar: "Farming Calendar",
    cropCalendarDesc: "Generate a personalized crop activity schedule.",
    profitSimulator: "Profit Simulator",
    profitSimulatorDesc: "Compare crop profitability with market variables.",
    weatherForecast: "Weather Forecast",
    weatherDesc: "View local weather and advisories.",
    cropRotation: "Crop Rotation Planner",
    cropRotationDesc: "Get a multi-year plan to improve soil health.",
    
    rotationPlannerTitle: "Crop Rotation Planner",
    rotationPlannerSubtitle: "Generate a multi-year plan for better soil health and yield",
    yourCrops: "Your Available Crops",
    yourCropsDesc: "Select all crops you can grow.",
    soilType: "Your Dominant Soil Type",
    generatePlan: "Generate 3-Year Plan",
    fetchingPlan: "Generating plan...",
    rotationPlanForYou: "Your 3-Year Rotation Plan",
    planSummary: "Plan Summary & Benefits",

    idealConditions: "Ideal Conditions",
    varieties: "Popular Varieties",
    cultivationPractices: "Cultivation Practices",
    generateVideo: "Watch AI Video Lesson",
    generatingVideo: "Generating your video lesson... This can take a few minutes.",
    videoFailed: "Failed to generate video. Please try again later.",
    
    dealerLocator: "Agri-Dealer Locator",
    dealerLocatorDesc: "Find nearby fertilizer and seed stores.",
    dealerLocatorTitle: "Agri-Dealer Locator",
    dealerLocatorSubtitle: "Finding agricultural suppliers near you",
    fetchingDealers: "Finding nearby dealers...",
    sortByRating: "Sort by Rating",
    rating: "Rating",
    noRatingAvailable: "No rating available",
    gettingYourLocation: "Getting your location...",
    locationError: "Could not get your location. Please enable location services and try again.",

    badgeUnlocked: "Badge Unlocked!",
    myBadges: "My Badges",

    fertilizerCalculator: "Fertilizer Calculator",
    fertilizerCalculatorDesc: "Calculate NPK dosage for your crop and land size.",
    calculateFertilizer: "Calculate Fertilizer",
    recommendedDosageFor: "Recommended Dosage for {landSize} Acres of {cropName}",
    fertilizer: "Fertilizer",
    amount: "Amount",
    applicationAdvice: "Application Advice",
    fetchingRecs: "Calculating recommendations...",

    mandiPriceTracker: "Mandi Price Tracker",
    mandiPriceTrackerDesc: "Analyze historical mandi prices for your crop.",
    mandiPriceTrackerTitle: "Mandi Price Tracker",
    mandiPriceTrackerSubtitle: "Analyze price trends to sell at the right time",
    lastSixMonths: "Last 6 Months Price Trend",
    trendAnalysis: "AI Trend Analysis",
    fetchingTrends: "Fetching price trends...",

    liveConversation: "Live AI Conversation",
    liveConversationDesc: "Speak directly with the AI in real-time.",
    liveConvTitle: "Live AI Conversation",
    liveConvSubtitle: "Have a real-time voice conversation with your AI assistant",
    startConversation: "Start Conversation",
    stopConversation: "Stop Conversation",
    connecting: "Connecting...",
    listening: "Listening...",
    speakNow: "Speak now...",
    modelIsSpeaking: "AI is speaking...",
    conversationEnded: "Conversation Ended. Press Start to begin again.",
  },
  hi: {
    welcomeFarmer: "आपका व्यक्तिगत तिलहन खेती सहायक",
    loginTitle: "तिलहन साथी में आपका स्वागत है",
    loginSubtitle: "शुरू करने के लिए अपना विवरण दर्ज करें",
    name: "नाम",
    namePlaceholder: "उदा., सुरेश कुमार",
    language: "भाषा",
    location: "स्थान (राज्य)",
    login: "खेत में प्रवेश करें",
    comparativeEconomics: "तुलनात्मक अर्थशास्त्र (प्रति एकड़)",
    landSizeAcres: "भूमि का आकार (एकड़)",
    traditionalCrop: "पारंपरिक फसल",
    oilseedCrop: "तिलहन फसल",
    profitPerAcre: "प्रति एकड़ लाभ",
    profitSummary: "{traditionalCrop} के बजाय {oilseedCrop} की खेती करके, आप अपनी {landSize} एकड़ भूमि के लिए {amount} के संभावित लाभ {changeType} देख सकते हैं।",
    increase: "वृद्धि",
    decrease: "कमी",
    profitabilitySimulator: "लाभप्रदता सिम्युलेटर",
    yieldAdjustment: "उपज समायोजन",
    marketPriceAdjustment: "बाजार मूल्य समायोजन",
    liveMarketPrices: "लाइव बाजार मूल्य",
    crop: "फसल",
    pricePerQuintal: "मूल्य (प्रति क्विंटल)",
    trend: "प्रवृत्ति",
    up: "ऊपर",
    down: "नीचे",
    stable: "स्थिर",
    priceTrendsFor: "{crop} के लिए मूल्य रुझान",
    weatherAdvisoryFor: "{location} के लिए मौसम सलाह",
    learnTitle: "ज्ञान केंद्र",
    learnSubtitle: "ज्ञान और सर्वोत्तम प्रथाएं",
    oilseedCropGuides: "तिलहन फसल गाइड",
    generalLearning: "सामान्य ज्ञान",
    schemesTitle: "सरकारी योजनाएं",
    schemesSubtitle: "किसानों के लिए वित्तीय सहायता और बीमा",
    searchSchemes: "योजनाएं खोजें...",
    eligibility: "पात्रता",
    learnMore: "और जानें",
    communityTitle: "किसान केंद्र",
    communitySubtitle: "अन्य किसानों से जुड़ें, साझा करें और प्रतिस्पर्धा करें",
    startDiscussion: "एक नई चर्चा शुरू करें",
    postTitle: "शीर्षक",
    postTitlePlaceholder: "उदा., सरसों के लिए सबसे अच्छी खाद कौन सी है?",
    postContent: "विवरण",
    postContentPlaceholder: "अपना प्रश्न या अनुभव बताएं...",
    postDiscussion: "चर्चा पोस्ट करें",
    replies: "उत्तर",
    share: "शेयर करें",
    sendReply: "उत्तर दें",
    forum: "मंच",
    leaderboard: "लीडरबोर्ड",
    rank: "रैंक",
    farmer: "किसान",
    score: "स्कोर",
    yourRank: "आपकी रैंक",
    farmerScore: "किसान स्कोर",
    fasalSalah: "फ़सल सलाह (AI सलाहकार)",
    initialBotMessage: "नमस्ते! मैं आपका AI खेती सहायक हूँ। मुझसे तिलहन की खेती के बारे में कुछ भी पूछें।",
    askQuestionPlaceholder: "अपना प्रश्न टाइप करें...",
    send: "भेजें",
    startRecording: "आवाज से पूछें",
    stopRecording: "रिकॉर्डिंग रोकें",
    scannerTitle: "कीट और रोग स्कैनर",
    scannerInstruction: "अपने कैमरे को प्रभावित पौधे के पत्ते पर रखें और एक तस्वीर लें।",
    takePhoto: "फोटो लें और विश्लेषण करें",
    retakePhoto: "फिर से फोटो लें",
    analyzing: "विश्लेषण हो रहा है...",
    soilAnalysisTitle: "मृदा स्वास्थ्य विश्लेषण",
    soilAnalysisSubtitle: "अपने खेत के लिए व्यक्तिगत सिफारिशें प्राप्त करें",
    targetCrop: "लक्षित तिलहन फसल",
    phLevel: "पीएच स्तर",
    organicMatter: "जैविक पदार्थ",
    nitrogenLevel: "नाइट्रोजन स्तर",
    phosphorusLevel: "फास्फोरस स्तर",
    potassiumLevel: "पोटेशियम स्तर",
    low: "कम",
    medium: "मध्यम",
    high: "उच्च",
    analyzeSoil: "मिट्टी का विश्लेषण करें",
    soilAnalysisError: "मिट्टी विश्लेषण प्राप्त करने में विफल। कृपया पुन: प्रयास करें।",
    fertilizerRecs: "उर्वरक सिफारिशें",
    amendmentRecs: "मृदा संशोधन सिफारिशें",
    generalAdvice: "सामान्य सलाह",
    calendarTitle: "खेती कैलेंडर",
    calendarSubtitle: "{location} में {crop} के लिए व्यक्तिगत कार्यक्रम",
    fetchingCalendar: "आपका कैलेंडर तैयार हो रहा है...",
    tools: "किसान उपकरण",
    toolsDesc: "स्मार्ट खेती में आपकी मदद करने वाली उपयोगिताएँ",
    pestScanner: "कीट और रोग स्कैनर",
    pestScannerDesc: "फोटो से फसल की समस्याओं को तुरंत पहचानें।",
    soilHealth: "मृदा स्वास्थ्य विश्लेषण",
    soilHealthDesc: "उर्वरक और संशोधन की सिफारिशें प्राप्त करें।",
    cropCalendar: "फसल कैलेंडर",
    cropCalendarDesc: "एक व्यक्तिगत फसल गतिविधि अनुसूची बनाएं।",
    profitSimulator: "लाभ सिम्युलेटर",
    profitSimulatorDesc: "बाजार चर के साथ फसल लाभप्रदता की तुलना करें।",
    weatherForecast: "मौसम पूर्वानुमान",
    weatherDesc: "स्थानीय मौसम और सलाह देखें।",
    cropRotation: "फसल चक्र योजनाकार",
    cropRotationDesc: "मिट्टी के स्वास्थ्य को बेहतर बनाने के लिए एक बहु-वर्षीय योजना प्राप्त करें।",
    rotationPlannerTitle: "फसल चक्र योजनाकार",
    rotationPlannerSubtitle: "बेहतर मिट्टी स्वास्थ्य और उपज के लिए एक बहु-वर्षीय योजना बनाएं",
    yourCrops: "आपकी उपलब्ध फसलें",
    yourCropsDesc: "आप जो भी फसलें उगा सकते हैं, उनका चयन करें।",
    soilType: "आपकी प्रमुख मिट्टी का प्रकार",
    generatePlan: "3-वर्षीय योजना बनाएं",
    fetchingPlan: "योजना बना रहा है...",
    rotationPlanForYou: "आपकी 3-वर्षीय रोटेशन योजना",
    planSummary: "योजना सारांश और लाभ",
    idealConditions: "आदर्श स्थितियाँ",
    varieties: "लोकप्रिय किस्में",
    cultivationPractices: "खेती की प्रक्रियाएँ",
    generateVideo: "एआई वीडियो पाठ देखें",
    generatingVideo: "आपका वीडियो पाठ तैयार हो रहा है... इसमें कुछ मिनट लग सकते हैं।",
    videoFailed: "वीडियो बनाने में विफल। कृपया बाद में पुन: प्रयास करें।",
    dealerLocator: "कृषि-डीलर लोकेटर",
    dealerLocatorDesc: "आस-पास के उर्वरक और बीज भंडार खोजें।",
    dealerLocatorTitle: "कृषि-डीलर लोकेटर",
    dealerLocatorSubtitle: "आपके पास कृषि आपूर्तिकर्ताओं को ढूंढना",
    fetchingDealers: "आस-पास के डीलर खोजे जा रहे हैं...",
    sortByRating: "रेटिंग के अनुसार छाँटें",
    rating: "रेटिंग",
    noRatingAvailable: "कोई रेटिंग उपलब्ध नहीं है",
    gettingYourLocation: "आपका स्थान प्राप्त किया जा रहा है...",
    locationError: "आपका स्थान प्राप्त नहीं हो सका। कृपया स्थान सेवाएं सक्षम करें और पुनः प्रयास करें।",
    badgeUnlocked: "बैज अनलॉक हुआ!",
    myBadges: "मेरे बैज",
    fertilizerCalculator: "उर्वरक कैलकुलेटर",
    fertilizerCalculatorDesc: "अपनी फसल और भूमि के आकार के लिए एनपीके खुराक की गणना करें।",
    calculateFertilizer: "उर्वरक की गणना करें",
    recommendedDosageFor: "{landSize} एकड़ {cropName} के लिए अनुशंसित खुराक",
    fertilizer: "उर्वरक",
    amount: "मात्रा",
    applicationAdvice: "आवेदन सलाह",
    fetchingRecs: "सिफारिशों की गणना हो रही है...",
    mandiPriceTracker: "मंडी मूल्य ट्रैकर",
    mandiPriceTrackerDesc: "अपनी फसल के लिए ऐतिहासिक मंडी कीमतों का विश्लेषण करें।",
    mandiPriceTrackerTitle: "मंडी मूल्य ट्रैकर",
    mandiPriceTrackerSubtitle: "सही समय पर बेचने के लिए मूल्य प्रवृत्तियों का विश्लेषण करें",
    lastSixMonths: "पिछले 6 महीने का मूल्य रुझान",
    trendAnalysis: "एआई प्रवृत्ति विश्लेषण",
    fetchingTrends: "मूल्य रुझान प्राप्त हो रहे हैं...",
    liveConversation: "लाइव एआई वार्तालाप",
    liveConversationDesc: "एआई के साथ सीधे वास्तविक समय में बात करें।",
    liveConvTitle: "लाइव एआई वार्तालाप",
    liveConvSubtitle: "अपने एआई सहायक के साथ वास्तविक समय में आवाज से बातचीत करें",
    startConversation: "वार्तालाप शुरू करें",
    stopConversation: "वार्तालाप बंद करें",
    connecting: "कनेक्ट हो रहा है...",
    listening: "सुन रहा है...",
    speakNow: "अब बोलें...",
    modelIsSpeaking: "एआई बोल रहा है...",
    conversationEnded: "वार्तालाप समाप्त। फिर से शुरू करने के लिए स्टार्ट दबाएं।",
  },
  ta: {
    welcomeFarmer: "உங்கள் தனிப்பட்ட எண்ணெய் வித்து விவசாய உதவியாளர்",
    loginTitle: "திலஹன் சதிக்கு வரவேற்கிறோம்",
    loginSubtitle: "தொடங்குவதற்கு உங்கள் விவரங்களை உள்ளிடவும்",
    name: "பெயர்",
    namePlaceholder: "எ.கா., சுரேஷ் குமார்",
    language: "மொழி",
    location: "இடம் (மாநிலம்)",
    login: "பண்ணையில் நுழையவும்",
    comparativeEconomics: "ஒப்பீட்டு பொருளாதாரம் (ஒரு ஏக்கருக்கு)",
    landSizeAcres: "நில அளவு (ஏக்கர்)",
    traditionalCrop: "பாரம்பரிய பயிர்",
    oilseedCrop: "எண்ணெய் வித்து பயிர்",
    profitPerAcre: "ஒரு ஏக்கருக்கான லாபம்",
    profitSummary: "{traditionalCrop} க்கு பதிலாக {oilseedCrop} பயிரிடுவதன் மூலம், உங்கள் {landSize} ஏக்கர் நிலத்திற்கு {amount} சாத்தியமான லாப {changeType} காணலாம்.",
    increase: "அதிகரிப்பு",
    decrease: "குறைவு",
    profitabilitySimulator: "லாபகரமான சிமுலேட்டர்",
    yieldAdjustment: "மகசூல் சரிசெய்தல்",
    marketPriceAdjustment: "சந்தை விலை சரிசெய்தல்",
    liveMarketPrices: "நேரடி சந்தை விலைகள்",
    crop: "பயிர்",
    pricePerQuintal: "விலை (ஒரு குவிண்டால்)",
    trend: "போக்கு",
    up: "மேலே",
    down: "கீழே",
    stable: "நிலையான",
    priceTrendsFor: "{crop} க்கான விலை போக்குகள்",
    weatherAdvisoryFor: "{location} க்கான வானிலை ஆலோசனை",
    learnTitle: "கற்றல் மையம்",
    learnSubtitle: "அறிவு மற்றும் சிறந்த நடைமுறைகள்",
    oilseedCropGuides: "எண்ணெய் வித்து பயிர் வழிகாட்டிகள்",
    generalLearning: "பொது கற்றல்",
    schemesTitle: "அரசு திட்டங்கள்",
    schemesSubtitle: "விவசாயிகளுக்கான நிதி ஆதரவு மற்றும் காப்பீடு",
    searchSchemes: "திட்டங்களைத் தேடு...",
    eligibility: "தகுதி",
    learnMore: "மேலும் அறிக",
    communityTitle: "சமூக மையம்",
    communitySubtitle: "சக விவசாயிகளுடன் இணையுங்கள், பகிருங்கள், போட்டியிடுங்கள்",
    startDiscussion: "ஒரு புதிய விவாதத்தைத் தொடங்குங்கள்",
    postTitle: "தலைப்பு",
    postTitlePlaceholder: "எ.கா., கடுகுக்கு சிறந்த உரம் எது?",
    postContent: "உள்ளடக்கம்",
    postContentPlaceholder: "உங்கள் கேள்வி அல்லது அனுபவத்தை விவரிக்கவும்...",
    postDiscussion: "விவாதத்தை இடுகையிடவும்",
    replies: "பதில்கள்",
    share: "பகிர்",
    sendReply: "பதில் அனுப்பு",
    forum: "அரங்கம்",
    leaderboard: "லீடர்போர்டு",
    rank: "தரம்",
    farmer: "விவசாயி",
    score: "மதிப்பெண்",
    yourRank: "உங்கள் தரம்",
    farmerScore: "விவசாயி மதிப்பெண்",
    fasalSalah: "ஃபசல் சலா (AI ஆலோசகர்)",
    initialBotMessage: "வணக்கம்! நான் உங்கள் AI விவசாய உதவியாளர். எண்ணெய் வித்து வளர்ப்பு பற்றி என்னிடம் எதுவும் கேளுங்கள்.",
    askQuestionPlaceholder: "உங்கள் கேள்வியை தட்டச்சு செய்யவும்...",
    send: "அனுப்பு",
    startRecording: "குரலில் கேளுங்கள்",
    stopRecording: "பதிவை நிறுத்து",
    scannerTitle: "பூச்சி மற்றும் நோய் ஸ்கேனர்",
    scannerInstruction: "பாதிக்கப்பட்ட தாவர இலையில் உங்கள் கேமராவை வைத்து ஒரு புகைப்படம் எடுக்கவும்.",
    takePhoto: "புகைப்படம் எடுத்து பகுப்பாய்வு செய்யவும்",
    retakePhoto: "மீண்டும் புகைப்படம் எடுக்கவும்",
    analyzing: "பகுப்பாய்வு செய்யப்படுகிறது...",
    soilAnalysisTitle: "மண் சுகாதார பகுப்பாய்வு",
    soilAnalysisSubtitle: "உங்கள் பண்ணைக்கான தனிப்பட்ட பரிந்துரைகளைப் பெறுங்கள்",
    targetCrop: "இலக்கு எண்ணெய் வித்து பயிர்",
    phLevel: "pH நிலை",
    organicMatter: "கரிமப் பொருள்",
    nitrogenLevel: "நைட்ரஜன் நிலை",
    phosphorusLevel: "பாஸ்பரஸ் நிலை",
    potassiumLevel: "பொட்டாசியம் நிலை",
    low: "குறைந்த",
    medium: "நடுத்தர",
    high: "அதிக",
    analyzeSoil: "மண்ணை பகுப்பாய்வு செய்யவும்",
    soilAnalysisError: "மண் பகுப்பாய்வு பெற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
    fertilizerRecs: "உரப் பரிந்துரைகள்",
    amendmentRecs: "மண் திருத்தப் பரிந்துரைகள்",
    generalAdvice: "பொதுவான அறிவுரை",
    calendarTitle: "விவசாய நாட்காட்டி",
    calendarSubtitle: "{location} இல் {crop} க்கான தனிப்பட்ட அட்டவணை",
    fetchingCalendar: "உங்கள் நாட்காட்டி உருவாக்கப்படுகிறது...",
    tools: "விவசாயி கருவிகள்",
    toolsDesc: "நீங்கள் சிறந்த முறையில் விவசாயம் செய்ய உதவும் பயன்பாடுகள்",
    pestScanner: "பூச்சி மற்றும் நோய் ஸ்கேனர்",
    pestScannerDesc: "ஒரு புகைப்படத்திலிருந்து பயிர் சிக்கல்களை உடனடியாக அடையாளம் காணவும்.",
    soilHealth: "மண் சுகாதார பகுப்பாய்வு",
    soilHealthDesc: "உரம் மற்றும் திருத்தப் பரிந்துரைகளைப் பெறுங்கள்.",
    cropCalendar: "பயிர் நாட்காட்டி",
    cropCalendarDesc: "ஒரு தனிப்பட்ட பயிர் செயல்பாட்டு அட்டவணையை உருவாக்கவும்.",
    profitSimulator: "லாப சிமுலேட்டர்",
    profitSimulatorDesc: "சந்தை மாறிகளுடன் பயிர் லாபத்தை ஒப்பிடவும்.",
    weatherForecast: "வானிலை முன்னறிவிப்பு",
    weatherDesc: "உள்ளூர் வானிலை மற்றும் ஆலோசனைகளைப் பார்க்கவும்.",
    cropRotation: "பயிர் சுழற்சி திட்டமிடுபவர்",
    cropRotationDesc: "மண் ஆரோக்கியத்தை மேம்படுத்த பல ஆண்டு திட்டத்தைப் பெறுங்கள்.",
    rotationPlannerTitle: "பயிர் சுழற்சி திட்டமிடுபவர்",
    rotationPlannerSubtitle: "சிறந்த மண் ஆரோக்கியம் மற்றும் விளைச்சலுக்கான பல ஆண்டு திட்டத்தை உருவாக்கவும்",
    yourCrops: "உங்களிடம் உள்ள பயிர்கள்",
    yourCropsDesc: "நீங்கள் பயிரிடக்கூடிய அனைத்து பயிர்களையும் தேர்ந்தெடுக்கவும்.",
    soilType: "உங்கள் प्रमुख மண் வகை",
    generatePlan: "3 ஆண்டு திட்டத்தை உருவாக்கவும்",
    fetchingPlan: "திட்டம் உருவாக்கப்படுகிறது...",
    rotationPlanForYou: "உங்கள் 3 ஆண்டு சுழற்சி திட்டம்",
    planSummary: "திட்ட சுருக்கம் மற்றும் நன்மைகள்",
    idealConditions: "சிறந்த நிலைமைகள்",
    varieties: "பிரபலமான வகைகள்",
    cultivationPractices: "சாகுபடி முறைகள்",
    generateVideo: "AI வீடியோ பாடத்தைப் பார்க்கவும்",
    generatingVideo: "உங்கள் வீடியோ பாடம் உருவாக்கப்படுகிறது... இதற்கு சில நிமிடங்கள் ஆகலாம்.",
    videoFailed: "வீடியோவை உருவாக்க முடியவில்லை. பின்னர் மீண்டும் முயற்சிக்கவும்.",
    dealerLocator: "விவசாய-டீலர் லொக்கேட்டர்",
    dealerLocatorDesc: "அருகிலுள்ள உரம் மற்றும் விதை கடைகளைக் கண்டறியவும்.",
    dealerLocatorTitle: "விவசாய-டீலர் லொக்கேட்டர்",
    dealerLocatorSubtitle: "உங்களுக்கு அருகிலுள்ள விவசாயப் பொருட்களைக் கண்டறிதல்",
    fetchingDealers: "அருகிலுள்ள டீலர்கள் தேடப்படுகிறார்கள்...",
    sortByRating: "மதிப்பீட்டின்படி வரிசைப்படுத்தவும்",
    rating: "மதிப்பீடு",
    noRatingAvailable: "மதிப்பீடு இல்லை",
    gettingYourLocation: "உங்கள் இருப்பிடம் பெறப்படுகிறது...",
    locationError: "உங்கள் இருப்பிடத்தைப் பெற முடியவில்லை. தயவுசெய்து இருப்பிடச் சேவைகளை இயக்கி மீண்டும் முயற்சிக்கவும்.",
    badgeUnlocked: "பேட்ஜ் திறக்கப்பட்டது!",
    myBadges: "எனது பேட்ஜ்கள்",
    fertilizerCalculator: "உரக் கால்குலேட்டர்",
    fertilizerCalculatorDesc: "உங்கள் பயிர் மற்றும் நில அளவுக்கு NPK அளவைக் கணக்கிடுங்கள்.",
    calculateFertilizer: "उரத்தைக் கணக்கிடுங்கள்",
    recommendedDosageFor: "{landSize} ஏக்கர் {cropName} க்கான பரிந்துரைக்கப்பட்ட அளவு",
    fertilizer: "உரம்",
    amount: "அளவு",
    applicationAdvice: "பயன்பாட்டு அறிவுரை",
    fetchingRecs: "பரிந்துரைகள் கணக்கிடப்படுகின்றன...",
    mandiPriceTracker: "மண்டி விலை டிராக்கர்",
    mandiPriceTrackerDesc: "உங்கள் பயிரின் வரலாற்று மண்டி விலைகளை பகுப்பாய்வு செய்யுங்கள்.",
    mandiPriceTrackerTitle: "மண்டி விலை டிராக்கர்",
    mandiPriceTrackerSubtitle: "சரியான நேரத்தில் விற்க விலை போக்குகளை பகுப்பாய்வு செய்யுங்கள்",
    lastSixMonths: "கடந்த 6 மாத விலை போக்கு",
    trendAnalysis: "AI போக்கு பகுப்பாய்வு",
    fetchingTrends: "விலை போக்குகள் பெறப்படுகின்றன...",
    liveConversation: "நேரடி AI உரையாடல்",
    liveConversationDesc: "AI உடன் நேரடியாக உண்மையான நேரத்தில் பேசுங்கள்.",
    liveConvTitle: "நேரடி AI உரையாடல்",
    liveConvSubtitle: "உங்கள் AI உதவியாளருடன் உண்மையான நேர குரல் உரையாடல் நடத்துங்கள்",
    startConversation: "உரையாடலைத் தொடங்கு",
    stopConversation: "உரையாடலை நிறுத்து",
    connecting: "இணைக்கப்படுகிறது...",
    listening: "கேட்கிறது...",
    speakNow: "இப்போது பேசுங்கள்...",
    modelIsSpeaking: "AI பேசுகிறது...",
    conversationEnded: "உரையாடல் முடிந்தது. மீண்டும் தொடங்க, தொடங்கு என்பதை அழுத்தவும்.",
  },
  mr: {
    welcomeFarmer: "तुमचा वैयक्तिक तेलबिया शेती सहाय्यक",
    loginTitle: "तिलहन साथी मध्ये आपले स्वागत आहे",
    loginSubtitle: "सुरुवात करण्यासाठी आपले तपशील प्रविष्ट करा",
    name: "नाव",
    namePlaceholder: "उदा., सुरेश कुमार",
    language: "भाषा",
    location: "स्थान (राज्य)",
    login: "शेतात प्रवेश करा",
    comparativeEconomics: "तुलनात्मक अर्थशास्त्र (प्रति एकर)",
    landSizeAcres: "जमिनीचे क्षेत्र (एकर)",
    traditionalCrop: "पारंपारिक पीक",
    oilseedCrop: "तेलबिया पीक",
    profitPerAcre: "प्रति एकर नफा",
    profitSummary: "{traditionalCrop} ऐवजी {oilseedCrop} ची लागवड करून, तुम्ही तुमच्या {landSize} एकर जमिनीसाठी {amount} च्या संभाव्य नफ्यात {changeType} पाहू शकता.",
    increase: "वाढ",
    decrease: "घट",
    profitabilitySimulator: "नफा सिम्युलेटर",
    yieldAdjustment: "उत्पन्न समायोजन",
    marketPriceAdjustment: "बाजारभाव समायोजन",
    liveMarketPrices: "थेट बाजारभाव",
    crop: "पीक",
    pricePerQuintal: "भाव (प्रति क्विंटल)",
    trend: "कल",
    up: "वर",
    down: "खाली",
    stable: "स्थिर",
    priceTrendsFor: "{crop} साठी बाजारभाव कल",
    weatherAdvisoryFor: "{location} साठी हवामान सल्ला",
    learnTitle: "शिक्षण केंद्र",
    learnSubtitle: "ज्ञान आणि सर्वोत्तम पद्धती",
    oilseedCropGuides: "तेलबिया पीक मार्गदर्शक",
    generalLearning: "सामान्य शिक्षण",
    schemesTitle: "सरकारी योजना",
    schemesSubtitle: "शेतकऱ्यांसाठी आर्थिक सहाय्य आणि विमा",
    searchSchemes: "योजना शोधा...",
    eligibility: "पात्रता",
    learnMore: "अधिक जाणून घ्या",
    communityTitle: "शेतकरी केंद्र",
    communitySubtitle: "सहकारी शेतकऱ्यांशी संपर्क साधा, शेअर करा आणि स्पर्धा करा",
    startDiscussion: "नवीन चर्चा सुरू करा",
    postTitle: "शीर्षक",
    postTitlePlaceholder: "उदा., मोहरीसाठी सर्वोत्तम खत कोणते?",
    postContent: "मजकूर",
    postContentPlaceholder: "तुमचा प्रश्न किंवा अनुभव सांगा...",
    postDiscussion: "चर्चा पोस्ट करा",
    replies: "उत्तरे",
    share: "शेअर करा",
    sendReply: "उत्तर द्या",
    forum: "मंच",
    leaderboard: "लीडरबोर्ड",
    rank: "रँक",
    farmer: "शेतकरी",
    score: "गुण",
    yourRank: "तुमची रँक",
    farmerScore: "शेतकरी गुण",
    fasalSalah: "फसल सलाह (AI सल्लागार)",
    initialBotMessage: "नमस्कार! मी तुमचा AI शेती सहाय्यक आहे. मला तेलबिया लागवडीबद्दल काहीही विचारा.",
    askQuestionPlaceholder: "तुमचा प्रश्न टाइप करा...",
    send: "पाठवा",
    startRecording: "आवाजाने विचारा",
    stopRecording: "रेकॉर्डिंग थांबवा",
    scannerTitle: "कीड आणि रोग स्कॅनर",
    scannerInstruction: "तुमचा कॅमेरा प्रभावित वनस्पतीच्या पानावर धरा आणि एक फोटो घ्या.",
    takePhoto: "फोटो घ्या आणि विश्लेषण करा",
    retakePhoto: "पुन्हा फोटो घ्या",
    analyzing: "विश्लेषण होत आहे...",
    soilAnalysisTitle: "मृदा आरोग्य विश्लेषण",
    soilAnalysisSubtitle: "आपल्या शेतासाठी वैयक्तिकृत शिफारसी मिळवा",
    targetCrop: "लक्ष्य तेलबिया पीक",
    phLevel: "सामू पातळी",
    organicMatter: "सेंद्रिय पदार्थ",
    nitrogenLevel: "नायट्रोजन पातळी",
    phosphorusLevel: "फॉस्फरस पातळी",
    potassiumLevel: "पोटॅशियम पातळी",
    low: "कमी",
    medium: "मध्यम",
    high: "उच्च",
    analyzeSoil: "मातीचे विश्लेषण करा",
    soilAnalysisError: "माती विश्लेषण अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
    fertilizerRecs: "खत शिफारसी",
    amendmentRecs: "माती सुधारणा शिफारसी",
    generalAdvice: "सामान्य सल्ला",
    calendarTitle: "शेती कॅलेंडर",
    calendarSubtitle: "{location} मध्ये {crop} साठी वैयक्तिकृत वेळापत्रक",
    fetchingCalendar: "तुमचे कॅलेंडर तयार होत आहे...",
    tools: "शेतकरी साधने",
    toolsDesc: "तुम्हाला स्मार्ट शेती करण्यास मदत करणारी साधने",
    pestScanner: "कीड आणि रोग स्कॅनर",
    pestScannerDesc: "फोटोवरून पिकाच्या समस्या त्वरित ओळखा.",
    soilHealth: "मृदा आरोग्य विश्लेषण",
    soilHealthDesc: "खत आणि सुधारणा शिफारसी मिळवा.",
    cropCalendar: "पीक कॅलेंडर",
    cropCalendarDesc: "वैयक्तिक पीक क्रियाकलाप वेळापत्रक तयार करा.",
    profitSimulator: "नफा सिम्युलेटर",
    profitSimulatorDesc: "बाजारपेठेतील बदलांसह पीक नफ्याची तुलना करा.",
    weatherForecast: "हवामान अंदाज",
    weatherDesc: "स्थानिक हवामान आणि सल्ला पहा.",
    cropRotation: "पीक फेरपालट नियोजक",
    cropRotationDesc: "मातीचे आरोग्य सुधारण्यासाठी बहु-वर्षीय योजना मिळवा.",
    rotationPlannerTitle: "पीक फेरपालट नियोजक",
    rotationPlannerSubtitle: "चांगल्या मातीच्या आरोग्यासाठी आणि उत्पन्नासाठी बहु-वर्षीय योजना तयार करा",
    yourCrops: "तुमची उपलब्ध पिके",
    yourCropsDesc: "तुम्ही वाढवू शकता ती सर्व पिके निवडा.",
    soilType: "तुमचा प्रमुख मातीचा प्रकार",
    generatePlan: "3-वर्षांची योजना तयार करा",
    fetchingPlan: "योजना तयार होत आहे...",
    rotationPlanForYou: "तुमची 3-वर्षांची फेरपालट योजना",
    planSummary: "योजना सारांश आणि फायदे",
    idealConditions: "आदर्श परिस्थिती",
    varieties: "लोकप्रिय वाण",
    cultivationPractices: "लागवड पद्धती",
    generateVideo: "एआय व्हिडिओ पाठ पहा",
    generatingVideo: "तुमचा व्हिडिओ पाठ तयार होत आहे... यास काही मिनिटे लागू शकतात.",
    videoFailed: "व्हिडिओ तयार करण्यात अयशस्वी. कृपया नंतर पुन्हा प्रयत्न करा.",
    dealerLocator: "कृषी-विक्रेता शोधक",
    dealerLocatorDesc: "जवळची खत आणि बियाणे दुकाने शोधा.",
    dealerLocatorTitle: "कृषी-विक्रेता शोधक",
    dealerLocatorSubtitle: "तुमच्या जवळ कृषी पुरवठादार शोधत आहे",
    fetchingDealers: "जवळचे विक्रेते शोधत आहे...",
    sortByRating: "रेटिंगनुसार क्रमवारी लावा",
    rating: "रेटिंग",
    noRatingAvailable: "रेटिंग उपलब्ध नाही",
    gettingYourLocation: "तुमचे स्थान मिळवत आहे...",
    locationError: "तुमचे स्थान मिळू शकले नाही. कृपया स्थान सेवा सक्षम करा आणि पुन्हा प्रयत्न करा.",
    badgeUnlocked: "बॅज अनलॉक झाला!",
    myBadges: "माझे बॅज",
    fertilizerCalculator: "खत कॅल्क्युलेटर",
    fertilizerCalculatorDesc: "तुमच्या पीक आणि जमिनीच्या आकारासाठी NPK डोसची गणना करा.",
    calculateFertilizer: "खताची गणना करा",
    recommendedDosageFor: "{landSize} एकर {cropName} साठी शिफारस केलेला डोस",
    fertilizer: "खत",
    amount: "प्रमाण",
    applicationAdvice: "अर्ज सल्ला",
    fetchingRecs: "शिफारसींची गणना करत आहे...",
    mandiPriceTracker: "मंडी भाव ट्रॅकर",
    mandiPriceTrackerDesc: "तुमच्या पिकासाठी ऐतिहासिक मंडी भावांचे विश्लेषण करा.",
    mandiPriceTrackerTitle: "मंडी भाव ट्रॅकर",
    mandiPriceTrackerSubtitle: "योग्य वेळी विक्री करण्यासाठी भावाच्या ट्रेंडचे विश्लेषण करा",
    lastSixMonths: "मागील 6 महिन्यांचा भाव ट्रेंड",
    trendAnalysis: "एआय ट्रेंड विश्लेषण",
    fetchingTrends: "भावाचे ट्रेंड मिळवत आहे...",
    liveConversation: "थेट AI संभाषण",
    liveConversationDesc: "AI शी थेट रिअल-टाइममध्ये बोला.",
    liveConvTitle: "थेट AI संभाषण",
    liveConvSubtitle: "तुमच्या AI सहाय्यकासोबत रिअल-टाइम व्हॉइस संभाषण करा",
    startConversation: "संभाषण सुरू करा",
    stopConversation: "संभाषण थांबवा",
    connecting: "कनेक्ट करत आहे...",
    listening: "ऐकत आहे...",
    speakNow: "आता बोला...",
    modelIsSpeaking: "AI बोलत आहे...",
    conversationEnded: "संभाषण संपले. पुन्हा सुरू करण्यासाठी स्टार्ट दाबा.",
  },
  bn: {
    welcomeFarmer: "আপনার ব্যক্তিগত তৈলবীজ চাষ সহকারী",
    loginTitle: "তিলহন সাথী-তে স্বাগতম",
    loginSubtitle: "শুরু করতে আপনার বিবরণ লিখুন",
    name: "নাম",
    namePlaceholder: "উদাঃ, সুরেশ কুমার",
    language: "ভাষা",
    location: "অবস্থান (রাজ্য)",
    login: "খামারে প্রবেশ করুন",
    comparativeEconomics: "তুলনামূলক অর্থনীতি (একর প্রতি)",
    landSizeAcres: "জমির আকার (একর)",
    traditionalCrop: "ঐতিহ্যবাহী ফসল",
    oilseedCrop: "তৈলবীজ ফসল",
    profitPerAcre: "একর প্রতি লাভ",
    profitSummary: "{traditionalCrop} এর পরিবর্তে {oilseedCrop} চাষ করে, আপনি আপনার {landSize} একর জমির জন্য {amount} টাকার সম্ভাব্য লাভ {changeType} দেখতে পারেন।",
    increase: "বৃদ্ধি",
    decrease: "হ্রাস",
    profitabilitySimulator: "লাভজনকতা সিমুলেটর",
    yieldAdjustment: "ফলন সমন্বয়",
    marketPriceAdjustment: "বাজার মূল্য সমন্বয়",
    liveMarketPrices: "লাইভ বাজার দর",
    crop: "ফসল",
    pricePerQuintal: "দর (কুইন্টাল প্রতি)",
    trend: "প্রবণতা",
    up: "ঊর্ধ্বমুখী",
    down: "নিম্নমুখী",
    stable: "স্থিতিশীল",
    priceTrendsFor: "{crop} এর মূল্যের প্রবণতা",
    weatherAdvisoryFor: "{location} এর জন্য আবহাওয়ার পরামর্শ",
    learnTitle: "শিক্ষা কেন্দ্র",
    learnSubtitle: "জ্ঞান এবং সেরা অনুশীলন",
    oilseedCropGuides: "তৈলবীজ ফসল নির্দেশিকা",
    generalLearning: "সাধারণ শিক্ষা",
    schemesTitle: "সরকারি প্রকল্প",
    schemesSubtitle: "কৃষকদের জন্য আর্থিক সহায়তা এবং বীমা",
    searchSchemes: "প্রকল্প অনুসন্ধান করুন...",
    eligibility: "যোগ্যতা",
    learnMore: "আরও জানুন",
    communityTitle: "কৃষক কেন্দ্র",
    communitySubtitle: "সহকর্মী কৃষকদের সাথে সংযোগ স্থাপন করুন, শেয়ার করুন এবং প্রতিযোগিতা করুন",
    startDiscussion: "একটি নতুন আলোচনা শুরু করুন",
    postTitle: "শিরোনাম",
    postTitlePlaceholder: "উদাঃ, সর্ষের জন্য সেরা সার কোনটি?",
    postContent: "বিষয়বস্তু",
    postContentPlaceholder: "আপনার প্রশ্ন বা অভিজ্ঞতা বর্ণনা করুন...",
    postDiscussion: "আলোচনা পোস্ট করুন",
    replies: "উত্তর",
    share: "শেয়ার করুন",
    sendReply: "উত্তর দিন",
    forum: "ফোরাম",
    leaderboard: "লিডারবোর্ড",
    rank: "র‍্যাঙ্ক",
    farmer: "কৃষক",
    score: "স্কোর",
    yourRank: "আপনার র‍্যাঙ্ক",
    farmerScore: "কৃষক স্কোর",
    fasalSalah: "ফসল সালাহ (AI উপদেষ্টা)",
    initialBotMessage: "নমস্কার! আমি আপনার AI কৃষি সহকারী। তৈলবীজ চাষ সম্পর্কে আমাকে কিছু জিজ্ঞাসা করুন।",
    askQuestionPlaceholder: "আপনার প্রশ্ন টাইপ করুন...",
    send: "পাঠান",
    startRecording: "ভয়েস দিয়ে জিজ্ঞাসা করুন",
    stopRecording: "রেকর্ডিং বন্ধ করুন",
    scannerTitle: "পোকামাকড় ও রোগ স্ক্যানার",
    scannerInstruction: "আপনার ক্যামেরাটি আক্রান্ত গাছের পাতায় নির্দেশ করুন এবং একটি ছবি তুলুন।",
    takePhoto: "ছবি তুলুন এবং বিশ্লেষণ করুন",
    retakePhoto: "আবার ছবি তুলুন",
    analyzing: "বিশ্লেষণ করা হচ্ছে...",
    soilAnalysisTitle: "মাটির স্বাস্থ্য বিশ্লেষণ",
    soilAnalysisSubtitle: "আপনার খামারের জন্য ব্যক্তিগতকৃত সুপারিশ পান",
    targetCrop: "লক্ষ্য তৈলবীজ ফসল",
    phLevel: "পিএইচ স্তর",
    organicMatter: "জৈব পদার্থ",
    nitrogenLevel: "নাইট্রোজেন স্তর",
    phosphorusLevel: "ফসফরাস স্তর",
    potassiumLevel: "পটাসিয়াম স্তর",
    low: "কম",
    medium: "মাঝারি",
    high: "বেশি",
    analyzeSoil: "মাটি বিশ্লেষণ করুন",
    soilAnalysisError: "মাটি বিশ্লেষণ পেতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।",
    fertilizerRecs: "সারের সুপারিশ",
    amendmentRecs: "মাটি সংশোধনের সুপারিশ",
    generalAdvice: "সাধারণ পরামর্শ",
    calendarTitle: "চাষের ক্যালেন্ডার",
    calendarSubtitle: "{location} এ {crop} এর জন্য ব্যক্তিগতকৃত সময়সূচী",
    fetchingCalendar: "আপনার ক্যালেন্ডার তৈরি করা হচ্ছে...",
    tools: "কৃষক সরঞ্জাম",
    toolsDesc: "আপনাকে স্মার্ট চাষ করতে সাহায্য করার জন্য ইউটিলিটি",
    pestScanner: "পোকামাকড় ও রোগ স্ক্যানার",
    pestScannerDesc: "একটি ছবি থেকে ফসলের সমস্যাগুলি অবিলম্বে সনাক্ত করুন।",
    soilHealth: "মাটির স্বাস্থ্য বিশ্লেষণ",
    soilHealthDesc: "সার এবং সংশোধন সুপারিশ পান।",
    cropCalendar: "ফসল ক্যালেন্ডার",
    cropCalendarDesc: "একটি ব্যক্তিগতকৃত ফসল কার্যকলাপ সময়সূচী তৈরি করুন।",
    profitSimulator: "লাভ সিমুলেটর",
    profitSimulatorDesc: "বাজারের ভেরিয়েবলের সাথে ফসলের লাভজনকতার তুলনা করুন।",
    weatherForecast: "আবহাওয়ার পূর্বাভাস",
    weatherDesc: "স্থানীয় আবহাওয়া এবং পরামর্শ দেখুন।",
    cropRotation: "ফসল ঘূর্ণন পরিকল্পনাকারী",
    cropRotationDesc: "মাটির স্বাস্থ্যের উন্নতির জন্য একটি বহু-বছরের পরিকল্পনা পান।",
    rotationPlannerTitle: "ফসল ঘূর্ণন পরিকল্পনাকারী",
    rotationPlannerSubtitle: "উন্নত মাটির স্বাস্থ্য এবং ফলনের জন্য একটি বহু-বছরের পরিকল্পনা তৈরি করুন",
    yourCrops: "আপনার উপলব্ধ ফসল",
    yourCropsDesc: "আপনি যে সমস্ত ফসল ফলাতে পারেন তা নির্বাচন করুন।",
    soilType: "আপনার প্রধান মাটির ধরন",
    generatePlan: "3-বছরের পরিকল্পনা তৈরি করুন",
    fetchingPlan: "পরিকল্পনা তৈরি করা হচ্ছে...",
    rotationPlanForYou: "আপনার 3-বছরের ঘূর্ণন পরিকল্পনা",
    planSummary: "পরিকল্পনার সারাংশ এবং সুবিধা",
    idealConditions: "আদর্শ অবস্থা",
    varieties: "জনপ্রিয় জাত",
    cultivationPractices: "চাষ পদ্ধতি",
    generateVideo: "এআই ভিডিও পাঠ দেখুন",
    generatingVideo: "আপনার ভিডিও পাঠ তৈরি হচ্ছে... এতে কয়েক মিনিট সময় লাগতে পারে।",
    videoFailed: "ভিডিও তৈরি করতে ব্যর্থ। অনুগ্রহ করে পরে আবার চেষ্টা করুন।",
    dealerLocator: "কৃষি-ডিলার লোকেটার",
    dealerLocatorDesc: "কাছাকাছি সার এবং বীজের দোকান খুঁজুন।",
    dealerLocatorTitle: "কৃষি-ডিলার লোকেটার",
    dealerLocatorSubtitle: "আপনার কাছাকাছি কৃষি সরবরাহকারী খোঁজা",
    fetchingDealers: "কাছাকাছি ডিলার খোঁজা হচ্ছে...",
    sortByRating: "রেটিং অনুসারে সাজান",
    rating: "রেটিং",
    noRatingAvailable: "কোন রেটিং উপলব্ধ নেই",
    gettingYourLocation: "আপনার অবস্থান জানা হচ্ছে...",
    locationError: "আপনার অবস্থান পেতে முடியவில்லை। অনুগ্রহ করে অবস্থান পরিষেবা সক্ষম করুন এবং আবার চেষ্টা করুন।",
    badgeUnlocked: "ব্যাজ আনলক করা হয়েছে!",
    myBadges: "আমার ব্যাজ",
    fertilizerCalculator: "সার ক্যালকুলেটর",
    fertilizerCalculatorDesc: "আপনার ফসল এবং জমির আকারের জন্য NPK ডোজ গণনা করুন।",
    calculateFertilizer: "সার গণনা করুন",
    recommendedDosageFor: "{cropName}-এর জন্য {landSize} একরের জন্য প্রস্তাবিত ডোজ",
    fertilizer: "সার",
    amount: "পরিমাণ",
    applicationAdvice: "প্রয়োগের পরামর্শ",
    fetchingRecs: "সুপারিশ গণনা করা হচ্ছে...",
    mandiPriceTracker: "মান্ডি প্রাইস ট্র্যাকার",
    mandiPriceTrackerDesc: "আপনার ফসলের জন্য ঐতিহাসিক মান্ডির দাম বিশ্লেষণ করুন।",
    mandiPriceTrackerTitle: "মান্ডি প্রাইস ট্র্যাকার",
    mandiPriceTrackerSubtitle: "সঠিক সময়ে বিক্রি করার জন্য মূল্যের প্রবণতা বিশ্লেষণ করুন",
    lastSixMonths: "গত 6 মাসের মূল্যের প্রবণতা",
    trendAnalysis: "এআই ট্রেন্ড বিশ্লেষণ",
    fetchingTrends: "মূল্যের প্রবণতা আনা হচ্ছে...",
    liveConversation: "লাইভ এআই কথোপকথন",
    liveConversationDesc: "এআই-এর সাথে সরাসরি রিয়েল-টাইমে কথা বলুন।",
    liveConvTitle: "লাইভ এআই কথোপকথন",
    liveConvSubtitle: "আপনার এআই সহকারীর সাথে একটি রিয়েল-টাইম ভয়েস কথোপকথন করুন",
    startConversation: "কথোপকথন শুরু করুন",
    stopConversation: "কথোপকথন বন্ধ করুন",
    connecting: "সংযোগ করা হচ্ছে...",
    listening: "শুনছে...",
    speakNow: "এখন বলুন...",
    modelIsSpeaking: "এআই কথা বলছে...",
    conversationEnded: "কথোপকথন শেষ। আবার শুরু করতে স্টার্ট চাপুন।",
  }
};

export type StringKey = keyof typeof localizedStrings.en;

export interface LocalizationContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: StringKey, replacements?: { [key: string]: string | number }) => string;
}