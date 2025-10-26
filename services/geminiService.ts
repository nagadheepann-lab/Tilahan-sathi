import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ChatMessage, Language, AnalysisResult, SoilData, SoilAnalysisResult, CalendarEvent, CropRotationPlan, Dealer, FertilizerRecommendation, MandiPriceData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getModelForTask = (task: 'simple' | 'complex' | 'fast') => {
    if (task === 'complex') return 'gemini-2.5-pro';
    if (task === 'fast') return 'gemini-2.5-flash-lite';
    return 'gemini-2.5-flash';
};

export const askGemini = async (history: ChatMessage[], question: string, language: Language, location: string): Promise<string> => {
    const model = getModelForTask('simple'); // Use Flash for chat
    const systemInstruction = `You are "Fasal Salah", an AI expert for Indian farmers. Provide concise, helpful advice. The user is a farmer in ${location}, India, and prefers responses in ${language}. Current date is ${new Date().toLocaleDateString()}.`;
    
    const contents = history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: question }] });

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents,
            config: {
                systemInstruction,
                temperature: 0.7,
                topP: 1,
            }
        });

        return response.text;
    } catch (error) {
        console.error("Error asking Gemini:", error);
        return "Sorry, I encountered an error. Please try again.";
    }
};

export const analyzeImageWithGemini = async (base64ImageData: string, language: Language): Promise<AnalysisResult | null> => {
    const model = 'gemini-2.5-flash'; // Good for multimodal tasks
    const prompt = `Analyze this image of a plant leaf. Identify the disease or pest. Provide a concise analysis in ${language}. If no disease is visible, state that the plant appears healthy.`;

    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: base64ImageData,
        },
    };

    const textPart = { text: prompt };
    
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            diseaseName: { type: Type.STRING, description: 'Name of the disease or pest. If healthy, say "Healthy".' },
            severity: { type: Type.STRING, description: 'Severity of the issue (Low, Medium, High). If healthy, say "Low".' },
            description: { type: Type.STRING, description: 'A brief description of the issue.' },
            immediateMeasures: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Steps to take immediately.' },
            preventiveMeasures: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Long-term preventive measures.' },
        },
        required: ['diseaseName', 'severity', 'description', 'immediateMeasures', 'preventiveMeasures']
    };

    try {
        const response = await ai.models.generateContent({
            model,
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: 'application/json',
                responseSchema,
            }
        });

        let jsonStr = response.text.trim();
        // The Gemini response for JSON can sometimes be wrapped in ```json ... ```
        if (jsonStr.startsWith("```json")) {
            jsonStr = jsonStr.substring(7, jsonStr.length - 3);
        }
        return JSON.parse(jsonStr) as AnalysisResult;
    } catch (error) {
        console.error("Error analyzing image with Gemini:", error);
        return null;
    }
};

export const getSoilRecommendations = async (soilData: SoilData, language: Language): Promise<SoilAnalysisResult | null> => {
    const model = getModelForTask('complex');
    const prompt = `Based on this soil data for a farm in India, provide recommendations for growing ${soilData.targetCrop}.
    Soil Data:
    - pH: ${soilData.ph}
    - Nitrogen: ${soilData.nitrogen}
    - Phosphorus: ${soilData.phosphorus}
    - Potassium: ${soilData.potassium}
    - Organic Matter: ${soilData.organicMatter}%
    
    Provide your response in ${language}.`;
    
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            fertilizerRecs: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Specific fertilizer recommendations (e.g., "Apply 50kg/acre Urea").' },
            amendmentRecs: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Recommendations for soil amendments (e.g., "Add lime to increase pH").' },
            generalAdvice: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'General advice for soil management for this crop.' },
        },
        required: ['fertilizerRecs', 'amendmentRecs', 'generalAdvice']
    };

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema,
            }
        });
        
        let jsonStr = response.text.trim();
        if (jsonStr.startsWith("```json")) {
            jsonStr = jsonStr.substring(7, jsonStr.length - 3);
        }
        return JSON.parse(jsonStr) as SoilAnalysisResult;
    } catch (error) {
        console.error("Error getting soil recommendations:", error);
        return null;
    }
};

