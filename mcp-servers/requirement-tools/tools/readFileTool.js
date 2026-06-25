import fs from "fs";

export function registerReadFileTool(server) {

  server.registerTool(
    "read_file",
    {
     title: "Read File Content",
     description: "Reads and retrieves the content of a specified file from the provided file path. Use this tool to access text-based files for analysis, parsing, validation, or processing within the workflow.",
     path: "string"
     },

    async ({ path }) => {

      try {

        const content = fs.readFileSync(path, "utf8");

        return {
          content: [
            {
              type: "text",
              text: content
            }
          ]
        };

      } catch (error) {

        return {
          content: [
            {
              type: "text",
              text: `Error reading file: ${error.message}`
            }
          ]
        };

      }

    }
  );
}