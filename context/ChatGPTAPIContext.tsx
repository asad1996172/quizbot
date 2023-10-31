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
    const [chatgptapi, setChatGPTAPIState] = useState<string | null>(() => {
        // Initialize state from sessionStorage if available
        const storedValue = sessionStorage.getItem('chatgptapi');
        return storedValue !== null ? storedValue : null;
    });

    // This function updates sessionStorage and the state
    const setChatGPTAPI = (value: string | null) => {
        setChatGPTAPIState(value);
        if (value === null) {
            sessionStorage.removeItem('chatgptapi');
        } else {
            sessionStorage.setItem('chatgptapi', value);
        }
    };

    // Effect to sync sessionStorage with state
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'chatgptapi') {
                setChatGPTAPIState(event.newValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Clean up the event listener on component unmount
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <ChatGPTAPIContext.Provider value={{ chatgptapi, setChatGPTAPI }}>
            {children}
        </ChatGPTAPIContext.Provider>
    );
}
