// services/excelDataService.js

import { validateAllFiles } from './validators.js';
import { extractIRCTData, extractIRMData, extractIRVTData } from './excelService.js';

export class ExcelDataService {
  
  // ─── Collect and Validate All Excel Data ──────────────────
  static collectAllExcelData(readySet, allFileData) {
    // First: Validate all files using the unified validator
    const validationResults = validateAllFiles(readySet);
    
    // Separate complete vs incomplete (partial files are treated as complete for extraction purposes)
    const completeFiles = [...validationResults.completeFiles, ...validationResults.partialFiles];
    const incompleteFiles = validationResults.incompleteFiles;
    
    // Build Excel data from complete/partial files only
    const excelData = {
      irct: [],
      irm: [],
      irvt: [],
      summary: {
        totalFiles: readySet.length,
        completeFiles: completeFiles.length,
        incompleteFiles: incompleteFiles.length,
        incompleteList: incompleteFiles.map(item => ({
          fileName: item.validation.fileName,
          errors: item.validation.errors.map(e => e.message).join(', '),
          type: item.validation.fileType
        }))
      },
      skippedFiles: incompleteFiles.map(item => item.validation.fileName)
    };
    
    // Process only complete/partial files using the SINGLE source of truth extraction logic
    completeFiles.forEach(({ data, validation }) => {
      if (validation.fileType === 'IRCT') {
        excelData.irct.push(extractIRCTData(data));
      } else if (validation.fileType === 'IRM') {
        excelData.irm.push(extractIRMData(data));
      } else if (validation.fileType === 'IRVT') {
        excelData.irvt.push(extractIRVTData(data));
      }
    });
    
    return {
      excelData: excelData,
      validationResults: validationResults,
      hasIncompleteFiles: incompleteFiles.length > 0,
      incompleteCount: incompleteFiles.length
    };
  }
}