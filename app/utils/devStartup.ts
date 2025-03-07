// Utility for automatically generating embeddings on dev startup
import fetch from 'node-fetch';

// Define the response type for better type safety
interface EmbeddingResponse {
  success?: boolean;
  count?: number;
  error?: string;
  message?: string;
}

/**
 * Runs the embedding generation process against the API
 */
export async function regenerateEmbeddings() {
  if (process.env.NODE_ENV !== 'development') {
    console.log('Skipping embedding generation in non-development environment');
    return;
  }

  if (!process.env.EMBED_API_SECRET) {
    console.error('EMBED_API_SECRET not configured, cannot generate embeddings');
    return;
  }

  console.log('🔄 Starting automatic embedding generation for development...');
  
  try {
    // Determine the base URL (localhost in development)
    const baseUrl = 'http://localhost:3000';
    
    // Send request to the embedding endpoint
    const response = await fetch(`${baseUrl}/api/embed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EMBED_API_SECRET}`
      }
    });
    
    const result = await response.json() as EmbeddingResponse;
    
    if (result.success) {
      console.log(`✅ Embeddings successfully generated! ${result.count} vectors processed.`);
    } else {
      console.error('❌ Error generating embeddings:', result.error || 'Unknown error');
    }
  } catch (error) {
    console.error('❌ Failed to generate embeddings:', error);
  }
} 