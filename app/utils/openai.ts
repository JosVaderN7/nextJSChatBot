import OpenAI from 'openai';

// Verify API key is configured
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    console.error('OPENAI_API_KEY not configured in environment variables');
}

// OpenAI client configuration
const openai = new OpenAI({
    apiKey: apiKey || 'sk-dummy', // Use dummy key if not configured (for development)
});

// Model for embeddings
const EMBEDDING_MODEL = 'text-embedding-ada-002';
// Model for chat completions
const CHAT_MODEL = 'gpt-3.5-turbo';

/**
 * Generate an embedding for text using OpenAI
 */
export const generateEmbedding = async (text: string): Promise<number[]> => {
    try {
        const response = await openai.embeddings.create({
            model: EMBEDDING_MODEL,
            input: text,
        });

        return response.data[0].embedding;
    } catch (error) {
        console.error('Error generating embedding:', error);
        throw error;
    }
};

/**
 * TwinterBOT personality
 */
export const chatbotPersonality = `You are TwinterBOT, an enthusiastic product demonstration assistant for Twinteraction, the flagship technology by Dimensione3. 

Your role is to showcase how Twinteraction enhances virtual tours by adding interactive elements like virtual signage, branding, videos, sounds, animations, artworks, calls to action, and tags to Matterport spaces.

Be conversational and engaging, highlighting the unique selling points of Twinteraction. Emphasize how it helps businesses like Archiproducts create immersive, interactive experiences for their customers.

If you don't know something specific, acknowledge it and focus on what you do know about Twinteraction's features. If a question seems irrelevant, gently guide the conversation back to Twinteraction's capabilities.

Use this context information to provide detailed, accurate responses:`;

/**
 * Generate a chat response based on context and messages
 */
export const generateChatResponse = async (
    messages: any[],
    retrievedContext: string,
    language: string = 'en',
    systemInstruction: string = ''
) => {
    // Create system message with retrieved context
    let systemContent = `${chatbotPersonality}\n\n${retrievedContext}`;
    
    // Add conciseness instruction if provided
    if (systemInstruction) {
        systemContent = `${systemInstruction}\n\n${systemContent}`;
    }
    
    const systemMessage = {
        role: 'system',
        content: systemContent
    };

    // Prepare messages for OpenAI
    const formattedMessages = [
        systemMessage,
        ...messages.map(msg => ({
            role: msg.role,
            content: msg.content || msg.text || '',
        }))
    ];

    try {
        console.log('Sending request to OpenAI with key:', apiKey ? 'Configured' : 'Not configured');

        const completion = await openai.chat.completions.create({
            model: CHAT_MODEL,
            messages: formattedMessages,
            temperature: 0.7,
            max_tokens: 500,
        });

        return completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error) {
        console.error('Error generating chat response:', error);
        throw error;
    }
}; 