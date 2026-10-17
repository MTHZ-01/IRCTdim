// import ExcelComponent from './ExcelComponent.jsx';
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
import InfoIcon from '@mui/icons-material/Info';
import CableIcon from '@mui/icons-material/Cable';
import BatteryUnknownIcon from '@mui/icons-material/BatteryUnknown';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import moment from "moment";
import SecurityIcon from '@mui/icons-material/Security';
import IECPX_Approval from './IECPX_Approval.jsx';
import IEXP_Approval from './IEXP_Approval.jsx';
import IECTP_Approval from './IECTP_Approval.jsx';
import ExcelComponent from './ExcelComponent.jsx';
import 'katex/dist/katex.min.css';

import AddTaskIcon from '@mui/icons-material/AddTask'
import CancelIcon from '@mui/icons-material/Cancel'


export class PdfComponent extends Component {
  constructor(props) {
    super(props)
    this.pdfRef = React.createRef()
  }




  handleInputChange = (index, field, value) => {
    const newRows = [...this.state.rows]
    newRows[index][field] = value
    this.setState({ rows: newRows })
  }

  handleAddRow = () => {
    this.setState((prevState) => ({
      rows: [...prevState.rows, { rev: '', date: '', prepared: '', checked: '', authorized: '', approved: '', issuedFor: '' }],
    }))
  }

  handleRemoveRow = (index) => {
    const newRows = this.state.rows.filter((_, i) => i !== index)
    this.setState({ rows: newRows })
  }

