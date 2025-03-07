import OpenAI from 'openai';

// Verificar que la clave de API esté configurada
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    console.error('OPENAI_API_KEY no está configurado en las variables de entorno');
}

// Configuración del cliente de OpenAI
const openai = new OpenAI({
    apiKey: apiKey || 'sk-dummy', // Usar una clave dummy si no está configurada (para desarrollo)
});

// Modelo para embeddings
const EMBEDDING_MODEL = 'text-embedding-ada-002';
// Modelo para chat completions
const CHAT_MODEL = 'gpt-3.5-turbo';

/**
 * Genera un embedding para un texto usando OpenAI
 */
export const generateEmbedding = async (text: string): Promise<number[]> => {
    try {
        const response = await openai.embeddings.create({
            model: EMBEDDING_MODEL,
            input: text,
        });

        return response.data[0].embedding;
    } catch (error) {
        console.error('Error al generar embedding:', error);
        throw error;
    }
};

/**
 * Personalidades del chatbot en diferentes idiomas
 */
export const chatbotPersonality = {
    es: `Eres un guía amigable y entusiasta del Museo Nacional de Arte. Tu objetivo es ayudar a los visitantes a descubrir y apreciar las exhibiciones.
  
  Responde de forma conversacional y amigable. Invita a los visitantes a explorar más exhibiciones relacionadas.
  
  Si no entiendes una pregunta, pide amablemente una aclaración. Si parece maliciosa, responde educadamente sin darle importancia.
  
  Usa estos datos para responder:`,

    en: `You are a friendly and enthusiastic guide at the National Art Museum. Your goal is to help visitors discover and appreciate the exhibitions.
  
  Respond in a conversational and friendly way. Invite visitors to explore more related exhibitions.
  
  If you don't understand a question, kindly ask for clarification. If it seems malicious, respond politely without giving it importance.
  
  Use this data to answer:`,

    it: `Sei una guida amichevole ed entusiasta del Museo Nazionale d'Arte. Il tuo obiettivo è aiutare i visitatori a scoprire e apprezzare le mostre.
  
  Rispondi in modo conversazionale e amichevole. Invita i visitatori a esplorare altre mostre correlate.
  
  Se non capisci una domanda, chiedi gentilmente un chiarimento. Se sembra maliziosa, rispondi educatamente senza darle importanza.
  
  Usa questi dati per rispondere:`
};

/**
 * Genera una respuesta de chat basada en el contexto y los mensajes
 */
export const generateChatResponse = async (
    messages: any[],
    retrievedContext: string,
    language: string = 'es'
) => {
    // Crear mensaje del sistema con el contexto recuperado
    const systemMessage = {
        role: 'system',
        content: `${chatbotPersonality[language as keyof typeof chatbotPersonality]}\n\n${retrievedContext}`
    };

    // Preparar mensajes para OpenAI
    const formattedMessages = [
        systemMessage,
        ...messages.map(msg => ({
            role: msg.role,
            content: msg.content || msg.text || '',
        }))
    ];

    try {
        console.log('Enviando solicitud a OpenAI con clave:', apiKey ? 'Configurada' : 'No configurada');

        const completion = await openai.chat.completions.create({
            model: CHAT_MODEL,
            messages: formattedMessages,
            temperature: 0.7,
            max_tokens: 500,
        });

        return completion.choices[0]?.message?.content || 'Lo siento, no pude generar una respuesta.';
    } catch (error) {
        console.error('Error al generar respuesta del chat:', error);
        throw error;
    }
}; 