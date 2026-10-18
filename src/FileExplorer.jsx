// src/FileExplorer.jsx
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { AURL } from "./App.jsx";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import TreeNode from "./TreeNode.jsx";
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import SideSelector from "./SideSelector.jsx";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WorkFlowView from "./WorkFlowView.jsx";
import NewWorkSpaceSubIcon from "./Assets/Icons/NewWorkSpaceSubIcon.svg";
import WBackGround from "./Assets/WorkSpaceWallPaper.png";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

class FileExplorer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileTree: null,
            error: null,
            selectedDir: "",
            glowPosition: { x: -100, y: -100 },
            showGlow: false,
            isResizing: false,
        };
        this.componentRef = React.createRef();
        this.minWidth = 200;
        this.maxWidth = 600;
    }

    selectDirectory = () => {
        window.electron.dialog.showOpenDialog({
            properties: ['openDirectory'],
        }).then(result => {
            if (!result.canceled && result.filePaths.length > 0) {
                const directoryPath = result.filePaths[0];
                this.setState({ selectedDir: directoryPath }, () => {
                    this.fetchFileTree(directoryPath);
                });
            }
        }).catch(err => {
            console.error('Error selecting directory:', err);
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
        setTimeout(() => {
            // this.props.toggleMenu();
        }, 400);
    };

    OpenProject = () => {
        window.electron.dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'IRCT Project Files', extensions: ['irct'] }],
        }).then((filePath) => {
            if (!filePath.filePaths[0]) {
                console.log("No file selected.");
                return;
            }
            console.log(filePath.filePaths[0]);
            if (!filePath.filePaths[0].includes(".IRCT")) {
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
                        const ProjectData = JSON.parse(content).ProjectData;
                        this.props.addToReadySet(ProjectData);
                    } else {
                        this.props.addToReadySet(ProjectData);
                    }
                })
                .catch(error => {
                    this.props.openPopUp("Error", error.message, "dialog", "Next");
                });
        });
    };

    fetchFileTree = async (dir) => {
        if (!dir || typeof dir !== "string" || dir.trim() === "") {
            return;
        }
        try {
            const response = await fetch(AURL + "filetree", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dir: dir }),
            });
            if (!response.ok) {
                let detail = "";
                try {
                    detail = JSON.stringify(await response.json());
                } catch (_) {
                    detail = await response.text();
                }
                throw new Error("Error fetching file tree: " + detail);
            }
            const data = await response.json();
            if (!data || Object.keys(data).length === 0) {
                throw new Error("No data found");
            }
            console.log("AHHHHH", data);
            this.setState({ fileTree: data });
        } catch (error) {
            console.error("Error fetching file tree:", error);
            this.setState({ error: null });
        }
    };

    componentDidMount() {
        // Do not call filetree with a hard-coded Windows path on Linux.
        // Tree loads after the user selects a real directory / workspace.
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mousemove', this.handleResize);
        window.addEventListener('mouseup', this.stopResize);
        this.props.updateExplorerWidth(this.props.explorerWidth);
        this.handleExpVis();
    }

    componentWillUnmount() {
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mousemove', this.handleResize);
        window.removeEventListener('mouseup', this.stopResize);
    }

    handleHideExp = () => {
        this.props.updateExplorerWidth(1);
    };

    handleShowExp = () => {
        this.props.updateExplorerWidth(300);
    };

    handleExpVis = () => {
        if (this.props.explorerWidth === 1) {
            this.handleShowExp();
        } else {
            this.handleHideExp();
        }
    };

    handleMouseMove = (event) => {
        if (!this.componentRef.current) return;

        const rect = this.componentRef.current.getBoundingClientRect();
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
                glowPosition: {
                    x: mouseX - rect.left,
                    y: mouseY - rect.top,
                },
                showGlow: true,
            });
        } else {
            this.setState({ showGlow: false });
        }
    };

    startResize = (event) => {
        event.preventDefault();
        this.setState({ isResizing: true });
    };

    handleResize = (event) => {
        if (!this.state.isResizing || !this.componentRef.current) return;

        const rect = this.componentRef.current.getBoundingClientRect();
        const newWidth = event.clientX - rect.left;

        if (newWidth >= this.minWidth && newWidth <= this.maxWidth) {
            this.props.updateExplorerWidth(newWidth);
        }
    };

    stopResize = () => {
        if (this.state.isResizing) {
            this.setState({ isResizing: false });
        }
    };

    render() {
        const { fileTree, error, selectedDir, showGlow, glowPosition } = this.state;
        const { explorerWidth } = this.props;

        let NoBorder = this.props.NewMeterCt ||
            this.props.NewWorkSpace ||
            this.props.NewVT ||
            (this.props.ActiveIndex >= 0 &&
                this.props.ActiveIndex < this.props.ReadySet.length);

        // 🚩 Override: if ReadySet is empty, force NoBorder = false
        if (!this.props.ReadySet || this.props.ReadySet.length === 0) {
            NoBorder = false;
        }

        if (this.props.Explorer.mode === "WorkSpace") {
            return (
                <Fragment>
                    <button
                        className="TGLEXP"
                        onClick={this.handleExpVis}
                    >
                        {explorerWidth === 1 ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </button>

                    <div
                        className={`FileExplorer ${NoBorder && "noB_raduce"} ${explorerWidth === 1 && "closedExp"}`}
                        ref={this.componentRef}
                        style={{
                            width: `${explorerWidth}px`,
                            height: '100vh',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {showGlow && (
                            <div
                                className="glow-overlay"
                                style={{
                                    left: `${glowPosition.x}px`,
                                    top: `${glowPosition.y}px`,
                                }}
                            />
                        )}
                        <div
                            className="resize-handle"
                            onMouseDown={this.startResize}
                        />
                        <p className="FileExpHead" style={{ paddingBottom: "5px" }}>
                            <img
                                className="maginRightForFilesFix"
                                src={NewWorkSpaceSubIcon}
                                alt="My SVG Icon"
                                width="30"
                                height="30"
                            />{" "}
                            Work Space
                        </p>
                        <WorkFlowView />
                    </div>
                </Fragment>
            );
        }

        return null;
    }

}
 
const mapStateToProps = (state) => ({
    explorerWidth: state.example.explorerWidth, // get from redux
    Explorer: state.example.Explorer,
    NewMeterCt: state.example.NewMeterCt,
    NewWorkSpace: state.example.NewWorkSpace,
    NewVT: state.example.NewVT,
    ActiveIndex: state.example.ActiveIndex,
    ReadySet: state.example.ReadySet,
});

const mapDispatchToProps = (dispatch) => ({
    toggleMenu: () => dispatch({ type: 'TOGGLE_MENU' }),
    openPopUp: (title, Message, mode, ActionMessage, action) =>
        dispatch({
            type: "OPEN_POPUP",
            Title: title,
            Message: Message,
            mode: mode,
            ActionMessage: ActionMessage,
            action: action
        }),
    updateProjectState: p => dispatch({ type: 'UPDATE_ALL_PAGES', Project: p }),
    closePopUp: () => dispatch({ type: "CLOSE_POPUP" }),
    addToReadySet: data => dispatch({ type: "ADD_TO_READY_SET", data: data }),
    newProject: d => dispatch({ type: 'SETUP_NEW_PROJECT', data: d }),
    updateExplorerWidth: width => dispatch({ type: 'UPDATE_EXPLORER_WIDTH', width }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FileExplorer);
