import { Pinecone } from '@pinecone-database/pinecone';

if (!process.env.PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY no está configurado en las variables de entorno');
}

if (!process.env.PINECONE_INDEX_NAME) {
    throw new Error('PINECONE_INDEX_NAME no está configurado en las variables de entorno');
}

// Configuración del cliente de Pinecone
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

export const INDEX_NAME = process.env.PINECONE_INDEX_NAME;

/**
 * Obtiene el índice de Pinecone para las operaciones
 */
export const getIndex = () => {
    return pinecone.Index(INDEX_NAME);
};

/**
 * Upsert (inserta o actualiza) documentos en Pinecone
 */
export const upsertVectors = async (vectors: any[]) => {
    const index = getIndex();

    // Pinecone tiene un límite de 100 vectores por operación de upsert
    const batchSize = 100;
    const batches = [];

    for (let i = 0; i < vectors.length; i += batchSize) {
        const batch = vectors.slice(i, i + batchSize);
        batches.push(batch);
    }

    try {
        // Procesar los lotes secuencialmente
        for (const batch of batches) {
            await index.upsert(batch);
        }
        return true;
    } catch (error) {
        console.error('Error al insertar vectores en Pinecone:', error);
        throw error;
    }
};

/**
 * Realiza una búsqueda por similitud en Pinecone
 */
export const querySimilar = async (vector: number[], topK: number = 3, filter?: any) => {
    const index = getIndex();

    try {
        const queryResponse = await index.query({
            vector,
            topK,
            includeMetadata: true,
            ...(filter && { filter }),
        });

        return queryResponse.matches;
    } catch (error) {
        console.error('Error al consultar Pinecone:', error);
        throw error;
    }
}; 