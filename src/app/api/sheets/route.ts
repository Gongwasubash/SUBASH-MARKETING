import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(req: NextRequest) {
  try {
    console.log('Starting sheet fetch...');
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: "service_account",
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token"
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: '15y5MAJdLqJFxUSqrxdS_rK62V0JMNPJb',
      range: 'A:Z'
    });

    const rows = response.data.values || [];
    const csvData = rows.map(row => row.join(',')).join('\n');
    
    console.log('Sheet data loaded successfully, rows:', rows.length);

    return NextResponse.json({
      data: csvData,
      sheetId: '15y5MAJdLqJFxUSqrxdS_rK62V0JMNPJb',
      message: 'Sheet loaded via API',
      rowCount: rows.length
    });
    
  } catch (error) {
    console.error('Sheets API error:', error);
    
    // Return sample data as fallback
    const sampleData = `Campaign,Budget,Clicks,Conversions\nGoogle Ads,5000,3500,280\nFacebook,3000,2100,150\nInstagram,4000,1800,220`;
    
    return NextResponse.json({
      data: sampleData,
      sheetId: '15y5MAJdLqJFxUSqrxdS_rK62V0JMNPJb',
      message: 'Using sample data - API error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}