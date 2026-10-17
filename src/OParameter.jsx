import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { Button, TextField, FormControl, MenuItem, Select } from '@mui/material';
import { AURL } from './App.jsx';

export class OParameter extends Component {
  state = {
    ShouldShowForm: false,
    ContidionList: ["Used", "Unused"],
    MaterialList: ["Cu", "Al"],
    O1: {
      SelectedCondition: "Unused",
      MBCName: "",
      Length: 0.0,
      CrossSection: 0.0,
      SelectedMaterial: "Cu",
      ConnectedDevice: "",
      TotalConnectedBurden: 0.0
    },
    O2: {
      SelectedCondition: "Unused",
      MBCName: "",
      Length: 0.0,
      CrossSection: 0.0,
      SelectedMaterial: "Cu",
      ConnectedDevice: "",
      TotalConnectedBurden: 0.0
    },
    O3: {
      SelectedCondition: "Unused",
      MBCName: "",
      Length: 0.0,
      CrossSection: 0.0,
      SelectedMaterial: "Cu",
      ConnectedDevice: "",
      TotalConnectedBurden: 0.0
    },
    O4: {
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

    if (this.props.activeStep === 1) {
      this.setState({
        O1: this.props.O?.O1 || this.state.O1,
        O2: this.props.O?.O2 || this.state.O2,
        O3: this.props.O?.O3 || this.state.O3,
        O4: this.props.O?.O4 || this.state.O4,
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
          <div className="d-flex W90-p justify-content-between flex-column RelayConfCont">
            <h1 className="col-12 headingsForInitProject">Connected Device - Winding 1</h1>
            <div className="center row justify-content-center align-items-center col-12 O_X_Auto InitFormInfoCont ConnectedContainer">
              <div className="row ">
                <div className="col-3 p-0"></div>
                {['MBC1', 'MBC2', 'MBC3', 'MBC4'].map((o) => (
                  <div className="col-2 p-0" key={o}><h5 className="text-light text-align-center center">{o}</h5></div>
                ))}
                <div style={{ width: '64px' }}></div>
              </div>
              {fields.map((field) => (
                <div className="row align-items-center" key={field.name}>
                  <div className="col-3 p-0">
                    <h5 className="text-light mb-0 text-align-center center">{field.label}</h5>
                  </div>
                  {['O1', 'O2', 'O3', 'O4'].map((objKey) => (
                    <div className="col-2 px-1" key={objKey}>
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
  O: state.example.VT.O,
  initializationFullScreen: state.example.initializationFullScreen
});

const mapDispatchToProps = (dispatch) => ({
  toggleMenu: () => dispatch({ type: 'TOGGLE_MENU' }),
  activeStepUpdate: (value) => dispatch({ type: 'UPDATE_PROGRESSBAR_VT', value }),
  GlobalizeSecondPage: (data) => dispatch({ type: 'UPDATE_VTOParameter_PAGE', data }),
});

export default connect(mapStateToProps, mapDispatchToProps)(OParameter);