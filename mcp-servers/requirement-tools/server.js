import dotenv from "dotenv";
dotenv.config();

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { registerPdfTool } from "./tools/pdfTool.js";
import { registerDocxTool } from "./tools/docxTool.js";
import { registerJiraTool } from "./tools/jiraTool.js";
import { registerExcelTool } from "./tools/excelTool.js";
import { registerReadFileTool } from "./tools/readFileTool.js";
import { registerJiraSearchTool } from "./tools/searchJiraIssue.js";

const server = new McpServer({
  name: "requirement-tools",
  version: "1.0.0"
});

registerPdfTool(server);
registerDocxTool(server);
registerJiraTool(server);
registerExcelTool(server);
registerReadFileTool(server);
registerJiraSearchTool(server);

const transport = new StdioServerTransport();

await server.connect(transport);
console.log("Requirement MCP Server Started...");