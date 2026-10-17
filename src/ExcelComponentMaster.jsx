import React, { useCallback, useState } from "react";
import * as XLSX from "xlsx-js-style";
import { collectExcelData, assembleMasterExcel, downloadExcelFile } from "./services/excelService";

export default function ExcelComponentMaster({
    data,
    OutPort = false,
    AllFileData = [],
    workSpaceVitals = {},
    SelectedWorkSpacePath,
    CurrentWorkSpace
}) {
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState(null);

    const handleExport = useCallback(async () => {
        setError(null);
        setIsExporting(true);

        try {
            // 1. Parse file data (same as working component)
            const parsedFiles = AllFileData
                .map(item => {
                    try { return JSON.parse(item); } 
                    catch { return null; }
                })
                .filter(item => item !== null);

            // 2. Collect raw data (same)
            const collectedData = collectExcelData(parsedFiles);

            // 3. Build systemInfo object (same keys as working component)
            const systemInfo = {
                Project: CurrentWorkSpace?.Project || "",
                RefrenceNo: CurrentWorkSpace?.RefrenceNo || "",
                Revision: CurrentWorkSpace?.Revision || "",
                RemarkA: CurrentWorkSpace?.RemarkA || "",
                RemarkG: CurrentWorkSpace?.RemarkG || "",
                Date: CurrentWorkSpace?.Date || "",
                NominalVoltage: CurrentWorkSpace?.NominalVoltage || 0,
                SystemFrequency: CurrentWorkSpace?.SystemFrequency || 0,
                RatedSCcurrent: CurrentWorkSpace?.RatedSCcurrent || 0,
                ConductorTemprature: CurrentWorkSpace?.ConductorTemprature || 25,
                Mode: CurrentWorkSpace?.Mode || "",
                DoucumentTitle: CurrentWorkSpace?.DoucumentTitle || "",
                DocumentNumber: CurrentWorkSpace?.DocumentNumber || "",
                clientName: CurrentWorkSpace?.clientName || "",
                consultantName: CurrentWorkSpace?.consultantName || "",
                contractorName: CurrentWorkSpace?.contractorName || "",
            };

            // 4. Assemble the master Excel using the SAME function as the working component
            const assembledExcel = assembleMasterExcel(collectedData, systemInfo);

            // 5. Download using the SAME download function
            await downloadExcelFile(assembledExcel);

            setIsExporting(false);
        } catch (err) {
            console.error("Master Excel export failed:", err);
            setError("Failed to generate the Master Excel file. Check console for details.");
            setIsExporting(false);
        }
    }, [AllFileData, CurrentWorkSpace]);

    return (
        <div className="excel-export-wrapper">
            <button
                className="btn btn-primary"
                onClick={handleExport}
                disabled={isExporting}
                style={{ background: "#1976d2", border: "none", padding: "10px 20px", fontSize: "16px", fontWeight: "bold" }}
            >
                {isExporting ? "Generating Master Excel..." : "Export Master Excel"}
            </button>
            {error && <div style={{ color: "#FF0000", marginTop: 8, fontSize: 14 }}>{error}</div>}
        </div>
    );
}