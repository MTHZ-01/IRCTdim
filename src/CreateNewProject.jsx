import React, { Component } from 'react';
import { connect } from 'react-redux';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import CreateProjectActual from './CreateProjectActual.jsx';

export class CreateNewProject extends Component {
  constructor(props) {
    super(props);
    this.buttonRef = React.createRef();
    this.state = { showModal: false, modalTop: 0, modalLeft: 0 };
  }

  handleButtonClick = () => {
    const rect = this.buttonRef.current.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    const mw = 500, mh = 600;
    let left = rect.right, top = rect.top;
    if (left + mw > vw) left = vw - mw - 8;
    if (top + mh > vh) top = vh - mh - 8;
    this.setState({ showModal: true, modalTop: top, modalLeft: left });
  };

  handleClose = () => this.setState({ showModal: false });

  handleSave = (rows) => {
    console.log('Saved rows:', rows);
    // …do something with rows…
  };

  render() {
    const { showModal, modalTop, modalLeft } = this.state;
    return (
      <div className="d-flex flex-column mb-4">
        <button
          ref={this.buttonRef}
          onClick={this.handleButtonClick}
          className="win11-nav-button"
        >
          <AddSharpIcon className="win11-nav-icon whiteCol" />
        </button>
        <span className="win11-nav-text">Create New Project</span>

        {showModal && (
          <CreateProjectActual
            top={modalTop}
            left={modalLeft}
            onClose={this.handleClose}
            onSave={this.handleSave}
          />
        )}
      </div>
    );
  }
}

export default connect()(CreateNewProject);
