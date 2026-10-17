import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CreateProjectActual from './CreateProjectActual.jsx';

export class Modifyer extends Component {
    constructor(props) {
        super(props);
        this.buttonRef = React.createRef();
        this.state = { showModal: false, modalTop: 0, modalLeft: 0 };
    }

    handleButtonClick = () => {
        if (!this.buttonRef.current) return;
        const rect = this.buttonRef.current.getBoundingClientRect();
        const vw = window.innerWidth;
        const mh = 600; // Modal height
        const mw = 500; // Modal width
        const top = (window.innerHeight - mh) / 2;
        let left = rect.right;
        if (left + mw > vw) {
            left = vw - mw - 8;
        }
        if (left < 8) {
            left = 8;
        }
        this.setState({ showModal: true, modalTop: top, modalLeft: left });
    };

    handleClose = () => this.setState({ showModal: false });

    handleSave = (payload) => {
        console.log('Saved payload:', payload);
        this.handleClose();
    };

    render() {
        const { showModal, modalTop, modalLeft } = this.state;
        return (
            <div className="d-flex flex-column mb-4">
                <Button
                    ref={this.buttonRef}
                    onClick={this.handleButtonClick}
                    className="win11-more-button"
                    endIcon={<ChevronRightIcon className="win11-more-icon" />}
                >
                    More/edit
                </Button>

                {showModal && (
                    <CreateProjectActual
                        Wid={this.props.Wid}
                        top={modalTop}
                        left={modalLeft}
                        onClose={this.handleClose}
                        onSave={this.handleSave}
                        is_Edit={true}
                        CurrentWorkSpace={this.props.CurrentWorkSpace}
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    CurrentWorkSpace: state.example.CurrentWorkSpace,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Modifyer);