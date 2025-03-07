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
        console.log("Recibida solicitud de chat");

        // Obtener datos de la solicitud
        const body = await req.json();
        console.log("Body de la solicitud:", JSON.stringify(body, null, 2));

        // Compatibilidad con DeepChat
        let messages: ChatMessage[] = body.messages || [];
        let retrievedContext = body.retrievedContext || "";
        let language = body.language || req.headers.get('x-language') || 'es';

        // Compatibilidad con diferentes formatos de mensajes
        if (body.text && !body.messages) {
            // Si es un formato diferente (directamente del componente DeepChat)
            console.log("Formato directo de DeepChat detectado");
            messages = [...(body.history || []), { role: 'user', content: body.text }];
        }

        // Si no hay mensajes, crear un mensaje vacío para evitar errores
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            console.log("No se proporcionaron mensajes válidos, usando mensaje vacío");
            messages = [{ role: 'user', content: 'Hola' }];
        }

        // Si no hay contexto recuperado, intentar recuperarlo ahora
        if (!retrievedContext || retrievedContext === "Información del museo") {
            console.log("No se proporcionó contexto, recuperando...");
            try {
                const lastUserMessage = messages.findLast((m: ChatMessage) =>
                    (m.role === 'user' && (m.content || m.text))
                )?.content ||
                    messages.findLast((m: ChatMessage) =>
                        (m.role === 'user' && (m.content || m.text))
                    )?.text ||
                    "";

                console.log("Último mensaje del usuario:", lastUserMessage);

                if (lastUserMessage) {
                    const baseUrl = req.nextUrl.origin;
                    const retrieveResponse = await fetch(`${baseUrl}/api/retrieve`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-language': language,
                        },
                        body: JSON.stringify({
                            query: lastUserMessage,
                            language,
                            topK: 3,
                        }),
                    });

                    if (retrieveResponse.ok) {
                        const data = await retrieveResponse.json();
                        retrievedContext = data.context || "";
                        console.log("Contexto recuperado:", retrievedContext);
                    }
                }
            } catch (error) {
                console.error("Error al recuperar contexto:", error);
            }
        }

        // Validar el idioma
        const validLanguages = ['es', 'en', 'it'];
        const lang = validLanguages.includes(language) ? language : 'es';

        // Obtener el contexto de la conversación (últimos 6 mensajes)
        const conversationContext = getConversationContext(messages);

        // Si no hay contexto recuperado, manejar como caso fallback
        let context = retrievedContext;
        if (!context || typeof context !== 'string' || context.trim() === '') {
            // Contexto de fallback según el idioma
            const fallbackContext = {
                es: 'No tengo información específica sobre esta consulta, pero intentaré ayudarte con lo que sé sobre el museo.',
                en: 'I don\'t have specific information about this query, but I\'ll try to help you with what I know about the museum.',
                it: 'Non ho informazioni specifiche su questa richiesta, ma cercherò di aiutarti con quello che so del museo.'
            };

            context = fallbackContext[lang as keyof typeof fallbackContext];
        }

        console.log("Generando respuesta con contexto:", context);

        // Generar respuesta usando OpenAI
        const response = await generateChatResponse(
            conversationContext,
            context,
            lang
        );

        console.log("Respuesta generada:", response);

        // Devolver la respuesta en el formato que espera DeepChat
        return NextResponse.json({ text: response });

    } catch (error: any) {
        console.error('Error al procesar la solicitud de chat:', error);

        // Preparar mensajes de error según el idioma
        const errorMessages = {
            es: 'Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.',
            en: 'I\'m sorry, an error occurred while processing your request. Please try again later.',
            it: 'Mi dispiace, si è verificato un errore durante l\'elaborazione della tua richiesta. Per favore riprova più tardi.'
        };

        const language = req.headers.get('x-language') || 'es';
        const validLanguages = ['es', 'en', 'it'];
        const lang = validLanguages.includes(language) ? language : 'es';

        return NextResponse.json({
            text: errorMessages[lang as keyof typeof errorMessages],
            error: 'Error al generar respuesta',
            details: error.message
        }, { status: 500 });
    }
} 