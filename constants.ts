import { Crop, Scheme, LearningContent, ForumPost, MarketPrice, Badge } from './types';

export const CROPS: Crop[] = [
  { id: 'mustard', name: 'Mustard', type: 'Oilseed', avgYield: 10, avgPrice: 5500, inputCost: 12000, localized: { hi: 'सरसों', ta: 'கடுகு', mr: 'मोहरी', bn: 'সরিষা' },
    description: "Mustard is a popular rabi crop in India, grown for its oil-rich seeds.",
    idealConditions: { soil: "Light to heavy soil, well-drained.", climate: "Cool and dry weather, sensitive to frost at flowering stage." },
    popularVarieties: ["Pusa Bold", "NRCHB-101", "Ganga"],
    cultivationPractices: ["Sow in October-November.", "Requires 2-3 irrigations.", "Harvest when pods turn yellowish-brown."]
  },
  { id: 'groundnut', name: 'Groundnut', type: 'Oilseed', avgYield: 8, avgPrice: 6000, inputCost: 15000, localized: { hi: 'मूंगफली', ta: 'நிலக்கடலை', mr: 'भुईमूग', bn: 'চিনাবাদাম' },
    description: "Groundnut, or peanut, is a major oilseed crop grown in both Kharif and Rabi seasons.",
    idealConditions: { soil: "Well-drained sandy loam soil.", climate: "Requires a long and warm growing season." },
    popularVarieties: ["Kadiri-6", "TG-37A", "Narayani"],
    cultivationPractices: ["Sow in June-July (Kharif) or Nov-Dec (Rabi).", "Keep field weed-free during early stages.", "Harvest when leaves yellow and start to fall."]
  },
  { id: 'soybean', name: 'Soybean', type: 'Oilseed', avgYield: 9, avgPrice: 4500, inputCost: 10000, localized: { hi: 'सोयाबीन', ta: 'சோயாபீன்ஸ்', mr: 'सोयाबीन', bn: 'সয়াবিন' },
    description: "Soybean is a versatile Kharif crop, rich in protein and oil.",
    idealConditions: { soil: "Well-drained, fertile loamy soils.", climate: "Warm and moist climate. 60-65 cm rainfall." },
    popularVarieties: ["JS-335", "MACS 1407", "JS 9560"],
    cultivationPractices: ["Sow with the onset of monsoon.", "Requires careful water management to avoid waterlogging.", "Harvest when pods are dry and moisture content is below 15%."]
  },
  { id: 'paddy', name: 'Paddy (Rice)', type: 'Traditional', avgYield: 15, avgPrice: 2000, inputCost: 20000, localized: { hi: 'धान', ta: 'நெல்', mr: 'भात', bn: 'ধান' },
    description: "Rice is a staple food crop in India, primarily grown in the Kharif season.",
    idealConditions: { soil: "Clayey loam soils are best.", climate: "Hot and humid climate with ample water." },
    popularVarieties: ["Basmati-370", "Swarna", "IR-64"],
    cultivationPractices: ["Transplanting is the most common method.", "Field should be flooded for most of the growth period.", "Harvest when grains are golden yellow."]
  },
  { id: 'wheat', name: 'Wheat', type: 'Traditional', avgYield: 20, avgPrice: 2100, inputCost: 18000, localized: { hi: 'गेहूँ', ta: 'கோதுமை', mr: 'गहू', bn: 'গম' },
    description: "Wheat is the most important rabi cereal crop in India.",
    idealConditions: { soil: "Well-drained loams and clay loams.", climate: "Cool, moist weather during vegetative growth and dry, warm weather at ripening." },
    popularVarieties: ["HD-2967", "WH-1105", "DBW-187"],
    cultivationPractices: ["Sow in November.", "Critical irrigation at Crown Root Initiation stage.", "Harvest in March-April."]
  },
];

export const BADGES: Badge[] = [
    { id: 'mustard-master', name: 'Mustard Master', cropId: 'mustard' },
    { id: 'groundnut-guru', name: 'Groundnut Guru', cropId: 'groundnut' },
    { id: 'soybean-specialist', name: 'Soybean Specialist', cropId: 'soybean' },
];


export const SCHEMES: Scheme[] = [
  { id: 1, name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)', description: 'Provides insurance coverage and financial support to farmers in the event of failure of any of the notified crop as a result of natural calamities, pests & diseases.', eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops in the notified areas are eligible for coverage.', link: 'https://pmfby.gov.in/' },
  { id: 2, name: 'National Mission on Oilseeds and Oil Palm (NMOOP)', description: 'Aims to increase the production of oilseeds and oil palm in the country to meet the domestic demand for edible oils.', eligibility: 'Varies by sub-components, generally applicable to all oilseed farmers.', link: 'https://nmoop.gov.in/' },
  { id: 3, name: 'Kisan Credit Card (KCC) Scheme', description: 'Provides farmers with timely access to credit for their cultivation and other needs.', eligibility: 'All farmers - individuals/joint borrowers who are owner cultivators.', link: 'https://www.sbi.co.in/web/agri-rural/agriculture-banking/crop-finance/kisan-credit-card' },
];