export const getCalendarEvents = async (crop: string, location: string, language: Language): Promise<CalendarEvent[] | null> => {
    const model = getModelForTask('complex');
    const prompt = `Create a detailed crop calendar for ${crop} cultivation in ${location}, India, starting from this month. Provide key activities for each stage.`;
    
    const responseSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                date: { type: Type.STRING, description: 'Date range for the activity (e.g., "1st-2nd Week of Nov").' },
                title: { type: Type.STRING, description: 'Title of the activity.' },
                description: { type: Type.STRING, description: 'Brief description of the activity.' },
                category: { type: Type.STRING, description: 'Category: Sowing, Irrigation, Fertilizing, Pest Control, Harvesting, or General.' }
            },
            required: ['date', 'title', 'description', 'category']
        }
    };
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema,
                systemInstruction: `You provide output in ${language}.`
            }
        });

        let jsonStr = response.text.trim();
        if (jsonStr.startsWith("```json")) {
            jsonStr = jsonStr.substring(7, jsonStr.length - 3);
        }
        return JSON.parse(jsonStr) as CalendarEvent[];
    } catch (error) {
        console.error("Error getting calendar events:", error);
        return null;
    }
};

export const getCropRotationPlan = async (crops: string[], soilType: string, location: string, language: Language): Promise<CropRotationPlan | null> => {
    const model = getModelForTask('complex');
    const prompt = `Create a 3-year crop rotation plan for a farmer in ${location}, India, with ${soilType} soil. The farmer can grow the following crops: ${crops.join(', ')}. The plan should aim to improve soil health and maximize long-term yield.`;
    
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            plan: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        year: { type: Type.INTEGER },
                        crop: { type: Type.STRING },
                        justification: { type: Type.STRING, description: 'Why this crop is chosen for this year.' }
                    },
                    required: ['year', 'crop', 'justification']
                }
            },
            summary: { type: Type.STRING, description: 'A summary of the benefits of this rotation plan.' }
        },
        required: ['plan', 'summary']
    };
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema,
                systemInstruction: `You provide output in ${language}.`
            }
        });
        
        let jsonStr = response.text.trim();
        if (jsonStr.startsWith("```json")) {
            jsonStr = jsonStr.substring(7, jsonStr.length - 3);
        }
        return JSON.parse(jsonStr) as CropRotationPlan;
    } catch (error) {
        console.error("Error getting crop rotation plan:", error);
        return null;
    }
};

export const getDealerInfo = async (latitude: number, longitude: number, language: Language): Promise<Dealer[] | string | null> => {
    const model = getModelForTask('simple');
    const prompt = `Find agri-dealers (seed, fertilizer, pesticide shops) near the provided coordinates. Provide a list with name, address, phone number, and a user rating out of 5.`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                tools: [{ googleMaps: {} }],
                toolConfig: {
                    retrievalConfig: {
                        latLng: {
                            latitude,
                            longitude
                        }
                    }
                },
                systemInstruction: `You provide helpful information to farmers in ${language}.`
            }
        });

        const textResponse = response.text;
        if (!textResponse) return null;

        // Second Gemini call to structure the text response if needed
        const schema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    address: { type: Type.STRING },
                    phone: { type: Type.STRING },
                    rating: { type: Type.NUMBER, description: "Rating out of 5" }
                },
                required: ['name', 'address']
            }
        };

        const structuringResponse = await ai.models.generateContent({
            model,
            contents: `Extract the dealer information from the following text and format it as JSON. Text: ${textResponse}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            }
        });
        
        let jsonStr = structuringResponse.text.trim();
        if (jsonStr.startsWith("```json")) {
            jsonStr = jsonStr.substring(7, jsonStr.length - 3);
        }
        
        const dealers = JSON.parse(jsonStr) as Omit<Dealer, 'coordinates'>[];

        // Add simulated coordinates for map plotting
        return dealers.map(dealer => ({
            ...dealer,
            coordinates: {
                lat: latitude + (Math.random() - 0.5) * 0.05,
                lon: longitude + (Math.random() - 0.5) * 0.05,
            }
        }));

    } catch (error) {
        console.error("Error getting dealer info:", error);
        return null;
    }
};


