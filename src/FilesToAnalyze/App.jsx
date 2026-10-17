import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './index.css';
import RedSnakeImage from './Assets/RedSnake.png';
import ElementSelector from './ElementSelector.jsx';
import IntializationForm from './IntializationForm.jsx';
import PopUp from './PopUp.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import BackGround from "./Assets/BackGround.png";
import RecentProjects from './RecentProjects.jsx';
import VSCodeNavBar from './Navbar.jsx';
import FileExplorer from './FileExplorer.jsx';
import ErrorBoundary from "./ErrorBoundary.jsx";
import FileOpen from './FileOpen.jsx';
import SideSelector from './SideSelector.jsx';
import RecentWorkSpacesParent from './RecentWorkSpacesParent.jsx';
import WBackGround from "./Assets/WorkSpaceWallPaper.png"

export const AURL = "http://127.0.0.1:8000/"

class App extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.footerRef = React.createRef();
    this.appContainerRef = React.createRef();
    this.state = {
      isMaximized: false,
      glowPosition: { x: -100, y: -100 },
      showGlow: false,
    };
  }

  // ==================== WINDOW MAXIMIZE HANDLING ====================
  handleWindowStateChange = (event, state) => {
    this.setState({ isMaximized: state.isMaximized });
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    document.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('mousemove', this.handleMouseMove);

    // === Electron Window State Listener ===
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.on('window-state-changed', this.handleWindowStateChange);
    }

    // Initial state check
    if (window.electron?.appControl?.isWindowMaximized) {
      window.electron.appControl.isWindowMaximized().then((isMax) => {
        this.setState({ isMaximized: isMax });
      }).catch(() => { });
    }

    // File association
    if (window.electron && window.electron.fileAssociation) {
      window.electron.fileAssociation.onFileOpen(this.handleFileAssociation);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    document.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('mousemove', this.handleMouseMove);

    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.removeListener('window-state-changed', this.handleWindowStateChange);
    }

    if (window.electron && window.electron.fileAssociation) {
      window.electron.fileAssociation.removeAllListeners();
    }
  }

  handleMouseMove = (event) => {
    if (!this.footerRef.current) return;
    const rect = this.footerRef.current.getBoundingClientRect();
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const proximityThreshold = 300;
    const isNearBounds =
      mouseX >= rect.left - proximityThreshold &&
      mouseX <= rect.right + proximityThreshold &&
      mouseY >= rect.top - proximityThreshold &&
      mouseY <= rect.bottom + proximityThreshold;

    if (isNearBounds) {
      this.setState({
        glowPosition: { x: mouseX - rect.left, y: mouseY - rect.top },
        showGlow: true,
      });
    } else {
      this.setState({ showGlow: false });
    }
  };

  handleClickOutside = (event) => {
    if (this.formRef.current && !this.formRef.current.contains(event.target)) {
      this.props.openPopUp();
      this.props.toggleMenu();
    }
  };

  handleKeyDown(event) {
    if (event.ctrlKey && event.key === 'w') {
      event.preventDefault();
    }
  }

  forceBorderRadius = () => {
    if (this.appContainerRef.current) {
      const el = this.appContainerRef.current;
      if (this.state.isMaximized) {
        el.style.borderRadius = '0px';
      } else {
        el.style.borderRadius = '12px';
      }
    }
  };

  handleFileAssociation = async (filePath) => {
    console.log('Opening file from association:', filePath);
    const fileName = filePath.split(/[\\\/]/).pop().toLowerCase();
    const normalizedPath = filePath.replace(/\\/g, '/');

    try {
      const response = await fetch(`http://127.0.0.1:8000/ReadFile/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: normalizedPath })
      });

      if (!response.ok) throw new Error(`Failed to read file: ${response.statusText}`);

      const data = await response.json();
      const content = data.Content;
      let parsedContent = {};

      if (content && content.trim() !== '') {
        try { parsedContent = JSON.parse(content); } catch (err) { console.warn('Parse error:', err); }
      }

      if (fileName.endsWith('.irct')) {
        const projectStructure = {
          FirstPage: parsedContent.ProjectData?.FirstPage || null,
          SecondPage: parsedContent.ProjectData?.SecondPage || null,
          ThirdPage: parsedContent.ProjectData?.ThirdPage || null,
          FourthPage: parsedContent.ProjectData?.FourthPage || null,
          activeStep: parsedContent.ProjectData?.activeStep || 0,
          Path: normalizedPath,
          fileName: fileName
        };
        this.props.addToReadySet(projectStructure);
      } else if (fileName.endsWith('.irm')) {
        const Data = parsedContent || {};
        Data.fileName = fileName;
        Data.Path = normalizedPath;
        this.props.addToReadySetMCT(Data);
      } else if (fileName.endsWith('.irvt')) {
        const Data = parsedContent || {};
        Data.fileName = fileName;
        Data.Path = normalizedPath;
        this.props.addToReadySetVT(Data);
      }
    } catch (error) {
      console.error('Error opening file:', error);
      if (fileName.endsWith('.irct')) {
        const fallbackProject = {
          FirstPage: { Project: fileName.replace(/\.irct$/, '') },
          SecondPage: null,
          ThirdPage: null,
          FourthPage: null,
          activeStep: 0,
          Path: normalizedPath,
          fileName: fileName
        };
        this.props.addToReadySet(fallbackProject);
      }
    }
  };

  render() {
    const { isMenuOpen, explorerWidth } = this.props;
    const { showGlow, glowPosition, isMaximized } = this.state;

    return (
      <Fragment>
        <div
          ref={this.appContainerRef}
          className={`app-container bg-zoom ${this.state.isMaximized ? 'is-maximized' : ''}`}
          style={{
            backgroundImage: `url(${WBackGround})`,
          }}
        >
          {/* Animated menu */}
          {isMenuOpen && (
            <div className="menu" ref={this.formRef}>
              <IntializationForm />
            </div>
          )}

          {/* Active Form */}
          {this.props.ActiveIndex >= 0 &&
            this.props.ActiveIndex < this.props.ReadySet.length &&
            (() => {
              const currentItem = this.props.ReadySet[this.props.ActiveIndex];
              if (!currentItem) return null;

              const isLegacyFormat = currentItem.FirstPage !== undefined;

              if (isLegacyFormat) {
                return (
                  <IntializationForm
                    key={`form-${this.props.ActiveIndex}`}
                    WorkSpace={false}
                    data={currentItem}
                  />
                );
              }

              switch (currentItem.mode) {
                case 'WorkSpace':
                  return <IntializationForm key={`form-${this.props.ActiveIndex}`} WorkSpace={true} data={currentItem.data} />;
                case 'MeterCT':
                  return <IntializationForm key={`form-${this.props.ActiveIndex}`} NewMeterCt={true} data={currentItem.data} />;
                case 'VT':
                  return <IntializationForm key={`form-${this.props.ActiveIndex}`} NewVT={true} data={currentItem.data} />;
                default:
                  return null;
              }
            })()
          }

          {/* Header */}
          <header className="header flex-column">
            <VSCodeNavBar />
            <div
              className="center justify-content-start FilesContainer"
              style={{ width: `calc(100% - ${explorerWidth}px)` }}
            >
              {this.props.ReadySet.map((item, index) => {
                const uniqueKey = item.fileName ||
                  (item.mode && `${item.mode}-${index}`) ||
                  (item.FirstPage && item.FirstPage.Project) ||
                  `file-${index}`;
                return <FileOpen Data={item} key={uniqueKey} index={index} />;
              })}
            </div>
          </header>

          <PopUp sm={false} />

          {/* Main Content */}
          <main className="main-content d-flex flex-row">
            <div className="position-relative">
              <ErrorBoundary>
                <FileExplorer />
              </ErrorBoundary>
            </div>

            <div className="width-fill center flex-column">
              <div className="col-12 center flex-column">
                <RecentWorkSpacesParent />
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="footer" ref={this.footerRef}>
            {showGlow && (
              <div
                className="glow-overlay"
                style={{
                  left: `${glowPosition.x}px`,
                  top: `${glowPosition.y}px`,
                }}
              />
            )}
          </footer>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  isMenuOpen: state.example.isMenuOpen,
  PopUp: state.example.PopUp,
  ReadySet: state.example.ReadySet,
  ActiveIndex: state.example.ActiveIndex,
  explorerWidth: state.example.explorerWidth || 300,
});

const mapDispatchToProps = (dispatch) => ({
  toggleMenu: () => dispatch({ type: 'TOGGLE_MENU' }),
  openPopUp: (title, Message, mode, ActionMessage, action) =>
    dispatch({ type: "OPEN_POPUP", Title: title, Message: Message, mode: mode, ActionMessage: ActionMessage, action: action }),
  closePopUp: () => dispatch({ type: "CLOSE_POPUP" }),
  addToReadySet: data => dispatch({ type: "ADD_TO_READY_SET", data: data }),
  addToReadySetMCT: data => dispatch({ type: "ADD_NEW_METER_CT", data: data }),
  addToReadySetVT: data => dispatch({ type: "ADD_NEW_VT", data: data }),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);