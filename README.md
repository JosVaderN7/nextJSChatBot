# Next.js Chatbot con iframe

Esta aplicación Next.js muestra un iframe a pantalla completa con un chatbot flotante impulsado por la API de OpenAI.

## Configuración

1. Clona este repositorio
2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env.local` en la raíz del proyecto con tu clave de API de OpenAI:
```
OPENAI_API_KEY=tu_clave_api_aqui
```

Puedes obtener una clave de API de OpenAI en [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

## Ejecución

Para ejecutar el proyecto en modo desarrollo:

```bash
npm run dev
```

Visita `http://localhost:3000` para ver la aplicación.

## Características

- Iframe a pantalla completa que muestra un tour interactivo
- Chatbot flotante en la esquina inferior derecha
- Integración con la API de OpenAI para respuestas inteligentes
- Interfaz limpia y fácil de usar

## Personalización

### Modificar el iframe

Puedes cambiar la URL del iframe en `app/page.tsx`:

```jsx
<iframe 
  src="tu-nueva-url-aqui"
  className="absolute top-0 left-0 w-full h-full border-0"
  title="Tour Interactivo"
  allow="microphone; camera; accelerometer; gyroscope"
></iframe>
```

### Cambiar el modelo de IA

Puedes modificar el modelo de OpenAI utilizado en `app/api/mensaje/route.ts`:

```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-4', // Cambia a gpt-3.5-turbo, gpt-4, etc.
  messages: formattedMessages,
  max_tokens: 500,
});
```

## Tecnologías utilizadas

- Next.js
- React
- TypeScript
- OpenAI API
- Deep Chat (para la interfaz del chat)
- Tailwind CSS (para los estilos)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
