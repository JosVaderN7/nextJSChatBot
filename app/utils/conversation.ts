/**
 * Limita los mensajes de la conversación a los más recientes
 */
export const getConversationContext = (messages: any[], maxMessages: number = 6) => {
    return messages.slice(-maxMessages);
};

/**
 * Formatea los datos recuperados del museo para incluirlos en el contexto
 */
export const formatRetrievedData = (
    retrievedData: any[],
    language: string = 'es'
): string => {
    if (!retrievedData || retrievedData.length === 0) {
        return 'No hay información disponible sobre este tema.';
    }

    let formattedContext = '';

    // Procesar cada resultado recuperado
    retrievedData.forEach((item) => {
        if (!item.metadata) return;

        const metadata = item.metadata;
        const score = item.score ? `(Relevancia: ${Math.round(item.score * 100)}%)` : '';

        // Formatear según el tipo de contenido
        switch (metadata.type) {
            case 'exhibit':
                formattedContext += `EXHIBICIÓN: ${metadata.name || ''}\n`;
                formattedContext += `DESCRIPCIÓN: ${metadata.description || ''}\n`;

                if (metadata.location) {
                    formattedContext += `UBICACIÓN: ${metadata.location || ''}\n`;
                }

                if (metadata.historical_context) {
                    formattedContext += `CONTEXTO HISTÓRICO: ${metadata.historical_context || ''}\n`;
                }

                if (metadata.fun_facts) {
                    formattedContext += `DATOS CURIOSOS: ${metadata.fun_facts}\n`;
                }
                break;

            case 'tour':
                formattedContext += `TOUR: ${metadata.name || ''}\n`;
                formattedContext += `DURACIÓN: ${metadata.duration || ''}\n`;

                if (metadata.recommended_for) {
                    formattedContext += `RECOMENDADO PARA: ${metadata.recommended_for}\n`;
                }
                break;

            case 'general_info':
                formattedContext += `INFORMACIÓN GENERAL DEL MUSEO:\n`;

                if (metadata.opening_hours) {
                    formattedContext += `HORARIO: ${metadata.opening_hours || ''}\n`;
                }

                if (metadata.facilities) {
                    formattedContext += `INSTALACIONES: ${metadata.facilities}\n`;
                }

                if (metadata.tickets) {
                    try {
                        const tickets = JSON.parse(metadata.tickets);
                        formattedContext += `ENTRADAS: `;
                        Object.keys(tickets).forEach(key => {
                            formattedContext += `${key}: ${tickets[key]}, `;
                        });
                        formattedContext = formattedContext.slice(0, -2) + '\n';
                    } catch (e) {
                        formattedContext += `ENTRADAS: ${metadata.tickets}\n`;
                    }
                }
                break;

            default:
                // Para otros tipos de datos o metadatos genéricos
                formattedContext += `INFORMACIÓN: ${JSON.stringify(metadata)}\n`;
        }

        formattedContext += `\n`;
    });

    return formattedContext;
}; 