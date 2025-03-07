/**
 * This script is run before the development server starts
 * to automatically generate embeddings for the Twinteraction product demo
 */

import { regenerateEmbeddings } from '../app/utils/devStartup';

// Self-executing async function
(async () => {
  console.log('🚀 Running pre-dev embedding generation...');
  
  try {
    // Wait for the embedding generation to complete
    await regenerateEmbeddings();
    console.log('✅ Embedding generation complete, starting dev server...');
  } catch (error) {
    console.error('Error during embedding generation:', error);
    console.log('⚠️ Continuing with dev server despite embedding errors...');
  }
})(); 