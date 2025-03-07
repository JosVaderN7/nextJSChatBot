"use client";

import { useState } from 'react';

interface LanguageSelectorProps {
    onLanguageChange: (language: string) => void;
    currentLanguage: string;
}

export default function LanguageSelector({ onLanguageChange, currentLanguage }: LanguageSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'it', name: 'Italiano', flag: '🇮🇹' }
    ];

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const selectLanguage = (languageCode: string) => {
        onLanguageChange(languageCode);
        setIsOpen(false);
    };

    // Encuentra el idioma actual para mostrar su bandera
    const currentFlag = languages.find(lang => lang.code === currentLanguage)?.flag || '🌐';

    return (
        <div className="relative inline-block text-left">
            <button
                type="button"
                className="inline-flex justify-center items-center w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
                onClick={toggleDropdown}
            >
                <span className="mr-2">{currentFlag}</span>
                <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        {languages.map((language) => (
                            <button
                                key={language.code}
                                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${currentLanguage === language.code ? 'bg-gray-100 font-medium' : ''
                                    }`}
                                role="menuitem"
                                onClick={() => selectLanguage(language.code)}
                            >
                                <span className="mr-2">{language.flag}</span>
                                {language.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 