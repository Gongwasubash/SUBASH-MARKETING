import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Check environment variables
    const envCheck = {
      THESYS_API_KEY: process.env.THESYS_API_KEY ? 'Set' : 'Missing',
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY ? 'Set' : 'Missing',
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'Set' : 'Missing',
    };
    
    return NextResponse.json({
      status: 'API Test',
      environment: envCheck,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json({ 
      error: "Test failed", 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}