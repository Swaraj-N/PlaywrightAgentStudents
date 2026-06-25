import mammoth from "mammoth";

export function registerDocxTool(server) {
// https://github.com/modelcontextprotocol/typescript-sdk/blob/v1.x/src/examples/server/simpleStreamableHttp.ts
  server.registerTool(
    "extract_docx_text",
   {
    title: "Extract DOCX Text",
    description: "Reads and extracts plain text content from a Microsoft Word (.docx) document. Use this tool to retrieve text from uploaded or local Word files for analysis, summarization, parsing, or downstream processing.",
    path: "string"
   },

    async ({ path }) => {

      try {

        const result = await mammoth.extractRawText({ path});
        console.log(result.value)  
        return {
          content: [
            {
              type: "text",
              text: result.value
            }
          ]
        };

      } catch (error) {

        return {
          content: [
            {
              type: "text",
              text: `DOCX extraction failed: ${error.message}`
            }
          ]
        };

      }

    }
  );
}