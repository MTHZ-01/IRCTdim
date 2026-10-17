import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { Button, TextField, FormControl, MenuItem, Select } from '@mui/material';
import { AURL } from './App.jsx';

export class VTDevice extends Component {
    state = {
        ShouldShowForm: false,
        VTClassList: ["0.1", "0.2", "0.5", "1", "3", "3P", "6P", "0.2 + 3P", "0.5 + 3P"],
        ValidVoltageDropList: [0.1, 0.2, 0.5, 2.5],
        L1: {
            VTName: "",
            Standard: "IEC",
            SelectedVTClass: "",
            VTPrimary: 0,
            VTSecondary: 0,
            RatedPower: 0,
            SelectedValidVoltageDrop: 0,
        },
        L2: {
            L0: "Unused",
            VTName: "",
            Standard: "IEC",
            SelectedVTClass: "",
            VTPrimary: 0,
            VTSecondary: 0,
            RatedPower: 0,
            SelectedValidVoltageDrop: 0,
        }
    };

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);

        if (this.props.activeStep === 0) {
            this.setState({
                L1: this.props.L?.L1 || this.state.L1,
                L2: this.props.L?.L2 || this.state.L2,
            });
            setTimeout(() => {
                this.setState({ ShouldShowForm: true });
            }, 100);
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
    }

    handleKeyPress = (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            this.Back();
        } else if (event.key === 'Enter') {
            this.Next();
        }
    };

    handleInputChange = (objKey, field, value) => {
        const numberFields = ['VTPrimary', 'VTSecondary', 'RatedPower', 'SelectedValidVoltageDrop'];
        const parsedValue = numberFields.includes(field) ? Number(value) : value;
        this.setState(prevState => ({
            [objKey]: {
                ...prevState[objKey],
                [field]: parsedValue
            }
        }), () => {
            this.props.GlobalizeVTDevicePage(this.state);
        });
    };

    Next = () => {
        this.props.GlobalizeVTDevicePage(this.state);
        this.props.activeStepUpdate(this.props.activeStep + 1);
    };

    Back = () => {
        this.props.GlobalizeVTDevicePage(this.state);
        this.props.toggleMenu(false);
    };

    render() {
        return (
            <CSSTransition timeout={600} classNames="slide" in={this.state.ShouldShowForm} unmountOnExit>
                <div className="col-12 center FullScreenFix flex-column justify-content-start">
                    <div className="d-flex W90-p justify-content-center align-items-center flex-column RelayConfCont">
                        <h1 className="col-12 headingsForInitProject">VT Device</h1>
                        <div className="col-10 center row justify-content-between align-items-center O_X_Auto InitFormInfoCont">
                            <div className="col-12 d-flex justify-content-start align-items-start flex-row">

                                {['L1', 'L2'].map((objKey) => {
                                    const l = this.state[objKey];
                                    return (
                                        <div key={objKey} className="mb-4 col-6 d-flex flex-column justify-content-start align-items-end">
                                            <div className="col-12 d-flex justify-content-start">
                                                <h3 className="text-light">{objKey === "L1" ? "Winding 1" : "Winding 2"  }:</h3>
                                            </div>
                                            {objKey === "L2" &&
                                                <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                                                    <h5 className="text-light mr-4 mb-0 text-align-center center">Second winding?</h5>
                                                    <FormControl
                                                        variant="standard"
                                                        className="FormControl"
                                                        
                                                        sx={{
                                                            minWidth: 120,
                                                            width: "192px",
                                                            backgroundColor: "white",
                                                            borderRadius: 0,
                                                            border: "none",
                                                            padding: "4px 8px",
                                                            "& .MuiInput-underline:before": { borderBottom: "none" },
                                                            "& .MuiInput-underline:after": { borderBottom: "none" },
                                                            "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                                                        }}
                                                    >
                                                        <Select
                                                            value={l.L0}
                                                            onChange={(e) => this.handleInputChange(objKey, 'L0', e.target.value)}
                                                            displayEmpty
                                                            sx={{
                                                                "& .MuiSelect-select": {
                                                                    color: "#000",
                                                                    fontSize: "14px",
                                                                    padding: "8px 12px",
                                                                },
                                                                "& .MuiInput-underline:before": { borderBottom: "none" },
                                                                "& .MuiInput-underline:after": { borderBottom: "none" },
                                                                "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                                                            }}
                                                            renderValue={(selected) => selected || <span style={{ color: "#000", opacity: 1 }}>Want to use?</span>}
                                                        >
                                                            {["Unused", "Used"].map((vtClass) => (
                                                                <MenuItem key={vtClass} value={vtClass}>{vtClass}</MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                    <div style={{ width: '40px' }}>
                                                        <h5 className="text-light mr-4 mb-0 text-align-center center">{``}</h5>
                                                    </div>
                                                </div>
                                            }
                                            <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                                                <h5 className="text-light mr-4 mb-0 text-align-center center">VT Name</h5>
                                                <FormControl
                                                    disabled={objKey === "L2" && l.L0 === "Unused"}
                                                    variant="standard"
                                                    className="FormControl"
                                                    sx={{
                                                        minWidth: 120,
                                                        width: "192px",
                                                        backgroundColor: "white",
                                                        borderRadius: 0,
                                                        border: "none",
                                                        padding: "4px 8px",
                                                        "& .MuiInput-underline:before": { borderBottom: "none" },
                                                        "& .MuiInput-underline:after": { borderBottom: "none" },
                                                        "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                                                    }}
                                                >
                                                    <TextField
                                                        id="demo-simple-textfield"
                                                        value={l.VTName}
                                                        onChange={(e) => this.handleInputChange(objKey, 'VTName', e.target.value)}
                                                        variant="standard"
                                                        sx={{
                                                            "& .MuiInputBase-input": {
                                                                color: "#000",
                                                                fontSize: "14px",
                                                                padding: "8px 12px",
                                                                height: "auto",
                                                            },
                                                            "& .MuiInput-underline:before": { borderBottom: "none" },
                                                            "& .MuiInput-underline:after": { borderBottom: "none" },
                                                            "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                                                        }}
                                                    />
                                                </FormControl>
                                                <div style={{ width: '40px' }}>
                                                    <h5 className="text-light mr-4 mb-0 text-align-center center">{``}</h5>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                                                <h5 className="text-light mr-4 mb-0 text-align-center center">Standard</h5>
                                                <FormControl
                                                    disabled={objKey === "L2" && l.L0 === "Unused"}
                                                    variant="standard"
                                                    className="FormControl"
                                                    sx={{
                                                        minWidth: 120,
                                                        width: "192px",
                                                        backgroundColor: "white",
                                                        borderRadius: 0,
                                                        border: "none",
                                                        padding: "4px 8px",
                                                        "& .MuiInput-underline:before": { borderBottom: "none" },
                                                        "& .MuiInput-underline:after": { borderBottom: "none" },
                                                        "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                                                    }}
                                                >
                                                    <TextField
                                                        id="demo-simple-textfield"
                                                        value={l.Standard}
                                                        onChange={(e) => this.handleInputChange(objKey, 'Standard', e.target.value)}
                                                        variant="standard"
                                                        defaultValue={"IEC"}
                                                        sx={{
                                                            "& .MuiInputBase-input": {
                                                                color: "#000",
                                                                fontSize: "14px",
                                                                padding: "8px 12px",
                                                                height: "auto",
                                                            },
                                                            "& .MuiInput-underline:before": { borderBottom: "none" },
                                                            "& .MuiInput-underline:after": { borderBottom: "none" },
                                                            "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                                                        }}
                                                    />
                                                </FormControl>
                                                <div style={{ width: '40px' }}>
                                                    <h5 className="text-light mr-4 mb-0 text-align-center center">{``}</h5>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                                                <h5 className="text-light mr-4 mb-0 text-align-center center">VT Class</h5>
                                                <FormControl
                                                    disabled={objKey === "L2" && l.L0 === "Unused"}
                                                    variant="standard"
                                                    className="FormControl"
                                                    sx={{
                                                        minWidth: 120,
                                                        width: "192px",
                                                        backgroundColor: "white",
                                                        borderRadius: 0,
                                                        border: "none",
                                                        padding: "4px 8px",
                                                        "& .MuiInput-underline:before": { borderBottom: "none" },
                                                        "& .MuiInput-underline:after": { borderBottom: "none" },
                                                        "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                                                    }}
                                                >
                                                    <Select
                                                        value={l.SelectedVTClass}
                                                        onChange={(e) => this.handleInputChange(objKey, 'SelectedVTClass', e.target.value)}
                                                        displayEmpty
                                                        sx={{
                                                            "& .MuiSelect-select": {
                                                                color: "#000",
                                                                fontSize: "14px",
                                                                padding: "8px 12px",
                                                            },
                                                            "& .MuiInput-underline:before": { borderBottom: "none" },
                                                            "& .MuiInput-underline:after": { borderBottom: "none" },
                                                            "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                                                        }}
                                                        renderValue={(selected) => selected || <span style={{ color: "#000", opacity: 1 }}>Select VT Class</span>}
                                                    >
                                                        {this.state.VTClassList.map((vtClass) => (
                                                            <MenuItem key={vtClass} value={vtClass}>{vtClass}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                <div style={{ width: '40px' }}>
                                                    <h5 className="text-light mr-4 mb-0 text-align-center center">{``}</h5>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                                                <h5 className="text-light mr-4 mb-0 text-align-center center">VT Primary</h5>
                                                <FormControl
                                                    disabled={objKey === "L2" && l.L0 === "Unused"}
                                                    variant="standard"
                                                    className="FormControl"
                                                    sx={{
                                                        minWidth: 120,
                                                        width: "192px",
                                                        backgroundColor: "white",
                                                        borderRadius: 0,
                                                        border: "none",
                                                        padding: "4px 8px",
                                                        "& .MuiInput-underline:before": { borderBottom: "none" },
                                                        "& .MuiInput-underline:after": { borderBottom: "none" },
                                                        "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                                                    }}
                                                >
                                                    <TextField
                                                        id="demo-simple-textfield"
                                                        value={l.VTPrimary}
                                                        onChange={(e) => this.handleInputChange(objKey, 'VTPrimary', e.target.value)}
                                                        variant="standard"
                                                        type="number"
                                                        sx={{
                                                            "& .MuiInputBase-input": {
                                                                color: "#000",
                                                                fontSize: "14px",
                                                                padding: "8px 12px",
                                                                height: "auto",
                                                            },
                                                            "& .MuiInput-underline:before": { borderBottom: "none" },
                                                            "& .MuiInput-underline:after": { borderBottom: "none" },
                                                            "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                                                        }}
                                                    />
                                                </FormControl>
                                                <div style={{ width: '40px' }}>
                                                    <h5 className="text-light mr-4 mb-0 text-align-center center">{`(kV)`}</h5>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                                                <h5 className="text-light mr-4 mb-0 text-align-center center">VT Secondary</h5>
                                                <FormControl
                                                    disabled={objKey === "L2" && l.L0 === "Unused"}
                                                    variant="standard"
                                                    className="FormControl"
                                                    sx={{
                                                        minWidth: 120,
                                                        width: "192px",
                                                        backgroundColor: "white",
                                                        borderRadius: 0,
                                                        border: "none",
                                                        padding: "4px 8px",
                                                        "& .MuiInput-underline:before": { borderBottom: "none" },
                                                        "& .MuiInput-underline:after": { borderBottom: "none" },
                                                        "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                                                    }}
                                                >
                                                    <TextField
                                                        id="demo-simple-textfield"
                                                        value={l.VTSecondary}
                                                        onChange={(e) => this.handleInputChange(objKey, 'VTSecondary', e.target.value)}
                                                        variant="standard"
                                                        type="number"
                                                        sx={{
                                                            "& .MuiInputBase-input": {
                                                                color: "#000",
                                                                fontSize: "14px",
                                                                padding: "8px 12px",
                                                                height: "auto",
                                                            },
                                                            "& .MuiInput-underline:before": { borderBottom: "none" },
                                                            "& .MuiInput-underline:after": { borderBottom: "none" },
                                                            "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                                                        }}
                                                    />
                                                </FormControl>
                                                <div style={{ width: '40px' }}>
                                                    <h5 className="text-light mr-4 mb-0 text-align-center center">{`(V)`}</h5>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                                                <h5 className="text-light mr-4 mb-0 text-align-center center">Rated Power</h5>
                                                <FormControl
                                                    disabled={objKey === "L2" && l.L0 === "Unused"}
                                                    variant="standard"
                                                    className="FormControl"
                                                    sx={{
                                                        minWidth: 120,
                                                        width: "192px",
                                                        backgroundColor: "white",
                                                        borderRadius: 0,
                                                        border: "none",
                                                        padding: "4px 8px",
                                                        "& .MuiInput-underline:before": { borderBottom: "none" },
                                                        "& .MuiInput-underline:after": { borderBottom: "none" },
                                                        "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                                                    }}
                                                >
                                                    <TextField
                                                        id="demo-simple-textfield"
                                                        value={l.RatedPower}
                                                        onChange={(e) => this.handleInputChange(objKey, 'RatedPower', e.target.value)}
                                                        variant="standard"
                                                        type="number"
                                                        sx={{
                                                            "& .MuiInputBase-input": {
                                                                color: "#000",
                                                                fontSize: "14px",
                                                                padding: "8px 12px",
                                                                height: "auto",
                                                            },
                                                            "& .MuiInput-underline:before": { borderBottom: "none" },
                                                            "& .MuiInput-underline:after": { borderBottom: "none" },
                                                            "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                                                        }}
                                                    />
                                                </FormControl>
                                                <div style={{ width: '40px' }}>
                                                    <h5 className="text-light mr-4 mb-0 text-align-center center">{`(VA)`}</h5>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                                                <h5 className="text-light mr-4 mb-0 text-align-center center">Voltage Drop</h5>
                                                <FormControl
                                                    disabled={objKey === "L2" && l.L0 === "Unused"}
                                                    variant="standard"
                                                    className="FormControl"
                                                    sx={{
                                                        minWidth: 120,
                                                        width: "192px",
                                                        backgroundColor: "white",
                                                        borderRadius: 0,
                                                        border: "none",
                                                        padding: "4px 8px",
                                                        "& .MuiInput-underline:before": { borderBottom: "none" },
                                                        "& .MuiInput-underline:after": { borderBottom: "none" },
                                                        "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                                                    }}
                                                >
                                                    <Select
                                                        value={l.SelectedValidVoltageDrop}
                                                        onChange={(e) => this.handleInputChange(objKey, 'SelectedValidVoltageDrop', e.target.value)}
                                                        displayEmpty
                                                        sx={{
                                                            "& .MuiSelect-select": {
                                                                color: "#000",
                                                                fontSize: "14px",
                                                                padding: "8px 12px",
                                                            },
                                                            "& .MuiInput-underline:before": { borderBottom: "none" },
                                                            "& .MuiInput-underline:after": { borderBottom: "none" },
                                                            "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                                                        }}
                                                        renderValue={(selected) => selected || <span style={{ color: "#000", opacity: 1 }}>Select Voltage Drop</span>}
                                                    >
                                                        {this.state.ValidVoltageDropList.map((drop) => (
                                                            <MenuItem key={drop} value={drop}>{drop}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                <div style={{ width: '40px' }}>
                                                    <h5 className="text-light mr-4 mb-0 text-align-center center">{`(%}`}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                        <div className="w-100">
                            <div className="d-flex justify-content-between align-items-between flex-row col-12">
                                <Button className="NXT_Btn" onClick={this.Back}>Back</Button>
                                <Button className="NXT_Btn" onClick={this.Next}>Next</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CSSTransition>
        );
    }
}

const mapStateToProps = (state) => ({
    isMenuOpen: state.example.isMenuOpen,
    activeStep: state.example.VT.activeStepVT,
    L: state.example.VT.L,
    initializationFullScreen: state.example.initializationFullScreen
});

const mapDispatchToProps = (dispatch) => ({
    toggleMenu: d => dispatch({ type: 'SetNewVT', data: d }),
    activeStepUpdate: (value) => dispatch({ type: 'UPDATE_PROGRESSBAR_VT', value }),
    GlobalizeVTDevicePage: (data) => dispatch({ type: 'UPDATE_VTDevice_PAGE', data }),
});

export default connect(mapStateToProps, mapDispatchToProps)(VTDevice);