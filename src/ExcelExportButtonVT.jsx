import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import XLSX from 'xlsx-js-style';
import BoltIcon from '@mui/icons-material/Bolt';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import InfoIcon from '@mui/icons-material/Info';

export class ExcelExportButtonVT extends Component {
    constructor(props) {
        super(props);
    }

    // Centralized calculations — EXACT replica of your provided logic
    getCalculations = () => {
        let L1, L2, O, M, L0, S;

        // Determine which props to use (OutPort or not)
        if (this.props.OutPort) {
            L1 = this.props.VT_OP.L.L1;
            L2 = this.props.VT_OP.L.L2;
            O = this.props.VT_OP.O;
            M = this.props.VT_OP.M;
            L0 = L2.L0;
            S = this.props.VT_OP.S || {};
        } else {
            L1 = this.props.VT.L.L1;
            L2 = this.props.VT.L.L2;
            O = this.props.VT.O;
            M = this.props.VT.M;
            L0 = L2.L0;
            S = this.props.VT.S || {};
        }

        // L1 parameters
        const L1_1 = L1.VTName;
        const L1_2 = L1.Standard;
        const L1_3 = L1.SelectedVTClass;
        const L1_4 = L1.VTPrimary;
        const L1_5 = L1.VTSecondary;
        const L1_6 = L1.RatedPower;
        const L1_7 = L1.SelectedValidVoltageDrop;

        // L2 parameters
        const L2_1 = L2.VTName;
        const L2_2 = L2.Standard;
        const L2_3 = L2.SelectedVTClass;
        const L2_4 = L2.VTPrimary;
        const L2_5 = L2.VTSecondary;
        const L2_6 = L2.RatedPower;
        const L2_7 = L2.SelectedValidVoltageDrop;

        // O parameters
        const O1_1 = O.O1.SelectedCondition;
        const O1_2 = O.O1.MBCName;
        const O1_3 = parseFloat(O.O1.Length);
        const O1_4 = parseFloat(O.O1.CrossSection);
        const O1_5 = O.O1.SelectedMaterial;
        const O1_6 = O.O1.ConnectedDevice;
        const O1_7 = O.O1.TotalConnectedBurden;

        const O2_1 = O.O2.SelectedCondition;
        const O2_2 = O.O2.MBCName;
        const O2_3 = parseFloat(O.O2.Length);
        const O2_4 = parseFloat(O.O2.CrossSection);
        const O2_5 = O.O2.SelectedMaterial;
        const O2_6 = O.O2.ConnectedDevice;
        const O2_7 = O.O2.TotalConnectedBurden;

        const O3_1 = O.O3.SelectedCondition;
        const O3_2 = O.O3.MBCName;
        const O3_3 = parseFloat(O.O3.Length);
        const O3_4 = parseFloat(O.O3.CrossSection);
        const O3_5 = O.O3.SelectedMaterial;
        const O3_6 = O.O3.ConnectedDevice;
        const O3_7 = O.O3.TotalConnectedBurden;

        const O4_1 = O.O4.SelectedCondition;
        const O4_2 = O.O4.MBCName;
        const O4_3 = parseFloat(O.O4.Length);
        const O4_4 = parseFloat(O.O4.CrossSection);
        const O4_5 = O.O4.SelectedMaterial;
        const O4_6 = O.O4.ConnectedDevice;
        const O4_7 = O.O4.TotalConnectedBurden;

        // M parameters
        const M1_1 = M.M1.SelectedCondition;
        const M1_2 = M.M1.MBCName;
        const M1_3 = parseFloat(M.M1.Length);
        const M1_4 = parseFloat(M.M1.CrossSection);
        const M1_5 = M.M1.SelectedMaterial;
        const M1_6 = M.M1.ConnectedDevice;
        const M1_7 = M.M1.TotalConnectedBurden;

        const M2_1 = M.M2.SelectedCondition;
        const M2_2 = M.M2.MBCName;
        const M2_3 = parseFloat(M.M2.Length);
        const M2_4 = parseFloat(M.M2.CrossSection);
        const M2_5 = M.M2.SelectedMaterial;
        const M2_6 = M.M2.ConnectedDevice;
        const M2_7 = M.M2.TotalConnectedBurden;

        const M3_1 = M.M3.SelectedCondition;
        const M3_2 = M.M3.MBCName;
        const M3_3 = parseFloat(M.M3.Length);
        const M3_4 = parseFloat(M.M3.CrossSection);
        const M3_5 = M.M3.SelectedMaterial;
        const M3_6 = M.M3.ConnectedDevice;
        const M3_7 = M.M3.TotalConnectedBurden;

        const M4_1 = M.M4.SelectedCondition;
        const M4_2 = M.M4.MBCName;
        const M4_3 = parseFloat(M.M4.Length);
        const M4_4 = parseFloat(M.M4.CrossSection);
        const M4_5 = M.M4.SelectedMaterial;
        const M4_6 = M.M4.ConnectedDevice;
        const M4_7 = M.M4.TotalConnectedBurden;

        // Burden sums
        const W41 = O1_7 * (O1_1 === "Used" ? 1 : 0);
        const W42 = O2_7 * (O2_1 === "Used" ? 1 : 0);
        const W43 = O3_7 * (O3_1 === "Used" ? 1 : 0);
        const W44 = O4_7 * (O4_1 === "Used" ? 1 : 0);
        const W45 = M1_7 * (M1_1 === "Used" ? 1 : 0);
        const W46 = M2_7 * (M2_1 === "Used" ? 1 : 0);
        const W47 = M3_7 * (M3_1 === "Used" ? 1 : 0);
        const W48 = M4_7 * (M4_1 === "Used" ? 1 : 0);

        // Resistivity & Resistance
        const W1 = (O1_5 === "Cu") ? 0.0225 : 0.0376;
        const W9 = parseFloat((W1 * O1_3 / O1_4).toFixed(3));

        const W2 = (O2_5 === "Cu") ? 0.0225 : 0.0376;
        const W10 = parseFloat((W2 * O2_3 / O2_4).toFixed(3));

        const W3 = (O3_5 === "Cu") ? 0.0225 : 0.0376;
        const W11 = parseFloat((W3 * O3_3 / O3_4).toFixed(3));

        const W4 = (O4_5 === "Cu") ? 0.0225 : 0.0376;
        const W12 = parseFloat((W4 * O4_3 / O4_4).toFixed(3));

        const W5 = (M1_5 === "Cu") ? 0.0225 : 0.0376;
        const W13 = parseFloat((W5 * M1_3 / M1_4).toFixed(3));

        const W6 = (M2_5 === "Cu") ? 0.0225 : 0.0376;
        const W14 = parseFloat((W6 * M2_3 / M2_4).toFixed(3));

        const W7 = (M3_5 === "Cu") ? 0.0225 : 0.0376;
        const W15 = parseFloat((W7 * M3_3 / M3_4).toFixed(3));

        const W8 = (M4_5 === "Cu") ? 0.0225 : 0.0376;
        const W16 = parseFloat((W8 * M4_3 / M4_4).toFixed(3));

        // Wire resistance table data
        const tableData = [];
        if (O1_1 === "Used") tableData.push({ connection: 'Win1-1', resistivity: W1, resistance: W9 });
        if (O2_1 === "Used") tableData.push({ connection: 'Win1-2', resistivity: W2, resistance: W10 });
        if (O3_1 === "Used") tableData.push({ connection: 'Win1-3', resistivity: W3, resistance: W11 });
        if (O4_1 === "Used") tableData.push({ connection: 'Win1-4', resistivity: W4, resistance: W12 });
        if (M1_1 === "Used") tableData.push({ connection: 'Win2-1', resistivity: W5, resistance: W13 });
        if (M2_1 === "Used") tableData.push({ connection: 'Win2-2', resistivity: W6, resistance: W14 });
        if (M3_1 === "Used") tableData.push({ connection: 'Win2-3', resistivity: W7, resistance: W15 });
        if (M4_1 === "Used") tableData.push({ connection: 'Win2-4', resistivity: W8, resistance: W16 });

        // Current calculations
        const W17 = parseFloat(((Math.sqrt(3) * O1_7) / L1_5).toFixed(3));
        const W18 = parseFloat(((Math.sqrt(3) * O2_7) / L1_5).toFixed(3));
        const W19 = parseFloat(((Math.sqrt(3) * O3_7) / L1_5).toFixed(3));
        const W20 = parseFloat(((Math.sqrt(3) * O4_7) / L1_5).toFixed(3));
        const W21 = parseFloat(((Math.sqrt(3) * M1_7) / L2_5).toFixed(3));
        const W22 = parseFloat(((Math.sqrt(3) * M2_7) / L2_5).toFixed(3));
        const W23 = parseFloat(((Math.sqrt(3) * M3_7) / L2_5).toFixed(3));
        const W24 = parseFloat(((Math.sqrt(3) * M4_7) / L2_5).toFixed(3));

        const CurrenttableData = [];
        if (O1_1 === "Used") CurrenttableData.push({ connection: 'Win1-1', current: W17 });
        if (O2_1 === "Used") CurrenttableData.push({ connection: 'Win1-2', current: W18 });
        if (O3_1 === "Used") CurrenttableData.push({ connection: 'Win1-3', current: W19 });
        if (O4_1 === "Used") CurrenttableData.push({ connection: 'Win1-4', current: W20 });
        if (M1_1 === "Used") CurrenttableData.push({ connection: 'Win2-1', current: W21 });
        if (M2_1 === "Used") CurrenttableData.push({ connection: 'Win2-2', current: W22 });
        if (M3_1 === "Used") CurrenttableData.push({ connection: 'Win2-3', current: W23 });
        if (M4_1 === "Used") CurrenttableData.push({ connection: 'Win2-4', current: W24 });

        // Voltage drop calculations
        const W25 = parseFloat(((Math.sqrt(3) * W9 * W17 * 100) / L1_5).toFixed(3));
        const W33 = (W25 <= L1_7) ? "Ok" : "Not Ok";

        const W26 = parseFloat(((Math.sqrt(3) * W10 * W18 * 100) / L1_5).toFixed(3));
        const W34 = (W26 <= L1_7) ? "Ok" : "Not Ok";

        const W27 = parseFloat(((Math.sqrt(3) * W11 * W19 * 100) / L1_5).toFixed(3));
        const W35 = (W27 <= L1_7) ? "Ok" : "Not Ok";

        const W28 = parseFloat(((Math.sqrt(3) * W12 * W20 * 100) / L1_5).toFixed(3));
        const W36 = (W28 <= L1_7) ? "Ok" : "Not Ok";

        const W29 = parseFloat(((Math.sqrt(3) * W13 * W21 * 100) / L2_5).toFixed(3));
        const W37 = (W29 <= L2_7) ? "Ok" : "Not Ok";

        const W30 = parseFloat(((Math.sqrt(3) * W14 * W22 * 100) / L2_5).toFixed(3));
        const W38 = (W30 <= L2_7) ? "Ok" : "Not Ok";

        const W31 = parseFloat(((Math.sqrt(3) * W15 * W23 * 100) / L2_5).toFixed(3));
        const W39 = (W31 <= L2_7) ? "Ok" : "Not Ok";

        const W32 = parseFloat(((Math.sqrt(3) * W16 * W24 * 100) / L2_5).toFixed(3));
        const W40 = (W32 <= L2_7) ? "Ok" : "Not Ok";

        const VoltDroptableData = [];
        if (O1_1 === "Used") VoltDroptableData.push({ connection: 'Win1-1', delt: W25, condition: W33 });
        if (O2_1 === "Used") VoltDroptableData.push({ connection: 'Win1-2', delt: W26, condition: W34 });
        if (O3_1 === "Used") VoltDroptableData.push({ connection: 'Win1-3', delt: W27, condition: W35 });
        if (O4_1 === "Used") VoltDroptableData.push({ connection: 'Win1-4', delt: W28, condition: W36 });
        if (M1_1 === "Used") VoltDroptableData.push({ connection: 'Win2-1', delt: W29, condition: W37 });
        if (M2_1 === "Used") VoltDroptableData.push({ connection: 'Win2-2', delt: W30, condition: W38 });
        if (M3_1 === "Used") VoltDroptableData.push({ connection: 'Win2-3', delt: W31, condition: W39 });
        if (M4_1 === "Used") VoltDroptableData.push({ connection: 'Win2-4', delt: W32, condition: W40 });

        // Burden formulas
        const Burden_Formula = `\\begin{cases} 
        0 \\leq \\text{Actual Burden} \\leq S_r & S_r \\leq 10(\\text{VA}) \\\\
        0.25 S_r \\leq \\text{Actual Burden} \\leq S_r & S_r \\geq 10(\\text{VA})
        \\end{cases}`;

        const W49 = W41 + W42 + W43 + W44;
        const W50 = (
            (L1_6 <= 10 && W49 >= 0 && W49 <= L1_6) ||
            (L1_6 > 10 && W49 >= 0.25 * L1_6 && W49 <= L1_6)
        ) ? "Ok" : "Not Ok";

        const W51 = W45 + W46 + W47 + W48;
        const W52 = (
            (L2_6 <= 10 && W51 >= 0 && W51 <= L2_6) ||
            (L2_6 > 10 && W51 >= 0.25 * L2_6 && W51 <= L2_6)
        ) ? "Ok" : "Not Ok";

        const W53 = ((W33 === "Ok" && W34 === "Ok" && W35 === "Ok" && W36 === "Ok") ? "Ok" : "Not Ok");
        const W54 = W50;
        const W55 = ((W37 === "Ok" && W38 === "Ok" && W39 === "Ok" && W40 === "Ok") ? "Ok" : "Not Ok");
        const W56 = W52;

        const RL_Formula = `\\mathbf{R_L = \\frac{\\rho L_c}{A_c}}`;
        const CurrentFlowFormula = `\\mathbf{I = \\frac{S_n}{V_{rs}}}`;
        const DeltaV_Formula = `\\Delta V \\left(\\%\\right) = \\frac{\\sqrt{3} R_L I * 100}{V_{rs}}`;
        const condition = (W54 === "Not Ok") || (W56 === "Not Ok" && L0 === "Used");

        // S parameters (Project info)
        const S_ProjectName = S.ProjectName || "";
        const S_Client = S.Client || "";
        const S_ProjectID = S.ProjectID || "";
        const S_Engineer = S.Engineer || "";

        // M.Number_of_secondary_windings
        const M_Number_of_secondary_windings = M.Number_of_secondary_windings || 1;

        return {
            L0,
            L1_1, L1_2, L1_3, L1_4, L1_5, L1_6, L1_7,
            L2_1, L2_2, L2_3, L2_4, L2_5, L2_6, L2_7,
            O1_1, O1_2, O1_3, O1_4, O1_5, O1_6, W41, O1_7,
            O2_1, O2_2, O2_3, O2_4, O2_5, O2_6, W42, O2_7,
            O3_1, O3_2, O3_3, O3_4, O3_5, O3_6, W43, O3_7,
            O4_1, O4_2, O4_3, O4_4, O4_5, O4_6, W44, O4_7,
            M1_1, M1_2, M1_3, M1_4, M1_5, M1_6, W45, M1_7,
            M2_1, M2_2, M2_3, M2_4, M2_5, M2_6, W46, M2_7,
            M3_1, M3_2, M3_3, M3_4, M3_5, M3_6, W47, M3_7,
            M4_1, M4_2, M4_3, M4_4, M4_5, M4_6, W48, M4_7,
            W49, W50, W51, W52, W53, W54, W55, W56,
            tableData, CurrenttableData, VoltDroptableData,
            Burden_Formula, RL_Formula, CurrentFlowFormula, DeltaV_Formula, condition,
            S_ProjectName, S_Client, S_ProjectID, S_Engineer,
            M_Number_of_secondary_windings
        };
    };

