import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Fragment } from 'react'
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import AddTaskIcon from '@mui/icons-material/AddTask';
import CancelIcon from '@mui/icons-material/Cancel';


export class MeterCTApproval extends Component {
    render() {

        const Condition = this.props.Condition
        const Text = this.props.Text
        return (
            <Fragment>
                <h3 className='section-title mt-2' style={{ color: "#1976d2", fontWeight: "1000" }}>
                    <PlaylistAddCheckCircleIcon style={{ color: "#1976d2", width: "2.5rem", height: "2.5rem" }}> </PlaylistAddCheckCircleIcon>
                    {Text ? Text : " Result for inverse time overcurrent: "}</h3>
                <div className="col-12 center p-3 position-relative">
                    {Condition
                        ?
                        <Fragment>

                            <h4 className='Approval'>{`Id-max >= min(if-max,ifs-max), Cond.. OK`}</h4>
                            <div className='AddTaskIconParent position-absolute'><AddTaskIcon className='AddTaskIcon'></AddTaskIcon></div>
                        </Fragment>

                        :

                        <Fragment>
                            <h4 className='Denaial'>{`Id-max < min(if-max,ifs-max), Cond.. Not OK`}</h4>
                            <div className='AddTaskIconParentBad position-absolute'><CancelIcon className='AddTaskIcon'></CancelIcon></div>
                        </Fragment>

                    }
                </div>
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(MeterCTApproval)