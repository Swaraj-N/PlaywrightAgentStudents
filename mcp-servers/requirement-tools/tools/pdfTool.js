import fs from "fs";
import * as pdf from "pdf-parse";

export function registerPdfTool(server) {

  server.registerTool(
    "extract_pdf_text",
    {
      title: "Extract PDF Text",
      description:
        "Reads a PDF file from the provided file path and extracts its text content. Useful for document analysis, search indexing, summarization, and downstream NLP workflows.",
      
    },

    async ({ path }) => {

      try {

        const dataBuffer = fs.readFileSync(path);

        const data = await pdf(dataBuffer);

        return {
          content: [
            {
              type: "text",
              text: data.text
            }
          ]
        };

      } catch (error) {

        return {
          content: [
            {
              type: "text",
              text: `PDF extraction failed: ${error.message}`
            }
          ]
        };

      }

    }
  );
}