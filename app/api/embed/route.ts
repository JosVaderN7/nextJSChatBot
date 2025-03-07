import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { generateEmbedding } from '@/app/utils/openai';
import { upsertVectors } from '@/app/utils/pinecone';

/**
 * Procesa los datos del museo y crea embeddings para guardarlos en Pinecone
 */
export async function POST(req: NextRequest) {
    try {
        // Verificar autenticación (en un entorno real, deberías tener un mecanismo más seguro)
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        if (token !== process.env.EMBED_API_SECRET) {
            return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
        }

        // Cargar datos del museo
        const dataFilePath = path.join(process.cwd(), 'app', 'data', 'museumData.json');
        const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
        const museumData = JSON.parse(fileContent);

        const vectors = [];

        // Procesar exhibiciones
        if (museumData.exhibits && Array.isArray(museumData.exhibits)) {
            for (const exhibit of museumData.exhibits) {
                // Crear un documento por cada idioma
                for (const lang of ['es', 'en', 'it']) {
                    if (!exhibit.description?.[lang]) continue;

                    // Texto para generar el embedding
                    const textToEmbed = `
            ${exhibit.name?.[lang] || ''}
            ${exhibit.description?.[lang] || ''}
            ${exhibit.historical_context?.[lang] || ''}
            ${Array.isArray(exhibit.fun_facts?.[lang]) ? exhibit.fun_facts[lang].join('. ') : ''}
          `.trim();

                    // Generar embedding
                    const embedding = await generateEmbedding(textToEmbed);

                    // Aplanar metadatos para Pinecone
                    vectors.push({
                        id: `exhibit-${exhibit.id}-${lang}`,
                        values: embedding,
                        metadata: {
                            type: 'exhibit',
                            id: exhibit.id,
                            lang,
                            name: exhibit.name?.[lang] || '',
                            description: exhibit.description?.[lang] || '',
                            location: exhibit.location?.[lang] || '',
                            historical_context: exhibit.historical_context?.[lang] || '',
                            fun_facts: Array.isArray(exhibit.fun_facts?.[lang]) ? exhibit.fun_facts[lang].join('. ') : ''
                        }
                    });

                    console.log(`Creado embedding para exhibición: ${exhibit.id} en idioma: ${lang}`);
                }
            }
        }

        // Procesar tours
        if (museumData.tours && Array.isArray(museumData.tours)) {
            for (const tour of museumData.tours) {
                // Crear un documento por cada idioma
                for (const lang of ['es', 'en', 'it']) {
                    if (!tour.name?.[lang]) continue;

                    // Texto para generar el embedding
                    const textToEmbed = `
            ${tour.name?.[lang] || ''}
            ${tour.duration?.[lang] || ''}
            ${Array.isArray(tour.recommended_for?.[lang]) ? tour.recommended_for[lang].join(', ') : ''}
          `.trim();

                    // Generar embedding
                    const embedding = await generateEmbedding(textToEmbed);

                    // Crear vector con metadatos aplanados para Pinecone
                    vectors.push({
                        id: `tour-${tour.id}-${lang}`,
                        values: embedding,
                        metadata: {
                            type: 'tour',
                            id: tour.id,
                            lang,
                            name: tour.name?.[lang] || '',
                            duration: tour.duration?.[lang] || '',
                            exhibits: Array.isArray(tour.exhibits) ? tour.exhibits.join(',') : '',
                            recommended_for: Array.isArray(tour.recommended_for?.[lang]) ? tour.recommended_for[lang].join(', ') : ''
                        }
                    });

                    console.log(`Creado embedding para tour: ${tour.id} en idioma: ${lang}`);
                }
            }
        }

        // Procesar información general
        if (museumData.general_info) {
            for (const lang of ['es', 'en', 'it']) {
                if (!museumData.general_info.museum_name?.[lang]) continue;

                // Texto para generar el embedding
                const textToEmbed = `
          ${museumData.general_info.museum_name?.[lang] || ''}
          ${museumData.general_info.opening_hours?.[lang] || ''}
          ${Array.isArray(museumData.general_info.facilities?.[lang]) ? museumData.general_info.facilities[lang].join(', ') : ''}
        `.trim();

                // Generar embedding
                const embedding = await generateEmbedding(textToEmbed);

                // Crear vector con metadatos aplanados para Pinecone
                vectors.push({
                    id: `general-info-${lang}`,
                    values: embedding,
                    metadata: {
                        type: 'general_info',
                        lang,
                        museum_name: museumData.general_info.museum_name?.[lang] || '',
                        opening_hours: museumData.general_info.opening_hours?.[lang] || '',
                        facilities: Array.isArray(museumData.general_info.facilities?.[lang]) ? museumData.general_info.facilities[lang].join(', ') : '',
                        tickets: museumData.general_info.tickets?.[lang] ? JSON.stringify(museumData.general_info.tickets[lang]) : ''
                    }
                });

                console.log(`Creado embedding para información general en idioma: ${lang}`);
            }
        }

        // Guardar vectores en Pinecone
        await upsertVectors(vectors);

        return NextResponse.json({
            success: true,
            count: vectors.length,
            message: `Se han procesado y guardado ${vectors.length} vectores en Pinecone.`
        });

    } catch (error: any) {
        console.error('Error al procesar datos del museo:', error);
        return NextResponse.json({
            error: 'Error al procesar datos',
            message: error.message
        }, { status: 500 });
    }
} 