import React, { Component } from 'react';
import { connect } from 'react-redux';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

export class ReportHeader extends Component {
    // Custom styled table components
    StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${TableCell.head}`]: {
            backgroundColor: theme.palette.grey[200],
            color: theme.palette.common.black,
            fontWeight: 'bold',
        },
        [`&.${TableCell.body}`]: {
            fontSize: 14,
        },
    }));

    StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    // Format date to YYYY-MM-DD HH:MM:SS
    getFormattedDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    render() {
        const {
            CurrentWorkSpace = {},
        } = this.props;

        const {
            Project = 'N/A',
            DocumentNumber = 'N/A',
            imgUrlClient = '',
            imgUrlConsultant = '',
            imgUrlContractor = '',
            Revision = 'N/A',
            clientName = 'N/A',
            consultantName = 'N/A',
            contractorName = 'N/A',
            RemarkA = '',
            rows = []
        } = CurrentWorkSpace;

        return (
            <div className="header-container" style={{ width: "210mm", margin: "0" }}>
                <div className="title-section col-6">
                    <h1 className="main-title">Power Calculation Suite</h1>
                    <p className="subtitle">Precision Engineering for Power Systems</p>
                </div>

                <div className="info-section justify-content-start d-flex flex-column align-items-start col-5">
                    <p className="date-info">
                        <span className="label2">Date generated:</span>
                        <span className="value2">{this.getFormattedDate()}</span>
                    </p>
                    <p className="project-info">
                        <span className="label2">Project:</span>
                        <span className="value2">{Project}</span>
                    </p>
                    <p className="project-info">
                        <span className="label2">Document Number:</span>
                        <span className="value2">{DocumentNumber}</span>
                    </p>
                    <p className="project-info">
                        <span className="label2">Revision:</span>
                        <span className="value2">{Revision}</span>
                    </p>
                </div>

                <div className="pdfH-container position-relative">
                    <header className="pdf-header boredr-none">
                        <div className="ClientDataCont">
                            <div>
                                <p className="report-title">Client:</p>
                                {imgUrlClient ? (
                                    <img src={imgUrlClient} alt="Client Logo" className="company-logo" />
                                ) : (
                                    <span className="value">N/A</span>
                                )}
                            </div>
                            <div className="details">
                                <div className="info-item">
                                    <span className="label">Company Name:</span>
                                    <span className="value">{clientName}</span>
                                </div>
                            </div>
                        </div>

                        <div className="ClientDataCont">
                            <div>
                                <p className="report-title">Consultant:</p>
                                {imgUrlConsultant ? (
                                    <img src={imgUrlConsultant} alt="Consultant Logo" className="company-logo" />
                                ) : (
                                    <span className="value">N/A</span>
                                )}
                            </div>
                            <div className="details">
                                <div className="info-item">
                                    <span className="label">Company Name:</span>
                                    <span className="value">{consultantName}</span>
                                </div>
                            </div>
                        </div>

                        <div className="ClientDataCont">
                            <div>
                                <p className="report-title">Contractor:</p>
                                {imgUrlContractor ? (
                                    <img src={imgUrlContractor} alt="Contractor Logo" className="company-logo" />
                                ) : (
                                    <span className="value">N/A</span>
                                )}
                            </div>
                            <div className="details">
                                <div className="info-item">
                                    <span className="label">Company Name:</span>
                                    <span className="value">{contractorName}</span>
                                </div>
                            </div>
                        </div>
                    </header>
                </div>

                {/* Integrated PDF Content Section */}
                <div className="pdf-content">
                    {/* Remarks */}
                    <section className="section center justify-content-around row">
                        <div className="info-item col-12 center Remarks justify-content-start align-items-start flex-column">
                            <h3 className="section-title section_title_Sub2">Remarks:</h3>
                            <p className="valueSpecial">
                                {RemarkA && RemarkA.trim() !== "" ? RemarkA : "No remark"}
                            </p>
                        </div>
                    </section>

                    {/* Table Section */}
                    <section className="section center">
                        <TableContainer component={Paper}>
                            <Table sx={{ maxWidth: 900, size: 'small' }} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <this.StyledTableCell align="right">Rev.</this.StyledTableCell>
                                        <this.StyledTableCell align="right">yy/mm/dd</this.StyledTableCell>
                                        <this.StyledTableCell align="right">Prepared</this.StyledTableCell>
                                        <this.StyledTableCell align="right">Checked</this.StyledTableCell>
                                        <this.StyledTableCell align="right">Authorized</this.StyledTableCell>
                                        <this.StyledTableCell align="right">Approved</this.StyledTableCell>
                                        <this.StyledTableCell align="right">Issued for</this.StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Array.isArray(rows) && rows.map((row, index) => (
                                        <this.StyledTableRow key={index}>
                                            <this.StyledTableCell align="right">{row.rev}</this.StyledTableCell>
                                            <this.StyledTableCell align="right">{row.date}</this.StyledTableCell>
                                            <this.StyledTableCell align="right">{row.prepared}</this.StyledTableCell>
                                            <this.StyledTableCell align="right">{row.checked}</this.StyledTableCell>
                                            <this.StyledTableCell align="right">{row.authorized}</this.StyledTableCell>
                                            <this.StyledTableCell align="right">{row.approved}</this.StyledTableCell>
                                            <this.StyledTableCell align="right">{row.issuedFor}</this.StyledTableCell>
                                        </this.StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </section>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    CurrentWorkSpace: state.example.CurrentWorkSpace,
    SelectedWorkSpacePath: state.example.SelectedWorkSpacePath,
    workSpaceVitals: state.example.workSpaceVitals
});

export default connect(mapStateToProps)(ReportHeader);
