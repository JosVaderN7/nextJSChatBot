# Chatbot RAG para Museo Virtual con Next.js 

Este proyecto implementa un chatbot de guía virtual para un museo utilizando Retrieval-Augmented Generation (RAG). El chatbot responde preguntas sobre las exhibiciones del museo y proporciona información contextualmente relevante.

## Características Principales

- **Interfaz de Chat Flotante**: Un chatbot accesible desde cualquier página del sitio
- **Sistema RAG Completo**: Conecta con Pinecone para recuperar información relevante de la base de datos vectorial
- **Soporte Multilingüe**: Español, Inglés e Italiano
- **Personalidad Amigable**: El chatbot tiene una personalidad de guía entusiasta y servicial
- **Memoria de Conversación**: Mantiene el contexto de los últimos 6 mensajes

## Tecnologías Utilizadas

- **Next.js**: Framework React con App Router
- **TypeScript**: Para tipo seguro
- **DeepChat**: Componente de chat para la interfaz de usuario
- **OpenAI**: Para embeddings y generación de respuestas
- **Pinecone**: Base de datos vectorial para almacenar y recuperar embeddings

## Arquitectura

El sistema sigue una arquitectura RAG (Retrieval-Augmented Generation):

1. **Preparación de Datos**:
   - Los datos del museo se almacenan en un archivo JSON con información multilingüe
   - Los datos se procesan para crear embeddings con OpenAI
   - Los embeddings se almacenan en Pinecone con metadatos

2. **Flujo de Consulta**:
   - El usuario hace una pregunta
   - Se genera un embedding para la consulta
   - Se buscan documentos similares en Pinecone
   - Se recuperan los más relevantes

3. **Generación de Respuesta**:
   - Se combina el prompt del sistema con el contexto recuperado
   - Se envía a OpenAI para generar una respuesta informativa
   - La respuesta se muestra al usuario

## Configuración

Consulta el archivo [CONFIG.md](./CONFIG.md) para instrucciones detalladas sobre cómo configurar:

- Variables de entorno
- Cuenta de Pinecone
- Generación de embeddings

## API Endpoints

- **POST /api/embed**: Genera embeddings de los datos del museo y los almacena en Pinecone
- **POST /api/retrieve**: Busca información relevante basada en la consulta del usuario
- **POST /api/chat**: Genera respuestas basadas en el contexto recuperado

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno (ver CONFIG.md)

# Iniciar servidor de desarrollo
npm run dev

# Generar embeddings (ver CONFIG.md)
```

## Uso

1. Accede a la aplicación en `http://localhost:3000`
2. Haz clic en el icono flotante de chat en la esquina inferior derecha
3. Selecciona tu idioma preferido (español, inglés o italiano)
4. Haz preguntas sobre las exhibiciones o el museo

## Personalización

- Puedes modificar los datos del museo en `app/data/museumData.json`
- Ajusta la personalidad del chatbot en `app/utils/openai.ts`
- Modifica el diseño visual del chatbot en `app/components/FloatingChat.tsx`

## Extensiones Futuras

- Implementar streaming de respuestas
- Añadir más idiomas
- Integrar imágenes de las exhibiciones
- Añadir funcionalidad para recomendar exhibiciones basadas en intereses

## Licencia

Este proyecto está bajo la licencia MIT.
