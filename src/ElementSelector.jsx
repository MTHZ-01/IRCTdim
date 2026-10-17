// src/ElementSelector.jsx
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './index.css';
import abc from "./Assets/Icons/newProject..svg"
import OpenIcon from "./Assets/Icons/OpenProject.svg"
import help from "./Assets/Icons/help.svg"
import NewWorkSpace from "./Assets/Icons/newWorkSpace.svg"
import { AURL } from './App.jsx';

class ElementSelector extends Component {
  handleClick = () => {
    const { whatToOpen } = this.props;

    if (whatToOpen === "NewProject") {
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
        })
      );
    } else if (whatToOpen === "Project") {
      this.OpenProject();
    } else if (whatToOpen === "Help") {
      this.props.openPopUp(
        "Help!",
        String.raw`Lorem ipsum dolor sit amet, consectetur adipisicing elit...`,
        "dialog"
      );
    } else if (whatToOpen === "NewWorkspace") {
      this.props.toggleNewWorkSpace(true);
    } else if (whatToOpen === "NewMeterCT") {
      this.props.setNewMeterCt(true);
    } else if (whatToOpen === "NewVT") {
      this.props.setNewVT(true);
    }
  };

  OpenProject = () => {
    window.electron.dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'IRCT Project Files', extensions: ['irct'] },
        { name: 'IRM Project Files', extensions: ['irm'] },
        { name: 'IRVT Project Files', extensions: ['irvt'] },
      ],
    }).then((filePath) => {
      if (!filePath.filePaths[0]) {
        ("No file selected.");
        return;
      }

      const selectedFile = filePath.filePaths[0].toUpperCase();

      if (selectedFile.endsWith(".IRCT")) {
        this.loadIRCT(filePath.filePaths[0]);
      } else if (selectedFile.endsWith(".IRM")) {
        this.OpenIRMProject(filePath.filePaths[0]);
      } else if (selectedFile.endsWith(".IRVT")) {
        this.OpenIRVTProject(filePath.filePaths[0]);
      } else {
        ("Error: Invalid file type selected.");
      }
    });
  };

  loadIRCT = (filePath) => {
    fetch(AURL + `ReadFile/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: filePath }),
    })
      .then(response => response.json())
      .then(data => {
        const Actuall = data.Content;
        if (Actuall) {
          const ProjectData = JSON.parse(Actuall).ProjectData;
          this.props.addToReadySet(ProjectData);
        }
      })
      .catch(error => {
        this.props.openPopUp("Error", error.message, "dialog", "Next");
      });
  };

  OpenIRMProject = (filePath) => {
    fetch(AURL + `ReadFile/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: filePath }),
    })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        const actualContent = data.Content;
        if (actualContent) {
          const parsedData = JSON.parse(actualContent);
          this.props.METERCT_OPEN_FILE(parsedData);
        } else {
          throw new Error("No content received from the API.");
        }
      })
      .catch(error => {
        this.props.openPopUp("Error", error.message, "dialog", "Next");
      });
  };

  OpenIRVTProject = (filePath) => {
    fetch(AURL + `ReadFile/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: filePath }),
    })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        const actualContent = data.Content;
        if (actualContent) {
          const parsedData = JSON.parse(actualContent);
          this.props.VT_OPEN_FILE(parsedData);
        } else {
          throw new Error("No content received from the API.");
        }
      })
      .catch(error => {
        this.props.openPopUp("Error", error.message, "dialog", "Next");
      });
  };

  componentDidMount() {
    if (this.props.whatToOpen === "NewProject") {
      document.addEventListener('keydown', this.handleKeyPress);
    }
  }

  componentWillUnmount() {
    if (this.props.whatToOpen === "NewProject") {
      document.removeEventListener('keydown', this.handleKeyPress);
    }
  }

  handleKeyPress = (event) => {
    if (event.ctrlKey && event.key === 'n') {
      event.preventDefault();
      this.handleClick();
    }
  };

  render() {
    const { whatToOpen, title } = this.props;

    const renderIcon = () => {
      switch (whatToOpen) {
        case "NewProject":
        case "NewMeterCT":
        case "NewVT":
          return <img src={abc} alt="icon" width="107" height="107" />;
        case "Project":
          return <img src={OpenIcon} alt="icon" width="107" height="107" />;
        case "Help":
          return <img src={help} alt="icon" width="107" height="107" />;
        case "NewWorkspace":
          return <img src={NewWorkSpace} alt="icon" width="107" height="107" />;
        default:
          return null;
      }
    };

    const getDescription = () => {
      switch (whatToOpen) {
        case "NewWorkspace": return `Click Here to Create a new WorkSpace`;
        case "NewProject": return `Click Here to Create a new CT calculation`;
        case "NewMeterCT": return `Click Here to Create a new Meter/CT calculation`;
        case "NewVT": return `Click Here to Create a new VT calculation`;
        case "Project": return `Click Here to Open an Existing Project`;
        case "Help": return `Click Here to Get Help!`;
        default: return '';
      }
    };

    return (
      <div className="element-selector" onClick={this.handleClick}>
        {renderIcon()}
        <div className='d-flex justify-content-around align-items-start flex-column heightFixForTitle'>
          <h7 className="element-title">{title}</h7>
          <h7 className="TitleFixForElem element-description">{getDescription()}</h7>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isMenuOpen: state.example.isMenuOpen,
});

const mapDispatchToProps = (dispatch) => ({
  toggleMenu: () => dispatch({ type: 'TOGGLE_MENU' }),
  setNewMeterCt: d => dispatch({ type: 'SetNewMeterCt', data: d }),
  setNewVT: d => dispatch({ type: 'SetNewVT', data: d }),
  openPopUp: (title, Message, mode, ActionMessage, action) =>
    dispatch({ type: "OPEN_POPUP", Title: title, Message: Message, mode, ActionMessage, action }),
  newProject: d => dispatch({ type: 'SETUP_NEW_PROJECT', data: d }),
  addToReadySet: data => dispatch({ type: "ADD_TO_READY_SET", data }),
  toggleNewWorkSpace: val => dispatch({ type: "setNewWorkSpace", value: val }),
  METERCT_OPEN_FILE: d => dispatch({ type: 'METERCT_OPEN_FILE', data: d }),
  VT_OPEN_FILE: d => dispatch({ type: 'VT_OPEN_FILE', data: d }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ElementSelector);
