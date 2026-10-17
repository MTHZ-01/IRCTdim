// components/MasterExcelGenerator.jsx

import { ExcelDataService } from '../services/excelDataService';
import * as XLSX from 'xlsx';
import { AURL } from '../App.jsx';

export class MasterExcelGenerator {
  
  static async generateMasterExcel(readySet, allFileData) {
    // Step 1: Collect and validate all data
    const result = ExcelDataService.collectAllExcelData(readySet, allFileData);
    
    // Step 2: Check if there are any incomplete files
    if (result.hasIncompleteFiles) {
      // Build the detailed message for the user
      const incompleteMessages = result.validationResults.incomplete.map(item => {
        const errors = item.validation.errors.map(e => `  • ${e.message}`).join('\n');
        return `📄 ${item.validation.fileName}\n${errors}`;
      });
      
      const message = `⚠️ The following files are incomplete and will be SKIPPED:\n\n${incompleteMessages.join('\n\n')}\n\nDo you want to continue generating the Excel report without these files?`;
      
      // Return the validation result with a flag for the UI to handle
      return {
        success: false,
        hasIncompleteFiles: true,
        incompleteCount: result.incompleteCount,
        incompleteFiles: result.validationResults.incomplete.map(item => ({
          fileName: item.validation.fileName,
          errors: item.validation.errors
        })),
        message: message,
        excelData: result.excelData, // Still available if user wants to continue
        validationResults: result.validationResults
      };
    }
    
    // Step 3: If all files are complete, generate the Excel
    return await this.assembleExcel(result.excelData, result.validationResults);
  }
  
  // ─── Assemble Excel from validated data ────────────────────
  static async assembleExcel(excelData, validationResults) {
    const workbook = XLSX.utils.book_new();
    
    // Sheet 1: IRCT Data
    if (excelData.irct.length > 0) {
      const irctSheet = this.createSheet(
        excelData.irct,
        'IRCT Calculations',
        ['IRCT Data']
      );
      XLSX.utils.book_append_sheet(workbook, irctSheet, 'IRCT');
    }
    
    // Sheet 2: IRM Data
    if (excelData.irm.length > 0) {
      const irmSheet = this.createSheet(
        excelData.irm,
        'IRM Calculations',
        ['IRM Data']
      );
      XLSX.utils.book_append_sheet(workbook, irmSheet, 'IRM');
    }
    
    // Sheet 3: IRVT Data
    if (excelData.irvt.length > 0) {
      const irvtSheet = this.createSheet(
        excelData.irvt,
        'IRVT Calculations',
        ['IRVT Data']
      );
      XLSX.utils.book_append_sheet(workbook, irvtSheet, 'IRVT');
    }
    
    // Sheet 4: Summary with Validation Results
    const summarySheet = this.createSummarySheet(excelData, validationResults);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    
    // Generate Excel buffer
    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array',
      bookSST: false
    });
    
    return {
      success: true,
      buffer: excelBuffer,
      fileName: `Master_Excel_${new Date().toISOString().slice(0,10)}.xlsx`,
      includedFiles: [
        ...excelData.irct.map(f => f.fileName),
        ...excelData.irm.map(f => f.fileName),
        ...excelData.irvt.map(f => f.fileName)
      ],
      totalFiles: excelData.irct.length + excelData.irm.length + excelData.irvt.length
    };
  }
  
  // ─── Create Sheet Helper ────────────────────────────────────
  static createSheet(dataList, title, headers) {
    if (!dataList || dataList.length === 0) {
      return XLSX.utils.aoa_to_sheet([
        [title],
        [],
        ['No data available for this section']
      ]);
    }
    
    // Build rows: first item's headers + all rows
    const headerRow = dataList[0].headers || [];
    const rows = [];
    
    // Add headers
    rows.push([title]);
    rows.push([]);
    rows.push(headerRow);
    
    // Add data rows
    dataList.forEach(item => {
      if (item.rows && item.rows.length > 0) {
        item.rows.forEach(row => {
          rows.push(row);
        });
      }
    });
    
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    
    // Auto column widths
    worksheet['!cols'] = headerRow.map(() => ({ wch: 25 }));
    
    return worksheet;
  }
  
  // ─── Create Summary Sheet ──────────────────────────────────
  static createSummarySheet(excelData, validationResults) {
    const rows = [
      ['MASTER EXCEL SUMMARY'],
      [],
      ['Generated on:', new Date().toLocaleString()],
      [],
      ['📊 File Statistics'],
      ['File Type', '✅ Complete', '❌ Incomplete', 'Total'],
      ['IRCT', excelData.irct.length, validationResults.incomplete.filter(i => i.validation.fileType === 'IRCT').length, excelData.irct.length + validationResults.incomplete.filter(i => i.validation.fileType === 'IRCT').length],
      ['IRM', excelData.irm.length, validationResults.incomplete.filter(i => i.validation.fileType === 'IRM').length, excelData.irm.length + validationResults.incomplete.filter(i => i.validation.fileType === 'IRM').length],
      ['IRVT', excelData.irvt.length, validationResults.incomplete.filter(i => i.validation.fileType === 'IRVT').length, excelData.irvt.length + validationResults.incomplete.filter(i => i.validation.fileType === 'IRVT').length],
      [],
      ['📝 Files Included in Excel:'],
      ...(excelData.irct.length > 0 ? [['IRCT Files:'], ...excelData.irct.map(f => [`  ✅ ${f.fileName}`])] : []),
      ...(excelData.irct.length > 0 && excelData.irm.length > 0 ? [[]] : []),
      ...(excelData.irm.length > 0 ? [['IRM Files:'], ...excelData.irm.map(f => [`  ✅ ${f.fileName}`])] : []),
      ...(excelData.irm.length > 0 && excelData.irvt.length > 0 ? [[]] : []),
      ...(excelData.irvt.length > 0 ? [['IRVT Files:'], ...excelData.irvt.map(f => [`  ✅ ${f.fileName}`])] : []),
      [],
      ...(validationResults.incomplete.length > 0 ? [
        ['⚠️ Skipped Files (Incomplete):'],
        ...validationResults.incomplete.map(item => [
          `  ❌ ${item.validation.fileName}`,
          `     Errors: ${item.validation.errors.map(e => e.message).join('; ')}`
        ])
      ] : [
        ['✅ All files are complete and included']
      ])
    ];
    
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    worksheet['!cols'] = [
      { wch: 30 },
      { wch: 60 }
    ];
    
    return worksheet;
  }
}