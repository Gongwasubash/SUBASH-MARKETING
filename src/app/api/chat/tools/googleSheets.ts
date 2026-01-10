import { z } from "zod";

export const googleSheetsTool = {
  type: "function" as const,
  function: {
    name: "fetch_google_sheet",
    description: "Fetch data from a Google Sheets document using its URL or ID",
    parameters: z.object({
      sheetUrl: z.string().describe("Google Sheets URL or ID"),
      query: z.string().describe("Question or analysis request about the sheet data")
    }).strict(),
    parse: async (args: { sheetUrl: string; query: string }) => {
      try {
        const sheetId = "15y5MAJdLqJFxUSqrxdS_rK62V0JMNPJb";
        
        const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
        const response = await fetch(csvUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (!response.ok) {
          return {
            success: false,
            message: `Failed to fetch Google Sheet (${response.status}). Sheet may not be publicly accessible.`
          };
        }
        
        const csvData = await response.text();
        
        return {
          success: true,
          data: csvData.slice(0, 5000),
          message: `Successfully loaded Google Sheet data. Analyzing to answer: ${args.query}`
        };
        
      } catch (error) {
        return {
          success: false,
          message: `Error loading Google Sheet: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
      }
    }
  }
};