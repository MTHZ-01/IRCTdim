import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from '@mui/material'
import { AURL } from "./App.jsx"



export class ProjectEntery extends Component {
  OpenProject = name => {
    const fileNameWithoutExtension = name.replace('.IRCT', ''); // Remove the .IRCT extension

    fetch(AURL + `ReadFileWithName/${fileNameWithoutExtension}/`)
      .then(response => response.json()) // Assuming the response is in JSON format
      .then(data => {
        const Actuall = data.Content



        // Try to extract 'ProjectData' more reliably // Match 'ProjectData' and everything after it
        if (Actuall) {
          // Now parse the extracted ProjectData
          const ProjectData = JSON.parse(Actuall).ProjectData // Replace single quotes with double quotes for valid JSON
          console.log(ProjectData); // Log the entire response data for inspection
          // this.props.addToReadySet(ProjectData)
          this.props.reOpenMenu(ProjectData);
          // this.props.activeIndex(0);


          // this.props.updateProjectState(ProjectData); // Update project state with the parsed data
          // this.props.reOpenMenu(ProjectData); // Toggle the menu
        } else {
          console.error('ProjectData not found in the content');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error); // Log any errors
      });
  }
  render() {
    return (
      <Button onClick={() => this.OpenProject(this.props.Name)} className='ProjectEnteryWrapper'>
        <div className='ProjectEnteryNameCont'>
          {this.props.Name
            ? this.props.Name
            : "No Name"
          }
        </div>
      </Button>
    )
  }
}


const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({
  toggleMenu: () => dispatch({ type: 'TOGGLE_MENU' }),
  updateProjectState: (p) => dispatch({ type: 'UPDATE_ALL_PAGES', Project: p }),
  openPopUp: (title, Message) => dispatch({ type: "OPEN_POPUP", Title: title, Message: Message }),
  closePopUp: () => dispatch({ type: "CLOSE_POPUP" }),
  addToReadySet: (d) => dispatch({ type: "ADD_TO_READY_SET", data: d }),
  reOpenMenu: (d) => dispatch({ type: "REOPEN_MENU", newData: d }),

});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectEntery)