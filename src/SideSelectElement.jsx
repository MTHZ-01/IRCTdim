import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import NewWorkSpaceSubIcon from "./Assets/Icons/NewWorkSpaceSubIcon.svg"


export class SideSelectElement extends Component {
    handleClick = () => {
        if (this.props.Text == "Explorer") {this.props.setExplorerMode("Explorer")}
        else if (this.props.Text == "Work Space") {this.props.setExplorerMode("WorkSpace")}
    }   

    render() {
        return (
            <div className='d-flex justify-content-start flex-row pl-0 p2'>

                <div className={` ${this.props.Active ? "ActiveSideButton" : "DeActiveSideButton"} `}></div>
                <Button onClick={this.handleClick} className='SideButton col-12'>
                    <p className='SideButtonTEXT'>
                        {this.props.Text == "Explorer" && <ContentCopyIcon className="ContentCopyIcon"></ContentCopyIcon>}
                        {this.props.Text == "Work Space" && <img src={NewWorkSpaceSubIcon} alt="My SVG Icon" width="30" height="30" />}

                    </p>
                </Button>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({
    setExplorerMode: d => dispatch({ type: 'setExplorerMode', mode: d }),
})

export default connect(mapStateToProps, mapDispatchToProps)(SideSelectElement)