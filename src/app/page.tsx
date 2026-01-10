"use client";

import { C1Chat, ThemeProvider } from "@thesysai/genui-sdk";
import "@crayonai/react-ui/styles/index.css";
import clsx from "clsx";
import styles from "./page.module.scss";
import { useTheme } from "@crayonai/react-ui/ThemeProvider";
import { theme, darkTheme } from "@/theme";
import { useState, useEffect } from "react";

if (typeof globalThis !== 'undefined' && !globalThis.crypto?.randomUUID) {
  if (!globalThis.crypto) globalThis.crypto = {};
  globalThis.crypto.randomUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
}

const ChatInternal = () => {
  const { portalThemeClassName } = useTheme();
  const [sheetData, setSheetData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSheetData = async () => {
      try {
        console.log('Fetching sheet data...');
        const response = await fetch('/api/sheets');
        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Response data:', result);
        
        if (response.ok && result.data) {
          setSheetData(result.data);
        } else {
          console.error('Sheet API error:', result);
          // Use fallback data
          const fallbackData = `Name,Age,City\nJohn,30,NYC\nJane,25,LA`;
          setSheetData(fallbackData);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        // Use fallback data
        const fallbackData = `Name,Age,City\nJohn,30,NYC\nJane,25,LA`;
        setSheetData(fallbackData);
      } finally {
        setLoading(false);
      }
    };
    loadSheetData();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#000',
        color: 'white'
      }}>
        Loading sheet data...
      </div>
    );
  }

  return (
    <div className="chat-container">
      <style>{`
        .chat-container {
          height: 100vh;
          width: 100vw;
          background: #000;
          display: flex;
          overflow: hidden;
        }
        
        .${portalThemeClassName} {
          width: 100%;
          height: 100%;
        }
      `}</style>
      
      <C1Chat 
        apiUrl="/api/chat" 
        disableThemeProvider 
        initialMessages={[
          {
            role: "system" as const,
            content: `You are an AI assistant with access to Google Sheets data. Here is the complete dataset:\n\n${sheetData}\n\nAnalyze this data and answer any questions users have about it. Provide insights, summaries, calculations, and detailed analysis based on this data.`
          },
          {
            role: "assistant" as const,
            content: "Hello! I've loaded and analyzed your Google Sheets data. I can help you understand patterns, answer questions, perform calculations, and provide insights about your data. What would you like to know?"
          }
        ]}
      />
    </div>
  );
};

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={clsx("!h-full !w-full", styles["chat-theme"])}>
      <ThemeProvider theme={theme} darkTheme={darkTheme} mode="dark">
        <ChatInternal />
      </ThemeProvider>
    </div>
  );
}