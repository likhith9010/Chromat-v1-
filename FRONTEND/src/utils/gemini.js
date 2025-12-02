import { GoogleGenerativeAI } from '@google/generative-ai';

// Get API key from environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize only if API key exists
let genAI = null;
if (API_KEY && API_KEY !== 'YOUR_GEMINI_API_KEY') {
  genAI = new GoogleGenerativeAI(API_KEY);
}

const SYSTEM_PROMPT = `You are Chromat, an AI browser assistant. You help users browse the web, answer questions, and complete tasks.

Response Guidelines:
1. For NORMAL QUESTIONS (general knowledge, conversations): Respond naturally and conversationally.
2. For BROWSER TASKS (open website, search for, find, navigate, play video, etc.): Respond with a structured action format.

When a user asks you to perform a browser task, respond with:
- A brief acknowledgment message
- Followed by a JSON action object on a new line with this exact format:
ACTION: {"type": "browser_action", "steps": ["Step 1 description", "Step 2 description", "Step 3 description"], "url": "target_url_if_applicable"}

Examples:

User: "What is the capital of France?"
Response: "The capital of France is Paris. It's known for the Eiffel Tower, the Louvre Museum, and its rich history and culture."

User: "Open YouTube and play a song"
Response: "I'll help you open YouTube and play a song.
ACTION: {"type": "browser_action", "steps": ["Opening YouTube", "Searching for popular music", "Playing video"], "url": "https://www.youtube.com"}"

User: "Search for the best laptops under $1000"
Response: "I'll search for the best laptops under $1000 for you.
ACTION: {"type": "browser_action", "steps": ["Opening Google", "Searching for 'best laptops under $1000'", "Loading results"], "url": "https://www.google.com/search?q=best+laptops+under+$1000"}"

Always be helpful, concise, and accurate.`;

export async function getChatResponse(userMessage) {
  try {
    // Check if API key is set
    if (!genAI || !API_KEY || API_KEY === 'YOUR_GEMINI_API_KEY') {
      console.error('Gemini API key not configured. Current value:', API_KEY);
      console.error('Environment variables:', import.meta.env);
      return {
        type: 'text',
        content: 'API key not configured. Please set VITE_GEMINI_API_KEY in .env file and restart the app.'
      };
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT
    });

    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();

    // Parse the response to detect actions
    const actionMatch = text.match(/ACTION:\s*(\{.*\})/s);
    
    if (actionMatch) {
      try {
        const actionData = JSON.parse(actionMatch[1]);
        const messageText = text.replace(/ACTION:\s*\{.*\}/s, '').trim();
        
        return {
          type: 'action',
          content: messageText,
          actionStatus: {
            steps: actionData.steps || []
          },
          url: actionData.url || null
        };
      } catch (e) {
        console.error('Failed to parse action:', e);
        return {
          type: 'text',
          content: text
        };
      }
    }

    return {
      type: 'text',
      content: text
    };
  } catch (error) {
    console.error('Gemini API Error Details:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // Provide more specific error messages
    if (error.message?.includes('API_KEY_INVALID')) {
      return {
        type: 'text',
        content: 'Invalid API key. Please check your Gemini API key in the .env file.'
      };
    }
    
    if (error.message?.includes('model not found')) {
      return {
        type: 'text',
        content: 'Model not available. The gemini-2.5-flash model might not be accessible with your API key. Try using "gemini-1.5-flash" instead.'
      };
    }
    
    return {
      type: 'text',
      content: `Error: ${error.message || 'Unknown error occurred. Check console for details.'}`
    };
  }
}
