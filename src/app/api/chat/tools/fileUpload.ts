import { z } from "zod";

export const fileUploadTool = {
  type: "function" as const,
  function: {
    name: "analyze_uploaded_data",
    description: "Analyze and answer questions about uploaded file data or Google Sheets data",
    parameters: z.object({
      question: z.string().describe("Question about the uploaded data"),
      data_type: z.string().describe("Type of data (file or sheet)")
    }).strict(),
    parse: async (args: { question: string; data_type: string }) => {
      return {
        success: true,
        message: `Analyzing the uploaded ${args.data_type} data to answer: ${args.question}. The data is available in the conversation context and I can provide insights, summaries, and answer specific questions about it.`
      };
    }
  }
};