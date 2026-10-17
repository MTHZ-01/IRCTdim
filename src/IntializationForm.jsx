import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { TextareaAutosize } from '@mui/material';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Box from '@mui/material/Box';
import { Fragment } from 'react';
import PdfComponent from './PdfComponent.jsx';
import ProgressBar from './ProgressBar.jsx';
import RelayConf from './RelayConf.jsx';
import CtSelection from './CtSelection.jsx';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import MeterCt from './MeterCt.jsx';
import VT from './VT.jsx';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper,
  IconButton,
} from '@mui/material';
import SystemInformation from './SystemInformation.jsx';
import DeleteIcon from '@mui/icons-material/Delete';
import ValidateComponent from './ValidateComponent.jsx';
import MinimizeIcon from '@mui/icons-material/Minimize';
import SaveIcon from '@mui/icons-material/Save';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { AURL } from './App.jsx';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

// Create the RTL cache with stylis plugins
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// Define the theme with RTL direction
const theme = createTheme({
  direction: 'rtl',
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: '#212121', // Dark gray for headers
  color: '#fff', // White text
  fontWeight: 'bold',
  fontSize: '0.875rem', // Slightly smaller text for compact look
  padding: '6px 12px', // Compact padding for smaller width
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#f5f5f5', // Light gray for odd rows
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#fff', // White for even rows
  },
  '&:hover': {
    backgroundColor: '#e0e0e0', // Light hover effect for a sleek interaction
  },
}));

export class IntializationForm extends Component {
  constructor(props) {
    super(props);
    this.divRef = React.createRef(); // Create a reference for the div
  }

