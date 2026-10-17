import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { Button, TextField, FormControl, MenuItem, Select } from '@mui/material';
import { AURL } from './App.jsx';

export class MeteringDevice extends Component {
    state = {
        ShouldShowForm: false,
        Manufacture: '',
        DeviceName: '',
        Irn_A_list: [1, 5],
        selectedIrn_A: 0,
        BurdenPhase_VA: 0,
        DeviceMaxCurrent: 0,
        MaxFaultCurrent: 0,
        standard: '',
    };

    GetRelayData = () => {
        fetch(AURL + `relayHierarchy`)
            .then((r) => r.json())
            .then((d) => {
                this.setState({ wholeData: d });
                const manufactureNames = [...new Set(d.relays.map((relay) => relay.manufacture))];
                this.setState({ ManufactureList: manufactureNames });
            })
            .catch((error) => {
                console.error('Error fetching relay data:', error);
            });
    };

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);

        if (this.props.activeStep === 0) {
            this.setState({
                Manufacture: this.props.MeterCTInfo.MeteringDevice?.Manufacture || '',
                DeviceName: this.props.MeterCTInfo.MeteringDevice?.DeviceName || '',
                selectedIrn_A: this.props.MeterCTInfo.MeteringDevice?.selectedIrn_A || 0,
                BurdenPhase_VA: this.props.MeterCTInfo.MeteringDevice?.BurdenPhase_VA || 0,
                DeviceMaxCurrent: this.props.MeterCTInfo.MeteringDevice?.DeviceMaxCurrent || 0,
                MaxFaultCurrent: this.props.MeterCTInfo.MeteringDevice?.MaxFaultCurrent || 0,
                standard: this.props.MeterCTInfo.MeteringDevice?.standard || '',
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
            this.GetToInitializeProject();
        } else if (event.key === 'Enter') {
            this.Next();
        }
    };

    handleInputChange = (field, value) => {
        this.setState({ [field]: value }, () => {
            this.props.GlobalizeSecondPage(this.state);
        });
    };

    Next = () => {
        this.props.GlobalizeSecondPage(this.state);
        this.props.activeStepUpdate(this.props.activeStep + 1);
    };

    GetToInitializeProject = () => {
        this.props.GlobalizeSecondPage(this.state);
        this.props.toggleMenu();
    };

    render() {
        return (
            <CSSTransition timeout={600} classNames="slide" in={this.state.ShouldShowForm} unmountOnExit>
                <div className="col-12 center FullScreenFix flex-column justify-content-start">
                    <div className="d-flex W90-p justify-content-between flex-column RelayConfCont">
                        <h1 className="col-12 headingsForInitProject">Metering device</h1>
                        <div className="center flex-column justify-content-center align-items-center col-12 O_X_Auto InitFormInfoCont">
                            <div className="center justify-content-start align-items-end flex-column">
                                <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                                    <h5 className="text-light mr-4 mb-0 text-align-center center">Manufacture</h5>
                                    <FormControl
                                        fullWidth
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
                                            value={this.state.Manufacture}
                                            onChange={(e) => this.handleInputChange('Manufacture', e.target.value)}
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
                                    <h5 className="text-light mr-4 mb-0 text-align-center center">Device name</h5>
                                    <FormControl
                                        fullWidth
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
                                            value={this.state.DeviceName}
                                            onChange={(e) => this.handleInputChange('DeviceName', e.target.value)}
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
                                    <h5 className="text-light mr-4 mb-0 text-align-center center">Irn</h5>
                                    <FormControl
                                        fullWidth
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
                                            value={this.state.selectedIrn_A}
                                            onChange={(e) => this.handleInputChange('selectedIrn_A', e.target.value)}
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
                                                    return <span style={{ color: "#000", opacity: 1 }}>Select Irn</span>;
                                                }
                                                return selected;
                                            }}
                                        >
                                            <MenuItem value="">
                                                <em>Select Irn(A)</em>
                                            </MenuItem>
                                            {this.state.Irn_A_list.map((irn) => (
                                                <MenuItem key={irn} value={irn}>
                                                    {irn}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <div style={{ width: '40px' }}>
                                        <h5 className="text-light mr-4 mb-0 text-align-center center">{`(A)`}</h5>
                                    </div>
                                </div>
                                <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                                    <h5 className="text-light mr-4 mb-0 text-align-center center">Burden Phase</h5>
                                    <FormControl
                                        fullWidth
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
                                            value={this.state.BurdenPhase_VA}
                                            onChange={(e) => this.handleInputChange('BurdenPhase_VA', e.target.value)}
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
                                    <h5 className="text-light mr-4 mb-0 text-align-center center">Device max. current</h5>
                                    <FormControl
                                        fullWidth
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
                                            value={this.state.DeviceMaxCurrent}
                                            onChange={(e) => this.handleInputChange('DeviceMaxCurrent', e.target.value)}
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
                                        <h5 className="text-light mr-4 mb-0 text-align-center center">{`(A)`}</h5>
                                    </div>
                                </div>
                                <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                                    <h5 className="text-light mr-4 mb-0 text-align-center center">Max. fault current</h5>
                                    <FormControl
                                        fullWidth
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
                                            value={this.state.MaxFaultCurrent}
                                            onChange={(e) => this.handleInputChange('MaxFaultCurrent', e.target.value)}
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
                                        <h5 className="text-light mr-4 mb-0 text-align-center center">{`(kA)`}</h5>
                                    </div>
                                </div>
                                <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                                    <h5 className="text-light mr-4 mb-0 text-align-center center">Standard</h5>
                                    <FormControl
                                        fullWidth
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
                                            value={this.state.standard}
                                            onChange={(e) => this.handleInputChange('standard', e.target.value)}
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
                            </div>
                        </div>
                        <div className="w-100">
                            <div className="d-flex justify-content-between align-items-between flex-row col-12">
                                <Button className="NXT_Btn" onClick={() => {
                                    this.props.SET_NEW_METERCT_PATH("");
                                    this.props.toggleMenu();
                                }}>
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
    activeStep: state.example.MeterCTInfo.activeStepMETERCT,
    MeterCTInfo: state.example.MeterCTInfo,
    initializationFullScreen: state.example.initializationFullScreen
});

const mapDispatchToProps = (dispatch) => ({
    toggleMenu: () => dispatch({ type: 'SetNewMeterCt', d: false }),
    activeStepUpdate: (value) => dispatch({ type: 'UPDATE_PROGRESSBAR_METER_CT', value }),
    GlobalizeSecondPage: (data) => dispatch({ type: 'UPDATE_MeteringDevice_PAGE', data }),
    SET_NEW_METERCT_PATH: path => dispatch({ type: "SET_NEW_METERCT_PATH", data: path }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MeteringDevice);