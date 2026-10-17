import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { Button } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PictureAsPdfSharpIcon from '@mui/icons-material/PictureAsPdfSharp';
import DescriptionIcon from '@mui/icons-material/Description';

// ─── PDF Modules ──────────────────────────────────────────────────────
import PdfComponent from './PdfComponent.jsx';
import PdfComponentMeterCT from './PdfComponentMeterCT.jsx';
import PdfComponentVT from './PdfComponentVT.jsx';
import ReportHeader from './ReportHeader.jsx';
import FooterForPDF from './FooterForPDF.jsx';

// FinilizeWorkSpace.jsx
// Replace the services import section with these direct imports:

// ─── Excel Service ──────────────────────────────────────────────────
import { 
    collectExcelData, 
    assembleMasterExcel, 
    downloadExcelFile 
} from './services/excelService';

// ─── PDF Service ──────────────────────────────────────────────────
import { generatePDF } from './services/pdfService';

// ─── Validators (if needed) ──────────────────────────────────────
// import { validateAllFiles } from './services/validators';

export class FinilizeWorkSpace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // PDF State
            projectData: [],
            meterCTData: [],
            vtData: [],
            isGeneratingPDF: false,
            pdfProgress: 0,
            
            // Excel State
            isGeneratingExcel: false,
            excelProgress: 0,
            
            // Status
            lastPDFGenerated: null,
            lastExcelGenerated: null,
            error: null
        };
        this.pdfRef = createRef();
    }

    // ─── COMPONENT LIFECYCLE ──────────────────────────────────────────
    componentDidMount() {
        console.log('FinilizeWorkSpace mounted');
    }

    componentWillUnmount() {
        // Cleanup if needed
    }

    // ─── PDF GENERATION ──────────────────────────────────────────────
    preparePDFData = () => {
        console.log('Preparing PDF data');
        const { AllFileData } = this.props;
        const projectData = [];
        const meterCTData = [];
        const vtData = [];

        if (!Array.isArray(AllFileData) || AllFileData.length === 0) {
            this.props.openPopUp(
                "Export Error",
                "No data available to generate PDF. Please ensure a project is loaded.",
                "dialog",
                "OK",
                () => this.props.closePopUp(),
                true
            );
            return null;
        }

        AllFileData.forEach((itemStr, index) => {
            try {
                const item = JSON.parse(itemStr);
                if (item.Project && item.ProjectData) {
                    projectData.push(item);
                } else if (item.activeStepMETERCT && item.MeteringDevice) {
                    meterCTData.push(item);
                } else if (item.activeStepVT && item.L) {
                    vtData.push(item);
                }
            } catch (error) {
                console.error(`Error parsing item ${index}:`, error);
            }
        });

        if (!projectData.length && !meterCTData.length && !vtData.length) {
            this.props.openPopUp(
                "Export Error",
                "No valid data found to generate PDF. Please check the project files.",
                "dialog",
                "OK",
                () => this.props.closePopUp(),
                true
            );
            return null;
        }

        return { projectData, meterCTData, vtData };
    };

    handleGeneratePDF = () => {
        const preparedData = this.preparePDFData();
        if (!preparedData) return;
        
        this.setState({
            projectData: preparedData.projectData,
            meterCTData: preparedData.meterCTData,
            vtData: preparedData.vtData,
            isGeneratingPDF: true,
            pdfProgress: 10
        }, () => {
            setTimeout(() => {
                this.exportToPDF();
            }, 300);
        });
    };

    exportToPDF = async () => {
        console.log('Starting PDF export');
        
        try {
            const result = await generatePDF({
                pdfRef: this.pdfRef,
                onProgress: (progress) => {
                    this.setState({ pdfProgress: progress });
                },
                onPageUpdate: (pageNumber) => {
                    console.log(`Generating page ${pageNumber}`);
                }
            });

            this.setState({ 
                isGeneratingPDF: false, 
                pdfProgress: 100,
                lastPDFGenerated: new Date()
            });

            this.props.openPopUp(
                "Export Complete",
                `PDF with ${result.pageCount} page(s) has been successfully generated.`,
                "dialog",
                "OK",
                () => this.props.closePopUp(),
                true
            );

        } catch (error) {
            console.error('Error generating PDF:', error);
            this.setState({ 
                isGeneratingPDF: false,
                error: error.message
            });
            this.props.openPopUp(
                "Export Error",
                `An error occurred while generating the PDF: ${error.message}`,
                "dialog",
                "OK",
                () => this.props.closePopUp(),
                true
            );
        }
    };

    // ─── EXCEL GENERATION ─────────────────────────────────────────────
   handleGenerateMasterExcel = async () => {
    const { AllFileData } = this.props;
    
    console.log('========== EXCEL GENERATION ==========');
    console.log('AllFileData length:', AllFileData?.length);
    
    // Parse all file data - just parse, no filtering
    const readySet = AllFileData.map(item => {
        try {
            const parsed = JSON.parse(item);
            console.log('Parsed file:', parsed.fileName, 'Type:', 
                parsed.ProjectData ? 'IRCT' : 
                parsed.MeteringDevice ? 'IRM' : 
                parsed.L ? 'IRVT' : 'UNKNOWN'
            );
            return parsed;
        } catch (e) {
            console.error('Error parsing:', e);
            return null;
        }
    }).filter(item => item !== null);
    
    console.log('Total files parsed:', readySet.length);
    
    if (readySet.length === 0) {
        this.props.openPopUp(
            "Export Error",
            "No data available to generate Excel. Please ensure files are loaded.",
            "dialog",
            "OK",
            () => this.props.closePopUp(),
            true
        );
        return;
    }

    this.setState({ isGeneratingExcel: true, excelProgress: 10 });

    try {
        const collectedData = collectExcelData(readySet);
        console.log('Collected Excel data:', collectedData);
        
        this.setState({ excelProgress: 50 });

        const systemInfo = {
            Project: this.props.ProjectData?.FirstPage?.Project || '',
            RefrenceNo: this.props.ProjectData?.FirstPage?.RefrenceNo || '',
            Revision: this.props.ProjectData?.FirstPage?.Revision || '',
            RemarkA: this.props.ProjectData?.FirstPage?.RemarkA || '',
            RemarkG: this.props.ProjectData?.FirstPage?.RemarkG || '',
            Date: this.props.ProjectData?.FirstPage?.Date || '',
            NominalVoltage: this.props.SystemInfo?.NominalVoltage || 0,
            SystemFrequency: this.props.SystemInfo?.SystemFrequency || 0,
            RatedSCcurrent: this.props.SystemInfo?.RatedSCcurrent || 0,
            ConductorTemprature: this.props.SystemInfo?.ConductorTemprature || 25,
            Mode: this.props.SystemInfo?.Mode || '',
            DoucumentTitle: this.props.SystemInfo?.DoucumentTitle || '',
            DocumentNumber: this.props.ProjectData?.FirstPage?.DocumentNumber || '',
            clientName: this.props.ProjectData?.FirstPage?.clientName || '',
            consultantName: this.props.ProjectData?.FirstPage?.consultantName || '',
            contractorName: this.props.ProjectData?.FirstPage?.contractorName || ''
        };

        const assembledExcel = assembleMasterExcel(collectedData, systemInfo);
        console.log('Total files in Excel:', assembledExcel.totalFiles);
        
        this.setState({ excelProgress: 80 });

        const downloaded = await downloadExcelFile(assembledExcel);

        if (downloaded) {
            this.setState({ 
                isGeneratingExcel: false, 
                excelProgress: 100,
                lastExcelGenerated: new Date()
            });
            this.props.openPopUp(
                "Export Complete",
                `Excel with ${assembledExcel.totalFiles} file(s) has been successfully generated.`,
                "dialog",
                "OK",
                () => this.props.closePopUp(),
                true
            );
        } else {
            this.setState({ isGeneratingExcel: false });
            this.props.openPopUp(
                "Export Cancelled",
                "Excel generation was cancelled.",
                "dialog",
                "OK",
                () => this.props.closePopUp(),
                true
            );
        }

    } catch (error) {
        console.error('Error generating master Excel:', error);
        this.setState({ isGeneratingExcel: false });
        this.props.openPopUp(
            "Export Error",
            `Failed to generate Excel: ${error.message}`,
            "dialog",
            "OK",
            () => this.props.closePopUp(),
            true
        );
    }
};

    // ─── RENDER ─────────────────────────────────────────────────────────
    render() {
        const { 
            projectData, 
            meterCTData, 
            vtData, 
            isGeneratingPDF,
            pdfProgress,
            isGeneratingExcel, 
            excelProgress 
        } = this.state;

        return (
            <>
                <div className='d-flex flex-row align-items-center gap-3'>
                    {/* ─── PDF Button ────────────────────────────────── */}
                    <div className='d-flex flex-column mb-4'>
                        <Button
                            variant="contained"
                            className="win11-nav-button"
                            onClick={this.handleGeneratePDF}
                            disabled={isGeneratingPDF}
                            sx={{
                                background: isGeneratingPDF ? '#666' : '#1976d2',
                                color: 'white',
                                '&:hover': {
                                    background: isGeneratingPDF ? '#666' : '#1565c0'
                                }
                            }}
                        >
                            <PictureAsPdfSharpIcon className="win11-nav-icon" />
                            {isGeneratingPDF && (
                                <span style={{ marginLeft: '8px', fontSize: '12px' }}>
                                    {Math.round(pdfProgress)}%
                                </span>
                            )}
                        </Button>
                        <span className="win11-nav-text">
                            {isGeneratingPDF ? `Generating PDF... ${Math.round(pdfProgress)}%` : 'Full PDF Report'}
                        </span>
                    </div>

                    {/* ─── Excel Button ──────────────────────────────── */}
                    <div className='d-flex flex-column mb-4'>
                        <Button
                            variant="contained"
                            className="win11-nav-button"
                            onClick={this.handleGenerateMasterExcel}
                            disabled={isGeneratingExcel}
                            sx={{
                                background: isGeneratingExcel ? '#666' : 'linear-gradient(45deg, #2196F3, #1976D2)',
                                color: 'white',
                                '&:hover': {
                                    background: isGeneratingExcel ? '#666' : 'linear-gradient(45deg, #1976D2, #0D47A1)'
                                }
                            }}
                        >
                            <DescriptionIcon className="win11-nav-icon" />
                            {isGeneratingExcel && (
                                <span style={{ marginLeft: '8px', fontSize: '12px' }}>
                                    {Math.round(excelProgress)}%
                                </span>
                            )}
                        </Button>
                        <span className="win11-nav-text">
                            {isGeneratingExcel ? `Generating Excel... ${Math.round(excelProgress)}%` : 'Master Excel Report'}
                        </span>
                    </div>
                </div>

                {/* ─── Hidden PDF Content ────────────────────────────── */}
                <div style={{ position: 'fixed', top: -9999, left: -9999, width: '210mm', height: 'auto' }}>
                    <div ref={this.pdfRef} style={{ backgroundColor: '#fff4f4', padding: '0px' }}>
                        <ReportHeader />
                        {projectData.map((d, i) => (
                            <div key={`p-${i}`} style={{ margin: '20px 0' }}>
                                <PdfComponent OutPort data_OP={d.ProjectData} />
                            </div>
                        ))}
                        {meterCTData.map((d, i) => (
                            <div key={`m-${i}`} style={{ margin: '20px 0' }}>
                                <PdfComponentMeterCT OutPort MeterCTInfo_OP={d} />
                            </div>
                        ))}
                        {vtData.map((d, i) => (
                            <div key={`v-${i}`} style={{ margin: '20px 0' }}>
                                <PdfComponentVT OutPort VT_OP={d} />
                            </div>
                        ))}
                        <FooterForPDF />
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    AllFileData: state.example.AllFileData,
    ProjectData: state.example.Project,
    SystemInfo: state.example.SystemInfo
});

const mapDispatchToProps = (dispatch) => ({
    openPopUp: (t, m, mo, a, cb) => 
        dispatch({ type: 'OPEN_POPUP', Title: t, Message: m, mode: mo, ActionMessage: a, action: cb }),
    closePopUp: () => dispatch({ type: 'CLOSE_POPUP' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FinilizeWorkSpace);