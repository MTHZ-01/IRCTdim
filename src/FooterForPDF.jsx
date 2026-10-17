import React, { Component } from 'react'
import { connect } from 'react-redux'

export class FooterForPDF extends Component {
    render() {
        return (
            <footer style={{ width: "210mm" }} className="app-footer">
                <div className="footer-wrapper">
                    <section className="footer-block legal-notice">
                        <h3 className="footer-heading">Legal Declaration</h3>
                        <p className="footer-description">
                            All intellectual property rights in this application, including its code, design, and accompanying documentation, are reserved exclusively under prevailing legal statutes. No part of this software may be copied, reproduced, transmitted, or altered without prior written consent from the rights holder. Unauthorized use, including but not limited to duplication, dissemination, or modification, constitutes a breach of law and may result in stringent enforcement measures.
                        </p>
                    </section>

                    <section className="footer-block usage-terms">
                        <h3 className="footer-heading">Conditions of Utilization</h3>
                        <p className="footer-description">
                            This application is provided under a restricted license for authorized individuals only. Access is granted solely for the purpose of its intended functionality. Any attempt to decompile, reverse-engineer, or exploit this software beyond its designated scope is expressly forbidden. Violations of these terms may lead to immediate termination of access privileges and pursuit of legal remedies to the fullest extent permitted by applicable jurisdictions.
                        </p>
                    </section>

                    <section className="footer-block privacy-policy">
                        <h3 className="footer-heading">Data Integrity & Confidentiality</h3>
                        <p className="footer-description">
                            This application upholds the highest standards of privacy and data protection. No personal or operational data is collected, stored, or transmitted beyond what is strictly necessary for its performance. Users are assured that their interactions remain confidential, safeguarded by robust protocols designed to prevent unauthorized access or disclosure. Compliance with all relevant regulatory frameworks is diligently maintained to ensure trust and security.
                        </p>
                    </section>

                    <section className="footer-block disclaimer">
                        <h3 className="footer-heading">Operational Disclaimer</h3>
                        <p className="footer-description">
                            This software is offered as a tool for designated purposes, with no warranties, express or implied, regarding its suitability for any particular task beyond its outlined capabilities. The creators disclaim liability for any incidental, consequential, or indirect damages arising from its use, including loss of data, functionality interruptions, or third-party interactions. Users assume full responsibility for ensuring compatibility with their systems and adherence to these terms.
                        </p>
                    </section>
                </div>


                <div className="footer-closure">
                    <p className="footer-signature">© 2025 | All Rights Exclusively Reserved</p>
                </div>
            </footer>

        )
    }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(FooterForPDF)