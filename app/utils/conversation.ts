/**
 * Limit conversation messages to the most recent ones
 */
export const getConversationContext = (messages: any[], maxMessages: number = 6) => {
    return messages.slice(-maxMessages);
};

/**
 * Format retrieved Twinteraction data to include in the context
 */
export const formatRetrievedData = (
    retrievedData: any[],
    language: string = 'en'
): string => {
    if (!retrievedData || retrievedData.length === 0) {
        return 'No information available on this topic.';
    }

    let formattedContext = '';

    // Process each retrieved result
    retrievedData.forEach((item) => {
        if (!item.metadata) return;

        const metadata = item.metadata;
        const score = item.score ? `(Relevance: ${Math.round(item.score * 100)}%)` : '';

        // Format based on content type
        switch (metadata.type) {
            case 'room':
                formattedContext += `FEATURE ROOM: ${metadata.name || ''}\n`;
                formattedContext += `DESCRIPTION: ${metadata.description || ''}\n`;

                if (metadata.location) {
                    formattedContext += `LOCATION IN TOUR: ${metadata.location || ''}\n`;
                }

                if (metadata.historical_context) {
                    formattedContext += `TECHNICAL DETAILS: ${metadata.historical_context || ''}\n`;
                }

                if (metadata.fun_facts) {
                    formattedContext += `HIGHLIGHTS: ${metadata.fun_facts}\n`;
                }
                break;

            case 'feature':
                formattedContext += `CAPABILITY: ${metadata.name || ''}\n`;
                formattedContext += `IMPLEMENTATION: ${metadata.duration || ''}\n`;

                if (metadata.recommended_for) {
                    formattedContext += `IDEAL FOR: ${metadata.recommended_for}\n`;
                }
                break;

            case 'company_info':
                formattedContext += `COMPANY INFORMATION:\n`;

                if (metadata.company_name) {
                    formattedContext += `COMPANY: ${metadata.company_name || ''}\n`;
                }

                if (metadata.contact_info) {
                    formattedContext += `CONTACT: ${metadata.contact_info}\n`;
                }

                if (metadata.services) {
                    formattedContext += `SERVICES: ${metadata.services}\n`;
                }

                if (metadata.products) {
                    try {
                        const products = JSON.parse(metadata.products);
                        formattedContext += `PRODUCTS: `;
                        Object.keys(products).forEach(key => {
                            formattedContext += `${key}: ${products[key]}, `;
                        });
                        formattedContext = formattedContext.slice(0, -2) + '\n';
                    } catch (e) {
                        formattedContext += `PRODUCTS: ${metadata.products}\n`;
                    }
                }
                break;

            default:
                // For other data types or generic metadata
                formattedContext += `INFORMATION: ${JSON.stringify(metadata)}\n`;
        }

        formattedContext += `\n`;
    });

    return formattedContext;
}; 