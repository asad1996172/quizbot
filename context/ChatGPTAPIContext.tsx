'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface ChatGPTAPIContextType {
    chatgptapi: string | null;
    setChatGPTAPI: React.Dispatch<React.SetStateAction<string | null>>;
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
    const [chatgptapi, setChatGPTAPI] = useState<string | null>(null);

    return (
        <ChatGPTAPIContext.Provider value={{ chatgptapi, setChatGPTAPI }}>
            {children}
        </ChatGPTAPIContext.Provider>
    );
}
