"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const DeepChat = dynamic(() => import("deep-chat-react").then(mod => mod.DeepChat), { ssr: false });

export default function DeepChatClient() {
    const [language, setLanguage] = useState('es');
    const [baseUrl, setBaseUrl] = useState('');

    useEffect(() => {
        // Obtener la URL base
        setBaseUrl(window.location.origin);
    }, []);

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value);
    };

    const welcomeMessages = {
        es: '👋 ¡Hola! Soy tu guía virtual del Museo. ¿En qué puedo ayudarte hoy?',
        en: '👋 Hello! I\'m your virtual Museum guide. How can I help you today?',
        it: '👋 Ciao! Sono la tua guida virtuale del Museo. Come posso aiutarti oggi?'
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-2 bg-gray-100">
                <h3 className="text-sm font-medium">Museo Virtual</h3>
                <select
                    value={language}
                    onChange={handleLanguageChange}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                    <option value="es">ES</option>
                    <option value="en">EN</option>
                    <option value="it">IT</option>
                </select>
            </div>
            {baseUrl && (
                <DeepChat
                    connect={{
                        url: `${baseUrl}/api/chat`,
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "x-language": language
                        },
                        additionalBodyProps: {
                            language: language
                        }
                    }}
                    style={{
                        height: 'calc(100% - 40px)',
                        width: '100%',
                        borderRadius: '0',
                        border: 'none'
                    }}
                    introMessage={{
                        text: welcomeMessages[language as keyof typeof welcomeMessages]
                    }}
                />
            )}
        </div>
    );
}