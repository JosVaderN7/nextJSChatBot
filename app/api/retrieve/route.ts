import { NextRequest, NextResponse } from 'next/server';
import { generateEmbedding } from '@/app/utils/openai';
import { querySimilar } from '@/app/utils/pinecone';
import { formatRetrievedData } from '@/app/utils/conversation';

/**
 * Searches for relevant information based on the user's query
 */
export async function POST(req: NextRequest) {
    try {
        console.log("Received retrieval request");

        // Get request data
        const body = await req.json();
        console.log("Request body:", JSON.stringify(body, null, 2));

        const { query, topK = 3 } = body;

        if (!query || typeof query !== 'string') {
            console.log("Error: Invalid query", query);
            return NextResponse.json({
                error: 'A valid query is required'
            }, { status: 400 });
        }

        // English only
        const lang = 'en';
        console.log(`Processing query "${query}"`);

        // Generate embedding for the query
        console.log("Generating embedding for the query");
        const queryEmbedding = await generateEmbedding(query);
        console.log("Embedding generated successfully");

        // Filter for English content
        const filter = {
            lang: 'en'
        };
        console.log("Querying Pinecone with filter:", filter);

        // Search for similar vectors in Pinecone
        const matches = await querySimilar(queryEmbedding, topK, filter);
        console.log("Pinecone response:", matches ? matches.length : 0, "results");

        // If no results, return default response
        if (!matches || matches.length === 0) {
            console.log("No relevant results found");
            return NextResponse.json({
                results: [],
                context: 'No relevant information found for this query.',
                query
            });
        }

        // Format retrieved data
        console.log("Formatting retrieved data");
        const formattedContext = formatRetrievedData(matches, lang);
        console.log("Formatted context:", formattedContext);

        // Return results
        return NextResponse.json({
            results: matches,
            context: formattedContext,
            query
        });

    } catch (error: any) {
        console.error('Error processing retrieval request:', error);
        return NextResponse.json({
            error: 'Error retrieving information',
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
} 