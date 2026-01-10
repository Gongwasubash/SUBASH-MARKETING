"use client";

import { useState, useEffect } from "react";

interface SheetsInputProps {
  onSheetLoaded: (sheetData: any) => void;
}

export default function SheetsInput({ onSheetLoaded }: SheetsInputProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState("https://docs.google.com/spreadsheets/d/15y5MAJdLqJFxUSqrxdS_rK62V0JMNPJb/edit?usp=sharing&ouid=103296176296686640015&rtpof=true&sd=true");

  const handleLoadSheet = async () => {
    if (!url) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const sheetId = url.includes('/') ? url.split('/d/')[1]?.split('/')[0] : url;
      console.log('Loading sheet with ID:', sheetId);
      
      const response = await fetch(`/api/sheets?id=${sheetId}`);
      const result = await response.json();
      
      if (response.ok) {
        console.log('Sheet loaded successfully:', result);
        onSheetLoaded(result);
      } else {
        throw new Error(result.error || 'Failed to load sheet');
      }
    } catch (error) {
      console.error("Sheet load error:", error);
      setError(error instanceof Error ? error.message : 'Failed to load sheet');
    } finally {
      setLoading(false);
    }
  };

  // Auto-load the sheet on component mount
  useEffect(() => {
    if (url) {
      handleLoadSheet();
    }
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Google Sheets URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
          style={{
            padding: "6px 12px",
            borderRadius: "4px",
            border: "1px solid #333",
            backgroundColor: "#222",
            color: "white",
            width: "300px"
          }}
        />
        <button
          onClick={handleLoadSheet}
          disabled={loading || !url}
          style={{
            padding: "6px 12px",
            backgroundColor: "#333",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Loading..." : "📊 Load Sheet"}
        </button>
      </div>
      {error && (
        <div style={{
          padding: "8px",
          backgroundColor: "#ff4444",
          color: "white",
          borderRadius: "4px",
          fontSize: "14px"
        }}>
          Error: {error}
        </div>
      )}
    </div>
  );
}