// Summary functions for TTS
export const getScannerSummary = async (result: AnalysisResult, language: Language): Promise<string> => {
    const model = getModelForTask('simple');
    const prompt = `Based on the following JSON data from a plant disease scan, generate a short, one-sentence audio summary for a farmer. The summary should be in ${language} and should be reassuring and clear.
    
    Data: ${JSON.stringify(result, null, 2)}
    
    Example response format: "The scan shows [Disease Name] with [Severity] severity. Please check the recommended actions in the app."`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating scanner summary:", error);
        // Fallback to the original simple summary in case of an API error
        return `Analysis complete. The scan shows ${result.diseaseName} with ${result.severity} severity.`;
    }
};

export const getSoilAnalysisSummary = async (result: SoilAnalysisResult, language: Language): Promise<string> => {
    return `Soil analysis is complete. For fertilizer, it is recommended to: ${result.fertilizerRecs.join('. ')}. For amendments: ${result.amendmentRecs.join('. ')}. General advice: ${result.generalAdvice.join('. ')}.`;
};

export const getCalendarSummary = async (events: CalendarEvent[], crop: string, location: string, language: Language): Promise<string> => {
    const summary = events.map(e => `${e.date}: ${e.title}.`).join(' ');
    return `Here is the calendar summary for ${crop} in ${location}. ${summary}`;
};

export const getFertilizerRecommendations = async (cropName: string, landSize: number, language: Language): Promise<FertilizerRecommendation | null> => {
    const model = getModelForTask('simple');
    const prompt = `Calculate the recommended fertilizer dosage for ${landSize} acres of ${cropName} cultivation in India. Provide the total amounts for Urea, DAP, and MOP (Potash) in kilograms. Also provide a short, general application advice. Respond in ${language}.`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            recommendations: {
                type: Type.ARRAY,
                description: "List of fertilizers and their amounts.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        fertilizer: { type: Type.STRING, description: "Name of the fertilizer (e.g., Urea, DAP, MOP)." },
                        amount: { type: Type.STRING, description: "Recommended amount with units (e.g., '50 kg')." }
                    },
                    required: ["fertilizer", "amount"]
                }
            },
            advice: { type: Type.STRING, description: "A short, general advice on application timing or method." }
        },
        required: ["recommendations", "advice"]
    };

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema,
            }
        });
        
        let jsonStr = response.text.trim();
        if (jsonStr.startsWith("```json")) {
            jsonStr = jsonStr.substring(7, jsonStr.length - 3);
        }
        return JSON.parse(jsonStr) as FertilizerRecommendation;
    } catch (error) {
        console.error("Error getting fertilizer recommendations:", error);
        return null;
    }
};

export const getMandiPriceTrend = async (cropName: string, location: string, language: Language): Promise<MandiPriceData | null> => {
    const model = getModelForTask('complex');
    const prompt = `Generate a simulated historical mandi price trend for ${cropName} in ${location}, India, for the last 6 months. Provide data points for each month and a concise analysis of the trend for a farmer. The price should be per quintal. Respond in ${language}.`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            trendData: {
                type: Type.ARRAY,
                description: "List of monthly prices.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        month: { type: Type.STRING, description: "Month name (e.g., 'Jan', 'Feb')." },
                        price: { type: Type.NUMBER, description: "Average price for that month." }
                    },
                    required: ["month", "price"]
                }
            },
            analysis: { type: Type.STRING, description: "A short analysis of the price trend, advising the farmer." }
        },
        required: ["trendData", "analysis"]
    };

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema,
            }
        });

        let jsonStr = response.text.trim();
        if (jsonStr.startsWith("```json")) {
            jsonStr = jsonStr.substring(7, jsonStr.length - 3);
        }
        return JSON.parse(jsonStr) as MandiPriceData;
    } catch (error) {
        console.error("Error getting mandi price trend:", error);
        return null;
    }
};