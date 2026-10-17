import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { Button } from '@mui/material'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { AURL } from "./App.jsx"
import { TextField } from '@mui/material';
import { Fragment } from 'react';
import PdfComponentMeterCT from './PdfComponentMeterCT.jsx';

export class Validation_METERCT extends Component {
    state = {
        ShouldShowForm: false,
    }

    GetRelayData = () => {
        fetch(AURL + `relayHierarchy`)
            .then(r => r.json())
            .then(d => {
                this.setState({ wholeData: d });
                const manufactureNames = [...new Set(d.relays.map(relay => relay.manufacture))];
                this.setState({ ManufactureList: manufactureNames });
            })
            .catch(error => {
                console.error('Error fetching relay data:', error);
            });
    };


    handleNewIRM = async () => {
        const { pathForCurrentlyOpenMeterCT, MeterCTInfo, openPopUp } = this.props;
        ("The pathForCurrentlyOpenMeterCT Value:", pathForCurrentlyOpenMeterCT)
        if (pathForCurrentlyOpenMeterCT && pathForCurrentlyOpenMeterCT.trim() !== '') {
            try {
                const dataToSave = MeterCTInfo;
                const serializedData = JSON.stringify(dataToSave);
                await window.electron.fs.writeFile(pathForCurrentlyOpenMeterCT, serializedData);
                openPopUp(
                    "Save Successful",
                    `File saved successfully at ${pathForCurrentlyOpenMeterCT}`,
                    "dialog",
                    "OK",
                    () => { }
                );
            } catch (error) {
                openPopUp(
                    "Save Failed",
                    `Failed to save file at ${pathForCurrentlyOpenMeterCT}: ${error.message}`,
                    "dialog",
                    "OK",
                    () => { }
                );
            }
        } else {
            openPopUp(
                "Add New CT",
                "Enter the name for the new CT (without extension):",
                "input",
                "Create",
                (name) => {
                    if (name) {
                        const options = {
                            defaultPath: `${name}.IRM`,
                            filters: [
                                { name: 'IRM Files', extensions: ['IRM'] },
                            ],
                        };
                        window.electron.dialog.showSaveDialog(options).then((result) => {
                            if (!result.canceled && result.filePath) {
                                const dataToSave = MeterCTInfo;
                                const serializedData = JSON.stringify(dataToSave);
                                window.electron.fs.writeFile(result.filePath, serializedData).then(() => {
                                    openPopUp(
                                        "Save Successful",
                                        `File ${name}.IRM saved successfully at ${result.filePath}`,
                                        "dialog",
                                        "OK",
                                        () => { }
                                    );
                                }).catch((error) => {
                                    openPopUp(
                                        "Save Failed",
                                        `Failed to save file ${name}.IRM: ${error.message}`,
                                        "dialog",
                                        "OK",
                                        () => { }
                                    );
                                });
                            }
                        });
                    }
                }
            );
        }
    };



    createNewIRM = async (name) => {
        const options = {
            defaultPath: `${name}.IRM`,
            filters: [
                { name: 'IRM Files', extensions: ['IRM'] },
            ],
        };
        try {
            const result = await window.electron.dialog.showSaveDialog(options);
            if (!result.canceled && result.filePath) {
                const dataToSave = this.props.MeterCTInfo;
                const serializedData = JSON.stringify(dataToSave);
                await window.electron.fs.writeFile(result.filePath, serializedData);
                this.props.openPopUp(
                    "Save Successful",
                    `File ${name}.IRM saved successfully at ${result.filePath}`,
                    "dialog",
                    "OK",
                    () => { }
                );
            }
        } catch (error) {
            this.props.openPopUp(
                "Save Failed",
                `Failed to save file ${name}.IRM: ${error.message}`,
                "dialog",
                "OK",
                () => { }
            );
        }
    };

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);
        if (this.props.activeStep === 4) {
            setTimeout(() => {
                this.setState({ ShouldShowForm: true });
            }, 100);
        }
    }

    Next = () => {
        // this.props.GlobalizeSecondPage(this.state)
        this.props.activeStepUpdate(this.props.activeStep + 1)
    }

    Back = () => {
        // this.props.GlobalizeSecondPage(this.state)
        this.props.activeStepUpdate(this.props.activeStep - 1)
    }

    GetToInitializeProject = () => {
        this.props.GlobalizeSecondPage(this.state)
        this.props.toggleMenu()
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
    }

    handleKeyPress = (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            this.Back();
        } else if (event.key === 'Enter') {
            // this.Next()
        }
    };

    handleMenuClose = () => {
        // Assuming this method exists elsewhere to close a menu
    };

    render() {
        const A3 = this.state.ProtectionFunction

        return (
            <CSSTransition timeout={600} classNames="slide" in={this.state.ShouldShowForm} unmountOnExit>
                <div className='col-12 center FullScreenFix flex-column justify-content-start'>
                    <div className='d-flex W90-p justify-content-between flex-column RelayConfCont'>
                        <h1 className='col-12 headingsForInitProject'>Validation</h1>

                        <div className='pdCfixMC'>
                            <div className='d-flex justify-content-start align-items-center flex-column col-12 '>
                                <PdfComponentMeterCT OutPort={false}></PdfComponentMeterCT>
                            </div>
                        </div>
                        <div className='w-100'>
                            <div className='d-flex justify-content-between align-items-between flex-row col-12'>
                                <Button className='NXT_Btn' onClick={this.Back}>Back</Button>
                                <Button className='NXT_Btn' onClick={this.handleNewIRM}>Save</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CSSTransition>
        )
    }
}

const mapStateToProps = (state) => ({
    isMenuOpen: state.example.isMenuOpen,
    activeStep: state.example.MeterCTInfo.activeStepMETERCT,
    MeteringDevice: state.example.MeteringDevice,
    MeterCTInfo: state.example.MeterCTInfo, // Added to access full data for saving
    initializationFullScreen: state.example.initializationFullScreen,
    pathForCurrentlyOpenMeterCT: state.example.pathForCurrentlyOpenMeterCT,

});

const mapDispatchToProps = (dispatch) => ({
    toggleMenu: () => dispatch({ type: 'TOGGLE_MENU' }),
    activeStepUpdate: (value) => dispatch({ type: 'UPDATE_PROGRESSBAR_METER_CT', value: value }),
    GlobalizeSecondPage: (data) => dispatch({ type: 'UPDATE_METERCT_PAGE', data: data }),
    openPopUp: (title, Message, mode, ActionMessage, action) => dispatch({ type: "OPEN_POPUP", Title: title, Message: Message, mode: mode, ActionMessage: ActionMessage, action: action }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Validation_METERCT)