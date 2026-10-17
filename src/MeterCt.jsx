import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProgressBarMeterCT from './ProgressBarMeterCT.jsx'
import { Fragment } from 'react'
import MeteringDevice from './MeteringDevice.jsx'
import CTConfig_METERCT from './CTConfig_METERCT.jsx'
import SYSINFO_METERCT from './SYSINFO_METERCT.jsx'
import AdditionalEquipment_METERCT from './AdditionalEquipment_METERCT.jsx'
import Validation_METERCT from './Validation_METERCT.jsx'

export class MeterCt extends Component {



    render() {
        return (
            <div className='col-12 hCalc_m_64'>

                <Fragment>

                    <div className='ProgressBar'>
                        <ProgressBarMeterCT></ProgressBarMeterCT>
                    </div>


                    {
                        this.props.activeStep == 0 &&

                        <MeteringDevice></MeteringDevice>
                    }

                    {
                        this.props.activeStep == 1 &&
                        <CTConfig_METERCT />

                    }
                    {
                        this.props.activeStep == 2 &&
                        <SYSINFO_METERCT />

                    }
                    {
                        this.props.activeStep == 3 &&
                        <AdditionalEquipment_METERCT />

                    }
                    {
                        this.props.activeStep == 4 &&
                        <Validation_METERCT />
                    }

                </Fragment>


            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    activeStep: state.example.MeterCTInfo.activeStepMETERCT,
    pathForCurrentlyOpenMeterCT: state.example.pathForCurrentlyOpenMeterCT,

})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(MeterCt)