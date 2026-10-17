import React, { Component } from "react";
import { connect } from "react-redux";
import { AURL } from "./App.jsx"; // Django API URL
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Snake from "./Assets/RedSnake.png";
import DescriptionIcon from '@mui/icons-material/Description';
import { CSSTransition } from 'react-transition-group';


class TreeNode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: props.defaultExpanded || false,
            children: props.node.children || null,
            loading: false,
        };
    }

    componentDidMount() {
        if (this.props.node.isDirectory && this.state.expanded && this.state.children === null) {
            this.loadChildren();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.props.node.isDirectory &&
            !prevState.expanded &&
            this.state.expanded 
            // this.state.children === null
        ) {
            this.loadChildren();
        }
    }

    toggleExpand = () => {
        this.setState((prevState) => ({ expanded: !prevState.expanded }));
    };

    loadChildren = () => {
        this.setState({ loading: true });
        fetch(AURL + "filetree", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dir: this.props.node.path }),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Error fetching directory contents");
                return response.json();
            })
            .then((data) => {
                this.setState({ children: data.children || [], loading: false });
            })
            .catch((error) => {
                console.error("Error fetching directory contents:", error);
                this.setState({ loading: false });
                this.props.openPopUp("Error", "Failed to load directory contents", "dialog", "Next");
            });
    };

    OpenProject = () => {
        const filePath = this.props.node.path;
        fetch(AURL + "ReadFile/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: filePath }),
        })
            .then((response) => response.json())
            .then((data) => {
                const content = data.Content;
                if (content) {
                    const ProjectData = JSON.parse(content).ProjectData;
                    this.props.addToReadySet(ProjectData);
                } else {
                    this.props.addToReadySet(ProjectData);
                }
            })
            .catch((error) => {
                this.props.openPopUp("Error", error.message, "dialog", "Next");
            });
    };

    IsItOurs = (s) => s.includes(".IRCT");

    render() {
        const { node } = this.props;
        const { expanded, children, loading } = this.state;
        const isDirectory = node.isDirectory;

        return (
            <div className="tree-node" style={{ marginTop: "10px", paddingLeft: "0px" }}>
                <div
                    className={`node-label ${expanded ? "node-labelExpanded" : ""}`}
                    onClick={
                        isDirectory
                            ? this.toggleExpand
                            : this.IsItOurs(node.name)
                            ? this.OpenProject
                            : null
                    }
                    style={{
                        cursor: this.IsItOurs(node.name) || isDirectory ? "pointer" : "not-allowed",
                        color: isDirectory
                            ? "rgb(192 191 191)"
                            : this.IsItOurs(node.name)
                            ? "rgb(157 86 86)"
                            : "gray",
                        fontWeight: isDirectory ? "1000" : "",
                        width: "fit-content",
                        minWidth: "100rem",
                    }}
                >
                    {this.IsItOurs(node.name) ? (
                        <img className="FileLogo" src={Snake} alt="" />
                    ) : isDirectory ? (
                        expanded ? <ExpandMoreIcon /> : <NavigateNextIcon />
                    ) : (
                        <DescriptionIcon />
                    )}{" "}
                    {node.name}
                </div>

                {isDirectory && (
                    <CSSTransition
                        in={expanded}
                        timeout={100}
                        classNames="node-children"
                        unmountOnExit
                    >
                        <div className="node-children">
                            {loading ? (
                                <div className="loading">Loading...</div>
                            ) : (
                                children &&
                                children.map((child) => (
                                    <TreeNode
                                        key={child.path}
                                        node={child}
                                        defaultExpanded={false}
                                        toggleMenu={this.props.toggleMenu}
                                        closePopUp={this.props.closePopUp}
                                        reOpenMenu={this.props.reOpenMenu}
                                        openPopUp={this.props.openPopUp}
                                        activeIndex={this.props.activeIndex}
                                        addToReadySet={this.props.addToReadySet}
                                    />
                                ))
                            )}
                        </div>
                    </CSSTransition>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
    toggleMenu: () => dispatch({ type: "TOGGLE_MENU" }),
    openPopUp: (title, message) => dispatch({ type: "OPEN_POPUP", Title: title, Message: message }),
    updateProjectState: (p) => dispatch({ type: "UPDATE_ALL_PAGES", Project: p }),
    closePopUp: () => dispatch({ type: "CLOSE_POPUP" }),
    reOpenMenu: (d) => dispatch({ type: "REOPEN_MENU", newData: d }),
    addToReadySet: (data) => dispatch({ type: "ADD_TO_READY_SET", data: data }),
    activeIndex: (index) => dispatch({ type: "SET_ACTIVE_INDEX", ActiveIndex: index }),
});

export default connect(mapStateToProps, mapDispatchToProps)(TreeNode);