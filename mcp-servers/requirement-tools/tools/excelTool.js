import ExcelJS from "exceljs";
import path from "path";

export function registerExcelTool(server) {

  server.registerTool(
    "generate_excel",
      {
      title: "Generate Test Case Excel",
      description: "Creates an Excel spreadsheet containing structured test case entries. Use this tool to generate downloadable .xlsx files from provided test case data, including test steps, expected results, priorities, and other QA details.",
      fileName: "string",
      testCases: "string"
    },

    async ({ fileName, testCases }) => {

      try {

        const workbook = new ExcelJS.Workbook();

        const sheet = workbook.addWorksheet("Test Cases");

        sheet.columns = [
          { header: "Test Case ID", key: "id", width: 20 },
          { header: "Module", key: "module", width: 25 },
          { header: "Scenario", key: "scenario", width: 40 },
          { header: "Steps", key: "steps", width: 60 },
          { header: "Expected Result", key: "expected", width: 50 }
        ];

        const parsedData = JSON.parse(testCases);

        parsedData.forEach(tc => {

          sheet.addRow({
            id: tc.id,
            module: tc.module,
            scenario: tc.scenario,
            steps: tc.steps,
            expected: tc.expected
          });

        });

        sheet.getRow(1).font = {
          bold: true
        };

        const outputPath = path.resolve(
          `./output/${fileName}.xlsx`
        );

        await workbook.xlsx.writeFile(outputPath);

        return {
          content: [
            {
              type: "text",
              text: `Excel generated successfully: ${outputPath}`
            }
          ]
        };

      } catch (error) {

        return {
          content: [
            {
              type: "text",
              text: `Excel generation failed: ${error.message}`
            }
          ]
        };

      }

    }
  );

}