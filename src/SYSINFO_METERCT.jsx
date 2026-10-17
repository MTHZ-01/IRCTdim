import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { Button, TextField, FormControl, MenuItem, Select } from '@mui/material';
import { AURL } from './App.jsx';

export class SYSINFO_METERCT extends Component {
  state = {
    ShouldShowForm: false,
    Length: 0,
    CrossSection: 0,
    Material_List: ['Al', 'Cu'],
    Material: '',
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

    if (this.props.activeStep === 2) {
      this.setState({
        Length: this.props.Conductor?.Length || 0,
        CrossSection: this.props.Conductor?.CrossSection || 0,
        Material: this.props.Conductor?.Material || '',
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
            <h1 className="col-12 headingsForInitProject">System info</h1>
            <div className="center flex-row justify-content-center align-items-center col-12 O_X_Auto InitFormInfoCont">
              <div className="center justify-content-start align-items-end flex-column">
                <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                  <h5 className="text-light mr-4 mb-0 text-align-center center">Length</h5>
                  <FormControl
                    fullWidth
                    variant="standard"
                    className="FormControl"
                    sx={{
                      minWidth: 130,
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
                      value={this.state.Length}
                      onChange={(e) => this.handleInputChange('Length', e.target.value)}
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
                    <h5 className="text-light mr-4 mb-0 text-align-center center">{`(m)`}</h5>
                  </div>
                </div>
                <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                  <h5 className="text-light mr-4 mb-0 text-align-center center">Cross Section</h5>
                  <FormControl
                    fullWidth
                    variant="standard"
                    className="FormControl"
                    sx={{
                      minWidth: 130,
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
                      value={this.state.CrossSection}
                      onChange={(e) => this.handleInputChange('CrossSection', e.target.value)}
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
                    <h5 className="text-light mr-4 mb-0 text-align-center center">{`(mm²)`}</h5>
                  </div>
                </div>
                <div className="d-flex flex-row my-1 justify-content-center align-items-center">
                  <h5 className="text-light mr-4 mb-0 text-align-center center">Material</h5>
                  <FormControl
                    fullWidth
                    variant="standard"
                    className="FormControl"
                    sx={{
                      minWidth: 130,
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
                      value={this.state.Material}
                      onChange={(e) => this.handleInputChange('Material', e.target.value)}
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
                          return <span style={{ color: "#000", opacity: 1 }}>Select Material</span>;
                        }
                        return selected;
                      }}
                    >
                      <MenuItem value="">
                        <em>Select Material</em>
                      </MenuItem>
                      {this.state.Material_List.map((material) => (
                        <MenuItem key={material} value={material}>
                          {material}
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
  Conductor: state.example.MeterCTInfo.Conductor,
  initializationFullScreen: state.example.initializationFullScreen
});

const mapDispatchToProps = (dispatch) => ({
  toggleMenu: () => dispatch({ type: 'TOGGLE_MENU' }),
  activeStepUpdate: (value) => dispatch({ type: 'UPDATE_PROGRESSBAR_METER_CT', value }),
  GlobalizeSecondPage: (data) => dispatch({ type: 'UPDATE_SySINFO_PAGE', data }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SYSINFO_METERCT);