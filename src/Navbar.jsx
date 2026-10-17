import React, { Component } from "react";
import { AppBar, Toolbar, Button, Menu, MenuItem } from "@mui/material";
import { connect } from 'react-redux';
import Snake from "./Assets/RedSnake.png";
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Remove';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import FilterNoneIcon from '@mui/icons-material/FilterNone';
import { AURL } from "./App.jsx";

import "./Styles/NavBar.css";

class VSCodeNavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            activeMenu: null,
            menuPosition: { top: 0, left: 0 },
            isMaximized: false,
        };
        this.buttonRefs = {};
    }

    handleClick = (event, menu) => {
        const buttonRef = this.buttonRefs[menu];
        if (buttonRef) {
            const rect = buttonRef.getBoundingClientRect();
            this.setState((prev) => ({
                anchorEl: prev.activeMenu === menu ? null : buttonRef,
                activeMenu: prev.activeMenu === menu ? null : menu,
                menuPosition: { top: rect.bottom, left: rect.left },
            }));
        }
    };

    handleClose = () => {
        this.setState({ anchorEl: null, activeMenu: null });
    };

    // Window Controls
    handleMinimizeApp = () => {
        window.electron?.appControl?.minimizeApp?.();
    };

    handleMaximizeApp = () => {
        window.electron?.appControl?.maximizeApp?.();
    };

    handleCloseApp = () => {
        window.electron?.appControl?.closeApp?.();
    };

    // IPC Listeners
    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);

        if (window.electron?.ipcRenderer) {
            window.electron.ipcRenderer.on('window-state-changed', (event, state) => {
                this.setState({ isMaximized: state.isMaximized });
            });
        }

        if (window.electron?.appControl?.isWindowMaximized) {
            window.electron.appControl.isWindowMaximized().then((v) => {
                this.setState({ isMaximized: !!v });
            }).catch(() => {});
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
    }

    handleKeyPress = (event) => {
        if (event.ctrlKey && event.key === 'o') {
            event.preventDefault();
            this.OpenProject();
        }
    };

    // File Operations
    saveFolderWithDialog = async () => {
        const sourcePath = this.props.CurrentWorkSpace?.path;
        if (!sourcePath) return;

        const result = await window.electron.dialog.showOpenDialog({
            title: 'Select Destination Folder',
            defaultPath: sourcePath,
            properties: ['openDirectory', 'createDirectory']
        });

        if (!result.canceled && result.filePaths.length > 0) {
            await window.electron.fs.copyFolder(sourcePath, result.filePaths[0]);
            console.log(`Folder copied to: ${result.filePaths[0]}`);
        }
    };

    OpenProject = () => {
        window.electron.dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'IRCT Project Files', extensions: ['irct'] },
                { name: 'IRM Project Files', extensions: ['irm'] },
                { name: 'IRVT Project Files', extensions: ['irvt'] }
            ],
        }).then((filePath) => {
            if (!filePath.filePaths[0]) return;

            const selectedFile = filePath.filePaths[0].toUpperCase();

            if (selectedFile.endsWith(".IRCT")) {
                fetch(AURL + `ReadFile/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ path: filePath.filePaths[0] }),
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
            } else if (selectedFile.endsWith(".IRM")) {
                this.OpenIRMProject(filePath.filePaths[0]);
            } else if (selectedFile.endsWith(".IRVT")) {
                this.OpenIRVTProject(filePath.filePaths[0]);
            }
        });
    };

    OpenIRMProject = (filePath) => {
        fetch(AURL + `ReadFile/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: filePath }),
        })
            .then(response => response.json())
            .then(data => {
                const actualContent = data.Content;
                if (actualContent) {
                    const parsedData = JSON.parse(actualContent);
                    this.props.METERCT_OPEN_FILE(parsedData);
                }
            })
            .catch(error => this.props.openPopUp("Error", error.message, "dialog", "Next"));
    };

    OpenIRVTProject = (filePath) => {
        fetch(AURL + `ReadFile/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: filePath }),
        })
            .then(response => response.json())
            .then(data => {
                const actualContent = data.Content;
                if (actualContent) {
                    const parsedData = JSON.parse(actualContent);
                    this.props.VT_OPEN_FILE(parsedData);
                }
            })
            .catch(error => this.props.openPopUp("Error", error.message, "dialog", "Next"));
    };

    handleMenuSelect = (item) => {
        if (item === "Save Project As") this.saveFolderWithDialog();
        if (item === "Open File") this.OpenProject();
        if (item === "Exit") this.handleCloseApp();
        this.handleClose();
    };

    render() {
        const { anchorEl, activeMenu, menuPosition, isMaximized } = this.state;

        const menuItems = {
            File: ["Open File", "Save Project As", "Exit"],
            Help: ["About", "Documentation", "Check for Updates"],
        };

        return (
            <AppBar position="static" className="vscode-titlebar">
                <div className="navbar-holder">
                    <Toolbar className="navbar-toolbar" onDoubleClick={this.handleMaximizeApp}>
                        <img src={Snake} alt="Logo" className="navbar-logo" />

                        <div className="navbar-menu-container">
                            {Object.keys(menuItems).map((menu) => (
                                <div key={menu} className="navbar-menu-item">
                                    <Button
                                        ref={(ref) => (this.buttonRefs[menu] = ref)}
                                        onClick={(e) => this.handleClick(e, menu)}
                                        className={`navbar-menu-button ${activeMenu === menu ? 'active' : ''}`}
                                    >
                                        {menu}
                                    </Button>

                                    <Menu
                                        anchorReference="anchorPosition"
                                        anchorPosition={menuPosition}
                                        open={activeMenu === menu}
                                        onClose={this.handleClose}
                                        MenuListProps={{ onClick: this.handleClose }}
                                        className="navbar-dropdown"
                                    >
                                        {menuItems[menu].map((item, index) => (
                                            <MenuItem 
                                                key={index} 
                                                onClick={() => this.handleMenuSelect(item)}
                                                className="navbar-dropdown-item"
                                            >
                                                {item}
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </div>
                            ))}
                        </div>

                        <div className="navbar-title">
                            Power Calculation Suite — Prototype Revision 2
                        </div>
                    </Toolbar>

                    {/* Window Controls */}
                    <div className="window-controls">
                        <Button onClick={this.handleMinimizeApp} className="window-btn minimize-btn" title="Minimize">
                            <MinimizeIcon className="window-icon minimize-icon" />
                        </Button>

                        <Button onClick={this.handleMaximizeApp} className="window-btn maximize-btn" title="Maximize / Restore">
                            {isMaximized ? 
                                <FilterNoneIcon className="window-icon restore-icon" /> : 
                                <CropSquareIcon className="window-icon maximize-icon" />
                            }
                        </Button>

                        <Button onClick={this.handleCloseApp} className="window-btn close-btn" title="Close">
                            <CloseIcon className="window-icon close-icon" />
                        </Button>
                    </div>
                </div>
            </AppBar>
        );
    }
}

// Redux
const mapStateToProps = (state) => ({
    CurrentWorkSpace: state.example.CurrentWorkSpace,
    ProjectData: state.example.Project,
});

const mapDispatchToProps = (dispatch) => ({
    openPopUp: (title, Message) => dispatch({ type: "OPEN_POPUP", Title: title, Message: Message }),
    METERCT_OPEN_FILE: (d) => dispatch({ type: 'METERCT_OPEN_FILE', data: d }),
    VT_OPEN_FILE: (d) => dispatch({ type: 'VT_OPEN_FILE', data: d }),
    addToReadySet: data => dispatch({ type: "ADD_TO_READY_SET", data: data }),
});

export default connect(mapStateToProps, mapDispatchToProps)(VSCodeNavBar);