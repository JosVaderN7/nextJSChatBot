"use client";

import { useState } from 'react';
import dynamic from "next/dynamic";

const DeepChatClient = dynamic(() => import("@/app/DeepChatClient"), { ssr: false });

export default function FloatingChat() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {isOpen ? (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden chat-transition flex flex-col" style={{ width: '350px', height: '500px' }}>
                    <div className="bg-gray-800 text-white p-2 flex justify-between items-center">
                <h3 className="text-sm font-medium">TwinterBOT • Dimensione3</h3>
                        <div className="flex items-center">
                           
                            <button
                                onClick={toggleChat}
                                className="ml-2 text-white hover:text-gray-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="flex-grow" style={{ height: 'calc(100% - 44px)', overflowY: 'auto' }}>
                        <DeepChatClient />
                    </div>
                </div>
            ) : (
                <button
                    onClick={toggleChat}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center chat-icon-pulse"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </button>
            )}
        </div>
    );
} 