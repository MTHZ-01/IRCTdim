import React, { Component } from "react";
import { connect } from "react-redux";
import * as XLSX from "xlsx-js-style";
import moment from "moment";

class ExcelComponentMeterCT extends Component {
    constructor(props) {
        super(props);
    }

    term(num, den) {
        if (num === 0 && den === 0) return 0;
        return den !== 0 ? num / (den ** 2) : 0;
    }

    exportToExcel = () => {
        const { MeteringDevice, Conductor, CurrentTransformer, AdditionalEquipment } =
            this.props.OutPort
                ? this.props.MeterCTInfo_OP
                : this.props.MeterCTInfo;

        /* ---------------------------------------------------------
           1) Extract all variables exactly identically to PDF
        ----------------------------------------------------------*/
        const F1 = MeteringDevice?.Manufacture || "N/A";
        const F2 = MeteringDevice?.DeviceName || "N/A";
        const F3 = parseFloat(MeteringDevice?.selectedIrn_A) || 0;
        const F4 = parseFloat(MeteringDevice?.BurdenPhase_VA) || 0;
        const F5 = parseFloat(MeteringDevice?.DeviceMaxCurrent) || 0;
        const F6 = parseFloat(MeteringDevice?.MaxFaultCurrent) || 0;
        const F7 = MeteringDevice?.standard || "N/A";

        const H1 = parseFloat(Conductor?.Length) || 0;
        const H2 = parseFloat(Conductor?.CrossSection) || 0;
        const H3 = Conductor?.Material || "Cu";

        const G1 = CurrentTransformer?.CTName || "N/A";
        const G2 = CurrentTransformer?.standard || "N/A";
        const G3 = CurrentTransformer?.selectedCTClass || "N/A";
        const G4 = parseFloat(CurrentTransformer?.CTPrimary) || 0;
        const G5 = parseFloat(CurrentTransformer?.CTSecondry) || 0;
        const G6 = parseFloat(CurrentTransformer?.SecurityFactor) || 0;
        const G7 = parseFloat(CurrentTransformer?.RatedBurden) || 0;
        const G8 = parseFloat(CurrentTransformer?.CTResistance) || 0;
        const G9 = CurrentTransformer?.SelectedExtendedBurdenRangeList || "N/A";

        const AE = AdditionalEquipment || [];
        const I = [0, 1, 2, 3, 4].map(i => ({
            name: AE[i]?.name || "Empty",
            current: parseFloat(AE[i]?.ratedCurrent) || 0,
            burden: parseFloat(AE[i]?.ratedBurden) || 0
        }));

        /* ---------------------------------------------------------
           2) Calculations (Y1–Y19)
        ----------------------------------------------------------*/
        const Y1 = H3 === "Cu" ? 0.0225 : 0.0376;
        const Y2 = Y1 * H1 / H2;
        const Y3 = G7 / (G5 ** 2);

        const Y4 =
            2 * Y2 +
            (F4 / (F3 ** 2)) +
            this.term(I[0].burden, I[0].current) +
            this.term(I[1].burden, I[1].current) +
            this.term(I[2].burden, I[2].current) +
            this.term(I[3].burden, I[3].current) +
            this.term(I[4].burden, I[4].current);

        const Y5 = Y4 * (G5 ** 2);
        const Y6 = G6 * (G8 + Y3) / (G8 + Y4);

        const Y7 = F5;
        const Y8 = F6 * 1000 * G5 / G4;
        const Y9 = 1.1 * Y6 * G5;

        const classStrict = ["0.1", "0.2", "1", "3", "5", "0.2S", "0.5S"];
        const classLoose = ["3", "5"];

        const Y11 = classStrict.includes(G3) ? "Active" : "Inactive";
        const Y12 = (Y5 >= 0.25 * G7 && Y5 <= G7) ? "ok" : "not ok";

        const Y13 = classLoose.includes(G3) ? "Active" : "Inactive";
        const Y14 = (Y5 >= 0.5 * G7 && Y5 <= G7) ? "ok" : "not ok";

        const Y15 = (G9 === "Yes" && G7 <= 15) ? "Active" : "Inactive";
        const Y16 = (Y5 >= 1 && Y5 <= G7) ? "ok" : "not ok";

        /* ---------------------------------------------------------
           3) Convert formulas
        ----------------------------------------------------------*/
        const f1 = `ρ(75°) = ${Y1.toFixed(4)} (ohm.mm2/m)`;
        const f2 = `R_L = (ρ L_c) / A_c = ${Y2.toFixed(4)} (ohm)`;
        const f3 = `P_rn / I_sn² = ${Y3.toFixed(4)} (ohm)`;
        const f4 = `R_act = 2R_L + Σ(P_n / I_sn²) = ${Y4.toFixed(4)} (ohm)`;
        const f5 = `P_act = R_act * I_sn² = ${Y5.toFixed(4)}`;
        const f6 = `FS * (R_ct + R_cn) / (R_ct + R_act) = ${Y6.toFixed(4)}`;
        const f7 = `I_d-max(sec.) ≥ min(I_f-max(sec.), I_fs-max(sec.))`;
        const f8 = `I_d-max(sec.) = ${Y7} (A)`;
        const f9 = `I_f-max(sec.) = I_f-max * (I_sn / I_pn) = ${Y8.toFixed(4)} (A)`;
        const f10 = `I_fs-max(sec.) = 1.1 * FS_act * I_sn = ${Y9.toFixed(4)} (A)`;
        const f11 = `0.25 P_cn ≤ P_act ≤ P_cn`;
        const f12 = `0.5 P_cn ≤ P_act ≤ P_cn`;
        const f13 = `1 ≤ P_act ≤ P_cn   (for P_cn ≤ 15 VA)`;

        const req1Text = `In order to protect the connected measuring equipment in case of fault currents the connected measuring instrument shall be able to withstand the total RMS value of the secondary current at the operating instrument security factor (FS').`;
        const req2Text = `Moreover, in order to assure the measuring accuracy, the total effective connected burden shall lie in the following range in relation to the rated output of the current transformer:\n▫ Measuring class 0.1, 0.2/0.2S, 0.5/0.5S, 1: 25% to 100% of the rated output\n▫ Measuring class 3 and 5: 50% to 100% of the rated output\n\nNote: In addition, For all measuring classes with extended burden range, the ratio error and phase displacement shall not exceed to limits for the range of secondary burden from 1 VA to rated burden. The maximum rated output is limited to 15 VA.`;
        const secFaultText = `In order to secure operation of device, the through fault current should be smaller than maximum permissible current of device:`;

        /* ---------------------------------------------------------
           4) Refined Neater Excel Styling (Larger, Left-Aligned, Black & Blue)
        ----------------------------------------------------------*/
        const alignLeftCenter = { horizontal: "left", vertical: "center" };
        const alignLeftTop = { horizontal: "left", vertical: "top", wrapText: true };

        const mainHeaderStyle = {
            font: { bold: true, color: { rgb: "FFFFFF" }, sz: 16 },
            fill: { fgColor: { rgb: "6A1B9A" } },
            alignment: alignLeftCenter
        };

        const sectionHeader = {
            font: { bold: true, color: { rgb: "FFFFFF" }, sz: 14 },
            fill: { fgColor: { rgb: "1976D2" } },
            alignment: alignLeftCenter
        };

        const sectionSubHeader = {
            font: { bold: true, color: { rgb: "FFFFFF" }, sz: 14 },
            fill: { fgColor: { rgb: "483D8B" } },
            alignment: alignLeftCenter
        };

        const sectionSubHeaderRed = {
            font: { bold: true, color: { rgb: "FFFFFF" }, sz: 14 },
            fill: { fgColor: { rgb: "CD5C5C" } },
            alignment: alignLeftCenter
        };

        const labelStyle = { 
            font: { bold: true, color: { rgb: "000000" }, sz: 13 }, 
            alignment: alignLeftCenter 
        };
        
        const valueStyle = { 
            font: { bold: true, color: { rgb: "1976D2" }, sz: 13 }, // Blue
            alignment: alignLeftCenter 
        };

        const reqTitleStyle = { font: { bold: true, sz: 13, color: { rgb: "000000" } }, alignment: alignLeftCenter };
        const wrapTextStyle = { alignment: alignLeftTop, font: { sz: 12, color: { rgb: "000000" } } };
        const formulaStyle = { font: { sz: 15, bold: true, color: { rgb: "1976D2" } }, alignment: alignLeftCenter };
        const subHeaderBlue = { font: { bold: true, color: { rgb: "1976D2" }, sz: 13 }, alignment: alignLeftCenter };

        const okStyle = { font: { bold: true, color: { rgb: "008000" }, sz: 14 }, alignment: alignLeftCenter };
        const notOkStyle = { font: { bold: true, color: { rgb: "FF0000" }, sz: 14 }, alignment: alignLeftCenter };

        /* ---------------------------------------------------------
           5) Build Worksheet Flow 
        ----------------------------------------------------------*/
        const ws_data = [];
        const merges = [];
        const cellStyles = [];
        const rowHeights = [];
        let r = 0;

        const addRow = (rowData, colStyles = [], heightOpt = null) => {
            ws_data.push(rowData);
            colStyles.forEach(({ c, s }) => { cellStyles.push({ r, c, s }); });
            if (heightOpt) rowHeights[r] = heightOpt;
            r++;
        };

        const addMerge = (s_r, s_c, e_r, e_c) => merges.push({ s: { r: s_r, c: s_c }, e: { r: e_r, c: e_c } });

        // Helper to add standard key-value rows
        const addDataRow = (label, val) => {
            addRow([label, val], [{ c: 0, s: labelStyle }, { c: 1, s: valueStyle }]);
        };

        // Header
        addRow([`Meter CT Calculation Report - ${moment().format("YYYY-MM-DD HH:mm")}`], [{ c: 0, s: mainHeaderStyle }], { hpt: 30 });
        addMerge(r - 1, 0, r - 1, 4);
        addRow([]);

        // Device Information
        addRow(["Device Information"], [{ c: 0, s: sectionHeader }], { hpt: 25 }); addMerge(r - 1, 0, r - 1, 4);
        addDataRow("Metering Device:", F1);
        addDataRow("Device Name:", F2);
        addDataRow("Irn (A):", F3);
        addDataRow("Burden Phase-Prn (VA):", F4);
        addDataRow("Device max. current, Id-max (A):", F5);
        addDataRow("Max. fault current, If-max (kA):", F6);
        addDataRow("Standard:", F7);
        addRow([]);

        // Conductor Information
        addRow(["Conductor Information"], [{ c: 0, s: sectionSubHeader }], { hpt: 25 }); addMerge(r - 1, 0, r - 1, 4);
        addRow([`Selected material: ${H3}`], [{ c: 0, s: subHeaderBlue }]); addMerge(r - 1, 0, r - 1, 4);
        addDataRow("Length (m):", H1);
        addDataRow("Cross section-Ac (mm²):", H2);
        addRow([]);

        // CT Information
        addRow(["CT Information"], [{ c: 0, s: sectionSubHeaderRed }], { hpt: 25 }); addMerge(r - 1, 0, r - 1, 4);
        addDataRow("CT name:", G1);
        addDataRow("CT Standard:", G2);
        addDataRow("CT Class:", G3);
        addDataRow("Primary current, Ipn (A):", G4);
        addDataRow("Secondary current, Isn (A):", G5);
        addDataRow("Security Factor, FS:", G6);
        addDataRow("Rated Burden, Pcn (VA):", G7);
        addDataRow("CT Resistance @ 75°C, Rct (ohm):", G8);
        addDataRow("Extended Burden Range:", G9);
        addRow([]);

        // Additional Equipment
        addRow(["Additional Equipment"], [{ c: 0, s: sectionHeader }], { hpt: 25 }); addMerge(r - 1, 0, r - 1, 4);
        I.forEach((eq) => addDataRow(`${eq.name}:`, `Rated Current: ${eq.current} A, Rated Burden: ${eq.burden} VA`));
        addRow([]);

        // Calculation Note Based on IEC61869-2 Standard
        addRow(["Calculation Note Based on IEC61869-2 Standard:"], [{ c: 0, s: sectionHeader }], { hpt: 25 }); addMerge(r - 1, 0, r - 1, 4);
        addRow(["Requirement 1:"], [{ c: 0, s: reqTitleStyle }]);
        addRow([req1Text], [{ c: 0, s: wrapTextStyle }], { hpt: 55 }); addMerge(r - 1, 0, r - 1, 4);
        addRow(["Requirement 2:"], [{ c: 0, s: reqTitleStyle }]);
        addRow([req2Text], [{ c: 0, s: wrapTextStyle }], { hpt: 135 }); addMerge(r - 1, 0, r - 1, 4);
        addRow([]);

        // Wire resistance
        addRow(["Wire resistance (75°):"], [{ c: 0, s: sectionHeader }], { hpt: 25 }); addMerge(r - 1, 0, r - 1, 4);
        addRow([f1], [{ c: 0, s: formulaStyle }], { hpt: 22 }); addMerge(r - 1, 0, r - 1, 4);
        addRow([f2], [{ c: 0, s: formulaStyle }], { hpt: 22 }); addMerge(r - 1, 0, r - 1, 4);
        addRow([]);

        // Rated burden
        addRow(["Rated burden:"], [{ c: 0, s: sectionHeader }], { hpt: 25 }); addMerge(r - 1, 0, r - 1, 4);
        addRow([f3], [{ c: 0, s: formulaStyle }], { hpt: 22 }); addMerge(r - 1, 0, r - 1, 4);
        addRow([]);

        // Actual Burden
        addRow(["Actual Burden:"], [{ c: 0, s: sectionHeader }], { hpt: 25 }); addMerge(r - 1, 0, r - 1, 4);
        addRow([f4], [{ c: 0, s: formulaStyle }], { hpt: 22 }); addMerge(r - 1, 0, r - 1, 4);
        addRow([f5], [{ c: 0, s: formulaStyle }], { hpt: 22 }); addMerge(r - 1, 0, r - 1, 4);
        addRow([]);

        // Actual Security Factor
        addRow(["Actual Security Factor:"], [{ c: 0, s: sectionHeader }], { hpt: 25 }); addMerge(r - 1, 0, r - 1, 4);
        addRow(["Extended Burden Range:", f6], [{ c: 0, s: labelStyle }, { c: 1, s: formulaStyle }], { hpt: 22 }); addMerge(r - 1, 1, r - 1, 4);
        addRow([]);

        // Requirement 1: Security
        addRow(["Requirement 1: Security"], [{ c: 0, s: sectionHeader }], { hpt: 25 }); addMerge(r - 1, 0, r - 1, 4);
        addRow(["Requirement 1:"], [{ c: 0, s: reqTitleStyle }]);
        addRow([secFaultText], [{ c: 0, s: wrapTextStyle }], { hpt: 35 }); addMerge(r - 1, 0, r - 1, 4);
        
        addRow([f7], [{ c: 0, s: formulaStyle }], { hpt: 22 }); addMerge(r - 1, 0, r - 1, 4);

        addRow(["Maximum permisible current in secondary side:"], [{ c: 0, s: subHeaderBlue }], { hpt: 20 }); addMerge(r - 1, 0, r - 1, 4);
        addRow([f8], [{ c: 0, s: formulaStyle }], { hpt: 22 }); addMerge(r - 1, 0, r - 1, 4);

        addRow(["Maximum fault current in secondary side:"], [{ c: 0, s: subHeaderBlue }], { hpt: 20 }); addMerge(r - 1, 0, r - 1, 4);
        addRow([f9], [{ c: 0, s: formulaStyle }], { hpt: 22 }); addMerge(r - 1, 0, r - 1, 4);

        addRow(["Maximum fault current in secondary side considering CT saturation:"], [{ c: 0, s: subHeaderBlue }], { hpt: 20 }); addMerge(r - 1, 0, r - 1, 4);
        addRow([f10], [{ c: 0, s: formulaStyle }], { hpt: 22 }); addMerge(r - 1, 0, r - 1, 4);
        
        const secOk = (F5 > Math.min(Y8, Y9) && Y7 >= Math.min(Y8, Y9));
        addRow(["Result for Security:", secOk ? "OK" : "NOT OK"], [{ c: 0, s: labelStyle }, { c: 1, s: secOk ? okStyle : notOkStyle }], { hpt: 22 });
        addRow([]);

        // Conditions Section
        if (Y15 === 'Active') {
            addRow(["Condition 3: CT with extended burden range"], [{ c: 0, s: subHeaderBlue }], { hpt: 22 }); addMerge(r - 1, 0, r - 1, 4);
            addDataRow("Status 3 (Active, Inactive):", Y15);
            addRow([f13], [{ c: 0, s: formulaStyle }], { hpt: 22 }); addMerge(r - 1, 0, r - 1, 4);
            addRow(["Result 3:", Y16], [{ c: 0, s: labelStyle }, { c: 1, s: Y16 === "ok" ? okStyle : notOkStyle }]);
        } else if (Y11 === 'Active') {
            addRow(["Condition 1: CT class=0.1, 0.2, 0.2s, 0.5, 0.5s, 1"], [{ c: 0, s: subHeaderBlue }], { hpt: 22 }); addMerge(r - 1, 0, r - 1, 4);
            addDataRow("Status 1 (Active, Inactive):", Y11);
            addRow([f11], [{ c: 0, s: formulaStyle }], { hpt: 22 }); addMerge(r - 1, 0, r - 1, 4);
            addRow(["Result 1:", Y12], [{ c: 0, s: labelStyle }, { c: 1, s: Y12 === "ok" ? okStyle : notOkStyle }]);
        } else if (Y13 === 'Active') {
            addRow(["Condition 2: CT class=3, 5"], [{ c: 0, s: subHeaderBlue }], { hpt: 22 }); addMerge(r - 1, 0, r - 1, 4);
            addDataRow("Status 2 (Active, Inactive):", Y13);
            addRow([f12], [{ c: 0, s: formulaStyle }], { hpt: 22 }); addMerge(r - 1, 0, r - 1, 4);
            addRow(["Result 2:", Y14], [{ c: 0, s: labelStyle }, { c: 1, s: Y14 === "ok" ? okStyle : notOkStyle }]);
        }
        addRow([]);

        // Summary of Results
        addRow(["Summary of Results"], [{ c: 0, s: sectionHeader }], { hpt: 25 }); addMerge(r - 1, 0, r - 1, 4);
        addRow(["Result for Security:", secOk ? "OK" : "NOT OK"], [{ c: 0, s: labelStyle }, { c: 1, s: secOk ? okStyle : notOkStyle }], { hpt: 22 });
        
        const accOk = ((Y11 === 'Active' && Y12 === 'ok') || (Y13 === 'Active' && Y14 === "ok") || (Y15 === 'Active' && Y16 === 'ok'));
        addRow(["Result for Accuracy:", accOk ? "OK" : "NOT OK"], [{ c: 0, s: labelStyle }, { c: 1, s: accOk ? okStyle : notOkStyle }], { hpt: 22 });


        /* ---------------------------------------------------------
           6) Apply Excel formatting & export
        ----------------------------------------------------------*/
        const ws = XLSX.utils.aoa_to_sheet(ws_data);

        // Moderated Column Widths for neater fit
        ws["!cols"] = [
            { wch: 40 }, // Col A - Labels
            { wch: 55 }, // Col B - Values / Formulas
            { wch: 10 },
            { wch: 10 },
            { wch: 10 }
        ];

        ws["!merges"] = merges;
        ws["!rows"] = rowHeights;

        // Apply specific styles
        cellStyles.forEach(({ r, c, s }) => {
            const addr = XLSX.utils.encode_cell({ r, c });
            if (ws[addr]) ws[addr].s = s;
        });

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "CT Calculation Report");
        XLSX.writeFile(wb, "Meter_CT_Report.xlsx");
    };

    render() {
        return (
            <button
                className="btn btn-primary"
                onClick={this.exportToExcel}
                style={{ background: "#1976d2", border: "none", padding: "10px 20px", fontSize: "16px", fontWeight: "bold" }}
            >
                Export CT Excel Report
            </button>
        );
    }
}

const mapStateToProps = (state) => ({
    MeterCTInfo: state.example.MeterCTInfo,
    MeterCTInfo_OP: state.example.MeterCTInfo_OP,
    OutPort: state.example.OutPort
});

export default connect(mapStateToProps)(ExcelComponentMeterCT);
