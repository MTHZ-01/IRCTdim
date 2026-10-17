import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Fragment } from 'react'
import WorkSpaceElement from './WorkSpaceElement.jsx'
import { AURL } from './App.jsx'

export class RecentWorkSpacesParent extends Component {




    getAllWorkSpaces = () => {
        fetch(AURL + "/list_workspaces")
            .then(r => r.json())
            .then(d => {

                console.log("wspace aqq", d)
                this.props.SET_RECENT_WORKSPACES(d.workspaces)
            }

            )
    }


    componentDidMount() {
        this.getAllWorkSpaces()
    }




    render() {
        const rw = this.props.rw
        console.log("recentWorkSpaces:", rw)
        return (
            <div className='col-10 Recents RecentWorkSpaces'>

                <Fragment>
                    <h3 className='TXT-Gray'>Recent WorkSpaces</h3>
                    <div className='col-12 row WorkSpaceContainer'>
                        {rw && rw.map(i => <WorkSpaceElement name={i.name} path={i.path} date={i.date}></WorkSpaceElement>)}

                    </div>
                </Fragment>
            </div>
        )

    }
}

const mapStateToProps = (state) => ({

    rw: state.example.recentWorkSpaces
})

const mapDispatchToProps = (dispatch) => ({
    SET_RECENT_WORKSPACES: (d) => dispatch({ type: 'SET_RECENT_WORKSPACES', data: d }),


})

export default connect(mapStateToProps, mapDispatchToProps)(RecentWorkSpacesParent)