    exportToExcel = () => {
        const calc = this.getCalculations();

        // 1. Dynamic Row Builders & Trackers
        const ws_data = [];
        const merges = [];
        const cellStyles = [];
        let r = 0; // Current row index

        // Helper to push a row into the sheet and record styles specific to its columns
        const addRow = (rowData, colStyles = []) => {
            ws_data.push(rowData);
            colStyles.forEach(({ c, s }) => {
                cellStyles.push({ r, c, s });
            });
            r++;
        };

        const addMerge = (s_r, s_c, e_r, e_c) => {
            merges.push({ s: { r: s_r, c: s_c }, e: { r: e_r, c: e_c } });
        };

        // 2. Style Definitions
        const mainHeaderStyle = { font: { name: 'Calibri', sz: 14, bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "4472C4" } }, alignment: { horizontal: "left", vertical: "center" } };
        const subHeaderStyle  = { font: { name: 'Calibri', sz: 12, bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "5A86D3" } }, alignment: { horizontal: "left", vertical: "center" } };
        const tableHeaderStyle = { font: { bold: true }, fill: { fgColor: { rgb: "DDEBF7" } }, alignment: { horizontal: "center" } };
        const boldStyle = { font: { bold: true } };
        const centerStyle = { alignment: { horizontal: "center" } };
        const okStyle = { font: { bold: true, color: { rgb: "008000" } } };
        const notOkStyle = { font: { bold: true, color: { rgb: "FF0000" } } };

        // =======================================================
        // 3. START BUILDING SHEET TOP-TO-BOTTOM
        // =======================================================

        // --- Project Info ---
        addRow(["Project Name:", calc.S_ProjectName, "", "Client:", calc.S_Client], [{ c: 0, s: boldStyle }, { c: 3, s: boldStyle }]);
        addRow(["Project ID:", calc.S_ProjectID, "", "Engineer:", calc.S_Engineer], [{ c: 0, s: boldStyle }, { c: 3, s: boldStyle }]);
        addRow(["Date:", new Date().toLocaleDateString()], [{ c: 0, s: boldStyle }]);
        addRow([]);

        // --- Report Header ---
        addRow(["VT Calculation Report"], [{ c: 0, s: mainHeaderStyle }]);
        addMerge(r - 1, 0, r - 1, 4);
        addRow([]);

        // --- Winding 1 Input Data ---
        addRow(["Winding 1 Input Data"], [{ c: 0, s: mainHeaderStyle }]);
        addMerge(r - 1, 0, r - 1, 4);
        addRow(["VT Name", calc.L1_1], [{ c: 0, s: boldStyle }]);
        addRow(["Standard", calc.L1_2], [{ c: 0, s: boldStyle }]);
        addRow(["Accuracy Class", calc.L1_3], [{ c: 0, s: boldStyle }]);
        addRow(["Rated primary voltage (V)", calc.L1_4], [{ c: 0, s: boldStyle }]);
        addRow(["Rated secondary voltage (V)", calc.L1_5], [{ c: 0, s: boldStyle }]);
        addRow(["Rated Power -Sr (VA)", calc.L1_6], [{ c: 0, s: boldStyle }]);
        addRow(["Valid Voltage Drop-DV (%)", calc.L1_7], [{ c: 0, s: boldStyle }]);
        addRow([]);

        // --- Winding 2 Input Data (Conditional) ---
        if (calc.L0 === "Used") {
            addRow(["Winding 2 Input Data"], [{ c: 0, s: mainHeaderStyle }]);
            addMerge(r - 1, 0, r - 1, 4);
            addRow(["VT Name", calc.L2_1], [{ c: 0, s: boldStyle }]);
            addRow(["Standard", calc.L2_2], [{ c: 0, s: boldStyle }]);
            addRow(["Accuracy Class", calc.L2_3], [{ c: 0, s: boldStyle }]);
            addRow(["Rated primary voltage (V)", calc.L2_4], [{ c: 0, s: boldStyle }]);
            addRow(["Rated secondary voltage (V)", calc.L2_5], [{ c: 0, s: boldStyle }]);
            addRow(["Rated Power -Sr (VA)", calc.L2_6], [{ c: 0, s: boldStyle }]);
            addRow(["Valid Voltage Drop-DV (%)", calc.L2_7], [{ c: 0, s: boldStyle }]);
            addRow([]);
        }

        // --- Connection Builder Helper ---
        const addConnectionData = (title, used, mcb, len, cs, mat, dev, burden) => {
            if (used === "Used") {
                addRow([title], [{ c: 0, s: subHeaderStyle }]);
                addMerge(r - 1, 0, r - 1, 4);
                addRow(["MCB Name", mcb], [{ c: 0, s: boldStyle }]);
                addRow(["Wire length - Lc (m)", len], [{ c: 0, s: boldStyle }]);
                addRow(["Wire Cross Section (mm²)", cs], [{ c: 0, s: boldStyle }]);
                addRow(["Wire Material", mat], [{ c: 0, s: boldStyle }]);
                addRow(["Connected Device Name", dev], [{ c: 0, s: boldStyle }]);
                addRow(["Total connected Burden (VA)", burden], [{ c: 0, s: boldStyle }]);
                addRow([]);
            }
        };

        // --- Winding 1 Connections ---
        addConnectionData("Connection1 - Winding 1", calc.O1_1, calc.O1_2, calc.O1_3, calc.O1_4, calc.O1_5, calc.O1_6, calc.O1_7);
        addConnectionData("Connection2 - Winding 1", calc.O2_1, calc.O2_2, calc.O2_3, calc.O2_4, calc.O2_5, calc.O2_6, calc.O2_7);
        addConnectionData("Connection3 - Winding 1", calc.O3_1, calc.O3_2, calc.O3_3, calc.O3_4, calc.O3_5, calc.O3_6, calc.O3_7);
        addConnectionData("Connection4 - Winding 1", calc.O4_1, calc.O4_2, calc.O4_3, calc.O4_4, calc.O4_5, calc.O4_6, calc.O4_7);

        // --- Winding 2 Connections ---
        if (calc.L0 === "Used") {
            addConnectionData("Connection1 - Winding 2", calc.M1_1, calc.M1_2, calc.M1_3, calc.M1_4, calc.M1_5, calc.M1_6, calc.M1_7);
            addConnectionData("Connection2 - Winding 2", calc.M2_1, calc.M2_2, calc.M2_3, calc.M2_4, calc.M2_5, calc.M2_6, calc.M2_7);
            addConnectionData("Connection3 - Winding 2", calc.M3_1, calc.M3_2, calc.M3_3, calc.M3_4, calc.M3_5, calc.M3_6, calc.M3_7);
            addConnectionData("Connection4 - Winding 2", calc.M4_1, calc.M4_2, calc.M4_3, calc.M4_4, calc.M4_5, calc.M4_6, calc.M4_7);
        }

        // --- Wire Resistance Table ---
        addRow(["Wire resistance (75°)"], [{ c: 0, s: subHeaderStyle }]);
        addMerge(r - 1, 0, r - 1, 4);
        addRow(["Connection", "ρ(75°C) (ohm.mm²/m)", "Resistance (ohm)"], [{ c: 0, s: tableHeaderStyle }, { c: 1, s: tableHeaderStyle }, { c: 2, s: tableHeaderStyle }]);
        calc.tableData.forEach(row => {
            addRow([row.connection, row.resistivity, row.resistance], [{ c: 0, s: centerStyle }, { c: 1, s: centerStyle }, { c: 2, s: centerStyle }]);
        });
        addRow([]);

        // --- Current Flow Table ---
        addRow(["Current Flow"], [{ c: 0, s: subHeaderStyle }]);
        addMerge(r - 1, 0, r - 1, 4);
        addRow(["Connection", "Current (A)"], [{ c: 0, s: tableHeaderStyle }, { c: 1, s: tableHeaderStyle }]);
        calc.CurrenttableData.forEach(row => {
            addRow([row.connection, row.current], [{ c: 0, s: centerStyle }, { c: 1, s: centerStyle }]);
        });
        addRow([]);

        // --- Voltage Drop Table ---
        addRow(["Requirement 1: Voltage Drop Calculation"], [{ c: 0, s: subHeaderStyle }]);
        addMerge(r - 1, 0, r - 1, 4);
        addRow(["Connection", "ΔV(%)", "Condition"], [{ c: 0, s: tableHeaderStyle }, { c: 1, s: tableHeaderStyle }, { c: 2, s: tableHeaderStyle }]);
        calc.VoltDroptableData.forEach(row => {
            const conditionStyle = row.condition === "Ok" ? okStyle : notOkStyle;
            addRow([row.connection, row.delt, row.condition], [{ c: 0, s: centerStyle }, { c: 1, s: centerStyle }, { c: 2, s: { ...centerStyle, ...conditionStyle } }]);
        });
        addRow([]);

        // --- Requirement 2: Burden Calculation ---
        addRow(["Requirement 2: Burden Calculation"], [{ c: 0, s: subHeaderStyle }]);
        addMerge(r - 1, 0, r - 1, 4);
        addRow(["Win1 Total Burden (VA)", calc.W49], [{ c: 0, s: boldStyle }]);
        addRow(["Win1 Condition:", calc.W50], [{ c: 0, s: boldStyle }, { c: 1, s: calc.W50 === "Ok" ? okStyle : notOkStyle }]);
        
        if (calc.L0 === "Used") {
            addRow(["Win2 Total Burden (VA)", calc.W51], [{ c: 0, s: boldStyle }]);
            addRow(["Win2 Condition:", calc.W52], [{ c: 0, s: boldStyle }, { c: 1, s: calc.W52 === "Ok" ? okStyle : notOkStyle }]);
        }
        addRow([]);

        // --- Summary Table ---
        addRow(["Summary"], [{ c: 0, s: mainHeaderStyle }]);
        addMerge(r - 1, 0, r - 1, 4);
        
        addRow(["The summary result of calculation is:"], [{ c: 0, s: { font: { bold: true, color: { rgb: "1976D2" } } } }]);
        addMerge(r - 1, 0, r - 1, 4);

        addRow(["Win 1 voltage drop condition:", calc.W53], [{ c: 0, s: boldStyle }, { c: 1, s: calc.W53 === "Ok" ? okStyle : notOkStyle }]);
        addRow(["Win 1 Burden condition:", calc.W54], [{ c: 0, s: boldStyle }, { c: 1, s: calc.W54 === "Ok" ? okStyle : notOkStyle }]);
        
        if (calc.L0 === "Used") {
            addRow(["Win 2 voltage drop condition:", calc.W55], [{ c: 0, s: boldStyle }, { c: 1, s: calc.W55 === "Ok" ? okStyle : notOkStyle }]);
            addRow(["Win 2 Burden condition:", calc.W56], [{ c: 0, s: boldStyle }, { c: 1, s: calc.W56 === "Ok" ? okStyle : notOkStyle }]);
        }

        // Display conditional Note if anything failed
        if (calc.condition) {
            addRow([]);
            addRow(["Note:"], [{ c: 0, s: { font: { bold: true, color: { rgb: "FF0000" } } } }]);
            addRow(["Even for the burden range II VTs an extended range of burden can be specified in agreement with the manufacturer."]);
            addMerge(r - 1, 0, r - 1, 4);
        }

        // =======================================================
        // 4. APPLY TO SHEET & RENDER
        // =======================================================
        const ws = XLSX.utils.aoa_to_sheet(ws_data);

        // Apply Column Widths
        ws['!cols'] = [{ wch: 35 }, { wch: 25 }, { wch: 25 }, { wch: 30 }, { wch: 25 }];
        
        // Apply Merges
        ws["!merges"] = merges;

        // Apply Cell Styles tracking built during generation
        cellStyles.forEach(({ r, c, s }) => {
            const cellAddr = XLSX.utils.encode_cell({ r, c });
            if (ws[cellAddr]) {
                ws[cellAddr].s = s;
            }
        });

        // --- Worksheet 2: Calculation Note ---
        const ws2_data = [
            ["Calculation Note Base IEC61869-3 Standard:"],
            [],
            ["The accuracy class of the VT is guaranteed only when the actual burden of the VT has:"],
            ["• any value from 0VA to 100% of the rated burden (burden range I VTs)"],
            ["• any value between 25% and 100% of the rated burden (burden range II VTs)"],
            [],
            ["The burden of a VT is the load connected to its secondary winding terminals. It is expressed either as total impedance in ohms or as the total volt-amperes (VA) and power factor at a specified secondary voltage or current and frequency. The rated burden is the burden value on which the accuracy requirements of the standard are based."]
        ];
        const ws2 = XLSX.utils.aoa_to_sheet(ws2_data);
        ws2['!cols'] = [{ wch: 100 }];
        ws2["!merges"] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
            { s: { r: 2, c: 0 }, e: { r: 2, c: 5 } },
            { s: { r: 3, c: 0 }, e: { r: 3, c: 5 } },
            { s: { r: 4, c: 0 }, e: { r: 4, c: 5 } },
            { s: { r: 6, c: 0 }, e: { r: 6, c: 5 } }
        ];
        if (ws2['A1']) ws2['A1'].s = boldStyle;

        // Build Workbook and Write
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "VT Calculation Report");
        XLSX.utils.book_append_sheet(wb, ws2, "Calculation Note");
        
        XLSX.writeFile(wb, "VT_Calculation_Report.xlsx");
    };

    render() {
        return (
            <Fragment>
                <button onClick={this.exportToExcel} className="pdf-button excel-button" style={{ backgroundColor: '#217346', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', margin: '10px' }}>
                    Export to Excel
                </button>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    VTDevice: state.example.VT.L,
    OParameter: state.example.VT.O,
    MParameter: state.example.VT.M,
    VT: state.example.VT,
    // ensure VT_OP is passed if you plan on checking OutPort
    VT_OP: state.example.VT_OP,
    OutPort: state.example.OutPort
});

export default connect(mapStateToProps)(ExcelExportButtonVT);
