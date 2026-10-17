
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { Button, TextField } from '@mui/material';
import { AURL } from './App.jsx';

export class AdditionalEquipment_METERCT extends Component {
    state = {
        ShouldShowForm: false,
        AdditionalEquipment: [
            { name: '', ratedCurrent: '', ratedBurden: '' },
            { name: '', ratedCurrent: '', ratedBurden: '' },
            { name: '', ratedCurrent: '', ratedBurden: '' },
            { name: '', ratedCurrent: '', ratedBurden: '' },
            { name: '', ratedCurrent: '', ratedBurden: '' }
        ]
    };

    GetRelayData = () => {
        fetch(AURL + `relayHierarchy`)
            .then((r) => r.json())
            .then((d) => {
                this.setState({ wholeData: d });
                const manufactureNames = [...new Set(d.relays.map((relay) => relay.manufacture))];
                this.setState({ ManufactureList: manufactureNames });
            })
            .catch((error) => {
                console.error('Error fetching relay data:', error);
            });
    };

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);

        if (this.props.activeStep === 3) {
            const initialEquipment = this.props.AdditionalEquipment || this.state.AdditionalEquipment;
            this.setState({ AdditionalEquipment: initialEquipment }, () => {
                console.log("AdditionalEquipment AdditionalEquipment AdditionalEquipment AdditionalEquipment ", this.state.AdditionalEquipment);
            });
            console.log("!!!!!!!! !!!!!!!! !!!!!!!! ", initialEquipment);
            setTimeout(() => {
                this.setState({ ShouldShowForm: true });
            }, 100);
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
    }

    handleKeyPress = (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            this.Back();
        } else if (event.key === 'Enter') {
            this.Next();
        }
    };

    addEquipment = () => {
        this.setState((prevState) => ({
            AdditionalEquipment: [...prevState.AdditionalEquipment, { name: '', ratedCurrent: '', ratedBurden: '' }],
        }), () => {
            this.props.GlobalizeSecondPage(this.state.AdditionalEquipment);
        });
    };

    removeEquipment = (index) => {
        this.setState((prevState) => ({
            AdditionalEquipment: prevState.AdditionalEquipment.filter((_, i) => i !== index),
        }), () => {
            this.props.GlobalizeSecondPage(this.state.AdditionalEquipment);
        });
    };

    handleInputChange = (index, field, value) => {
        this.setState((prevState) => {
            const updatedEquipment = prevState.AdditionalEquipment.map((equipment, i) => {
                if (i === index) {
                    return { ...equipment, [field]: value };
                }
                return equipment;
            });
            return { AdditionalEquipment: updatedEquipment };
        }, () => {
            this.props.GlobalizeSecondPage(this.state.AdditionalEquipment);
        });
    };

    Next = () => {
        this.props.GlobalizeSecondPage(this.state.AdditionalEquipment);
        this.props.activeStepUpdate(this.props.activeStep + 1);
    };

    Back = () => {
        this.props.GlobalizeSecondPage(this.state.AdditionalEquipment);
        this.props.activeStepUpdate(this.props.activeStep - 1);
    };

    GetToInitializeProject = () => {
        this.props.GlobalizeSecondPage(this.state.AdditionalEquipment);
        this.props.toggleMenu();
    };

    render() {
        return (
            <CSSTransition timeout={600} classNames="slide" in={this.state.ShouldShowForm} unmountOnExit>
                <div className="col-12 center FullScreenFix flex-column justify-content-start">
                    <div className="d-flex W90-p justify-content-between row  RelayConfCont">
                        <h1 className="col-12 headingsForInitProject">Additional Equipment</h1>
                        <Button className='AddEq' onClick={this.addEquipment}>Add Equipment</Button>

                        <div className="center flex-column justify-content-start align-items-center col-12 O_X_Auto InitFormInfoCont">
                            {this.state.AdditionalEquipment.length !== 0 && this.state.AdditionalEquipment.map((equipment, index) => (
                                <div key={index} className="d-flex justify-content-start flex-column m-2">
                                    <div className="col-12 d-flex justify-content-between align-items-center">

                                        <h3 className='text-light mb-0'>Equipment #{index + 1}</h3>
                                        <Button className='RmEq' onClick={() => this.removeEquipment(index)}>Remove</Button>
                                    </div>
                                    <div className="center justify-content-start align-items-end flex-column">
                                        <div className="d-flex flex-row m-2 justify-content-center align-items-center">
                                            <h5 className="text-light mr-4 mb-0 text-align-center center">Name</h5>
                                            <TextField
                                                variant="standard"
                                                placeholder="Name"
                                                value={equipment.name}
                                                onChange={(e) => this.handleInputChange(index, 'name', e.target.value)}
                                                InputLabelProps={{
                                                    shrink: true,
                                                    className: 'custom-input-label',
                                                }}
                                                InputProps={{
                                                    classes: {
                                                        root: 'custom-input-root',
                                                        input: 'custom-input-element',
                                                    },
                                                }}
                                            />
                                        </div>
                                        <div className="d-flex flex-row m-2 justify-content-center align-items-center">
                                            <h5 className="text-light mr-4 mb-0 text-align-center center">Rated Current (A)</h5>
                                            <TextField
                                                variant="standard"
                                                placeholder="Rated Current (A)"
                                                type="number"
                                                value={equipment.ratedCurrent}
                                                onChange={(e) => this.handleInputChange(index, 'ratedCurrent', e.target.value)}
                                                InputLabelProps={{
                                                    shrink: true,
                                                    className: 'custom-input-label',
                                                }}
                                                InputProps={{
                                                    classes: {
                                                        root: 'custom-input-root',
                                                        input: 'custom-input-element',
                                                    },
                                                }}
                                            />
                                        </div>
                                        <div className="d-flex flex-row m-2 justify-content-center align-items-center">
                                            <h5 className="text-light mr-4 mb-0 text-align-center center">Rated Burden (VA)</h5>
                                            <TextField
                                                variant="standard"
                                                placeholder="Rated Burden (VA)"
                                                type="number"
                                                value={equipment.ratedBurden}
                                                onChange={(e) => this.handleInputChange(index, 'ratedBurden', e.target.value)}
                                                InputLabelProps={{
                                                    shrink: true,
                                                    className: 'custom-input-label',
                                                }}
                                                InputProps={{
                                                    classes: {
                                                        root: 'custom-input-root',
                                                        input: 'custom-input-element',
                                                    },
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="w-100">
                            <div className="d-flex justify-content-between align-items-between flex-row col-12">
                                <Button className="NXT_Btn" onClick={this.Back}>Back</Button>
                                <Button className="NXT_Btn" onClick={this.Next}>Next</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CSSTransition>
        );
    }
}

const mapStateToProps = (state) => ({
    isMenuOpen: state.example.isMenuOpen,
    activeStep: state.example.MeterCTInfo.activeStepMETERCT,
    AdditionalEquipment: state.example.MeterCTInfo.AdditionalEquipment,
    initializationFullScreen: state.example.initializationFullScreen
});

const mapDispatchToProps = (dispatch) => ({
    toggleMenu: () => dispatch({ type: 'TOGGLE_MENU' }),
    activeStepUpdate: (value) => dispatch({ type: 'UPDATE_PROGRESSBAR_METER_CT', value }),
    GlobalizeSecondPage: (data) => dispatch({ type: 'UPDATE_AE_PAGE', data }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdditionalEquipment_METERCT);
