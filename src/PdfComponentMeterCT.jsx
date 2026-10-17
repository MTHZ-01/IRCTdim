import ExcelComponentMeterCT from './ExcelComponentMeterCT.jsx';
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


export class PdfComponentMeterCT extends Component {
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

    term(num, den) {
        if (num === 0 && den === 0) return 0;
        return den !== 0 ? num / (den ** 2) : 0;
    }

    render() {

        var { MeteringDevice, Conductor, CurrentTransformer, AdditionalEquipment } =
            this.props.OutPort
                ? this.props.MeterCTInfo_OP
                : this.props.MeterCTInfo;




        // Device Information
        const F1 = MeteringDevice?.Manufacture || 'N/A';
        const F2 = MeteringDevice?.DeviceName || 'N/A';
        const F3 = MeteringDevice?.selectedIrn_A || 'N/A';
        const F4 = MeteringDevice?.BurdenPhase_VA || 'N/A';
        const F5 = MeteringDevice?.DeviceMaxCurrent || 'N/A';
        const F6 = MeteringDevice?.MaxFaultCurrent || 'N/A';
        const F7 = MeteringDevice?.standard || 'N/A';
        ("F1:", F1);
        ("F2:", F2);
        ("F3:", F3);
        ("F4:", F4);
        ("F5:", F5);
        ("F6:", F6);
        ("F7:", F7);

        // Conductor Information
        const H1 = Conductor?.Length || 'N/A';
        const H2 = Conductor?.CrossSection || 'N/A';
        const H3 = Conductor?.Material || 'N/A';
        ("H1:", H1);
        ("H2:", H2);
        ("H3:", H3);

        // CT Information
        const G1 = CurrentTransformer?.CTName || 'N/A';
        const G2 = CurrentTransformer?.standard || 'N/A';
        const G3 = CurrentTransformer?.selectedCTClass || 'N/A';
        const G4 = parseFloat(CurrentTransformer?.CTPrimary) || 'N/A';
        const G5 = parseFloat(CurrentTransformer?.CTSecondry) || 'N/A';
        const G6 = parseFloat(CurrentTransformer?.SecurityFactor) || 'N/A';
        const G7 = parseFloat(CurrentTransformer?.RatedBurden) || 'N/A';
        const G8 = parseFloat(CurrentTransformer?.CTResistance) || 'N/A';
        const G9 = CurrentTransformer?.SelectedExtendedBurdenRangeList || 'N/A';
        ("G1:", G1);
        ("G2:", G2);
        ("G3:", G3);
        ("G4:", G4);
        ("G5:", G5);
        ("G6:", G6);
        ("G7:", G7);
        ("G8:", G8);
        ("G9:", G9);

        // Equipments
        var I1_1 = this.props?.AdditionalEquipment[0]?.name || "Empty";
        var I1_2 = this.props?.AdditionalEquipment[0]?.ratedCurrent || 0;
        var I1_3 = this.props?.AdditionalEquipment[0]?.ratedBurden || 0;
        var I2_1 = this.props?.AdditionalEquipment[1]?.name || "Empty";
        var I2_2 = this.props?.AdditionalEquipment[1]?.ratedCurrent || 0;
        var I2_3 = this.props?.AdditionalEquipment[1]?.ratedBurden || 0;
        var I3_1 = this.props?.AdditionalEquipment[2]?.name || "Empty";
        var I3_2 = this.props?.AdditionalEquipment[2]?.ratedCurrent || 0;
        var I3_3 = this.props?.AdditionalEquipment[2]?.ratedBurden || 0;
        var I4_1 = this.props?.AdditionalEquipment[3]?.name || "Empty";
        var I4_2 = this.props?.AdditionalEquipment[3]?.ratedCurrent || 0;
        var I4_3 = this.props?.AdditionalEquipment[3]?.ratedBurden || 0;
        var I5_1 = this.props?.AdditionalEquipment[4]?.name || "Empty";
        var I5_2 = this.props?.AdditionalEquipment[4]?.ratedCurrent || 0;
        var I5_3 = this.props?.AdditionalEquipment[4]?.ratedBurden || 0;
        ("I1_1:", I1_1);
        ("I1_2:", I1_2);
        ("I1_3:", I1_3);
        ("I2_1:", I2_1);
        ("I2_2:", I2_2);
        ("I2_3:", I2_3);
        ("I3_1:", I3_1);
        ("I3_2:", I3_2);
        ("I3_3:", I3_3);
        ("I4_1:", I4_1);
        ("I4_2:", I4_2);
        ("I4_3:", I4_3);
        ("I5_1:", I5_1);
        ("I5_2:", I5_2);
        ("I5_3:", I5_3);
        console.log(this.props?.AdditionalEquipment)

        // Values
        var Y1 = H3 === "Cu" ? 0.0225 : 0.0376;
        var Y2 = Y1 * H1 / H2;
        var Y3 = G7 / (G5 ** 2);
        const Y4 = 2 * Y2
            + (F4 / (F3 ** 2))
            + this.term(I1_3, I1_2)
            + this.term(I2_3, I2_2)
            + this.term(I3_3, I3_2)
            + this.term(I4_3, I4_2)
            + this.term(I5_3, I5_2);


        console.log("Y1:", Y1);
        console.log("Y2:", Y2);
        console.log("Y3:", Y3);
        console.log("Y4:", Y4);
        console.log("F4:", F4); // Retained from your original code
        console.log("F3:", F3); // Retained from your original code
        console.log("I1_3:", I1_3); // Retained from your original code
        console.log("I1_2:", I1_2); // Retained from your original code
        console.log("I2_3:", I2_3); // Retained from your original code
        console.log("I2_2:", I2_2); // Retained from your original code
        console.log("I3_3:", I3_3); // Retained from your original code
        console.log("I3_2:", I3_2); // Retained from your original code
        console.log("I4_3:", I4_3); // Retained from your original code
        console.log("I4_2:", I4_2); // Retained from your original code
        console.log("I5_3:", I5_3); // Retained from your original code
        console.log("I5_2:", I5_2); // Retained from your original code
        console.log("I5_2:", I5_2); // Retained from your original code
        console.log("G3:", G3); // Retained from your original code


        var Y5 = Y4 * (G5 ** 2);
        var Y6 = parseFloat(G6) * (parseFloat(G8) + parseFloat(Y3)) / (parseFloat(G8) + parseFloat(Y4));
        var Y7 = F5;
        var Y8 = F6 * 1000 * G5 / G4;
        var Y9 = 1.1 * Y6 * G5;
        var Y10 = F5 > Math.min(Y8, Y9) ? "Id_max>=min(If-max,Ifs-max), So security check is ok" : "Id_max<.min(If-max,Ifs-max), So security check is not ok";
        var Y11 = ["0.1", "0.2", "1", "3", "5", "0.2S", "0.5S"].includes(G3) ? "Active" : "Inactive";
        var Y12 = Y5 >= 0.25 * G7 && Y5 <= G7 ? "ok" : "not ok";
        var Y13 = ["3", "5"].includes(G3) ? "Active" : "Inactive";
        var Y14 = Y5 >= 0.5 * G7 && Y5 <= G7 ? "ok" : "not ok";
        var Y15 = G9 === "Yes" && G7 <= 15 ? "Active" : "Inactive";
        var Y16 = Y5 >= 1 && Y5 <= G7 ? "ok" : "not ok";
        var Y17 = (Y11 === "Active" && Y12 === "ok") || (Y13 === "Active" && Y14 === "ok") || (Y15 === "Active" && Y16 === "ok") ? "Accuracy check is ok" : "Accuracy check is not ok";
        var Y18 = Y10;
        var Y19 = Y17;
        ("Y5:", Y5);
        ("Y6:", Y6);
        ("Y7:", Y7);
        ("Y8:", Y8);
        ("Y9:", Y9);
        ("Y10:", Y10);
        ("Y11:", Y11);
        ("Y12:", Y12);
        ("Y13:", Y13);
        ("Y14:", Y14);
        ("Y15:", Y15);
        ("Y16:", Y16);
        ("Y17:", Y17);
        ("Y18:", Y18);
        ("Y19:", Y19);

        // LAtEXes
        var LMT1 = String.raw`\rho_{(75°)} = \mathbf{\textcolor{#1976d2}{${Y1.toFixed(4)}}} \text(ohm.mm2/m)`;
        var LMT2 = String.raw`R_{L} = \frac{\rho L_c}{A_c} = \mathbf{\textcolor{#1976d2}{${Y2.toFixed(4)}}} \text(ohm)`;
        var LMT3 = String.raw`\frac{P_{rn}}{I_{sn}^2} = \mathbf{\textcolor{#1976d2}{${Y3.toFixed(4)}}} \text(ohm)`;
        var LMT4 = String.raw`R_{act} = 2R_L + \sum \frac{P_n}{I_{sn}^2} = \mathbf{\textcolor{#1976d2}{${Y4.toFixed(4)}}} \text(ohm)`;
        var LMT5 = String.raw`P_{act} = R_{act} I_{sn}^2 = \mathbf{\textcolor{#1976d2}{${Y5.toFixed(4)}}}`;
        var LMT6 = String.raw`FS \frac{R_{ct} + R_{cn}}{R_{ct} + R_{act}} = \mathbf{\textcolor{#1976d2}{${Y6.toFixed(4)}}}`;
        var LMT7 = String.raw`I_{d-\text{max(sec.)}} \geq \text{min}(I_{f-\text{max(sec.)}}, I_{fs-\text{max(sec.)}}) `;
        var LMT8 = String.raw`I_{d-\text{max(sec.)}} = \mathbf{\textcolor{#1976d2}{${Y7}}} \text(A)`;
        var LMT9 = String.raw`I_{f-\text{max(sec.)}} = I_{f-\text{max}} \left( \frac{I_{sn}}{I_{pn}} \right) = \mathbf{\textcolor{#1976d2}{${Y8.toFixed(4)}}} \text(A)`;
        var LMT10 = String.raw`I_{fs-\text{max(sec.)}} = 1.1 FS_{\text{act}} \times I_{sn} = \mathbf{\textcolor{#1976d2}{${Y9.toFixed(4)}}} \text(A)`;
        var LMT11 = String.raw`0.25 P_{cn} \leq P_{act} \leq P_{cn}`;
        var LMT12 = String.raw`0.5 P_{cn} \leq P_{act} \leq P_{cn}`;
        var LMT13 = String.raw`1 \leq P_{act} \leq P_{cn} \quad \text{(for } P_{cn} \leq 15 \text{ VA)}`;



        return (
            <Fragment>
                <div style={{ background: "white", overflowY: "auto" }}>
                    <div ref={this.pdfRef} className='PdfHolder w_210_mm'>
                        <div className="pdf-container position-relative">
                            <div className="pdf-content">
                                {/* Device Information */}
                                <div className='mt-4 col-12 center justify-content-start row'>
                                    <h3 className="section-title section_title_Sub">
                                        <CableIcon className='pdfIcons'></CableIcon>
                                        Device Information
                                    </h3>
                                    <div className="info-item col-5">
                                        <span className="label">Metering Device:</span>
                                        <span className="value">{F1}</span>
                                    </div>
                                    <div className="info-item col-5">
                                        <span className="label">Device Name:</span>
                                        <span className="value">{F2}</span>
                                    </div>
                                    <div className="info-item col-5">
                                        <span className="label">Irn (A):</span>
                                        <span className="value">{F3}</span>
                                    </div>
                                    <div className="info-item col-5">
                                        <span className="label">Burden Phase-Prn (VA):</span>
                                        <span className="value">{F4}</span>
                                    </div>
                                    <div className="info-item col-5">
                                        <span className="label">Device max. current, Id-max (A):</span>
                                        <span className="value">{F5}</span>
                                    </div>
                                    <div className="info-item col-5">
                                        <span className="label">Max. fault current, If-max (kA):</span>
                                        <span className="value">{F6}</span>
                                    </div>
                                    <div className="info-item col-5">
                                        <span className="label">Standard:</span>
                                        <span className="value">{F7}</span>
                                    </div>
                                </div>

                                {/* Conductor Information */}
                                <div className='mt-4 col-12 center justify-content-start row'>
                                    <h3 style={{ background: "darkslateblue" }} className="section-title section_title_Sub">
                                        <CompareArrowsIcon className='pdfIcons'></CompareArrowsIcon>
                                        Conductor Information
                                    </h3>
                                    <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                                        <InfoIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}></InfoIcon>
                                        Selected material: {H3}
                                    </h3>
                                    <div className="info-item col-5">
                                        <span className="label">Length (m):</span>
                                        <span className="value">{H1}</span>
                                    </div>
                                    <div className="info-item col-5">
                                        <span className="label">Cross section-Ac (mm²):</span>
                                        <span className="value">{H2}</span>
                                    </div>
                                </div>

                                {/* CT Information */}
                                <div className='mt-4 col-12 center justify-content-start row'>
                                    <h3 style={{ background: "indianred" }} className="section-title section_title_Sub">
                                        <BoltIcon className='pdfIcons'></BoltIcon>
                                        CT Information
                                    </h3>
                                    <div className="info-item col-5">
                                        <span className="label">CT name:</span>
                                        <span className="value">{G1}</span>
                                    </div>
                                    <div className="info-item col-5">
                                        <span className="label">CT Standard:</span>
                                        <span className="value">{G2}</span>
                                    </div>
                                    <div className="info-item col-5">
                                        <span className="label">CT Class:</span>
                                        <span className="value">{G3}</span>
                                    </div>
                                    <div className="info-item col-5">
                                        <span className="label">Primary current, Ipn (A):</span>
                                        <span className="value">{G4}</span>
                                    </div>
                                    <div className="info-item col-5">
                                        <span className="label">Secondary current, Isn (A):</span>
                                        <span className="value">{G5}</span>
                                    </div>
                                    <div className="info-item col-5">
                                        <span className="label">Security Factor, FS:</span>
                                        <span className="value">{G6}</span>
                                    </div>
                                    <div className="info-item col-5">
                                        <span className="label">Rated Burden, Pcn (VA):</span>
                                        <span className="value">{G7}</span>
                                    </div>
                                    <div className="info-item col-5">
                                        <span className="label">CT Resistance @ 75°C, Rct (ohm):</span>
                                        <span className="value">{G8}</span>
                                    </div>
                                    <div className="info-item col-5">
                                        <span className="label">Extended Burden Range:</span>
                                        <span className="value">{G9}</span>
                                    </div>

                                </div>

                                {/* Additional Equipment */}
                                <div className='mt-4 col-12 center justify-content-start row'>
                                    <h3 className="section-title section_title_Sub">
                                        <PlaylistAddCheckCircleIcon className='pdfIcons'></PlaylistAddCheckCircleIcon>
                                        Additional Equipment
                                    </h3>
                                    {AdditionalEquipment.map((equip, index) => (
                                        <div key={index} className="info-item col-5">
                                            <span className="label">{equip.name || 'N/A'}:</span>
                                            <span className="value">Rated Current: {equip.ratedCurrent || 'N/A'} A, Rated Burden: {equip.ratedBurden || 'N/A'} VA</span>
                                        </div>
                                    ))}
                                </div>


                                <div className='mt-4 col-12 center justify-content-start row'>
                                    <h3 className="section-title section_title_Sub">
                                        Calculation Note Based on IEC61869-2 Standard:
                                    </h3>


                                    <section className="section center justify-content-around row">
                                        <div className="info-item col-12 center Remarks justify-content-start align-items-start flex-column">

                                            <h3 className="section-title section_title_Sub2 ">Requirement 1:</h3>
                                            <p className="valueSpecial">{`In order to protect the connected measuring equipment in case of fault currents the connected measuring instrument shall be able to withstand the total RMS value of thesecondary current at the operating instrument security factor (FS').`}</p>

                                        </div>
                                    </section>

                                    <section className="section center justify-content-around row">
                                        <div className="info-item col-12 center Remarks justify-content-start align-items-start flex-column">

                                            <h3 className="section-title section_title_Sub2 ">Requirement 2:</h3>
                                            <p className="valueSpecial">{`Moreover, in order to assure the measuring accuracy, the total effective connected burden shall lie in the following range in relation to the rated output of the current transformer:
▫ Measuring class 0.1, 0.2/0.2S, 0.5/0.5S, 1: 25% to 100% of the rated output
▫ Measuring class 3 and 5: 50% to 100% of the rated output

Note: In additioin,For all measuring classes with extended burden range, the ratio error and phase diplacement  shall not exceed to limits for the range of secondary burden from 1 VA to rated burden. The maximum rated output is limited to 15 VA.`}</p>

                                        </div>
                                    </section>




                                </div>

                                <div className='mt-4 col-12 center justify-content-start row'>
                                    <h3 className="section-title section_title_Sub">
                                        Wire resistance (75°):
                                    </h3>

                                    <div className="d-flex row col-12">

                                        <div className="info-item  col-9 justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                                            <InlineMath math={LMT1} />
                                        </div>
                                        <div className="info-item  col-9 justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                                            <InlineMath math={LMT2} />
                                        </div>


                                    </div>
                                </div>

                                <div className='mt-4 col-12 center justify-content-start row'>
                                    <h3 className="section-title section_title_Sub">
                                        Rated burden:
                                    </h3>

                                    <div className="d-flex row col-12">

                                        <div className="info-item  col-6 justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                                            <InlineMath math={LMT3} />
                                        </div>


                                    </div>
                                </div>



                                <div className='mt-4 col-12 center justify-content-start row'>
                                    <h3 className="section-title section_title_Sub">
                                        Actual Burden:
                                    </h3>

                                    <div className="d-flex row col-12">

                                        <div className="info-item  col-9 justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                                            <InlineMath math={LMT4} />
                                        </div>

                                        <div className="info-item  col-9 justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                                            <InlineMath math={LMT5} />
                                        </div>

                                    </div>
                                </div>
                                <div className='mt-4 col-12 center justify-content-start row'>
                                    <h3 className="section-title section_title_Sub">
                                        Actual Security Factor:
                                    </h3>

                                    <div className="d-flex row col-12">


                                        <div className="info-item col-5">
                                            <span className="label">Extended Burden Range:</span>
                                            <span className="value">
                                                <div className="info-item  col-12 justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                                                    <InlineMath math={LMT6} />
                                                </div>

                                            </span>
                                        </div>

                                    </div>
                                </div>


                                <div className='mt-4 col-12 center justify-content-start row'>
                                    <h3 className="section-title section_title_Sub">
                                        Requierement 1: Security
                                    </h3>

                                    <section className="section center justify-content-around row">
                                        <div className="info-item col-12 center Remarks justify-content-start align-items-start flex-column">

                                            <h3 className="section-title section_title_Sub2 ">Requirement 1:</h3>
                                            <p className="valueSpecial">{`In order to secure operation of device, the through fault current should be smaller than maximum permisible current of device:`}</p>

                                        </div>
                                    </section>

                                    <div className="info-item  col-12 justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                                        <InlineMath math={LMT7} />
                                    </div>

                                    <h3 className='section-title m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                                        <SecurityIcon className='pdfIconsSecondry'></SecurityIcon>
                                        Maximum permisible current in secondary side:</h3>

                                    <div className="info-item  col-12 justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                                        <InlineMath math={LMT8} />
                                    </div>

                                    <h3 className='section-title m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                                        <SecurityIcon className='pdfIconsSecondry'></SecurityIcon>
                                        Maximum fault current in secondary side:</h3>

                                    <div className="info-item  col-12 justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                                        <InlineMath math={LMT9} />
                                    </div>

                                    <h3 className='section-title m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                                        <SecurityIcon className='pdfIconsSecondry'></SecurityIcon>
                                        Maximum fault current in secondary side considering CT saturation:</h3>

                                    <div className="info-item  col-12 justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                                        <InlineMath math={LMT10} />
                                    </div>

                                    <MeterCTApproval Text={"Result for Secuirty:"} Condition={F5 > Math.min(Y8, Y9) && Y7 >= Math.min(Y8, Y9)} />



                                </div>



                                <div>
                                    {Y15 === 'Active' ? (
                                        <>
                                            <h3 className='section-title m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                                                <SecurityIcon className='pdfIconsSecondry' />
                                                Condition3: CT with extended burden range
                                            </h3>

                                            <div className="info-item col-5">
                                                <span className="label">Status3 (Active,Inactive):</span>
                                                <span className="value">{Y15}</span>
                                            </div>

                                            <div className="info-item col-12 justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                                                <InlineMath math={LMT13} />
                                            </div>

                                            <div className="info-item col-5">
                                                <span className="label">Result3:</span>
                                                <span className="value">{Y16}</span>
                                            </div>
                                        </>
                                    ) : Y11 === 'Active' ? (
                                        <>
                                            <h3 className='section-title m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                                                <SecurityIcon className='pdfIconsSecondry' />
                                                Condition1: CT class=0.1,0.2,0.2s,0.5,0.5s,1
                                            </h3>

                                            <div className="info-item col-5">
                                                <span className="label">Status1 (Active,Inactive):</span>
                                                <span className="value">{Y11}</span>
                                            </div>

                                            <div className="info-item col-12 justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                                                <InlineMath math={LMT11} />
                                            </div>

                                            <div className="info-item col-5">
                                                <span className="label">Result1:</span>
                                                <span className="value">{Y12}</span>
                                            </div>
                                        </>
                                    ) : Y13 === 'Active' ? (
                                        <>
                                            <h3 className='section-title m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                                                <SecurityIcon className='pdfIconsSecondry' />
                                                Condition2: CT class=3,5
                                            </h3>

                                            <div className="info-item col-5">
                                                <span className="label">Status2 (Active,Inactive):</span>
                                                <span className="value">{Y13}</span>
                                            </div>

                                            <div className="info-item col-12 justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                                                <InlineMath math={LMT12} />
                                            </div>

                                            <div className="info-item col-5">
                                                <span className="label">Result2:</span>
                                                <span className="value">{Y14}</span>
                                            </div>
                                        </>
                                    ) : null}
                                </div>



                                <div className='mt-4 col-12 center justify-content-start row'>
                                    <h3 className="section-title section_title_Sub">
                                        Summary of Results
                                    </h3>

                                    <MeterCTApproval Text={"Result for Secuirty:"} Condition={F5 > Math.min(Y8, Y9) && Y7 >= Math.min(Y8, Y9)} />

                                    <METERCTAccuracyApproval Text={"Result for Accuracy:"} Condition={(Y11 == 'Active' && Y12 == 'ok') || (Y13 == 'Active' && Y14 == "ok") || (Y15 == 'Active' && Y16 == 'ok')}></METERCTAccuracyApproval>

                                </div>


                            </div>
                        </div>
                    </div>
                </div>
                <button onClick={this.exportToPDF} className="pdf-button">
                    Export to PDF
                </button>
                <ExcelComponentMeterCT></ExcelComponentMeterCT>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    MeteringDevice: state.example.MeterCTInfo.MeteringDevice,
    CurrentTransformer: state.example.MeterCTInfo.CurrentTransformer,
    Conductor: state.example.MeterCTInfo.Conductor,
    AdditionalEquipment: state.example.MeterCTInfo.AdditionalEquipment,
    MeterCTInfo: state.example.MeterCTInfo
});

export default connect(mapStateToProps)(PdfComponentMeterCT);