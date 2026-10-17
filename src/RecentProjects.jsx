import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProjectEntery from './ProjectEntery.jsx'
import { AURL } from "./App.jsx"
import { Fragment } from 'react'

export class RecentProjects extends Component {

    componentDidMount() {
        fetch(AURL + "GetAllFiles")
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Assuming the response is JSON
            })
            .then((data) => {

                this.props.UpdateData(data.IRCT_Files)
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }


    render() {

        return (
            <div className='col-10  Recents'>
                {this.props.PreviousProjectsData && this.props.PreviousProjectsData.length != 0 &&

                    <Fragment>
                        <h3 className='TXT-Gray'>Recent files</h3>
                        <div className='col-12 row ProjectEnteryContainer'>
                            {
                                this.props.PreviousProjectsData.map(i =>
                                    <ProjectEntery Name={i}></ProjectEntery>

                                )
                            }
                        </div>
                    </Fragment>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    PreviousProjectsData: state.example.PreviousProjectsData

})

const mapDispatchToProps = (dispatch) => ({
    UpdateData: (PData) => dispatch({ type: "UPDATE_PREVIOUS_PROJECT_DATA", PData: PData })
})

export default connect(mapStateToProps, mapDispatchToProps)(RecentProjects)