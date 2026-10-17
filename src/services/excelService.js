// services/excelService.js

import moment from "moment";
import { calculateProtectionResults } from "../IRCTCalculations/protectionCalculations";
import { getExcelJS } from './exceljsLoader';

// ─── STYLES (ExcelJS Format) ───────────────────────────────────────
const alignLeftCenter = { horizontal: "left", vertical: "center" };
const alignLeftTop = { horizontal: "left", vertical: "top", wrapText: true };
const alignCenter = { horizontal: "center", vertical: "center" };

const mainHeaderStyle = {
    font: { bold: true, color: { argb: "FFFFFFFF" }, size: 16 },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: "FF6A1B9A" } },
    alignment: alignLeftCenter,
};

const sectionHeader = {
    font: { bold: true, color: { argb: "FFFFFFFF" }, size: 14 },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: "FF1976D2" } },
    alignment: alignLeftCenter,
};

const sectionSubHeader = {
    font: { bold: true, color: { argb: "FFFFFFFF" }, size: 14 },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: "FF483D8B" } },
    alignment: alignLeftCenter,
};

const labelStyle = {
    font: { bold: true, color: { argb: "FF000000" }, size: 12 },
    alignment: alignLeftCenter,
};

const valueStyle = {
    font: { bold: true, color: { argb: "FF1976D2" }, size: 12 },
    alignment: alignLeftCenter,
};

const valueStyleNormal = {
    font: { color: { argb: "FF000000" }, size: 12 },
    alignment: alignLeftCenter,
};

const okStyle = {
    font: { bold: true, color: { argb: "FF008000" }, size: 14 },
    alignment: alignCenter
};

const notOkStyle = {
    font: { bold: true, color: { argb: "FFFF0000" }, size: 14 },
    alignment: alignCenter
};

const subHeaderStyle = {
    font: { bold: true, color: { argb: "FF333333" }, size: 12 },
    alignment: alignLeftCenter,
};

const categoryHeader = {
    font: { bold: true, color: { argb: "FFFFFFFF" }, size: 13 },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: "FF6A1B9A" } },
    alignment: alignLeftCenter,
};

const round = (v, d = 3) => (typeof v === "number" && !isNaN(v) ? Number(v.toFixed(d)) : v ?? "NAN");

// ─── HELPER: Get the actual data from file ──────────────────────────
function getActualData(fileData) {
    if (fileData.ProjectData) {
        return fileData.ProjectData;
    }
    if (fileData.FirstPage || fileData.MeteringDevice || fileData.L) {
        return fileData;
    }
    return fileData;
}

// ─── REFACTORED: extractIRCTData using protection calculations ─────
export const extractIRCTData = (fileData) => {
    const data = getActualData(fileData);
    const results = calculateProtectionResults({ data }, false);
    const rows = [];

    const addInfoBlock = (title, obj) => {
        rows.push({ isHeader: true, text: title });
        Object.entries(obj).forEach(([key, value]) => {
            const display = (value === undefined || value === null || value === "") ? "NAN" : value;
            rows.push({ type: 'data', label: `${key}:`, value: display });
        });
        rows.push({ isSpacer: true });
    };

    addInfoBlock("PROJECT INFORMATION", results.inputs.meta);
    addInfoBlock("RELAY INFORMATION", results.inputs.relay);
    addInfoBlock("CT INFORMATION", results.inputs.ct);
    addInfoBlock("CONDUCTOR INFORMATION", results.inputs.conductor);

    results.sections.forEach((section) => {
        if (!section.visible) return;
        rows.push({ isHeader: true, text: section.title });

        section.rows.forEach((row) => {
            const label = row.unit ? `${row.label} (${row.unit}):` : `${row.label}:`;
            rows.push({ type: 'data', label, value: round(row.value) });
        });

        const approvals = Array.isArray(section.approval)
            ? section.approval
            : section.approval ? [section.approval] : [];

        approvals.forEach((approval) => {
            if (!approval) return;
            rows.push({ type: 'approval', ...approval });
        });

        rows.push({ isSpacer: true });
    });

    const allApprovals = results.sections
        .filter(s => s.visible)
        .flatMap(s => (Array.isArray(s.approval) ? s.approval : s.approval ? [s.approval] : []))
        .filter(Boolean);

    if (allApprovals.length > 0) {
        rows.push({ isHeader: true, text: "SUMMARY OF RESULTS" });
        rows.push({
            type: 'approval_summary',
            approvals: allApprovals.map(a => ({ pass: a.pass })),
            pass: allApprovals.every(a => a.pass)
        });
        rows.push({ isSpacer: true });
    }

    return { rows, fileName: fileData.fileName || 'unknown.irct', fileType: 'IRCT' };
};