  state = {
    ShouldShowForm: false,
    ShowPDFGen: false,
    open: false, // Controls visibility of alert
    isActive: true,
    Project: "",
    RefrenceNo: "",
    Revision: "",
    RemarkA: "",
    Date: "",
    imgUrlClient: null,
    imgUrlConsultant: null,
    imgUrlContractor: null,
    clientName: "",
    consultantName: "",
    contractorName: "",
    isHovered: false,
    DocumentNumber: "",
    rows: [
      { rev: '', date: '', prepared: '', checked: '', authorized: '', approved: '', issuedFor: '' },
    ],
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleMouseEnter = () => {
    this.setState({ isHovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ isHovered: false });
  };

  handleClickOutside = (event) => {
    if (this.divRef.current && !this.divRef.current.contains(event.target)) {
      this.setState({ isActive: false });
      document.removeEventListener('keydown', this.handleKeyPress);
      document.removeEventListener("mousedown", this.handleClickOutside);
    }
  };

  handleClickInside = () => {
    this.setState({ isActive: true });
    document.addEventListener("mousedown", this.handleClickOutside);
    document.addEventListener('keydown', this.handleKeyPress);
  };

  GetToRelayConfig = () => {
    if (this.props.activeStep === 0) {
      this.setState({ ShouldShowForm: false });
    }
  };

  handleCreateNewWorkSpace = () => {
    fetch(AURL + "/create_workspace", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: this.state.path,
        name: this.state.Project,
        content: this.state,
      }),
    })
      .then(response => response.json())
      .then(data => (data))
      .catch(error => console.error('Error:', error));
  };

  generateFile = () => {
    console.log(this.props.ProjectData, "! ! ! ! ! ! ! ! ! ! ! ");

    // Prepare project data
    const projectData = {
      Project: this.props.ProjectData.FirstPage?.Project || "NoName", // Project name
      ProjectData: this.props?.ProjectData || "NoName", // Other project data
    };

    // Convert data to JSON string
    const jsonData = JSON.stringify(projectData, null, 4);

    // Create a Blob for file download
    const blob = new Blob([jsonData], { type: "application/json" });

    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectData.Project}.IRCT`; // File name based on project
    document.body.appendChild(a);
    a.click();

    // Release URL and remove link from DOM
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };


  componentDidMount() {
    console.log("data data data data ", this.props.data);

    // FIX: Populate Redux ProjectData from props.data
    if (this.props.data && this.props.data.FirstPage) {
      this.props.updateProjectState(this.props.data);
    }

    document.addEventListener("mousedown", this.handleClickOutside);
    document.addEventListener('keydown', this.handleKeyPress);
    this.GetToRelayConfig();
    document.removeEventListener('keydown', this.handleKeyPress);
    document.removeEventListener("mousedown", this.handleClickOutside);

    if (this.props.activeStep === 0) {
      setTimeout(() => {
        this.setState({ ShouldShowForm: true });
      }, 400);
    }
  }

  componentDidUpdate(prevProps) {
    // Check if activeStep has changed and equals 0
    if (this.props.activeStep !== prevProps.activeStep && this.props.activeStep === 0) {
      this.setState({ ShouldShowForm: true });
    }

    // FIX: If data prop changed, update Redux ProjectData
    if (this.props.data !== prevProps.data && this.props.data) {
      this.props.updateProjectState(this.props.data);
    }
  }
  handleInputChange = (index, field, value) => {
    const newRows = [...this.state.rows];
    newRows[index][field] = value;
    this.setState({ rows: newRows });
  };

  handleAddRow = () => {
    this.setState((prevState) => ({
      rows: [...prevState.rows, { rev: '', date: '', prepared: '', checked: '', authorized: '', approved: '', issuedFor: '' }],
    }));
  };

  handleRemoveRow = (index) => {
    const newRows = this.state.rows.filter((_, i) => i !== index);
    this.setState({ rows: newRows });
  };

  handleKeyPress = (event) => {
    console.log("!!!");
    if (event.key === 'Escape') {
      event.preventDefault(); // Prevent the browser's default "Open File" action
      if (this.props.WorkSpace) {
        this.closeWorkSpace();
      }
      if (this.props.activeStep === 0) {
        this.props.toggleMenu();
      }
    } else if (event.key === "Enter" && !this.props.WorkSpace) {
      this.GetToRelayConfig();
    } else if (event.key === 'f') {
      this.props.setinitializationFullScreen(!this.props.initializationFullScreen);
    } else if (event.key.toLowerCase() === 's' && event.ctrlKey) {
      event.preventDefault(); // Prevent default browser save
      this.HandleSave();
      console.log("s that saved!");
    }
  };


  handlePDFGenInint = () => {
    this.setState({ ShouldShowForm: false });
    setTimeout(() => {
      this.setState({ ShowPDFGen: true });
    }, 720); // 1000ms = 1s
  };

  blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
  };

  grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
  };

  Textarea = styled(TextareaAutosize)(
    ({ theme }) => `
      box-sizing: border-box;
      width: 320px;
      font-family: 'IBM Plex Sans', sans-serif;
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.5;
      padding: 8px 12px;
      border-radius: 8px;
      color: ${theme.palette.mode === 'dark' ? this.grey[300] : this.grey[900]};
      background: ${theme.palette.mode === 'dark' ? this.grey[900] : '#fff'};
      border: 1px solid ${theme.palette.mode === 'dark' ? this.grey[700] : this.grey[200]};
      box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? this.grey[900] : this.grey[50]};

      &:hover {
        border-color: ${this.blue[400]};
      }

      &:focus {
        border-color: ${this.blue[400]};
        box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? this.blue[600] : this.blue[200]};
      }

      // firefox
      &:focus-visible {
        outline: 0;
      }
    `,
  );

  handleChange = (event) => {
    this.setState({ Mode: event.target.value });
  };

  updatePhoto = (e, mode) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      console.log("MODE MODE", mode);
      reader.onload = (event) => {
        if (mode === "client") {
          this.setState({ imgUrlClient: event.target.result }); // Set the image URL from the file
        } else if (mode === "consultant") {
          this.setState({ imgUrlConsultant: event.target.result }); // Set the image URL from the file
        } else {
          this.setState({ imgUrlContractor: event.target.result }); // Set the image URL from the file
        }
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
    document.removeEventListener("mousedown", this.handleClickOutside);
    this.props.Clear();
  }

  handleMinimizeApp = () => {
    this.props.toggleMenu();
    this.props.toggleMenuCT(false);
    this.props.toggleMenuVT(false);
  };

  closeWorkSpace = () => {
    this.props.toggleNewWorkSpace(false);
  };

  BuildNewWorkSpace = (path) => {
    fetch(AURL + "/create-workspace/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: this.state.Project, path: path, content: JSON.stringify(this.state) })
    })
      .then(r => r.json())
      .then(d => {
        console.log(d);
        if (d.isError) {
          this.props.openPopUp("Error!", d.message, "Action", "OK");
        } else {
          this.props.openPopUp("Success!", d.message, "Action", "OK", this.closeWorkSpace);
        }
      });
  };

  HandleSave = async () => {
    // Check if running in Electron environment
    const isElectron = !!(window.electron && window.electron.fs && window.electron.fs.writeFile);

    if (!isElectron) {
      console.warn('File save operation not available in web environment');
      alert('File save operation is only available in the desktop application.');
      return;
    }

    const Path = this.props.data.Path;
    if (!this.props.NewVT && !this.props.NewMeterCt && !this.props.WorkSpace) {
      const projectData = {
        Project: this.props.ProjectData.FirstPage?.Project || "NoName",
        ProjectData: this.props?.ProjectData || "NoName",
      };
      projectData.ProjectData.Path = Path;
      const Data = JSON.stringify(projectData);
      try {
        await window.electron.fs.writeFile(Path, Data);
        this.setState({ open: true });
      } catch (err) {
        console.error("Failed to save file:", err);
      }
    } else if (this.props.NewVT) {
      const Data = JSON.stringify(this.props.VT);
      try {
        await window.electron.fs.writeFile(Path, Data);
        this.setState({ open: true });
      } catch (err) {
        console.error("Failed to save file:", err);
      }
    } else if (this.props.NewMeterCt) {
      const Data = JSON.stringify(this.props.MeterCTInfo);
      try {
        await window.electron.fs.writeFile(Path, Data);
        this.setState({ open: true });
      } catch (err) {
        console.error("Failed to save file:", err);
      }
    }
  };

  HandleSaveAs = async () => {
    // Check if running in Electron environment
    const isElectron = !!(window.electron && window.electron.dialog && window.electron.fs);

    if (!isElectron) {
      console.warn('Save As operation not available in web environment');
      alert('Save As operation is only available in the desktop application.');
      return;
    }

    try {
      let filters = [];
      let Data;
      if (this.props.NewVT) {
        filters = [{ name: "IRVT Project", extensions: ["IRVT"] }];
        Data = JSON.stringify(this.props.VT);
      } else if (this.props.NewMeterCt) {
        filters = [{ name: "IRM Project", extensions: ["IRM"] }];
        Data = JSON.stringify(this.props.MeterCTInfo);
      } else if (this.props.WorkSpace) {
        filters = [{ name: "CFG Project", extensions: ["cfg"] }];
        Data = JSON.stringify(this.props.WorkSpace);
      } else {
        filters = [{ name: "IRCT Project", extensions: ["IRCT"] }];
        const projectData = {
          Project: this.props.ProjectData.FirstPage?.Project || "NoName",
          ProjectData: this.props?.ProjectData || "NoName",
        };
        Data = JSON.stringify(projectData);
      }
      const result = await window.electron.dialog.showSaveDialog({
        title: "Save As",
        defaultPath: "Project",
        filters,
      });
      if (!result.canceled && result.filePath) {
        await window.electron.fs.writeFile(result.filePath, Data);
        this.setState({ open: true });
      }
    } catch (err) {
      console.error("Failed to save as:", err);
    }
  };

  selectDirectory = () => {
    // Check if running in Electron environment
    const isElectron = !!(window.electron && window.electron.dialog);

    if (isElectron) {
      // Electron environment - use native dialog
      window.electron.dialog.showOpenDialog({
        properties: ['openDirectory']
      }).then(result => {
        if (!result.canceled && result.filePaths.length > 0) {
          const directoryPath = result.filePaths[0];
          this.setState({ path: directoryPath });
          this.BuildNewWorkSpace(directoryPath);
          console.log('Selected folder path:', directoryPath);
        }
      }).catch(err => {
        console.error('Error selecting directory:', err);
      });
    } else {
      // Web environment - fallback to input field
      const fallbackPath = prompt('Please enter the directory path where you want to create the workspace:', 'C:\\Projects');
      if (fallbackPath && fallbackPath.trim()) {
        const directoryPath = fallbackPath.trim();
        this.setState({ path: directoryPath });
        this.BuildNewWorkSpace(directoryPath);
        console.log('Using fallback path:', directoryPath);
      } else {
        console.log('Directory selection canceled or invalid.');
      }
    }
  };

  render() {
    const { isHovered, explorerWidth = 300 } = this.props; // Default to 300px if undefined
    return (
      <div
        className={`IntializationForm ${this.state.isActive ? "InitializationFormActive" : ""} ${this.props.initializationFullScreen && "initializationFS"}`}
        ref={this.divRef}
        onClick={this.handleClickInside}
        style={{ width: `calc(100% - ${explorerWidth}px)` }}
      >
        <Snackbar
          open={this.state.open}
          autoHideDuration={3000}
          onClose={this.handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            icon={<CheckIcon fontSize="inherit" />}
            onClose={this.handleClose}
            severity="success"
            sx={{
              bgcolor: "rgba(10, 25, 41, 0.9)", // dark blue
              color: "white",
              backdropFilter: "blur(8px)", // frosted glass look
              boxShadow: 3,
              borderRadius: 2,
              minWidth: "250px",
            }}
          >
            Saved successfully!
          </Alert>
        </Snackbar>

        <div className="col-12 p-1 ProjectNav"></div>
        <Button
          onClick={this.handleMinimizeApp}
          className={`windowsButton ${!this.state.isActive && "NavMinimizeDead"} NavMinimize`}
        >
          <MinimizeIcon className="minimizeIcon" />
        </Button>
        <Button
          onClick={() => this.props.setinitializationFullScreen(!this.props.initializationFullScreen)}
          className={`windowsButtonFS ${!this.state.isActive && "NavFSDead"} NavFS`}
        >
          <FullscreenIcon className="minimizeIcon" />
        </Button>
        <Button
          onClick={this.HandleSave}
          className={`windowsButton ${!this.state.isActive && "NavSaveDead"} NavSave`}
        >
          <SaveIcon className="SaveIcon" />
        </Button>
        <Button
          onClick={this.HandleSaveAs}
          className={`windowsButton ${!this.state.isActive && "NavSaveAsDead"} NavSaveAs`}
        >
          <SaveAsIcon className="SaveIcon" />
        </Button>

        {this.props.NewVT && <VT />}

        {this.props.NewMeterCt && <MeterCt />}

        {!this.props.NewMeterCt && (
          <Fragment>
            {!this.props.WorkSpace && !this.props.NewVT && (
              <Fragment>
                <div className="ProgressBar">
                  <ProgressBar />
                </div>
                {this.state.ShowPDFGen && (
                  <div className="pdfCompWrapper OverFlowYScroll">
                    <PdfComponent OutPort={false} data={this.state} />
                  </div>
                )}

                {this.props.activeStep === 0 && <RelayConf />}

                {this.props.activeStep === 1 && <CtSelection />}

                {this.props.activeStep === 2 && <SystemInformation />}

                {this.props.activeStep === 3 && (
                  <ValidateComponent generateFile={this.generateFile} />
                )}
              </Fragment>
            )}

            {this.props.WorkSpace && (
              <CSSTransition timeout={600} classNames="slide" in={this.state.ShouldShowForm} unmountOnExit>
                <div className="CustomerDataCollectorHead">
                  <h1 className="col-12 headingsForInitProject">Project and system data</h1>

                  <div style={{ padding: "10px", backgroundColor: 'rgb(31 31 31 / 73%)', borderRadius: '12px', width: "100%" }}>
                    <h3 style={{ color: '#fff', marginBottom: '16px' }}>Organizations</h3>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <div
                        style={{
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                          backgroundColor: '#2c2c2c',
                          padding: '16px',
                          flex: '1 1 300px'
                        }}
                      >
                        <h4 style={{ color: '#ccc', marginBottom: '12px' }}>Client Info</h4>
                        <TextField
                          value={this.state.clientName}
                          dir="rtl"
                          label="Client Corp Name"
                          variant="filled"
                          InputProps={{
                            style: { color: "gray", background: "rgb(78 78 78 / 19%)", height: '56px' },
                          }}
                          InputLabelProps={{ style: { color: "gray" } }}
                          sx={{
                            "& .MuiFilledInput-root": {
                              "&:hover": { backgroundColor: "rgb(90 90 90 / 30%)" },
                              "&.Mui-focused": { backgroundColor: "rgb(100 100 100 / 40%)" }
                            }
                          }}
                          onChange={e => this.setState({ clientName: e.target.value })}
                        />
                        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {this.state.imgUrlClient ? (
                            <img
                              style={{ width: '48px', height: '48px', borderRadius: '8px' }}
                              src={this.state.imgUrlClient}
                              alt="Client Logo"
                            />
                          ) : (
                            <img
                              src=""
                              alt="No client logo selected"
                              style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: '#444' }}
                            />
                          )}
                          <Button
                            variant="contained"
                            component="label"
                            sx={{
                              backgroundColor: "#1976d2",
                              color: "white",
                              fontWeight: "bold",
                              textTransform: "none",
                              padding: "8px 16px",
                              borderRadius: "8px",
                              "&:hover": { backgroundColor: "rgb(78 78 78 / 19%)" },
                            }}
                          >
                            Select Image
                            <input type="file" hidden onChange={(e) => this.updatePhoto(e, "client")} />
                          </Button>
                        </div>
                      </div>

                      <div
                        style={{
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                          backgroundColor: '#2c2c2c',
                          padding: '16px',
                          flex: '1 1 300px'
                        }}
                      >
                        <h4 style={{ color: '#ccc', marginBottom: '12px' }}>Consultant Info</h4>
                        <TextField
                          value={this.state.consultantName}
                          dir="rtl"
                          label="Consultant Corp Name"
                          variant="filled"
                          InputProps={{
                            style: { color: "gray", background: "rgb(78 78 78 / 19%)", height: '56px' },
                          }}
                          InputLabelProps={{ style: { color: "gray" } }}
                          sx={{
                            "& .MuiFilledInput-root": {
                              "&:hover": { backgroundColor: "rgb(90 90 90 / 30%)" },
                              "&.Mui-focused": { backgroundColor: "rgb(100 100 100 / 40%)" }
                            }
                          }}
                          onChange={e => this.setState({ consultantName: e.target.value })}
                        />
                        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {this.state.imgUrlConsultant ? (
                            <img
                              style={{ width: '48px', height: '48px', borderRadius: '8px' }}
                              src={this.state.imgUrlConsultant}
                              alt="Consultant Logo"
                            />
                          ) : (
                            <img
                              src=""
                              alt="No consultant logo selected"
                              style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: '#444' }}
                            />
                          )}
                          <Button
                            variant="contained"
                            component="label"
                            sx={{
                              backgroundColor: "#1976d2",
                              color: "white",
                              fontWeight: "bold",
                              textTransform: "none",
                              padding: "8px 16px",
                              borderRadius: "8px",
                              "&:hover": { backgroundColor: "#3a3f4b" },
                            }}
                          >
                            Select Image
                            <input type="file" hidden onChange={(e) => this.updatePhoto(e, "consultant")} />
                          </Button>
                        </div>
                      </div>

                      <div
                        style={{
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                          backgroundColor: '#2c2c2c',
                          padding: '16px',
                          flex: '1 1 300px'
                        }}
                      >
                        <h4 style={{ color: '#ccc', marginBottom: '12px' }}>Contractor Info</h4>
                        <TextField
                          value={this.state.contractorName}
                          dir="rtl"
                          label="Contractor Corp Name"
                          variant="filled"
                          InputProps={{
                            style: { color: "gray", background: "rgb(78 78 78 / 19%)", height: '56px' },
                          }}
                          InputLabelProps={{ style: { color: "gray" } }}
                          sx={{
                            "& .MuiFilledInput-root": {
                              "&:hover": { backgroundColor: "rgb(90 90 90 / 30%)" },
                              "&.Mui-focused": { backgroundColor: "rgb(100 100 100 / 40%)" }
                            }
                          }}
                          onChange={e => this.setState({ contractorName: e.target.value })}
                        />
                        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {this.state.imgUrlContractor ? (
                            <img
                              style={{ width: '48px', height: '48px', borderRadius: '8px' }}
                              src={this.state.imgUrlContractor}
                              alt="Contractor Logo"
                            />
                          ) : (
                            <img
                              src=""
                              alt="No contractor logo selected"
                              style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: '#444' }}
                            />
                          )}
                          <Button
                            variant="contained"
                            component="label"
                            sx={{
                              backgroundColor: "#1976d2",
                              color: "white",
                              fontWeight: "bold",
                              textTransform: "none",
                              padding: "8px 16px",
                              borderRadius: "8px",
                              "&:hover": { backgroundColor: "#3a3f4b" },
                            }}
                          >
                            Select Image
                            <input type="file" hidden onChange={(e) => this.updatePhoto(e, "Contractor")} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ color: '#fff', marginBottom: '16px' }}>Project Data</h3>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <TextField
                        variant="filled"
                        label="Project Name"
                        placeholder="Project Name"
                        value={this.state.Project}
                        onChange={e => this.setState({ Project: e.target.value })}
                        InputProps={{
                          style: {
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#fff',
                            height: '56px',
                            padding: '0 12px',
                            boxShadow: 'none' // Remove the underline or shadow
                          }
                        }}
                        InputLabelProps={{
                          style: { color: 'rgba(255,255,255,0.7)' }
                        }}
                        style={{ flex: '1 1 200px' }}
                      />
                      <TextField
                        variant="filled"
                        label="Document Number"
                        placeholder="Document Number"
                        value={this.state.DocumentNumber}
                        onChange={e => this.setState({ DocumentNumber: e.target.value })}
                        InputProps={{
                          style: {
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#fff',
                            height: '56px',
                            padding: '0 12px',
                            boxShadow: 'none' // Remove the underline or shadow
                          }
                        }}
                        InputLabelProps={{
                          style: { color: 'rgba(255,255,255,0.7)' }
                        }}
                        style={{ flex: '1 1 200px' }}
                      />
                      <TextField
                        variant="filled"
                        label="Revision"
                        placeholder="Revision"
                        value={this.state.Revision}
                        onChange={e => this.setState({ Revision: e.target.value })}
                        InputProps={{
                          style: {
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#fff',
                            height: '56px',
                            padding: '0 12px',
                            boxShadow: 'none' // Remove the underline or shadow
                          }
                        }}
                        InputLabelProps={{
                          style: { color: 'rgba(255,255,255,0.7)' }
                        }}
                        style={{ flex: '1 1 200px' }}
                      />
                      <this.Textarea
                        value={this.state.RemarkA}
                        className="Inputs"
                        onChange={e => this.setState({ RemarkA: e.target.value })}
                        aria-label="Author Remark"
                        minRows={3}
                        placeholder="Remark"
                      />
                    </div>
                  </div>

                  <div className="FormContentContainer">
                    <div className="InfoWrapper MinWidFitAva col-12 center">
                      <Box sx={{ width: '100%', margin: '0 auto' }}>
                        <TableContainer
                          component={Paper}
                          sx={{
                            backgroundColor: 'rgba(30,30,30,0.8)',
                            boxShadow: 'none',
                            borderRadius: '12px',
                          }}
                        >
                          <Table
                            aria-label="corporate-sexy-table"
                            size="small"
                            sx={{
                              borderCollapse: 'separate',
                              borderSpacing: 0,
                            }}
                          >
                            <TableHead>
                              <TableRow>
                                <StyledTableCell align="right" sx={{ border: 'none', color: '#f0f0f0' }}>
                                  Rev.
                                </StyledTableCell>
                                <StyledTableCell align="right" sx={{ border: 'none', color: '#f0f0f0' }}>
                                  Date
                                </StyledTableCell>
                                <StyledTableCell align="right" sx={{ border: 'none', color: '#f0f0f0' }}>
                                  Prepared
                                </StyledTableCell>
                                <StyledTableCell align="right" sx={{ border: 'none', color: '#f0f0f0' }}>
                                  Checked
                                </StyledTableCell>
                                <StyledTableCell align="right" sx={{ border: 'none', color: '#f0f0f0' }}>
                                  Authorized
                                </StyledTableCell>
                                <StyledTableCell align="right" sx={{ border: 'none', color: '#f0f0f0' }}>
                                  Approved
                                </StyledTableCell>
                                <StyledTableCell align="right" sx={{ border: 'none', color: '#f0f0f0' }}>
                                  Issued For
                                </StyledTableCell>
                                <StyledTableCell align="center" sx={{ border: 'none', color: '#f0f0f0' }}>
                                  Actions
                                </StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {this.state.rows.map((row, index) => (
                                <TableRow key={index} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.04)' } }}>
                                  <TableCell align="right" sx={{ border: 'none' }}>
                                    <TextField
                                      value={row.rev}
                                      onChange={(e) => this.handleInputChange(index, 'rev', e.target.value)}
                                      size="small"
                                      variant="standard"
                                      sx={{
                                        width: '80px',
                                        input: { color: '#f0f0f0' },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="right" sx={{ border: 'none' }}>
                                    <TextField
                                      value={row.date}
                                      onChange={(e) => this.handleInputChange(index, 'date', e.target.value)}
                                      size="small"
                                      variant="standard"
                                      sx={{
                                        width: '100px',
                                        input: { color: '#f0f0f0' },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="right" sx={{ border: 'none' }}>
                                    <TextField
                                      value={row.prepared}
                                      onChange={(e) => this.handleInputChange(index, 'prepared', e.target.value)}
                                      size="small"
                                      variant="standard"
                                      sx={{
                                        width: '100px',
                                        input: { color: '#f0f0f0' },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="right" sx={{ border: 'none' }}>
                                    <TextField
                                      value={row.checked}
                                      onChange={(e) => this.handleInputChange(index, 'checked', e.target.value)}
                                      size="small"
                                      variant="standard"
                                      sx={{
                                        width: '100px',
                                        input: { color: '#f0f0f0' },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="right" sx={{ border: 'none' }}>
                                    <TextField
                                      value={row.authorized}
                                      onChange={(e) => this.handleInputChange(index, 'authorized', e.target.value)}
                                      size="small"
                                      variant="standard"
                                      sx={{
                                        width: '100px',
                                        input: { color: '#f0f0f0' },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="right" sx={{ border: 'none' }}>
                                    <TextField
                                      value={row.approved}
                                      onChange={(e) => this.handleInputChange(index, 'approved', e.target.value)}
                                      size="small"
                                      variant="standard"
                                      sx={{
                                        width: '100px',
                                        input: { color: '#f0f0f0' },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="right" sx={{ border: 'none' }}>
                                    <TextField
                                      value={row.issuedFor}
                                      onChange={(e) => this.handleInputChange(index, 'issuedFor', e.target.value)}
                                      size="small"
                                      variant="standard"
                                      sx={{
                                        width: '100px',
                                        input: { color: '#f0f0f0' },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center" sx={{ border: 'none' }}>
                                    <IconButton
                                      onClick={() => this.handleRemoveRow(index)}
                                      aria-label="delete"
                                      sx={{ color: '#f44336' }}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>

                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                          <Button
                            variant="contained"
                            onClick={this.handleAddRow}
                            sx={{
                              backgroundColor: '#1976d2',
                              color: '#fff',
                              '&:hover': { backgroundColor: '#303f9f' },
                              borderRadius: '10px',
                              padding: '6px 20px',
                              fontWeight: 'bold',
                              fontSize: '0.875rem',
                              boxShadow: 'none',
                            }}
                          >
                            Add Row
                          </Button>
                        </Box>

                      </Box>

                      <div className="w-100">
                        <div className="d-flex justify-content-center align-items-between flex-row col-12">
                          <div style={{ margin: '16px', padding: '12px', minHeight: "114px", maxWidth: "118.67px" }}>
                            <div className={`workspace-name-container ${isHovered ? 'hovered' : ''}`}>
                              <div className={`workspace-name ${isHovered ? 'hovered' : ''}`}></div>
                            </div>
                            <Button
                              style={{
                                marginBottom: '10px',
                                padding: '14px',
                                fontWeight: '600',
                                fontSize: '16px',
                                color: "#1976d2",
                                fontWeight: "400",
                                background: 'transparent'
                              }}
                              className="SaveAsButton"
                              onClick={this.props.toggleMenu}
                            >
                              Cancel
                            </Button>
                          </div>

                          <div
                            onMouseEnter={this.handleMouseEnter}
                            onMouseLeave={this.handleMouseLeave}
                            style={{ margin: '16px', padding: '12px', minHeight: "114px", maxWidth: "118.67px" }}
                          >
                            <div className={`workspace-name-container ${isHovered ? 'hovered' : ''}`}>
                              <div className={`workspace-name ${isHovered ? 'hovered' : ''}`}>
                                {this.state.path ? this.state.path : 'No folder selected'}
                              </div>
                            </div>
                            <Button
                              variant="contained"
                              color="primary"
                              fullWidth
                              className="SaveAsButton"
                              onClick={this.selectDirectory}
                              style={{
                                marginBottom: '10px',
                                padding: '14px',
                                fontWeight: '600',
                                fontSize: '16px',
                                color: "#1976d2",
                                fontWeight: "400",
                                background: 'transparent'
                              }}
                            >
                              Save As
                            </Button>
                          </div>

                          {!this.props.WorkSpace && (
                            <Button className="NXT_Btn" onClick={() => this.GetToRelayConfig()}>
                              Next
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CSSTransition>
            )}
          </Fragment>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  activeStep: state.example.activeStep,
  ProjectData: state.example.Project,
  pathForCurrentlyOpenMeterCT: state.example.pathForCurrentlyOpenMeterCT,
  initializationFullScreen: state.example.initializationFullScreen,
  VT: state.example.VT,
  MeterCTInfo: state.example.MeterCTInfo,
  explorerWidth: state.example.explorerWidth || 300, // Map explorerWidth with default
});

const mapDispatchToProps = (dispatch) => ({
  toggleMenu: () => dispatch({ type: 'TOGGLE_MENU' }),
  toggleMenuVT: d => dispatch({ type: 'SetNewVT', data: d }),
  toggleMenuCT: d => dispatch({ type: 'SetNewMeterCt', d }),
  setinitializationFullScreen: d => dispatch({ type: 'SetinitializationFullScreen', data: d }),
  openPopUp: (title, Message, mode, ActionMessage, action) =>
    dispatch({ type: "OPEN_POPUP", Title: title, Message: Message, mode: mode, ActionMessage: ActionMessage, action: action }),
  closePopUp: () => dispatch({ type: "CLOSE_POPUP" }),
  activeStepUpdate: (value) => dispatch({ type: 'UPDATE_PROGRESSBAR', value: value }),
  GlobalizeFirstPage: (data) => dispatch({ type: 'UPDATE_FIRST_PAGE', data: data }),
  Clear: () => dispatch({ type: 'CLEAR_ALL_PAGES' }),
  toggleNewWorkSpace: val => dispatch({ type: "setNewWorkSpace", value: val }),
  updateProjectState: (p) => dispatch({ type: 'UPDATE_ALL_PAGES', Project: p }),
});

export default connect(mapStateToProps, mapDispatchToProps)(IntializationForm);