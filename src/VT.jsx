import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProgressBarVT from './ProgressBarVT.jsx'
import { Fragment } from 'react'
import MeteringDevice from './MeteringDevice.jsx'
import CTConfig_METERCT from './CTConfig_METERCT.jsx'
import SYSINFO_METERCT from './SYSINFO_METERCT.jsx'
import AdditionalEquipment_METERCT from './AdditionalEquipment_METERCT.jsx'
import Validation_METERCT from './Validation_METERCT.jsx'
import VTDevice from './VTDevice.jsx'
import OParameter from './OParameter.jsx'
import MParameter from './MParameter.jsx'
import ValidationVT from './ValidationVT.jsx'
export class VT extends Component {



    render() {
        return (
            <div className='col-12 hCalc_m_64'>

                <Fragment>

                    <div className='ProgressBar'>
                        <ProgressBarVT></ProgressBarVT>
                    </div>


                    {
                        this.props.activeStep == 0 &&

                        <VTDevice></VTDevice>
                    }

                    {
                        this.props.activeStep == 1 &&
                        <OParameter />

                    }
                    {
                        this.props.activeStep == 2 &&
                        <MParameter />

                    }

                    {
                        this.props.activeStep == 3 &&
                        <ValidationVT />
                    }

                </Fragment>


            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    activeStep: state.example.VT.activeStepVT
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(VT)