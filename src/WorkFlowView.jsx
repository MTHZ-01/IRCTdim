// WorkFlowView.jsx
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import WorkSpaceTree from './WorkSpaceTree.jsx';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { AURL } from './App.jsx';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { IconButton, Menu, MenuItem } from '@mui/material';
import WBackGround from "./Assets/WorkSpaceWallPaper.png";
import FinilizeWorkSpace from './FinilizeWorkSpace.jsx';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PictureAsPdfSharpIcon from '@mui/icons-material/PictureAsPdfSharp';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import CreateNewProject from './CreateNewProject.jsx';
import Modifyer from './Modifyer.jsx';
import CloseIcon from '@mui/icons-material/Close';

export class WorkFlowView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      fileTree: null,
      error: null,
      selectedDir: "",
      anchorEl: null,
      Wid: null,
      // NEW: loading states
      isLoadingWorkspace: false,
      workspaceLoadProgress: 0,
    };
  }

  handleMenuOpen = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

// Helper to add file data if not already present in AllFileData
addToAllFileDataIfMissing = (filePath, parsedContent, fileName) => {
  try {
    const existing = this.props.AllFileData || [];
    const normalizedPath = filePath.replace(/\\/g, '/').toLowerCase();
    
    // Check if file already exists in AllFileData by path only (unique identifier)
    const exists = existing.some(item => {
      try {
        const parsed = JSON.parse(item);
        if (!parsed) return false;
        
        const itemPath = parsed.filePath ? parsed.filePath.replace(/\\/g, '/').toLowerCase() : '';
        
        // Only check by path (unique)
        return normalizedPath && itemPath === normalizedPath;
      } catch (err) {
        return false;
      }
    });

    if (!exists) {
      const normalizedFileName = fileName.toLowerCase();
      const fileData = JSON.stringify({ ...parsedContent, filePath, fileName: normalizedFileName });
      const newAll = [...existing, fileData];
      this.props.SET_ALLFILEDATA(newAll);
    }
  } catch (err) {
    console.error("addToAllFileDataIfMissing error:", err);
  }
};

  // Read a single file from server and add to AllFileData and ready-sets
  // REFACTORED: with duplicate checks and batching
  readFileAndRegister = async (filePath) => {
    try {
      const pathNormalized = filePath.replace(/\\/g, '/');
      const fileName = pathNormalized.substring(pathNormalized.lastIndexOf('/') + 1);
      
      const resp = await fetch(AURL + "ReadFile/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: pathNormalized }),
      });
      if (!resp.ok) throw new Error(`Failed to read ${fileName}: ${resp.statusText}`);
      
      const data = await resp.json();
      const content = data.Content;
      let parsedContent = {};
      if (content && content.trim() !== '') {
        try {
          parsedContent = JSON.parse(content);
        } catch (err) {
          console.warn("readFileAndRegister JSON parse failed for", fileName, err);
        }
      }

      const normalizedFileName = fileName.toLowerCase();
      
      // --- BATCH updates: check existence before dispatching ---
      
      // 1. AllFileData
      const existingAll = this.props.AllFileData || [];
      const normalizedPath = pathNormalized.replace(/\\/g, '/').toLowerCase();
      const fileExists = existingAll.some(item => {
        try {
          const parsed = JSON.parse(item);
          const itemPath = parsed.filePath ? parsed.filePath.replace(/\\/g, '/').toLowerCase() : '';
          return itemPath === normalizedPath;
        } catch (err) {
          return false;
        }
      });

      if (!fileExists) {
        const fileData = JSON.stringify({ ...parsedContent, filePath: pathNormalized, fileName: normalizedFileName });
        this.props.SET_ALLFILEDATA([...existingAll, fileData]);
      }

      // 2. Special file types
      if (normalizedFileName.endsWith(".irct")) {
        const readySet = this.props.readySet || [];
        const alreadyExists = readySet.some(item => item.fileName === normalizedFileName);
        if (!alreadyExists) {
          const projectStructure = {
            FirstPage: parsedContent.ProjectData?.FirstPage || null,
            SecondPage: parsedContent.ProjectData?.SecondPage || null,
            ThirdPage: parsedContent.ProjectData?.ThirdPage || null,
            FourthPage: parsedContent.ProjectData?.FourthPage || null,
            activeStep: parsedContent.ProjectData?.activeStep || 0,
            Path: pathNormalized,
            fileName: normalizedFileName
          };
          this.props.addToReadySet(projectStructure);
        }
      } else if (normalizedFileName.endsWith(".irm")) {
        const mctReadySet = this.props.mctReadySet || [];
        const alreadyExists = mctReadySet.some(item => item.fileName === normalizedFileName);
        if (!alreadyExists) {
          const Data = { ...parsedContent, fileName: normalizedFileName, Path: pathNormalized };
          this.props.addToReadySetMCT(Data);
          this.props.SET_NEW_METERCT_PATH(pathNormalized);
          this.props.METERCT_OPEN_FILE(parsedContent);
        }
      } else if (normalizedFileName.endsWith(".irvt")) {
        const vtReadySet = this.props.vtReadySet || [];
        const alreadyExists = vtReadySet.some(item => item.fileName === normalizedFileName);
        if (!alreadyExists) {
          const Data = { ...parsedContent, fileName: normalizedFileName, Path: pathNormalized };
          this.props.addToReadySetVT(Data);
          this.props.SET_NEW_VT_PATH(pathNormalized);
          this.props.VT_OPEN_FILE(parsedContent);
        }
      }
    } catch (error) {
      console.error("readFileAndRegister error for", filePath, ":", error);
    }
  };

  // Given a tree object, traverse and register all special files
  // REFACTORED: now updates progress and properly awaits each file
  preloadSpecialFilesFromTree = async (tree) => {
    if (!tree) return;
    const filesToLoad = [];

    const traverse = (node) => {
      if (!node) return;
      if (!node.isDirectory) {
        const name = node.name || "";
        const lower = name.toLowerCase();
        if (lower.endsWith('.irct') || lower.endsWith('.irm') || lower.endsWith('.irvt')) {
          filesToLoad.push(node.path.replace(/\\/g, '/'));
        }
      } else if (node.children && node.children.length) {
        node.children.forEach(child => traverse(child));
      }
    };

    traverse(tree);

    const totalFiles = filesToLoad.length;
    if (totalFiles === 0) return;

    for (let i = 0; i < totalFiles; i++) {
      await this.readFileAndRegister(filesToLoad[i]);
      // Update progress
      const progress = 30 + ((i + 1) / totalFiles) * 70;
      this.setState({ workspaceLoadProgress: progress });
    }
  };

  // REFACTORED: now sets loading state and orchestrates the entire flow
  fetchFileTree = async (dir) => {
    try {
      this.setState({ isLoadingWorkspace: true, workspaceLoadProgress: 0 });
      
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
      // Filter out .cfg files
      const filteredData = {
        ...data,
        children: data.children ? data.children.filter(child => !child.name.endsWith('.cfg')) : []
      };
      
      // Update file tree in Redux first
      this.props.set_WORKSPACEVITALS({ ...this.props.workSpaceVitals, fileTree: filteredData });
      this.props.selectWorkSpacePath(dir);

      // Update progress and preload files
      this.setState({ workspaceLoadProgress: 30 });
      await this.preloadSpecialFilesFromTree(filteredData);
      
      // Done loading
      this.setState({ isLoadingWorkspace: false, workspaceLoadProgress: 100 });
    } catch (error) {
      console.error("Error fetching file tree:", error);
      this.setState({ error: null, isLoadingWorkspace: false });
    }
  };

  OpenProject = () => {
    window.electron.dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'IRCT Project Files', extensions: ['irct', 'IRCT'] }],
    }).then((filePath) => {
      if (!filePath.filePaths[0]) {
        console.log("No file selected.");
        return;
      }
      if (!filePath.filePaths[0].toLowerCase().includes(".irct")) {
        console.log("Error: Selected file is not an .IRCT file.");
        return;
      }
      fetch(AURL + `ReadFile/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: filePath.filePaths[0] }),
      })
        .then(response => response.json())
        .then(data => {
          const content = data.Content;
          if (content) {
            const parsedContent = JSON.parse(content);
            const extractedFileName = filePath.filePaths[0].split(/[\\\/]/).pop().toLowerCase();
            const projectStructure = {
              FirstPage: parsedContent.ProjectData?.FirstPage || null,
              SecondPage: parsedContent.ProjectData?.SecondPage || null,
              ThirdPage: parsedContent.ProjectData?.ThirdPage || null,
              FourthPage: parsedContent.ProjectData?.FourthPage || null,
              activeStep: parsedContent.ProjectData?.activeStep || 0,
              Path: filePath.filePaths[0],
              fileName: extractedFileName
            };
            this.props.addToReadySet(projectStructure);
          } else {
            this.props.newProject({
              FirstPage: null,
              SecondPage: null,
              ThirdPage: null,
              FourthPage: null,
              activeStep: 0,
            });
          }
        })
        .catch(error => {
          this.props.openPopUp("Error", error.message, "dialog", "Next");
        });
    });
  };

  handleClick = () => {
    this.props.openPopUp(
      "Project Wizard",
      "Welcome to the project wizard! \n This wizard guides you in a simple direction that gets the job done.",
      "Action",
      "Next",
      () => this.props.newProject({
        FirstPage: null,
        SecondPage: null,
        ThirdPage: null,
        FourthPage: null,
        activeStep: 0,
      }),
    );
  };

  checkIfSelectedExists = (path) => {
    fetch(AURL + "fetch_workspace/", {
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
        console.log("!!!!!!!!!!!! The data gained from checkIfSelectedExists", data)

        const directoryPath = path.substring(0, path.lastIndexOf('/'));
        // Set workspace before fetching tree
        this.props.setCurrentWorkSpace(JSON.parse(data.content));
        this.fetchFileTree(directoryPath);
      })
      .catch(error => {
        this.props.openPopUp("Error", error.message, "dialog", "OK");
      });
  };

  selectDirectory = () => {
    window.electron.dialog
      .showOpenDialog({
        properties: ['openFile'],
        filters: [
          { name: 'Config Files', extensions: ['cfg'] },
        ],
      })
      .then(result => {
        if (!result.canceled && result.filePaths.length > 0) {
          let filePath = result.filePaths[0];
          filePath = filePath.replace(/\\/g, '/');
          const directoryPath = filePath.substring(0, filePath.lastIndexOf('/'));
          this.setState({ selectedDir: directoryPath }, () => {
            console.log("directoryPath", directoryPath)
            console.log("filePath", filePath)
            this.checkIfSelectedExists(filePath);
          });
        }
      })
      .catch(err => {
        console.error('Error selecting directory:', err);
      });
  };

  handleAddCT = () => {
    this.props.openPopUp(
      "Add New CT",
      "Enter the name for the new CT (without extension):",
      "input",
      "Create",
      (name) => {
        if (name) {
          this.createNewCT(name);
        }
      }
    );
    this.handleMenuClose();
  };

  handleAddMETER_CT = () => {
    this.props.openPopUp(
      "Add New METER/CT",
      "Enter the name for the new METER/CT (without extension):",
      "input",
      "Create",
      (name) => {
        if (name) {
          this.createNewMETER_CT(name);
        }
      }
    );
    this.handleMenuClose();
  };

  handleAddVT = () => {
    this.props.openPopUp(
      "Add New VT",
      "Enter the name for the new VT (without extension):",
      "input",
      "Create",
      (name) => {
        if (name) {
          this.createNewVT(name);
        }
      }
    );
    this.handleMenuClose();
  };

  readNewFileAndRegister = async (filePath) => {
    try {
      await this.readFileAndRegister(filePath);
    } catch (err) {
      console.error("readNewFileAndRegister error:", err);
    }
  };

  createNewCT = async (name) => {
    try {
      const fileName = `${name}.irct`;
      const filePath = `${this.props.SelectedWorkSpacePath}/${fileName}`.replace(/\\/g, '/');
      await window.electron.fs.writeFile(filePath, '');
      await this.fetchFileTree(this.props.SelectedWorkSpacePath);
      await this.readNewFileAndRegister(filePath);
    } catch (error) {
      console.error("Error creating CT:", error);
      this.props.openPopUp("Error", error.message, "dialog", "OK");
    }
  };

  createNewMETER_CT = async (name) => {
    try {
      const fileName = `${name}.irm`;
      const filePath = `${this.props.SelectedWorkSpacePath}/${fileName}`.replace(/\\/g, '/');
      await window.electron.fs.writeFile(filePath, '');
      await this.fetchFileTree(this.props.SelectedWorkSpacePath);
      await this.readNewFileAndRegister(filePath);
    } catch (error) {
      console.error("Error creating METER/CT:", error);
      this.props.openPopUp("Error", error.message, "dialog", "OK");
    }
  };

  createNewVT = async (name) => {
    try {
      const fileName = `${name}.irvt`;
      const filePath = `${this.props.SelectedWorkSpacePath}/${fileName}`.replace(/\\/g, '/');
      await window.electron.fs.writeFile(filePath, '');
      await this.fetchFileTree(this.props.SelectedWorkSpacePath);
      await this.readNewFileAndRegister(filePath);
    } catch (error) {
      console.error("Error creating VT:", error);
      this.props.openPopUp("Error", error.message, "dialog", "OK");
    }
  };

  render() {
    var { fileTree, error, selectedDir } = this.props.workSpaceVitals;
    const { isLoadingWorkspace, workspaceLoadProgress, anchorEl } = this.state;
    const isMenuOpen = Boolean(anchorEl);

    let SelectedWorkSpace = this.props.CurrentWorkSpace;

    return (
      <div className='WorkFlowView'>

        <div className="mobile-pdf-content">
          <div className="mobile-header-container">
            <div className="mobile-title-section">
              <h1 className="mobile-main-title">Power Calculation Suite</h1>
              <p className="mobile-subtitle">Precision Engineering for Power Systems</p>
            </div>

            <div className='center justify-content-start align-items-start flex-column col-12'>
              <div className="col-12 center d-flex flex-row">
                <div className="d-flex flex-column mb-4 mr-2">
                  <button
                    onClick={this.selectDirectory}
                    className="win11-nav-button"
                  >
                    <OpenInNewIcon className="win11-nav-icon whiteCol" />
                  </button>
                  <span className="win11-nav-text">Select Existing Project  </span>
                </div>
                <CreateNewProject></CreateNewProject>
              </div>

              {!SelectedWorkSpace ? (
                <div className="center flex-column col-12">
                  <div className="center p-1 pt-0 flex-column justify-content-start align-items-start col-10">
                    <p className="ExplorerText2">
                      You have not yet selected a Work Space.
                      Don't want to?, you can{" "}
                      <strong className="Clickable" onClick={this.OpenProject}>
                        Open File
                      </strong>{" "}
                      Otherwise, simply just click here to{" "}
                      <strong onClick={this.handleClick} className="Clickable">
                        Create a new CT calculation
                      </strong>
                    </p>
                  </div>
                </div>
              ) : (
                <div />
              )}
            </div>
            {SelectedWorkSpace && (
              <div className="mobile-info-section center">
                <div className="col-10 center justify-content-end align-items-start flex-column">
                  <div className='col-12 my-2 d-flex justify-content-end'>
                    <Button
                      variant="contained"
                      onClick={() => this.props.setCurrentWorkSpace(null)}
                      sx={{ marginLeft: '10px', background: "transparent", boxShadow : "none" }}
                      className='CloseProjBtn'
                    >
                      <CloseIcon />
                    </Button>
                  </div>
                  <p className="mobile-project-info">
                    <span className="mobile-label">Project:</span> <span className="mobile-value">{this.props.CurrentWorkSpace.Project}</span>
                  </p>
                  <p className="mobile-project-info">
                    <span className="mobile-label">Client:</span> <span className="mobile-value">{this.props.CurrentWorkSpace.clientName}</span>
                  </p>
                  <p className="mobile-project-info">
                    <span className="mobile-label">Consultant:</span> <span className="mobile-value">{this.props.CurrentWorkSpace.consultantName}</span>
                  </p>
                  <p className="mobile-project-info">
                    <span className="mobile-label">Contractor:</span> <span className="mobile-value">{this.props.CurrentWorkSpace.contractorName}</span>
                  </p>
                  <div className="col-12 d-flex align-items-end justify-content-end">
                    <Modifyer Wid={this.state.Wid}></Modifyer>
                  </div>
                  <FinilizeWorkSpace></FinilizeWorkSpace>
                </div>
              </div>
            )}
          </div>

          {SelectedWorkSpace && (
            <div className="col-12 center flex-column projObja">
              <div className="col-12 center objCont justify-content-around">
                <h4 className="ProjObjTitle text-white">Project Object</h4>
                <div>
                  <IconButton
                    onClick={this.handleMenuOpen}
                    className="bg-gray-800 hover:bg-gray-700 AddButton"
                    aria-label="Add options"
                    sx={{ color: '#ffffff' }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={isMenuOpen}
                    onClose={this.handleMenuClose}
                    PaperProps={{
                      style: {
                        backgroundColor: 'rgb(107 114 128 / 0%)',
                        backdropFilter: 'blur(28px)',
                        border: '1px solid #8080803d',
                        boxShadow: 'rgb(0 0 0 / 35%) 1px 11px 12px',
                        borderRadius: '8px',
                        minWidth: '120px',
                        color: 'rgb(112 112 112)',
                      },
                    }}
                    MenuListProps={{
                      sx: {
                        padding: '0.5rem 0',
                      },
                    }}
                  >
                    <MenuItem
                      onClick={this.handleAddCT}
                      className='text-red-600 hover:bg-red-50'
                    >
                      Add CT
                    </MenuItem>
                    <MenuItem
                      onClick={this.handleAddMETER_CT}
                      className='text-red-600 hover:bg-red-50'
                    >
                      Add Meter/CT
                    </MenuItem>
                    <MenuItem
                      onClick={this.handleAddVT}
                      className='text-red-600 hover:bg-red-50'
                    >
                      Add VT
                    </MenuItem>
                  </Menu>
                </div>
              </div>
              <div className="col-10">
                <div className="col-12 center justify-content-between"></div>
                {/* Loading state */}
                {isLoadingWorkspace ? (
                  <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading workspace files... {Math.round(workspaceLoadProgress)}%</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${workspaceLoadProgress}%` }}></div>
                    </div>
                  </div>
                ) : (
                  <SwitchTransition mode="out-in">
                    <CSSTransition
                      key={fileTree ? "tree" : "no-tree"}
                      timeout={300}
                      classNames="slide"
                      mountOnEnter
                      unmountOnExit
                    >
                      <div className="initialTree2 col-12">
                        {fileTree ? (
                          <WorkSpaceTree
                            node={fileTree}
                            toggleMenu={this.props.toggleMenu}
                            closePopUp={this.props.closePopUp}
                            reOpenMenu={this.props.reOpenMenu}
                            openPopUp={this.props.openPopUp}
                            activeIndex={this.props.activeIndex}
                            addToReadySet={this.props.addToReadySet}
                            setCurrentWorkSpace={this.props.setCurrentWorkSpace}
                            SET_ALLFILEDATA={this.props.SET_ALLFILEDATA}
                            AllFileData={this.props.AllFileData}
                            addToReadySetMCT={this.props.addToReadySetMCT}
                            addToReadySetVT={this.props.addToReadySetVT}
                            METERCT_OPEN_FILE={this.props.METERCT_OPEN_FILE}
                            VT_OPEN_FILE={this.props.VT_OPEN_FILE}
                            SET_NEW_METERCT_PATH={this.props.SET_NEW_METERCT_PATH}
                            SET_NEW_VT_PATH={this.props.SET_NEW_VT_PATH}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </CSSTransition>
                  </SwitchTransition>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

// Updated mapStateToProps to include readySet, mctReadySet, vtReadySet
const mapStateToProps = (state) => ({
  CurrentWorkSpace: state.example.CurrentWorkSpace,
  SelectedWorkSpacePath: state.example.SelectedWorkSpacePath,
  workSpaceVitals: state.example.workSpaceVitals,
  AllFileData: state.example.AllFileData,
  readySet: state.example.readySet,
  mctReadySet: state.example.mctReadySet,
  vtReadySet: state.example.vtReadySet,
});

const mapDispatchToProps = (dispatch) => ({
  toggleMenu: () => dispatch({ type: 'TOGGLE_MENU' }),
  setCurrentWorkSpace: data => dispatch({ type: 'SetCurrentWorkSpace', data }),
  set_WORKSPACEVITALS: data => dispatch({ type: 'SET_WORKSPACEVITALS', data }),
  selectWorkSpacePath: data => dispatch({ type: 'SetSelectedWorkSpacePath', data }),
  openPopUp: (title, Message, mode, ActionMessage, action) => dispatch({ type: "OPEN_POPUP", Title: title, Message: Message, mode: mode, ActionMessage: ActionMessage, action: action }),
  updateProjectState: p => dispatch({ type: 'UPDATE_ALL_PAGES', Project: p }),
  closePopUp: () => dispatch({ type: "CLOSE_POPUP" }),
  addToReadySet: data => dispatch({ type: "ADD_TO_READY_SET", data: data }),
  newProject: d => dispatch({ type: 'SETUP_NEW_PROJECT', data: d }),
  SET_ALLFILEDATA: d => dispatch({ type: 'SET_ALLFILEDATA', data: d }),
  addToReadySetMCT: data => dispatch({ type: "ADD_NEW_METER_CT", data: data }),
  addToReadySetVT: data => dispatch({ type: "ADD_NEW_VT", data: data }),
  METERCT_OPEN_FILE: (d) => dispatch({ type: 'METERCT_OPEN_FILE', data: d }),
  VT_OPEN_FILE: (d) => dispatch({ type: 'VT_OPEN_FILE', data: d }),
  SET_NEW_METERCT_PATH: (path) => dispatch({ type: 'SET_NEW_METERCT_PATH', data: path }),
  SET_NEW_VT_PATH: (path) => dispatch({ type: 'SET_NEW_VT_PATH', data: path }),
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkFlowView);