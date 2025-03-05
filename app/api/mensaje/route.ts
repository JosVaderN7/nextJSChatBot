import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Inicializar el cliente de OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        // Verificar que la clave API esté configurada
        if (!process.env.OPENAI_API_KEY) {
            console.error('Error: OPENAI_API_KEY no está configurada en las variables de entorno');
            return NextResponse.json(
                { error: 'Configuración incompleta del servidor' },
                { status: 500 }
            );
        }

        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: 'Se requiere un array de mensajes válido' },
                { status: 400 }
            );
        }

        console.log('Mensajes recibidos:', JSON.stringify(messages, null, 2));

        // Convertir mensajes al formato esperado por OpenAI
        const formattedMessages = messages.map(msg => {
            const role = msg.role === 'user' ? 'user' : 'assistant';
            return {
                role: role as 'user' | 'assistant' | 'system',
                content: msg.text || msg.html || '',
            };
        });

        console.log('Mensajes formateados:', JSON.stringify(formattedMessages, null, 2));

        // Llamar a la API de OpenAI
        try {
            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: formattedMessages,
                max_tokens: 500,
            });

            // Obtener la respuesta
            const responseText = completion.choices[0]?.message?.content || 'Lo siento, no pude generar una respuesta.';
            console.log('Respuesta de OpenAI:', responseText);

            return NextResponse.json({ text: responseText });
        } catch (openaiError: any) {
            console.error('Error al llamar a la API de OpenAI:', openaiError.message);
            console.error('Detalles del error:', openaiError);

            return NextResponse.json(
                { error: `Error al comunicarse con OpenAI: ${openaiError.message}` },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error('Error general al procesar la solicitud:', error.message);
        console.error('Error completo:', error);

        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({ error: 'Método no permitido' }, { status: 405 });
}