// ─── EXTRACT IRM DATA ──────────────────────────────────────────────
export const extractIRMData = (fileData) => {
    const data = getActualData(fileData);
    const meteringDevice = data.MeteringDevice || {};
    const ct = data.CurrentTransformer || {};
    const conductor = data.Conductor || {};
    const additionalEquipment = data.AdditionalEquipment || [];

    const rows = [];
    rows.push({ isHeader: true, text: "METERING DEVICE" });
    rows.push({ type: 'data', label: 'Device Name', value: meteringDevice.DeviceName || '' });
    rows.push({ type: 'data', label: 'Manufacturer', value: meteringDevice.Manufacture || '' });
    rows.push({ type: 'data', label: 'Max Current (A)', value: meteringDevice.DeviceMaxCurrent || 0 });
    rows.push({ type: 'data', label: 'Burden (VA)', value: meteringDevice.BurdenPhase_VA || 0 });
    rows.push({ type: 'data', label: 'IRN_A', value: meteringDevice.selectedIrn_A || '' });
    rows.push({ isSpacer: true });

    rows.push({ isHeader: true, text: "CURRENT TRANSFORMER" });
    rows.push({ type: 'data', label: 'CT Name', value: ct.CTName || '' });
    rows.push({ type: 'data', label: 'CT Class', value: ct.selectedCTClass || '' });
    rows.push({ type: 'data', label: 'CT Primary (A)', value: ct.CTPrimary || 0 });
    rows.push({ type: 'data', label: 'CT Secondary (A)', value: ct.CTSecondary || 0 });
    rows.push({ type: 'data', label: 'Security Factor', value: ct.SecurityFactor || '' });
    rows.push({ isSpacer: true });

    rows.push({ isHeader: true, text: "CONDUCTOR" });
    rows.push({ type: 'data', label: 'Length (m)', value: conductor.Length || 0 });
    rows.push({ type: 'data', label: 'Cross-Section (mm²)', value: conductor.CrossSection || 0 });
    rows.push({ type: 'data', label: 'Material', value: conductor.Material || '' });
    rows.push({ isSpacer: true });

    const hasEquipment = additionalEquipment.some(e => e.name && e.name.trim() !== '');
    if (hasEquipment) {
        rows.push({ isHeader: true, text: "ADDITIONAL EQUIPMENT" });
        additionalEquipment.forEach((equip) => {
            if (equip.name && equip.name.trim()) {
                rows.push({
                    type: 'label_value',
                    label: equip.name,
                    value: `${equip.ratedCurrent || 0}A, ${equip.ratedBurden || 0}VA`,
                    valueStyle: valueStyleNormal
                });
            }
        });
        rows.push({ isSpacer: true });
    }

    return { rows, fileName: fileData.fileName || 'unknown.irm', fileType: 'IRM' };
};

// ─── EXTRACT IRVT DATA ─────────────────────────────────────────────
export const extractIRVTData = (fileData) => {
    const data = getActualData(fileData);
    const l1 = data.L?.L1 || {};
    const l2 = data.L?.L2 || {};
    const oSection = data.O || {};
    const mSection = data.M || {};

    const rows = [];
    rows.push({ isHeader: true, text: "VT CONFIGURATION - LINE 1" });
    rows.push({ type: 'data', label: 'VT Name', value: l1.VTName || '' });
    rows.push({ type: 'data', label: 'Class', value: l1.SelectedVTClass || '' });
    rows.push({ type: 'data', label: 'Primary (V)', value: l1.VTPrimary || 0 });
    rows.push({ type: 'data', label: 'Secondary (V)', value: l1.VTSecondary || 0 });
    rows.push({ type: 'data', label: 'Rated Power (VA)', value: l1.RatedPower || 0 });
    rows.push({ isSpacer: true });

    if (l2.L0 === 'Used') {
        rows.push({ isSubHeader: true, text: "VT CONFIGURATION - LINE 2 (USED)" });
        rows.push({ type: 'data', label: 'VT Name', value: l2.VTName || '' });
        rows.push({ type: 'data', label: 'Class', value: l2.SelectedVTClass || '' });
        rows.push({ type: 'data', label: 'Primary (V)', value: l2.VTPrimary || 0 });
        rows.push({ type: 'data', label: 'Secondary (V)', value: l2.VTSecondary || 0 });
        rows.push({ isSpacer: true });
    }

    const oKeys = ['O1', 'O2', 'O3', 'O4'];
    const activeOCircuits = oKeys.filter(key => oSection[key]?.SelectedCondition === 'Used');
    if (activeOCircuits.length > 0) {
        rows.push({ isHeader: true, text: "OUTGOING CIRCUITS" });
        activeOCircuits.forEach(key => {
            const o = oSection[key];
            rows.push({
                type: 'label_value',
                label: key,
                value: `${o.MBCName || ''} (${o.Length || 0}m, ${o.CrossSection || 0}mm², ${o.SelectedMaterial || ''})`,
                valueStyle: valueStyleNormal
            });
        });
        rows.push({ isSpacer: true });
    }

    const mKeys = ['M1', 'M2', 'M3', 'M4'];
    const activeMCircuits = mKeys.filter(key => mSection[key]?.SelectedCondition === 'Used');
    if (activeMCircuits.length > 0) {
        rows.push({ isHeader: true, text: "METER CIRCUITS" });
        activeMCircuits.forEach(key => {
            const m = mSection[key];
            rows.push({
                type: 'label_value',
                label: key,
                value: `${m.MBCName || ''} (${m.Length || 0}m, ${m.CrossSection || 0}mm², ${m.SelectedMaterial || ''})`,
                valueStyle: valueStyleNormal
            });
        });
        rows.push({ isSpacer: true });
    }

    return { rows, fileName: fileData.fileName || 'unknown.irvt', fileType: 'IRVT' };
};

// ─── COLLECT ALL DATA ──────────────────────────────────────────────
export const collectExcelData = (filesList) => {
    const excelData = {
        irct: [],
        irm: [],
        irvt: [],
        summary: {
            totalFiles: filesList.length,
            irctFiles: 0,
            irmFiles: 0,
            irvtFiles: 0,
            fileNames: []
        }
    };

    filesList.forEach((fileItem) => {
        // 🔥 FIX: Unwrap the Redux { mode, data } structure if it exists
        const fileData = fileItem.data ? fileItem.data : fileItem;
        const fileName = fileItem.fileName || fileData.fileName || 'unknown';

        const data = getActualData(fileData);

        if (data.FirstPage || data.SecondPage || data.ThirdPage || data.FourthPage || fileItem.mode === 'WorkSpace') {
            console.log('✅ Adding IRCT file:', fileName);
            excelData.irct.push(extractIRCTData(fileData));
            excelData.summary.irctFiles++;
        } else if (data.MeteringDevice || data.CurrentTransformer || data.Conductor || fileItem.mode === 'MeterCT') {
            console.log('✅ Adding IRM file:', fileName);
            excelData.irm.push(extractIRMData(fileData));
            excelData.summary.irmFiles++;
        } else if (data.L || data.O || data.M || fileItem.mode === 'VT') {
            console.log('✅ Adding IRVT file:', fileName);
            excelData.irvt.push(extractIRVTData(fileData));
            excelData.summary.irvtFiles++;
        } else if (fileData.Project) {
            console.log('⚠️ Adding as IRCT fallback:', fileName);
            const wrappedData = {
                ...fileData,
                ProjectData: {
                    FirstPage: {
                        Project: fileData.Project || '',
                        clientName: fileData.clientName || '',
                        consultantName: fileData.consultantName || '',
                        contractorName: fileData.contractorName || '',
                        DocumentNumber: fileData.DocumentNumber || '',
                        Revision: fileData.Revision || '',
                        Date: fileData.Date || ''
                    },
                    SecondPage: {},
                    ThirdPage: {},
                    FourthPage: {}
                }
            };
            excelData.irct.push(extractIRCTData(wrappedData));
            excelData.summary.irctFiles++;
        } else {
            console.warn('⚠️ Unknown file type, including as data dump:', fileName);
            const rows = [];
            rows.push({ isHeader: true, text: "FILE DATA DUMP" });
            Object.entries(fileData).forEach(([key, value]) => {
                if (key !== 'filePath' && key !== 'fileName' && key !== 'ProjectData' && key !== 'mode' && key !== 'data') {
                    const val = typeof value === 'object' ? JSON.stringify(value) : value;
                    if (val && val !== '{}') {
                        rows.push({ type: 'data', label: key, value: val || '' });
                    }
                }
            });
            if (fileData.ProjectData) {
                rows.push({ isSubHeader: true, text: "Project Data" });
                Object.entries(fileData.ProjectData).forEach(([key, value]) => {
                    const val = typeof value === 'object' ? JSON.stringify(value) : value;
                    if (val && val !== '{}') {
                        rows.push({ type: 'data', label: key, value: val || '' });
                    }
                });
            }
            excelData.irct.push({ rows, fileName, fileType: 'UNKNOWN' });
            excelData.summary.irctFiles++;
        }
        excelData.summary.fileNames.push(fileName);
    });

    console.log('Excel data summary:', {
        irct: excelData.irct.length,
        irm: excelData.irm.length,
        irvt: excelData.irvt.length,
        total: excelData.irct.length + excelData.irm.length + excelData.irvt.length
    });

    return { excelData, totalFiles: filesList.length };
};

// ─── EXCELJS WORKSHEET BUILDER ─────────────────────────────────────
export const buildStyledSheet = async (workbook, dataList, sheetName, title) => {
    const worksheet = workbook.addWorksheet(sheetName, {
        properties: { tabColor: { argb: 'FF6A1B9A' } },
        pageSetup: { orientation: 'landscape', fitToPage: true }
    });

    worksheet.columns = [
        { header: 'Parameter', key: 'label', width: 45 },
        { header: 'Value/Formula', key: 'value', width: 35 },
        { header: 'Status', key: 'status', width: 14 },
        { header: 'Unit', key: 'unit', width: 14 },
        { header: 'Remarks', key: 'remarks', width: 14 },
    ];

    if (!dataList || dataList.length === 0) {
        const row = worksheet.addRow([title, '', '', '', '']);
        row.height = 35;
        row.getCell(1).value = title;
        row.getCell(1).font = mainHeaderStyle.font;
        row.getCell(1).fill = mainHeaderStyle.fill;
        row.getCell(1).alignment = mainHeaderStyle.alignment;
        worksheet.mergeCells(1, 1, 1, 5);
        worksheet.addRow(['', '', '', '', '']);
        worksheet.addRow(['No data available for this section', '', '', '', '']);
        return worksheet;
    }

    let currentRow = 1;

    dataList.forEach((item, index) => {
        // File Separator
        const sepRow = worksheet.getRow(currentRow);
        sepRow.height = 35;
        sepRow.getCell(1).value = `File ${index + 1}: ${item.fileName}`;
        sepRow.getCell(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 14 };
        sepRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF8C00' } };
        sepRow.getCell(1).alignment = alignLeftCenter;
        worksheet.mergeCells(currentRow, 1, currentRow, 5);
        currentRow++;

        // Spacer
        worksheet.getRow(currentRow).height = 10;
        currentRow++;

        if (item.rows && item.rows.length > 0) {
            item.rows.forEach((rowData) => {
                const row = worksheet.getRow(currentRow);

                if (rowData.isHeader) {
                    row.height = 25;
                    row.getCell(1).value = rowData.text;
                    row.getCell(1).font = sectionHeader.font;
                    row.getCell(1).fill = sectionHeader.fill;
                    row.getCell(1).alignment = sectionHeader.alignment;
                    worksheet.mergeCells(currentRow, 1, currentRow, 5);
                } else if (rowData.isSubHeader) {
                    row.height = 20;
                    row.getCell(1).value = rowData.text;
                    row.getCell(1).font = subHeaderStyle.font;
                    row.getCell(1).alignment = subHeaderStyle.alignment;
                    worksheet.mergeCells(currentRow, 1, currentRow, 5);
                } else if (rowData.isSpacer) {
                    row.height = rowData.height || 10;
                } else if (rowData.isCategory) {
                    row.height = 22;
                    row.getCell(1).value = rowData.text;
                    row.getCell(1).font = categoryHeader.font;
                    row.getCell(1).fill = categoryHeader.fill;
                    row.getCell(1).alignment = categoryHeader.alignment;
                    worksheet.mergeCells(currentRow, 1, currentRow, 5);
                } else if (rowData.type === 'data') {
                    row.height = rowData.height || 22;
                    row.getCell(1).value = rowData.label;
                    row.getCell(1).font = labelStyle.font;
                    row.getCell(1).alignment = labelStyle.alignment;

                    let valFont = { ...valueStyle.font };
                    if (rowData.valueStyle === 'ok') valFont.color = { argb: 'FF008000' };
                    else if (rowData.valueStyle === 'notOk') valFont.color = { argb: 'FFFF0000' };
                    else if (rowData.valueStyle?.color) valFont.color = { argb: rowData.valueStyle.color };

                    row.getCell(2).value = rowData.value ?? 'NAN';
                    row.getCell(2).font = valFont;
                    row.getCell(2).alignment = { ...alignLeftCenter, wrapText: true };
                } else if (rowData.type === 'label_value') {
                    row.height = 20;
                    row.getCell(1).value = rowData.label;
                    row.getCell(1).font = labelStyle.font;
                    row.getCell(1).alignment = labelStyle.alignment;
                    row.getCell(2).value = rowData.value;
                    row.getCell(2).font = valueStyleNormal.font;
                    row.getCell(2).alignment = valueStyleNormal.alignment;
                } else if (rowData.isOKRow) {
                    row.height = 22;
                    row.getCell(1).value = rowData.label;
                    row.getCell(1).font = labelStyle.font;
                    row.getCell(1).alignment = labelStyle.alignment;
                    row.getCell(2).value = rowData.value;
                    row.getCell(2).font = rowData.pass ? okStyle.font : notOkStyle.font;
                    row.getCell(2).alignment = alignCenter;
                } else if (rowData.type === 'approval') {
                    // Row 1: Required
                    const r1 = worksheet.getRow(currentRow);
                    r1.height = 22;
                    r1.getCell(1).value = `Required ${rowData.metric} [${rowData.standard}]:`;
                    r1.getCell(1).font = labelStyle.font;
                    r1.getCell(1).alignment = labelStyle.alignment;
                    r1.getCell(2).value = round(rowData.required);
                    r1.getCell(2).font = valueStyle.font;
                    r1.getCell(2).alignment = valueStyle.alignment;
                    currentRow++;

                    // Row 2: Actual
                    const r2 = worksheet.getRow(currentRow);
                    r2.height = 22;
                    r2.getCell(1).value = `Actual ${rowData.metric}:`;
                    r2.getCell(1).font = labelStyle.font;
                    r2.getCell(1).alignment = labelStyle.alignment;
                    r2.getCell(2).value = round(rowData.actual);
                    r2.getCell(2).font = valueStyle.font;
                    r2.getCell(2).alignment = valueStyle.alignment;
                    currentRow++;

                    // Row 3: Result
                    const r3 = worksheet.getRow(currentRow);
                    r3.height = 22;
                    r3.getCell(1).value = `Result [${rowData.standard}]:`;
                    r3.getCell(1).font = labelStyle.font;
                    r3.getCell(1).alignment = labelStyle.alignment;
                    r3.getCell(2).value = rowData.pass ? "OK" : "NOT OK";
                    r3.getCell(2).font = rowData.pass ? okStyle.font : notOkStyle.font;
                    r3.getCell(2).alignment = alignCenter;
                } else if (rowData.type === 'approval_summary') {
                    row.height = 22;
                    const allPass = rowData.approvals?.every(a => a.pass) ?? false;
                    row.getCell(1).value = "Overall Result:";
                    row.getCell(1).font = labelStyle.font;
                    row.getCell(1).alignment = labelStyle.alignment;
                    row.getCell(2).value = allPass ? "OK" : "NOT OK";
                    row.getCell(2).font = allPass ? okStyle.font : notOkStyle.font;
                    row.getCell(2).alignment = alignCenter;
                } else {
                    if (rowData.label !== undefined || rowData.value !== undefined) {
                        row.getCell(1).value = rowData.label || '';
                        row.getCell(2).value = rowData.value || '';
                    }
                }

                // Apply borders to all cells in the row that have values
                row.eachCell({ includeEmpty: false }, (cell) => {
                    cell.border = {
                        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                    };
                });

                currentRow++;
            });
        }

        // Spacer after each file
        worksheet.getRow(currentRow).height = 10;
        currentRow++;
        worksheet.getRow(currentRow).height = 10;
        currentRow++;
    });

    return worksheet;
};

// ─── ASSEMBLE MASTER EXCEL ──────────────────────────────────────────
export const assembleMasterExcel = async (collectedData, systemInfo = {}) => {
    const ExcelJS = await getExcelJS();
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Knowledge Based Initiative';
    workbook.created = new Date();

    const { excelData } = collectedData;

    if (excelData.irct.length > 0) {
        await buildStyledSheet(workbook, excelData.irct, 'IRCT', 'IRCT Calculations');
    }

    if (excelData.irm.length > 0) {
        await buildStyledSheet(workbook, excelData.irm, 'IRM', 'IRM Calculations');
    }

    if (excelData.irvt.length > 0) {
        await buildStyledSheet(workbook, excelData.irvt, 'IRVT', 'IRVT Calculations');
    }

    // System Info Sheet
    const sysWs = workbook.addWorksheet('System Info', {
        properties: { tabColor: { argb: 'FF6A1B9A' } },
        pageSetup: { orientation: 'landscape', fitToPage: true }
    });
    sysWs.columns = [
        { header: 'Parameter', key: 'label', width: 45 },
        { header: 'Value', key: 'value', width: 35 },
        { header: 'Status', key: 'status', width: 14 },
        { header: 'Unit', key: 'unit', width: 14 },
        { header: 'Remarks', key: 'remarks', width: 14 },
    ];

    let sRow = 1;
    const addSysRow = (label, value) => {
        const row = sysWs.getRow(sRow);
        row.height = 22;
        row.getCell(1).value = label;
        row.getCell(1).font = labelStyle.font;
        row.getCell(1).alignment = labelStyle.alignment;
        row.getCell(2).value = value ?? 'NAN';
        row.getCell(2).font = valueStyleNormal.font;
        row.getCell(2).alignment = valueStyleNormal.alignment;
        sRow++;
    };

    const headerRow = sysWs.getRow(sRow);
    headerRow.height = 35;
    headerRow.getCell(1).value = "SYSTEM INFORMATION";
    headerRow.getCell(1).font = mainHeaderStyle.font;
    headerRow.getCell(1).fill = mainHeaderStyle.fill;
    headerRow.getCell(1).alignment = mainHeaderStyle.alignment;
    sysWs.mergeCells(sRow, 1, sRow, 5);
    sRow++; sRow++;

    addSysRow('Project', systemInfo.Project);
    addSysRow('Reference No', systemInfo.RefrenceNo);
    addSysRow('Revision', systemInfo.Revision);
    addSysRow('Remark A', systemInfo.RemarkA);
    addSysRow('Remark G', systemInfo.RemarkG);
    addSysRow('Date', systemInfo.Date);
    sRow++;
    addSysRow('Nominal Voltage (V)', systemInfo.NominalVoltage);
    addSysRow('System Frequency (Hz)', systemInfo.SystemFrequency);
    addSysRow('Rated SC Current (A)', systemInfo.RatedSCcurrent);
    addSysRow('Conductor Temperature (°C)', systemInfo.ConductorTemprature ?? 25);
    sRow++;
    addSysRow('Mode', systemInfo.Mode);
    addSysRow('Document Title', systemInfo.DoucumentTitle);
    addSysRow('Document Number', systemInfo.DocumentNumber);
    sRow++;
    addSysRow('Client Name', systemInfo.clientName);
    addSysRow('Consultant Name', systemInfo.consultantName);
    addSysRow('Contractor Name', systemInfo.contractorName);

    sysWs.eachRow({ includeEmpty: false }, (row) => {
        row.eachCell({ includeEmpty: true }, (cell) => {
            if (cell.value && cell.value !== '') {
                cell.border = { top: { style: 'thin', color: { argb: 'FFCCCCCC' } }, left: { style: 'thin', color: { argb: 'FFCCCCCC' } }, bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } }, right: { style: 'thin', color: { argb: 'FFCCCCCC' } } };
            }
        });
    });

    // Summary Sheet
    const sumWs = workbook.addWorksheet('Summary', {
        properties: { tabColor: { argb: 'FF6A1B9A' } },
        pageSetup: { orientation: 'landscape', fitToPage: true }
    });
    sumWs.columns = [
        { header: 'Parameter', key: 'label', width: 45 },
        { header: 'Value', key: 'value', width: 35 },
        { header: 'Status', key: 'status', width: 14 },
        { header: 'Unit', key: 'unit', width: 14 },
        { header: 'Remarks', key: 'remarks', width: 14 },
    ];

    let sumRow = 1;
    const addSumRow = (label, value, isBold = false, color = "FF000000") => {
        const row = sumWs.getRow(sumRow);
        row.height = 22;
        row.getCell(1).value = label;
        row.getCell(1).font = { bold: isBold, color: { argb: "FF000000" }, size: 12 };
        row.getCell(1).alignment = alignLeftCenter;
        row.getCell(2).value = value;
        row.getCell(2).font = { bold: isBold, color: { argb: color }, size: 12 };
        row.getCell(2).alignment = alignLeftCenter;
        sumRow++;
    };

    const sumHeaderRow = sumWs.getRow(sumRow);
    sumHeaderRow.height = 35;
    sumHeaderRow.getCell(1).value = "MASTER EXCEL SUMMARY";
    sumHeaderRow.getCell(1).font = mainHeaderStyle.font;
    sumHeaderRow.getCell(1).fill = mainHeaderStyle.fill;
    sumHeaderRow.getCell(1).alignment = mainHeaderStyle.alignment;
    sumWs.mergeCells(sumRow, 1, sumRow, 5);
    sumRow++; sumRow++;

    addSumRow('Generated on', new Date().toLocaleString());
    sumRow++;

    const statHeaderRow = sumWs.getRow(sumRow);
    statHeaderRow.height = 25;
    statHeaderRow.getCell(1).value = "File Statistics";
    statHeaderRow.getCell(1).font = sectionHeader.font;
    statHeaderRow.getCell(1).fill = sectionHeader.fill;
    statHeaderRow.getCell(1).alignment = sectionHeader.alignment;
    sumWs.mergeCells(sumRow, 1, sumRow, 5);
    sumRow++;

    addSumRow('IRCT Files', excelData.irct.length, true, "FF1976D2");
    addSumRow('IRM Files', excelData.irm.length, true, "FF1976D2");
    addSumRow('IRVT Files', excelData.irvt.length, true, "FF1976D2");
    addSumRow('Total Files', excelData.irct.length + excelData.irm.length + excelData.irvt.length, true, "FF1976D2");
    sumRow++;

    const filesHeaderRow = sumWs.getRow(sumRow);
    filesHeaderRow.height = 25;
    filesHeaderRow.getCell(1).value = "Files Included";
    filesHeaderRow.getCell(1).font = sectionHeader.font;
    filesHeaderRow.getCell(1).fill = sectionHeader.fill;
    filesHeaderRow.getCell(1).alignment = sectionHeader.alignment;
    sumWs.mergeCells(sumRow, 1, sumRow, 5);
    sumRow++;

    excelData.irct.forEach(f => addSumRow(f.fileName, 'IRCT'));
    excelData.irm.forEach(f => addSumRow(f.fileName, 'IRM'));
    excelData.irvt.forEach(f => addSumRow(f.fileName, 'IRVT'));

    sumWs.eachRow({ includeEmpty: false }, (row) => {
        row.eachCell({ includeEmpty: true }, (cell) => {
            if (cell.value && cell.value !== '') {
                cell.border = { top: { style: 'thin', color: { argb: 'FFCCCCCC' } }, left: { style: 'thin', color: { argb: 'FFCCCCCC' } }, bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } }, right: { style: 'thin', color: { argb: 'FFCCCCCC' } } };
            }
        });
    });

    const excelBuffer = await workbook.xlsx.writeBuffer();

    return {
        success: true,
        buffer: excelBuffer,
        fileName: `Master_Excel_${new Date().toISOString().slice(0, 10)}.xlsx`,
        totalFiles: excelData.irct.length + excelData.irm.length + excelData.irvt.length
    };
};

// ─── DOWNLOAD ──────────────────────────────────────────────────────
export const downloadExcelFile = async (assembledExcel) => {
    const isElectron = !!(window.electron && window.electron.dialog && window.electron.fs);

    if (isElectron) {
        const saveResult = await window.electron.dialog.showSaveDialog({
            title: 'Save Master Excel',
            defaultPath: assembledExcel.fileName || 'Master_Excel.xlsx',
            filters: [{ name: 'Excel Files', extensions: ['xlsx'] }]
        });

        if (!saveResult.canceled && saveResult.filePath) {
            const uint8Array = new Uint8Array(assembledExcel.buffer);
            await window.electron.fs.writeFile(saveResult.filePath, uint8Array);
            return true;
        }
        return false;
    } else {
        const blob = new Blob([assembledExcel.buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = assembledExcel.fileName || 'Master_Excel.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return true;
    }
};