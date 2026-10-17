import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { Button, TextField, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { AURL } from './App.jsx';

export class CTConfig_METERCT extends Component {
    state = {
        ShouldShowForm: false,
        CTName: '',
        standard: '',
        CtClassList: ["0.1", "0.2", "1", "3", "5", "0.2S", "0.5S"],
        selectedCTClass: '',
        CTPrimary: 0,
        CTSecondry: 0,
        SecurityFactor: 0,
        RatedBurden: 0,
        CTResistance: 0,
        ExtendedBurdenRangeList: ['Yes', 'No'],
        SelectedExtendedBurdenRangeList: 'Yes',
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

        if (this.props.activeStep === 1) {
            this.setState({
                CTName: this.props.CurrentTransformer?.CTName || '',
                standard: this.props.CurrentTransformer?.standard || '',
                selectedCTClass: this.props.CurrentTransformer?.selectedCTClass || '',
                CTPrimary: this.props.CurrentTransformer?.CTPrimary || 0,
                CTSecondry: this.props.CurrentTransformer?.CTSecondry || 0,
                SecurityFactor: this.props.CurrentTransformer?.SecurityFactor || 0,
                RatedBurden: this.props.CurrentTransformer?.RatedBurden || 0,
                CTResistance: this.props.CurrentTransformer?.CTResistance || 0,
                SelectedExtendedBurdenRangeList: this.props.CurrentTransformer?.SelectedExtendedBurdenRangeList || 'Yes',
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

    handleInputChange = (field, value) => {
        this.setState({ [field]: value }, () => {
            this.props.GlobalizeSecondPage(this.state);
        });
    };

    handleManufactureChange = (e) => {
        const selectedManufacture = e.target.value;
        this.setState({ Manufacture: selectedManufacture });

        const relatedRelayTypeNames = this.state.wholeData.relays
            .filter((relay) => relay.manufacture === selectedManufacture)
            .flatMap((relay) => relay.relay_types.map((type) => type.name));
        this.setState({ RelayTypeList: relatedRelayTypeNames });
    };

    handleRelayTypeChange = (e) => {
        const selectedRelayType = e.target.value;
        this.setState({ RelayType: selectedRelayType });

        const relatedProtectionFunctions = this.state.wholeData.relays
            .filter((relay) => relay.manufacture === this.state.Manufacture)
            .flatMap((relay) => relay.relay_types)
            .filter((relayType) => relayType.name === selectedRelayType)
            .flatMap((relayType) => relayType.protection_functions.map((func) => func.name));

        const relatedCal_Acc_ToVa = this.state.wholeData.relays
            .filter((relay) => relay.manufacture === this.state.Manufacture)
            .flatMap((relay) => relay.relay_types)
            .filter((relayType) => relayType.name === selectedRelayType)
            .flatMap((relayType) => relayType.cal_Acc_Tos.map((cal_Acc_To) => cal_Acc_To.name));

        const Ith_IrValue = this.state.wholeData.relays
            .filter((relay) => relay.manufacture === this.state.Manufacture)
            .flatMap((relay) => relay.relay_types)
            .filter((relayType) => relayType.name === selectedRelayType)
            .flatMap((relayType) => [relayType.Ith_Ir]);

        this.setState({
            ProtectionFunctionList: relatedProtectionFunctions,
            Ith_IrList: Ith_IrValue,
            Cal_Acc_ToVAList: relatedCal_Acc_ToVa,
            Cal_Acc_ToVA: relatedCal_Acc_ToVa[0],
        });
    };

    HandleProtectionFunctionChange = (e) => {
        const selectedProtectionFunction = e.target.value;
        const selectedRelayType = this.state.RelayType;
        this.setState({ ProtectionFunction: selectedProtectionFunction });

        const relatedIrnA = this.state.wholeData.relays
            .filter((relay) => relay.manufacture === this.state.Manufacture)
            .flatMap((relay) => relay.relay_types)
            .filter((relayType) => relayType.name === this.state.RelayType)
            .filter((relayType) => relayType.name === selectedRelayType)
            .flatMap((relayType) => relayType.irn_a_values.map((irn_a) => irn_a.value));

        const relatedBurdenPhaseVa = this.state.wholeData.relays
            .filter((relay) => relay.manufacture === this.state.Manufacture)
            .flatMap((relay) => relay.relay_types)
            .filter((relayType) => relayType.name === this.state.RelayType)
            .filter((relayType) => relayType.name === selectedRelayType)
            .flatMap((relayType) => relayType.irn_a_values.map((irn_a) => irn_a.BurdenPhaseVA));

        const relatedCal_Acc_ToVa = this.state.wholeData.relays
            .filter((relay) => relay.manufacture === this.state.Manufacture)
            .flatMap((relay) => relay.relay_types)
            .filter((relayType) => relayType.name === this.state.RelayType)
            .filter((relayType) => relayType.name === selectedRelayType)
            .flatMap((relayType) => relayType.irn_a_values.map((irn_a) => irn_a.Cal_Acc_ToVA));

        this.setState({ IrnAList: relatedIrnA, BurdenPhaseVAList: relatedBurdenPhaseVa });
    };

    HandleIrnAChange = (e) => {
        this.setState({
            IrnA: e.target.value,
            BurdenPhaseVA: this.state.BurdenPhaseVAList[this.state.IrnAList.indexOf(e.target.value)],
        });
    };

    HandleBurdenPhaseVAChange = (e) => {
        this.setState({ BurdenPhaseVA: e.target.value });
    };

    HandleCal_Acc_ToVAChange = (e) => {
        this.setState({ Cal_Acc_ToVA: e.target.value });
    };

    HandleIth_IrChange = (e) => {
        this.setState({ Ith_Ir: e.target.value });
    };

    Next = () => {
        this.props.GlobalizeSecondPage(this.state);
        this.props.activeStepUpdate(this.props.activeStep + 1);
    };

    Back = () => {
        this.props.GlobalizeSecondPage(this.state);
        this.props.activeStepUpdate(this.props.activeStep - 1);
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
                        <h1 className="col-12 headingsForInitProject">CT config</h1>
                        <div className="center flex-row justify-content-center align-items-start col-12 O_X_Auto InitFormInfoCont">
                            <div className="center justify-content-start align-items-end flex-column">
                                <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                                    <h5 className="text-light mr-4 mb-0 text-align-center center">CT Name</h5>
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
                                            value={this.state.CTName}
                                            onChange={(e) => this.handleInputChange('CTName', e.target.value)}
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
                                <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                                    <h5 className="text-light mr-4 mb-0 text-align-center center">CT Class</h5>
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
                                            value={this.state.selectedCTClass}
                                            onChange={(e) => this.handleInputChange('selectedCTClass', e.target.value)}
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
                                                    return <span style={{ color: "#000", opacity: 1 }}>Select CT Class</span>;
                                                }
                                                return selected;
                                            }}
                                        >
                                            <MenuItem value="">
                                                <em>Select CT Class</em>
                                            </MenuItem>
                                            {this.state.CtClassList.map((ctClass) => (
                                                <MenuItem key={ctClass} value={ctClass}>
                                                    {ctClass}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <div style={{ width: '40px' }}>
                                        <h5 className="text-light mr-4 mb-0 text-align-center center">{``}</h5>
                                    </div>
                                </div>
                                <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                                    <h5 className="text-light mr-4 mb-0 text-align-center center">CT Primary (Ipr)</h5>
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
                                            value={this.state.CTPrimary}
                                            onChange={(e) => this.handleInputChange('CTPrimary', e.target.value)}
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
                                    <h5 className="text-light mr-4 mb-0 text-align-center center">CT Secondary (Isr)</h5>
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
                                            value={this.state.CTSecondry}
                                            onChange={(e) => this.handleInputChange('CTSecondry', e.target.value)}
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
                                    <h5 className="text-light mr-4 mb-0 text-align-center center">Security Factor (FS)</h5>
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
                                            value={this.state.SecurityFactor}
                                            onChange={(e) => this.handleInputChange('SecurityFactor', e.target.value)}
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
                                        <h5 className="text-light mr-4 mb-0 text-align-center center">{``}</h5>
                                    </div>
                                </div>
                                <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                                    <h5 className="text-light mr-4 mb-0 text-align-center center">Rated Burden (Pcn)</h5>
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
                                            value={this.state.RatedBurden}
                                            onChange={(e) => this.handleInputChange('RatedBurden', e.target.value)}
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
                                    <h5 className="text-light mr-4 mb-0 text-align-center center">CT Resistance @ 75℃ (Rct)</h5>
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
                                            value={this.state.CTResistance}
                                            onChange={(e) => this.handleInputChange('CTResistance', e.target.value)}
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
                                        <h5 className="text-light mr-4 mb-0 text-align-center center">{`(Ω)`}</h5>
                                    </div>
                                </div>
                                <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                                    <h5 className="text-light mr-4 mb-0 text-align-center center">Extended Burden Range</h5>
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
                                            value={this.state.SelectedExtendedBurdenRangeList}
                                            onChange={(e) => this.handleInputChange('SelectedExtendedBurdenRangeList', e.target.value)}
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
                                                    return <span style={{ color: "#000", opacity: 1 }}>Select Option</span>;
                                                }
                                                return selected;
                                            }}
                                        >
                                            <MenuItem value="">
                                                <em>Select Option</em>
                                            </MenuItem>
                                            {this.state.ExtendedBurdenRangeList.map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <div style={{ width: '40px' }}>
                                        <h5 className="text-light mr-4 mb-0 text-align-center center">{``}</h5>
                                    </div>
                                </div>
                            </div>
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
    activeStep: state.example.MeterCTInfo.activeStepMETERCT,
    CurrentTransformer: state.example.MeterCTInfo.CurrentTransformer,
    initializationFullScreen: state.example.initializationFullScreen
});

const mapDispatchToProps = (dispatch) => ({
    toggleMenu: () => dispatch({ type: 'TOGGLE_MENU' }),
    activeStepUpdate: (value) => dispatch({ type: 'UPDATE_PROGRESSBAR_METER_CT', value }),
    GlobalizeSecondPage: (data) => dispatch({ type: 'UPDATE_CTConfig_PAGE', data }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CTConfig_METERCT);