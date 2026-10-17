import React, { useCallback, useState } from "react";
import * as XLSX from "xlsx-js-style";
import moment from "moment";
import { calculateProtectionResults } from "./IRCTCalculations/protectionCalculations";

/* ---------------------------------------------------------------
   Styles — same palette/approach as ExcelComponentMeterCT so the
   two reports look consistent with each other.
----------------------------------------------------------------*/
const alignLeftCenter = { horizontal: "left", vertical: "center" };
const alignLeftTop = { horizontal: "left", vertical: "top", wrapText: true };

const mainHeaderStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" }, sz: 16 },
    fill: { fgColor: { rgb: "6A1B9A" } },
    alignment: alignLeftCenter,
};

const sectionHeader = {
    font: { bold: true, color: { rgb: "FFFFFF" }, sz: 14 },
    fill: { fgColor: { rgb: "1976D2" } },
    alignment: alignLeftCenter,
};

const sectionSubHeader = {
    font: { bold: true, color: { rgb: "FFFFFF" }, sz: 14 },
    fill: { fgColor: { rgb: "483D8B" } },
    alignment: alignLeftCenter,
};

const labelStyle = {
    font: { bold: true, color: { rgb: "000000" }, sz: 13 },
    alignment: alignLeftCenter,
};

const valueStyle = {
    font: { bold: true, color: { rgb: "1976D2" }, sz: 13 },
    alignment: alignLeftCenter,
};

const okStyle = { font: { bold: true, color: { rgb: "008000" }, sz: 14 }, alignment: alignLeftCenter };
const notOkStyle = { font: { bold: true, color: { rgb: "FF0000" }, sz: 14 }, alignment: alignLeftCenter };

const round = (v, d = 3) => (typeof v === "number" && !isNaN(v) ? Number(v.toFixed(d)) : v ?? "NAN");

/* ---------------------------------------------------------------
   Worksheet builder — same aoa_data / merges / cellStyles /
   rowHeights approach as ExcelComponentMeterCT.exportToExcel,
   but driven generically by `results.sections` instead of a
   fixed set of hardcoded rows (since the relay-type-specific
   sections here vary per report, unlike the fixed CT report).
----------------------------------------------------------------*/
function buildWorksheetParts(results) {
    const ws_data = [];
    const merges = [];
    const cellStyles = [];
    const rowHeights = [];
    let r = 0;

    const addRow = (rowData, colStyles = [], heightOpt = null) => {
        ws_data.push(rowData);
        colStyles.forEach(({ c, s }) => cellStyles.push({ r, c, s }));
        if (heightOpt) rowHeights[r] = heightOpt;
        r++;
    };

    const addMerge = (s_r, s_c, e_r, e_c) => merges.push({ s: { r: s_r, c: s_c }, e: { r: e_r, c: e_c } });

    const addDataRow = (label, val) => {
        addRow([label, val], [{ c: 0, s: labelStyle }, { c: 1, s: valueStyle }]);
    };

    const addSectionHeader = (title, style = sectionHeader) => {
        addRow([title], [{ c: 0, s: style }], { hpt: 25 });
        addMerge(r - 1, 0, r - 1, 4);
    };

    // ---- Report header ----
    addRow(
        [`Protection Relay CT Calculation Report - ${moment().format("YYYY-MM-DD HH:mm")}`],
        [{ c: 0, s: mainHeaderStyle }],
        { hpt: 30 }
    );
    addMerge(r - 1, 0, r - 1, 4);
    addRow([]);

    // ---- Generic "info block" renderer for meta / relay / CT / conductor ----
    const infoBlock = (title, obj, style = sectionHeader) => {
        addSectionHeader(title, style);
        Object.entries(obj).forEach(([key, value]) => {
            const display = value === undefined || value === null || value === "" ? "NAN" : value;
            addDataRow(`${key}:`, display);
        });
        addRow([]);
    };

    infoBlock("Project Information", results.inputs.meta);
    infoBlock("Relay Information", results.inputs.relay);
    infoBlock("CT Information", results.inputs.ct, sectionSubHeader);
    infoBlock("Conductor Information", results.inputs.conductor, sectionSubHeader);

    // ---- Calculated sections (mirrors relay-type conditional blocks) ----
    results.sections.forEach((sectionData) => {
        if (!sectionData.visible) return;

        addSectionHeader(sectionData.title);

        sectionData.rows.forEach((row) => {
            const label = row.unit ? `${row.label} (${row.unit}):` : `${row.label}:`;
            addDataRow(label, round(row.value));
        });

        const approvals = Array.isArray(sectionData.approval)
            ? sectionData.approval
            : sectionData.approval
            ? [sectionData.approval]
            : [];

        approvals.forEach((approval) => {
            if (!approval) return;
            addDataRow(`Required ${approval.metric} [${approval.standard}]:`, round(approval.required));
            addDataRow(`Actual ${approval.metric}:`, round(approval.actual));
            addRow(
                [`Result [${approval.standard}]:`, approval.pass ? "OK" : "NOT OK"],
                [{ c: 0, s: labelStyle }, { c: 1, s: approval.pass ? okStyle : notOkStyle }],
                { hpt: 22 }
            );
        });

        addRow([]);
    });

    // ---- Overall summary row: PASS only if every approval passed ----
    const allApprovals = results.sections
        .filter((s) => s.visible)
        .flatMap((s) => (Array.isArray(s.approval) ? s.approval : s.approval ? [s.approval] : []))
        .filter(Boolean);

    if (allApprovals.length > 0) {
        const overallPass = allApprovals.every((a) => a.pass);
        addSectionHeader("Summary of Results");
        addRow(
            ["Overall Result:", overallPass ? "OK" : "NOT OK"],
            [{ c: 0, s: labelStyle }, { c: 1, s: overallPass ? okStyle : notOkStyle }],
            { hpt: 22 }
        );
    }

    return { ws_data, merges, cellStyles, rowHeights };
}

