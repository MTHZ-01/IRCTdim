import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { Button } from '@mui/material'
import PdfComponent from './PdfComponent.jsx'


export class ValidateComponent extends Component {

    state = {
        ShouldShowForm: false,

    }

    componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);

        if (this.props.activeStep == 3) {

            setTimeout(() => {
                this.setState({ ShouldShowForm: true });
            }, 100); // 1000ms = 1s
        }

    }

    Next = () => {
        this.props.activeStepUpdate(this.props.activeStep + 1)

    }




    GetToInitializeProject = () => {
        this.props.activeStepUpdate(this.props.activeStep - 1)
    }


    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
      }
    
    
      handleKeyPress = (event) => {
        ("!!!")
        if (event.key === 'Escape') {
          event.preventDefault(); // Prevent the browser's default "Open File" action
          this.GetToInitializeProject();
        } else if (event.key === 'Enter') {
          this.props.generateFile()
        }
      };
    


    render() {
        return (// HERE ⭕
            <CSSTransition timeout={600} classNames="slide" in={this.state.ShouldShowForm} unmountOnExit>
            {/* <CSSTransition timeout={600} classNames="slide" in={true} unmountOnExit>  */}

                <div className='col-12 center FullScreenFix flex-column justify-content-start'>
                    <div className='d-flex W90-p justify-content-start align-items-center flex-column RelayConfCont '>

                        <h1 className='col-12 headingsForInitProject'>{`Validation`}</h1>

                        <div className=' PdfHolder'>
                            {/* <p>Validation</p> */}

                            <PdfComponent ></PdfComponent>
                        </div>


                        <div className='w-100'>
                            <div className='d-flex justify-content-between align-items-between flex-row col-12'>

                                <Button className='NXT_Btn' onClick={this.GetToInitializeProject}>Back</Button>                                <div className="RightBox d-flex justify-content-end">

                                </div>
                            </div>
                        </div>

                    </div>


                </div>
            </CSSTransition>
        )
    }
}

const mapStateToProps = (state) => ({
    isMenuOpen: state.example.isMenuOpen,
    activeStep: state.example.activeStep,
    data: state.example.Project,
    initializationFullScreen : state.example.initializationFullScreen
});


const mapDispatchToProps = (dispatch) => ({
    activeStepUpdate: (value) => dispatch({ type: 'UPDATE_PROGRESSBAR', value: value }),


});

export default connect(mapStateToProps, mapDispatchToProps)(ValidateComponent)