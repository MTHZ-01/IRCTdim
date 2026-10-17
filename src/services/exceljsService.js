// src/services/exceljsService.js
import moment from 'moment';
import { getExcelJS } from './exceljsLoader';

/**
 * Create an Excel file with styled formulas and optional images
 */
export const createStyledExcelWithFormulas = async (data, title = 'Calculations') => {
    try {
        // ✅ Get ExcelJS instance via our loader
        const ExcelJS = await getExcelJS();
        
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Knowledge Based Initiative';
        workbook.created = new Date();
        
        const worksheet = workbook.addWorksheet(title.slice(0, 31), {
            properties: { tabColor: { argb: 'FF6A1B9A' } },
            pageSetup: { orientation: 'landscape', fitToPage: true }
        });

        // Set column widths
        worksheet.columns = [
            { header: 'Parameter', key: 'label', width: 45 },
            { header: 'Value/Formula', key: 'value', width: 45 },
            { header: 'Status', key: 'status', width: 14 },
            { header: 'Unit', key: 'unit', width: 14 },
            { header: 'Remarks', key: 'remarks', width: 14 },
        ];

        let currentRow = 1;

        // ─── Helper: Add styled header ──────────────────────────────────
        const addHeader = (text, height = 30, bgColor = 'FF6A1B9A') => {
            const row = worksheet.getRow(currentRow);
            row.height = height;
            const cell = row.getCell(1);
            cell.value = text;
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 16 };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
            cell.alignment = { horizontal: 'left', vertical: 'middle' };
            worksheet.mergeCells(currentRow, 1, currentRow, 5);
            currentRow++;
            return row;
        };

        // ─── Helper: Add sub-header ─────────────────────────────────────
        const addSubHeader = (text, height = 25, bgColor = 'FF1976D2') => {
            const row = worksheet.getRow(currentRow);
            row.height = height;
            const cell = row.getCell(1);
            cell.value = text;
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 14 };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
            cell.alignment = { horizontal: 'left', vertical: 'middle' };
            worksheet.mergeCells(currentRow, 1, currentRow, 5);
            currentRow++;
            return row;
        };

        // ─── Helper: Add file separator (orange) ───────────────────────
        const addFileSeparator = (text, height = 35) => {
            const row = worksheet.getRow(currentRow);
            row.height = height;
            const cell = row.getCell(1);
            cell.value = text;
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 14 };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF8C00' } };
            cell.alignment = { horizontal: 'left', vertical: 'middle' };
            worksheet.mergeCells(currentRow, 1, currentRow, 5);
            currentRow++;
            return row;
        };

        // ─── Helper: Add data row ───────────────────────────────────────
        const addDataRow = (label, value, valueStyle = {}, height = 22) => {
            const row = worksheet.getRow(currentRow);
            row.height = height;
            
            row.getCell(1).value = label;
            row.getCell(1).font = { bold: true, size: 12, color: { argb: 'FF000000' } };
            row.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };

            if (typeof value === 'object' && value.richText) {
                row.getCell(2).value = value;
            } else {
                row.getCell(2).value = String(value ?? 'NAN');
                row.getCell(2).font = { 
                    bold: valueStyle.bold || false,
                    color: { argb: valueStyle.color || 'FF1976D2' },
                    size: valueStyle.size || 12,
                    italic: valueStyle.italic || false
                };
            }
            row.getCell(2).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

            currentRow++;
            return row;
        };

        // ─── Helper: Add approval row ──────────────────────────────────
        const addApprovalRow = (label, pass, height = 22) => {
            const row = worksheet.getRow(currentRow);
            row.height = height;
            
            row.getCell(1).value = label;
            row.getCell(1).font = { bold: true, size: 12, color: { argb: 'FF000000' } };
            row.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };

            const statusText = pass ? '✅ OK' : '❌ NOT OK';
            row.getCell(2).value = statusText;
            row.getCell(2).font = { 
                bold: true, 
                size: 14,
                color: { argb: pass ? 'FF008000' : 'FFFF0000' }
            };
            row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };

            currentRow++;
            return row;
        };

        // ─── Helper: Add spacer ─────────────────────────────────────────
        const addSpacer = (height = 10) => {
            const row = worksheet.getRow(currentRow);
            row.height = height;
            currentRow++;
            return row;
        };

        // ─── Helper: Create rich text formula ──────────────────────────
        const createRichTextFormula = (formula, result, unit = '') => {
            return {
                richText: [
                    { text: formula, font: { bold: true, color: { argb: 'FF1976D2' }, size: 12 } },
                    { text: ' = ', font: { size: 12 } },
                    { text: String(result), font: { bold: true, color: { argb: 'FF008000' }, size: 12 } },
                    { text: unit ? ` ${unit}` : '', font: { color: { argb: 'FF666666' }, size: 10 } }
                ]
            };
        };

        // ─── Build the Excel from extracted data ────────────────────────

        // Main Title
        addHeader(`${title} - ${moment().format("YYYY-MM-DD HH:mm")}`);
        addSpacer(5);

        const rows = data.rows || [];
        
        if (data.fileName) {
            addSubHeader(`File: ${data.fileName}`, 22, 'FF483D8B');
            addSpacer(5);
        }

        for (const rowData of rows) {
            if (rowData.isHeader) {
                if (rowData.isFileSeparator) {
                    addFileSeparator(rowData.text, rowData.customHeight || 35);
                    addSpacer(5);
                } else {
                    addSubHeader(rowData.text, 25, 'FF1976D2');
                    addSpacer(3);
                }
            } else if (rowData.isSubHeader) {
                addSubHeader(rowData.text, 22, 'FF483D8B');
                addSpacer(3);
            } else if (rowData.isSpacer) {
                addSpacer(rowData.height || 10);
            } else if (rowData.isCategory) {
                addSubHeader(rowData.text, 22, 'FF6A1B9A');
                addSpacer(3);
            } else if (rowData.type === 'data') {
                if (rowData.isFormula) {
                    const richText = createRichTextFormula(
                        rowData.formula || rowData.value,
                        rowData.result || '',
                        rowData.unit || ''
                    );
                    addDataRow(rowData.label, richText, {}, rowData.height || 25);
                } else {
                    let value = rowData.value;
                    let style = {};
                    if (rowData.valueStyle === 'ok') {
                        style = { bold: true, color: 'FF008000' };
                    } else if (rowData.valueStyle === 'notOk') {
                        style = { bold: true, color: 'FFFF0000' };
                    } else if (rowData.valueStyle) {
                        style = rowData.valueStyle;
                    }
                    addDataRow(rowData.label, value, style);
                }
            } else if (rowData.type === 'label_value') {
                const row = worksheet.getRow(currentRow);
                row.height = 20;
                row.getCell(1).value = rowData.label;
                row.getCell(1).font = { bold: true, size: 12 };
                row.getCell(2).value = rowData.value;
                row.getCell(2).font = { size: 12, color: { argb: 'FF000000' } };
                currentRow++;
            } else if (rowData.isOKRow) {
                addApprovalRow(rowData.label, rowData.pass);
            } else if (rowData.type === 'approval') {
                addDataRow(`Required ${rowData.metric} [${rowData.standard}]:`, String(rowData.required ?? 'NAN'));
                addDataRow(`Actual ${rowData.metric}:`, String(rowData.actual ?? 'NAN'));
                const pass = rowData.pass ?? false;
                const row = worksheet.getRow(currentRow);
                row.height = 22;
                row.getCell(1).value = `Result [${rowData.standard}]:`;
                row.getCell(1).font = { bold: true, size: 12 };
                row.getCell(2).value = pass ? '✅ OK' : '❌ NOT OK';
                row.getCell(2).font = { 
                    bold: true, 
                    size: 14,
                    color: { argb: pass ? 'FF008000' : 'FFFF0000' }
                };
                currentRow++;
            } else if (rowData.type === 'approval_summary') {
                const allPass = rowData.pass ?? false;
                const row = worksheet.getRow(currentRow);
                row.height = 25;
                row.getCell(1).value = 'Overall Result:';
                row.getCell(1).font = { bold: true, size: 14 };
                row.getCell(2).value = allPass ? '✅ ALL PASSED' : '❌ SOME FAILED';
                row.getCell(2).font = { 
                    bold: true, 
                    size: 16,
                    color: { argb: allPass ? 'FF008000' : 'FFFF0000' }
                };
                row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
                worksheet.mergeCells(currentRow, 1, currentRow, 2);
                currentRow++;
            }
        }

        // ─── Apply borders ──────────────────────────────────────────────
        worksheet.eachRow({ includeEmpty: false }, (row) => {
            row.eachCell({ includeEmpty: true }, (cell) => {
                if (cell.value && cell.value !== '') {
                    cell.border = {
                        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                    };
                }
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    } catch (error) {
        console.error('Error creating Excel with ExcelJS:', error);
        throw error;
    }
};

/**
 * Generate Excel report from your existing data structure
 */
export const generateStyledExcelWithRichText = async (data, title = 'Calculations') => {
    try {
        const buffer = await createStyledExcelWithFormulas(data, title);
        return {
            success: true,
            buffer: buffer,
            fileName: `${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`
        };
    } catch (error) {
        console.error('Error generating Excel report:', error);
        return {
            success: false,
            error: error.message
        };
    }
};