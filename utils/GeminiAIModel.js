import { GoogleGenerativeAI } from "@google/generative-ai";

export function initializeChatSession() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
        console.error("❌ API Key is missing. Make sure NEXT_PUBLIC_GEMINI_API_KEY is set in .env.local");
        return null;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    return model.startChat({
        generationConfig: {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseMimeType: "text/plain",
        },
    });
}
