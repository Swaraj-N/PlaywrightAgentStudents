// utility/excelUtility.js

import XLSX from 'xlsx-js-style';

export class ExcelUtility {

  static getCellValue(
    excelPath,
    sheetName,
    rowIndex,
    columnIndex
  ) {
    const workbook =
      XLSX.readFile(excelPath);

    const sheet =
      workbook.Sheets[sheetName];

    const data =
      XLSX.utils.sheet_to_json(
        sheet,
        { header: 1 }
      );

    return data?.[rowIndex]?.[columnIndex];
  }

  static writeCellValue(
    excelPath,
    sheetName,
    rowIndex,
    columnIndex,
    value
  ) {

    const workbook =
      XLSX.readFile(excelPath);

    const sheet =
      workbook.Sheets[sheetName];

    const data =
      XLSX.utils.sheet_to_json(
        sheet,
        { header: 1 }
      );

    if (!data[rowIndex]) {
      data[rowIndex] = [];
    }

    data[rowIndex][columnIndex] =
      value;

    const newSheet =
      XLSX.utils.aoa_to_sheet(data);

    workbook.Sheets[sheetName] =
      newSheet;

    XLSX.writeFile(
      workbook,
      excelPath
    );
  }

 /**
 * Insert or Update row based on testID
 *
 * Rule:
 * - testID exists in column 0 → update row
 * - testID not exists → append row
 *
 * @param {string} excelPath
 * @param {string} sheetName
 * @param {string[]} rowData
 */
static upsertRow(excelPath,sheetName,rowData = []) {

  if (!rowData.length) {
    throw new Error(
      'rowData cannot be empty'
    );
  }

  const workbook =
    XLSX.readFile(excelPath);

  const sheet =
    workbook.Sheets[sheetName];

  if (!sheet) {
    throw new Error(
      `Sheet not found: ${sheetName}`
    );
  }

  const data =
    XLSX.utils.sheet_to_json(
      sheet,
      { header: 1 }
    );

  // testID always first column
  const incomingTestId =
    rowData[0];

  // find existing row index
  const existingRowIndex =
    data.findIndex(
      row =>
        row &&
        row[0] === incomingTestId
    );

  if (existingRowIndex !== -1) {

    // Update row
    data[existingRowIndex] =
      rowData;

    console.log(
      `Updated row for testID: ${incomingTestId}`
    );

  } else {

    // Insert new row
    data.push(rowData);

    console.log(
      `Inserted new row for testID: ${incomingTestId}`
    );
  }

  // Convert to sheet
  const newSheet =
    XLSX.utils.aoa_to_sheet(data);

  workbook.Sheets[sheetName] =
    newSheet;

  XLSX.writeFile(
    workbook,
    excelPath
  );
}
}

export default ExcelUtility;