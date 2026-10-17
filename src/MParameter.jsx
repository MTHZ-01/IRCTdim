import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { Button, TextField, FormControl, MenuItem, Select } from '@mui/material';
import { AURL } from './App.jsx';

export class MParameter extends Component {
    state = {
        ShouldShowForm: false,
        ContidionList: ["Used", "Unused"],
        MaterialList: ["Cu", "Al"],
        M1: {
            SelectedCondition: "Unused",
            MBCName: "",
            Length: 0.0,
            CrossSection: 0.0,
            SelectedMaterial: "Cu",
            ConnectedDevice: "",
            TotalConnectedBurden: 0.0
        },
        M2: {
            SelectedCondition: "Unused",
            MBCName: "",
            Length: 0.0,
            CrossSection: 0.0,
            SelectedMaterial: "Cu",
            ConnectedDevice: "",
            TotalConnectedBurden: 0.0
        },
        M3: {
            SelectedCondition: "Unused",
            MBCName: "",
            Length: 0.0,
            CrossSection: 0.0,
            SelectedMaterial: "Cu",
            ConnectedDevice: "",
            TotalConnectedBurden: 0.0
        },
        M4: {
            SelectedCondition: "Unused",
            MBCName: "",
            Length: 0.0,
            CrossSection: 0.0,
            SelectedMaterial: "Cu",
            ConnectedDevice: "",
            TotalConnectedBurden: 0.0
        },
    };

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);

        if (this.props.activeStep === 2) {
            this.setState({
                M1: this.props.M?.M1 || this.state.M1,
                M2: this.props.M?.M2 || this.state.M2,
                M3: this.props.M?.M3 || this.state.M3,
                M4: this.props.M?.M4 || this.state.M4,
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
        const floatFields = ['Length', 'CrossSection', 'TotalConnectedBurden'];
        let parsedValue = value;

        if (floatFields.includes(field)) {
            // Parse as float, default to 0.0 if invalid
            parsedValue = value.trim() === '' ? 0.0 : parseFloat(value);
            if (isNaN(parsedValue)) {
                parsedValue = 0.0; // Fallback for invalid input
            }
        }

        this.setState(prevState => ({
            [objKey]: {
                ...prevState[objKey],
                [field]: parsedValue
            }
        }), () => {
            this.props.GlobalizeSecondPage(this.state);
        });
    };

    Next = () => {
        this.props.GlobalizeSecondPage(this.state);
        this.props.activeStepUpdate(this.props.activeStep + 1);
    };

    Back = () => {
        this.props.GlobalizeSecondPage(this.state);
        this.props.activeStepUpdate(this.props.activeStep - 1);
    };

    render() {
        const fields = [
            { name: 'SelectedCondition', label: 'Condition', type: 'select', options: this.state.ContidionList, unit: '' },
            { name: 'MBCName', label: 'MBC Name', type: 'text', unit: '' },
            { name: 'Length', label: 'Length', type: 'number', unit: '(m)' },
            { name: 'CrossSection', label: 'Cross Section', type: 'number', unit: '(mm²)' },
            { name: 'SelectedMaterial', label: 'Material', type: 'select', options: this.state.MaterialList, unit: '' },
            { name: 'ConnectedDevice', label: 'Connected Device', type: 'text', unit: '' },
            { name: 'TotalConnectedBurden', label: 'Total Connected Burden', type: 'number', unit: '(VA)' },
        ];

        return (
            <CSSTransition timeout={600} classNames="slide" in={this.state.ShouldShowForm} unmountOnExit>
                <div className="col-12 center FullScreenFix flex-column justify-content-start">
                    <div className="d-flex W90-p justify-content-between align-items-center flex-column RelayConfCont">
                        <h1 className="col-12 headingsForInitProject">Connected Device - Winding 2</h1>
                        <div className="col-12 center row justify-content-center align-items-center O_X_Auto InitFormInfoCont ConnectedContainer">
                            <div className="row ">
                                <div className="col-3 p-0"></div>
                                {['MBC1', 'MBC2', 'MBC3', 'MBC4'].map((m) => (
                                    <div className="col-2 p-0" key={m}><h5 className="text-light text-align-center center">{m}</h5></div>
                                ))}
                                <div style={{ width: '64px' }}></div>
                            </div>
                            {fields.map((field) => (
                                <div className="row align-items-center" key={field.name}>
                                    <div className="col-3 p-0">
                                        <h5 className="text-light mb-0 text-align-center center">{field.label}</h5>
                                    </div>
                                    {['M1', 'M2', 'M3', 'M4'].map((objKey) => (
                                        <div className="col-2 p-1" key={objKey}>
                                            {field.type === 'select' ? (
                                                <FormControl
                                                    variant="standard"
                                                    className="FormControl"
                                                    sx={{
                                                        width: "100%",
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
                                                        value={this.state[objKey][field.name]}
                                                        onChange={(e) => this.handleInputChange(objKey, field.name, e.target.value)}
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
                                                        renderValue={(selected) => {
                                                            if (!selected) {
                                                                return <span style={{ color: "#000", opacity: 1 }}>Select {field.label}</span>;
                                                            }
                                                            return selected;
                                                        }}
                                                    >
                                                        {field.options.map((option) => (
                                                            <MenuItem key={option} value={option}>
                                                                {option}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                <FormControl
                                                    variant="standard"
                                                    className="FormControl"
                                                    sx={{
                                                        width: "100%",
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
                                                        id={`demo-simple-textfield-${objKey}-${field.name}`}
                                                        value={this.state[objKey][field.name]}
                                                        onChange={(e) => this.handleInputChange(objKey, field.name, e.target.value)}
                                                        variant="standard"
                                                        type={field.type}
                                                        inputProps={field.type === 'number' ? { step: '0.01' } : {}}
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
                                            )}
                                        </div>
                                    ))}
                                    <div style={{ width: '64px' }}>
                                        <h5 className="text-light mr-4 mb-0 text-align-center center">{field.unit}</h5>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="w-100">
                            <div className="d-flex justify-content-between align-items-between flex-row col-12">
                                <Button className="NXT_Btn" onClick={this.Back}>
                                    Back
                                </Button>
                                <Button className="NXT_Btn" onClick={this.Next}>
                                    Next
                                </Button>
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
    M: state.example.VT.M,
    initializationFullScreen: state.example.initializationFullScreen
});

const mapDispatchToProps = (dispatch) => ({
    toggleMenu: () => dispatch({ type: 'TOGGLE_MENU' }),
    activeStepUpdate: (value) => dispatch({ type: 'UPDATE_PROGRESSBAR_VT', value }),
    GlobalizeSecondPage: (data) => dispatch({ type: 'UPDATE_VTMParameter_PAGE', data }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MParameter);