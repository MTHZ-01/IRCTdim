




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

export class SystemInformation extends Component {

  state = {
    ShouldShowForm: false,
    Length: "",
    CrossSection: "",
    Material: "",
  }

  componentDidMount() {

    document.addEventListener('keydown', this.handleKeyPress);
    this.setState(this.props.ProjectData.FourthPage)


    if (this.props.activeStep == 2) {

      setTimeout(() => {
        this.setState({ ShouldShowForm: true });
      }, 100); // 1000ms = 1s
    }

  }

  Next = () => {
    this.props.GlobalizeFourthPage(this.state)
    this.props.activeStepUpdate(this.props.activeStep + 1)

  }


  GetToInitializeProject = () => {
    this.props.GlobalizeFourthPage(this.state)
    this.props.activeStepUpdate(this.props.activeStep - 1)
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
    return (
      <CSSTransition timeout={600} classNames="slide" in={this.state.ShouldShowForm} unmountOnExit>

        <div className='col-12 center FullScreenFix flex-column justify-content-start'>
          <div className='d-flex W90-p justify-content-between flex-column RelayConfCont '>

            <h1 className='col-12 headingsForInitProject'>{`System Information`}</h1>

            <div className='center'>




              <Box sx={{ minWidth: 430, width: 430 }}>
                <h6 className="bold" style={{ color: "white" }}>Cable properties:</h6>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', mt: 2 }}>
                  {/* Length Row */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Box sx={{ width: '120px', textAlign: 'right' }}>
                      <h5 className="text-light mb-0">Length</h5>
                    </Box>
                    <FormControl
                      variant="standard"
                      sx={{
                        width: '192px',
                        backgroundColor: this.state.RelayType === "" ? "#0a0a0a" : "white",
                        borderRadius: 0,
                        padding: "4px 8px",
                        "& .MuiInput-underline:before": { borderBottom: "none" },
                        "& .MuiInput-underline:after": { borderBottom: "none" },
                        "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                      }}
                    >
                      <TextField
                        id="length-textfield"
                        value={this.state.Length}
                        onChange={(e) => this.setState({ Length: e.target.value }, () => this.props.GlobalizeFourthPage(this.state))}
                        variant="standard"
                        type="number"
                        sx={{
                          "& .MuiInputBase-input": {
                            color: this.state.RelayType === "" ? "#444" : "#000",
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
                    <Box sx={{ width: '50px', textAlign: 'left' }}>
                      <h5 className="text-light mb-0">(m)</h5>
                    </Box>
                  </Box>

                  {/* Cross Section Row */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Box sx={{ width: '120px', textAlign: 'right' }}>
                      <h5 className="text-light mb-0">Cross Section</h5>
                    </Box>
                    <FormControl
                      variant="standard"
                      sx={{
                        width: '192px',
                        backgroundColor: this.state.RelayType === "" ? "#0a0a0a" : "white",
                        borderRadius: 0,
                        padding: "4px 8px",
                        "& .MuiInput-underline:before": { borderBottom: "none" },
                        "& .MuiInput-underline:after": { borderBottom: "none" },
                        "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                      }}
                    >
                      <TextField
                        id="cross-section-textfield"
                        value={this.state.CrossSection}
                        onChange={(e) => this.setState({ CrossSection: e.target.value }, () => this.props.GlobalizeFourthPage(this.state))}
                        variant="standard"
                        type="number"
                        sx={{
                          "& .MuiInputBase-input": {
                            color: this.state.RelayType === "" ? "#444" : "#000",
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
                    <Box sx={{ width: '50px', textAlign: 'left' }}>
                      <h5 className="text-light mb-0">(mm²)</h5>
                    </Box>
                  </Box>

                  {/* Material Row */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Box sx={{ width: '120px', textAlign: 'right' }}>
                      <h5 className="text-light mb-0">Material</h5>
                    </Box>
                    <FormControl
                      variant="standard"
                      sx={{
                        width: '192px',
                        backgroundColor: this.state.RelayType === "" ? "#0a0a0a" : "white",
                        borderRadius: 0,
                        padding: "4px 8px",
                        "& .MuiInput-underline:before": { borderBottom: "none" },
                        "& .MuiInput-underline:after": { borderBottom: "none" },
                        "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                      }}
                    >
                      <Select
                        labelId="material-select-label"
                        id="material-textfield"
                        value={this.state.Material}
                        onChange={(e) => this.setState({ Material: e.target.value }, () => this.props.GlobalizeFourthPage(this.state))}
                        sx={{
                          color: "#000",
                          fontSize: "14px",
                          paddingRight: "24px",
                          "& .MuiSelect-select": {
                            color: "#000",
                            fontSize: "14px",
                            padding: "8px 12px",
                            height: "auto",
                            backgroundColor: this.state.RelayType === "" ? "#0a0a0a" : "white",
                          },
                          "& .MuiInput-underline:before": { borderBottom: "none" },
                          "& .MuiInput-underline:after": { borderBottom: "none" },
                          "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                        }}
                        renderValue={(selected) => selected || <span style={{ color: "#444", opacity: 1 }}>Select Material</span>}
                      >
                        <MenuItem value="Al">Al</MenuItem>
                        <MenuItem value="Cu">Cu</MenuItem>
                      </Select>
                    </FormControl>
                    <Box sx={{ width: '50px', textAlign: 'left' }}>
                      <h5 className="text-light mb-0"></h5>
                    </Box>
                  </Box>
                </Box>
              </Box>

            </div>


            <div className='w-100'>
              <div className='d-flex justify-content-between align-items-between flex-row col-12'>

                <Button className='NXT_Btn' onClick={this.GetToInitializeProject}>Back</Button>                <Button className='NXT_Btn' onClick={() => this.Next()}>Next</Button>
              </div>
            </div>

          </div>


        </div>
      </CSSTransition >
    )
  }
}

const mapStateToProps = (state) => ({
  isMenuOpen: state.example.isMenuOpen,
  activeStep: state.example.activeStep,
  ProjectData: state.example.Project,
  initializationFullScreen: state.example.initializationFullScreen
});
// UPDATE_FOURTH_PAGE

const mapDispatchToProps = (dispatch) => ({
  activeStepUpdate: (value) => dispatch({ type: 'UPDATE_PROGRESSBAR', value: value }),
  GlobalizeFourthPage: (data) => dispatch({ type: 'UPDATE_FOURTH_PAGE', data: data })


});

export default connect(mapStateToProps, mapDispatchToProps)(SystemInformation)