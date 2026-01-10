import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sheetId = "15y5MAJdLqJFxUSqrxdS_rK62V0JMNPJb";
  
  try {
    // Test different access methods
    const testUrls = [
      `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`,
      `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`,
      `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`,
    ];
    
    const results = [];
    
    for (const url of testUrls) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        results.push({
          url,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          preview: response.ok ? (await response.text()).substring(0, 200) : null
        });
      } catch (error) {
        results.push({
          url,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return NextResponse.json({
      sheetId,
      testResults: results
    });
    
  } catch (error) {
    return NextResponse.json({ 
      error: "Test failed", 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}