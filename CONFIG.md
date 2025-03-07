# Configuración del Sistema RAG para el Chatbot del Museo

## Variables de Entorno Necesarias

Para que el sistema funcione correctamente, necesitas configurar las siguientes variables de entorno en tu archivo `.env.local`:

```
# OpenAI API Key
OPENAI_API_KEY=tu_clave_de_openai

# Pinecone API Key
# Regístrate en Pinecone.io y obtén una clave API
PINECONE_API_KEY=tu_clave_de_pinecone

# Pinecone Index Name 
# Nombre del índice que crearás en la consola de Pinecone
PINECONE_INDEX_NAME=museo-virtual

# Embedding API Secret (para proteger el proceso de embedding)
EMBEDDING_API_SECRET=tu_clave_secreta_elegida
```

## Pasos para Configurar Pinecone

1. **Crear una cuenta en Pinecone**:
   - Regístrate en [https://www.pinecone.io/](https://www.pinecone.io/)
   - Obtén tu API Key desde el dashboard

2. **Crear un índice**:
   - Nombre: `museo-virtual` (o el que hayas configurado en PINECONE_INDEX_NAME)
   - Dimensiones: `1536` (para OpenAI embeddings)
   - Métrica: `cosine` (similaridad de coseno)

## Generar Embeddings

Una vez configuradas las variables de entorno y creado el índice en Pinecone, ejecuta el siguiente comando para generar los embeddings:

```bash
curl -X POST http://localhost:3000/api/embed \
  -H "Authorization: Bearer tu_secreto_configurado_en_EMBED_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{}'
```

Este proceso tomará unos minutos para procesar todos los datos del museo y almacenarlos en Pinecone.

## Verificación del Sistema

Después de generar los embeddings, puedes verificar que todo funciona correctamente abriendo la aplicación y haciendo una pregunta al chatbot como:

- "¿Qué puedes contarme sobre la Venus de Milo?"
- "¿Cuáles son los horarios del museo?"
- "Muéstrame información sobre La Noche Estrellada"

El chatbot debería responder con información relevante extraída de la base de datos. 