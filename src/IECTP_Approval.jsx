import React, { Component } from 'react'
import { connect } from 'react-redux'
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import { Fragment } from 'react';
import AddTaskIcon from '@mui/icons-material/AddTask';
import CancelIcon from '@mui/icons-material/Cancel';


export class IECTP_Approval extends Component {
    render() {
        const Condition = this.props.Condition

        return (
            <Fragment>


                <div className="col-12 center p-3 position-relative">
                    {Condition
                        ?
                        <Fragment>

                            <h4 className='Approval'>{`K_SSC_actual >= K_SSC_req, Condition OK`}</h4>
                            <div className='AddTaskIconParent position-absolute'><AddTaskIcon className='AddTaskIcon'></AddTaskIcon></div>

                        </Fragment>
                        :
                        <Fragment>
                            <h4 className='Denaial'>{`K_SSC_actual < K_SSC_req, Condition Not OK`}</h4>
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

export default connect(mapStateToProps, mapDispatchToProps)(IECTP_Approval)