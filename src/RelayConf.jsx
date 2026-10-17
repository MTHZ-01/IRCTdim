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
export class RelayConf extends Component {

  state = {
    ShouldShowForm: false,
    wholeData: null,
    Manufacture: "",
    ManufactureList: ["", "", "",],
    RelayType: "",
    RelayTypeList: ["", "", "",],
    ProtectionFunction: "",
    ProtectionFunctionList: ["", "", "",],
    IrnA: "",
    IrnAList: ["", "", "",],
    BurdenPhaseVA: "",
    BurdenPhaseVAList: ["", "", "",],
    Cal_Acc_ToVA: "",
    Cal_Acc_ToVAList: ["", "", "",],
    Ith_Ir: "",
    Ith_IrList: ["", "", "",],
    Iph_one: 0,
    Iph_two: 0,
    Ie_two: 0,
    Iee_one: 0,
    IPh_max: 0,
    Ie_max: 0,
    if_max_int_HEFP: 0,
    if_max_ext_HEFP: 0,
    if_max_int_LDP: 0,
    if_max_ext_LDP: 0,
    if_max_int_TDP: 0,
    if_max_ext_TDP: 0,
    if_max_int_BDP: 0,
    if_max_ext_BDP: 0,
    Is: 0,
    Us: 0,
    Ifs: 0,
    TsysDP: 0,
    TsysLDP: 0,
    TsysTDP: 0,
    RPrime: 0,
    XPrime: 0,
    Length: 0,
    Z1Set: 0,
    XR: 0,
    K2: 0,
    Vk2: 0,
    R2: 0,
    Vk3: 0,
    R3: 0,
    nCT: 0,

  }

  GetRelayData = () => {
    fetch(AURL + `relayHierarchy`)
      .then(r => r.json())
      .then(d => {
        // Store the entire response in wholeData
        this.setState({ wholeData: d });

        // Extract all unique manufacture names
        const manufactureNames = [...new Set(d.relays.map(relay => relay.manufacture))];

        // Update the ManufactureList in the state
        this.setState({ ManufactureList: manufactureNames });
      })
      .catch(error => {
        console.error('Error fetching relay data:', error);
      });
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);

    if (this.props.activeStep == 0) {

      this.GetRelayData()
      this.setState(this.props.ProjectData.SecondPage)
      // this.setState({Cal_Acc_ToVA: this.props.ProjectData.SecondPage.Cal_Acc_ToVAList[0]})

      setTimeout(() => {
        this.setState({ ShouldShowForm: true });
      }, 100); // 1000ms = 1s
    }
  }

  handleManufactureChange = e => {
    const selectedManufacture = e.target.value;
    this.setState({ Manufacture: selectedManufacture });

    // Extract the name of the RelayType only
    const relatedRelayTypeNames = this.state.wholeData.relays
      .filter(relay => relay.manufacture === selectedManufacture)
      .flatMap(relay => relay.relay_types.map(type => type.name));

    // Update the state with the list of RelayType names
    this.setState({ RelayTypeList: relatedRelayTypeNames });
  };

  handleRelayTypeChange = e => {
    const selectedRelayType = e.target.value;
    this.setState({ RelayType: selectedRelayType });

    // Find protection functions based on the current Manufacture and selected RelayType
    const relatedProtectionFunctions = this.state.wholeData.relays
      .filter(relay => relay.manufacture === this.state.Manufacture) // Match the current Manufacture
      .flatMap(relay => relay.relay_types)
      .filter(relayType => relayType.name === selectedRelayType) // Match the selected RelayType
      .flatMap(relayType => relayType.protection_functions.map(func => func.name)); // Extract protection function names

    const relatedCal_Acc_ToVa = this.state.wholeData.relays
      .filter(relay => relay.manufacture === this.state.Manufacture) // Match the current Manufacture
      .flatMap(relay => relay.relay_types)
      .filter(relayType => relayType.name === selectedRelayType) // Match the selected RelayType
      .flatMap(relayType => relayType.cal_Acc_Tos.map(cal_Acc_To => cal_Acc_To.name)); // Extract protection function names

    const Ith_IrValue = this.state.wholeData.relays
      .filter(relay => relay.manufacture === this.state.Manufacture) // Match the current Manufacture
      .flatMap(relay => relay.relay_types)
      .filter(relayType => relayType.name === selectedRelayType) // Match the selected RelayType
      .flatMap(relayType => [relayType.Ith_Ir]); // Extract protection function names


    // Update state with protection function names
    this.setState({ ProtectionFunctionList: relatedProtectionFunctions, Ith_IrList: Ith_IrValue, Cal_Acc_ToVAList: relatedCal_Acc_ToVa, Cal_Acc_ToVA: relatedCal_Acc_ToVa[0] });
  };

  HandleProtectionFunctionChange = e => {
    const selectedProtectionFunction = e.target.value;
    const selectedRelayType = this.state.RelayType;
    this.setState({ ProtectionFunction: selectedProtectionFunction });

    // Find the BurdenPhaseVa based on the current Manufacture, RelayTypeName, and selected ProtectionFunction
    const relatedIrnA = this.state.wholeData.relays
      .filter(relay => relay.manufacture === this.state.Manufacture) // Match the current Manufacture
      .flatMap(relay => relay.relay_types)
      .filter(relayType => relayType.name === this.state.RelayType) // Match the current RelayTypeName
      .filter(relayType => relayType.name === selectedRelayType) // Match the selected RelayType
      .flatMap(relayType => relayType.irn_a_values.map(irn_a => irn_a.value)); // Extract BurdenPhaseVa values

    const relatedBurdenPhaseVa = this.state.wholeData.relays
      .filter(relay => relay.manufacture === this.state.Manufacture) // Match the current Manufacture
      .flatMap(relay => relay.relay_types)
      .filter(relayType => relayType.name === this.state.RelayType) // Match the current RelayTypeName
      .filter(relayType => relayType.name === selectedRelayType) // Match the selected RelayType
      .flatMap(relayType => relayType.irn_a_values.map(irn_a => irn_a.BurdenPhaseVA)); // Extract BurdenPhaseVa values

    const relatedCal_Acc_ToVa = this.state.wholeData.relays
      .filter(relay => relay.manufacture === this.state.Manufacture) // Match the current Manufacture
      .flatMap(relay => relay.relay_types)
      .filter(relayType => relayType.name === this.state.RelayType) // Match the current RelayTypeName
      .filter(relayType => relayType.name === selectedRelayType) // Match the selected RelayType
      .flatMap(relayType => relayType.irn_a_values.map(irn_a => irn_a.Cal_Acc_ToVA)); // Extract BurdenPhaseVa values
    
    // Update state with BurdenPhaseVa values
    this.setState({ IrnAList: relatedIrnA, BurdenPhaseVAList: relatedBurdenPhaseVa }, () => this.props.GlobalizeSecondPage(this.state));
  };

  HandleIrnAChange = e => {
    this.setState({ IrnA: e.target.value, BurdenPhaseVA: this.state.BurdenPhaseVAList[this.state.IrnAList.indexOf(e.target.value)] }, () => this.props.GlobalizeSecondPage(this.state))
  }

  HandleBurdenPhaseVAChange = e => {
    this.setState({ BurdenPhaseVA: e.target.value }, () => this.props.GlobalizeSecondPage(this.state))
  }

  HandleCal_Acc_ToVAChange = e => {
    this.setState({ Cal_Acc_ToVA: e.target.value }, () => this.props.GlobalizeSecondPage(this.state))
  }

  HandleIth_IrChange = e => {
    this.setState({ Ith_Ir: e.target.value })
  }

  Next = () => {
    this.props.GlobalizeSecondPage(this.state)
    this.props.activeStepUpdate(this.props.activeStep + 1)
  }

  GetToInitializeProject = () => {
    this.props.GlobalizeSecondPage(this.state)
    this.props.toggleMenu()
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress = (event) => {
    ("!!!")
    if (event.key === 'Escape') {
      event.preventDefault(); // Prevent the browser's default "Open File" action
      this.GetToInitializeProject();
    } else if (event.key === 'Enter') {
      this.Next()
    }
  };

  render() {

    const A3 = this.state.ProtectionFunction

    const renderProtectionContent = () => {
      switch (this.state.ProtectionFunction) {
        case "50/51+N":
          return (
            <Box className="col-12 my-1 d-flex flex-column align-items-end">
              <h5 className="bold" style={{ color: "white" }}>Overcurrent/Earth fault Protection:</h5>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">Iph&gt;&gt;</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-iph-two"
                    value={this.state.Iph_two}
                    onChange={(e) => this.setState({ Iph_two: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{`(A)`}</h5>
                </div>
              </div>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">Iph&gt;</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-iph-one"
                    value={this.state.Iph_one}
                    onChange={(e) => this.setState({ Iph_one: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{`(A)`}</h5>
                </div>
              </div>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">Ie&gt;&gt;</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-ie-two"
                    value={this.state.Ie_two}
                    onChange={(e) => this.setState({ Ie_two: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{`(A)`}</h5>
                </div>
              </div>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">Iee&gt;</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-iee-one"
                    value={this.state.Iee_one}
                    onChange={(e) => this.setState({ Iee_one: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{`(A)`}</h5>
                </div>
              </div>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">Iph-max</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-iph-max"
                    value={this.state.IPh_max}
                    onChange={(e) => this.setState({ IPh_max: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{`(kA)`}</h5>
                </div>
              </div>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">Ie-max</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-ie-max"
                    value={this.state.Ie_max}
                    onChange={(e) => this.setState({ Ie_max: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{`(kA)`}</h5>
                </div>
              </div>
            </Box>
          );
        case "HI REF":
          return (
            <Box className="col-12 my-1 d-flex flex-column align-items-end">
              <h5 className="bold" style={{ color: "white" }}>High impedance earth fault Protection:</h5>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">if_max_int</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-if-max-int-hefp"
                    value={this.state.if_max_int_HEFP}
                    onChange={(e) => this.setState({ if_max_int_HEFP: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{`(kA)`}</h5>
                </div>
              </div>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">If-max-ext</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-if-max-ext-hefp"
                    value={this.state.if_max_ext_HEFP}
                    onChange={(e) => this.setState({ if_max_ext_HEFP: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{`(kA)`}</h5>
                </div>
              </div>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">Is</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-is"
                    value={this.state.Is}
                    onChange={(e) => this.setState({ Is: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{`(A)`}</h5>
                </div>
              </div>
            </Box>
          );
        case "21":
          return (
            <Box className="col-12 my-1 d-flex flex-column align-items-end">
              <h5 className="bold" style={{ color: "white" }}>Distance Protection</h5>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">Us</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-us"
                    value={this.state.Us}
                    onChange={(e) => this.setState({ Us: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{`(kV)`}</h5>
                </div>
              </div>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">Ifs</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-ifs"
                    value={this.state.Ifs}
                    onChange={(e) => this.setState({ Ifs: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{`(kA)`}</h5>
                </div>
              </div>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">Tsys</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-tsys-dp"
                    value={this.state.TsysDP}
                    onChange={(e) => this.setState({ TsysDP: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{`(s)`}</h5>
                </div>
              </div>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">R'</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-rprime"
                    value={this.state.RPrime}
                    onChange={(e) => this.setState({ RPrime: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{`(ohm/km)`}</h5>
                </div>
              </div>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">X'</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-xprime"
                    value={this.state.XPrime}
                    onChange={(e) => this.setState({ XPrime: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{`(ohm/km)`}</h5>
                </div>
              </div>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">Length</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-length"
                    value={this.state.Length}
                    onChange={(e) => this.setState({ Length: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{`(km)`}</h5>
                </div>
              </div>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">Z1 set</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-z1set"
                    value={this.state.Z1Set}
                    onChange={(e) => this.setState({ Z1Set: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{`(%)`}</h5>
                </div>
              </div>
            </Box>
          );
        case "87L":
          return (
            <Box className="col-12 my-1 d-flex flex-column align-items-end">
              <h5 className="bold" style={{ color: "white" }}>Line differential protection</h5>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">if_max_int</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-if-max-int-ldp"
                    value={this.state.if_max_int_LDP}
                    onChange={(e) => this.setState({ if_max_int_LDP: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{`(kA)`}</h5>
                </div>
              </div>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">If-max-ext</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-if-max-ext-ldp"
                    value={this.state.if_max_ext_LDP}
                    onChange={(e) => this.setState({ if_max_ext_LDP: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{`(kA)`}</h5>
                </div>
              </div>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">Tsys</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-tsys-ldp"
                    value={this.state.TsysLDP}
                    onChange={(e) => this.setState({ TsysLDP: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{`(s)`}</h5>
                </div>
              </div>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">X/R</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-xr"
                    value={this.state.XR}
                    onChange={(e) => this.setState({ XR: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{``}</h5>
                </div>
              </div>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">K2</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-k2"
                    value={this.state.K2}
                    onChange={(e) => this.setState({ K2: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{`(ohm)`}</h5>
                </div>
              </div>
            </Box>
          );
        case "87T":
          return (
            <Box className="col-12 my-1 d-flex flex-column align-items-end">
              <h5 className="bold" style={{ color: "white" }}>Transformer differential protection</h5>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">If-max-int</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-if-max-int-tdp"
                    value={this.state.if_max_int_TDP}
                    onChange={(e) => this.setState({ if_max_int_TDP: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{`(kA)`}</h5>
                </div>
              </div>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">If-max-ext</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-if-max-ext-tdp"
                    value={this.state.if_max_ext_TDP}
                    onChange={(e) => this.setState({ if_max_ext_TDP: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{`(kA)`}</h5>
                </div>
              </div>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">Tsys</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-tsys-tdp"
                    value={this.state.TsysTDP}
                    onChange={(e) => this.setState({ TsysTDP: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{`(s)`}</h5>
                </div>
              </div>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">Vk2</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-vk2"
                    value={this.state.Vk2}
                    onChange={(e) => this.setState({ Vk2: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{`(V)`}</h5>
                </div>
              </div>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">R2</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-r2"
                    value={this.state.R2}
                    onChange={(e) => this.setState({ R2: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{`(ohm)`}</h5>
                </div>
              </div>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">Vk3</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-vk3"
                    value={this.state.Vk3}
                    onChange={(e) => this.setState({ Vk3: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{`(V)`}</h5>
                </div>
              </div>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">R3</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-r3"
                    value={this.state.R3}
                    onChange={(e) => this.setState({ R3: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{`(ohm)`}</h5>
                </div>
              </div>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">nCT</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-nct"
                    value={this.state.nCT}
                    onChange={(e) => this.setState({ nCT: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
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
                  <h5 className="text-light mb-0 text-align-center center">{``}</h5>
                </div>
              </div>
            </Box>
          );
        case "87BB":
          return (
            <Box className="col-12 my-1 d-flex flex-column align-items-end">
              <h5 className="bold" style={{ color: "white" }}>Busbar differential protection</h5>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">If-max-int</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-if-max-int-bdp"
                    value={this.state.if_max_int_BDP}
                    onChange={(e) => this.setState({ if_max_int_BDP: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
                    variant="standard"
                    type="number"
                    sx={{
                      "& .MuiInputBase-input": {
                        color: "#000",
                        fontSize: "14px",
                        padding: "8px 12px",
                        height: "auto",
                      },
                      "& .MuiInputBase-root": {
                        color: "#000",
                        borderRadius: 0
                      },
                      "& .MuiInput-underline:before": { borderBottom: "none" },
                      "& .MuiInput-underline:after": { borderBottom: "none" },
                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                    }}
                  />
                </FormControl>
                <div style={{ width: '40px' }}>
                  <h5 className="text-light mb-0 text-align-center center">{`(kA)`}</h5>
                </div>
              </div>
              <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                <h5 className="text-light mr-4 mb-0 text-align-center center">If-max-ext</h5>
                <FormControl
                  variant="standard"
                  className="FormControl"
                  sx={{
                    minWidth: 120,
                    width: "192px",
                    backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                    borderRadius: 0,
                    border: "none",
                    padding: "4px 8px",
                    "& .MuiInput-underline:before": { borderBottom: "none" },
                    "& .MuiInput-underline:after": { borderBottom: "none" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                  }}
                >
                  <TextField
                    disabled={this.state.RelayType === ""}
                    id="demo-simple-textfield-if-max-ext-bdp"
                    value={this.state.if_max_ext_BDP}
                    onChange={(e) => this.setState({ if_max_ext_BDP: Number(e.target.value) }, () => {
                      this.props.GlobalizeSecondPage(this.state);
                    })}
                    variant="standard"
                    type="number"
                    sx={{
                      "& .MuiInputBase-input": {
                        color: "#000",
                        fontSize: "14px",
                        padding: "8px 12px",
                        height: "auto",
                      },
                      "& .MuiInputBase-root": {
                        color: "#000",
                        borderRadius: 0
                      },
                      "& .MuiInput-underline:before": { borderBottom: "none" },
                      "& .MuiInput-underline:after": { borderBottom: "none" },
                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                    }}
                  />
                </FormControl>
                <div style={{ width: '40px' }}>
                  <h5 className="text-light mb-0 text-align-center center">{`(kA)`}</h5>
                </div>
              </div>
            </Box>
          );
        default:
          return (
            <div className="DefaultRelayStandardCont">
              <p>Please select a Protection Function</p>
            </div>
          );
      }
    };


    return (
      <CSSTransition timeout={600} classNames="slide" in={this.state.ShouldShowForm} unmountOnExit>
        <div className="col-12 center FullScreenFix flex-column justify-content-start">
          <div className="d-flex W90-p justify-content-between flex-column RelayConfCont">
            <h1 className="col-12 headingsForInitProject">Relay Configuration</h1>
            <div className="center flex-row justify-content-center align-items-start col-12 O_X_Auto InitFormInfoCont">
              <Box className="col-6 d-flex flex-column align-items-end justify-content-start">
                <h5 className="bold" style={{ color: "white" }}>Relay:</h5>
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
                    <Select
                      value={this.state.Manufacture}
                      onChange={this.handleManufactureChange}
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
                      renderValue={(selected) => selected || <span style={{ color: "#000", opacity: 1 }}>Select Manufacture</span>}
                    >
                      {this.state.ManufactureList.map((i) => (
                        <MenuItem key={i} value={i}>{i}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <div style={{ width: '40px' }}>
                    <h5 className="text-light mr-4 mb-0 text-align-center center">{``}</h5>
                  </div>
                </div>
                <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                  <h5 className="text-light mr-4 mb-0 text-align-center center">Relay Type</h5>
                  <FormControl
                    fullWidth
                    variant="standard"
                    className="FormControl"
                    sx={{
                      minWidth: 120,
                      width: "192px",
                      backgroundColor: this.state.Manufacture === "" ? "#e0e0e0" : "white",
                      borderRadius: 0,
                      border: "none",
                      padding: "4px 8px",
                      "& .MuiInput-underline:before": { borderBottom: "none" },
                      "& .MuiInput-underline:after": { borderBottom: "none" },
                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                    }}
                  >
                    <Select
                      disabled={this.state.Manufacture === ""}
                      value={this.state.RelayType}
                      onChange={this.handleRelayTypeChange}
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
                      renderValue={(selected) => selected || <span style={{ color: "#000", opacity: 1 }}>Select Relay Type</span>}
                    >
                      {this.state.RelayTypeList.map((i) => (
                        <MenuItem key={i} value={i}>{i}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <div style={{ width: '40px' }}>
                    <h5 className="text-light mr-4 mb-0 text-align-center center">{``}</h5>
                  </div>
                </div>
                <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                  <h5 className="text-light mr-4 mb-0 text-align-center center">Protection Function</h5>
                  <FormControl
                    fullWidth
                    variant="standard"
                    className="FormControl"
                    sx={{
                      minWidth: 120,
                      width: "192px",
                      backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                      borderRadius: 0,
                      border: "none",
                      padding: "4px 8px",
                      "& .MuiInput-underline:before": { borderBottom: "none" },
                      "& .MuiInput-underline:after": { borderBottom: "none" },
                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                    }}
                  >
                    <Select
                      disabled={this.state.RelayType === ""}
                      value={this.state.ProtectionFunction}
                      onChange={this.HandleProtectionFunctionChange}
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
                      renderValue={(selected) => selected || <span style={{ color: "#000", opacity: 1 }}>Select Protection Function</span>}
                    >
                      {this.state.ProtectionFunctionList.map((i) => (
                        <MenuItem key={i} value={i}>{i}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <div style={{ width: '40px' }}>
                    <h5 className="text-light mr-4 mb-0 text-align-center center">{``}</h5>
                  </div>
                </div>
                <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                  <h5 className="text-light mr-4 mb-0 text-align-center center">Irn(A)</h5>
                  <FormControl
                    fullWidth
                    variant="standard"
                    className="FormControl"
                    sx={{
                      minWidth: 120,
                      width: "192px",
                      backgroundColor: this.state.ProtectionFunction === "" ? "#e0e0e0" : "white",
                      borderRadius: 0,
                      border: "none",
                      padding: "4px 8px",
                      "& .MuiInput-underline:before": { borderBottom: "none" },
                      "& .MuiInput-underline:after": { borderBottom: "none" },
                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                    }}
                  >
                    <Select
                      disabled={this.state.ProtectionFunction === ""}
                      value={this.state.IrnA}
                      onChange={this.HandleIrnAChange}
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
                      renderValue={(selected) => selected || <span style={{ color: "#000", opacity: 1 }}>Select Irn(A)</span>}
                    >
                      {this.state.IrnAList.map((i) => (
                        <MenuItem key={i} value={i}>{i}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <div style={{ width: '40px' }}>
                    <h5 className="text-light mr-4 mb-0 text-align-center center">{`(A)`}</h5>
                  </div>
                </div>
                <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                  <h5 className="text-light mr-4 mb-0 text-align-center center">BurdenPhase(VA)</h5>
                  <FormControl
                    fullWidth
                    variant="standard"
                    className="FormControl"
                    sx={{
                      minWidth: 120,
                      width: "192px",
                      backgroundColor: this.state.IrnA === "" ? "#e0e0e0" : "white",
                      borderRadius: 0,
                      border: "none",
                      padding: "4px 8px",
                      "& .MuiInput-underline:before": { borderBottom: "none" },
                      "& .MuiInput-underline:after": { borderBottom: "none" },
                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                    }}
                  >
                    <TextField
                      disabled={this.state.IrnA === ""}
                      id="demo-simple-textfield"
                      value={this.state.BurdenPhaseVA || ""}
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
                    <h5 className="text-light mr-4 mb-0 text-align-center center">{`(VA)`}</h5>
                  </div>
                </div>
                <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                  <h5 className="text-light mr-4 mb-0 text-align-center center">Ith(In)</h5>
                  <FormControl
                    fullWidth
                    variant="standard"
                    className="FormControl"
                    sx={{
                      minWidth: 120,
                      width: "192px",
                      backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                      borderRadius: 0,
                      border: "none",
                      padding: "4px 8px",
                      "& .MuiInput-underline:before": { borderBottom: "none" },
                      "& .MuiInput-underline:after": { borderBottom: "none" },
                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                    }}
                  >
                    <TextField
                      disabled={this.state.RelayType === ""}
                      id="demo-simple-textfield"
                      value={this.state.Ith_IrList[0] || ""}
                      onChange={this.HandleIth_IrChange}
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
                  <h5 className="text-light mr-4 mb-0 text-align-center center">Cal_Acc_To(VA)</h5>
                  <FormControl
                    fullWidth
                    variant="standard"
                    className="FormControl"
                    sx={{
                      minWidth: 120,
                      width: "192px",
                      backgroundColor: this.state.RelayType === "" ? "#e0e0e0" : "white",
                      borderRadius: 0,
                      border: "none",
                      padding: "4px 8px",
                      "& .MuiInput-underline:before": { borderBottom: "none" },
                      "& .MuiInput-underline:after": { borderBottom: "none" },
                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                    }}
                  >
                    <Select
                      disabled={this.state.RelayType === ""}
                      value={this.state.Cal_Acc_ToVA || (this.state.Cal_Acc_ToVAList?.[0] || "")}
                      onChange={this.HandleCal_Acc_ToVAChange}
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
                      renderValue={(selected) => selected || <span style={{ color: "#000", opacity: 1 }}>Select Cal_Acc_To(VA)</span>}
                    >
                      {this.state.Cal_Acc_ToVAList.map((i) => (
                        <MenuItem key={i} value={i}>{i}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <div style={{ width: '40px' }}>
                    <h5 className="text-light mr-4 mb-0 text-align-center center">{`(VA)`}</h5>
                  </div>
                </div>
              </Box>
              <div className="LineSeparator"></div>
              <SwitchTransition mode="out-in">
                <CSSTransition timeout={600} classNames="slide" key={this.state.ProtectionFunction} mountOnEnter unmountOnExit>
                  <div className="col-4">
                    {renderProtectionContent()}
                  </div>
                </CSSTransition>
              </SwitchTransition>
            </div>
            <div className="w-100">
              <div className="d-flex justify-content-between align-items-between flex-row col-12">
                <Button className="NXT_Btn" onClick={this.props.toggleMenu}>Back</Button>
                <Button className="NXT_Btn" onClick={() => this.Next()}>Next</Button>
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
  activeStep: state.example.activeStep,
  ProjectData: state.example.Project,
  initializationFullScreen: state.example.initializationFullScreen

});


const mapDispatchToProps = (dispatch) => ({
  toggleMenu: () => dispatch({ type: 'TOGGLE_MENU' }),
  activeStepUpdate: (value) => dispatch({ type: 'UPDATE_PROGRESSBAR', value: value }),
  GlobalizeSecondPage: (data) => dispatch({ type: 'UPDATE_SECOND_PAGE', data: data })


});

export default connect(mapStateToProps, mapDispatchToProps)(RelayConf)