'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ChatGPTAPIContextType {
    chatgptapi: string | null;
    setChatGPTAPI: (value: string | null) => void;
}

const ChatGPTAPIContext = createContext<ChatGPTAPIContextType | undefined>(undefined);

export function useChatGPTAPI(): ChatGPTAPIContextType {
    const context = useContext(ChatGPTAPIContext);
    if (!context) {
        throw new Error("useChatGPTAPI must be used within a ChatGPTAPIProvider");
    }
    return context;
}

interface ChatGPTAPIProviderProps {
    children: ReactNode;
}

export function ChatGPTAPIProvider({ children }: ChatGPTAPIProviderProps) {
    const [chatgptapi, setChatGPTAPIState] = useState<string | null>(null);

    // This function updates sessionStorage and the state
    const setChatGPTAPI = (value: string | null) => {
        if (typeof window !== 'undefined') { // Check if window is defined
            setChatGPTAPIState(value);
            if (value === null) {
                sessionStorage.removeItem('chatgptapi');
            } else {
                sessionStorage.setItem('chatgptapi', value);
            }
        }
    };

    // Effect to sync sessionStorage with state
    useEffect(() => {
        if (typeof window !== 'undefined') { // Check if window is defined
            const storedValue = sessionStorage.getItem('chatgptapi');
            if (storedValue !== null) {
                setChatGPTAPIState(storedValue);
            }

            const handleStorageChange = (event: StorageEvent) => {
                if (event.key === 'chatgptapi') {
                    setChatGPTAPIState(event.newValue);
                }
            };

            window.addEventListener('storage', handleStorageChange);

            // Clean up the event listener on component unmount
            return () => window.removeEventListener('storage', handleStorageChange);
        }
    }, []);

    return (
        <ChatGPTAPIContext.Provider value={{ chatgptapi, setChatGPTAPI }}>
            {children}
        </ChatGPTAPIContext.Provider>
    );
}
