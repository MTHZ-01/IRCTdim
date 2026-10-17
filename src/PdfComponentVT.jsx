import ExcelExportButtonVT from './ExcelExportButtonVT.jsx';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Table from '@mui/material/Table';
import { styled } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Fragment } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BoltIcon from '@mui/icons-material/Bolt';
import CableIcon from '@mui/icons-material/Cable';
import BatteryUnknownIcon from '@mui/icons-material/BatteryUnknown';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import moment from "moment";
import SecurityIcon from '@mui/icons-material/Security';
import IECPX_Approval from './IECPX_Approval.jsx';
import IEXP_Approval from './IEXP_Approval.jsx';
import InfoIcon from '@mui/icons-material/Info';
import IECTP_Approval from './IECTP_Approval.jsx';
import 'katex/dist/katex.min.css';
import MeterCTApproval from './MeterCTApproval.jsx';
import AddTaskIcon from '@mui/icons-material/AddTask';
import CancelIcon from '@mui/icons-material/Cancel';
import METERCTAccuracyApproval from './METERCTAccuracyApproval.jsx';





export class PdfComponentVT extends Component {
    constructor(props) {
        super(props);
        this.pdfRef = React.createRef();
    }

    // Function to export the component to PDF
    exportToPDF = () => {
        const input = this.pdfRef.current;

        html2canvas(input, { scale: 1.5 }).then((canvas) => {
            // Calculate dimensions based on content
            const contentWidth = 210; // A4 width in mm
            const contentHeight = (canvas.height * contentWidth) / canvas.width; // Scale proportionally

            // Create a PDF with a dynamic height
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [contentWidth, contentHeight], // Custom height based on content
            });

            // Add the entire content as a single image
            pdf.addImage(canvas, 'JPEG', 0, 0, contentWidth, contentHeight);

            // Save the PDF
            pdf.save('report.pdf');
        });
    };



    FormalSexyTable = () => {

    }



    render() {



        let L1, L2, O, M, L0;

        if (this.props.OutPort) {
            L1 = this.props.VT_OP.L.L1;
            L2 = this.props.VT_OP.L.L2;
            O = this.props.VT_OP.O;
            M = this.props.VT_OP.M;
            L0 = L2.L0;
        } else {
            L1 = this.props.VT.L.L1;
            L2 = this.props.VT.L.L2;
            O = this.props.VT.O;
            M = this.props.VT.M;
            L0 = L2.L0;
        }


        //L parameter
        var L1_1 = L1.VTName
        var L1_2 = L1.Standard
        var L1_3 = L1.SelectedVTClass
        var L1_4 = L1.VTPrimary
        var L1_5 = L1.VTSecondary
        var L1_6 = L1.RatedPower
        var L1_7 = L1.SelectedValidVoltageDrop

        var L2_1 = L2.VTName
        var L2_2 = L2.Standard
        var L2_3 = L2.SelectedVTClass
        var L2_4 = L2.VTPrimary
        var L2_5 = L2.VTSecondary
        var L2_6 = L2.RatedPower
        var L2_7 = L2.SelectedValidVoltageDrop
        console.log("O.O1 O.O1 O.O1 O.O1 ", O)
        //O parameter
        var O1_1 = O.O1.SelectedCondition
        var O1_2 = O.O1.MBCName
        var O1_3 = parseFloat(O.O1.Length)
        var O1_4 = parseFloat(O.O1.CrossSection)
        var O1_5 = O.O1.SelectedMaterial
        var O1_6 = O.O1.ConnectedDevice
        var O1_7 = O.O1.TotalConnectedBurden

        var O2_1 = O.O2.SelectedCondition
        var O2_2 = O.O2.MBCName
        var O2_3 = parseFloat(O.O2.Length)
        var O2_4 = parseFloat(O.O2.CrossSection)
        var O2_5 = O.O2.SelectedMaterial
        var O2_6 = O.O2.ConnectedDevice
        var O2_7 = O.O2.TotalConnectedBurden

        var O3_1 = O.O3.SelectedCondition
        var O3_2 = O.O3.MBCName
        var O3_3 = parseFloat(O.O3.Length)
        var O3_4 = parseFloat(O.O3.CrossSection)
        var O3_5 = O.O3.SelectedMaterial
        var O3_6 = O.O3.ConnectedDevice
        var O3_7 = O.O3.TotalConnectedBurden

        var O4_1 = O.O4.SelectedCondition
        var O4_2 = O.O4.MBCName
        var O4_3 = parseFloat(O.O4.Length)
        var O4_4 = parseFloat(O.O4.CrossSection)
        var O4_5 = O.O4.SelectedMaterial
        var O4_6 = O.O4.ConnectedDevice
        var O4_7 = O.O4.TotalConnectedBurden

        //M parameter
        var M1_1 = M.M1.SelectedCondition
        var M1_2 = M.M1.MBCName
        var M1_3 = parseFloat(M.M1.Length)
        var M1_4 = parseFloat(M.M1.CrossSection)
        var M1_5 = M.M1.SelectedMaterial
        var M1_6 = M.M1.ConnectedDevice
        var M1_7 = M.M1.TotalConnectedBurden

        var M2_1 = M.M2.SelectedCondition
        var M2_2 = M.M2.MBCName
        var M2_3 = parseFloat(M.M2.Length)
        var M2_4 = parseFloat(M.M2.CrossSection)
        var M2_5 = M.M2.SelectedMaterial
        var M2_6 = M.M2.ConnectedDevice
        var M2_7 = M.M2.TotalConnectedBurden

        var M3_1 = M.M3.SelectedCondition
        var M3_2 = M.M3.MBCName
        var M3_3 = parseFloat(M.M3.Length)
        var M3_4 = parseFloat(M.M3.CrossSection)
        var M3_5 = M.M3.SelectedMaterial
        var M3_6 = M.M3.ConnectedDevice
        var M3_7 = M.M3.TotalConnectedBurden

        var M4_1 = M.M4.SelectedCondition
        var M4_2 = M.M4.MBCName
        var M4_3 = parseFloat(M.M4.Length)
        var M4_4 = parseFloat(M.M4.CrossSection)
        var M4_5 = M.M4.SelectedMaterial
        var M4_6 = M.M4.ConnectedDevice
        var M4_7 = M.M4.TotalConnectedBurden

        const W41 = O1_7 * (O1_1 === "Used" ? 1 : 0);
        const W42 = O2_7 * (O2_1 === "Used" ? 1 : 0);
        const W43 = O3_7 * (O3_1 === "Used" ? 1 : 0);
        const W44 = O4_7 * (O4_1 === "Used" ? 1 : 0);
        const W45 = M1_7 * (M1_1 === "Used" ? 1 : 0);
        const W46 = M2_7 * (M2_1 === "Used" ? 1 : 0);
        const W47 = M3_7 * (M3_1 === "Used" ? 1 : 0);
        const W48 = M4_7 * (M4_1 === "Used" ? 1 : 0);


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
        // L1 variables
        ('L1_1:', L1_1);
        ('L1_2:', L1_2);
        ('L1_3:', L1_3);
        ('L1_4:', L1_4);
        ('L1_5:', L1_5);
        ('L1_6:', L1_6);
        ('L1_7:', L1_7);

        // L2 variables
        ('L2_1:', L2_1);
        ('L2_2:', L2_2);
        ('L2_3:', L2_3);
        ('L2_4:', L2_4);
        ('L2_5:', L2_5);
        ('L2_6:', L2_6);
        ('L2_7:', L2_7);

        // O1 variables
        ('O1_1:', O1_1);
        ('O1_2:', O1_2);
        ('O1_3:', O1_3);
        ('O1_4:', O1_4);
        ('O1_5:', O1_5);
        ('O1_6:', O1_6);
        ('O1_7:', O1_7);

        // O2 variables
        ('O2_1:', O2_1);
        ('O2_2:', O2_2);
        ('O2_3:', O2_3);
        ('O2_4:', O2_4);
        ('O2_5:', O2_5);
        ('O2_6:', O2_6);
        ('O2_7:', O2_7);

        // O3 variables
        ('O3_1:', O3_1);
        ('O3_2:', O3_2);
        ('O3_3:', O3_3);
        ('O3_4:', O3_4);
        ('O3_5:', O3_5);
        ('O3_6:', O3_6);
        ('O3_7:', O3_7);

        // O4 variables
        ('O4_1:', O4_1);
        ('O4_2:', O4_2);
        ('O4_3:', O4_3);
        ('O4_4:', O4_4);
        ('O4_5:', O4_5);
        ('O4_6:', O4_6);
        ('O4_7:', O4_7);

        // M1 variables
        ('M1_1:', M1_1);
        ('M1_2:', M1_2);
        ('M1_3:', M1_3);
        ('M1_4:', M1_4);
        ('M1_5:', M1_5);
        ('M1_6:', M1_6);
        ('M1_7:', M1_7);

        // M2 variables
        ('M2_1:', M2_1);
        ('M2_2:', M2_2);
        ('M2_3:', M2_3);
        ('M2_4:', M2_4);
        ('M2_5:', M2_5);
        ('M2_6:', M2_6);
        ('M2_7:', M2_7);

        // M3 variables
        ('M3_1:', M3_1);
        ('M3_2:', M3_2);
        ('M3_3:', M3_3);
        ('M3_4:', M3_4);
        ('M3_5:', M3_5);
        ('M3_6:', M3_6);
        ('M3_7:', M3_7);

        // M4 variables
        ('M4_1:', M4_1);
        ('M4_2:', M4_2);
        ('M4_3:', M4_3);
        ('M4_4:', M4_4);
        ('M4_5:', M4_5);
        ('M4_6:', M4_6);
        ('M4_7:', M4_7);

        // W41 - W48
        ('W41:', W41);
        ('W42:', W42);
        ('W43:', W43);
        ('W44:', W44);
        ('W45:', W45);
        ('W46:', W46);
        ('W47:', W47);
        ('W48:', W48);

        // W1 - W8
        ('W1:', W1);
        ('W2:', W2);
        ('W3:', W3);
        ('W4:', W4);
        ('W5:', W5);
        ('W6:', W6);
        ('W7:', W7);
        ('W8:', W8);

        // W9 - W16
        ('W9:', W9);
        ('W10:', W10);
        ('W11:', W11);
        ('W12:', W12);
        ('W13:', W13);
        ('W14:', W14);
        ('W15:', W15);
        ('W16:', W16);



        const tableData = [];
        if (O1_1 == "Used") tableData.push({ connection: 'Win1-1', resistivity: W1, resistance: W9 });
        if (O2_1 == "Used") tableData.push({ connection: 'Win1-2', resistivity: W2, resistance: W10 });
        if (O3_1 == "Used") tableData.push({ connection: 'Win1-3', resistivity: W3, resistance: W11 });
        if (O4_1 == "Used") tableData.push({ connection: 'Win1-4', resistivity: W4, resistance: W12 });
        if (M1_1 == "Used") tableData.push({ connection: 'Win2-1', resistivity: W5, resistance: W13 });
        if (M2_1 == "Used") tableData.push({ connection: 'Win2-2', resistivity: W6, resistance: W14 });
        if (M3_1 == "Used") tableData.push({ connection: 'Win2-3', resistivity: W7, resistance: W15 });
        if (M4_1 == "Used") tableData.push({ connection: 'Win2-4', resistivity: W8, resistance: W16 });

        const W17 = parseFloat(((Math.sqrt(3) * O1_7) / L1_5).toFixed(3));
        const W18 = parseFloat(((Math.sqrt(3) * O2_7) / L1_5).toFixed(3));
        const W19 = parseFloat(((Math.sqrt(3) * O3_7) / L1_5).toFixed(3));
        const W20 = parseFloat(((Math.sqrt(3) * O4_7) / L1_5).toFixed(3));
        const W21 = parseFloat(((Math.sqrt(3) * M1_7) / L2_5).toFixed(3));
        const W22 = parseFloat(((Math.sqrt(3) * M2_7) / L2_5).toFixed(3));
        const W23 = parseFloat(((Math.sqrt(3) * M3_7) / L2_5).toFixed(3));
        const W24 = parseFloat(((Math.sqrt(3) * M4_7) / L2_5).toFixed(3));


        const CurrenttableData = [];
        if (O1_1 == "Used") CurrenttableData.push({ connection: 'Win1-1', current: W17 });
        if (O2_1 == "Used") CurrenttableData.push({ connection: 'Win1-2', current: W18 });
        if (O3_1 == "Used") CurrenttableData.push({ connection: 'Win1-3', current: W19 });
        if (O4_1 == "Used") CurrenttableData.push({ connection: 'Win1-4', current: W20 });
        if (M1_1 == "Used") CurrenttableData.push({ connection: 'Win2-1', current: W21 });
        if (M2_1 == "Used") CurrenttableData.push({ connection: 'Win2-2', current: W22 });
        if (M3_1 == "Used") CurrenttableData.push({ connection: 'Win2-3', current: W23 });
        if (M4_1 == "Used") CurrenttableData.push({ connection: 'Win2-4', current: W24 });


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

        var VoltDroptableData = [];

        if (O1_1 == "Used") VoltDroptableData.push({ connection: 'Win1-1', delt: W25, condition: W33 });
        if (O2_1 == "Used") VoltDroptableData.push({ connection: 'Win1-2', delt: W26, condition: W34 });
        if (O3_1 == "Used") VoltDroptableData.push({ connection: 'Win1-3', delt: W27, condition: W35 });
        if (O4_1 == "Used") VoltDroptableData.push({ connection: 'Win1-4', delt: W28, condition: W36 });
        if (M1_1 == "Used") VoltDroptableData.push({ connection: 'Win2-1', delt: W29, condition: W37 });
        if (M2_1 == "Used") VoltDroptableData.push({ connection: 'Win2-2', delt: W30, condition: W38 });
        if (M3_1 == "Used") VoltDroptableData.push({ connection: 'Win2-3', delt: W31, condition: W39 });
        if (M4_1 == "Used") VoltDroptableData.push({ connection: 'Win2-4', delt: W32, condition: W40 });


        const Burden_Formula = `\\begin{cases} 
        0 \\leq \\text{Actual Burden} \\leq S_r & S_r \\leq 10(\\text{VA}) \\\\
        0.25 S_r \\leq \\text{Actual Burden} \\leq S_r & S_r \\geq 10(\\text{VA})
        \\end{cases}` || "Inv";

        const W49 = W41 + W42 + W43 + W44;
        const W50 = ((
            (L1_6 <= 10 && W49 >= 0 && W49 <= L1_6) ||
            (L1_6 > 10 && W49 >= 0.25 * L1_6 && W49 <= L1_6)
        ) ? "Ok" : "Not Ok");

        const W51 = W45 + W46 + W47 + W48;
        const W52 = ((
            (L2_6 <= 10 && W51 >= 0 && W51 <= L2_6) ||
            (L2_6 > 10 && W51 >= 0.25 * L2_6 && W51 <= L2_6)
        ) ? "Ok" : "Not Ok");


        const W53 = ((W33 === "Ok" && W34 === "Ok" && W35 === "Ok" && W36 === "Ok") ? "Ok" : "Not Ok");
        const W54 = W50;
        const W55 = ((W37 === "Ok" && W38 === "Ok" && W39 === "Ok" && W40 === "Ok") ? "Ok" : "Not Ok");
        const W56 = W52;


        const RL_Formula = `\\mathbf{R_L = \\frac{\\rho L_c}{A_c}}` || "Inv";
        const CurrentFlowFormula = `\\mathbf{I = \\frac{S_n}{V_{rs}}}` || "Inv";

        const DeltaV_Formula = `\\Delta V \\left(\\%\\right) = \\frac{\\sqrt{3} R_L I * 100}{V_{rs}}` || "Inv";
        const condition = (W54 === "Not Ok") || (W56 === "not Ok" && L0 === "Used");

        ('W25:', W25);
        ('W33:', W33);

        ('W26:', W26);
        ('W34:', W34);

        ('W27:', W27);
        ('W35:', W35);

        ('W28:', W28);
        ('W36:', W36);

        ('W29:', W29);
        ('W37:', W37);

        ('W30:', W30);
        ('W38:', W38);

        ('W31:', W31);
        ('W39:', W39);

        ('W32:', W32);
        ('W40:', W40);

        ('Burden_Formula:', Burden_Formula);

        ('W49:', W49);
        ('W50:', W50);

        ('W51:', W51);
        ('W52:', W52);

        ('W53:', W53);
        ('W54:', W54);
        ('W55:', W55);
        ('W56:', W56);

        ('RL_Formula:', RL_Formula);
        ('CurrentFlowFormula:', CurrentFlowFormula);
        ('DeltaV_Formula:', DeltaV_Formula);
        ('condition:', condition);


        return (
            <Fragment>
                <div style={{ background: "white", overflowY: "auto" }}>
                    <div ref={this.pdfRef} className='PdfHolder w_210_mm'>
                        <div className="pdf-container position-relative">
                            <div className="pdf-content">

                                {/* Winding Information */}
                                <div className='mt-4 col-12 center justify-content-start row'>
                                    <h3 style={{ background: "indianred" }} className="section-title section_title_Sub">
                                        <BoltIcon className='pdfIcons'></BoltIcon>
                                        Winding 1
                                    </h3>
                                    <div className="info-item col-5">
                                        <span className="label">VT Name</span>
                                        <span className="value">{L1_1}</span>
                                    </div>
                                    <div className="info-item col-5">
                                        <span className="label">Standard</span>
                                        <span className="value">{L1_2}</span>
                                    </div>
                                    <div className="info-item col-5">
                                        <span className="label">VT Class</span>
                                        <span className="value">{L1_3}</span>
                                    </div>
                                    <div className="info-item col-5">
                                        <span className="label">VT Primary LL-Vrp (kV)</span>
                                        <span className="value">{L1_4}</span>
                                    </div>
                                    <div className="info-item col-5">
                                        <span className="label">VT Secondary  LL -Vrs (V)</span>
                                        <span className="value">{L1_5}</span>
                                    </div>
                                    <div className="info-item col-5">
                                        <span className="label">Rated Power -Sr (VA)</span>
                                        <span className="value">{L1_6}</span>
                                    </div>
                                    <div className="info-item col-5">
                                        <span className="label">Valid Voltage Drop-DV (%)</span>
                                        <span className="value">{L1_7}</span>
                                    </div>


                                </div>

                                {/* Winding Information */
                                    L0 == "Used" &&
                                    <div className='mt-4 col-12 center justify-content-start row'>
                                        <h3 style={{ background: "indianred" }} className="section-title section_title_Sub">
                                            <BoltIcon className='pdfIcons'></BoltIcon>
                                            Winding 2
                                        </h3>
                                        <div className="info-item col-5">
                                            <span className="label">VT Name</span>
                                            <span className="value">{L2_1}</span>
                                        </div>
                                        <div className="info-item col-5">
                                            <span className="label">Standard</span>
                                            <span className="value">{L2_2}</span>
                                        </div>
                                        <div className="info-item col-5">
                                            <span className="label">VT Class</span>
                                            <span className="value">{L2_3}</span>
                                        </div>
                                        <div className="info-item col-5">
                                            <span className="label">VT Primary LL-Vrp (kV)</span>
                                            <span className="value">{L2_4}</span>
                                        </div>
                                        <div className="info-item col-5">
                                            <span className="label">VT Secondary  LL -Vsp (V)</span>
                                            <span className="value">{L2_5}</span>
                                        </div>
                                        <div className="info-item col-5">
                                            <span className="label">Rated Power -Sr (VA)</span>
                                            <span className="value">{L2_6}</span>
                                        </div>
                                        <div className="info-item col-5">
                                            <span className="label">Valid Voltage Drop-DV (%)</span>
                                            <span className="value">{L2_7}</span>
                                        </div>


                                    </div>
                                }


                                {/* Conductor Information */
                                    O1_1 == "Used" &&
                                    <div className='mt-4 col-12 center justify-content-start row'>
                                        <h3 style={{ background: "darkslateblue" }} className="section-title section_title_Sub">
                                            <CompareArrowsIcon className='pdfIcons'></CompareArrowsIcon>
                                            Connection1-Winding1
                                        </h3>

                                        <div className="info-item col-5">
                                            <span className="label">MCB Name</span>
                                            <span className="value">{O1_2}</span>
                                        </div>
                                        <div className="info-item col-5">
                                            <span className="label">Wire length - Lc (m)</span>
                                            <span className="value">{O1_3}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Wire Corss Section (mm²)</span>
                                            <span className="value">{O1_4}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Wire Material</span>
                                            <span className="value">{O1_5}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Connected Device Name </span>
                                            <span className="value">{O1_6}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Total connected Burden - Sn (VA)</span>
                                            <span className="value">{W41}</span>
                                        </div>


                                    </div>
                                }

                                {/* Conductor Information */
                                    O2_1 == "Used" &&
                                    <div className='mt-4 col-12 center justify-content-start row'>
                                        <h3 style={{ background: "darkslateblue" }} className="section-title section_title_Sub">
                                            <CompareArrowsIcon className='pdfIcons'></CompareArrowsIcon>
                                            Connection2-Winding1
                                        </h3>

                                        <div className="info-item col-5">
                                            <span className="label">MCB Name</span>
                                            <span className="value">{O2_2}</span>
                                        </div>
                                        <div className="info-item col-5">
                                            <span className="label">Wire length - Lc (m)</span>
                                            <span className="value">{O2_3}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Wire Corss Section (mm²)</span>
                                            <span className="value">{O2_4}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Wire Material</span>
                                            <span className="value">{O2_5}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Connected Device Name </span>
                                            <span className="value">{O2_6}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Total connected Burden - Sn (VA)</span>
                                            <span className="value">{W42}</span>
                                        </div>


                                    </div>
                                }

                                {/* Conductor Information */
                                    O3_1 == "Used" &&
                                    <div className='mt-4 col-12 center justify-content-start row'>
                                        <h3 style={{ background: "darkslateblue" }} className="section-title section_title_Sub">
                                            <CompareArrowsIcon className='pdfIcons'></CompareArrowsIcon>
                                            Connection3-Winding1
                                        </h3>

                                        <div className="info-item col-5">
                                            <span className="label">MCB Name</span>
                                            <span className="value">{O3_2}</span>
                                        </div>
                                        <div className="info-item col-5">
                                            <span className="label">Wire length - Lc (m)</span>
                                            <span className="value">{O3_3}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Wire Corss Section (mm²)</span>
                                            <span className="value">{O3_4}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Wire Material</span>
                                            <span className="value">{O3_5}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Connected Device Name </span>
                                            <span className="value">{O3_6}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Total connected Burden - Sn (VA)</span>
                                            <span className="value">{W43}</span>
                                        </div>


                                    </div>
                                }

                                {/* Conductor Information */
                                    O4_1 == "Used" &&
                                    <div className='mt-4 col-12 center justify-content-start row'>
                                        <h3 style={{ background: "darkslateblue" }} className="section-title section_title_Sub">
                                            <CompareArrowsIcon className='pdfIcons'></CompareArrowsIcon>
                                            Connection4-Winding1
                                        </h3>

                                        <div className="info-item col-5">
                                            <span className="label">MCB Name</span>
                                            <span className="value">{O4_2}</span>
                                        </div>
                                        <div className="info-item col-5">
                                            <span className="label">Wire length - Lc (m)</span>
                                            <span className="value">{O4_3}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Wire Corss Section (mm²)</span>
                                            <span className="value">{O4_4}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Wire Material</span>
                                            <span className="value">{O4_5}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Connected Device Name </span>
                                            <span className="value">{O4_6}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Total connected Burden - Sn (VA)</span>
                                            <span className="value">{W44}</span>
                                        </div>


                                    </div>
                                }

                                {/* Conductor Information */
                                    M1_1 == "Used" &&
                                    <div className='mt-4 col-12 center justify-content-start row'>
                                        <h3 style={{ background: "darkslateblue" }} className="section-title section_title_Sub">
                                            <CompareArrowsIcon className='pdfIcons'></CompareArrowsIcon>
                                            Connection1-Winding2
                                        </h3>

                                        <div className="info-item col-5">
                                            <span className="label">MCB Name</span>
                                            <span className="value">{M1_2}</span>
                                        </div>
                                        <div className="info-item col-5">
                                            <span className="label">Wire length - Lc (m)</span>
                                            <span className="value">{M1_3}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Wire Corss Section (mm²)</span>
                                            <span className="value">{M1_4}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Wire Material</span>
                                            <span className="value">{M1_5}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Connected Device Name </span>
                                            <span className="value">{M1_6}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Total connected Burden - Sn (VA)</span>
                                            <span className="value">{W45}</span>
                                        </div>


                                    </div>
                                }

                                {/* Conductor Information */
                                    M2_1 == "Used" &&
                                    <div className='mt-4 col-12 center justify-content-start row'>
                                        <h3 style={{ background: "darkslateblue" }} className="section-title section_title_Sub">
                                            <CompareArrowsIcon className='pdfIcons'></CompareArrowsIcon>
                                            Connection2-Winding2
                                        </h3>

                                        <div className="info-item col-5">
                                            <span className="label">MCB Name</span>
                                            <span className="value">{M2_2}</span>
                                        </div>
                                        <div className="info-item col-5">
                                            <span className="label">Wire length - Lc (m)</span>
                                            <span className="value">{M2_3}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Wire Corss Section (mm²)</span>
                                            <span className="value">{M2_4}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Wire Material</span>
                                            <span className="value">{M2_5}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Connected Device Name </span>
                                            <span className="value">{M2_6}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Total connected Burden - Sn (VA)</span>
                                            <span className="value">{W46}</span>
                                        </div>


                                    </div>
                                }

                                {/* Conductor Information */
                                    M3_1 == "Used" &&
                                    <div className='mt-4 col-12 center justify-content-start row'>
                                        <h3 style={{ background: "darkslateblue" }} className="section-title section_title_Sub">
                                            <CompareArrowsIcon className='pdfIcons'></CompareArrowsIcon>
                                            Connection3-Winding2
                                        </h3>

                                        <div className="info-item col-5">
                                            <span className="label">MCB Name</span>
                                            <span className="value">{M3_2}</span>
                                        </div>
                                        <div className="info-item col-5">
                                            <span className="label">Wire length - Lc (m)</span>
                                            <span className="value">{M3_3}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Wire Corss Section (mm²)</span>
                                            <span className="value">{M3_4}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Wire Material</span>
                                            <span className="value">{M3_5}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Connected Device Name </span>
                                            <span className="value">{M3_6}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Total connected Burden - Sn (VA)</span>
                                            <span className="value">{W47}</span>
                                        </div>


                                    </div>
                                }

                                {/* Conductor Information */
                                    M4_1 == "Used" &&
                                    <div className='mt-4 col-12 center justify-content-start row'>
                                        <h3 style={{ background: "darkslateblue" }} className="section-title section_title_Sub">
                                            <CompareArrowsIcon className='pdfIcons'></CompareArrowsIcon>
                                            Connection4-Winding2
                                        </h3>

                                        <div className="info-item col-5">
                                            <span className="label">MCB Name</span>
                                            <span className="value">{M4_2}</span>
                                        </div>
                                        <div className="info-item col-5">
                                            <span className="label">Wire length - Lc (m)</span>
                                            <span className="value">{M4_3}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Wire Corss Section (mm²)</span>
                                            <span className="value">{M4_4}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Wire Material</span>
                                            <span className="value">{M4_5}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Connected Device Name </span>
                                            <span className="value">{M4_6}</span>
                                        </div>

                                        <div className="info-item col-5">
                                            <span className="label">Total connected Burden - Sn (VA)</span>
                                            <span className="value">{W48}</span>
                                        </div>


                                    </div>
                                }


                                <div className='mt-4 col-12 center justify-content-start row'>
                                    <h3 style={{ background: "darkslateblue" }} className="section-title section_title_Sub">
                                        <CompareArrowsIcon className='pdfIcons'></CompareArrowsIcon>
                                        Calculation Note Base IEC61869-3 Standard:
                                    </h3>


                                    <section className="section center justify-content-around row">
                                        <div className="info-item col-12 center Remarks justify-content-start align-items-start flex-column">

                                            <h3 className="section-title section_title_Sub2 ">Requirement 1:</h3>
                                            <p className="valueSpecial">{`The voltage drop along the secondary wiring shall not be higher that (0.1 or 0.2 or 0.5 or 2.5%) for measuring and protection windings according to good engineering practice.`}</p>

                                        </div>
                                    </section>


                                    <section className="section center justify-content-around row">
                                        <div className="info-item col-12 center Remarks justify-content-start align-items-start flex-column">

                                            <h3 className="section-title section_title_Sub2 ">Requirement 2:</h3>
                                            <p className="valueSpecial">{`According to the IEC 61869-3 the accuracy class of the VT is guaranteed only when the actual burden of the VT has:
▫ any value from 0VA to 100% of the rated burden (for the burden range I VTs, i.e. voltage transformer with power factor 1 or rated burden up to 10VA), or
▫ any value between 25% and 100% of the rated burden (for the burden range II VTs, i.e. voltage transformer with power factor 0.8 or rated burden > 10VA).
Note: Even for the burden range II VTs an extended range of burden can be specified in agreement with the manufacturer, e.g. 0VA to 20VA or 0VA to 50VA. Then, the accuracy class is maintained within this range.`}</p>

                                        </div>
                                    </section>



                                </div>




                                <div className='mt-4 col-12 center justify-content-start row'>
                                    <div className='mt-4 col-12 center justify-content-start row'>
                                        <h3 className="section-title section_title_Sub">{`Wire resistance (75°):`}</h3>
                                    </div>

                                    <div className="info-item col-6 justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                                        <InlineMath math={RL_Formula} />
                                    </div>

                                    <TableContainer component={Paper} className="tableContainer">
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className="headerCell">Connection</TableCell>
                                                    <TableCell className="headerCell">ρ(75°C) (ohm.mm²/m)</TableCell>
                                                    <TableCell className="headerCell">Resistance (ohm)</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {tableData.map((row, index) => (
                                                    <TableRow
                                                        key={index}
                                                    // className={index === 4 ? 'highlightedRow row' : 'row'}
                                                    >
                                                        <TableCell className="connectionCell col-4">{row.connection}</TableCell>
                                                        <TableCell className='col-4'>{row.resistivity}</TableCell>
                                                        <TableCell className='col-4'>{row.resistance}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                </div>


                                <div className='mt-4 col-12 center justify-content-start row'>
                                    <div className='mt-4 col-12 center justify-content-start row'>
                                        <h3 className="section-title section_title_Sub">{`Current Flow:`}</h3>
                                    </div>

                                    <div className="info-item col-6 justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                                        <InlineMath math={CurrentFlowFormula} />
                                    </div>

                                    <TableContainer component={Paper} className="tableContainer">
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className="headerCell">Connection</TableCell>
                                                    <TableCell className="headerCell">current (A)</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {CurrenttableData.map((row, index) => (
                                                    <TableRow
                                                        key={index}
                                                    // className={index === 4 ? 'highlightedRow row' : 'row'}
                                                    >
                                                        <TableCell className="connectionCell col-4">{row.connection}</TableCell>
                                                        <TableCell className='col-4'>{row.current}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                </div>


                                <div className='mt-4 col-12 center justify-content-start row'>
                                    <div className='mt-4 col-12 center justify-content-start row'>
                                        <h3 className="section-title section_title_Sub">{`Requierment1: Voltage Drop Calculation`}</h3>
                                    </div>

                                    <div className="info-item col-6 justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                                        <InlineMath math={DeltaV_Formula} />
                                    </div>

                                    <TableContainer component={Paper} className="tableContainer">
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className="headerCell">Connection</TableCell>
                                                    <TableCell className="headerCell">∆𝑉(%)</TableCell>
                                                    <TableCell className="headerCell">Condtion</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {VoltDroptableData.map((row, index) => (
                                                    <TableRow
                                                        key={index}
                                                    // className={index === 4 ? 'highlightedRow row' : 'row'}
                                                    >
                                                        <TableCell className="connectionCell col-4">{row.connection}</TableCell>
                                                        <TableCell className='col-4'>{row.delt}</TableCell>
                                                        <TableCell className='col-4'>{row.condition}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                </div>

                                <div className='mt-4 col-12 center justify-content-start row'>
                                    <div className='mt-4 col-12 center justify-content-start row'>
                                        <h3 className="section-title section_title_Sub">{`Requierment 2: Burden Calculation`}</h3>
                                    </div>



                                    <div className="info-item col-12">
                                        <span className="label">Actual Burden</span>
                                        <div className="info-item col-12 justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                                            <InlineMath math={Burden_Formula} />
                                        </div>
                                    </div>

                                    <div className="info-item col-5">
                                        <span className="label">Win1 Total Burden (VA)</span>
                                        <span className="value">{W49}</span>
                                    </div>

                                    <div className="info-item col-5">
                                        <span className="label">Win1 Condition:</span>
                                        <span className="value">{W50}</span>
                                    </div>


                                    {L0 == "Used" &&
                                        <Fragment>
                                            <div className="info-item col-5">
                                                <span className="label">Win2 Total Burden (VA)</span>
                                                <span className="value">{W51}</span>
                                            </div>

                                            <div className="info-item col-5">
                                                <span className="label">Win2 Condition:</span>
                                                <span className="value">{W52}</span>
                                            </div>
                                        </Fragment>
                                    }

                                </div>



                                <div className='mt-4 col-12 center justify-content-start row'>
                                    <div className='mt-4 col-12 center justify-content-start row'>
                                        <h3 className="section-title section_title_Sub">{`Summery`}</h3>
                                    </div>

                                    <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                                        <InfoIcon className='pdfIconsSecondry'></InfoIcon>
                                        The summary result of calculation is:</h3>

                                    <div className="info-item col-5">
                                        <span className="label">Win 1 voltage drop condition:</span>
                                        <span className="value">{W53}</span>
                                    </div>

                                    <div className="info-item col-5">
                                        <span className="label">Win1 Burden condition:</span>
                                        <span className="value">{W54}</span>
                                    </div>

                                    {L0 == "Used" &&

                                        <Fragment>
                                            <div className="info-item col-5">
                                                <span className="label">Win2 voltage drop condition:</span>
                                                <span className="value">{W55}</span>
                                            </div>

                                            <div className="info-item col-5">
                                                <span className="label">Win2 Burden condition:</span>
                                                <span className="value">{W56}</span>
                                            </div>
                                        </Fragment>
                                    }
                                    {condition &&
                                        <section className="section center justify-content-around row">
                                            <div className="info-item col-12 center Remarks justify-content-start align-items-start flex-column">

                                                <h3 className="section-title section_title_Sub2 ">Note</h3>
                                                <p className="valueSpecial">{`Even for the burden range II VTs an extended range of burden can be specified in
agreement with the manufacturer, e.g. 0VA to 20VA or 0VA to 50VA. Then, the accuracy
class is maintained within this range.`}</p>

                                            </div>
                                        </section>
                                    }


                                </div>




                            </div>
                        </div>
                    </div>
                </div>
                <button onClick={this.exportToPDF} className="pdf-button">
                    Export to PDF
                </button>
                <ExcelExportButtonVT
                />
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    VTDevice: state.example.VT.L,
    OParameter: state.example.VT.O,
    MParameter: state.example.VT.M,
    VT: state.example.VT
});

export default connect(mapStateToProps)(PdfComponentVT);