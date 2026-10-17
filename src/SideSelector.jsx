import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from '@mui/material'
import SideSelectElement from './SideSelectElement.jsx'
import NewWorkSpaceSubIcon from "./Assets/Icons/NewWorkSpaceSubIcon.svg"


export class SideSelector extends Component {
    render() {
        return (
            <div className='SideSelector'>
                <SideSelectElement  Active={this.props.Explorer.mode == "WorkSpace"} Text={"Work Space"}></SideSelectElement>
                <SideSelectElement Active={this.props.Explorer.mode == "Explorer"} Text={"Explorer"}></SideSelectElement>
            </div>
        )
    }
}
    
const mapStateToProps = (state) => ({

    Explorer: state.example.Explorer, // Get the menu open state from Redux

})

const mapDispatchToProps = {

    

}

export default connect(mapStateToProps, mapDispatchToProps)(SideSelector)