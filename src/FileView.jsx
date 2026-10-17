import React, { Component } from 'react';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DescriptionIcon from '@mui/icons-material/Description';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Snake from "./Assets/RedSnake.png";
import YellowSnake from "./Assets/YellowSnake.png";
import WhiteSnake from "./Assets/WhiteSnake.png";
import { AURL } from './App.jsx';

class FileView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contextMenu: null,
            openDialog: false,
        };
    }

    handleClick = (event) => {
        const { isDirectory, isSpecialFile, toggleExpand, OpenProject, node } = this.props;
        const { name } = node;
        if (isDirectory) {
            toggleExpand();
        } else if (isSpecialFile(name)) {
            OpenProject();
        }
    };

    handleRightClick = (event) => {
        const { isDirectory } = this.props.node;
        event.preventDefault();
        event.stopPropagation();
        if (!isDirectory) {
            this.setState({
                contextMenu: this.state.contextMenu === null
                    ? {
                        mouseX: event.clientX - 2,
                        mouseY: event.clientY - 4,
                    }
                    : null,
            });
        }
    };

    handleClose = (event) => {
        event.stopPropagation();
        this.setState({ contextMenu: null });
    };

    handleDeleteClick = (event) => {
        event.stopPropagation();
        this.setState({ openDialog: true, contextMenu: null });
    };

    handleConfirmDelete = (event) => {
        event.stopPropagation();
        this.props.deleteFile(event);
        this.setState({ openDialog: false });
    };

    handleCancelDelete = (event) => {
        event.stopPropagation();
        this.setState({ openDialog: false });
    };

    handleCopy = async (event) => {
        event.stopPropagation();
        const { node } = this.props;
        console.log(node.path)
        try {
            const response = await fetch(AURL + "copy_file/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    file_path: node.path,
                    destination_path: node.path + '_copy',
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to copy file');
            }
            console.log('File copied successfully');
        } catch (error) {
            console.error('Error copying file:', error);
        }
        this.setState({ contextMenu: null });
    };

    handleCut = async (event) => {
        event.stopPropagation();
        const { node } = this.props;
        console.log(node.path)
        try {
            const response = await fetch(AURL + "cut_file/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    file_path: node.path,
                    destination_path: node.path, // Adjust as needed for destination
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to cut file');
            }
            console.log('File moved successfully');
        } catch (error) {
            console.error('Error cutting file:', error);
        }
        this.setState({ contextMenu: null });
    };

    render() {
        const { node, expanded, isSpecialFile } = this.props;
        const { name, isDirectory } = node;
        const { contextMenu, openDialog } = this.state;

        return (
            <div
                className={`node-label flex items-center transition-all duration-200 hover:bg-gray-700/20  ${expanded ? 'node-labelExpanded font-semibold' : ''}`}
                onClick={this.handleClick}
                onContextMenu={this.handleRightClick}
                style={{
                    cursor: isSpecialFile(name) || isDirectory ? 'pointer' : 'not-allowed',
                    minWidth: '300px',
                    userSelect: 'none',
                }}
            >
                <div className="flex items-center space-x-2">
                    {isSpecialFile(name) ? (
                        name.includes(".IRCT") ? (
                            <img className="w-5 h-5" src={Snake} alt="IRCT file" />
                        ) : name.includes(".IRM") ? (
                            <img className="w-5 h-5" src={YellowSnake} alt="IRM file" />
                        ) : (
                            <img className="w-5 h-5" src={WhiteSnake} alt="IRVT file" />
                        )
                    ) : isDirectory ? (
                        expanded ? (
                            <ExpandMoreIcon className="text-gray-400" fontSize="small" />
                        ) : (
                            <NavigateNextIcon className="text-gray-400" fontSize="small" />
                        )
                    ) : (
                        <DescriptionIcon className="text-gray-400" fontSize="small" />
                    )}
                    <span
                        className={`${isDirectory
                            ? 'text-gray-300 font-medium'
                            : isSpecialFile(name)
                                ? 'text-red-500 font-medium'
                                : 'text-gray-400'
                            } truncate`}
                    >
                        {name}
                    </span>
                </div>
                <Menu
                    open={contextMenu !== null}
                    onClose={this.handleClose}
                    anchorReference="anchorPosition"
                    anchorPosition={
                        contextMenu !== null
                            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                            : undefined
                    }
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
                >
                    <MenuItem
                        onClick={this.handleCopy}
                        className="text-gray-200 hover:bg-gray-600/30"
                    >
                        <ContentCopyIcon fontSize="small" className="mr-2" />
                        Copy
                    </MenuItem>
                    <MenuItem
                        onClick={this.handleCut}
                        className="text-gray-200 hover:bg-gray-600/30"
                    >
                        <ContentCutIcon fontSize="small" className="mr-2" />
                        Cut
                    </MenuItem>
                    <MenuItem
                        onClick={this.handleDeleteClick}
                        className="text-red-500 hover:bg-red-900/30"
                    >
                        <DeleteIcon fontSize="small" className="mr-2" />
                        Delete
                    </MenuItem>
                </Menu>
                <Dialog
                    open={openDialog}
                    onClose={this.handleCancelDelete}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    PaperProps={{
                        style: {
                            backgroundColor: 'rgba(30, 30, 30, 0)',
                            backdropFilter: 'blur(28px)',
                            border: '1px solid rgba(128, 128, 128, 0.2)',
                            boxShadow: 'rgba(0, 0, 0, 0.5) 1px 11px 12px',
                            borderRadius: '8px',
                            color: 'rgb(200, 200, 200)',
                        },
                    }}
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Confirm Delete"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" style={{ color: 'rgb(200, 200, 200)' }}>
                            Are you sure you want to delete {name}?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={this.handleCancelDelete}
                            style={{ color: 'rgb(200, 200, 200)' }}
                        >
                            No
                        </Button>
                        <Button
                            onClick={this.handleConfirmDelete}
                            style={{ color: 'rgb(239, 68, 68)' }}
                            autoFocus
                        >
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default FileView;