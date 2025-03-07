import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/app/utils/openai';
import { getConversationContext } from '@/app/utils/conversation';

// Definir interfaces para los mensajes
interface ChatMessage {
    role: string;
    content?: string;
    text?: string;
    [key: string]: any;
}

/**
 * Endpoint principal para el chat que integra RAG
 */
export async function POST(req: NextRequest) {
    try {
        console.log("Received chat request");

        // Obtener datos de la solicitud
        const body = await req.json();
        console.log("Request body:", JSON.stringify(body, null, 2));

        // Compatibilidad con DeepChat
        let messages: ChatMessage[] = body.messages || [];
        let retrievedContext = body.retrievedContext || "";
        let systemInstruction = body.systemInstruction || "";
        
        // English is now the only language
        const lang = 'en';

        // Compatibilidad con diferentes formatos de mensajes
        if (body.text && !body.messages) {
            // Si es un formato diferente (directamente del componente DeepChat)
            console.log("Direct DeepChat format detected");
            messages = [...(body.history || []), { role: 'user', content: body.text }];
        }

        // Si no hay mensajes, crear un mensaje vacío para evitar errores
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            console.log("No valid messages provided, using empty message");
            messages = [{ role: 'user', content: 'Hello' }];
        }

        // Si no hay contexto recuperado, intentar recuperarlo ahora
        if (!retrievedContext || retrievedContext === "Store information") {
            console.log("No context provided, retrieving...");
            try {
                const lastUserMessage = messages.findLast((m: ChatMessage) =>
                    (m.role === 'user' && (m.content || m.text))
                )?.content ||
                    messages.findLast((m: ChatMessage) =>
                        (m.role === 'user' && (m.content || m.text))
                    )?.text ||
                    "";

                console.log("Last user message:", lastUserMessage);

                if (lastUserMessage) {
                    const baseUrl = req.nextUrl.origin;
                    const retrieveResponse = await fetch(`${baseUrl}/api/retrieve`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            query: lastUserMessage,
                            topK: 3,
                        }),
                    });

                    if (retrieveResponse.ok) {
                        const data = await retrieveResponse.json();
                        retrievedContext = data.context || "";
                        console.log("Retrieved context:", retrievedContext);
                    }
                }
            } catch (error) {
                console.error("Error retrieving context:", error);
            }
        }

        // Obtener el contexto de la conversación (últimos 6 mensajes)
        const conversationContext = getConversationContext(messages);

        // Si no hay contexto recuperado, manejar como caso fallback
        let context = retrievedContext;
        if (!context || typeof context !== 'string' || context.trim() === '') {
            // Default fallback context
            context = "I don't have specific information about this query, but I'll try to help you with what I know about Twinteraction by Dimensione3.";
        }

        console.log("Generating response with context:", context);

        // Generar respuesta usando OpenAI
        const response = await generateChatResponse(
            conversationContext,
            context,
            lang,
            systemInstruction
        );

        console.log("Generated response:", response);

        // Devolver la respuesta en el formato que espera DeepChat
        return NextResponse.json({ text: response });

    } catch (error: any) {
        console.error('Error processing chat request:', error);

        // Simple English error message
        return NextResponse.json({
            text: "I'm sorry, an error occurred while processing your request. Please try again later.",
            error: 'Error generating response',
            details: error.message
        }, { status: 500 });
    }
} 