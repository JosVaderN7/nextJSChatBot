import { NextRequest, NextResponse } from 'next/server';
import { generateEmbedding } from '@/app/utils/openai';
import { querySimilar } from '@/app/utils/pinecone';
import { formatRetrievedData } from '@/app/utils/conversation';

/**
 * Busca información relevante basada en la consulta del usuario
 */
export async function POST(req: NextRequest) {
    try {
        console.log("Recibida solicitud de recuperación");

        // Obtener datos de la solicitud
        const body = await req.json();
        console.log("Body de la solicitud:", JSON.stringify(body, null, 2));

        const { query, language = 'es', topK = 3 } = body;

        if (!query || typeof query !== 'string') {
            console.log("Error: Consulta inválida", query);
            return NextResponse.json({
                error: 'Se requiere una consulta válida'
            }, { status: 400 });
        }

        // Validar el idioma
        const validLanguages = ['es', 'en', 'it'];
        const lang = validLanguages.includes(language) ? language : 'es';
        console.log(`Procesando consulta "${query}" en idioma ${lang}`);

        // Generar embedding para la consulta
        console.log("Generando embedding para la consulta");
        const queryEmbedding = await generateEmbedding(query);
        console.log("Embedding generado correctamente");

        // Filtrar por idioma
        const filter = {
            lang: lang
        };
        console.log("Consultando Pinecone con filtro:", filter);

        // Buscar vectores similares en Pinecone
        const matches = await querySimilar(queryEmbedding, topK, filter);
        console.log("Respuesta de Pinecone:", matches ? matches.length : 0, "resultados");

        // Si no hay resultados, devolver respuesta predeterminada
        if (!matches || matches.length === 0) {
            console.log("No se encontraron resultados relevantes");
            return NextResponse.json({
                results: [],
                context: 'No se encontró información relevante para esta consulta.',
                query,
                language: lang
            });
        }

        // Formatear los datos recuperados
        console.log("Formateando datos recuperados");
        const formattedContext = formatRetrievedData(matches, lang);
        console.log("Contexto formateado:", formattedContext);

        // Devolver resultados
        return NextResponse.json({
            results: matches,
            context: formattedContext,
            query,
            language: lang
        });

    } catch (error: any) {
        console.error('Error al procesar la solicitud de recuperación:', error);
        return NextResponse.json({
            error: 'Error al recuperar información',
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
} 