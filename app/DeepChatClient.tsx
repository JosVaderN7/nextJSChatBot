"use client";

import dynamic from "next/dynamic";

const DeepChat = dynamic(() => import("deep-chat-react").then(mod => mod.DeepChat), { ssr: false });

export default function DeepChatClient() {
    return (
        <DeepChat
            connect={{
                url: "http://localhost:3000/api/mensaje",
                method: "POST",
                headers: { "Authorization": "Bearer mi-token" },
                additionalBodyProps: { "campoAdicional": "valor" },
                stream: false
            }}
            requestBodyLimits={{
                totalMessagesMaxCharLength: 200,
                maxMessages: 2
            }}
        />
    );
}