export const LEARNING_CONTENT: LearningContent[] = [
  { id: 1, title: 'Government Schemes for Farmers', type: 'article', thumbnail: 'https://images.unsplash.com/photo-1591159335209-65b822c3c132?q=80&w=200', readTime: '5 min read', navId: 'schemes' },
  { id: 2, title: 'Modern Irrigation Techniques', type: 'video', thumbnail: 'https://images.unsplash.com/photo-1563514247055-277161fa23d1?q=80&w=200', duration: '10:30' },
  { id: 3, title: 'Integrated Pest Management', type: 'guide', thumbnail: 'https://images.unsplash.com/photo-1590422247326-6d6006734e5a?q=80&w=200', readTime: '15 min read' },
  { id: 4, title: 'Soil Health Card Scheme', type: 'article', thumbnail: 'https://images.unsplash.com/photo-1557236202-a72283151557?q=80&w=200', readTime: '6 min read' },
];

export const FORUM_POSTS: ForumPost[] = [
  { id: 1, author: 'Ramesh Kumar', avatar: 'https://i.pravatar.cc/150?img=11', timestamp: '2 days ago', title: 'Low yield in my mustard crop this year', content: 'I have seen a significant drop in my mustard yield. I used the same seeds as last year. Any advice on what could be wrong? The weather was a bit unusual.', replies: 5 },
  { id: 2, author: 'Sunita Devi', avatar: 'https://i.pravatar.cc/150?img=5', timestamp: '5 days ago', title: 'Which soybean variety is best for Madhya Pradesh?', content: 'I am planning to sow soybean for the first time. Can anyone from MP suggest a high-yielding and disease-resistant variety?', replies: 12 },
];

export const MARKET_PRICES: MarketPrice[] = [
    { id: 'mustard', name: 'Mustard', price: 5650, trend: 'up', localized: { hi: 'सरसों', ta: 'கடுகு', mr: 'मोहरी', bn: 'সরিষা' } },
    { id: 'groundnut', name: 'Groundnut', price: 6200, trend: 'stable', localized: { hi: 'मूंगफली', ta: 'நிலக்கடலை', mr: 'भुईमूग', bn: 'চিনাবাদাম' } },
    { id: 'soybean', name: 'Soybean', price: 4400, trend: 'down', localized: { hi: 'सोयाबीन', ta: 'சோயாபீன்ஸ்', mr: 'सोयाबीन', bn: 'সয়াবিন' } },
    { id: 'wheat', name: 'Wheat', price: 2150, trend: 'stable', localized: { hi: 'गेहूँ', ta: 'கோதுமை', mr: 'गहू', bn: 'গম' } },
];

export const LEADERBOARD_USERS_MOCK = [
    { id: 101, name: 'Vijay Singh', avatar: 'https://i.pravatar.cc/150?img=12', unlockedBadgeCount: 3, postCount: 8 },
    { id: 102, name: 'Anjali Sharma', avatar: 'https://i.pravatar.cc/150?img=6', unlockedBadgeCount: 2, postCount: 15 },
    { id: 103, name: 'Rakesh Patel', avatar: 'https://i.pravatar.cc/150?img=13', unlockedBadgeCount: 2, postCount: 5 },
    { id: 104, name: 'Priya Reddy', avatar: 'https://i.pravatar.cc/150?img=7', unlockedBadgeCount: 1, postCount: 20 },
    { id: 105, name: 'Amit Kumar', avatar: 'https://i.pravatar.cc/150?img=14', unlockedBadgeCount: 1, postCount: 12 },
    { id: 106, name: 'Deepa Rao', avatar: 'https://i.pravatar.cc/150?img=8', unlockedBadgeCount: 1, postCount: 8 },
    { id: 107, name: 'Sanjay Verma', avatar: 'https://i.pravatar.cc/150?img=15', unlockedBadgeCount: 0, postCount: 10 },
];

export const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export const WEATHER_DATA: { [key: string]: { icon: string; temp: string; condition: string; advisory: string; } } = {
    'Gujarat': { icon: '☀️', temp: '36°C', condition: 'Sunny & Dry', advisory: 'High temperatures expected. Ensure adequate irrigation for crops, especially during flowering stages. Risk of heat stress.' },
    'Punjab': { icon: '⛅️', temp: '32°C', condition: 'Partly Cloudy', advisory: 'Weather is favorable. Monitor for pests as humidity might increase. Good time for fertilizer application.' },
    'Maharashtra': { icon: '🌦️', temp: '29°C', condition: 'Light Showers', advisory: 'Light rain expected. Avoid irrigation. Check for waterlogging in fields. Favorable conditions for fungal diseases.' },
    // Add more states as needed
};

export const SOIL_TYPES = ['Alluvial', 'Black', 'Red', 'Laterite', 'Desert', 'Mountain'];