"use client";

import { useState, useEffect } from "react";

export default function SheetDataDisplay() {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sheetId = "15y5MAJdLqJFxUSqrxdS_rK62V0JMNPJb";
        const response = await fetch(`/api/sheets?id=${sheetId}`);
        const result = await response.json();
        
        if (response.ok) {
          setData(result.data);
        } else {
          setError(result.error || 'Failed to load data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading sheet data...</div>;
  if (error) return <div style={{color: 'red'}}>Error: {error}</div>;

  const rows = data?.split('\n').slice(0, 10) || [];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Google Sheets Data</h2>
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '10px', 
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '12px',
        maxHeight: '400px',
        overflow: 'auto'
      }}>
        {rows.map((row, index) => (
          <div key={index} style={{ marginBottom: '4px' }}>
            {row}
          </div>
        ))}
      </div>
    </div>
  );
}