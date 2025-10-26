import { GoogleGenAI } from '@google/genai';

export const generateVideo = async (prompt: string): Promise<string | null> => {
    // API Key selection is handled outside this service, but we create a new instance
    // to ensure we have the latest key from `process.env`.
    await window.aistudio.hasSelectedApiKey(); // check if key is selected
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        });

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (downloadLink) {
            // The video needs to be fetched with an API key
            const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
            if (!response.ok) {
                // If the key is invalid, it may throw a "Requested entity was not found" error
                if (response.status === 404) {
                    const errorText = await response.text();
                    if (errorText.includes("Requested entity was not found")) {
                        throw new Error("API_KEY_NOT_FOUND");
                    }
                }
                throw new Error(`Failed to fetch video: ${response.statusText}`);
            }
            const videoBlob = await response.blob();
            return URL.createObjectURL(videoBlob);
        }
        return null;
    } catch (error) {
        console.error("Error generating video:", error);

        // Convert error to a string to safely inspect its contents
        const errorString = (error instanceof Error) ? error.toString() : JSON.stringify(error);
        
        // Check for the specific message indicating an invalid API key or resource not found,
        // which the SDK may throw during `generateVideos` or `getVideosOperation`.
        if (errorString.includes("Requested entity was not found") || errorString.includes("API key not valid")) {
            throw new Error("API_KEY_NOT_FOUND");
        }
        
        // Return null for any other errors that are not API key related
        return null;
    }
};