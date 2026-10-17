import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { connect } from 'react-redux';
import { AURL } from './App.jsx';

class CreateProjectActual extends Component {
  constructor(props) {
    super(props);
    const initialState = props.is_Edit && props.CurrentWorkSpace ? {
      Project: props.CurrentWorkSpace.Project || '',
      oldName: props.CurrentWorkSpace.Project || '',
      RefrenceNo: props.CurrentWorkSpace.RefrenceNo || '',
      Revision: props.CurrentWorkSpace.Revision || '',
      RemarkA: props.CurrentWorkSpace.RemarkA || '',
      Date: props.CurrentWorkSpace.Date || '',
      imgUrlClient: props.CurrentWorkSpace.imgUrlClient || null,
      imgUrlConsultant: props.CurrentWorkSpace.imgUrlConsultant || null,
      imgUrlContractor: props.CurrentWorkSpace.imgUrlContractor || null,
      clientName: props.CurrentWorkSpace.clientName || '',
      consultantName: props.CurrentWorkSpace.consultantName || '',
      contractorName: props.CurrentWorkSpace.contractorName || '',
      DocumentNumber: props.CurrentWorkSpace.DocumentNumber || '',
      rows: props.CurrentWorkSpace.rows || [
        { rev: '', date: '', prepared: '', checked: '', authorized: '', approved: '', issuedFor: '' },
      ],
      path: props.SelectedWorkSpacePath || '',
      isHovered: false,
      errors: {
        Project: '',
        general: '',
      },
    } : {
      Project: '',
      oldName: '',
      RefrenceNo: '',
      Revision: '',
      RemarkA: '',
      Date: '',
      imgUrlClient: null,
      imgUrlConsultant: null,
      imgUrlContractor: null,
      clientName: '',
      consultantName: '',
      contractorName: '',
      DocumentNumber: '',
      rows: [
        { rev: '', date: '', prepared: '', checked: '', authorized: '', approved: '', issuedFor: '' },
      ],
      path: props.SelectedWorkSpacePath || '',
      isHovered: false,
      errors: {
        Project: '',
        general: '',
      },
    };
    this.state = initialState;
  }

  getAllWorkSpaces = () => {
    fetch(AURL + "/list_workspaces")
      .then(r => r.json())
      .then(d => {
        this.props.SET_RECENT_WORKSPACES(d.workspaces);
        this.setState({ errors: { ...this.state.errors, general: '' } });
      })
      .catch(err => {
        console.error('Error fetching workspaces:', err);
        this.setState({ errors: { ...this.state.errors, general: `Failed to load recent workspaces: ${err.message}` } });
      });
  }

