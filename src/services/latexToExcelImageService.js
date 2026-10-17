// services/latexToExcelImageService.js
import { getExcelJS } from './exceljsLoader';
import { latexToUnicode } from './latexRendererService';

// Since we're in the renderer, use IPC
const isElectron = !!(window.electron && window.electron.ipcRenderer);

/**
 * Render LaTeX to temporary file via IPC
 */
const renderLatexToFile = async (latex, options = {}) => {
    if (isElectron) {
        const result = await window.electron.ipcRenderer.invoke('latex:renderToFile', latex, options);
        if (result.success) {
            return result.filePath;
        }
        throw new Error(result.error || 'Failed to render LaTeX');
    }
    throw new Error('Electron IPC not available');
};

/**
 * Clean up temporary files via IPC
 */
const cleanupLatexImages = async () => {
    if (isElectron) {
        const result = await window.electron.ipcRenderer.invoke('latex:cleanup');
        if (result.success) {
            return result.cleaned;
        }
        throw new Error(result.error || 'Failed to cleanup');
    }
    return 0;
};

/**
 * LaTeX to Excel Image Service (Renderer Version)
 * Renders LaTeX formulas as images and inserts them into Excel cells
 */
export class LatexToExcelImageService {
    
    /**
     * Insert LaTeX formula as image into Excel worksheet
     */
    static async insertLatexIntoExcel(worksheet, latex, cellAddress, options = {}) {
        const {
            fontSize = 20,
            fontColor = '#1976D2',
            backgroundColor = '#FFFFFF',
            imageWidth = 200,
            imageHeight = 50,
            padding = 10
        } = options;

        let tempFilePath = null;
        let imageId = null;

        try {
            // Get ExcelJS instance
            const ExcelJS = await getExcelJS();
            
            // Render LaTeX to temporary file via IPC
            tempFilePath = await renderLatexToFile(latex, {
                fontSize,
                fontColor,
                backgroundColor,
                padding
            });

            // Add image to workbook
            const workbook = worksheet._workbook;
            imageId = workbook.addImage({
                filename: tempFilePath,
                extension: 'png',
            });

            // Parse cell address
            const cell = worksheet.getCell(cellAddress);
            const rowNumber = cell.row;
            const colNumber = cell.col;

            // Calculate image position
            const position = {
                tl: { col: colNumber - 0.5, row: rowNumber - 0.5 },
                ext: { width: imageWidth, height: imageHeight }
            };

            // Add image to worksheet
            worksheet.addImage(imageId, position);

            // Set row height
            const row = worksheet.getRow(rowNumber);
            if (imageHeight > row.height) {
                row.height = imageHeight * 0.75;
            }

            // Set column width
            const col = worksheet.getColumn(colNumber);
            const currentWidth = col.width || 10;
            const neededWidth = (imageWidth / 7) + 1;
            if (neededWidth > currentWidth) {
                col.width = neededWidth;
            }

            console.log(`✅ LaTeX formula inserted at ${cellAddress}: ${latex}`);

            // Clean up temporary file immediately
            if (tempFilePath) {
                try {
                    // Use fs in renderer via preload if available
                    if (window.electron && window.electron.fs) {
                        window.electron.fs.unlinkSync(tempFilePath);
                    }
                } catch (cleanupError) {
                    console.warn('Failed to clean up temporary file:', cleanupError);
                }
            }

        } catch (error) {
            console.error('Error inserting LaTeX into Excel:', error);
            // Fallback: Insert as text with rich formatting
            this.insertLatexAsText(worksheet, latex, cellAddress);
        }
    }

    /**
     * Fallback: Insert LaTeX as rich text
     */
    static insertLatexAsText(worksheet, latex, cellAddress) {
        try {
            const cell = worksheet.getCell(cellAddress);
            const unicodeFormula = latexToUnicode(latex);
            
            cell.value = {
                richText: [
                    { text: unicodeFormula, font: { 
                        bold: true, 
                        color: { argb: 'FF1976D2' },
                        size: 12,
                        italic: true
                    }}
                ]
            };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            
            console.log(`📝 LaTeX inserted as rich text at ${cellAddress}: ${unicodeFormula}`);
        } catch (error) {
            console.error('Failed to insert as rich text:', error);
            worksheet.getCell(cellAddress).value = latex;
        }
    }

    /**
     * Insert multiple LaTeX formulas
     */
    static async insertMultipleLatex(worksheet, formulas) {
        const results = [];
        
        for (const formula of formulas) {
            try {
                await this.insertLatexIntoExcel(
                    worksheet,
                    formula.latex,
                    formula.cellAddress,
                    formula.options || {}
                );
                results.push({
                    success: true,
                    cellAddress: formula.cellAddress,
                    latex: formula.latex
                });
            } catch (error) {
                results.push({
                    success: false,
                    cellAddress: formula.cellAddress,
                    latex: formula.latex,
                    error: error.message
                });
            }
        }
        
        return results;
    }

    /**
     * Create a dedicated formula sheet
     */
    static async createFormulaSheet(workbook, sheetName, formulas, options = {}) {
        const worksheet = workbook.addWorksheet(sheetName, {
            properties: { tabColor: { argb: 'FF6A1B9A' } },
            pageSetup: { orientation: 'landscape', fitToPage: true }
        });

        worksheet.columns = [
            { header: 'Description', key: 'description', width: 30 },
            { header: 'Formula', key: 'formula', width: 40 },
            { header: 'Result', key: 'result', width: 20 },
            { header: 'Unit', key: 'unit', width: 15 }
        ];

        const headerRow = worksheet.getRow(1);
        headerRow.height = 30;
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 14 };
        headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6A1B9A' } };
        headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

        let rowIndex = 2;
        
        for (const formula of formulas) {
            const row = worksheet.getRow(rowIndex);
            row.height = 60;
            
            row.getCell(1).value = formula.description || '';
            row.getCell(1).font = { bold: true, size: 12 };
            row.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };

            if (formula.latex) {
                const cellAddress = `B${rowIndex}`;
                await this.insertLatexIntoExcel(
                    worksheet,
                    formula.latex,
                    cellAddress,
                    {
                        fontSize: formula.fontSize || 20,
                        fontColor: formula.fontColor || '#1976D2',
                        imageWidth: formula.imageWidth || 300,
                        imageHeight: formula.imageHeight || 60
                    }
                );
            }

            row.getCell(3).value = formula.result || '';
            row.getCell(3).font = { 
                bold: true, 
                color: { argb: formula.resultColor || 'FF008000' },
                size: 12
            };
            row.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };

            row.getCell(4).value = formula.unit || '';
            row.getCell(4).font = { size: 11, color: { argb: 'FF666666' } };
            row.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };

            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                    left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                    bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                    right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
                };
            });

            rowIndex++;
        }

        return worksheet;
    }

    /**
     * Clean up temporary files
     */
    static async cleanupTempFiles() {
        return await cleanupLatexImages();
    }
}

// ─── Convenience Functions ──────────────────────────────────────────

export const insertLatexFormula = async (worksheet, latex, cellAddress, options = {}) => {
    return LatexToExcelImageService.insertLatexIntoExcel(
        worksheet,
        latex,
        cellAddress,
        options
    );
};

export const createFormulaSheet = async (workbook, sheetName, formulas, options = {}) => {
    return LatexToExcelImageService.createFormulaSheet(
        workbook,
        sheetName,
        formulas,
        options
    );
};

export const cleanupLatexImages = async () => {
    return LatexToExcelImageService.cleanupTempFiles();
};

export default LatexToExcelImageService;