import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { generateEmbedding } from '@/app/utils/openai';
import { upsertVectors } from '@/app/utils/pinecone';

/**
 * Processes the Twinteraction data and creates embeddings to store in Pinecone
 */
export async function POST(req: NextRequest) {
    try {
        // Verify authentication
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        if (token !== process.env.EMBED_API_SECRET) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // Load Twinteraction data
        const dataFilePath = path.join(process.cwd(), 'app', 'data', 'museumData.json');
        const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
        const twinteractionData = JSON.parse(fileContent);

        const vectors = [];
        const lang = 'en'; // English only

        // Process rooms (formerly exhibits)
        if (twinteractionData.exhibits && Array.isArray(twinteractionData.exhibits)) {
            for (const room of twinteractionData.exhibits) {
                // Skip if no English description
                if (!room.description?.en) continue;

                // Text to create the embedding
                const textToEmbed = `
          ${room.name?.en || ''}
          ${room.description?.en || ''}
          ${room.historical_context?.en || ''}
          ${Array.isArray(room.fun_facts?.en) ? room.fun_facts.en.join('. ') : ''}
        `.trim();

                // Generate embedding
                const embedding = await generateEmbedding(textToEmbed);

                // Flatten metadata for Pinecone
                vectors.push({
                    id: `room-${room.id}`,
                    values: embedding,
                    metadata: {
                        type: 'room',
                        id: room.id,
                        lang,
                        name: room.name?.en || '',
                        description: room.description?.en || '',
                        location: room.location?.en || '',
                        historical_context: room.historical_context?.en || '',
                        fun_facts: Array.isArray(room.fun_facts?.en) ? room.fun_facts.en.join('. ') : ''
                    }
                });

                console.log(`Created embedding for room: ${room.id}`);
            }
        }

        // Process features (formerly tours)
        if (twinteractionData.tours && Array.isArray(twinteractionData.tours)) {
            for (const feature of twinteractionData.tours) {
                // Skip if no English name
                if (!feature.name?.en) continue;

                // Text to create the embedding
                const textToEmbed = `
          ${feature.name?.en || ''}
          ${feature.duration?.en || ''}
          ${Array.isArray(feature.recommended_for?.en) ? feature.recommended_for.en.join(', ') : ''}
        `.trim();

                // Generate embedding
                const embedding = await generateEmbedding(textToEmbed);

                // Create vector with flattened metadata for Pinecone
                vectors.push({
                    id: `feature-${feature.id}`,
                    values: embedding,
                    metadata: {
                        type: 'feature',
                        id: feature.id,
                        lang,
                        name: feature.name?.en || '',
                        duration: feature.duration?.en || '',
                        exhibits: Array.isArray(feature.exhibits) ? feature.exhibits.join(',') : '',
                        recommended_for: Array.isArray(feature.recommended_for?.en) ? feature.recommended_for.en.join(', ') : ''
                    }
                });

                console.log(`Created embedding for feature: ${feature.id}`);
            }
        }

        // Process company information (formerly general_info)
        if (twinteractionData.general_info) {
            // Text for company info embedding
            const textToEmbed = `
        ${twinteractionData.general_info.museum_name?.en || ''}
        ${twinteractionData.general_info.opening_hours?.en || ''}
        ${Array.isArray(twinteractionData.general_info.facilities?.en) ? twinteractionData.general_info.facilities.en.join(', ') : ''}
      `.trim();

            // Generate embedding
            const embedding = await generateEmbedding(textToEmbed);

            // Create vector with flattened metadata for Pinecone
            vectors.push({
                id: `company-info`,
                values: embedding,
                metadata: {
                    type: 'company_info',
                    lang,
                    company_name: twinteractionData.general_info.museum_name?.en || '',
                    contact_info: twinteractionData.general_info.opening_hours?.en || '',
                    services: Array.isArray(twinteractionData.general_info.facilities?.en) ? twinteractionData.general_info.facilities.en.join(', ') : '',
                    products: twinteractionData.general_info.tickets?.en ? JSON.stringify(twinteractionData.general_info.tickets.en) : ''
                }
            });

            console.log(`Created embedding for company information`);
        }

        // Save vectors to Pinecone
        await upsertVectors(vectors);

        return NextResponse.json({
            success: true,
            count: vectors.length,
            message: `Processed and saved ${vectors.length} vectors to Pinecone.`
        });

    } catch (error: any) {
        console.error('Error processing Twinteraction data:', error);
        return NextResponse.json({
            error: 'Error processing data',
            message: error.message
        }, { status: 500 });
    }
} 