  // Function to export the component to PDF
  exportToPDF = () => {
    const input = this.pdfRef.current

    html2canvas(input, { scale: 1.5 }).then((canvas) => {
      // Calculate dimensions based on content
      const contentWidth = 210 // A4 width in mm
      const contentHeight = (canvas.height * contentWidth) / canvas.width // Scale proportionally

      // Create a PDF with a dynamic height
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [contentWidth, contentHeight], // Custom height based on content
      })

      // Add the entire content as a single image
      pdf.addImage(canvas, 'JPEG', 0, 0, contentWidth, contentHeight)

      // Save the PDF
      pdf.save('report.pdf')
    })
  }




  // Auto-export PDF when component mounts
  componentDidMount() {
    // this.exportToPDF()
  }

  StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }))

  StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }))

  createData = (name, calories, fat, carbs, protein) => {
    return { name, calories, fat, carbs, protein }
  }

  rows = [
    this.createData('Frozen yoghurt', 1, 'XX/XX/XX', 'RAF', 'RAF'),
    this.createData('Ice cream sandwich', 2, 'XX/XX/XX', 'RAF', 'RAF'),
    this.createData('Eclair', 3, 'XX/XX/XX', 'RAF', 'RAF', 'RAF'),
    this.createData('Cupcake', 4, 'XX/XX/XX', 'RAF', 'RAF'),
    this.createData('Gingerbread', 5, 'XX/XX/XX', 'RAF', 'RAF'),
  ]

  render() {
    const selectedData = this.props.OutPort ? this.props.data_OP : this.props.data;

    var {
      ShouldShowForm = "NaN",
      ShowPDFGen = "NaN",

      Project = "NaN",
      RefrenceNo = "NaN",
      Revision = "NaN",
      RemarkA = "NaN",
      RemarkG = "NaN",
      Date = "NaN",
      NominalVoltage = "NaN",
      SystemFrequency = "NaN",
      RatedSCcurrent = "NaN",
      ConductorTemprature = "NaN",
      Mode = "NaN",
      imgUrlClient = "NaN",
      imgUrlConsultant = "NaN",
      imgUrlContractor = "NaN",
      clientName = "NaN",
      consultantName = "NaN",
      contractorName = "NaN",
      rows = [],
      DoucumentTitle = "NaN",
      DocumentNumber = "NaN",
    } = selectedData.FirstPage || {};

    var SecondPageData = selectedData.SecondPage || "Inv";
    var ThirdPageData = selectedData.ThirdPage || "Inv";
    var FourthPageData = selectedData.FourthPage || "Inv";

    ("SecondPageData SecondPageData SecondPageData SecondPageData ", SecondPageData)


    var Z1 = 0
    var Z2 = 0
    var Z3 = 0
    var Z4 = 0
    var Z5 = 0
    var Z6 = 0
    var Z7 = 0
    var Z8 = 0
    var Z9 = 0
    var Z10 = 0
    var Z11 = 0
    var Z12 = 0
    var Z13 = 0
    var Z14 = 0
    var Z15 = 0
    var Z16 = 0
    var Z17 = 0
    var Z18 = 0
    var Z19 = 0
    var Z20 = 0
    var Z21 = 0
    var Z22 = 0
    var Z23 = 0
    var Z24 = 0
    var Z25 = 0
    var Z26 = 0
    var Z27 = 0
    var Z28 = 0
    var Z29 = 0
    var Z30 = 0
    var Z31 = 0
    var Z32 = 0
    var Z33 = 0
    var Z34 = 0
    var Z35 = 0
    var Z36 = 0
    var Z37 = 0
    var Z38 = 0
    var Z39 = 0
    var Z40 = 0
    var Z41 = 0
    var Z42 = 0
    var Z43 = 0
    var Z44 = 0
    var Z45 = 0
    var Z46 = 0
    var Z47 = 0
    var Z48 = 0
    var Z49 = 0
    var Z50 = 0
    var Z51 = 0
    var Z52 = 0
    var Z53 = 0
    var Z54 = 0
    var Z55 = 0
    var Z56 = 0
    var Z57 = 0
    var Z58 = 0
    var Z59 = 0
    var Z60 = 0
    var Z61 = 0
    var Z62 = 0
    var Z63 = 0
    var Z64 = 0
    var Z65 = 0
    var Z66 = 0
    var Z67 = 0
    var Z68 = 0
    var Z69 = 0
    var Z70 = 0
    var Z71 = 0
    var Z72 = 0
    var Z73 = 0
    var Z74 = 0
    var Z75 = 0
    var Z76 = 0
    var Z77 = 0
    var Z78 = 0
    var Z79 = 0
    var Z80 = 0
    var Z81 = 0
    var Z82 = 0
    var Z83 = 0
    var Z84 = 0
    var Z85 = 0
    var Z86 = 0
    var Z87 = 0
    var Z88 = 0
    var Z89 = 0
    var Z90 = 0
    var Z91 = 0
    var Z92 = 0
    var Z93 = 0
    var Z94 = 0
    var Z95 = 0
    var Z96 = 0
    var Z97 = 0
    var Z98 = 0
    var Z99 = 0
    var Z100 = 0
    var Z101 = 0
    var Z102 = 0
    var Z103 = 0
    var Z104 = 0
    var Z105 = 0
    var Z106 = 0
    var Z107 = 0
    var Z108 = 0
    var Z109 = 0
    var Z110 = 0
    var Z111 = 0
    var Z112 = 0
    var Z113 = 0
    var Z114 = 0
    var Z115 = 0
    var Z116 = 0
    var Z117 = 0
    var Z118 = 0
    var Z119 = 0
    var Z120 = 0
    var Z121 = 0
    var Z122 = 0
    var Z123 = 0
    var Z124 = 0
    var Z125 = 0
    var Z126 = 0
    var Z127 = 0
    var Z128 = 0
    var Z129 = 0
    var Z130 = 0
    var Z131 = 0
    var Z132 = 0
    var Z133 = 0
    var Z134 = 0
    var Z135 = 0
    var Z136 = 0
    var Z137 = 0
    var Z138 = 0
    var Z139 = 0
    var Z140 = 0
    var Z141 = 0
    var Z142 = 0
    var Z143 = 0
    var Z144 = 0
    var Z145 = 0
    var Z146 = 0
    var Z147 = 0
    var Z148 = 0
    var Z149 = 0
    var Z150 = 0
    var Z151 = 0
    var Z152 = 0
    var Z153 = 0
    var Z154 = 0
    var Z155 = 0
    var Z156 = 0
    var Z157 = 0
    var Z158 = 0
    var Z159 = 0
    var Z160 = 0
    var Z161 = 0
    var Z162 = 0
    var Z163 = 0
    var Z164 = 0
    var Z165 = 0
    var Z166 = 0
    var Z167 = 0
    var Z168 = 0
    var Z169 = 0
    var Z170 = 0
    var Z171 = 0
    var Z172 = 0
    var Z173 = 0
    var Z174 = 0
    var Z175 = 0
    var Z176 = 0
    var Z177 = 0
    var Z178 = 0
    var Z179 = 0
    var Z180 = 0
    var Z181 = 0
    var Z182 = 0
    var Z183 = 0
    var Z184 = 0
    var Z185 = 0
    var Z186 = 0
    var Z187 = 0
    var Z188 = 0
    var Z189 = 0
    var Z190 = 0



    const A1 = SecondPageData.Manufacture || "Inv"
    const A2 = SecondPageData.RelayType || "Inv"
    const A3 = SecondPageData.ProtectionFunction || "Inv"
    const A4 = SecondPageData.IrnA || 0
    const A5 = SecondPageData.BurdenPhaseVA || 0
    const A6 = SecondPageData.Ith_Ir || 0
    const A7 = SecondPageData.Cal_Acc_ToVA || 0

    const B1_2 = parseFloat(SecondPageData.Iph_two) || 0
    const B1_3 = SecondPageData.Iph_one || 0
    const B1_4 = parseFloat(SecondPageData.Ie_two) || 0
    const B1_5 = SecondPageData.Iee_one || 0
    const B1_6 = SecondPageData.IPh_max || 0
    const B1_7 = SecondPageData.Ie_max || 0

    const B2_2 = parseFloat(SecondPageData.if_max_int_HEFP) || 0
    const B2_3 = parseFloat(SecondPageData.if_max_ext_HEFP) || 0
    const B2_4 = parseFloat(SecondPageData.Is) || 0
    const B2_5 = parseFloat(SecondPageData.Is) || 0

    const B3_2 = SecondPageData.Us || 0
    const B3_3 = SecondPageData.Ifs || 0
    const B3_4 = SecondPageData.TsysDP || 0
    const B3_5 = SecondPageData.RPrime || 0
    const B3_6 = SecondPageData.XPrime || 0
    const B3_7 = SecondPageData.Length || 0
    const B3_8 = SecondPageData.Z1Set || 0

    const B4_2 = parseFloat(SecondPageData.if_max_int_LDP) || 0
    const B4_3 = parseFloat(SecondPageData.if_max_ext_LDP) || 0
    const B4_4 = parseFloat(SecondPageData.TsysLDP) || 0
    const B4_5 = parseFloat(SecondPageData.XR) || 0
    const B4_6 = parseFloat(SecondPageData.K2) || 0

    const B5_2 = parseFloat(SecondPageData.if_max_int_TDP) || 0
    const B5_3 = parseFloat(SecondPageData.if_max_ext_TDP) || 0
    const B5_4 = parseFloat(SecondPageData.TsysTDP) || 0
    const B5_5 = parseFloat(SecondPageData.Vk2) || 0
    const B5_6 = parseFloat(SecondPageData.R2) || 0
    const B5_7 = parseFloat(SecondPageData.Vk3) || 0
    const B5_8 = parseFloat(SecondPageData.R3) || 0
    const B5_9 = parseFloat(SecondPageData.nCT) || 0

    const B6_2 = parseFloat(SecondPageData.if_max_int_BDP) || 0
    const B6_3 = parseFloat(SecondPageData.if_max_ext_BDP) || 0


    const C1 = ThirdPageData.CTName || "Inv"
    const C3 = ThirdPageData.SelectedCtClass || "Inv"
    const C4 = parseFloat(ThirdPageData.CTPrimary) || 0
    const C5 = parseFloat(ThirdPageData.CTSecondary) || 0
    const C6 = parseFloat(ThirdPageData.ALF_K_SCC) || 0
    const C7 = parseFloat(ThirdPageData.KTD) || 0
    const C8 = parseFloat(ThirdPageData.Sr) || 0
    const C9 = parseFloat(ThirdPageData.Rr) || 0
    const C10 = parseFloat(ThirdPageData.CTResistance) || 0
    const C11 = parseFloat(ThirdPageData.EK) || 0 || 0
    const C12 = parseFloat(ThirdPageData.Ie) || 0
    const C13 = parseFloat(ThirdPageData.Vt) || 0
    const C14 = parseFloat(ThirdPageData.Vk) || 0
    const C15 = parseFloat(ThirdPageData.Ik) || 0

    const Cal_Acc_ToVA = SecondPageData.Cal_Acc_ToVA || 0

    var Z1 = 0
    if (FourthPageData.Material == "Cu") {
      Z1 = 0.0225
    } else if (FourthPageData.Material == "Al") {
      Z1 = 0.0376
    }
    // var Z1_Use 

    var Z2 = Z1 * (FourthPageData.Length / FourthPageData.CrossSection) || 0
    var Z2_Use = `\\mathbf{R_L = \\frac{\\rho L_c}{A_c}} = \\mathbf{\\textcolor{#1976d2}{${Z2.toFixed(2)}}} \\text{\\ (ohm)}` || "Inv"

    var Z3 = SecondPageData.BurdenPhaseVA / (SecondPageData.IrnA ** 2)
    var Z3_Use = `\\mathbf{R_{rn} = \\frac{P_{rn}}{I_{sn}^2} = \\mathbf{\\textcolor{#1976d2}{${Z3.toFixed(2)}}} \\text{(ohm)}}` || "Inv"

    var Z5 = ThirdPageData.Sr / ThirdPageData.CTSecondary ** 2
    var Z4 = Number(ThirdPageData.ALF_K_SCC) * (Z5 + Number(ThirdPageData.CTResistance)) / (Z3 + Z2 + Number(ThirdPageData.CTResistance))


    var Z4_Use = `\\mathbf{{ALF}}_{actual} = \\frac{\\mathbf{\\text{ALF}}(\\mathbf{R}_{cn} + \\mathbf{R}_{ct})}{\\mathbf{R}_{rn} + \\mathbf{R}_L + \\mathbf{R}_{ct}} = \\mathbf{\\textcolor{#1976d2}{${Z4.toFixed(2)}}}` || "Inv"
    var Z5_Use = `\\mathbf{R_{cn}} = \\frac{\\mathbf{P_{cn}}}{\\mathbf{I_{sn}^2}} = \\mathbf{\\textcolor{#1976d2}{${Z5}}} \\ \\text{(ohm)}` || "Inv"


    var Z6 = Number(ThirdPageData.ALF_K_SCC) * (Number(ThirdPageData.Rr) + Number(ThirdPageData.CTResistance)) / (Z3 + Z2 + Number(ThirdPageData.CTResistance))

    var Z6_Use = `
    \\mathbf{K_{SSC_{actual}}} = \\mathbf{K_{SSC} \\frac{R_r + R_{ct}}{R_{rn} + R_L + R_{ct}} = \\textcolor{#1976d2}{${Z6.toFixed(2)}}}
    `|| "Inv"



    const IDMT_Setting = `\\mathbf{\\text{IDMT setting,} \\ I_{ph>} \\text{(A)} = \\textcolor{#1976d2}{${SecondPageData.Iph_one}}} \\ \\text{(A)}` || "Inv"
    const Instantaneous_OC_Setting = `\\mathbf{\\text{Instantaneous overcurrent setting,} \\ I_{ph>>} \\text{(A)} = \\textcolor{#1976d2}{${SecondPageData.Iph_two}}}  \\text{(A)}` || "Inv"
    const System_Max_Fault_Current = `\\mathbf{\\text{System maximum fault current,} \\ I_{phmax} \\text{(kA)} = \\textcolor{#1976d2}{${SecondPageData.IPh_max}}}  \\text{(KA)}` || "Inv"


    var Z8 = Math.min(
      SecondPageData.IPh_max * 1000 * ThirdPageData.CTSecondary / ThirdPageData.CTPrimary,
      31 * SecondPageData.Iph_one
    ) || "Inv"


    var Z7 = .5 * Z8 * (Number(ThirdPageData.CTResistance) + Z2 + Z3)

    const Vk_req_Formula = `\\mathbf{V_{k-req} \\geq \\frac{I_{cp}}{2} (R_{ct} + R_L + R_{rn})}` || "Inv"
    const Vk_req_Value = `\\mathbf{V_{k-req} = \\textcolor{#1976d2}{${Z7}}} \\ \\text{(V)}` || "Inv"
    const Icp_Formula = `\\mathbf{I_{cp} = min(I_{emax-sec}, 31 I_{e>})}` || "Inv"
    const Icp_Value = `\\mathbf{I_{cp} = \\textcolor{#1976d2}{${Z8}}} \\ \\text{(A)}` || "Inv"


    // %Z9=1.3*Z7/(C5*(C10+Z2+Z3))
    var Z9 = 1.3 * Z7 / (Number(ThirdPageData.CTSecondary) * ((Number(ThirdPageData.CTResistance) + Z2 + Z5)))
    // %Z10=1.3*Z7/(C5*C7*(C10+Z2+Z3))
    var Z10 = 1.3 * Z7 / (C5 * C7 * (C10 + Z2 + Z3))
    var Eal_req_Formula_1 = `\\mathbf{E_{al-req} = 1.3 V_{k-req} = ALF_{req} I_{sn} (R_{ct} + R_{L} + R_{rn})}`;
    var Eal_req_Formula_2 = `\\mathbf{ALF_{req} = \\textcolor{#1976d2}{${Z9.toFixed(2)}}}`;
    var K_SSC_Formula_1 = `\\mathbf{E_{al-req} = 1.3 V_{k-req} = K_{td} K_SCC_{req} I_{sn} (R_{ct} + R_{r})}`;
    var K_SSC_Formula_2 = `\\mathbf{K_{SCC_{req}} = \\textcolor{#1976d2}{${Z10.toFixed(2)}}}`;

    var Z12 = SecondPageData.Iph_two || 0
    var Z11 = Z12 * (Z2 + Z3 + C10) || 0
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    console.log("Z11", Z11)
    console.log("Z12", Z12)
    console.log("C10", C10)
    console.log("Z2", Z2)
    console.log("Z3", Z3)
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    var Z11Formula = `\\mathbf{ V_{k-req} \\geq I_{sp} (R_{ct} + R_{y} + R_{rn}) }` || "Inv"
    const VKReqFormula = `\\mathbf{ V_{k-req} = \\textcolor{#1976d2}{${!isNaN(Number(Z11)) ? Number(Z11).toFixed(2) : 0}} }`;
    const IspFormula = `\\mathbf{ I_{sp} = I_{ph>>} = \\textcolor{#1976d2}{${!isNaN(Number(Z12)) ? Number(Z12).toFixed(2) : 0}} }`;



    // %Z13=1.3*Z11/(C5*(C10+Z2+Z3))
    // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    // console.log("Z11", Z11)
    // console.log("C5", C5)
    // console.log("C10", C10)
    // console.log("Z2", Z2)
    // console.log("Z3", Z3)
    // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    // %Z13=1.3*Z11/(C5*(C10+Z2+Z3))
    var Z13 = 1.3 * Z11 / (C5 * (C10 + Z2 + Z3))
    const EALReqFormula = `\\mathbf{ E_{al-req} = 1.3 V_{k-req} = ALF_{req} I_{sn} (R_{ct} + R_{L} + R_{rn}) }` || "Inv"
    const AlfReqFormulaForEAL = `\\mathbf{ ALF_{req} = \\textcolor{#1976d2}{${Z13.toFixed(2)}}  }`

    // %Z14=1.3*Z11/(C5*C7*(C10+Z2+Z3))
    var Z14 = 1.3 * Z11 / (C5 * C7 * (C10 + Z2 + Z3))
    const K_SSCZ14_main = `\\mathbf{E_{al-req} = 1.3 \\quad V_{k-req} = K_{td} \\cdot K_{SCC_{req}} \\cdot I_{sn} \\cdot (R_{ct} + R_{r})}`
    const K_SSCZ14_value = `K_{SCC_{req}} = \\textcolor{#1976d2}{${Z14.toFixed(2)}}`

    const IDMTSETTINGS = `\\mathbf{\\text{IDMT Setting, } I_{e>} \\text{ (A)} = \\quad \\textcolor{#1976d2}{${Number(SecondPageData.Iee_one).toFixed(2)}}}` || "Inv"
    const IOS = `\\mathbf{\\text{Instantaneous Overcurrent Setting, } I_{e>>} \\text{ (A)} = \\textcolor{#1976d2}{${Number(SecondPageData.Ie_two).toFixed(2)}}}` || "Inv"
    const SMPFC = `\\mathbf{\\text{System Maximum Phase Fault Current, } I_{e max} \\text{ (kA)} = \\quad }` || "Inv"
    const SMPFCAnswer = `\\textcolor{#1976d2}{\\mathbf{${Number(SecondPageData.Ie_max).toFixed(2)}}}` || "Inv"

    var Z16 = Math.min((Number(SecondPageData.Ie_max) * 1000 * Number(ThirdPageData.CTSecondary) / Number(ThirdPageData.CTPrimary)), 31 * Number(SecondPageData.Iee_one))
    var Z15 = .5 * Z16 * (Number(ThirdPageData.CTResistance) + 2 * Z2 + Z3)

    const Vk_req_FormulaIDMT = `\\mathbf{V_{k-req} \\geq \\frac{I_{cp}}{2} (R_{ct} + R_L + R_{rn})}` || "Inv"
    const Vk_req_ValueIDMT = `\\mathbf{V_{k-req} = \\textcolor{#1976d2}{${Z15.toFixed(2)}}} \\ \\text{(V)}` || "Inv"
    const Icn_Formula = `\\mathbf{I_{cn} = min(I_{emax-sec}, 31 I_{e>})}` || "Inv"
    const Icn_Value = `\\mathbf{I_{cp} = \\textcolor{#1976d2}{${Z16.toFixed(2)}}} \\ \\text{(A)}` || "Inv"

    // %Z17=1.3*Z15/(C5*(C10+2Z2+Z3))
    var Z17 = 1.3 * Z15 / (C5 * (C10 + 2 * Z2 + Z3))
    const Eal_req_FormulaIDMT_main = `\\mathbf{E_{al-req} = 1.3 \\quad V_{k-req} = ALF_{req} \\cdot I_{sn} \\cdot (R_{ct} + R_{cn})}`
    const ALF_req_value = `ALF_{req} = \\textcolor{#1976d2}{${Z17.toFixed(2)}}`

    // %Z18=1.3*Z15/(C5*C7*(C10+2Z2+Z3))
    var Z18 = 1.3 * Z15 / (C5 * C7 * (C10 + 2 * Z2 + Z3))
    const K_SSCZ14IDMT_main = `\\mathbf{E_{al-req} = 1.3 \\quad V_{k-req} = K_{td} \\cdot K_{SCC_{req}} \\cdot I_{sn} \\cdot (R_{ct} + R_{r})}`
    const K_SCC_req_value = `K_{SCC_{req}} = \\textcolor{#1976d2}{${Z18.toFixed(2)}}`

    var Z20 = B1_4
    var Z19 = Z20 * (C10 + 2 * Z2 + Z3)




    var Z19Formula = `\\mathbf{ V_{k-req} \\geq I_{sn} (R_{ct} + 2R_{L} + R_{rn}) }` || "Inv"
    var Z19Holder = `\\mathbf{ V_{k-req} = \\textcolor{#1976d2}{${Z19}} }` || "Inv"

    const ISN_IEDOUBLE = `\\mathbf{ I_{sn} = I_{e>>} = \\textcolor{#1976d2}{${Z20}} }` || "Inv"
    // %Z21=1.3*Z19/(C5*(C10+2Z2+Z3))
    var Z21 = 1.3 * Z19 / (C5 * (C10 + 2 * Z2 + Z3))
    const Z21Holder_main = `\\mathbf{E_{al-req} = 1.3 \\quad V_{k-req} = ALF_{req} \\cdot I_{sn} \\cdot (R_{ct} + R_{cn})}`
    const ALF_req_value2 = `ALF_{req} = \\textcolor{#1976d2}{${Z21.toFixed(2)}}`

    // %Z22=1.3*Z19/(C5*C7*(C10+2Z2+Z3))
    var Z22 = 1.3 * Z19 / (C5 * C7 * (C10 + 2 * Z2 + Z3))
    const Z22Holder_main = `\\mathbf{E_{al-req} = 1.3 \\quad V_{k-req} = K_{td} \\cdot K_{SCC_{req}} \\cdot I_{sn} \\cdot (R_{ct} + R_{r})}`
    const K_SCC_req_value2 = `K_{SCC_{req}} = \\textcolor{#1976d2}{${Z22.toFixed(2)}}`

    var Z23 = 1.2 * (B2_3 / B2_4) * (C10 + 2 * Z2)

    const RSFormula = `R_s = 1.2 \\frac{I_{f-max-ext}}{I_s} \\left( R_{ct} + 2R_L \\right) = \\textcolor{#1976d2}\\mathbf{${Z23}} \\text{ (ohm)}` || "Inv"

    var Z24 = 4 * Z23 * B2_4
    const VkReqInequality = `\\boxed{V_{k-req} \\geq 4 R_s I_s}` || "Inv"
    const VkReqEquation = `V_{k-req} = \\textcolor{#1976d2}\\mathbf{${Z24}} \\text{ (V)}` || "Inv"

    // %Z25=1.3*Z24/(C5*(C10+2Z2))
    var Z25 = 1.3 * Z24 / (C5 * (C10 + 2 * Z2))
    const Eal_req_FormulaHIIR_main = `\\mathbf{E_{al-req} = 1.3 \\quad V_{k-req} = ALF_{req} \\cdot I_{sn} \\cdot (R_{ct} + R_{cn})}`
    const ALF_req_value_HIIR = `ALF_{req} = \\textcolor{#1976d2}{${Z25.toFixed(2)}}`

    // %Z26=1.3*Z24/(C5*C7*(C10+2Z2))
    var Z26 = 1.3 * Z24 / (C5 * C7 * (C10 + 2 * Z2))
    const Z26Holder_main = `\\mathbf{E_{al-req} = 1.3 \\quad V_{k-req} = K_{td} \\cdot K_{SCC_{req}} \\cdot I_{sn} \\cdot (R_{ct} + R_{r})}`
    const K_SCC_req_value_Z26 = `K_{SCC_{req}} = \\textcolor{#1976d2}{${Z26.toFixed(2)}}`

    var Z28 = B1_6 * 1000 * (C5 / C4)
    var Z27 = .5 * Z28 * (C10 + Z2 + Z3)
    var Z27Formula = `\\mathbf{V_{k-req} \\geq \\frac{I_{cp}}{2} (R_{ct} + R_L + R_{rn})}` || "Inv"
    var Z27Holder = `\\mathbf{V_{k-req} = \\textcolor{#1976d2}{${Z27.toFixed(2)}}} \\ \\text{(V)}` || "Inv"
    var Z28Formula = `\\mathbf{I_{cn} = I_{phmax-sec} = \\textcolor{#1976d2}{${Z28.toFixed(2)}} } \\ \\text{(A)}   ` || "Inv"

    var Z29 = Math.max(B1_2 / C5, 20)
    const KtdKSSC_Boxed = `\\boxed{K_{td} K_{SSC_1} = ALF_{1} \\geq \\max(I_{ph>>} ÷ I_{sn}, 20)}` || "Inv"
    const KtdKSSC_Value = `K_{td} K_{SSC_1} = ALF_1 \\geq \\mathbf{\\textcolor{#1976d2}{${Z29}}}` || "Inv"

    // %Z30=MAX(Z29,1.3*Z27/(C5*(C10+Z2+Z3)))
    var Z30 = Math.max(Z29, 1.3 * Z27 / (C5 * (C10 + Z2 + Z3)))
    const alfFormula = `\\mathbf{E_{al-req} = 1.3 V_{k-req} = ALF_{2req} I_{sn} (R_{ct} + R_{cn}) }` || "Inv"
    var Z30Holder = `\\boxed{ALF_{Req} = \\max(ALF_{1},ALF_{2}) = \\mathbf{\\textcolor{#1976d2}{${Z30.toFixed(2)}}}}`

    //%Z31=MAX(Z29/C7,(1.3*Z27)/(C5*C7*(C10+Z2+Z3)))
    var Z31 = Math.max(Z29 / C7, (1.3 * Z27) / (C5 * C7 * (C10 + Z2 + Z3)))
    const EAlReq2 = `\\mathbf{E}_{\\mathrm{al-req}} = 1.3 \\cdot V_{\\mathrm{k-req}} = K_{\\mathrm{td}} \\cdot K_{\\mathrm{SCC}_{2\\mathrm{req}}} \\cdot I_{\\mathrm{sn}} \\cdot (R_{\\mathrm{ct}} + R_{\\mathrm{r}})` || "Inv"
    var Z31Holder = `\\boxed{K_SSC_{Req} = \\max(K_SSC_{1},K_SSC_{2}) = \\mathbf{\\textcolor{#1976d2}{${Z31.toFixed(2)}}}}`


    var Z33 = B1_6 * 1000 * C5 / C4
    var Z32 = .5 * Z33 * (C10 + Z2 + Z3)

    var Z32Holder = `\\mathbf{V}_{\\mathrm{k-req}} = \\textcolor{#1976d2}{${Z32.toFixed(2)}} \\ \\text{(V)}` || "Inv"
    var Z33Formula = `\\mathbf{I}_{\\mathrm{cp}} = \\mathbf{I}_{\\mathrm{phmax-sec}} = \\textcolor{#1976d2}{${Z33.toFixed(2)}} \\ \\text{(A)}` || "Inv"


    var Z34 = Math.max(B1_3 / C5, 20)
    var Z34Formula = `\\mathbf{K}_{\\mathrm{td}} \\cdot \\mathbf{K}_{\\mathrm{SSC}_{1}} = \\mathbf{ALF}_{1} \\geq \\max\\left(\\frac{\\mathbf{I}_{\\mathrm{ph}}}{\\mathbf{I}_{\\mathrm{sn}}}, 20\\right) \\ \\text{(A)}` || "Inv"
    var Z34Holder = `\\mathbf{K}_{\\mathrm{td}} \\cdot \\mathbf{K}_{\\mathrm{SSC}_{1}} = \\mathbf{ALF}_{1} \\geq \\textcolor{#1976d2}{\\mathbf{${Z34.toFixed(2)}}} \\ \\text{(A)}` || "Inv"

    // %Z35=MAX(Z34,1.3*Z32/(C5*(C10+Z2+ظ3)))
    var Z35 = Math.max(Z34, 1.3 * Z32 / (C5 * (C10 + Z2 + Z3)))
    var Z35Holder = `\\mathbf{ALF}_{\\mathrm{Req}} = \\max\\left(\\mathbf{ALF}_{\\mathrm{1}}, \\mathbf{ALF}_{\\mathrm{2}}\\right) = \\textcolor{#1976d2}{\\mathbf{${Z35.toFixed(2)}}} \\ \\text{(A)}` || "Inv"

    // %Z36=MAX(Z34/C7,(1.3*Z32)/(C5*C7*(C10 + Z2 + Z3))
    var Z36 = Math.max(Z34 / C7, (1.3 * Z32) / (C5 * C7 * (C10 + Z2 + Z3)))
    var Z36Holder = `\\boxed{K_SSC_{Req} = \\max(K_SSC_{1},K_SSC_{2}) = \\textcolor{#1976d2}\\mathbf{${Z36.toFixed(2)}}}`

    var Z38 = B1_7 * 1000 * C5 / C4
    var Z37 = .5 * Z38 * (C10 + Z2 + Z3)
    var Z37Formula = `\\mathbf{V_{k-req} \\geq \\frac{I_{cn}}{2} (R_{ct} + R_L + R_{rn})}` || "Inv"
    var Z37Holder = `\\mathbf{V_{k-req} = \\textcolor{#1976d2}{${Z37.toFixed(2)}}} \\ \\text{(V)}` || "Inv"
    var Z38Formula = `\\mathbf{I_{cn} = I_{emax-sec} = \\textcolor{#1976d2}{${Z38.toFixed(2)}} } \\ \\text{(A)}   ` || "Inv"


    var Z39 = Math.max(B1_4 / C5, 20)
    const KtdKSSC_BoxedZ39 = `\\boxed{K_{td} K_{SSC_1} = ALF_{1} \\geq \\max(I_{e>>} ÷ I_{sn}, 20)}` || "Inv"
    const KtdKSSC_ValueZ39 = `\\mathbf{K}_{\\mathrm{td}} \\cdot \\mathbf{K}_{\\mathrm{SSC}_{1}} = \\mathbf{ALF}_{1} \\geq \\textcolor{#1976d2}{\\mathbf{${Z39}}}` || "Inv"

    // %Z40=MAX(Z39,1.3*Z37/(C5*(C10+Z2+Z3)))
    var Z40 = Math.max(Z39, 1.3 * Z37 / (C5 * (C10 + Z2 + Z3)))

    const alfFormulaZ40 = `\\mathbf{E_{al-req} = 1.3 V_{k-req} = ALF_{req} I_{sn} (R_{ct} + R_{cn}) }` || "Inv"
    var Z40Holder = `\\boxed{ALF_{Req} = \\max(ALF_{1},ALF_{2}) = \\mathbf{\\textcolor{#1976d2}{${Z40.toFixed(2)}}}}`

    // %Z41=MAX(Z39/C7,(1.3*Z37)/(C5*C7*(C10+Z2+Z3)))
    var Z41 = Math.max(Z39 / C7, (1.3 * Z37) / (C5 * C7 * (C10 + Z2 + Z3)))
    var Z41Holder = `\\boxed{K_SSC_{Req} = \\max(K_SSC_{1},K_SSC_{2}) = \\mathbf{\\textcolor{#1976d2}{${Z41.toFixed(2)}}}}`


    var Z43 = B1_7 * 1000 * C5 / C4
    var Z42 = Z43 * (C10 + Z2 + Z3)

    var Z42Formula = `\\mathbf{V_{k-req} \\geq \\frac{I_{cn}}{2} (R_{ct} + R_{L} + R_{rn})}` || "Inv"
    var Z42Holder = `\\mathbf{V_{k-req} = \\textcolor{#1976d2}{${Z42.toFixed(2)}}} \\ \\text{(V)}` || "Inv"
    var Z43Formula = `\\mathbf{I_{cn} = I_{emax-sec} = \\textcolor{#1976d2}{${Z43.toFixed(2)}} } \\ \\text{(A)}` || "Inv"

    var Z44 = Math.max(B1_5 / C5, 20)
    const KtdKSSC_ValueZ44 = `K_{td} K_{SSC_1} = ALF_1 \\geq \\mathbf{\\textcolor{#1976d2}{${Z44}}}` || "Inv"

    // %Z45=MAX(Z44,1.3*Z42/(C5*(C10+Z2+Z3)))
    var Z45 = Math.max(Z44, 1.3 * Z42 / (C5 * (C10 + Z2 + Z3)))
    var Z46 = Math.max(Z44 / C7, (1.3 * Z42) / (C5 * C7 * (C10 + C9)))
    var Z45Holder = `\\boxed{ALF_{Req} = \\max(ALF_{1},ALF_{2}) = \\mathbf{\\textcolor{#1976d2}{${Z45.toFixed(2)}}}}`
    var Z46Holder = `\\boxed{K_SSC_{Req} = \\max(K_SSC_{1},K_SSC_{2}) = \\mathbf{\\textcolor{#1976d2}{${Z46.toFixed(2)}}}}`


    var Z48 = Z48 = Math.min((B1_6 * 1000 * C5 / C4), 31 * B1_3)
    var Z47 = 0.5 * Z48 * (C10 + Z2 + Z3)


    var Z47Formula = `\\mathbf{V_{k-req} \\geq \\frac{I_{cp}}{2} (R_{ct} + R_L + R_{rn})}` || "Inv"
    var Z47Holder = `\\mathbf{V_{k-req} = \\textcolor{#1976d2}{${Z47.toFixed(2)}}} \\ \\text{(V)}` || "Inv"
    var Z48Formula = `\\mathbf{I_{cp} = \\min(I_{\\text{phmax-sec}}, 31 I_{ph>}) = \\ \\textcolor{#1976d2}{${Z48.toFixed(2)}} \\ \\text{(A)}}` || "Inv"

    // %Z49=1.3*Z47/(C5*(C10+Z2+Z3))
    var Z49 = 1.3 * Z47 / (C5 * (C10 + Z2 + Z3))
    var Z49Holder = `\\boxed{ALF_{Req} = \\mathbf{\\textcolor{#1976d2}{${Z49.toFixed(2)}}}}`
    // %Z50=1.3*Z47/(C5*C7*(%Z50=1.3*Z47/(C5*C7*(C10+Z2+Z3))))
    var Z50 = 1.3 * Z47 / (C5 * C7 * (C10 + Z2 + Z3))

    var Z50Holder = `\\boxed{K_SSC_{Req}  = \\mathbf{\\textcolor{#1976d2}{${Z50.toFixed(2)}}}}`
    var Z50Formula = `\\mathbf{E}_{\\mathrm{al-req}} = 1.3 \\cdot V_{\\mathrm{k-req}} = K_{\\mathrm{td}} \\cdot K_{\\mathrm{SCC}_{\\mathrm{req}}} \\cdot I_{\\mathrm{sn}} \\cdot (R_{\\mathrm{ct}} + R_{\\mathrm{r}})` || "Inv"

    var Z52 = B1_2
    var Z51 = Z52 * (C10 + Z2 + Z3)

    var Z51Formula = `\\mathbf{ V_{k-req} \\geq I_{sp} (R_{ct} + R_{L} + R_{rn}) }` || "Inv"
    var Z51Holder = `\\mathbf{V_{k-req} = \\textcolor{#1976d2}{${Z51.toFixed(2)}}} \\ \\text{(V)}` || "Inv"
    var Z52Formula = `\\mathbf{I_{sp} = \\mathbf{I_{ph>>}} = \\ \\textcolor{#1976d2}{${Z52.toFixed(2)}} \\ \\text{(A)}}` || "Inv"

    var Z53 = 1.3 * Z51 / (C5 * (C10 + Z5))
    const alfFormulaZ53 = `\\mathbf{E_{al-req} = 1.3 V_{k-req} = ALF_{req} I_{sn} (R_{ct} + R_{cn}) }` || "Inv"
    var Z53Holder = `\\boxed{ALF_{Req} = \\mathbf{\\textcolor{#1976d2}{${Z53.toFixed(2)}}}}`

    var Z54 = 1.3 * Z51 / (C5 * C7 * (C10 + Z2 + Z3))

    var Z54Holder = `\\boxed{K_SSC_{Req}  = \\mathbf{\\textcolor{#1976d2}{${Z54.toFixed(2)}}}}`
    var Z54Formula = `\\mathbf{E}_{\\mathrm{al-req}} = 1.3 \\cdot V_{\\mathrm{k-req}} = K_{\\mathrm{td}} \\cdot K_{\\mathrm{SCC}_{\\mathrm{req}}} \\cdot I_{\\mathrm{sn}} \\cdot (R_{\\mathrm{ct}} + R_{\\mathrm{r}})` || "Inv"


    var Z56 = B1_6 * 1000 * C5 / C4
    var Z55 = 0.5 * Z56 * (C10 + Z2 + Z3)


    var Z55Formula = `\\mathbf{V_{k-req} \\geq \\frac{I_{fp}}{2} (R_{ct} + R_{L} + R_{rn})}` || "Inv"
    var Z55Holder = `\\mathbf{V_{k-req} = \\textcolor{#1976d2}{${Z55.toFixed(2)}}} \\ \\text{(V)}` || "Inv"
    var Z56Formula = `\\mathbf{I_{fp} = I_{\\text{phmax-sec}} = \\ \\textcolor{#1976d2}{${Z56.toFixed(2)}} \\ \\text{(A)}}` || "Inv"


    var Z57 = 1.3 * Z55 / (C5 * (C10 + Z2 + Z3))

    const alfFormulaZ57 = `\\mathbf{E_{al-req} = 1.3 V_{k-req} = ALF_{req} I_{sn} (R_{ct} + R_{cn}) }` || "Inv"
    var Z57Holder = `\\boxed{ALF_{Req} = \\mathbf{\\textcolor{#1976d2}{${Z57.toFixed(2)}}}}`


    var Z58 = 1.3 * Z55 / (C5 * C7 * (C10 + Z2 + Z3))

    var Z58Holder = `\\boxed{K_SSC_{Req}  = \\mathbf{\\textcolor{#1976d2}{${Z58.toFixed(2)}}}}`
    var Z58Formula = `\\mathbf{E}_{\\mathrm{al-req}} = 1.3 \\cdot V_{\\mathrm{k-req}} = K_{\\mathrm{td}} \\cdot K_{\\mathrm{SCC}_{\\mathrm{req}}} \\cdot I_{\\mathrm{sn}} \\cdot (R_{\\mathrm{ct}} + R_{\\mathrm{r}})` || "Inv"


    var Z60 = Math.min((B1_7 * 1000 * C5 / C4), 31 * B1_5)
    var Z59 = 0.5 * Z60 * (C10 + (2 * Z2) + (2 * Z3))

    var Z59Formula = `\\mathbf{V_{k-req} \\geq \\frac{I_{cn}}{2} (R_{ct} + 2R_{L} + 2R_{rn})}` || "Inv"
    var Z59Holder = `\\mathbf{V_{k-req} = \\textcolor{#1976d2}{${Z59.toFixed(2)}}} \\ \\text{(V)}` || "Inv"
    var Z60Formula = `\\mathbf{I_{cn} = min(I_{\\text{emax-sec}}, 31I_{e}) = \\ \\textcolor{#1976d2}{${Z60.toFixed(2)}} \\ \\text{(A)}}` || "Inv"


    var Z61 = 1.3 * Z59 / (C5 * (C10 + 2 * Z2 + 2 * Z3))

    const alfFormulaZ61 = `\\mathbf{E_{al-req} = 1.3 V_{k-req} = ALF_{req} I_{sn} (R_{ct} + R_{cn}) }` || "Inv"
    var Z61Holder = `\\boxed{ALF_{Req} = \\mathbf{\\textcolor{#1976d2}{${Z61.toFixed(2)}}}}`

    var Z62 = 1.3 * Z59 / (C5 * C7 * (C10 + 2 * Z2 + 2 * Z3))
    var Z62Holder = `\\boxed{K_SSC_{Req}  = \\mathbf{\\textcolor{#1976d2}{${Z62.toFixed(2)}}}}`
    var Z62Formula = `\\mathbf{E}_{\\mathrm{al-req}} = 1.3 \\cdot V_{\\mathrm{k-req}} = K_{\\mathrm{td}} \\cdot K_{\\mathrm{SCC}_{\\mathrm{req}}} \\cdot I_{\\mathrm{sn}} \\cdot (R_{\\mathrm{ct}} + R_{\\mathrm{r}})` || "Inv"


    var Z64 = B1_4
    var Z63 = Z64 * (C10 + 2 * Z2 + 2 * Z3)
    var Z63Formula = `\\mathbf{V_{k-req} \\geq I_{sn} \\ (R_{ct} + 2R_{L} + 2R_{rn})}` || "Inv"
    var Z63Holder = `\\mathbf{V_{k-req} = \\textcolor{#1976d2}{${Z63.toFixed(2)}}} \\ \\text{(V)}` || "Inv"
    var Z64Formula = `\\mathbf{I_{Sn} = I_{e>>} = \\ \\textcolor{#1976d2}{${Z64.toFixed(2)}} \\ \\text{(A)}}` || "Inv"

    var Z65 = 1.3 * Z63 / (C5 * (C10 + 2 * Z2 + 2 * Z3))

    const alfFormulaZ65 = `\\mathbf{E_{al-req} = 1.3 V_{k-req} = ALF_{req} I_{sn} (R_{ct} + R_{cn}) }` || "Inv"
    var Z65Holder = `\\boxed{ALF_{Req} = \\mathbf{\\textcolor{#1976d2}{${Z65.toFixed(2)}}}}`

    var Z66 = 1.3 * Z63 / (C5 * C7 * (C10 + 2 * Z2 + 2 * Z3))


    var Z66Formula = `\\mathbf{E}_{\\mathrm{al-req}} = 1.3 \\cdot V_{\\mathrm{k-req}} = K_{\\mathrm{td}} \\cdot K_{\\mathrm{SCC}_{\\mathrm{req}}} \\cdot I_{\\mathrm{sn}} \\cdot (R_{\\mathrm{ct}} + R_{\\mathrm{r}})` || "Inv"
    var Z66Holder = `\\boxed{K_SSC_{Req}  = \\mathbf{\\textcolor{#1976d2}{${Z66.toFixed(2)}}}}`


    var Z63 = Z64 * (C10 + 2 * Z2 + 2 * Z3)

    var Z68 = B1_7 * 1000 * C5 / C4
    var Z67 = Z68 * (C10 + 2 * Z2 + 2 * Z3)

    var Z67Formula = `\\mathbf{V_{k-req} \\geq \\frac{I_{fn}}{2} \\ (R_{ct} + 2R_{L} + 2R_{rn})}` || "Inv"
    var Z67Holder = `\\mathbf{V_{k-req} = \\textcolor{#1976d2}{${Z67.toFixed(2)}}} \\ \\text{(V)}` || "Inv"
    var Z68Formula = `\\mathbf{I_{Sn} = I_{e>>} = \\ \\textcolor{#1976d2}{${Z68.toFixed(2)}} \\ \\text{(A)}}` || "Inv"


    var Z69 = 1.3 * Z67 / (C5 * (C10 + 2 * Z2 + 2 * Z3))

    const alfFormulaZZ69 = `\\mathbf{E_{al-req} = 1.3 V_{k-req} = ALF_{req} I_{sn} (R_{ct} + R_{cn}) }` || "Inv"
    var Z69Holder = `\\boxed{ALF_{Req} = \\mathbf{\\textcolor{#1976d2}{${Z69.toFixed(2)}}}}`


    var Z70 = 1.3 * Z67 / (C5 * C7 * (C10 + 2 * Z2 + 2 * Z3))
    var Z70Formula = `\\mathbf{E}_{\\mathrm{al-req}} = 1.3 \\cdot V_{\\mathrm{k-req}} = K_{\\mathrm{td}} \\cdot K_{\\mathrm{SCC}_{\\mathrm{req}}} \\cdot I_{\\mathrm{sn}} \\cdot (R_{\\mathrm{ct}} + R_{\\mathrm{r}})` || "Inv"
    var Z70Holder = `\\boxed{K_SSC_{Req}  = \\mathbf{\\textcolor{#1976d2}{${Z70.toFixed(2)}}}}`

    const Vk_req_Full = String.raw`
    KEMP = 0.5 + 0.3 \cdot \dfrac{X_p}{R_p} \quad \text{if } 0 \leq \dfrac{X_p}{R_p} \leq 15, \\
    KEMP = 4.26 + 0.036 \cdot \dfrac{X_p}{R_p} \quad \text{if } 15 < \dfrac{X_p}{R_p} \leq 80, \\
    KEMP = 8 \quad \text{if } \dfrac{X_p}{R_p} > 80
    `|| "Inv"

    const Vk_ineq = String.raw`
    \left| V_{k-\text{req}} \right| \geq K_d K_{\text{ssc}} I_{\text{sn}} (R_{\text{ct}} + 2 R_l + R_{\text{rn}})
    `|| "Inv"

    const RelayConditions = String.raw`
\text{Base on the relay manual and as per IEC 60255-21 standard following conditions should be checked to calculate required knee point voltage:}\\[1em]
\text{Case 1: Close-up backward short-circuit (security case)}\\[0.5em]
\text{Acceptance criteria: Stable backward direction decision, no trip}\\[1em]
\text{Curve C is an imperial curve obtained by relay manufacture.}
`|| "Inv"


    var Z71 = 2 * Math.PI * 50 * B3_4
    const XpOverRp = String.raw`
    \dfrac{X_p}{R_p} = \omega T_{\text{sys}} = ${Z71.toFixed(2)}
    `|| "Inv"


    // Assuming Z71 is already defined (e.g., from your previous code)
    var Z72

    if (Z71 <= 15) {
      Z72 = 0.5 + 0.3 * Z71 || "Inv"
    } else if (Z71 > 15 && Z71 <= 80) {
      Z72 = 4.26 + 0.036 * Z71 || "Inv"
    } else if (Z71 > 80) {
      Z72 = 8 || "Inv"
    }




    const KEMP = String.raw`
KEMP = ${Z72.toFixed(2)}
`|| "Inv"


    var Z73 = B3_3 * 1000 / C4

    const Kssc = String.raw`
K_{\text{ssc}} = \dfrac{I_{\text{fs}} \cdot 1000}{I_{\text{pn}}} = ${Z73.toFixed(2)}
`|| "Inv"


    var Z74 = Z72 * Z73 * C5 * (C10 + 2 * Z2 + Z3)
    const KReq_Greater = String.raw`
V_{\text{keq}}  \geq  ${Z74.toFixed(2)}
`|| "Inv"

    var Z75 = 1.5 * Z73 * C5 * (C10 + 2 * Z2 + Z3)
    const KReq_Greater2 = String.raw`
V_{\text{keq}}  \geq  ${Z75.toFixed(2)}
`|| "Inv"


    const KempPiecewise = String.raw`
\text{\(KEMP =\)}\\[0.5em]
\text{\(0.5 + 0.375 \dfrac{X_p}{R_p}\), if \(0 \leq \dfrac{X_p}{R_p} \leq 15\)}\\[0.5em]
\text{\(4.865 + 0.084 \dfrac{X_p}{R_p}\), if \(15 \leq \dfrac{X_p}{R_p} \leq 80\)}\\[0.5em]
\text{\(12\), if \(80 < \dfrac{X_p}{R_p}\)}
`|| "Inv"


    var Z76 = (1.1 * B3_2) / (Math.sqrt(3) * B3_3) || "Inv"

    // 2. R_sys = X_sys / (ω * T_sys), where ω = 2 * π * f, f = 50 Hz
    var Z77 = Z76 / (2 * Math.PI * 50 * B3_4) || "Inv"

    // 3. X_line = 0.8 * Z1_set * X * length
    var Z78 = 0.8 * (B3_8 / 100) * B3_6 * B3_7 || "Inv"

    // 4. R_line = 0.8 * Z1_set * R * length
    var Z79 = 0.8 * (B3_8 / 100) * B3_5 * B3_7 || "Inv"

    // 5. X_p / R_p = (X_sys + X_line) / (R_sys + R_line)
    var Z80 = (Z76 + Z78) / (Z77 + Z79) || "Inv"



    // Updated LaTeX strings
    const Xsys = String.raw`
X_{\text{sys}} \approx \dfrac{1.1 U_s}{\sqrt{3} I_{\text{fs}}} = \mathbf{\textcolor{#1976d2}{${isNaN(Z76) ? "N/A" : Z76.toFixed(2)}}}
`|| "Inv"

    const Rsys = String.raw`
R_{\text{sys}} = \dfrac{X_{\text{sys}}}{\omega T_{\text{sys}}} = \mathbf{\textcolor{#1976d2}{${isNaN(Z77) ? "N/A" : Z77.toFixed(2)}}}
`|| "Inv"

    const Xline = String.raw`
X_{\text{line}} = 0.8 \times Z1_{\text{set}} \times X \times \text{length} = \mathbf{\textcolor{#1976d2}{${isNaN(Z78) ? "N/A" : Z78.toFixed(2)}}}
`|| "Inv"

    const Rline = String.raw`
R_{\text{line}} = 0.8 \times Z1_{\text{set}} \times R \times \text{length} = \mathbf{\textcolor{#1976d2}{${isNaN(Z79) ? "N/A" : Z79.toFixed(2)}}}
`|| "Inv"

    const XpOverRp2 = String.raw`
\dfrac{X_p}{R_p} = \dfrac{X_{\text{sys}} + X_{\text{line}}}{R_{\text{sys}} + R_{\text{line}}} = \mathbf{\textcolor{#1976d2}{${isNaN(Z80) ? "N/A" : Z80.toFixed(2)}}}
`|| "Inv"



    var Z81

    if (Z80 <= 15) {
      Z81 = 0.5 + 0.375 * Z80 || "Inv" // Fixed Z71 to Z80
    } else if (Z80 > 15 && Z80 <= 80) {
      Z81 = 4.865 + 0.084 * Z80 || "Inv"
    } else if (Z80 > 80) {
      Z81 = 12 || "Inv"
    }

    const KEMP2 = String.raw`
    KEMP = R_{\text{line}} = \mathbf{\textcolor{#1976d2}{${Z81.toFixed(2)}}}
    `|| "Inv"

    var Z82 = 1.1 * B3_2 / (Math.sqrt(3) * (Z76 + Z78))
    var Z83 = Z82 * 1000 / C4
    var Z84 = Z82 * Z83 * C5 * (C10 + 2 * Z2 + Z3)

    var L1 = String.raw`I_{sc} \approx \frac{1.1 \, U_s}{\sqrt{3} \, (X_{sys} + X_{line})} = \mathbf{\textcolor{#1976d2}{${Z82.toFixed(2)}}}`
    var L2 = String.raw`K_{ssc} = \frac{I_{sc} \times 1000}{I_{pn}} = \mathbf{\textcolor{#1976d2}{${Z83.toFixed(2)}}}`
    var L3 = String.raw`V_{k\text{-}req} \geq = \mathbf{\textcolor{#1976d2}{${Z84.toFixed(2)}}}`


    var Z85 = 1.2 * (B3_8 / 100) * B3_6 * B3_7
    var Z86 = 1.2 * (B3_8 / 100) * B3_5 * B3_7
    var Z87 = (Z76 + Z85) / (Z77 + Z86)


    var Z88 =
      (Z87 <= 15) ? (0.5 + 0.3 * Z87) :
        (Z87 > 15 && Z87 <= 80) ? (4.26 + 0.036 * Z87) :
          (Z87 > 80) ? 8 :
            0 // or throw new Error("Invalid Z87 value")

    var Z89 = 1.1 * B3_2 / (Math.sqrt(3) * (Z76 + Z85))
    var Z90 = Z89 * 1000 / C4
    var Z91 = Z88 * Z90 * C5 * (C10 + 2 * Z2 + Z3)


    var Z92 = Math.max(Z74, Z75, Z84, Z91)


    var L4 = String.raw`X_{line} = 1.2 * Z1_{set} * X\prime * length = \mathbf{\textcolor{#1976d2}{${Z85.toFixed(2)}}}`

    var L5 = String.raw`R_{line} = 0.8 * Z1_{set} * R\prime * length = \mathbf{\textcolor{#1976d2}{${Z86.toFixed(2)}}}`

    var L6 = String.raw`\frac{X_p}{R_p} = \frac{X_{sys} + X_{line}}{R_{sys} + R_{line}} = \mathbf{\textcolor{#1976d2}{${Z87.toFixed(2)}}}`

    var L7 = String.raw`K_{emp} = \mathbf{\textcolor{#1976d2}{${Z88.toFixed(2)}}}`

    var L8 = String.raw`I_{sc} \approx \frac{1.1 \, U_s}{\sqrt{3} \, (X_{sys} + X_{line})} = \mathbf{\textcolor{#1976d2}{${Z89.toFixed(2)}}}`

    var L9 = String.raw`K_{ssc} = \frac{I_{sc}}{I_{pn}} = \mathbf{\textcolor{#1976d2}{${Z90.toFixed(2)}}}`

    var L10 = String.raw`V_{k\text{-}req} \geq \mathbf{\textcolor{#1976d2}{${Z91.toFixed(2)}}}`

    var L11 = String.raw`V_{k\text{-}req} = \mathbf{\textcolor{#1976d2}{${Z92.toFixed(2)}}}`

    var Z93 = 1.3 * Z92 / (C5 * (C10 + 2 * Z2 + 2 * Z3))
    var Z93Holder = `\\boxed{ALF_{Req} = \\mathbf{\\textcolor{#1976d2}{${Z93.toFixed(2)}}}}`

    var Z94 = 1.3 * Z92 / (C5 * C7 * (C10 + 2 * Z2 + Z3))

    var Z94Holder = `\\boxed{ALF_{Req} = \\mathbf{\\textcolor{#1976d2}{${Z94.toFixed(2)}}}}`


    var Z95 = 0.6
    var Z96 = B3_3 * 1000 * C5 / C4
    var Z97 = 2 * Math.PI * 50 * B3_4
    var Z98 = Z95 * Z96 * (1 + Z97) * (C10 + 2 * Z2 + Z3)




    var LMaster = String.raw`V_{k\text{-}req} \geq KRPA \cdot I_F \left(1 + \frac{X_p}{R_p}\right) \left(R_{ct} + 2R_L + R_{rn} \right) `

    var L12 = String.raw`KRPA = \mathbf{\textcolor{#1976d2}{${Z95.toFixed(2)}}}`

    var L13 = String.raw`I_{F\text{-}sec} = I_{fs} \times 1000 \times \frac{I_{sn}}{I_{pn}} = \mathbf{\textcolor{#1976d2}{${Z96.toFixed(2)}}}`

    var L14 = String.raw`\frac{X_p}{R_p} = \omega T_{sys} = \mathbf{\textcolor{#1976d2}{${Z97.toFixed(2)}}}`

    var L15 = String.raw`V_{k\text{-}req} = \mathbf{\textcolor{#1976d2}{${Z98.toFixed(2)}}}`


    var Z99 = 1.3 * Z98 / (C5 * (C10 + 2 * Z2 + Z3))
    var Z99Holder = `\\boxed{ALF_{Req} = \\mathbf{\\textcolor{#1976d2}{${Z99.toFixed(2)}}}}`

    var Z100 = 1.3 * Z98 / (C5 * C7 * (C10 + 2 * Z2 + Z3))
    var Z100Holder = `\\boxed{ALF_{Req} = \\mathbf{\\textcolor{#1976d2}{${Z100.toFixed(2)}}}}`

    var Z101 = 0.6
    var Z102 = 1.1 * B3_2 / (Math.sqrt(3) * B3_3)
    var Z103 = parseFloat(Z102.toFixed(2)) / (2 * Math.PI * 50 * B3_4)

    var Z104 = (B3_8 / 100) * B3_6 * B3_7

    var Z105 = (B3_8 / 100) * B3_5 * B3_7



    // var Z106 = (Z102 + Z104) / (Z103 + Z105)
    var Z106 = (parseFloat(Z102.toFixed(2)) + parseFloat(Z104.toFixed(2))) /
      (parseFloat(Z103.toFixed(2)) + parseFloat(Z105.toFixed(2)))







    var Z107 = 1.1 * B3_2 / (Math.sqrt(3) * (parseFloat(Z102.toFixed(2)) + parseFloat(Z104.toFixed(2))))
    var Z108 = parseFloat(Z107.toFixed(2)) * 1000 * C5 / C4
    var Z109 = parseFloat(Z102.toFixed(2)) * parseFloat(Z108.toFixed(2)) * (1 + parseFloat(Z106.toFixed(2))) * (parseFloat(C10.toFixed(2)) + parseFloat(Z2.toFixed(2)) + parseFloat(Z3.toFixed(2)))




    var LMaster2 = String.raw`V_{k\text{-}req} \geq K_{RPA} \cdot I_{FZ1} \left(1 + \frac{X_p}{R_p} \right) (R_{ct} + R_L + R_{rn})`

    var L16 = String.raw`K_{RPA} = \mathbf{\textcolor{#1976d2}{${Z101.toFixed(2)}}}`

    var L17 = String.raw`X_{sys} \approx \frac{1.1 \, U_s}{\sqrt{3} \, I_{fs}} = \mathbf{\textcolor{#1976d2}{${Z102.toFixed(2)}}}`

    var L18 = String.raw`R_{sys} = \frac{X_{sys}}{\omega T_{sys}} = \mathbf{\textcolor{#1976d2}{${Z103.toFixed(2)}}}`

    var L19 = String.raw`X_{line} = Z1_{set} \times X^* \times length = \mathbf{\textcolor{#1976d2}{${Z104.toFixed(2)}}}`

    var L20 = String.raw`R_{line} = Z1_{set} \times R^* \times length = \mathbf{\textcolor{#1976d2}{${Z105.toFixed(2)}}}`

    var L21 = String.raw`\frac{X_p}{R_p} = \frac{X_{sys} + X_{line}}{R_{sys} + R_{line}} = \mathbf{\textcolor{#1976d2}{${Z106.toFixed(2)}}}`

    var L22 = String.raw`I_{sc} \approx \frac{1.1 \, U_s}{\sqrt{3} (X_{sys} + X_{line})} = \mathbf{\textcolor{#1976d2}{${Z107.toFixed(2)}}}`

    var L23 = String.raw`I_{FZ1} = I_{sc} \times 1000 \times \frac{I_{sn}}{I_{pn}} = \mathbf{\textcolor{#1976d2}{${Z108.toFixed(2)}}}`

    var L24 = String.raw`V_{k\text{-}req} = \mathbf{\textcolor{#1976d2}{${Z109.toFixed(2)}}}`


    var Z110 = 1.4

    var Z111 = B3_3 * 1000 * C5 / C4

    var Z112 = Z110 * Z111 * (C10 + Z2 + Z3)

    var Z113 = Math.max(parseFloat(Z109.toFixed(2)), parseFloat(Z112.toFixed(2)))

    var L25 = String.raw`V_{k\text{-}req} \geq K_{max} \cdot I_{Fmax} (R_{ct} + R_L + R_{rn})`

    var L26 = String.raw`K_{max} = \mathbf{\textcolor{#1976d2}{${Z110.toFixed(2)}}}`

    var L27 = String.raw`I_{Fmax} = I_{fs} \cdot 1000 \cdot \frac{I_{sn}}{I_{pn}} = \mathbf{\textcolor{#1976d2}{${Z111.toFixed(2)}}}`

    var L28 = String.raw`V_{k\text{-}req} = \mathbf{\textcolor{#1976d2}{${Z112.toFixed(2)}}}`

    var L29 = String.raw`V_{k\text{-}req} = \mathbf{\textcolor{#1976d2}{${Z113.toFixed(2)}}}`







    var Z114 = 1.3 * Z113 / (C5 * (C10 + Z2 + Z3))

    var Z115 = 1.3 * Z113 / (C5 * C7 * (C10 + Z2 + Z3))

    var Z114Holder = `\\boxed{ALF_{Req} = \\mathbf{\\textcolor{#1976d2}{${Z114.toFixed(2)}}}}`
    var Z115Holder = `\\boxed{ALF_{Req} = \\mathbf{\\textcolor{#1976d2}{${Z115.toFixed(2)}}}}`


    var Z116 = 1 + 2 * Math.PI * 50 * B4_4
    var Z117 = Math.max(B4_2, B4_3) * 1000 * C5 / C4
    var Z118 = parseFloat(Z116.toFixed(2)) * parseFloat(Z117.toFixed(2)) * (C10 + Z2 + Z3)



    var L30 = String.raw`V_{k\text{-}req} \geq K I_{1,\text{max}}(R_{ct} + R_L + R_{rn})` || "Inv"
    var L31 = String.raw`K = 1 + \omega T_{sys} = \mathbf{\textcolor{#1976d2}{${Z116.toFixed(2)}}}` || "Inv"
    var L32 = String.raw`I_{1,\text{max}} = \text{max}(I_{\text{max-int}}, I_{\text{max-ext}})1000 \times \frac{I_{sn}}{I_{pn}} = \mathbf{\textcolor{#1976d2}{${Z117.toFixed(2)}}}` || "Inv"
    var L33 = String.raw`V_{k\text{-}req} = \mathbf{\textcolor{#1976d2}{${Z118.toFixed(2)}}}` || "Inv"

    var Z119 = 1.3 * Z118 / (C5 * (C10 + Z2 + Z3))
    var Z119Holder = `\\boxed{ALF_{Req} = \\mathbf{\\textcolor{#1976d2}{${Z119.toFixed(2)}}}}`

    var Z120 = 1.3 * Z118 / (C5 * C7 * (C10 + Z2 + Z3))
    var Z120Holder = `\\boxed{K_SSC_{Req} = \\mathbf{\\textcolor{#1976d2}{${Z120.toFixed(2)}}}}`

    var Z121 = (B4_3 / C4) * B4_5

    // Use a ternary operator for the conditional expression
    var Z122 = Z121 <= 1000 ? 40 + 0.07 * Z121 : 107

    var Z123 = Z122 * C5 * (C10 + 2 * Z2)

    // Correct the typo in 0.0.35 to 0.35 and use a ternary operator
    var Z124 = Z121 <= 600 ? 40 + 0.35 * Z121 : 256

    var Z125 = Z124 * C5 * (C10 + 2 * Z2)

    // Correct the nested if condition using nested ternary operators

    var Z126 = (B4_6) === 150 ? Z123 : (B4_6 === 100 ? Z125 : -1)

    var L34 = String.raw`V_{k\text{-}req} \geq K I_{sn}(R_{ct} + 2R_L)`

    var L35 = String.raw`C = \frac{I_{\text{max-ext}} \times R}{I_{pn}} = \mathbf{\textcolor{#1976d2}{${Z121.toFixed(2)}}}`

    var L36 = String.raw`K = \begin{cases} 40 + 0.07 \times C & C \leq 1000 \\ 107 & C > 1000 \end{cases}`

    var L37 = String.raw`K = \mathbf{\textcolor{#1976d2}{${Z122.toFixed(2)}}}`

    var L38 = String.raw`V_{k\text{-}req} = \mathbf{\textcolor{#1976d2}{${Z123.toFixed(2)}}}`

    var L39 = String.raw`K = \begin{cases} 40 + 0.35 \times C & C \leq 600 \\ 256 & C > 600 \end{cases}`

    var L40 = String.raw`K = \mathbf{\textcolor{#1976d2}{${Z124.toFixed(2)}}}`

    var L41 = String.raw`V_{k\text{-}req} = \mathbf{\textcolor{#1976d2}{${Z125.toFixed(2)}}}`

    var L42 = String.raw`V_{k\text{-}req} = \mathbf{\textcolor{#1976d2}{${Z126.toFixed(2)}}}`


    var Z127 = 1.3 * Z126 / (C5 * (C10 + 2 * Z2))

    var Z128 = 1.3 * Z126 / (C5 * C7 * (C10 + 2 * Z2))



    var Z127Holder = `\\boxed{ALF_{Req} = \\mathbf{\\textcolor{#1976d2}{${Z127.toFixed(2)}}}}`
    var Z128Holder = `\\boxed{K_SSC_{Req} = \\mathbf{\\textcolor{#1976d2}{${Z128.toFixed(2)}}}}`


    var Z129 = (B4_3 / C4) * B4_5
    var Z130 = Z129 <= 1000 ? 40 + 0.07 * Z129 : 107
    var Z131 = Z130 * C5 * (C10 + 2 * Z2)
    var Z132 = Z129 <= 600 ? 40 + 0.35 * Z129 : 256
    var Z133 = Z132 * C5 * (C10 + 2 * Z2)
    var Z134 = B4_6 === 150 ? Z131 : B4_6 === 100 ? Z133 : -1
    var Z135 = B4_5 <= 80 ? 50 : 65
    var Z136 = Z135 * C5 * (C10 + 2 * Z2)





    var L37 = String.raw`V_{k\text{-}req} \geq K \cdot I_{sn} (R_{ct} + 2R_L)`
    var L38 = String.raw`C = \frac{I_{max\text{-}ext} \cdot X}{I_{pn} \cdot R} = \mathbf{\textcolor{#1976d2}{${Z129.toFixed(2)}}}`
    var L39 = String.raw`K = \left\{ \begin{array}{ll}
40 + 0.07 \cdot C & \text{if } C \leq 1000 \\
107 & \text{if } C > 1000
\end{array} \right.`

    var L40 = String.raw`K = \mathbf{\textcolor{#1976d2}{${Z130.toFixed(2)}}}`
    var L41 = String.raw`V_{k\text{-}req} = \mathbf{\textcolor{#1976d2}{${Z131.toFixed(2)}}}`
    var L42 = String.raw`K = \left\{ \begin{array}{ll}
40 + 0.35 \cdot C & \text{if } C \leq 600 \\
256 & \text{if } C > 600
\end{array} \right.`
    var L43 = String.raw`K = \mathbf{\textcolor{#1976d2}{${Z132.toFixed(2)}}}`
    var L44 = String.raw`V_{k\text{-}req} = \mathbf{\textcolor{#1976d2}{${Z133.toFixed(2)}}}`
    var L45 = String.raw`V_{k\text{-}req} = \mathbf{\textcolor{#1976d2}{${Z134.toFixed(2)}}}`
    var L46 = String.raw`K = \left\{ \begin{array}{ll}
50 & \text{if } \frac{X}{R} \leq 80 \\
65 & \text{if } \frac{X}{R} > 80
\end{array} \right.`

    var L47 = String.raw`\overline{K} = \mathbf{\textcolor{#1976d2}{${Z135.toFixed(2)}}}`

    var L48 = String.raw`V_{k\text{-}req} = \mathbf{\textcolor{#1976d2}{${Z136.toFixed(2)}}}`



    var Z135 = B4_5 <= 80 ? 50 : 65
    var Z136 = Z135 * C5 * (C10 + 2 * Z2)

    var L49 = String.raw`K = \left\{ \begin{array}{ll}
50 & \frac{X}{R} \leq 80 \\
65 & \frac{X}{R} > 80
\end{array} \right.`

    var L50 = String.raw`K = \mathbf{\textcolor{#1976d2}{${Z135.toFixed(2)}}}`
    var L51 = String.raw`V_{k\text{-}req} = \mathbf{\textcolor{#1976d2}{${Z136.toFixed(2)}}}`


    var Z137 = 1.3 * Z134 / (C5 * (C10 + 2 * Z2))
    var Z138 = 1.3 * Z136 / (C5 * (C10 + 2 * Z2))

    var Z137Holder = `\\boxed{ALF_{Req} = \\mathbf{\\textcolor{#1976d2}{${Z137.toFixed(2)}}}}`
    var Z138Holder = `\\boxed{K_SSC_{Req} = \\mathbf{\\textcolor{#1976d2}{${Z138.toFixed(2)}}}}`

    var Z139 = 1.3 * Z134 / (C5 * C7 * (C10 + 2 * Z2))

    var Z140 = 1.3 * Z136 / (C5 * C7 * (C10 + 2 * Z2))
    var Z139Holder = `\\boxed{K_SSC_{Req} = \\mathbf{\\textcolor{#1976d2}{${Z139.toFixed(2)}}}}`
    var Z140Holder = `\\boxed{K_SSC_{Req} = \\mathbf{\\textcolor{#1976d2}{${Z140.toFixed(2)}}}}`

    var Z141 = 0.6
    var Z142 = 1.1 * B3_2 / (Math.sqrt(3) * B3_3)
    var Z143 = Z142 / (2 * Math.PI * 50 * B3_4)
    var Z144 = (B3_8 / 100) * B3_6 * B3_7
    var Z145 = (B3_8 / 100) * B3_5 * B3_7
    var Z146 = (parseFloat(Z142.toFixed(2)) + parseFloat(Z144.toFixed(2))) / (parseFloat(Z143.toFixed(2)) + parseFloat(Z145.toFixed(2)))
    var Z147 = 1.1 * B3_2 / (Math.sqrt(3) * (Z142 + Z144))
    var Z148 = Z147 * 1000 * C5 / C4
    var Z149 = parseFloat(Z142.toFixed(2)) * parseFloat(Z148.toFixed(2)) * (1 + parseFloat(Z146.toFixed(2))) * (C10 + Z2 + Z3)
    var Z150 = 1.4
    var Z151 = B3_3 * 1000 * C5 / C4
    var Z152 = Z150 * Z151 * (C10 + Z2 + Z3)
    var Z153 = B3_6 * B3_7
    var Z154 = B3_5 * B3_7
    var Z155 = (parseFloat(Z142.toFixed(2)) + parseFloat(Z153.toFixed(2))) / (parseFloat(Z143.toFixed(2)) + parseFloat(Z154.toFixed(2)))
    var Z157 = 1.1 * B3_2 / (Math.sqrt(3) * (Z142 + Z153))
    var Z158 = Z157 * 1000 * C5 / C4
    var Z159 = Z158 * (C10 + Z2 + Z3)
    var Z160 = Math.max(Z149, Z152, Z159)

    var L52 = String.raw`V_{k\text{-}req} \geq K_{RPA} \, I_{F21} \left( 1 + \frac{X_p}{R_p} \right)(R_{ct} + R_L + R_m)`

    var L53 = String.raw`K_{RPA} = \mathbf{\textcolor{#1976d2}{${Z141.toFixed(2)}}}`

    var L54 = String.raw`X_{sys} \approx \frac{1.1 \, U_s}{\sqrt{3} \, I_{fs}} = \mathbf{\textcolor{#1976d2}{${Z142.toFixed(2)}}}`

    var L55 = String.raw`R_{sys} = \frac{X_{sys}}{\omega \, T_{sys}} = \mathbf{\textcolor{#1976d2}{${Z143.toFixed(2)}}}`

    var L56 = String.raw`X_{line} = \text{Z1 set} \times X^\prime \times \text{length} = \mathbf{\textcolor{#1976d2}{${Z144.toFixed(2)}}}`

    var L57 = String.raw`R_{line} = \text{Z1 set} \times R^\prime \times \text{length} = \mathbf{\textcolor{#1976d2}{${Z145.toFixed(2)}}}`

    var L58 = String.raw`\frac{X_p}{R_p} = \frac{X_{sys} + X_{line}}{R_{sys} + R_{line}} = \mathbf{\textcolor{#1976d2}{${Z146.toFixed(2)}}}`

    var L59 = String.raw`I_{sc} \approx \frac{1.1 \, U_s}{\sqrt{3} (X_{sys} + X_{line})} = \mathbf{\textcolor{#1976d2}{${Z147.toFixed(2)}}}`

    var L60 = String.raw`I_{F21} = I_{sc} \times 1000 \times \frac{I_{sn}}{I_{pn}} = \mathbf{\textcolor{#1976d2}{${Z148.toFixed(2)}}}`

    var L61 = String.raw`V_{k\text{-}req} = \mathbf{\textcolor{#1976d2}{${Z149.toFixed(2)}}}`

    var L62 = String.raw`V_{k\text{-}req} \geq K_{max} \, I_{Pmax}(R_{ct} + R_L + R_m)`

    var L63 = String.raw`K_{max} = \mathbf{\textcolor{#1976d2}{${Z150.toFixed(2)}}}`

    var L64 = String.raw`I_{Pmax} = I_{fs} \times 1000 \times \frac{I_{sn}}{I_{pn}} = \mathbf{\textcolor{#1976d2}{${Z151.toFixed(2)}}}`

    var L65 = String.raw`V_{k\text{-}req} = \mathbf{\textcolor{#1976d2}{${Z152.toFixed(2)}}}`

    var L66 = String.raw`V_{k\text{-}req} \geq I_P(R_{ct} + R_L + R_m)`

    var L67 = String.raw`X_{line} = X^\prime \times \text{length} = \mathbf{\textcolor{#1976d2}{${Z153.toFixed(2)}}}`

    var L68 = String.raw`R_{line} = R^\prime \times \text{length} = \mathbf{\textcolor{#1976d2}{${Z154.toFixed(2)}}}`

    var L69 = String.raw`\frac{X_p}{R_p} = \frac{X_{sys} + X_{line}}{R_{sys} + R_{line}} = \mathbf{\textcolor{#1976d2}{${Z155.toFixed(2)}}}`


    var L70 = String.raw`I_{sc} \approx \frac{1.1 U_s}{\sqrt{3} (X_{sys} + X_{line})} = \mathbf{\textcolor{#1976d2}{${Z157.toFixed(2)}}}`

    var L71 = String.raw`I_{FZ1} = I_{sc} \times 1000 \times \frac{I_{sn}}{I_{pn}} = \mathbf{\textcolor{#1976d2}{${Z158.toFixed(2)}}}`

    var L72 = String.raw`V_{k\text{-}req} = \mathbf{\textcolor{#1976d2}{${Z159.toFixed(2)}}}`

    var L73 = String.raw`V_{k\text{-}req} = \mathbf{\textcolor{#1976d2}{${Z160.toFixed(2)}}}`


    var Z161 = 1.3 * Z160 / (C5 * (C10 + Z2 + Z3))
    var Z162 = 1.3 * Z160 / (C5 * C7 * (C10 + Z2 + Z3))

    var Z161Holder = `\\boxed{ALF_{Req} = \\mathbf{\\textcolor{#1976d2}{${Z161.toFixed(2)}}}}`
    var Z162Holder = `\\boxed{K_SSC_{Req} = \\mathbf{\\textcolor{#1976d2}{${Z162.toFixed(2)}}}}`

    var Z163 = 2 * Math.PI * 50 * B5_4
    var Z164 = Z163 <= 10 ? Math.exp(0.033 * Z163) : 4.6 - 3.1 * Math.exp(-0.095 * (Z163 - 10))
    var Z165 = B5_3 * 1000 / C4
    var Z166 = parseFloat(Z164.toFixed(2)) * parseFloat(Z165.toFixed(2)) * C5 * (C10 + Z2 + Z3)
    var Z167 = B5_2 * 1000 / C4
    var Z168 = 0.25 * Z167 * C5 * (C10 + Z2 + Z3)
    var Z169 = Math.max(parseFloat(Z166.toFixed(2)), parseFloat(Z168.toFixed(2)))


    var L74 = String.raw`\frac{X_p}{R_p} = \omega T_{sys} = \mathbf{\textcolor{#1976d2}{${Z163.toFixed(2)}}}`

    var L75 = String.raw`K_{emp} = \mathbf{\textcolor{#1976d2}{${Z164.toFixed(2)}}}`

    var L76 = String.raw`K_{55C} = \frac{I_{f\text{-}max\text{-}ext} \times 1000}{I_{pn}} = \mathbf{\textcolor{#1976d2}{${Z165.toFixed(2)}}}`

    var L77 = String.raw`V_{k\text{-}req} \geq \mathbf{\textcolor{#1976d2}{${Z166.toFixed(2)}}}`

    var L78 = String.raw`K_d = 0.25 \quad \text{[ref: Relay manual]}`

    var L79 = String.raw`K_{55C} = \frac{I_{f\text{-}max\text{-}int} \times 1000}{I_{pn}} = \mathbf{\textcolor{#1976d2}{${Z167.toFixed(2)}}}`

    var L80 = String.raw`V_{k\text{-}req} \geq \mathbf{\textcolor{#1976d2}{${Z168.toFixed(2)}}}`

    var L81 = String.raw`V_{k\text{-}req} \geq \mathbf{\textcolor{#1976d2}{${Z169.toFixed(2)}}}`

    var L82 = String.raw`V_{k\text{-}req} \geq K_d K_{ssc} I_{sn} (R_{ct} + R_L + R_{rn})`

    var L83 = String.raw`K_{emp} = {
      \begin{aligned}
        4.6 \quad & \text{if } \dfrac{X_p}{R_p} \leq 10 \\
        3.1e^{-0.095\left(\dfrac{X_p}{R_p} - 10\right)} \quad & \text{if } \dfrac{X_p}{R_p} > 10
      \end{aligned}
    }`

    var Z170 = 1.3 * Z169 / (C5 * (C10 + Z2 + Z3))
    var Z171 = 1.3 * Z169 / (C5 * C7 * (C10 + Z2 + Z3))

    var Z170Holder = `\\boxed{ALF_{Req} = \\mathbf{\\textcolor{#1976d2}{${Z170.toFixed(2)}}}}`
    var Z171Holder = `\\boxed{K_SSC_{Req} = \\mathbf{\\textcolor{#1976d2}{${Z171.toFixed(2)}}}}`

    // % Z172=IFS(A7 = IEC - PX C11 A7 = IEC - P 1.3 * C6 / (C10 + Z5) A7 = IEC - TP 1.3 * C6 * C7 / (C10 + Z5)) /(C6+2*Z2+Z3)

    var Z172

    if (A7 === "IEC-PX") {
      Z172 = C11
    } else if (A7 === "IEC-P") {
      Z172 = C6 / (C10 + Z5) / 1.3
    } else if (A7 === "IEC-TP") {
      Z172 = 1.3 * C6 * C7 / (C10 + Z5)
    }
    Z172 = Z172 / (C6 + 2 * Z2 + Z3)

    var Z173 =
      (B5_9) === 2 ? Math.max(Z172, (B5_5) / (B5_6)) :
        (B5_9) === 3 ? Math.max(Z172, (B5_5) / (B5_6), (B5_7) / (B5_8)) : 0

    var Z174 =
      (B5_9) === 2 ? Math.min(Z172, (B5_5) / (B5_6)) :
        (B5_9) === 3 ? Math.min(Z172, (B5_5) / (B5_6), (B5_7) / (B5_8)) : 0
    var Z175 = Z173 / Z174

    // To ensure that through fault stability is achieved the following ratios should not exceed a maximum disparity of 4:1 [ref: Relay manual].
    var L84 = String.raw`\frac{V_{k1}}{R_1} \cdot \frac{V_{k2}}{R_2}`
    var L85 = String.raw`\frac{V_{k1}}{R_1} \cdot \frac{V_{k3}}{R_3}`
    var L86 = String.raw`\frac{V_{k2}}{R_2} \cdot \frac{V_{k3}}{R_3}`

    var L87 = String.raw`\frac{V_{k1}}{R_1} = \mathbf{\textcolor{#1976d2}{${Z172.toFixed(2)}}}`

    var L88 = String.raw`\max \left( \frac{V_i}{R_i} \right) = \mathbf{\textcolor{#1976d2}{${Z173.toFixed(2)}}}`

    var L89 = String.raw`\min \left( \frac{V_i}{R_i} \right) = \mathbf{\textcolor{#1976d2}{${Z174.toFixed(2)}}}`

    var L90 = String.raw`\frac{\max \left( \frac{V_i}{R_i} \right)}{\min \left( \frac{V_i}{R_i} \right)} (i=1,2,3) = \mathbf{\textcolor{#1976d2}{${Z175.toFixed(2)}}}`

    var Z176 = 2 * Math.PI * 50 * (B5_4)

    var Z177 =
      (Z175 >= 5 && Z175 <= 20 && B5_3 * 1000 >= C4 && B5_3 * 1000 <= 40 * C4) ? 20 :
        (Z175 >= 5 && Z175 <= 20 && B5_3 * 1000 > 40 * C4 && B5_3 * 1000 <= 64 * C4) ? 30 :
          (Z175 >= 20 && Z175 <= 120 && B5_3 * 1000 >= C4 && B5_3 * 1000 <= 40 * C4) ? 30 :
            (Z175 > 20 && Z175 <= 120 && B5_3 * 1000 > 40 * C4 && B5_3 * 1000 <= 64 * C4) ? 40 :
              0;

    var Z178 = Z177 * C5 * (C10 + 2 * Z2 + Z3)

    //%Z179=1.3*Z178/(C5*(C10+2Z2+Z3))
    var Z179 = 1.3 * Z178 / (C10 + 2 * Z2 + Z3)
    //%Z180=1.3*Z178/(C5*C7*(C10+2Z2+Z3))
    var Z180 = 1.3 * Z178 / (C5 * C7 * (C10 + 2 * Z2 + Z3))

    var Z179Holder = `\\boxed{ALF_{Req} = \\mathbf{\\textcolor{#1976d2}{${Z179.toFixed(2)}}}}`
    var Z180Holder = `\\boxed{K_SSC_{Req} = \\mathbf{\\textcolor{#1976d2}{${Z180.toFixed(2)}}}}`


    var L91 = String.raw`V_{k\text{-}req} \geq K I_{sn}(R_{ct} + 2R_L + R_{rn})`

    // Select required K-Kemp per empirical dimensioning factor curve for the external fault
    // For 5 \leq \frac{X_{sys}}{R_{sys}} \leq 20
    var L92 = String.raw`K_{emp} = \begin{cases} 20 & I_{pn} \leq I_{\text{max-ext}} \leq 40I_{pn} \\ 30 & 40I_{pn} < I_{\text{max-ext}} \leq 64I_{pn} \end{cases}`

    // or 20 < \frac{X_{sys}}{R_{sys}} \leq 120
    var L93 = String.raw`K_{emp} = \begin{cases} 30 & I_{pn} \leq I_{\text{max-ext}} \leq 40I_{pn} \\ 40 & 40I_{pn} < I_{\text{max-ext}} \leq 64I_{pn} \end{cases}`

    // Base on input data:
    var L94 = String.raw`\frac{X_{sys}}{R_{sys}} = \omega T_{sys} = \mathbf{\textcolor{#1976d2}{${parseFloat(Z176.toFixed(2))}}}`

    // So:
    var L95 = String.raw`K_{emp} = \mathbf{\textcolor{#1976d2}{${parseFloat(Z177.toFixed(2))}}}`

    var L96 = String.raw`V_{k\text{-}req} \geq \mathbf{\textcolor{#1976d2}{${parseFloat(Z178.toFixed(2))}}}`

    var Z181 = B6_2 * (C5 / C4) * (C10 + 2 * Z2 + Z3)
    var Z182 = 0.5 * B6_3 * (C5 / C4) * (C10 + 2 * Z2 + Z3)
    var Z183 = Math.max(Z181, Z182)
    var Z184 = 1.3 * Z183 / (C5 * (C10 + 2 * Z2 + Z3))
    var Z185 = 1.3 * Z183 / (C5 * C7 * (C10 + 2 * Z2 + Z3))

    const F1_latex = String.raw`V_{k\text{-}req} \geq I_{\text{max-int}} \frac{I_{sn}}{I_{pn}} (R_{ct} + 2R_L + R_{rn})`
    const F2_latex = String.raw`V_{k\text{-}req} \geq 0.5 I_{\text{max-ext}} \frac{I_{sn}}{I_{pn}} (R_{ct} + 2R_L + R_{rn})`

    var L97 = String.raw`V_{k\text{-}req} \geq I_{\text{max-int}} \frac{I_{sn}}{I_{pn}} (R_{ct} + 2R_L + R_{rn})`

    var L98 = String.raw`V_{k\text{-}req} \geq \mathbf{\textcolor{#1976d2}{${parseFloat(Z181.toFixed(2))}}}`

    var L99 = String.raw`V_{k\text{-}req} \geq 0.5 I_{\text{max-ext}} \frac{I_{sn}}{I_{pn}} (R_{ct} + 2R_L + R_{rn})`

    var L100 = String.raw`V_{k\text{-}req} \geq \mathbf{\textcolor{#1976d2}{${parseFloat(Z182.toFixed(2))}}}`

    var L101 = String.raw`V_{k\text{-}req} \geq \mathbf{\textcolor{#1976d2}{${parseFloat(Z183.toFixed(2))}}}`

    var Z187 = Math.max(B1_6, B1_7) * 1000 * C5 / C4

    var Z186 = Z187 * (C10 + 2 * Z2 + 2 * Z3)

    var L102 = String.raw`V_{k\text{-}req} \geq I_{fp} (R_{ct} + 2R_L + 2R_{rn})`

    var L103 = String.raw`V_{k\text{-}req} = \mathbf{\textcolor{#1976d2}{${parseFloat(Z186.toFixed(2))}}}`
    var L104 = String.raw`I_{fp} = \max(I_{\text{phmax-sec}}, I_{\text{emax-sec}}) = \mathbf{\textcolor{#1976d2}{${parseFloat(Z187.toFixed(2))}}}`
    //%Z189=1.3*Z186/(C5*(C10+2Z2+2Z3))
    var Z189 = 1.3 * Z186 / (C5 * (C10 + 2 * Z2 + 2 * Z3))
    // %Z190=1.3*Z186/(C5*C7*(C10+2Z2+2Z3))
    var Z190 = 1.3 * Z186 / (C5 * C7 * (C10 + 2 * Z2 + 2 * Z3))

    var Z189Holder = `\\boxed{ALF_{Req} = \\mathbf{\\textcolor{#1976d2}{${Z189.toFixed(2)}}}}`
    var Z190Holder = `\\boxed{K_SSC_{Req} = \\mathbf{\\textcolor{#1976d2}{${Z190.toFixed(2)}}}}`


    return (
      <Fragment>

        <div style={{ background: "white" }}>
          <div ref={this.pdfRef} >


            <div className="pdf-container position-relative ">
              {/* Header Section */}

              {/* Document Description */}


              {/* Main Content */}

              <div className="pdf-content">

                <div className='col-12 center justify-content-start row'>
                  <h3 style={{ background: "orange" }} className="section-title section_title_Sub">
                    <AssessmentIcon className='pdfIcons'></AssessmentIcon>
                    Relay Information</h3>
                  <div className="info-item col-5">
                    <span className="label">Manufacture:</span>
                    <span className="value">{SecondPageData.Manufacture || "NAN"}</span>
                  </div>
                  <div className="info-item col-5">
                    <span className="label">Relay Type:</span>
                    <span className="value">{SecondPageData.RelayType || "NAN"}</span>
                  </div>

                  <div className="info-item col-5">
                    <span className="label">Protection Function:</span>
                    <span className="value">{SecondPageData.ProtectionFunction || "NAN"}</span>
                  </div>

                  <div className="info-item col-5">
                    <span className="label">{`Irn(A):`}</span>
                    <span className="value">{SecondPageData.IrnA || "NAN"}</span>
                  </div>

                  <div className="info-item col-5">
                    <span className="label"> {`Relay Burden-Prn (VA)`}</span>
                    <span className="value">{SecondPageData.BurdenPhaseVA || "NAN"}</span>

                  </div>

                  <div className="info-item col-5">
                    <span className="label">{`Thermal capablity-Ith (Ir)`}</span>
                    {SecondPageData?.Ith_IrList?.[0] ?? "NAN"}
                  </div>

                  <div className="info-item col-5">
                    <span className="label">{`Cal. Acc. To `}</span>
                    <span className="value">{SecondPageData.Cal_Acc_ToVA || "NAN"}</span>
                  </div>

                </div>

                <div className='mt-4 col-12 center justify-content-start row'>
                  <h3 style={{ background: "indianred" }} className="section-title section_title_Sub">
                    <BoltIcon className='pdfIcons'></BoltIcon>

                    CT Information</h3>
                  <div className="info-item col-5">
                    <span className="label">CT name:</span>
                    <span className="value">{ThirdPageData.CTName || "NAN"}</span>
                  </div>
                  <div className="info-item col-5">
                    <span className="label">CT Standard:</span>
                    {SecondPageData?.Cal_Acc_ToVA?.includes("IEC") ? "IEC" : "ANSI"}
                  </div>

                  <div className="info-item col-5">
                    <span className="label">{`CT Class:`}</span>
                    <span className="value">{ThirdPageData.SelectedCtClass || "NAN"}</span>
                  </div>

                  <div className="info-item col-5">
                    <span className="label">{`Primary current,Ipn (A)`}</span>
                    <span className="value">{ThirdPageData.CTPrimary || "NAN"}</span>

                  </div>

                  <div className="info-item col-5">
                    <span className="label">{`Secondry current,Isn (A)`}</span>
                    <span className="value">{ThirdPageData.CTSecondary || "NAN"}</span>
                  </div>

                  <div className="info-item col-5">
                    <span className="label">{`CT Resistance @ 75°C`}</span>
                    <span className="value">{ThirdPageData.CTResistance || "NAN"}</span>
                  </div>

                  {SecondPageData?.Cal_Acc_ToVA?.includes("IEC") &&
                    <Fragment>

                      <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                        <InfoIcon className='pdfIconsSecondry'></InfoIcon>
                        IEC Specified</h3>

                      {SecondPageData.Cal_Acc_ToVA.includes("IEC-P") || A7 === "IEC-TP" &&
                        <div className="info-item col-5">
                          <span className="label">{`Rated Accuracy Limit Factor (ALF,K_SCC)`}</span>
                          <span className="value">{ThirdPageData.ALF_K_SCC || "NAN"}</span>
                        </div>

                      }
                      {A7 === "IEC-P" &&

                        <div className="info-item col-5">
                          <span className="label">{`Acuuracy rated burden,Pcn (VA)`}</span>
                          <span className="value">{ThirdPageData.Sr || "NAN"}</span>
                        </div>
                      }


                      {A7 === "IEC-TP" &&
                        <Fragment>


                          <div className="info-item col-5">
                            <span className="label">{`Transient Dimension Factor (Ktd)`}</span>
                            <span className="value">{ThirdPageData.KTD || "NAN"}</span>
                          </div>

                          <div className="info-item col-5">
                            <span className="label">{`Rated Accuracy Burden (Rr)`}</span>
                            <span className="value">{ThirdPageData.Rr || "NAN"}</span>
                          </div>

                        </Fragment>
                      }
                      {A7 === "IEC-PX" &&
                        <Fragment>

                          <div className="info-item col-5">
                            <span className="label">{`Rated Knee Point EMF (Ek)`}</span>
                            <span className="value">{ThirdPageData.EK || "NAN"}</span>
                          </div>

                          <div className="info-item col-5">
                            <span className="label">{`Exicting at Ek (Ie)`}</span>
                            <span className="value">{ThirdPageData.Ie || "NAN"}</span>
                          </div>


                        </Fragment>
                      }


                    </Fragment>

                  }

                  {SecondPageData?.Cal_Acc_ToVA?.includes("ANSI") &&
                    <Fragment>

                      <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                        <InfoIcon className='pdfIconsSecondry' ></InfoIcon>
                        ANSI Specified</h3>
                      {A7 === "ANSI-C/T" &&
                        <div className="info-item col-5">
                          <span className="label">{`Termial Voltage (ANSI C/T) (Vt)`}</span>
                          <span className="value">{ThirdPageData.Vt || "NAN"}</span>
                        </div>
                      }


                      {A7 === "ANSI-X" &&
                        <Fragment>
                          <div className="info-item col-5">
                            <span className="label">{`Knee Point Voltage (ANSI-X) (Vk)`}</span>
                            <span className="value">{ThirdPageData.Vk || "NAN"}</span>
                          </div>

                          <div className="info-item col-5">
                            <span className="label">{`Exicting current at Vk (Ik)`}</span>
                            <span className="value">{ThirdPageData.Ik || "NAN"}</span>
                          </div>
                        </Fragment>
                      }

                    </Fragment>

                  }



                </div>


                <div className='mt-4 col-12 center justify-content-start row'>
                  <h3 style={{ background: "darkslateblue" }} className="section-title section_title_Sub">
                    <CompareArrowsIcon className='pdfIcons'></CompareArrowsIcon>
                    Conductor Information</h3>


                  <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                    <InfoIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </InfoIcon>
                    Selected material: Cu</h3>

                  <div className="info-item col-5">
                    <span className="label">{`Length (m)`}</span>
                    <span className="value">{FourthPageData.Length || "NAN"}</span>
                  </div>
                  <div className="info-item col-5">
                    <span className="label">{`Cross section-Ac (mm²)`}</span>
                    <span className="value">{FourthPageData.CrossSection || "NAN"}</span>
                  </div>


                </div>


                <div className='mt-4 col-12 center justify-content-start row'>
                  <h3 className="section-title section_title_Sub"><CableIcon className='pdfIcons'></CableIcon> {`Wire resistance (75°)`}</h3>
                  {FourthPageData.Material == "Cu" &&

                    <Fragment>

                      <div className="info-item flex-row WFull" style={{ fontSize: '24px' }}>
                        <InlineMath math="\mathbf{\rho}(75^\circ) = \mathbf{\textcolor{#1976d2}{0.0225}} \, \frac{\mathbf{\Omega} \cdot \mathbf{mm}^2}{\mathbf{m}}" />
                      </div>
                    </Fragment>

                  }

                  {FourthPageData.Material == "Al" &&
                    <Fragment>
                      <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                        <InfoIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}></InfoIcon>
                        Selected material: Al</h3>
                      <div className="info-item WFull" style={{ fontSize: '24px' }}>
                        <InlineMath math="\rho(75^\circ) = " />
                        <span className="value">0.0376 </span>
                      </div>
                    </Fragment>
                  }

                  <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                    <InlineMath math={Z2_Use} />
                  </div>







                </div>

                <div className='mt-4 col-12 center justify-content-start row'>
                  <h3 className="section-title section_title_Sub"><BatteryUnknownIcon className='pdfIcons'></BatteryUnknownIcon>  {`Relay burden:`}</h3>
                </div>

                <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                  <InlineMath math={Z3_Use} />
                </div>


                {Cal_Acc_ToVA == "IEC-P" &&

                  <Fragment>
                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Actual ALF [ref: IEC-P]:`}</h3>
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z4_Use} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z5_Use} />
                    </div>
                  </Fragment>

                }

                {Cal_Acc_ToVA == "IEC-TP" &&

                  <Fragment>
                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Actual K_SSC [ref: IEC-TP]:`}</h3>
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z6_Use} />
                    </div>
                  </Fragment>

                }



                {(A2 == "P12x" || A2 == "P12y" || A2 == "P14x") && A3 == "50/51+N" &&
                  <Fragment>


                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Function information 50/51:`}</h3>
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={IDMT_Setting} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Instantaneous_OC_Setting} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={System_Max_Fault_Current} />
                    </div>

                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Definite time / IDMT overcurrent requierment:`}</h3>
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Vk_req_Formula} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Vk_req_Value} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Icp_Formula} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Icp_Value} />
                    </div>



                    <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                      Result for definite time/IDMT overcurrent:</h3>
                    {Cal_Acc_ToVA == "IEC-PX" &&
                      <Fragment>
                        <h4 className='m-2'>
                          {`Requiered Knee point voltage of CT [ref: Relay manual]:`}
                        </h4>
                        <div className="col-12 center p-3">
                          {ThirdPageData.EK >= Z7
                            ? <h4 style={{ color: "green", fontWeight: "1000", border: "1px solid #1976d2" }}>{`Vk_CT >= Vk_req, Condition OK`}</h4>
                            : <h4 style={{ color: "red", fontWeight: "1000", border: "1px solid #1976d2" }}>{`Vk_CT < Vk_req, Condition Not OK`}</h4>}
                        </div>
                      </Fragment>
                    }

                    {Cal_Acc_ToVA == "IEC-P" &&
                      <Fragment>
                        <h4 className='m-2'>
                          {`Requiered ALF [ref: IEC-P]:`}
                        </h4>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Eal_req_Formula_1} />
                          <InlineMath math={Eal_req_Formula_2} />
                        </div>
                        <IEXP_Approval Condition={Z4 >= Z9} />
                      </Fragment>
                    }



                    {Cal_Acc_ToVA == "IEC-TP" &&
                      <Fragment>
                        <h4 className='m-2'>
                          {`Requiered K_SSC [ref:IEC-TP]:`}
                        </h4>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={K_SSC_Formula_1} />
                          <InlineMath math={K_SSC_Formula_2} />
                        </div>

                        <div className="col-12 center p-3">
                          {Z6 >= Z10
                            ? <h4 style={{ color: "green", fontWeight: "1000", border: "1px solid #1976d2" }}>{`K_SSC_actual >= K_SSC_req, Condition OK`}</h4>
                            : <h4 style={{ color: "red", fontWeight: "1000", border: "1px solid #1976d2" }}>{`K_SSC_actual < K_SSC_req, Condition Not OK`}</h4>}
                        </div>
                      </Fragment>
                    }

                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Instantanous overcurrent requierment:`}</h3>
                    </div>
                    <h4>{`Requiered Knee point voltage of CT [ref: Relay manual]:`}</h4>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z11Formula} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={VKReqFormula} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={IspFormula} />
                    </div>

                    <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                      Result for instantanous overcurrent:</h3>

                    {Cal_Acc_ToVA == "IEC-PX" &&
                      <Fragment>
                        <h4 className='m-2'>
                          {`Requiered Knee point voltage of CT [ref: Relay manual]:`}
                        </h4>
                        <div className="col-12 center p-3">
                          {ThirdPageData.EK >= Z11
                            ? <h4 style={{ color: "green", fontWeight: "1000", border: "1px solid #1976d2" }}>{`Vk_CT >= Vk_req,Condition OK`}</h4>
                            : <h4 style={{ color: "red", fontWeight: "1000", border: "1px solid #1976d2" }}>{`Vk_CT < Vk_req, Condition Not OK`}</h4>}
                        </div>
                      </Fragment>
                    }


                    {Cal_Acc_ToVA == "IEC-P" &&
                      <Fragment>
                        <h4 className='m-2'>
                          {`Requiered ALF [ref:IEC-P]:`}
                        </h4>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={EALReqFormula} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={AlfReqFormulaForEAL} />
                        </div>
                        <IEXP_Approval Condition={Z4 >= Z13} />
                      </Fragment>
                    }

                    {Cal_Acc_ToVA == "IEC-TP" &&
                      <Fragment>
                        <h4 className='m-2'>
                          {`Requiered ALF [ref:IEC-TP]:`}
                        </h4>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={K_SSCZ14_main} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={K_SSCZ14_value} />
                        </div>
                        <div className="col-12 center p-3">
                          {Z6 >= Z14
                            ? <h4 style={{ color: "green", fontWeight: "1000", border: "1px solid #1976d2" }}>{`K_SSC_actual >= K_SSC_req, Condition OK`}</h4>
                            : <h4 style={{ color: "red", fontWeight: "1000", border: "1px solid #1976d2" }}>{`K_SSC_actual < K_SSC_req, Condition Not OK`}</h4>}
                        </div>

                      </Fragment>
                    }


                    {(SecondPageData.RelayType == "P12y" | SecondPageData.RelayType == "P12x") & (SecondPageData.ProtectionFunction == "50/51+N") &&
                      <Fragment>



                        <div className='mt-4 col-12 center justify-content-start row'>
                          <h3 className="section-title section_title_Sub">{`Function information 50N/51N:`}</h3>
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={IDMTSETTINGS} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={IOS} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={SMPFC} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={SMPFCAnswer} />
                        </div>


                      </Fragment>
                    }

                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Definite time / IDMT earth fault requierment :`}</h3>
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Vk_req_FormulaIDMT} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Vk_req_ValueIDMT} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Icn_Formula} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Icn_Value} />
                    </div>


                    {Cal_Acc_ToVA == "IEC-PX" &&

                      <Fragment>
                        <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          Results for standard: IEC-PX</h3>


                        <div className="col-12 center p-3">
                          {ThirdPageData.EK >= Z15
                            ? <h4 style={{ color: "green", fontWeight: "1000", border: "1px solid #1976d2" }}>{`Vk_CT>=Vk_req, Condition OK`}</h4>
                            : <h4 style={{ color: "red", fontWeight: "1000", border: "1px solid #1976d2" }}>{`Vk_CT < Vk_req, Condition Not OK`}</h4>}
                        </div>
                      </Fragment>

                    }

                    {Cal_Acc_ToVA == "IEC-P" &&

                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          Results for standard: IEC-P</h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Eal_req_FormulaIDMT_main} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={ALF_req_value} />
                        </div>
                        <IEXP_Approval Condition={Z4 >= Z17} />


                      </Fragment>

                    }

                    {Cal_Acc_ToVA == "IEC-TP" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          Results for standard: IEC-TP</h3>



                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={K_SSCZ14IDMT_main} />
                        </div>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={K_SCC_req_value} />
                        </div>


                        <div className="col-12 center p-3">
                          {Z6 >= Z18
                            ? <h4 style={{ color: "green", fontWeight: "1000", border: "1px solid #1976d2" }}>{`K_SSC_actual >= K_SSC_req, Condition OK`}</h4>
                            : <h4 style={{ color: "red", fontWeight: "1000", border: "1px solid #1976d2" }}>{`K_SSC_actual < K_SSC_req, Condition Not OK`}</h4>}
                        </div>
                      </Fragment>
                    }


                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Instantanous earth fault requierment:`}</h3>
                    </div>
                  </Fragment>

                }


                <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                  <InlineMath math={Z19Formula} />
                </div>

                <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                  <InlineMath math={Z19Holder} />
                </div>

                <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                  <InlineMath math={ISN_IEDOUBLE} />
                </div>



                {Cal_Acc_ToVA == "IEC-PX" &&

                  <Fragment>
                    <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                      Results for standard: IEC-PX</h3>

                    {/* <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
            <InlineMath math={K_SSCZ14IDMT} />
          </div> */}


                    <div className="col-12 center p-3">
                      {Number(ThirdPageData.EK) >= Z19
                        ? <h4 style={{ color: "green", fontWeight: "1000", border: "1px solid #1976d2" }}>{`Vk_CT >= Vk_req, Condition OK`}</h4>
                        : <h4 style={{ color: "red", fontWeight: "1000", border: "1px solid #1976d2" }}>{`Vk_CT < Vk_req, Condition Not OK`}</h4>}
                    </div>
                  </Fragment>
                }


                {Cal_Acc_ToVA == "IEC-P" &&

                  <Fragment>
                    <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                      Results for standard: IEC-P</h3>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z21Holder_main} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={ALF_req_value2} />
                    </div>

                    <IEXP_Approval Condition={Z4 >= Z21} />

                  </Fragment>
                }


                {Cal_Acc_ToVA == "IEC-TP" &&
                  <Fragment>
                    <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                      Results for standard: IEC-TX</h3>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z22Holder_main} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={K_SCC_req_value2} />
                    </div>


                    <div className="col-12 center p-3">
                      {Z6 >= Z22
                        ? <h4 style={{ color: "green", fontWeight: "1000", border: "1px solid #1976d2" }}>{`K_SSC_actual >= K_SSC_req, Condition OK`}</h4>
                        : <h4 style={{ color: "red", fontWeight: "1000", border: "1px solid #1976d2" }}>{`K_SSC_actual < K_SSC_req, Condition Not OK`}</h4>}
                    </div>
                  </Fragment>
                }

                {(A2 == "P12x" || A2 == "P12y" || A2 == "P14x") && A3 == "HI REF" &&

                  <Fragment>
                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Function information HI REF:`}</h3>
                    </div>



                    <div className="info-item col-5">
                      <span className="label">{`Maximum external fault current,If-max-ext (kA)`}</span>
                      <span className="value">{B2_3 || "NAN"}</span>
                    </div>

                    <div className="info-item col-5">
                      <span className="label">{`Current setting, Is(A)`}</span>
                      <span className="value">{B2_4 || "NAN"}</span>
                    </div>



                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Stablishing resistance [ref: Relay manual]:`}</h3>
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={RSFormula} />
                    </div>


                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`High impedance REF requierment: `}</h3>
                    </div>

                    <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                      Requiered Knee point voltage of CT [ref: Relay manual]:
                    </h3>


                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={VkReqInequality} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={VkReqEquation} />
                    </div>




                    {Cal_Acc_ToVA == "IEC-PX" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          Results for standard: IEC-PX</h3>
                        <div className="col-12 center p-3">
                          {C11 >= Z24
                            ? <h4 style={{ color: "green", fontWeight: "1000", border: "1px solid #1976d2" }}>{`Vk_CT >= Vk_req, Condition OK`}</h4>
                            : <h4 style={{ color: "red", fontWeight: "1000", border: "1px solid #1976d2" }}>{`Vk_CT < Vk_req, Condition Not OK`}</h4>}
                        </div>
                      </Fragment>
                    }


                    {Cal_Acc_ToVA == "IEC-P" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          Results for standard: IEC-P</h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Eal_req_FormulaHIIR_main} />
                        </div>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={ALF_req_value_HIIR} />
                        </div>

                        <IEXP_Approval Condition={Z4 >= Z24} />


                      </Fragment>
                    }

                    {Cal_Acc_ToVA == "IEC-TP" &&
                      <Fragment>
                        <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                          Requiered K_SSC [ref:IEC standard]:
                        </h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z26Holder_main} />
                        </div>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={K_SCC_req_value_Z26} />
                        </div>

                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          Results for standard: IEC-TP</h3>

                        <div className="col-12 center p-3">
                          {Z6 >= Z26
                            ? <h4 style={{ color: "green", fontWeight: "1000", border: "1px solid #1976d2" }}>{`K_SSC_actual >= K_SSC_req, Condition OK`}</h4>
                            : <h4 style={{ color: "red", fontWeight: "1000", border: "1px solid #1976d2" }}>{`K_SSC_actual < K_SSC_req, Condition Not OK`}</h4>}
                        </div>
                      </Fragment>
                    }

                  </Fragment>
                }


                {(A2 == "P132" || A2 == "P139") &&
                  <Fragment>

                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Function information 50/51:`}</h3>
                    </div>



                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Definite time overcurrent requierment:`}</h3>
                    </div>


                    <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon className='pdfIconsSecondry'></InfoIcon>
                      Requiered Knee point voltage of CT [ref: Relay manual]:</h3>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z27Formula} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z27Holder} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z28Formula} />
                    </div>
                    <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <SecurityIcon className='pdfIconsSecondry'></SecurityIcon>
                      Minimum equiered ALF of CT [ref: Relay manual]:</h3>


                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={KtdKSSC_Boxed} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={KtdKSSC_Value} />
                    </div>


                    {Cal_Acc_ToVA == "IEC-PX" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          IEC-PX: Result for definite time overcurrent:</h3>
                        <div className="col-12 center p-3">
                          {C11 >= Z27
                            ? <h4 style={{ color: "green", fontWeight: "1000", border: "1px solid #1976d2" }}>{`Vk_CT >= Vk_req, Condition OK`}</h4>
                            : <h4 style={{ color: "red", fontWeight: "1000", border: "1px solid #1976d2" }}>{`Vk_CT < Vk_req, Condition Not OK`}</h4>}
                        </div>
                      </Fragment>
                    }

                    {Cal_Acc_ToVA == "IEC-P" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          Results for standard: IEC-P</h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={alfFormula} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z30Holder} />
                        </div>

                        <IEXP_Approval Condition={Z4 >= Z30} />


                      </Fragment>
                    }




                    {Cal_Acc_ToVA == "IEC-TP" &&
                      <Fragment>
                        <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                          Requiered K_SSC [ref:IEC standard]:

                        </h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={EAlReq2} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z31Holder} />
                        </div>

                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          Results for standard: IEC-TP</h3>

                        <div className="col-12 center p-3">
                          {Z6 >= Z31
                            ? <h4 style={{ color: "green", fontWeight: "1000", border: "1px solid #1976d2" }}>{`K_SSC_actual >= K_SSC_req, Condition OK`}</h4>
                            : <h4 style={{ color: "red", fontWeight: "1000", border: "1px solid #1976d2" }}>{`K_SSC_actual < K_SSC_req, Condition Not OK`}</h4>}
                        </div>
                      </Fragment>
                    }





                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Inverse time overcurrent requierment:`}</h3>
                    </div>

                    <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                      Requiered Knee point voltage of CT [ref: Relay manual]:
                    </h3>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z27Formula} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z32Holder} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z33Formula} />
                    </div>


                    <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <SecurityIcon className='pdfIconsSecondry'></SecurityIcon>
                      Minimum Requiered ALF of CT [ref: Relay manual]:</h3>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z34Formula} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z34Holder} />
                    </div>



                    {Cal_Acc_ToVA == "IEC-PX" &&
                      <IECPX_Approval Condition={C11 >= Z32} />
                    }


                    {Cal_Acc_ToVA == "IEC-P" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          Results for standard: IEC-P</h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={alfFormula} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z35Holder} />
                        </div>


                        <IEXP_Approval Condition={Z4 >= Z35} />

                      </Fragment>
                    }


                    {Cal_Acc_ToVA == "IEC-TP" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          Results for standard: IEC-TP</h3>

                        <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                          Requiered K_SSC [ref:IEC standard]:

                        </h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={EAlReq2} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z36Holder} />
                        </div>

                        <IECTP_Approval Condition={Z6 >= Z36} />
                      </Fragment>
                    }


                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Function information 50N/51N:`}</h3>
                    </div>

                    <div className="info-item col-5">
                      <span className="label">{`IDMT setting,Iph> (A)`}</span>
                      <span className="value">{B1_5 || "NAN"}</span>
                    </div>

                    <div className="info-item col-5">
                      <span className="label">{`Instantaneous overcurrent setting,Iph>> (A)`}</span>
                      <span className="value">{B1_4 || "NAN"}</span>
                    </div>

                    <div className="info-item col-5">
                      <span className="label">{`System maximum fault current,Iphmax (kA)`}</span>
                      <span className="value">{B1_7 || "NAN"}</span>
                    </div>

                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Definite time earth fault requierment:`}</h3>
                    </div>



                    <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <SecurityIcon className='pdfIconsSecondry'></SecurityIcon>
                      Requiered Knee point voltage of CT [ref: Relay manual]:</h3>



                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z37Formula} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z37Holder} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z38Formula} />
                    </div>

                    <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <SecurityIcon className='pdfIconsSecondry'></SecurityIcon>
                      Minimum Requiered ALF of CT [ref: Relay manual]:</h3>


                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={KtdKSSC_BoxedZ39} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={KtdKSSC_ValueZ39} />
                    </div>


                    {Cal_Acc_ToVA == "IEC-PX" &&
                      <IECPX_Approval Condition={C11 > Z37} />
                    }



                    {Cal_Acc_ToVA == "IEC-P" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          Results for standard: IEC-P</h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={alfFormulaZ40} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z40Holder} />
                        </div>
                        <IEXP_Approval Condition={Z4 >= Z40} />

                      </Fragment>
                    }


                    {Cal_Acc_ToVA == "IEC-TP" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          Results for standard: IEC-TP</h3>

                        <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                          Requiered K_SSC [ref:IEC standard]:
                        </h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={EAlReq2} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z41Holder} />
                        </div>


                        <IECTP_Approval Condition={Z6 >= Z41} />
                      </Fragment>
                    }


                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Inverse time earth fault requierment:`}</h3>
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z42Formula} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z42Holder} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z43Formula} />
                    </div>

                    <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <SecurityIcon className='pdfIconsSecondry'></SecurityIcon>
                      Minimum equiered ALF of CT [ref: Relay manual]:</h3>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={KtdKSSC_Boxed} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={KtdKSSC_ValueZ44} />
                    </div>


                    {Cal_Acc_ToVA == "IEC-PX" &&
                      <IECPX_Approval Condition={C11 > Z42} />
                    }


                    {Cal_Acc_ToVA == "IEC-P" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          Results for standard: IEC-P</h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={alfFormulaZ40} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z45Holder} />
                        </div>
                        <IEXP_Approval Condition={Z4 >= Z45} />

                      </Fragment>
                    }


                    {Cal_Acc_ToVA == "IEC-TP" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          Results for standard: IEC-TP</h3>

                        <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                          Requiered K_SSC [ref:IEC standard]:
                        </h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={EAlReq2} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z46Holder} />
                        </div>


                        <IECTP_Approval Condition={Z6 >= Z46} />
                      </Fragment>
                    }
                  </Fragment>

                }


                {((A2 == "P14x" && A3 == '50/51+N') || A2 == "P84x") &&
                  <Fragment>

                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Function information 50/51:`}</h3>
                    </div>

                    <div className="info-item col-5">
                      <span className="label">{`IDMT setting,Iph> (A)`}</span>
                      <span className="value">{B1_3 || "NAN"}</span>
                    </div>

                    <div className="info-item col-5">
                      <span className="label">{`Instantaneous overcurrent setting,Iph>> (A)`}</span>
                      <span className="value">{B1_2 || "NAN"}</span>
                    </div>

                    <div className="info-item col-5">
                      <span className="label">{`System maximum fault current,Iphmax (kA)`}</span>
                      <span className="value">{B1_6 || "NAN"}</span>
                    </div>


                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Directional and non-directional definite time / IDMT overcurrent requierment:`}</h3>
                    </div>



                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z47Formula} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z47Holder} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z48Formula} />
                    </div>


                    {Cal_Acc_ToVA == "IEC-PX" &&
                      <IECPX_Approval Text={"Result for directional and non-directional definite time/IDMT overcurrent:"} Condition={C11 > Z47} />
                    }


                    {Cal_Acc_ToVA == "IEC-P" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          IEC-P: Result for directional and non-directional definite time/IDMT overcurrent</h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={alfFormulaZ40} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z49Holder} />
                        </div>
                        <IEXP_Approval Condition={Z4 >= Z49} />

                      </Fragment>
                    }


                    {Cal_Acc_ToVA == "IEC-TP" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          Results for standard: IEC-TP</h3>

                        <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                          Requiered K_SSC [ref:IEC standard]:
                        </h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z50Formula} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z50Holder} />
                        </div>


                        <IECTP_Approval Condition={Z6 >= Z50} />
                      </Fragment>
                    }

                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Instantanous non-directional overcurrent requierment:`}</h3>
                    </div>



                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z51Formula} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z51Holder} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z52Formula} />
                    </div>






                    {Cal_Acc_ToVA == "IEC-PX" &&
                      <IECPX_Approval Text={"Result for instantanous non-directional overcurrent:"} Condition={C11 > Z51} />
                    }


                    {Cal_Acc_ToVA == "IEC-P" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          IEC-P: Result for instantanous non-directional overcurrent:</h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={alfFormulaZ53} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z53Holder} />
                        </div>
                        <IEXP_Approval Condition={Z4 >= Z53} />

                      </Fragment>
                    }




                    {Cal_Acc_ToVA == "IEC-TP" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          IEC-TP: Result for  instantanous non-directional overcurrent
                        </h3>

                        <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                          Requiered K_SSC [ref:IEC standard]:
                        </h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z54Formula} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z54Holder} />
                        </div>

                        <IECTP_Approval Condition={Z6 >= Z54} />
                      </Fragment>
                    }


                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Instantanous directional overcurrent requierment:`}</h3>
                    </div>


                    <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <SecurityIcon className='pdfIconsSecondry'></SecurityIcon>
                      Requiered Knee point voltage of CT [ref: Relay manual]:</h3>


                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z55Formula} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z55Holder} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z56Formula} />
                    </div>



                    {Cal_Acc_ToVA == "IEC-PX" &&
                      <IECPX_Approval Text={"Result for  instantanous directional overcurrent:"} Condition={C11 > Z55} />
                    }


                    {Cal_Acc_ToVA == "IEC-P" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          IEC-P: Result for instantanous non-directional overcurrent:</h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={alfFormulaZ57} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z57Holder} />
                        </div>
                        <IEXP_Approval Condition={Z4 >= Z57} />

                      </Fragment>
                    }


                    {Cal_Acc_ToVA == "IEC-TP" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          IEC-TP: Result for  instantanous non-directional overcurrent
                        </h3>

                        <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                          Requiered K_SSC [ref:IEC standard]:
                        </h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z58Holder} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z58Formula} />
                        </div>

                        <IECTP_Approval Condition={Z6 >= Z58} />
                      </Fragment>
                    }





                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Function information 50N/51N:`}</h3>
                    </div>

                    <div className="info-item col-5">
                      <span className="label">{`IDMT setting,Ie> (A)`}</span>
                      <span className="value">{B1_5 || "NAN"}</span>
                    </div>

                    <div className="info-item col-5">
                      <span className="label">{`Instantaneous overcurrent setting,Ie>> (A)`}</span>
                      <span className="value">{B1_4 || "NAN"}</span>
                    </div>

                    <div className="info-item col-5">
                      <span className="label">{`System maximum phase fault current,Iemax (kA)`}</span>
                      <span className="value">{B1_7 || "NAN"}</span>
                    </div>




                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Definite time / IDMT directional and non-directional earth fault and SEF requierment:`}</h3>
                    </div>

                    <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <SecurityIcon className='pdfIconsSecondry'></SecurityIcon>
                      Requiered Knee point voltage of CT [ref: Relay manual]:</h3>


                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z59Formula} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z59Holder} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z60Formula} />
                    </div>


                    {Cal_Acc_ToVA == "IEC-PX" &&
                      <IECPX_Approval Text={"Result for definite time/IDMT earth fault/SEF:"} Condition={C11 > Z59} />
                    }


                    {Cal_Acc_ToVA == "IEC-P" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          IEC-P: Requiered ALF [ref:IEC standard]:</h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={alfFormulaZ61} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z61Holder} />
                        </div>

                        <IEXP_Approval Text={"Result for definite time/IDMT earth fault/SEF:"} Condition={Z4 >= Z61} />

                      </Fragment>
                    }




                    {Cal_Acc_ToVA == "IEC-TP" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          IEC-TP: Result for  instantanous non-directional overcurrent
                        </h3>

                        <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                          Requiered K_SSC [ref:IEC standard]:
                        </h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z62Formula} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z62Holder} />
                        </div>

                        <IECTP_Approval Condition={Z6 >= Z62} />
                      </Fragment>
                    }


                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Instantanous non-directional earth fault and SEF requierment:`}</h3>
                    </div>


                    <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <SecurityIcon className='pdfIconsSecondry'></SecurityIcon>
                      Requiered Knee point voltage of CT [ref: Relay manual]:</h3>


                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z63Formula} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z63Holder} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z64Formula} />
                    </div>


                    {Cal_Acc_ToVA == "IEC-PX" &&
                      <IECPX_Approval Text={"Result for instantanous non-directional earth fault/SEF:"} Condition={C11 > Z63} />
                    }


                    {Cal_Acc_ToVA == "IEC-P" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          IEC-P: Requiered ALF [ref:IEC standard]:</h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={alfFormulaZ65} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z65Holder} />
                        </div>

                        <IEXP_Approval Text={"Result for instantanous non-directional earth fault/SEF:"} Condition={Z4 >= Z65} />

                      </Fragment>
                    }


                    {Cal_Acc_ToVA == "IEC-TP" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          IEC-TP: Result for  instantanous non-directional overcurrent
                        </h3>

                        <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                          Requiered K_SSC [ref:IEC standard]:
                        </h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z66Formula} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z66Holder} />
                        </div>

                        <IECTP_Approval Condition={Z6 >= Z66} />
                      </Fragment>
                    }



                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Instantanous directional earth fault and SEF requierment:`}</h3>
                    </div>

                    <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <SecurityIcon className='pdfIconsSecondry'></SecurityIcon>
                      Requiered Knee point voltage of CT [ref: Relay manual]:</h3>



                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z67Formula} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z67Holder} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={Z68Formula} />
                    </div>


                    {Cal_Acc_ToVA == "IEC-PX" &&
                      <IECPX_Approval Text={"Result for instantanous directional earth fault/SEF:"} Condition={C11 > Z67} />
                    }


                    {Cal_Acc_ToVA == "IEC-P" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          IEC-P: Requiered ALF [ref:IEC standard]:</h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={alfFormulaZZ69} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z69Holder} />
                        </div>

                        <IEXP_Approval Text={"Result for instantanous directional earth fault/SEF:"} Condition={Z4 >= Z69} />

                      </Fragment>
                    }



                    {Cal_Acc_ToVA == "IEC-TP" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          IEC-TP: Result for instantanous directional earth fault/SEF:
                        </h3>

                        <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                          Requiered K_SSC [ref:IEC standard]:
                        </h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z70Formula} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z70Holder} />
                        </div>

                        <IECTP_Approval Condition={Z6 >= Z70} />
                      </Fragment>
                    }


                  </Fragment>

                }


                {(A2 == "P433" || A2 == 'P435') &&


                  <Fragment>
                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Function information 21:`}</h3>
                    </div>

                    <div className="row col-12">


                      <div className="info-item col-5">
                        <span className="label">{`System nominal voltage Us (kV)`}</span>
                        <span className="value">{B3_2 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{`System maximum fault current at local end of line Ifs (kA)`}</span>
                        <span className="value">{B3_3 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{`System time constant Tsys (s)`}</span>
                        <span className="value">{B3_4 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{'Line resistance R` (ohm/km)'}</span>
                        <span className="value">{B3_5 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{'Line reatance X` (ohm/km)'}</span>
                        <span className="value">{B3_6 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{`Line length (km)`}</span>
                        <span className="value">{B3_7 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{`Z1 set (%)`}</span>
                        <span className="value">{B3_8 || "NAN"}</span>
                      </div>

                    </div>

                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Distance protection requierment:`}</h3>
                    </div>

                    <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                      Requiered Knee point voltage of CT [ref: Relay manual]:
                    </h3>


                    <div
                      className="info-item WFull justify-content-start align-items-start  col-12"
                    >
                      <BlockMath math={Vk_ineq} />
                    </div>

                    <div
                      className="info-item WFull justify-content-start align-items-start  col-12"
                    >
                      <div
                        style={{
                          fontFamily: '"Times New Roman", serif', // Mimics LaTeX’s default serif font
                          fontSize: '16px',
                          lineHeight: '1.5',
                          textAlign: 'left',
                          maxWidth: '600px',
                        }}
                      >

                        <h3 className='section-title noBorder m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <InfoIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </InfoIcon>
                          Base on the relay manual and as per IEC 60255-21 standard following conditions should be checked to calculate required knee point voltage:
                        </h3>


                        <h3 className='section-title noBorder m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <InfoIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </InfoIcon>
                          Case 1: Close-up backward short-circuit (security case)
                        </h3>


                        <h3 className='section-title noBorder  m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <InfoIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </InfoIcon>
                          Acceptance criteria: Stable backward direction decision, no trip
                        </h3>

                        <h3 className='section-title noBorder m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <InfoIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </InfoIcon>
                          Curve C is an imperial curve obtained by relay manufacture.
                        </h3>

                      </div>
                    </div>

                    <div
                      className="info-item WFull justify-content-start align-items-start col-12"
                    >
                      <InlineMath math={Vk_req_Full} />
                    </div>

                    <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </InfoIcon>
                      Base on input data:
                    </h3>



                    <div
                      className="info-item WFull justify-content-start align-items-start col-12"
                    >
                      <InlineMath math={XpOverRp} />
                    </div>

                    <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </InfoIcon>
                      From curve C:
                    </h3>

                    <div
                      className="info-item WFull justify-content-start align-items-start col-12"
                    >
                      <InlineMath math={KEMP} />
                    </div>

                    <div
                      className="info-item WFull justify-content-start align-items-start col-12"
                    >
                      <InlineMath math={Kssc} />
                    </div>

                    <div
                      className="info-item WFull justify-content-start align-items-start col-12"
                    >
                      <InlineMath math={KReq_Greater} />
                    </div>


                    <h3 className='section-title noBorder m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </InfoIcon>
                      Case2: Close-up forward short-circuit (dependability case)
                    </h3>

                    <h3 className='section-title noBorder m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </InfoIcon>
                      Acceptance criterion: Instantaneous trip with less than 1 period add. delay
                    </h3>

                    <h3 className='section-title noBorder m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </InfoIcon>
                      Required Kemp = 1.5
                    </h3>

                    <div
                      className="info-item WFull justify-content-start align-items-start col-12"
                    >
                      <InlineMath math={KReq_Greater2} />
                    </div>


                    <h3 className='section-title noBorder m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </InfoIcon>
                      Case 3: Short-circuit at 80% of Zone 1 reach limit (dependability case)
                    </h3>
                    <h3 className='section-title noBorder m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </InfoIcon>
                      Acceptance criterion: Trip with less than 3 periods add. delay
                    </h3>
                    <h3 className='section-title noBorder m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </InfoIcon>
                      Select required Kemp per curve B
                    </h3>

                    <h3 className='section-title noBorder m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </InfoIcon>
                      Curve B is an imperical curve obtained by relay manufacture:
                    </h3>

                    <div
                      className="info-item WFull justify-content-start align-items-start col-12"
                    >
                      <InlineMath math={KempPiecewise} />
                    </div>

                    <div
                      className="info-item WFull justify-content-start align-items-start col-12"
                    >
                      <InlineMath math={Xsys} />
                    </div>
                    <div
                      className="info-item WFull justify-content-start align-items-start col-12"
                    >
                      <InlineMath math={Rsys} />
                    </div>
                    <div
                      className="info-item WFull justify-content-start align-items-start col-12"
                    >
                      <InlineMath math={Xline} />
                    </div>
                    <div
                      className="info-item WFull justify-content-start align-items-start col-12"
                    >
                      <InlineMath math={Rline} />
                    </div>
                    <div
                      className="info-item WFull justify-content-start align-items-start col-12"
                    >
                      <InlineMath math={XpOverRp2} />
                    </div>

                    <h3 className='section-title noBorder m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </InfoIcon>
                      From curve B:
                    </h3>

                    <div
                      className="info-item WFull justify-content-start align-items-start col-12"
                    >
                      <InlineMath math={KEMP2} />
                    </div>

                    <div
                      className="info-item WFull justify-content-start align-items-start col-12"
                    >
                      <InlineMath math={L1} />
                    </div>

                    <div
                      className="info-item WFull justify-content-start align-items-start col-12"
                    >
                      <InlineMath math={L2} />
                    </div>

                    <div
                      className="info-item WFull justify-content-start align-items-start col-12"
                    >
                      <InlineMath math={L3} />
                    </div>


                    <h3 className='section-title noBorder m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </InfoIcon>
                      Case4: Short-circuit at 110% of Zone 1 reach limit (security case)
                    </h3>
                    <h3 className='section-title noBorder m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </InfoIcon>
                      Acceptance criterion: Correct time delayed zone 2 trip. Select required Kemp per curve C
                    </h3>


                    <div
                      className="info-item WFull justify-content-start align-items-start col-12"
                    >
                      <InlineMath math={L4} />
                    </div>
                    <div
                      className="info-item WFull justify-content-start align-items-start col-12"
                    >
                      <InlineMath math={L5} />
                    </div>
                    <div
                      className="info-item WFull justify-content-start align-items-start col-12"
                    >
                      <InlineMath math={L6} />
                    </div>
                    <h3 className='section-title noBorder m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </InfoIcon>
                      From curve B:
                    </h3>

                    <div
                      className="info-item WFull justify-content-start align-items-start col-12"
                    >
                      <InlineMath math={L7} />
                    </div>
                    <div
                      className="info-item WFull justify-content-start align-items-start col-12"
                    >
                      <InlineMath math={L8} />
                    </div>
                    <div
                      className="info-item WFull justify-content-start align-items-start col-12"
                    >
                      <InlineMath math={L9} />
                    </div>
                    <div
                      className="info-item WFull justify-content-start align-items-start col-12"
                    >
                      <InlineMath math={L10} />
                    </div>
                    <h3 className='section-title noBorder m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </InfoIcon>
                      Required knee point is the biggest value from 4 cases:
                    </h3>

                    <div
                      className="info-item WFull justify-content-start align-items-start col-12"
                    >
                      <InlineMath math={L11} />
                    </div>



                    {Cal_Acc_ToVA == "IEC-PX" &&
                      <IECPX_Approval Text={"Result for distance function:"} Condition={C11 > Z92} />
                    }


                    {Cal_Acc_ToVA == "IEC-P" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          IEC-P: Requiered ALF [ref:IEC standard]:</h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={alfFormulaZ61} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z93Holder} />
                        </div>

                        <IEXP_Approval Text={"Result for definite time/IDMT earth fault/SEF:"} Condition={Z4 >= Z92} />

                      </Fragment>
                    }




                    {Cal_Acc_ToVA == "IEC-TP" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          IEC-TP: Result for  instantanous non-directional overcurrent
                        </h3>

                        <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                          Requiered K_SSC [ref:IEC standard]:
                        </h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z62Formula} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z94Holder} />
                        </div>

                        <IECTP_Approval Condition={Z6 >= Z94} />
                      </Fragment>
                    }


                  </Fragment>

                }


                {(A2 == "P44x") &&

                  <Fragment>
                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Function information 21:`}</h3>
                    </div>



                    <div className="row col-12">


                      <div className="info-item col-5">
                        <span className="label">{`System nominal voltage Us (kV)`}</span>
                        <span className="value">{B3_2 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{`System maximum fault current at local end of line Ifs (kA)`}</span>
                        <span className="value">{B3_3 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{`System time constant Tsys (s)`}</span>
                        <span className="value">{B3_4 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{'Line resistance R` (ohm/km)'}</span>
                        <span className="value">{B3_5 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{'Line reatance X` (ohm/km)'}</span>
                        <span className="value">{B3_6 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{`Line length (km)`}</span>
                        <span className="value">{B3_7 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{`Z1 set (%)`}</span>
                        <span className="value">{B3_8 || "NAN"}</span>
                      </div>

                    </div>


                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={LMaster} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L12} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L13} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L14} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L15} />
                    </div>



                    {Cal_Acc_ToVA == "IEC-PX" &&
                      <IECPX_Approval Text={"Result for distance function:"} Condition={C11 > Z98} />
                    }


                    {Cal_Acc_ToVA == "IEC-P" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          IEC-P: Requiered ALF [ref:IEC standard]:</h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={alfFormulaZ61} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z99Holder} />
                        </div>

                        <IEXP_Approval Text={"Result for definite time/IDMT earth fault/SEF:"} Condition={Z4 >= Z99} />

                      </Fragment>
                    }



                    {Cal_Acc_ToVA == "IEC-TP" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          IEC-TP: Result for  instantanous non-directional overcurrent
                        </h3>

                        <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                          Requiered K_SSC [ref:IEC standard]:
                        </h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z62Formula} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z100Holder} />
                        </div>

                        <IECTP_Approval Condition={Z6 >= Z100} />
                      </Fragment>
                    }



                  </Fragment>
                }


                {(A2 == "P532") &&

                  <Fragment>

                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Function information 21:`}</h3>
                    </div>




                    <div className="row col-12">


                      <div className="info-item col-5">
                        <span className="label">{`System nominal voltage Us (kV)`}</span>
                        <span className="value">{B3_2 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{`System maximum fault current at local end of line Ifs (kA)`}</span>
                        <span className="value">{B3_3 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{`System time constant Tsys (s)`}</span>
                        <span className="value">{B3_4 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{'Line resistance R` (ohm/km)'}</span>
                        <span className="value">{B3_5 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{'Line reatance X` (ohm/km)'}</span>
                        <span className="value">{B3_6 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{`Line length (km)`}</span>
                        <span className="value">{B3_7 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{`Z1 set (%)`}</span>
                        <span className="value">{B3_8 || "NAN"}</span>
                      </div>

                    </div>




                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Distance protection requierment:`}</h3>
                    </div>


                    <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                      Requiered Knee point voltage of CT at Z1 reach point [ref: Relay manual]:
                    </h3>



                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={LMaster2} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L16} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L17} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L18} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L19} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L20} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L21} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L22} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L23} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L24} />
                    </div>



                    <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                      Requiered Knee point voltage of CT for close up fault [ref: Relay manual]:
                    </h3>



                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L25} />
                    </div>                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L26} />
                    </div>                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L27} />
                    </div>                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L28} />
                    </div>                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L29} />
                    </div>


                    {Cal_Acc_ToVA == "IEC-PX" &&
                      <IECPX_Approval Text={"Result for distance function:"} Condition={C11 > Z113} />
                    }


                    {Cal_Acc_ToVA == "IEC-P" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          IEC-P: Requiered ALF [ref:IEC standard]:</h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={alfFormulaZ61} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z114Holder} />
                        </div>

                        <IEXP_Approval Text={"Result for definite time/IDMT earth fault/SEF:"} Condition={Z4 >= Z114} />

                      </Fragment>
                    }




                    {Cal_Acc_ToVA == "IEC-TP" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          IEC-TP: Result for  instantanous non-directional overcurrent
                        </h3>

                        <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                          Requiered K_SSC [ref:IEC standard]:
                        </h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z62Formula} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z115Holder} />
                        </div>

                        <IECTP_Approval Condition={Z6 >= Z115} />
                      </Fragment>
                    }


                  </Fragment>
                }


                {(A2 == "P532") &&

                  <Fragment>

                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Function information 87L:`}</h3>
                    </div>

                    <div className="row col-12">


                      <div className="info-item col-5">
                        <span className="label">{`Maximum internal short circuit current I-max-int (kA)`}</span>
                        <span className="value">{B4_2 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{`Maximum external short circuit current I-max-ext (kA)`}</span>
                        <span className="value">{B4_3 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{`System time constant Tsys (s)`}</span>
                        <span className="value">{B4_4 || "NAN"}</span>
                      </div>

                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L30} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L31} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L32} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L33} />
                    </div>



                  </Fragment>
                }


                {(A2 == "P541") &&

                  <Fragment>

                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Function information 21:`}</h3>
                    </div>

                    <div className="row col-12">


                      <div className="info-item col-5">
                        <span className="label">{`Maximum internal short circuit current I-max-int (kA)`}</span>
                        <span className="value">{B4_2 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{`Maximum external short circuit current I-max-ext (kA)`}</span>
                        <span className="value">{B4_3 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{`System time constant Tsys (s)`}</span>
                        <span className="value">{B4_4 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{'System X/R ratio at remote end'}</span>
                        <span className="value">{B4_5 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{'second slop setting K2'}</span>
                        <span className="value">{B4_6 || "NAN"}</span>
                      </div>

                    </div>


                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Line differential protection requierment:`}</h3>
                    </div>

                    <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                      Requiered Knee point voltage of CT [ref: Relay manual]:
                    </h3>


                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L34} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L35} />
                    </div>

                    <h3 className='section-title m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon className='pdfIconsSecondry'></InfoIcon>
                      For K2= 150%:</h3>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L36} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L37} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L38} />
                    </div>


                    <h3 className='section-title m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon className='pdfIconsSecondry'></InfoIcon>
                      For K2= 100%:</h3>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L39} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L40} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L41} />
                    </div>

                    <h3 className='section-title m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon className='pdfIconsSecondry'></InfoIcon>
                      Final requiered knee point voltage:</h3>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L42} />
                    </div>




                    {Cal_Acc_ToVA == "IEC-PX" &&
                      <IECPX_Approval Text={"Result for line differential function:"} Condition={C11 > Z126} />
                    }


                    {Cal_Acc_ToVA == "IEC-P" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          IEC-P: Requiered ALF [ref:IEC standard]:</h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={alfFormulaZ61} />
                        </div>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z127Holder} />
                        </div>

                        <IEXP_Approval Text={"Result for line differential function:"} Condition={Z4 >= Z127} />

                      </Fragment>
                    }

                    {Cal_Acc_ToVA == "IEC-TP" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          IEC-TP: Result for line differential function:
                        </h3>

                        <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                          Requiered K_SSC [ref:IEC standard]:
                        </h3>

                        <div className="flex-column d-flex">
                          <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                            <InlineMath math={Z62Formula} />
                          </div>
                          <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                            <InlineMath math={Z128Holder} />
                          </div>
                        </div>

                        <IECTP_Approval Condition={Z6 >= Z128} />
                      </Fragment>
                    }



                  </Fragment>
                }


                {(A2 == "P54x" && A3 == "87L") &&

                  <Fragment>
                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Function information 87L:`}</h3>
                    </div>

                    <div className="row col-12">


                      <div className="info-item col-5">
                        <span className="label">{`Maximum internal short circuit current I-max-int (kA)`}</span>
                        <span className="value">{B4_2 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{`Maximum external short circuit current I-max-ext (kA)`}</span>
                        <span className="value">{B4_3 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{`System time constant Tsys (s)`}</span>
                        <span className="value">{B4_4 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{'System X/R ratio at remote end'}</span>
                        <span className="value">{B4_5 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{'second slop setting K2'}</span>
                        <span className="value">{B4_6 || "NAN"}</span>
                      </div>

                    </div>




                    <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                      Requiered Knee point voltage of CT  [ref: Relay manual]:
                    </h3>


                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L37} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L38} />
                    </div>
                    <h3 className='section-title m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon className='pdfIconsSecondry'></InfoIcon>
                      For K2= 150% with differential CT saturation stabilization disable:</h3>


                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L39} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L40} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L41} />
                    </div>
                    <h3 className='section-title m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon className='pdfIconsSecondry'></InfoIcon>
                      For K2= 100% with differential CT saturation stabilization disable:</h3>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L42} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L43} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L44} />
                    </div>

                    <h3 className='section-title m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon className='pdfIconsSecondry'></InfoIcon>
                      Final requiered knee point voltage with differential CT saturation stabilization disable:</h3>


                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L45} />
                    </div>


                    <h3 className='section-title m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon className='pdfIconsSecondry'></InfoIcon>
                      Requiered knee point voltage with differential CT saturation stabilization disable:</h3>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L49} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L50} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L51} />
                    </div>


                    {Cal_Acc_ToVA == "IEC-PX" &&
                      <Fragment>
                        <IECPX_Approval Text={"Result for line differential function with differential CT saturation stabilization disable:"} Condition={C11 > Z134} />
                        <IECPX_Approval Text={"Result for line differential function with differential CT saturation stabilization enable:"} Condition={C11 > Z136} />
                      </Fragment>
                    }


                    {Cal_Acc_ToVA == "IEC-P" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          Requiered ALF [ref:IEC standard] with differential CT saturation stabilization disable:</h3>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={alfFormulaZ61} />
                        </div>


                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z137Holder} />
                        </div>

                        <IEXP_Approval Text={"Result for line differential function with differential CT saturation stabilization disable:"} Condition={Z4 >= Z137} />

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z138Holder} />
                        </div>

                        <IEXP_Approval Text={"Requiered ALF [ref:IEC standard] with differential CT saturation stabilization enable:"} Condition={Z4 >= Z138} />





                      </Fragment>
                    }

                    {Cal_Acc_ToVA == "IEC-TP" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          IEC-TP: Result for line differential function:
                        </h3>


                        <div className="flex-column d-flex">
                          <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                            <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                            Requiered K_SSC [ref:IEC standard] with differential CT saturation stabilization disable:
                          </h3>
                          <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                            <InlineMath math={Z62Formula} />
                          </div>

                          <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                            <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                            Requiered K_SSC [ref:IEC standard] with differential CT saturation stabilization disable:
                          </h3>

                          <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                            <InlineMath math={Z139Holder} />
                          </div>
                          <IECTP_Approval Condition={Z6 >= Z139} />

                          <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                            <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                            Requiered K_SSC [ref:IEC standard] with differential CT saturation stabilization enable:
                          </h3>
                          <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                            <InlineMath math={Z140Holder} />
                          </div>

                          <IECTP_Approval Condition={Z6 >= Z140} />

                        </div>

                      </Fragment>
                    }

                  </Fragment>

                }


                {(A2 == "P54x" && A3 == "21") &&

                  <Fragment>

                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Function information 21:`}</h3>
                    </div>

                    <div className="row col-12">


                      <div className="info-item col-5">
                        <span className="label">{`System nominal voltage Us (kV)`}</span>
                        <span className="value">{B3_2 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{`System maximum fault current at local end of line Ifs (kA)`}</span>
                        <span className="value">{B3_3 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{`System time constant Tsys (s)`}</span>
                        <span className="value">{B3_4 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{'Line resistance R` (ohm/km)'}</span>
                        <span className="value">{B3_5 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{'Line reatance X` (ohm/km)'}</span>
                        <span className="value">{B3_6 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{'Line length (km)'}</span>
                        <span className="value">{B3_7 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{'Z1 set (%)'}</span>
                        <span className="value">{B3_8 || "NAN"}</span>
                      </div>

                    </div>


                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L52} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L53} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L54} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L55} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L56} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L57} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L58} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L59} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L60} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L61} />
                    </div>

                    <h3 className='section-title m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <SecurityIcon className='pdfIconsSecondry'></SecurityIcon>
                      Requiered Knee point voltage of CT for close up fault [ref: Relay manual]:</h3>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L62} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L63} />
                    </div>


                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L64} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L65} />
                    </div>

                    <h3 className='section-title m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <SecurityIcon className='pdfIconsSecondry'></SecurityIcon>
                      Requiered Knee point voltage of CT time delayed distance zone [ref: Relay manual]:</h3>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L66} />
                    </div>

                    <h3 className='section-title m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon className='pdfIconsSecondry'></InfoIcon>
                      Remote bus fault current:</h3>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L67} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L68} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L69} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L70} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L71} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L72} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L73} />
                    </div>



                    {Cal_Acc_ToVA == "IEC-PX" &&
                      <IECPX_Approval Text={"Result for distance function:"} Condition={C11 > Z160} />
                    }


                    {Cal_Acc_ToVA == "IEC-P" &&
                      <Fragment>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={alfFormulaZ61} />
                        </div>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          IEC-P: Requiered ALF [ref:IEC standard]:</h3>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z161Holder} />
                        </div>

                        <IEXP_Approval Text={"Result for distance function:"} Condition={Z4 >= Z161} />

                      </Fragment>
                    }


                    {Cal_Acc_ToVA == "IEC-TP" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          Result for distance function:
                        </h3>


                        <div className="flex-column d-flex">
                          <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                            <InlineMath math={Z62Formula} />
                          </div>
                          <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                            <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                            Requiered K_SSC [ref:IEC standard]:
                          </h3>
                          <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                            <InlineMath math={Z162Holder} />
                          </div>
                        </div>

                        <IECTP_Approval Condition={Z6 >= Z162} />
                      </Fragment>
                    }




                  </Fragment>

                }



                {(A2 == "P632" || A2 == "P633") &&

                  <Fragment>
                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Function information 87T:`}</h3>
                    </div>

                    <div className="row col-12">


                      <div className="info-item col-5">
                        <span className="label">{`System nominal voltage Us (kV)`}</span>
                        <span className="value">{B5_2 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{`System maximum fault current at local end of line Ifs (kA)`}</span>
                        <span className="value">{B5_3 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{`System time constant Tsys (s)`}</span>
                        <span className="value">{B5_4 || "NAN"}</span>
                      </div>


                    </div>


                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Differential protection requierment:`}</h3>
                    </div>

                    <h3 className='section-title m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <SecurityIcon className='pdfIconsSecondry'></SecurityIcon>
                      Requiered Knee point voltage of CT [ref: Relay manual]:</h3>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L82} />
                    </div>


                    <h3 className='section-title m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon className='pdfIconsSecondry'></InfoIcon>
                      Select required Kd=Kemp per emprical dimesioning factor curve for external fault [ref: Relay manual]</h3>


                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L83} />
                    </div>

                    <h3 className='section-title m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon className='pdfIconsSecondry'></InfoIcon>
                      Base on input data:</h3>


                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L74} />
                    </div>

                    <h3 className='section-title m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon className='pdfIconsSecondry'></InfoIcon>
                      From curve :</h3>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L75} />
                    </div>



                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L76} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L77} />
                    </div>

                    <h3 className='section-title m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon className='pdfIconsSecondry'></InfoIcon>
                      For internal fault Kd=0.25 [ref: Relay manual]</h3>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L79} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L80} />
                    </div>

                    <h3 className='section-title m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <SecurityIcon className='pdfIconsSecondry'></SecurityIcon>
                      Final requiered knee point voltage is maximum value of calculated voltage:</h3>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L81} />
                    </div>





                    {Cal_Acc_ToVA == "IEC-PX" &&
                      <IECPX_Approval Text={"Result for Transformer differential function:"} Condition={C11 > Z169} />
                    }


                    {Cal_Acc_ToVA == "IEC-P" &&
                      <Fragment>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={alfFormulaZ61} />
                        </div>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                          IEC-P: Requiered ALF [ref:IEC standard]:</h3>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z170Holder} />
                        </div>

                        <IEXP_Approval Text={"Result for Transformer differential function:"} Condition={Z4 >= Z170} />

                      </Fragment>
                    }



                    {Cal_Acc_ToVA == "IEC-TP" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          Result for Transformer differential function:
                        </h3>


                        <div className="flex-column d-flex">
                          <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                            <InlineMath math={Z62Formula} />
                          </div>
                          <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                            <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                            Requiered K_SSC [ref:IEC standard]:
                          </h3>
                          <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                            <InlineMath math={Z171Holder} />
                          </div>
                        </div>

                        <IECTP_Approval Condition={Z6 >= Z171} />
                      </Fragment>
                    }


                  </Fragment>
                }



                {Cal_Acc_ToVA == "IEC-TP" &&


                  <Fragment>

                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Function information 87T:`}</h3>
                    </div>

                    <div className="row col-12">


                      <div className="info-item col-5">
                        <span className="label">{`Maximum internal short circuit current I-max-int (kA)`}</span>
                        <span className="value">{B5_2 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{`Maximum external short circuit current I-max-ext (kA)`}</span>
                        <span className="value">{B5_3 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{`System time constant Tsys (s)`}</span>
                        <span className="value">{B5_4 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{`Secondary system CT connected knee voltage Vk2 (V)`}</span>
                        <span className="value">{B5_5 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{`Secondary system CT connected burden R2 (ohm)`}</span>
                        <span className="value">{B5_6 || "NAN"}</span>
                      </div>

                      {
                        B5_9 === 3 &&
                        <Fragment>
                          <div className="info-item col-5">
                            <span className="label">{`Tertiary system CT connected knee voltage Vk3 (V)`}</span>
                            <span className="value">{B5_7 || "NAN"}</span>
                          </div>

                          <div className="info-item col-5">
                            <span className="label">{`Tertiary system CT connected burden R3 (ohm)`}</span>
                            <span className="value">{B5_8 || "NAN"}</span>
                          </div>
                        </Fragment>
                      }

                      <div className="info-item col-5">
                        <span className="label">{`Number of CT nCT`}</span>
                        <span className="value">{B5_9 || "NAN"}</span>
                      </div>


                    </div>


                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Differential protection requierment:`}</h3>
                    </div>


                    <h3 className='section-title m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon className='pdfIconsSecondry'></InfoIcon>
                      Stability check:</h3>
                    <h3 className='section-title m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon className='pdfIconsSecondry'></InfoIcon>
                      To ensure that through fault stability is achieved the following ratios:</h3>
                    <h3 className='section-title m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <InfoIcon className='pdfIconsSecondry'></InfoIcon>
                      should not exceed a maximum disparity of 4:1 [ref: Relay manual].</h3>




                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L84} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L85} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L86} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L87} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L88} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L89} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L90} />
                    </div>

                    <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                      Stability result:</h3>

                    <div className="col-12 center p-3 position-relative">


                      {Z175 < Z4
                        ?
                        <Fragment>

                          <h4 className='Approval'>{`Vi/Ri ratio <= 4, Condition OK`}</h4>
                          <div className='AddTaskIconParent position-absolute'><AddTaskIcon className='AddTaskIcon'></AddTaskIcon></div>

                        </Fragment>
                        :
                        <Fragment>
                          <h4 className='Denaial'>{`Vi/Ri ratio > 4, Condition Not OK`}</h4>
                          <div className='AddTaskIconParentBad position-absolute'><CancelIcon className='AddTaskIcon'></CancelIcon></div>

                        </Fragment>
                      }

                    </div>


                    <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                      Requiered Knee point voltage of CT [ref: Relay manual]:
                    </h3>


                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L91} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L92} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L93} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L94} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L95} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L96} />
                    </div>


                    {Cal_Acc_ToVA == "IEC-PX" &&
                      <IECPX_Approval Text={"Result for Transformer differential function:"} Condition={C11 > Z178} />
                    }

                    {Cal_Acc_ToVA == "IEC-P" &&
                      <Fragment>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={alfFormulaZ61} />
                        </div>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                          IEC-P: Requiered ALF [ref:IEC standard]:</h3>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z179Holder} />
                        </div>

                        <IEXP_Approval Text={"Result for Transformer differential function:"} Condition={Z4 >= Z179} />

                      </Fragment>
                    }

                    {Cal_Acc_ToVA == "IEC-TP" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          Result for Transformer differential function:
                        </h3>


                        <div className="flex-column d-flex">
                          <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                            <InlineMath math={Z62Formula} />
                          </div>
                          <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                            <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                            Requiered K_SSC [ref:IEC standard]:
                          </h3>
                          <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                            <InlineMath math={Z180Holder} />
                          </div>
                        </div>

                        <IECTP_Approval Condition={Z6 >= Z180} />
                      </Fragment>
                    }

                  </Fragment>
                }

                {(A2 == "P74X") &&

                  <Fragment>



                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Function information 87BB:`}</h3>
                    </div>

                    <div className="flex row">
                      <div className="info-item col-5">
                        <span className="label">{`Maximum internal short circuit current I-max-int (kA)`}</span>
                        <span className="value">{B6_2 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{`Maximum external short circuit current I-max-ext (kA)`}</span>
                        <span className="value">{B6_2 || "NAN"}</span>
                      </div>

                      <div className='mt-4 col-12 center justify-content-start row'>
                        <h3 className="section-title section_title_Sub">{`Busbar protection requierment:`}</h3>
                      </div>
                    </div>



                    <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                      Requiered Knee point voltage of CT for internal fault [ref: Relay manual]:
                    </h3>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={F1_latex} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L97} />
                    </div>
                    <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                      Requiered Knee point voltage of CT for external fault [ref: Relay manual]:
                    </h3>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={F2_latex} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L98} />
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L99} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L100} />
                    </div>

                    <h3 className='section-title m-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                      <SecurityIcon className='pdfIconsSecondry'></SecurityIcon>
                      Final requiered knee point voltage is:</h3>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L101} />
                    </div>


                  </Fragment>
                }


                {(A2 == "P821") &&

                  <Fragment>
                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`Function information 50/51+N:`}</h3>
                    </div>

                    <div className="flex row">
                      <div className="info-item col-5">
                        <span className="label">{`System maximum fault current,Iphmax (kA)`}</span>
                        <span className="value">{B1_6 || "NAN"}</span>
                      </div>

                      <div className="info-item col-5">
                        <span className="label">{`System maximum earth fault current,Iemax (kA)`}</span>
                        <span className="value">{B1_7 || "NAN"}</span>
                      </div>

                    </div>


                    <div className='mt-4 col-12 center justify-content-start row'>
                      <h3 className="section-title section_title_Sub">{`overcurrent/earth fault requierment:`}</h3>
                    </div>

                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L102} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L103} />
                    </div>
                    <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                      <InlineMath math={L104} />
                    </div>


                    {Cal_Acc_ToVA == "IEC-PX" &&
                      <IECPX_Approval Text={"Result for Transformer differential function:"} Condition={C11 > Z186} />
                    }

                    {Cal_Acc_ToVA == "IEC-P" &&
                      <Fragment>

                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={alfFormulaZ61} />
                        </div>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                          IEC-P: Requiered ALF [ref:IEC standard]:</h3>
                        <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                          <InlineMath math={Z189Holder} />
                        </div>

                        <IEXP_Approval Text={"Result for Transformer differential function:"} Condition={Z4 >= Z190} />

                      </Fragment>
                    }

                    {Cal_Acc_ToVA == "IEC-TP" &&
                      <Fragment>
                        <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                          <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                          Result for Transformer differential function:
                        </h3>


                        <div className="flex-column d-flex">
                          <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                            <InlineMath math={Z62Formula} />
                          </div>
                          <h3 className='section-title' style={{ color: "#1976d2", fontWeight: "1000" }}>
                            <SecurityIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </SecurityIcon>
                            Requiered K_SSC [ref:IEC standard]:
                          </h3>
                          <div className="info-item WFull justify-content-start align-items-start" style={{ fontSize: '24px' }}>
                            <InlineMath math={Z190Holder} />
                          </div>
                        </div>

                        <IECTP_Approval Condition={Z6 >= Z180} />
                      </Fragment>
                    }


                  </Fragment>
                }

              </div>


            </div>




            {/* Button to manually export PDF */}
          </div >

        </div>
        <div className="d-flex align-items-center flex-wrap">
          <button onClick={this.exportToPDF} className="pdf-button">
            Export to PDF
          </button>
          <ExcelComponent data={selectedData} />
        </div>
      </Fragment >
    )
  }
}

const mapStateToProps = (state) => ({
  data: state.example.Project

})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(PdfComponent)
