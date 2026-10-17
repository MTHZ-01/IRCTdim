import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RedSnakeImage from './Assets/RedSnake.png';

// Shared lock across all instances
let Lock = false;

export class FileOpen extends Component {
  constructor(props) {
    super(props);
    this.buttonRef = React.createRef();
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    console.log("FileOpen mounted with data:", this.props.Data);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.Data !== this.props.Data) {
      console.log("FileOpen data updated:", {
        previous: prevProps.Data,
        current: this.props.Data
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(event) {
    const { Data, index, ActiveIndex, ReadySet } = this.props;
    const isActive = index === ActiveIndex;

    if (event.ctrlKey && event.key === 'w') {
      event.preventDefault();
      if (isActive) {
        this.handleDelete(event);
      }
      return;
    }

    if (isActive && !Lock && event.ctrlKey && event.key === 'Tab') {
      Lock = true;
      event.preventDefault();

      const totalTabs = ReadySet.length;
      let newIndex;
      if (event.shiftKey) {
        newIndex = (ActiveIndex - 1 + totalTabs) % totalTabs;
      } else {
        newIndex = (ActiveIndex + 1) % totalTabs;
      }

      this.props.activeIndex(newIndex);
      this.props.activeStepUpdate(0);

      setTimeout(() => {
        const newData = ReadySet[newIndex];
        if (!newData) {
          console.warn('No data found for tab index:', newIndex);
          return;
        }
        
        console.log('Keyboard navigation restoring data for:', { 
          index: newIndex, 
          mode: newData.mode, 
          hasData: !!newData.data,
          isLegacy: !!newData.FirstPage
        });
        
        if (newData?.mode === 'VT') {
          this.props.VT_OPEN_FILE(newData.data);
          this.props.SET_NEW_VT_PATH(newData.path || '');
        } else if (newData?.mode === 'MeterCT') {
          // FIX: Ensure activeStepMETERCT is set to 0 for new/empty files
          const dataWithDefaultStep = {
            ...newData.data,
            activeStepMETERCT: newData.data?.activeStepMETERCT ?? 0,
          };
          this.props.METERCT_OPEN_FILE(dataWithDefaultStep);
          this.props.SET_NEW_METERCT_PATH(newData.path || '');
        } else if (newData?.mode === 'WorkSpace') {
          this.props.updateProjectState(newData.data);
        }
      }, 15);

      setTimeout(() => {
        Lock = false;
      }, 200);
    }
  }

  handleClick = () => {
    const { Data, index } = this.props;
    
    if (!Data) {
      console.warn('FileOpen handleClick called with no data');
      return;
    }
    
    console.log('FileOpen handleClick:', { index, mode: Data.mode, hasData: !!Data.data });
    
    this.props.activeIndex(index);
    this.props.activeStepUpdate(0);

    setTimeout(() => {
      if (Data?.mode === 'VT') {
        console.log('Restoring VT data:', Data.data);
        this.props.VT_OPEN_FILE(Data.data);
        this.props.SET_NEW_VT_PATH(Data.path || '');
      } else if (Data?.mode === 'MeterCT') {
        console.log('Restoring MeterCT data:', Data.data);
        // FIX: Ensure activeStepMETERCT is set to 0 for new/empty files
        const dataWithDefaultStep = {
          ...Data.data,
          activeStepMETERCT: Data.data?.activeStepMETERCT ?? 0,
        };
        this.props.METERCT_OPEN_FILE(dataWithDefaultStep);
        this.props.SET_NEW_METERCT_PATH(Data.path || '');
      } else if (Data?.mode === 'WorkSpace') {
        console.log('Restoring WorkSpace data:', Data.data);
        this.props.updateProjectState(Data.data);
      } else if (Data && Data.FirstPage) {
        console.log('Legacy format already handled by SET_ACTIVE_INDEX - no additional dispatch needed');
      }
    }, 10);
  };

  handleDelete = (e) => {
    e.stopPropagation();
    this.props.removeFromReadySet(this.props.index);
  };

  render() {
    const { Data, index, ActiveIndex } = this.props;
    if (!Data) return <div></div>;

    const isActive = index === ActiveIndex;
    let title = 'Untitled';

    if (Data.fileName) {
      title = Data.fileName || 'Untitled';
    } else if (Data.FirstPage) {
      title = Data.FirstPage.Project || 'IRCT Project';
    } else if (Data.mode && Data.data) {
      switch (Data.mode) {
        case 'WorkSpace':
          title = Data.data.FirstPage?.Project || 'WorkSpace';
          break;
        case 'MeterCT':
          title = Data.data.fileName || 'New Meter CT';
          break;
        case 'VT':
          title = Data.data.fileName || 'New VT';
          break;
        default:
          title = 'Unknown';
      }
    }

    return (
      <div className="fo-tabSeparator">
        <Button
          className={`fo-tabButton ${isActive ? 'active' : ''}`}
          onClick={Data ? this.handleClick : null}
          ref={this.buttonRef}
          tabIndex={0}
        >
          <img className="fo-tabIcon" src={RedSnakeImage} alt="" />
          {title}
          <button onClick={this.handleDelete} className="fo-closeTabButton">
            <CloseIcon className="fo-closeTabIcon" />
          </button>
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ActiveIndex: state.example.ActiveIndex,
  ReadySet: state.example.ReadySet,
  Lock: state.example.Lock,
});

const mapDispatchToProps = (dispatch) => ({
  VT_OPEN_FILE: (d) => dispatch({ type: 'VT_OPEN_FILE', data: d }),
  SET_NEW_VT_PATH: (data) => dispatch({ type: 'SET_NEW_VT_PATH', data }),
  METERCT_OPEN_FILE: (d) => dispatch({ type: 'METERCT_OPEN_FILE', data: d }),
  SET_NEW_METERCT_PATH: (path) =>
    dispatch({ type: 'SET_NEW_METERCT_PATH', data: path }),
  toggleMenu: () => dispatch({ type: 'TOGGLE_MENU' }),
  openPopUp: (title, Message) =>
    dispatch({ type: 'OPEN_POPUP', Title: title, Message }),
  updateProjectState: (p) =>
    dispatch({ type: 'UPDATE_ALL_PAGES', Project: p }),
  closePopUp: () => dispatch({ type: 'CLOSE_POPUP' }),
  reOpenMenu: (d) => dispatch({ type: 'REOPEN_MENU', newData: d }),
  addToReadySet: (data) => dispatch({ type: 'ADD_TO_READY_SET', data }),
  activeIndex: (index) =>
    dispatch({ type: 'SET_ACTIVE_INDEX', ActiveIndex: index }),
  removeFromReadySet: (index) =>
    dispatch({ type: 'REMOVE_FROM_READY_SET', index }),
  activeStepUpdate: (value) =>
    dispatch({ type: 'UPDATE_PROGRESSBAR', value }),
  SET_NAV_LOCK: (data) =>
    dispatch({ type: 'SET_NAV_LOCK', data }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FileOpen);