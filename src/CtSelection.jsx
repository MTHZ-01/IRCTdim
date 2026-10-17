

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { Button } from '@mui/material'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { AURL } from "./App.jsx"
import { TextField } from '@mui/material';

export class CtSelection extends Component {

  state = {
    ShouldShowForm: false,
    CTClassVals: [],
    SelectedCtClass: "",
    CTName: "",
    CTPrimary: "",
    CTSecondary: "",
    ALF_K_SCC: "",
    KTD: "",
    Sr: "",
    Rr: "",
    CTResistance: "",
    EK: "",
    Ie: "",
    Vt: "",
    Vk: "",
    Ik: "",

  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);

    if (this.props.activeStep == 1) {
      setTimeout(() => {
        this.setState({ ShouldShowForm: true });
      }, 100);
    }

    const A7Status = this.props.ProjectData?.SecondPage?.Cal_Acc_ToVA || 0

    // FIX: Check if ThirdPage has data, if not, use defaults but keep existing state
    const thirdPageData = this.props.ProjectData?.ThirdPage || {};

    // Only set state if there's actual data, otherwise keep defaults
    if (Object.keys(thirdPageData).length > 0) {
      this.setState(thirdPageData);
    }

    this.GetCtClassStatus(A7Status)
  }


  GetCtClassStatus = (A7) => {
    fetch(AURL + "get_ctclass_by_cal_acc_to", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ "Value": A7 })
    })
      .then(response => response.json())
      .then(data => this.setState({ CTClassVals: data.CTClasses }))
      .catch(error => console.error("Error:", error));
  };

  Next = () => {
    this.props.activeStepUpdate(this.props.activeStep + 1)
    this.props.GlobalizeThirdPage(this.state)
  }


  GetToInitializeProject = () => {
    this.props.GlobalizeThirdPage(this.state)
    this.props.activeStepUpdate(this.props.activeStep - 1)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }


  handleKeyPress = (event) => {

    if (event.key === 'Escape') {
      event.preventDefault(); // Prevent the browser's default "Open File" action
      this.GetToInitializeProject();
    } else if (event.key === 'Enter') {
      this.Next()
    }
  };


  render() {
    return (
      <CSSTransition timeout={600} classNames="slide" in={this.state.ShouldShowForm} unmountOnExit>
        <Box className="H_100 jusitfy-content-center p-4" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
          <Box className="H_100 d-flex justify-content-between" sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h1 className="headingsForInitProject" style={{ color: 'white' }}>
              Current Transformer (CT) Configuration
            </h1>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '32px', justifyContent: 'center' }}>
              {/* CT Configuration Section (Left) */}
              <Box sx={{ width: { xs: '100%', md: '400px' }, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h5 className="bold" style={{ color: 'white' }}>CT Configuration</h5>
                {/* CT Name */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <Box sx={{ width: '150px', textAlign: 'right' }}>
                    <h5 className="text-light mb-0">CT Name</h5>
                  </Box>
                  <FormControl
                    variant="standard"
                    sx={{
                      width: '192px',
                      backgroundColor: this.state.RelayType === '' ? '#0a0a0a' : 'white',
                      borderRadius: 0,
                      padding: '4px 8px',
                      '& .MuiInput-underline:before': { borderBottom: 'none' },
                      '& .MuiInput-underline:after': { borderBottom: 'none' },
                      '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                    }}
                  >
                    <TextField
                      id="ct-name-textfield"
                      value={this.state.CTName}
                      onChange={(e) =>
                        this.setState({ CTName: e.target.value }, () => this.props.GlobalizeThirdPage(this.state))
                      }
                      variant="standard"
                      sx={{
                        '& .MuiInputBase-input': {
                          color: this.state.RelayType === '' ? '#444' : '#000',
                          fontSize: '14px',
                          padding: '8px 12px',
                          height: 'auto',
                        },
                        '& .MuiInput-underline:before': { borderBottom: 'none' },
                        '& .MuiInput-underline:after': { borderBottom: 'none' },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                      }}
                    />
                  </FormControl>
                  <Box sx={{ width: '50px', textAlign: 'left' }}>
                    <h5 className="text-light mb-0"></h5>
                  </Box>
                </Box>
                {/* CT Class */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <Box sx={{ width: '150px', textAlign: 'right' }}>
                    <h5 className="text-light mb-0">CT Class</h5>
                  </Box>
                  <FormControl
                    variant="standard"
                    sx={{
                      width: '192px',
                      backgroundColor: this.state.RelayType === '' ? '#0a0a0a' : 'white',
                      borderRadius: 0,
                      padding: '4px 8px',
                      '& .MuiInput-underline:before': { borderBottom: 'none' },
                      '& .MuiInput-underline:after': { borderBottom: 'none' },
                      '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                    }}
                  >
                    <Select
                      labelId="ct-class-select-label"
                      id="ct-class-select"
                      value={this.state.SelectedCtClass}
                      onChange={(e) =>
                        this.setState({ SelectedCtClass: e.target.value }, () =>
                          this.props.GlobalizeThirdPage(this.state)
                        )
                      }
                      sx={{
                        color: '#000',
                        fontSize: '14px',
                        paddingRight: '24px',
                        '& .MuiSelect-select': {
                          color: '#000',
                          fontSize: '14px',
                          padding: '8px 12px',
                          height: 'auto',
                          backgroundColor: this.state.RelayType === '' ? '#0a0a0a' : 'white',
                        },
                        '& .MuiInput-underline:before': { borderBottom: 'none' },
                        '& .MuiInput-underline:after': { borderBottom: 'none' },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                      }}
                      renderValue={(selected) =>
                        selected || <span style={{ color: '#444', opacity: 1 }}>Select CT Class</span>
                      }
                    >
                      {this.state.CTClassVals &&
                        this.state.CTClassVals.map((i) => (
                          <MenuItem key={i} value={i}>
                            {i}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  <Box sx={{ width: '50px', textAlign: 'left' }}>
                    <h5 className="text-light mb-0"></h5>
                  </Box>
                </Box>
                {/* CT Primary */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <Box sx={{ width: '150px', textAlign: 'right' }}>
                    <h5 className="text-light mb-0">CT Primary</h5>
                  </Box>
                  <FormControl
                    variant="standard"
                    sx={{
                      width: '192px',
                      backgroundColor: this.state.RelayType === '' ? '#0a0a0a' : 'white',
                      borderRadius: 0,
                      padding: '4px 8px',
                      '& .MuiInput-underline:before': { borderBottom: 'none' },
                      '& .MuiInput-underline:after': { borderBottom: 'none' },
                      '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                    }}
                  >
                    <TextField
                      id="ct-primary-textfield"
                      value={this.state.CTPrimary}
                      onChange={(e) =>
                        this.setState({ CTPrimary: e.target.value }, () => this.props.GlobalizeThirdPage(this.state))
                      }
                      variant="standard"
                      type="number"
                      sx={{
                        '& .MuiInputBase-input': {
                          color: this.state.RelayType === '' ? '#444' : '#000',
                          fontSize: '14px',
                          padding: '8px 12px',
                          height: 'auto',
                        },
                        '& .MuiInput-underline:before': { borderBottom: 'none' },
                        '& .MuiInput-underline:after': { borderBottom: 'none' },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                      }}
                    />
                  </FormControl>
                  <Box sx={{ width: '50px', textAlign: 'left' }}>
                    <h5 className="text-light mb-0">(A)</h5>
                  </Box>
                </Box>
                {/* CT Secondary */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <Box sx={{ width: '150px', textAlign: 'right' }}>
                    <h5 className="text-light mb-0">CT Secondary</h5>
                  </Box>
                  <FormControl
                    variant="standard"
                    sx={{
                      width: '192px',
                      backgroundColor: this.state.RelayType === '' ? '#0a0a0a' : 'white',
                      borderRadius: 0,
                      padding: '4px 8px',
                      '& .MuiInput-underline:before': { borderBottom: 'none' },
                      '& .MuiInput-underline:after': { borderBottom: 'none' },
                      '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                    }}
                  >
                    <TextField
                      id="ct-secondary-textfield"
                      value={this.state.CTSecondary}
                      onChange={(e) =>
                        this.setState({ CTSecondary: e.target.value }, () =>
                          this.props.GlobalizeThirdPage(this.state)
                        )
                      }
                      variant="standard"
                      type="number"
                      sx={{
                        '& .MuiInputBase-input': {
                          color: this.state.RelayType === '' ? '#444' : '#000',
                          fontSize: '14px',
                          padding: '8px 12px',
                          height: 'auto',
                        },
                        '& .MuiInput-underline:before': { borderBottom: 'none' },
                        '& .MuiInput-underline:after': { borderBottom: 'none' },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                      }}
                    />
                  </FormControl>
                  <Box sx={{ width: '50px', textAlign: 'left' }}>
                    <h5 className="text-light mb-0">(A)</h5>
                  </Box>
                </Box>
              </Box>
              {(this.state.SelectedCtClass === '5P/10P' || this.state.SelectedCtClass === '5PR/10PR' || this.state.SelectedCtClass === 'TPX' || this.state.SelectedCtClass === 'TPY' || this.state.SelectedCtClass === 'TPZ' || this.state.SelectedCtClass === 'TPS' || this.state.SelectedCtClass === 'PX' || this.state.SelectedCtClass === 'PXR' || this.state.SelectedCtClass === 'C' || this.state.SelectedCtClass === 'T' || this.state.SelectedCtClass === 'X') && (
                <>
                  <Box sx={{ width: { xs: '100%', md: '1px' }, backgroundColor: '#fff', opacity: 0.2 }} />
                  <Box sx={{ width: { xs: '100%', md: '400px' }, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Rated Accuracy Limit Factor */}
                    <CSSTransition
                      timeout={600}
                      classNames="slide"
                      in={['5P/10P', '5PR/10PR', 'TPX', 'TPY', 'TPZ', 'TPS'].includes(this.state.SelectedCtClass)}
                      mountOnEnter
                      unmountOnExit
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h6 className="bold" style={{ color: 'white' }}>Rated Accuracy Limit Factor</h6>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <Box sx={{ width: '150px', textAlign: 'right' }}>
                            <h5 className="text-light mb-0">ALF, K_SCC</h5>
                          </Box>
                          <FormControl
                            variant="standard"
                            sx={{
                              width: '192px',
                              backgroundColor: this.state.RelayType === '' ? '#0a0a0a' : 'white',
                              borderRadius: 0,
                              padding: '4px 8px',
                              '& .MuiInput-underline:before': { borderBottom: 'none' },
                              '& .MuiInput-underline:after': { borderBottom: 'none' },
                              '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                            }}
                          >
                            <TextField
                              id="alf-k-scc-textfield"
                              value={this.state.ALF_K_SCC}
                              onChange={(e) =>
                                this.setState({ ALF_K_SCC: e.target.value }, () =>
                                  this.props.GlobalizeThirdPage(this.state)
                                )
                              }
                              variant="standard"
                              type="number"
                              sx={{
                                '& .MuiInputBase-input': {
                                  color: this.state.RelayType === '' ? '#444' : '#000',
                                  fontSize: '14px',
                                  padding: '8px 12px',
                                  height: 'auto',
                                },
                                '& .MuiInput-underline:before': { borderBottom: 'none' },
                                '& .MuiInput-underline:after': { borderBottom: 'none' },
                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                              }}
                            />
                          </FormControl>
                          <Box sx={{ width: '50px', textAlign: 'left' }}>
                            <h5 className="text-light mb-0"></h5>
                          </Box>
                        </Box>
                      </Box>
                    </CSSTransition>
                    {/* Transient Dimension Factor */}
                    <CSSTransition
                      timeout={600}
                      classNames="slide"
                      in={['TPX', 'TPY', 'TPZ', 'TPS'].includes(this.state.SelectedCtClass)}
                      mountOnEnter
                      unmountOnExit
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h6 className="bold" style={{ color: 'white' }}>Transient Dimension Factor</h6>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <Box sx={{ width: '150px', textAlign: 'right' }}>
                            <h5 className="text-light mb-0">Ktd</h5>
                          </Box>
                          <FormControl
                            variant="standard"
                            sx={{
                              width: '192px',
                              backgroundColor: this.state.RelayType === '' ? '#0a0a0a' : 'white',
                              borderRadius: 0,
                              padding: '4px 8px',
                              '& .MuiInput-underline:before': { borderBottom: 'none' },
                              '& .MuiInput-underline:after': { borderBottom: 'none' },
                              '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                            }}
                          >
                            <TextField
                              id="ktd-textfield"
                              value={this.state.KTD}
                              onChange={(e) =>
                                this.setState({ KTD: e.target.value }, () => this.props.GlobalizeThirdPage(this.state))
                              }
                              variant="standard"
                              type="number"
                              sx={{
                                '& .MuiInputBase-input': {
                                  color: this.state.RelayType === '' ? '#444' : '#000',
                                  fontSize: '14px',
                                  padding: '8px 12px',
                                  height: 'auto',
                                },
                                '& .MuiInput-underline:before': { borderBottom: 'none' },
                                '& .MuiInput-underline:after': { borderBottom: 'none' },
                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                              }}
                            />
                          </FormControl>
                          <Box sx={{ width: '50px', textAlign: 'left' }}>
                            <h5 className="text-light mb-0"></h5>
                          </Box>
                        </Box>
                      </Box>
                    </CSSTransition>
                    {/* Rated Accuracy Burden */}
                    <CSSTransition
                      timeout={600}
                      classNames="slide"
                      in={['5P/10P', '5PR/10PR', 'TPZ', 'TPS'].includes(this.state.SelectedCtClass)}
                      mountOnEnter
                      unmountOnExit
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h6 className="bold" style={{ color: 'white' }}>Rated Accuracy Burden</h6>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <Box sx={{ width: '150px', textAlign: 'right' }}>
                            <h5 className="text-light mb-0">Sr</h5>
                          </Box>
                          <FormControl
                            variant="standard"
                            sx={{
                              width: '192px',
                              backgroundColor: this.state.RelayType === '' ? '#0a0a0a' : 'white',
                              borderRadius: 0,
                              padding: '4px 8px',
                              '& .MuiInput-underline:before': { borderBottom: 'none' },
                              '& .MuiInput-underline:after': { borderBottom: 'none' },
                              '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                            }}
                          >
                            <TextField
                              id="sr-textfield"
                              value={this.state.Sr}
                              onChange={(e) =>
                                this.setState({ Sr: e.target.value }, () => this.props.GlobalizeThirdPage(this.state))
                              }
                              variant="standard"
                              type="number"
                              sx={{
                                '& .MuiInputBase-input': {
                                  color: this.state.RelayType === '' ? '#444' : '#000',
                                  fontSize: '14px',
                                  padding: '8px 12px',
                                  height: 'auto',
                                },
                                '& .MuiInput-underline:before': { borderBottom: 'none' },
                                '& .MuiInput-underline:after': { borderBottom: 'none' },
                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                              }}
                            />
                          </FormControl>
                          <Box sx={{ width: '50px', textAlign: 'left' }}>
                            <h5 className="text-light mb-0">(VA)</h5>
                          </Box>
                        </Box>
                      </Box>
                    </CSSTransition>
                    {/* Rr */}
                    <CSSTransition
                      timeout={600}
                      classNames="slide"
                      in={['TPX', 'TPY', 'TPZ', 'TPS'].includes(this.state.SelectedCtClass)}
                      mountOnEnter
                      unmountOnExit
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Box sx={{ width: '150px', textAlign: 'right' }}>
                          <h5 className="text-light mb-0">Rr</h5>
                        </Box>
                        <FormControl
                          variant="standard"
                          sx={{
                            width: '192px',
                            backgroundColor: this.state.RelayType === '' ? '#0a0a0a' : 'white',
                            borderRadius: 0,
                            padding: '4px 8px',
                            '& .MuiInput-underline:before': { borderBottom: 'none' },
                            '& .MuiInput-underline:after': { borderBottom: 'none' },
                            '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                          }}
                        >
                          <TextField
                            id="rr-textfield"
                            value={this.state.Rr}
                            onChange={(e) =>
                              this.setState({ Rr: e.target.value }, () => this.props.GlobalizeThirdPage(this.state))
                            }
                            variant="standard"
                            type="number"
                            sx={{
                              '& .MuiInputBase-input': {
                                color: this.state.RelayType === '' ? '#444' : '#000',
                                fontSize: '14px',
                                padding: '8px 12px',
                                height: 'auto',
                              },
                              '& .MuiInput-underline:before': { borderBottom: 'none' },
                              '& .MuiInput-underline:after': { borderBottom: 'none' },
                              '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                            }}
                          />
                        </FormControl>
                        <Box sx={{ width: '50px', textAlign: 'left' }}>
                          <h5 className="text-light mb-0">(ohm)</h5>
                        </Box>
                      </Box>
                    </CSSTransition>
                    {/* CT Resistance */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <h6 className="bold" style={{ color: 'white' }}>CT Resistance</h6>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Box sx={{ width: '150px', textAlign: 'right' }}>
                          <h5 className="text-light mb-0">CT Resistance @ 75°C</h5>
                        </Box>
                        <FormControl
                          variant="standard"
                          sx={{
                            width: '192px',
                            backgroundColor: this.state.RelayType === '' ? '#0a0a0a' : 'white',
                            borderRadius: 0,
                            padding: '4px 8px',
                            '& .MuiInput-underline:before': { borderBottom: 'none' },
                            '& .MuiInput-underline:after': { borderBottom: 'none' },
                            '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                          }}
                        >
                          <TextField
                            id="ct-resistance-textfield"
                            value={this.state.CTResistance}
                            onChange={(e) =>
                              this.setState({ CTResistance: e.target.value }, () =>
                                this.props.GlobalizeThirdPage(this.state)
                              )
                            }
                            variant="standard"
                            type="number"
                            sx={{
                              '& .MuiInputBase-input': {
                                color: this.state.RelayType === '' ? '#444' : '#000',
                                fontSize: '14px',
                                padding: '8px 12px',
                                height: 'auto',
                              },
                              '& .MuiInput-underline:before': { borderBottom: 'none' },
                              '& .MuiInput-underline:after': { borderBottom: 'none' },
                              '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                            }}
                          />
                        </FormControl>
                        <Box sx={{ width: '50px', textAlign: 'left' }}>
                          <h5 className="text-light mb-0">(ohm)</h5>
                        </Box>
                      </Box>
                    </Box>
                    {/* Rated Knee Point EMF */}
                    <CSSTransition
                      timeout={600}
                      classNames="slide"
                      in={['PX', 'PXR'].includes(this.state.SelectedCtClass)}
                      mountOnEnter
                      unmountOnExit
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h6 className="bold" style={{ color: 'white' }}>Rated Knee Point EMF (Ek)</h6>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <Box sx={{ width: '150px', textAlign: 'right' }}>
                            <h5 className="text-light mb-0">EK</h5>
                          </Box>
                          <FormControl
                            variant="standard"
                            sx={{
                              width: '192px',
                              backgroundColor: this.state.RelayType === '' ? '#0a0a0a' : 'white',
                              borderRadius: 0,
                              padding: '4px 8px',
                              '& .MuiInput-underline:before': { borderBottom: 'none' },
                              '& .MuiInput-underline:after': { borderBottom: 'none' },
                              '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                            }}
                          >
                            <TextField
                              id="ek-textfield"
                              value={this.state.EK}
                              onChange={(e) =>
                                this.setState({ EK: e.target.value }, () => this.props.GlobalizeThirdPage(this.state))
                              }
                              variant="standard"
                              type="number"
                              sx={{
                                '& .MuiInputBase-input': {
                                  color: this.state.RelayType === '' ? '#444' : '#000',
                                  fontSize: '14px',
                                  padding: '8px 12px',
                                  height: 'auto',
                                },
                                '& .MuiInput-underline:before': { borderBottom: 'none' },
                                '& .MuiInput-underline:after': { borderBottom: 'none' },
                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                              }}
                            />
                          </FormControl>
                          <Box sx={{ width: '50px', textAlign: 'left' }}>
                            <h5 className="text-light mb-0">(V)</h5>
                          </Box>
                        </Box>
                      </Box>
                    </CSSTransition>
                    {/* Exciting at Ek (Ie) */}
                    <CSSTransition
                      timeout={600}
                      classNames="slide"
                      in={['PX', 'PXR'].includes(this.state.SelectedCtClass)}
                      mountOnEnter
                      unmountOnExit
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h6 className="bold" style={{ color: 'white' }}>Exciting at Ek (Ie)</h6>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <Box sx={{ width: '150px', textAlign: 'right' }}>
                            <h5 className="text-light mb-0">Ie</h5>
                          </Box>
                          <FormControl
                            variant="standard"
                            sx={{
                              width: '192px',
                              backgroundColor: this.state.RelayType === '' ? '#0a0a0a' : 'white',
                              borderRadius: 0,
                              padding: '4px 8px',
                              '& .MuiInput-underline:before': { borderBottom: 'none' },
                              '& .MuiInput-underline:after': { borderBottom: 'none' },
                              '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                            }}
                          >
                            <TextField
                              id="ie-textfield"
                              value={this.state.Ie}
                              onChange={(e) =>
                                this.setState({ Ie: e.target.value }, () => this.props.GlobalizeThirdPage(this.state))
                              }
                              variant="standard"
                              type="number"
                              sx={{
                                '& .MuiInputBase-input': {
                                  color: this.state.RelayType === '' ? '#444' : '#000',
                                  fontSize: '14px',
                                  padding: '8px 12px',
                                  height: 'auto',
                                },
                                '& .MuiInput-underline:before': { borderBottom: 'none' },
                                '& .MuiInput-underline:after': { borderBottom: 'none' },
                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                              }}
                            />
                          </FormControl>
                          <Box sx={{ width: '50px', textAlign: 'left' }}>
                            <h5 className="text-light mb-0">(A)</h5>
                          </Box>
                        </Box>
                      </Box>
                    </CSSTransition>
                    {/* Terminal Voltage (ANSI C/T) (Vt) */}
                    <CSSTransition
                      timeout={600}
                      classNames="slide"
                      in={['C', 'T'].includes(this.state.SelectedCtClass)}
                      mountOnEnter
                      unmountOnExit
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h6 className="bold" style={{ color: 'white' }}>Terminal Voltage (ANSI C/T) (Vt)</h6>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <Box sx={{ width: '150px', textAlign: 'right' }}>
                            <h5 className="text-light mb-0">Vt</h5>
                          </Box>
                          <FormControl
                            variant="standard"
                            sx={{
                              width: '192px',
                              backgroundColor: this.state.RelayType === '' ? '#0a0a0a' : 'white',
                              borderRadius: 0,
                              padding: '4px 8px',
                              '& .MuiInput-underline:before': { borderBottom: 'none' },
                              '& .MuiInput-underline:after': { borderBottom: 'none' },
                              '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                            }}
                          >
                            <TextField
                              id="vt-textfield"
                              value={this.state.Vt}
                              onChange={(e) =>
                                this.setState({ Vt: e.target.value }, () => this.props.GlobalizeThirdPage(this.state))
                              }
                              variant="standard"
                              type="number"
                              sx={{
                                '& .MuiInputBase-input': {
                                  color: this.state.RelayType === '' ? '#444' : '#000',
                                  fontSize: '14px',
                                  padding: '8px 12px',
                                  height: 'auto',
                                },
                                '& .MuiInput-underline:before': { borderBottom: 'none' },
                                '& .MuiInput-underline:after': { borderBottom: 'none' },
                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                              }}
                            />
                          </FormControl>
                          <Box sx={{ width: '50px', textAlign: 'left' }}>
                            <h5 className="text-light mb-0">(V)</h5>
                          </Box>
                        </Box>
                      </Box>
                    </CSSTransition>
                    {/* Knee Point Voltage (ANSI-X) (Vk) */}
                    <CSSTransition
                      timeout={600}
                      classNames="slide"
                      in={['X'].includes(this.state.SelectedCtClass)}
                      mountOnEnter
                      unmountOnExit
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h6 className="bold" style={{ color: 'white' }}>Knee Point Voltage (ANSI-X) (Vk)</h6>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <Box sx={{ width: '150px', textAlign: 'right' }}>
                            <h5 className="text-light mb-0">Vk</h5>
                          </Box>
                          <FormControl
                            variant="standard"
                            sx={{
                              width: '192px',
                              backgroundColor: this.state.RelayType === '' ? '#0a0a0a' : 'white',
                              borderRadius: 0,
                              padding: '4px 8px',
                              '& .MuiInput-underline:before': { borderBottom: 'none' },
                              '& .MuiInput-underline:after': { borderBottom: 'none' },
                              '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                            }}
                          >
                            <TextField
                              id="vk-textfield"
                              value={this.state.Vk}
                              onChange={(e) =>
                                this.setState({ Vk: e.target.value }, () => this.props.GlobalizeThirdPage(this.state))
                              }
                              variant="standard"
                              type="number"
                              sx={{
                                '& .MuiInputBase-input': {
                                  color: this.state.RelayType === '' ? '#444' : '#000',
                                  fontSize: '14px',
                                  padding: '8px 12px',
                                  height: 'auto',
                                },
                                '& .MuiInput-underline:before': { borderBottom: 'none' },
                                '& .MuiInput-underline:after': { borderBottom: 'none' },
                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                              }}
                            />
                          </FormControl>
                          <Box sx={{ width: '50px', textAlign: 'left' }}>
                            <h5 className="text-light mb-0">(V)</h5>
                          </Box>
                        </Box>
                      </Box>
                    </CSSTransition>
                    {/* Exciting current at Vk (Ik) */}
                    <CSSTransition
                      timeout={600}
                      classNames="slide"
                      in={['X'].includes(this.state.SelectedCtClass)}
                      mountOnEnter
                      unmountOnExit
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h6 className="bold" style={{ color: 'white' }}>Exciting current at Vk (Ik)</h6>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <Box sx={{ width: '150px', textAlign: 'right' }}>
                            <h5 className="text-light mb-0">Ik</h5>
                          </Box>
                          <FormControl
                            variant="standard"
                            sx={{
                              width: '192px',
                              backgroundColor: this.state.RelayType === '' ? '#0a0a0a' : 'white',
                              borderRadius: 0,
                              padding: '4px 8px',
                              '& .MuiInput-underline:before': { borderBottom: 'none' },
                              '& .MuiInput-underline:after': { borderBottom: 'none' },
                              '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                            }}
                          >
                            <TextField
                              id="ik-textfield"
                              value={this.state.Ik}
                              onChange={(e) =>
                                this.setState({ Ik: e.target.value }, () => this.props.GlobalizeThirdPage(this.state))
                              }
                              variant="standard"
                              type="number"
                              sx={{
                                '& .MuiInputBase-input': {
                                  color: this.state.RelayType === '' ? '#444' : '#000',
                                  fontSize: '14px',
                                  padding: '8px 12px',
                                  height: 'auto',
                                },
                                '& .MuiInput-underline:before': { borderBottom: 'none' },
                                '& .MuiInput-underline:after': { borderBottom: 'none' },
                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                              }}
                            />
                          </FormControl>
                          <Box sx={{ width: '50px', textAlign: 'left' }}>
                            <h5 className="text-light mb-0">(A)</h5>
                          </Box>
                        </Box>
                      </Box>
                    </CSSTransition>
                  </Box>
                </>
              )}
            </Box>
            <Box sx={{ width: '100%', display: 'flex', mt: 4 }}>
              <Box className="col-12 justify-content-between" sx={{ display: 'flex', gap: '16px' }}>
                <Button className="NXT_Btn" onClick={this.GetToInitializeProject}>
                  Back
                </Button>
                <Button className="NXT_Btn" onClick={() => this.Next()}>
                  Next
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
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
  activeStepUpdate: (value) => dispatch({ type: 'UPDATE_PROGRESSBAR', value: value }),
  GlobalizeThirdPage: (data) => dispatch({ type: 'UPDATE_THIRD_PAGE', data: data })


});

export default connect(mapStateToProps, mapDispatchToProps)(CtSelection)