  handleLogoChange = (role, e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.setState({ errors: { ...this.state.errors, general: 'Please select an image file.' } });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      this.setState({ [`imgUrl${role}`]: reader.result, errors: { ...this.state.errors, general: '' } });
    };
    reader.onerror = () => {
      this.setState({ errors: { ...this.state.errors, general: 'Failed to read image file.' } });
    };
    reader.readAsDataURL(file);
  };

  handleAddRow = () => {
    this.setState(({ rows }) => ({
      rows: [...rows, { rev: '', date: '', prepared: '', checked: '', authorized: '', approved: '', issuedFor: '' }],
      errors: { ...this.state.errors, general: '' },
    }));
  };

  handleRowChange = (i, field, v) => {
    const rows = [...this.state.rows];
    rows[i][field] = v;
    this.setState({ rows, errors: { ...this.state.errors, general: '' } });
  };

  handleRemoveRow = (i) => {
    this.setState(({ rows }) => ({
      rows: rows.filter((_, idx) => idx !== i),
      errors: { ...this.state.errors, general: '' },
    }));
  };

  validateField = (field, value) => {
    if (field === 'Project Name' && !value.trim()) {
      return 'Project Name is required.';
    }
    return '';
  };

  validateAll = () => {
    const errors = {
      Project: this.validateField('Project Name', this.state.Project),
      general: '',
    };
    this.setState({ errors });
    return !errors.Project;
  };

  handleSave = () => {
    if (!this.validateAll()) {
      this.setState({ errors: { ...this.state.errors, general: 'Please provide a Project Name.' } });
      return;
    }
    const payload = {
      Project: this.state.Project,
      RefrenceNo: this.state.RefrenceNo,
      Revision: this.state.Revision,
      RemarkA: this.state.RemarkA,
      Date: this.state.Date,
      imgUrlClient: this.state.imgUrlClient,
      imgUrlConsultant: this.state.imgUrlConsultant,
      imgUrlContractor: this.state.imgUrlContractor,
      clientName: this.state.clientName,
      consultantName: this.state.consultantName,
      contractorName: this.state.contractorName,
      DocumentNumber: this.state.DocumentNumber,
      rows: this.state.rows,
      path: this.state.path,
    };
    this.props.onSave(payload);
    if (this.props.is_Edit) {
      // Check if path is available; if not, prompt for directory
      if (!this.state.path) {
        this.selectDirectory();
        return;
      }
      const FolderPath = this.state.path;
      this.BuildNewWorkSpace(FolderPath);
    } else {
      this.selectDirectory();
    }
  };

  fetchFileTree = async (dir = "C:\\Users\\mthzi\\OneDrive\\Desktop\\New folder (2)\\hello") => {
    try {
      console.log("dirdirdirdirdir", dir);
      const response = await fetch(AURL + "filetree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dir: dir }),
      });
      if (!response.ok) throw new Error("Error fetching file tree");
      const data = await response.json();
      if (!data || Object.keys(data).length === 0) {
        throw new Error("No data found");
      }
      this.props.set_WORKSPACEVITALS({ ...this.props.workSpaceVitals, fileTree: data });
      this.props.selectWorkSpacePath(dir); // Update SelectedWorkSpacePath
      this.setState({ errors: { ...this.state.errors, general: '' } });
    } catch (error) {
      console.error("Error fetching file tree:", error);
      this.setState({ errors: { ...this.state.errors, general: `Failed to fetch file tree: ${error.message}` } });
    }
  };

  checkIfSelectedExists = (path) => {
    fetch(AURL + "f_workspace/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: path }),
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === 400) {
            return response.json().then(data => {
              throw new Error(`Bad Request: ${data.error}`);
            });
          } else if (response.status === 404) {
            return response.json().then(data => {
              throw new Error(`Not Found in fetch: ${data.error}`);
            });
          } else if (response.status === 500) {
            return response.json().then(data => {
              throw new Error(`Server Error: ${data.error}`);
            });
          } else {
            throw new Error(`Unexpected response: ${response.status}`);
          }
        }
        return response.json();
      })
      .then(data => {
        console.log("!!!!!!!!!!!! The data gained from checkIfSelectedExists", data);
        const directoryPath = path.substring(0, path.lastIndexOf('/'));
        this.fetchFileTree(directoryPath);
        this.props.setCurrentWorkSpace(JSON.parse(data.content));
        this.setState({ path: directoryPath, errors: { ...this.state.errors, general: '' } }); // Update path state
      })
      .catch(error => {
        this.setState({ errors: { ...this.state.errors, general: error.message } });
      });
  };

  BuildNewWorkSpace = (path) => {
    const url = this.props.is_Edit ? `${AURL}edit-workspace/` : `${AURL}create-workspace/`;
    const payload = this.props.is_Edit
      ? { name: this.state.Project, oldName: this.state.oldName, path, content: JSON.stringify(this.state) }
      : { name: this.state.Project, path, content: JSON.stringify(this.state) };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.isError) {
          this.setState({ errors: { ...this.state.errors, general: d.message || 'Unknown error' } });
        } else {
          this.props.openPopUp('Success!', d.message || 'Operation successful', 'Action', 'OK', this.props.onClose);
          if (this.props.is_Edit) {
            const cfg_pathName = path + '/' + this.state.Project + ".cfg";
            this.checkIfSelectedExists(cfg_pathName);
          } else {
            const directoryPath = path + '/' + this.state.Project;
            this.setState({ path: directoryPath }); // Update path state for future edits
            this.props.selectWorkSpacePath(directoryPath); // Update Redux state
            this.fetchFileTree(directoryPath);
            if (d.content) {
              try {
                this.props.setCurrentWorkSpace(JSON.parse(d.content));
              } catch (err) {
                console.error("Failed to parse workspace content:", err);
                this.setState({ errors: { ...this.state.errors, general: 'Failed to parse returned content.' } });
              }
            }
          }
        }
      })
      .catch((err) => {
        console.error('Error processing workspace:', err);
        this.setState({ errors: { ...this.state.errors, general: 'Failed to process workspace.' } });
      });
    this.props.onClose();
  };

  selectDirectory = () => {
    // Check if running in Electron environment
    const isElectron = !!(window.electron && window.electron.dialog);
    
    if (isElectron) {
      // Electron environment - use native dialog
      window.electron.dialog
        .showOpenDialog({ properties: ['openDirectory'] })
        .then((result) => {
          if (result.canceled || result.filePaths.length === 0) {
            this.setState({ errors: { ...this.state.errors, general: 'Directory selection canceled.' } });
            return;
          }
          const directoryPath = result.filePaths[0];
          this.setState({ path: directoryPath }, () => {
            this.BuildNewWorkSpace(directoryPath);
          });
          console.log('Selected folder path:', directoryPath);
        })
        .catch((err) => {
          console.error('Error selecting directory:', err);
          this.setState({ errors: { ...this.state.errors, general: 'Failed to select directory.' } });
        });
    } else {
      // Web environment - fallback to input field or predefined path
      const fallbackPath = prompt('Please enter the directory path where you want to create the project:', 'C:\\Projects');
      if (fallbackPath && fallbackPath.trim()) {
        this.setState({ path: fallbackPath.trim() }, () => {
          this.BuildNewWorkSpace(fallbackPath.trim());
        });
        console.log('Using fallback path:', fallbackPath);
      } else {
        this.setState({ errors: { ...this.state.errors, general: 'Directory path is required.' } });
      }
    }
  };

  handleChange = (field, value) => {
    this.setState({ [field]: value }, () => {
      if (field === 'Project') {
        this.setState((prevState) => ({
          errors: {
            ...prevState.errors,
            Project: this.validateField('Project Name', value),
            general: '',
          },
        }));
      } else {
        this.setState((prevState) => ({
          errors: { ...prevState.errors, general: '' },
        }));
      }
    });
  };

  render() {
    const { top, left, onClose } = this.props;
    const { imgUrlClient, imgUrlConsultant, imgUrlContractor, rows, Project, RefrenceNo, Revision, RemarkA, DocumentNumber, clientName, consultantName, contractorName, errors, Date } = this.state;
    const modalStyle = { top: `${top}px`, left: `${left}px` };

    return ReactDOM.createPortal(
      <div className="cpa-backdrop">
        <div className="cpa-modal" style={modalStyle}>
          <div className="cpa-header">
            <h2 className="cpa-title">{this.props.is_Edit ? 'Edit Project' : 'Create New Project'}</h2>
            <button className="cpa-close" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </button>
          </div>
          <div className="cpa-body">
            {errors.general && (
              <div className="cpa-error" style={{ color: 'red', marginBottom: '10px' }}>
                {errors.general}
              </div>
            )}
            <section className="cpa-section orgs">
              <h3 className="cpa-section-title">Organizations</h3>
              <div className="cpa-orgs">
                {['Client', 'Consultant', 'Contractor'].map((role) => (
                  <div key={role} className="cpa-card">
                    <h4 className="cpa-card-title">{role} Info</h4>
                    <div className="cpa-logo-preview">
                      {this.state[`imgUrl${role}`] ? (
                        <img src={this.state[`imgUrl${role}`]} alt={`${role} logo`} className="cpa-logo-img" />
                      ) : (
                        <div className="cpa-logo-placeholder">
                          <InsertPhotoIcon fontSize="large" />
                          <span>No Logo</span>
                        </div>
                      )}
                    </div>
                    <Button variant="contained" component="label" className="cpa-upload-btn">
                      Select Logo
                      <input hidden type="file" accept="image/*" onChange={(e) => this.handleLogoChange(role, e)} />
                    </Button>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label={`${role} Name`}
                      value={this.state[`${role.toLowerCase()}Name`]}
                      onChange={(e) => this.handleChange(`${role.toLowerCase()}Name`, e.target.value)}
                      className="cpa-textfield"
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="cpa-section proj-data">
              <h3 className="cpa-section-title">Project Data</h3>
              <div className="cpa-project-data">
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Project Name"
                  value={Project}
                  onChange={(e) => this.handleChange('Project', e.target.value)}
                  className="cpa-textfield"
                  error={!!errors.Project}
                  helperText={errors.Project}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Reference Number"
                  value={RefrenceNo}
                  onChange={(e) => this.handleChange('RefrenceNo', e.target.value)}
                  className="cpa-textfield"
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Document Number"
                  value={DocumentNumber}
                  onChange={(e) => this.handleChange('DocumentNumber', e.target.value)}
                  className="cpa-textfield"
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Revision"
                  value={Revision}
                  onChange={(e) => this.handleChange('Revision', e.target.value)}
                  className="cpa-textfield"
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Remark"
                  multiline
                  rows={3}
                  value={RemarkA}
                  onChange={(e) => this.handleChange('RemarkA', e.target.value)}
                  className="cpa-textfield"
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Date"
                  value={Date}
                  onChange={(e) => this.handleChange('Date', e.target.value)}
                  className="cpa-textfield"
                />
              </div>
            </section>

            <section className="cpa-section table-sec">
              <h3 className="cpa-section-title">Revision History</h3>
              <TableContainer component={Paper} className="cpa-table-container">
                <Table size="small">
                  <TableHead>
                    <TableRow className="cpa-table-headrow">
                      {['Rev.', 'Date', 'Prepared', 'Checked', 'Authorized', 'Approved', 'Issued For', 'Action'].map(
                        (col) => (
                          <TableCell key={col}>{col}</TableCell>
                        )
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, i) => (
                      <TableRow key={i} className="cpa-table-row">
                        {['rev', 'date', 'prepared', 'checked', 'authorized', 'approved', 'issuedFor'].map((field) => (
                          <TableCell key={field}>
                            <TextField
                              value={row[field]}
                              onChange={(e) => this.handleRowChange(i, field, e.target.value)}
                              size="small"
                              variant="outlined"
                              className="cpa-table-input"
                            />
                          </TableCell>
                        ))}
                        <TableCell>
                          <IconButton onClick={() => this.handleRemoveRow(i)} className="cpa-delete-btn">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className="cpa-add-row">
                <Button variant="contained" onClick={this.handleAddRow} className="cpa-add-btn">
                  Add Row
                </Button>
              </div>
            </section>

            <div className="cpa-footer">
              <Button onClick={onClose} className="cpa-cancel-btn">
                Cancel
              </Button>
              <Button onClick={this.handleSave} className="cpa-save-btn">
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  }
}

const mapStateToProps = (state) => ({
  activeStep: state.example.activeStep,
  CurrentWorkSpace: state.example.CurrentWorkSpace,
  pathForCurrentlyOpenMeterCT: state.example.pathForCurrentlyOpenMeterCT,
  initializationFullScreen: state.example.initializationFullScreen,
  SelectedWorkSpacePath: state.example.SelectedWorkSpacePath,
  workSpaceVitals: state.example.workSpaceVitals,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentWorkSpace: data => dispatch({ type: 'SetCurrentWorkSpace', data }),
  selectWorkSpacePath: data => dispatch({ type: 'SetSelectedWorkSpacePath', data }),
  toggleMenu: () => dispatch({ type: 'TOGGLE_MENU' }),
  toggleMenuVT: (d) => dispatch({ type: 'SetNewVT', data: d }),
  toggleMenuCT: (d) => dispatch({ type: 'SetNewMeterCt', data: d }),
  setinitializationFullScreen: (d) => dispatch({ type: 'SetinitializationFullScreen', data: d }),
  openPopUp: (title, Message, mode, ActionMessage, action) =>
    dispatch({ type: 'OPEN_POPUP', Title: title, Message, mode, ActionMessage, action }),
  closePopUp: () => dispatch({ type: 'CLOSE_POPUP' }),
  activeStepUpdate: (value) => dispatch({ type: 'UPDATE_PROGRESSBAR', value }),
  GlobalizeFirstPage: (data) => dispatch({ type: 'UPDATE_FIRST_PAGE', data }),
  Clear: () => dispatch({ type: 'CLEAR_ALL_PAGES' }),
  toggleNewWorkSpace: (val) => dispatch({ type: 'setNewWorkSpace', value: val }),
  onSave: (payload) => dispatch({ type: 'SAVE_PROJECT', payload }),
  SET_RECENT_WORKSPACES: (d) => dispatch({ type: 'SET_RECENT_WORKSPACES', data: d }),
  set_WORKSPACEVITALS: (d) => dispatch({ type: 'SET_WORKSPACEVITALS', data: d }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateProjectActual);