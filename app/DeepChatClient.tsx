"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const DeepChat = dynamic(() => import("deep-chat-react").then(mod => mod.DeepChat), { ssr: false });

export default function DeepChatClient() {
    const [baseUrl, setBaseUrl] = useState('');

    useEffect(() => {
        // Get base URL
        setBaseUrl(window.location.origin);
    }, []);

    // System instruction for encouraging concise responses
    const systemInstruction = "Provide concise, informative responses about Twinteraction by Dimensione3. Keep answers brief and to the point, preferably under 3 sentences when possible. Focus on specific features and benefits without unnecessary details.";

    const welcomeMessages = {
        en: '👋 Hello! I\'m TwinterBOT, your Twinteraction product demo assistant. Ask me anything about how Twinteraction can enhance your Matterport tours with interactive elements!'
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-end items-center p-3 bg-blue-600 text-white">
                <span className="text-xs opacity-75">Powered by Twinteraction</span>
            </div>
            {baseUrl && (
                <DeepChat
                    connect={{
                        url: `${baseUrl}/api/chat`,
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        additionalBodyProps: {
                            systemInstruction: systemInstruction
                        }
                    }}
                    history={[
                        { role: 'assistant', text: welcomeMessages.en }
                    ]}
                    style={{
                        height: 'calc(100% - 48px)',
                        width: '100%',
                        borderRadius: '0',
                        border: 'none'
                    }}
                    textInput={{
                        placeholder: {
                            text: "Ask about Twinteraction features..."
                        }
                    }}
                   
                />
            )}
        </div>
    );
}