/**
 * Builds the xlsx-js-style workbook from a `calculateProtectionResults(...)`
 * output. Kept separate from the click handler so it can be unit tested
 * without touching React or the DOM.
 */
export function buildProtectionWorkbook(results) {
    const { ws_data, merges, cellStyles, rowHeights } = buildWorksheetParts(results);

    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    ws["!cols"] = [
        { wch: 45 }, // Col A - Labels
        { wch: 30 }, // Col B - Values
        { wch: 14 },
        { wch: 14 },
        { wch: 14 },
    ];

    ws["!merges"] = merges;
    ws["!rows"] = rowHeights;

    cellStyles.forEach(({ r, c, s }) => {
        const addr = XLSX.utils.encode_cell({ r, c });
        if (ws[addr]) ws[addr].s = s;
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Protection Report");
    return wb;
}

/**
 * ExcelComponent
 *
 * Drop-in companion for PdfComponent's "Export to PDF" button — same call
 * site as before:
 *   <ExcelComponent data={selectedData} OutPort={this.props.OutPort} />
 *
 * Uses xlsx-js-style (same library as ExcelComponentMeterCT) instead of
 * exceljs — synchronous XLSX.writeFile, no Buffer/stream polyfills needed,
 * so it behaves the same in the browser as your working CT report does.
 */
export default function ExcelComponent({ data, OutPort = false }) {
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState(null);

    const handleExport = useCallback(() => {
        setError(null);
        setIsExporting(true);
        try {
            const results = calculateProtectionResults(data, OutPort);
            const wb = buildProtectionWorkbook(results);
            const projectName = results.inputs.meta.Project;
            const fileName = `${projectName && projectName !== "NaN" ? projectName : "Protection_Report"}.xlsx`;
            XLSX.writeFile(wb, fileName);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error("Excel export failed:", err);
            setError("Failed to generate the Excel file. Check the console for details.");
        } finally {
            setIsExporting(false);
        }
    }, [data, OutPort]);

    return (
        <div className="excel-export-wrapper">
            <button
                className="btn btn-primary"
                onClick={handleExport}
                disabled={isExporting}
                style={{ background: "#1976d2", border: "none", padding: "10px 20px", fontSize: "16px", fontWeight: "bold" }}
            >
                {isExporting ? "Generating Excel..." : "Export to Excel"}
            </button>
            {error && <div style={{ color: "#FF0000", marginTop: 8, fontSize: 14 }}>{error}</div>}
        </div>
    );
}