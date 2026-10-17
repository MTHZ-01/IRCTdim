import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from '@mui/material';
import NewWorkSpaceSubIcon from "./Assets/Icons/NewWorkSpaceSubIcon.svg";
import { AURL } from './App.jsx';

export class WorkSpaceElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
      // optional: error state removed if not used
    };
  }

  componentDidMount() {
    console.log("Path:", this.props.path);
  }

  // REMOVED default hardcoded path – now requires argument
  fetchFileTree = async (dir) => {
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
      this.props.selectWorkSpacePath(this.props.path);
    } catch (error) {
      console.error("Error fetching file tree:", error);
      // optionally show error via popup
      this.props.openPopUp("Error", error.message, "dialog", "OK");
    }
  };

  handleMouseEnter = () => {
    this.setState({ isHovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ isHovered: false });
  };

  handleHideExp = () => {
    this.props.updateExplorerWidth(1);
  };

  handleShowExp = () => {
    this.props.updateExplorerWidth(300);
  };

  handleExpNonVisible = () => {
    if (this.props.explorerWidth === 1) {
      this.handleShowExp();
    }
  };

  // FIXED: now async/await and properly orders operations
  handleClick = async () => {
    try {
      const path = this.props.path + "/" + this.props.name + ".cfg";
      console.log("Recents path", path);
      
      const response = await fetch(AURL + "fetch_workspace/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: path }),
      });
      
      if (!response.ok) {
        if (response.status === 400) {
          const data = await response.json();
          throw new Error(`Bad Request: ${data.error}`);
        } else if (response.status === 404) {
          const data = await response.json();
          throw new Error(`Not Found: ${data.error}`);
        } else if (response.status === 500) {
          const data = await response.json();
          throw new Error(`Server Error: ${data.error}`);
        } else {
          throw new Error(`Unexpected response: ${response.status}`);
        }
      }
      
      const data = await response.json();
      const folderPath = this.props.path;
      
      // 1. Set current workspace first
      this.props.setCurrentWorkSpace(JSON.parse(data.content));
      console.log("Project Data:", JSON.parse(data.content));
      
      // 2. Then fetch the file tree (which will preload all files)
      await this.fetchFileTree(folderPath);
      
      // 3. Finally adjust explorer visibility
      this.handleExpNonVisible();
      
    } catch (error) {
      this.props.openPopUp("Error", error.message, "dialog", "OK");
    }
  };

  render() {
    const { isHovered } = this.state;
    const { name } = this.props;

    return (
      <Button
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleClick}
        variant="contained"
        fullWidth
        className='ButtonForWorkspaces'
        sx={{
          borderRadius: '16px',
          boxShadow: 'none',
          textTransform: 'none',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'all 0.3s ease',
          width: "5rem",
          '&:hover': {
            backgroundColor: '#ececec',
            boxShadow: '0px 2px 10px rgba(0,0,0,0.1)',
          }
        }}
      >
        <img
          className="WorkFlowIconForMainPage"
          src={NewWorkSpaceSubIcon}
          alt="My SVG Icon"
          width="60"
          height="60"
          style={{ marginBottom: '10px' }}
        />
        <div className={`workspace-name-container ${isHovered ? 'hovered' : ''}`}>
          <div className={`workspace-name ${isHovered ? 'hovered' : ''}`}>
            {name}
          </div>
        </div>
      </Button>
    );
  }
}

const mapStateToProps = (state) => ({
  CurrentWorkSpace: state.example.CurrentWorkSpace,
  SelectedWorkSpacePath: state.example.SelectedWorkSpacePath,
  workSpaceVitals: state.example.workSpaceVitals,
  explorerWidth: state.example.explorerWidth,
});

const mapDispatchToProps = (dispatch) => ({
  set_WORKSPACEVITALS: data => dispatch({ type: 'SET_WORKSPACEVITALS', data }),
  toggleMenu: () => dispatch({ type: 'TOGGLE_MENU' }),
  setCurrentWorkSpace: data => dispatch({ type: 'SetCurrentWorkSpace', data }),
  selectWorkSpacePath: data => dispatch({ type: 'SetSelectedWorkSpacePath', data }),
  openPopUp: (title, Message, mode, ActionMessage, action) => 
    dispatch({ type: "OPEN_POPUP", Title: title, Message: Message, mode: mode, ActionMessage: ActionMessage, action: action }),
  updateProjectState: p => dispatch({ type: 'UPDATE_ALL_PAGES', Project: p }),
  closePopUp: () => dispatch({ type: "CLOSE_POPUP" }),
  addToReadySet: data => dispatch({ type: "ADD_TO_READY_SET", data: data }),
  newProject: d => dispatch({ type: 'SETUP_NEW_PROJECT', data: d }),
  updateExplorerWidth: width => dispatch({ type: 'UPDATE_EXPLORER_WIDTH', width }),
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkSpaceElement);