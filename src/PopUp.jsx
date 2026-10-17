import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

class PopUp extends Component {
  state = {
    ShouldShowForm: false,
    inputValue: '',
  };

  constructor(props) {
    super(props);
    this.popUpContainer = React.createRef();
    this.inputRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  handleKeyPress = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.props.closePopUp();
    }
    if (event.key === 'Enter') {
      if (this.props.PopUp.mode === 'Action' || this.props.PopUp.mode === 'input') {
        this.handleAction();
      } else if (this.props.PopUp.mode === 'dialog') {
        this.props.closePopUp();
      }
    }
  };

  componentDidMount() {
    if (!this.props.sm) {
      document.addEventListener('mousedown', this.handleClickOutside);
    }
    document.addEventListener('keydown', this.handleKeyPress);
    setTimeout(() => {
      this.setState({ ShouldShowForm: true });
    }, 50);
  }

  componentWillUnmount() {
    if (!this.props.sm) {
      document.removeEventListener('mousedown', this.handleClickOutside);
    }
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  handleClickOutside = (event) => {
    if (this.popUpContainer.current && !this.popUpContainer.current.contains(event.target)) {
      this.props.closePopUp();
    }
  };

  handleAction = () => {
    if (this.props.PopUp.mode === 'input') {
      this.props.PopUp.action(this.state.inputValue);
    } else {
      this.props.PopUp.action();
    }
    this.props.closePopUp();
  };

  render() {
    const { Title, Message, mode, ActionMessage } = this.props.PopUp;

    return (
      <CSSTransition
        timeout={0}
        classNames=""
        in={this.props.PopUp.Open}
        unmountOnExit
      >
        <div className={`popup-overlay ${this.props.sm ? 'popup-overlay-sm' : ''}`}>
          <CSSTransition
            timeout={0}
            classNames=""
            in={this.state.ShouldShowForm}
            unmountOnExit
            onEntered={() => {
              if (this.props.PopUp.mode === 'input' && this.inputRef.current) {
                this.inputRef.current.focus();
              }
            }}
          >
            <div className={`popup-content ${this.props.sm ? 'popup-content-sm' : ''}`} ref={this.popUpContainer}>
              <div className={`popup-header ${this.props.sm ? 'popup-header-sm' : ''}`}>
                <h2 className="popup-title">{Title}</h2>
                {this.props.sm && (
                  <IconButton className="popup-close" onClick={this.props.closePopUp} aria-label="close">
                    <CloseIcon />
                  </IconButton>
                )}
              </div>
              <p className={`popup-message ${this.props.sm ? 'popup-message-sm' : ''}`}>{Message}</p>
              {mode === 'input' && (
                <div className="popup-input">
                  <input
                    type="text"
                    value={this.state.inputValue}
                    onChange={(e) => this.setState({ inputValue: e.target.value })}
                    ref={this.inputRef}
                  />
                </div>
              )}
              <div className={`popup-actions ${this.props.sm ? 'popup-actions-sm' : ''}`}>
                {(mode === 'Action' || mode === 'input') && (
                  <button className="popup-button" onClick={this.handleAction}>
                    {ActionMessage || 'Confirm'}
                  </button>
                )}
                {mode === 'dialog' && (
                  <button className="popup-button" onClick={this.props.closePopUp}>
                    {ActionMessage || 'OK'}
                  </button>
                )}
              </div>
            </div>
          </CSSTransition>
        </div>
      </CSSTransition>
    );
  }
}

const mapStateToProps = (state) => ({
  PopUp: state.example.PopUp,
});

const mapDispatchToProps = (dispatch) => ({
  closePopUp: () => dispatch({ type: 'CLOSE_POPUP' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PopUp);