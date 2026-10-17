import React, { Component } from 'react';
import { connect } from 'react-redux';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const steps = ['Metering device', 'CT Config', 'System Info', 'AdditionalEquipment', 'Validate'];

export class ProgressBarMeterCT extends Component {
    isStepOptional(step) {
        return step === 1;
    }

    componentDidMount = () => {

    }

    handleNext = () => {
        const { activeStep } = this.props;
        this.props.activeStepUpdate(
            activeStep + 1,
        );
    };

    handleBack = () => {
        this.props.activeStepUpdate(
            this.props.activeStep - 1,
        );
    };

    handleReset = () => {
        this.props.activeStepUpdate(0)
    };

    handleStep = (step) => () => {
        this.props.activeStepUpdate(step);
    };

    render() {
        return (
            <Box sx={{ width: '100%' }}>
                <Stepper
                    sx={{
                        "& .MuiStepIcon-root": {
                            color: "#555", // Default step icon color
                        },
                        "& .MuiStepIcon-root.Mui-completed": {
                            color: "#28a745", // Completed step color (green)
                        },
                        "& .MuiStepIcon-root.Mui-active": {
                            color: "#007bff", // Active step icon color (blue)
                        },
                        "& .MuiStepLabel-label": {
                            color: "#bbb", // Default step text color
                            cursor: 'pointer', // Pointer cursor for all steps
                            '&:hover': {
                                fontWeight: '700', // Bold text on hover
                                color: '#fff', // Brighter color on hover
                            },
                        },
                        "& .MuiStepLabel-label.Mui-active": {
                            color: "#fff", // Active step text color (white)
                            fontWeight: '700', // Bolder font for active step
                        },
                        "& .MuiStepLabel-label.Mui-completed": {
                            color: "#28a745", // Completed step text color
                        },
                        "& .MuiStepConnector-line": {
                            borderColor: "#444", // Connector line color
                        },
                    }}
                    activeStep={this.props.activeStep}>
                    {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {
                            onClick: this.handleStep(index)
                        };

                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                {this.props.activeStep === steps.length ? (
                    <React.Fragment>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            All steps completed - you're finished
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={this.handleReset}>Reset</Button>
                        </Box>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Box sx={{ flex: '1 1 auto' }} />
                        </Box>
                    </React.Fragment>
                )}
            </Box>
        );
    }
}

const mapStateToProps = (state) => ({
    isMenuOpen: state.example.isMenuOpen,
    PopUp: state.example.PopUp,
    activeStep: state.example.MeterCTInfo.activeStepMETERCT,
});

const mapDispatchToProps = (dispatch) => ({
    activeStepUpdate: (value) => dispatch({ type: 'UPDATE_PROGRESSBAR_METER_CT', value: value }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProgressBarMeterCT);