// src/reducers.js
import { combineReducers } from 'redux';

// Example reducer
const initialState = {
  explorerWidth: 300, // Initial FileExplorer width
  previousExplorerWidth: null, // Add this

  isMenuOpen: false, // Initial state for the menu
  PopUp: {
    Open: false,
    Title: "",
    Message: "",
    mode: "dialog",
    ActionMessage: "",
    action: console.log()
  },
  activeStep: 0,
  PreviousProjectsData: null,

  Lock: false,
  ReadySet: [],
  ActiveIndex: null,
  Project: {
    FirstPage: null,
    SecondPage: null,
    ThirdPage: null,
    FourthPage: null,
  },

  Explorer: {
    mode: "WorkSpace",

  },

  initializationFullScreen: false,

  NewWorkSpace: false,

  CurrentWorkSpace: null,
  SelectedWorkSpacePath: null,
  workSpaceVitals: {
    fileTree: null,
    error: null,
    selectedDir: "",
    anchorEl: null,
  },



  NewMeterCt: false,
  pathForCurrentlyOpenMeterCT: "",
  MeterCTInfo: {
    activeStepMETERCT: 0,

    MeteringDevice:
    {
      ShouldShowForm: false,
      Manufacture: "",
      DeviceName: "",
      Irn_A_list: [1, 5],
      selectedIrn_A: 0,
      BurdenPhase_VA: 0,
      DeviceMaxCurrent: 0,
      MaxFaultCurrent: 0,
      standard: ''
    },
    CurrentTransformer: {
      ShouldShowForm: false,
      CTName: '',
      standard: '',
      CtClassList: ["0.1", "0.2", "1", "3", "5", "0.2S", "0.5S"],
      selectedCTClass: '',
      CTPrimary: 0,
      CTSecondry: 0,
      SecurityFactor: 0,
      RatedBurden: 0,
      CTResistance: 0,
      ExtendedBurdenRangeList: ['Yes', 'No'],
      SelectedExtendedBurdenRangeList: 'Yes'
    },
    Conductor: {
      ShouldShowForm: false,
      Length: 0,
      CrossSection: 0,
      Material_List: ["Al", "Cu"],
      Material: ''
    },

    AdditionalEquipment: [
      { name: '', ratedCurrent: '', ratedBurden: '' },
      { name: '', ratedCurrent: '', ratedBurden: '' },
      { name: '', ratedCurrent: '', ratedBurden: '' },
      { name: '', ratedCurrent: '', ratedBurden: '' },
      { name: '', ratedCurrent: '', ratedBurden: '' }
    ]
  },



  NewVT: false,
  pathForCurrentlyOpenVT: "",
  VT: {
    activeStepVT: 0,


    L: {
      ShouldShowForm: false,
      L1: {
        VTName: "Unset",
        Standard: "Unset",
        VTClassList: ["0.1", "0.2", "0.5", "1", "3", "3P", "6P", "0.2 + 3P", "0.5 + 3P"],
        SelectedVTClass: "Unset",
        VTPrimary: 0,
        VTSecondary: 0,
        RatedPower: 0,
        ValidVoltageDropList: [0.1, 0.2, 0.5, 2.5],
        SelectedValidVoltageDrop: 0,
      },
      L2: {
        L0: "Unused",
        VTName: "Unset",
        Standard: "Unset",
        VTClassList: ["0.1", "0.2", "0.5", "1", "3", "3P", "6P", "0.2 + 3P", "0.5 + 3P"],
        SelectedVTClass: "Unset",
        VTPrimary: 0,
        VTSecondary: 0,
        RatedPower: 0,
        ValidVoltageDropList: [0.1, 0.2, 0.5, 2.5],
        SelectedValidVoltageDrop: 0,
      }


    },

    O: {
      ShouldShowForm: false,
      ContidionList: ["Used", "Unused"],
      MaterialList: ["Cu", "Al"],
      O1: {
        SelectedCondition: "Unused", // 1-1
        MBCName: "Uuset", // 1-2
        Length: 0,// 1-3
        CrossSection: 0, // 1-4
        SelectedMaterial: "Cu", // 1-5
        ConnectedDevice: "Uuset", // 1-6
        TotalConnectedBurden: 0 // 1-7
      },
      O2: {
        SelectedCondition: "Unused", // 2-1
        MBCName: "Uuset", // 2-2
        Length: 0, // 2-3
        CrossSection: 0, // 2-4
        SelectedMaterial: "Cu", // 2-5
        ConnectedDevice: "Uuset", // 2-6
        TotalConnectedBurden: 0 // 2-7
      },
      O3: {
        SelectedCondition: "Unused", // 3-1
        MBCName: "Uuset", // 3-2
        Length: 0, // 3-3
        CrossSection: 0, // 3-4
        SelectedMaterial: "Cu", // 3-5
        ConnectedDevice: "Uuset", // 3-6
        TotalConnectedBurden: 0 // 3-7
      },
      O4: {
        SelectedCondition: "Unused", // 4-1
        MBCName: "Uuset", // 4-2
        Length: 0, // 4-3
        CrossSection: 0, // 4-4
        SelectedMaterial: "Cu", // 4-5
        ConnectedDevice: "Uuset", // 4-6
        TotalConnectedBurden: 0 // 4-7
      },

    },


    M: {
      ShouldShowForm: false,
      ContidionList: ["Used", "Unused"],
      MaterialList: ["Cu", "Al"],
      M1: {
        SelectedCondition: "Unused", // 1-1
        MBCName: "Uuset", // 1-2
        Length: 0,// 1-3
        CrossSection: 0, // 1-4
        SelectedMaterial: "Cu", // 1-5
        ConnectedDevice: "Uuset", // 1-6
        TotalConnectedBurden: 0 // 1-7
      },
      M2: {
        SelectedCondition: "Unused", // 2-1
        MBCName: "Uuset", // 2-2
        Length: 0, // 2-3
        CrossSection: 0, // 2-4
        SelectedMaterial: "Cu", // 2-5
        ConnectedDevice: "Uuset", // 2-6
        TotalConnectedBurden: 0 // 2-7
      },
      M3: {
        SelectedCondition: "Unused", // 3-1
        MBCName: "Uuset", // 3-2
        Length: 0, // 3-3
        CrossSection: 0, // 3-4
        SelectedMaterial: "Cu", // 3-5
        ConnectedDevice: "Uuset", // 3-6
        TotalConnectedBurden: 0 // 3-7
      },
      M4: {
        SelectedCondition: "Unused", // 4-1
        MBCName: "Uuset", // 4-2
        Length: 0, // 4-3
        CrossSection: 0, // 4-4
        SelectedMaterial: "Cu", // 4-5
        ConnectedDevice: "Uuset", // 4-6
        TotalConnectedBurden: 0 // 4-7
      },

    },
  },



  // The Final Report Genrator
  AllFileData: [],

  recentWorkSpaces: [],

  // Excel Assembly State
  masterExcel: {
    isGenerating: false,
    progress: 0,
    validationStatus: {
      hasIncomplete: false,
      incompleteFiles: [],
      completeFiles: []
    },
    lastGenerated: null,
    error: null
  }

};

const exampleReducer = (state = initialState, action) => {
  switch (action.type) {

    case 'UPDATE_EXPLORER_WIDTH':
      return {
        ...state,
        explorerWidth: action.width,
      };

    // Add action handlers:
    case 'SET_EXCEL_GENERATION_STATUS':
      return {
        ...state,
        masterExcel: {
          ...state.masterExcel,
          ...action.data
        }
      };

    case 'SET_RECENT_WORKSPACES':

      return {
        ...state,

        recentWorkSpaces: action.data

      }





    case 'SET_NAV_LOCK':

      return {
        ...state,

        Lock: action.data

      }

    case 'SET_NEW_VT_PATH':

      return {
        ...state,

        pathForCurrentlyOpenVT: action.data

      }
    case 'SET_NEW_METERCT_PATH':

      return {
        ...state,

        pathForCurrentlyOpenMeterCT: action.data

      }


    case 'SET_ALLFILEDATA':

      return {
        ...state,

        AllFileData: action.data

      }


    case 'VT_OPEN_FILE':
      if (action.data === '') {
        return {
          ...state,
          NewVT: true,
        };
      }
      return {
        ...state,
        VT: action.data,
        NewVT: true,
      };


    case 'UPDATE_VTMParameter_PAGE':
      return {
        ...state,
        VT: {
          ...state.VT,
          M: action.data,
        }

      }


    case 'UPDATE_VTOParameter_PAGE':
      return {
        ...state,
        VT: {
          ...state.VT,
          O: action.data,
        }

      }


    case 'UPDATE_VTDevice_PAGE':

      console.log("activeStepUpdate activeStepUpdate activeStepUpdate", action.data)
      return {
        ...state,
        VT: {
          ...state.VT,
          L: action.data,
        }

      }


    case 'UPDATE_PROGRESSBAR_VT':

      console.log("activeStepUpdate activeStepUpdate activeStepUpdate", action.value)
      return {
        ...state,
        VT: {
          ...state.VT,
          activeStepVT: action.value,
        }

      }

    case 'SetNewVT':

      return {
        ...state,
        NewVT: action.data
      }



    case 'SET_WORKSPACEVITALS':


      return {
        ...state,

        workSpaceVitals: action.data

      }

    case 'METERCT_OPEN_FILE':
      // Check if the data is empty (either empty string or empty object)
      const isEmpty = action.data === '' || (typeof action.data === 'object' && Object.keys(action.data).length === 0);

      if (isEmpty) {
        // For a new/empty IRM file, reset MeterCTInfo to default with activeStep = 0
        return {
          ...state,
          MeterCTInfo: {
            activeStepMETERCT: 0,
            // Keep any other default fields you might have, but at minimum ensure activeStep is set
          },
          NewMeterCt: true,
        };
      }

      // For an existing IRM file with content, merge the data and ensure activeStep is defined
      return {
        ...state,
        MeterCTInfo: {
          ...state.MeterCTInfo,
          ...action.data,
          activeStepMETERCT: action.data?.activeStepMETERCT ?? 0,
        },
        NewMeterCt: true,
      };
    case 'UPDATE_PROGRESSBAR_METER_CT':

      console.log("activeStepUpdate activeStepUpdate activeStepUpdate", action.value)
      return {
        ...state,
        MeterCTInfo: {
          ...state.MeterCTInfo,
          activeStepMETERCT: action.value,
        }

      }

    case 'UPDATE_SySINFO_PAGE':

      console.log("activeStepUpdate activeStepUpdate activeStepUpdate", action.data)
      return {
        ...state,
        MeterCTInfo: {
          ...state.MeterCTInfo,
          Conductor: action.data,
        }

      }
    case 'UPDATE_MeteringDevice_PAGE':

      console.log("activeStepUpdate activeStepUpdate activeStepUpdate", action.data)
      return {
        ...state,
        MeterCTInfo: {
          ...state.MeterCTInfo,
          MeteringDevice: action.data,
        }

      }

    case 'UPDATE_CTConfig_PAGE':

      console.log("activeStepUpdate activeStepUpdate activeStepUpdate", action.data)
      return {
        ...state,
        MeterCTInfo: {
          ...state.MeterCTInfo,
          CurrentTransformer: action.data,
        }

      }

    case 'UPDATE_AE_PAGE':
      return {
        ...state,
        MeterCTInfo: {
          ...state.MeterCTInfo,   // Keep the other pages
          AdditionalEquipment: action.data,  // Update only SecondPage
        },
      };


    case 'UPDATE_METERCT_PAGE':
      return {
        ...state,
        MeterCTInfo: {
          ...state.MeterCTInfo,   // Keep the other pages
          MeteringDevice: action.data,  // Update only SecondPage
        },
      };

    case 'UPDATE_CurrentTransformer_PAGE':
      return {
        ...state,
        MeterCTInfo: {
          ...state.MeterCTInfo,   // Keep the other pages
          CurrentTransformer: action.data,  // Update only SecondPage
        },
      };

    case 'UPDATE_AdditionalEquipment_PAGE':
      return {
        ...state,
        MeterCTInfo: {
          ...state.MeterCTInfo,   // Keep the other pages
          AdditionalEquipment: action.data,  // Update only SecondPage
        },
      };


    case 'SetNewMeterCt':

      return {
        ...state,
        NewMeterCt: action.data
      }

    case 'SetMeterCTInfo':

      return {
        ...state,
        MeterCTInfo: action.data
      }

    case 'SetinitializationFullScreen':

      return {
        ...state,
        initializationFullScreen: action.data
      }

    case 'SetSelectedWorkSpacePath':

      return {
        ...state,
        SelectedWorkSpacePath: action.data
      }


    case 'SetCurrentWorkSpace':

      return {
        ...state,
        CurrentWorkSpace: action.data
      }




    case 'setExplorerMode':
      return {
        ...state,
        Explorer: {
          ...state.Explorer,
          mode: action.mode
        }
      }

    case 'setNewWorkSpace':
      return {
        ...state,
        NewWorkSpace: action.value
      }


    case 'TOGGLE_MENU':

      return {
        ...state,
        ActiveIndex: -1, // Toggle the menu state

      };

    case 'SET_ACTIVE_INDEX':
      const selectedItem = state.ReadySet[action.ActiveIndex];
      let newProject = state.Project;

      if (selectedItem) {
        // Handle legacy format (direct project structure)
        if (selectedItem.FirstPage !== undefined) {
          newProject = selectedItem;
        }
        // Handle new mode-based format - extract project from data
        else if (selectedItem.mode === 'WorkSpace' && selectedItem.data) {
          newProject = selectedItem.data;
        }
        // For VT and MeterCT modes, keep current Project state since they use separate state trees
      }

      return {
        ...state,
        ActiveIndex: action.ActiveIndex,
        Project: newProject,
      };

    case 'UPDATE_SPECIFIC_PROJECT_IN_READY':
      const index = action.index;

      return {
        ...state,
        ReadySet: state.ReadySet.map((item, i) =>
          i === index ? { ...item, ...action.data } : item
        ),
        ActiveIndex: 0, // Update ActiveIndex to reflect the modified item's position
      };


    case 'SETUP_NEW_PROJECT':

      return {
        ...state,
        ReadySet: [action.data, ...(state.ReadySet || [])],
        ActiveIndex: 0, // Toggle the menu state

      };

    case 'REMOVE_FROM_READY_SET':
      if (action.index < 0 || action.index >= state.ReadySet.length) return state; // Prevent invalid indices

      const newReadySet = state.ReadySet.filter((_, i) => i !== action.index);

      return {
        ...state,
        ReadySet: newReadySet,
        ActiveIndex: newReadySet.length > 0
          ? Math.min(state.ActiveIndex, newReadySet.length - 1) // Adjust ActiveIndex to stay in bounds
          : 0 // Reset to 0 if list is empty
      };

    // Adding to ReadySet:
    case 'ADD_NEW_WORKSPACE': {
      const newWorkspaceData = {
        mode: 'WorkSpace',
        data: action.data
      };

      const existingIndex = state.ReadySet.findIndex(
        item => item.mode === 'WorkSpace' && JSON.stringify(item.data) === JSON.stringify(action.data)
      );

      return existingIndex !== -1
        ? { ...state, ActiveIndex: existingIndex }
        : {
          ...state,
          ReadySet: [...state.ReadySet, newWorkspaceData], // ✅ FIXED
          ActiveIndex: state.ReadySet.length
        };
    }

    case 'ADD_NEW_METER_CT': {
      // Ensure the data has activeStepMETERCT set to 0 if missing
      const dataWithDefaultStep = {
        ...action.data,
        activeStepMETERCT: action.data?.activeStepMETERCT ?? 0,
      };

      const newMeterCTData = {
        mode: 'MeterCT',
        data: dataWithDefaultStep,  // Use the data with default step
        path: action.path || null
      };

      const normalizedPath = action.data.Path ? action.data.Path.replace(/\\/g, '/').toLowerCase() : '';
      const normalizedFileName = action.data.fileName ? action.data.fileName.toLowerCase() : '';

      const existingIndex = state.ReadySet.findIndex(
        item => {
          if (item.mode !== 'MeterCT') return false;
          if (!item.data) return false;

          const itemPath = item.data.Path ? item.data.Path.replace(/\\/g, '/').toLowerCase() : '';
          const itemFileName = item.data.fileName ? item.data.fileName.toLowerCase() : '';

          // Check if it's the same file by path or fileName
          return (normalizedPath && itemPath === normalizedPath) ||
            (normalizedFileName && itemFileName === normalizedFileName && normalizedFileName.endsWith('.irm'));
        }
      );

      // Also ensure MeterCTInfo in state gets the same default step
      const updatedMeterCTInfo = {
        ...state.MeterCTInfo,
        ...dataWithDefaultStep,
        activeStepMETERCT: dataWithDefaultStep.activeStepMETERCT,
      };

      return existingIndex !== -1
        ? {
          ...state,
          ActiveIndex: existingIndex,
          MeterCTInfo: updatedMeterCTInfo,
          NewMeterCt: true,
        }
        : {
          ...state,
          ReadySet: [...state.ReadySet, newMeterCTData],
          ActiveIndex: state.ReadySet.length,
          MeterCTInfo: updatedMeterCTInfo,
          NewMeterCt: true,
        };
    }

    case 'ADD_NEW_VT': {
      const newVTData = {
        mode: 'VT',
        data: action.data,
        path: action.path || null
      };

      const normalizedPath = action.data.Path ? action.data.Path.replace(/\\/g, '/').toLowerCase() : '';
      const normalizedFileName = action.data.fileName ? action.data.fileName.toLowerCase() : '';

      const existingIndex = state.ReadySet.findIndex(
        item => {
          if (item.mode !== 'VT') return false;
          if (!item.data) return false;

          const itemPath = item.data.Path ? item.data.Path.replace(/\\/g, '/').toLowerCase() : '';
          const itemFileName = item.data.fileName ? item.data.fileName.toLowerCase() : '';

          // Check if it's the same file by path or fileName
          return (normalizedPath && itemPath === normalizedPath) ||
            (normalizedFileName && itemFileName === normalizedFileName && normalizedFileName.endsWith('.irvt'));
        }
      );

      return existingIndex !== -1
        ? { ...state, ActiveIndex: existingIndex }
        : {
          ...state,
          ReadySet: [...state.ReadySet, newVTData],
          ActiveIndex: state.ReadySet.length
        };
    }


    case 'ADD_TO_READY_SET':
      const normalizedPath = action.data.Path ? action.data.Path.replace(/\\/g, '/').toLowerCase() : '';
      const normalizedFileName = action.data.fileName ? action.data.fileName.toLowerCase() : '';

      const existingIndex = state.ReadySet.findIndex(
        item => {
          if (!item.Path && !item.fileName) return false;
          const itemPath = item.Path ? item.Path.replace(/\\/g, '/').toLowerCase() : '';
          const itemFileName = item.fileName ? item.fileName.toLowerCase() : '';

          // Check if it's the same file by path or fileName
          return (normalizedPath && itemPath === normalizedPath) ||
            (normalizedFileName && itemFileName === normalizedFileName && normalizedFileName.endsWith('.irct'));
        }
      );

      return existingIndex !== -1
        ? {
          ...state,
          Project: action.data,
          ActiveIndex: existingIndex
        }
        : {
          ...state,
          ReadySet: [...(state.ReadySet || []), action.data],
          Project: action.data,
          ActiveIndex: state.ReadySet.length
        };


    case 'REOPEN_MENU':
      const eI = state.ReadySet.findIndex(
        item => JSON.stringify(item) === JSON.stringify(action.newData)
      );

      return eI !== -1
        ? {
          ...state,
          ActiveIndex: eI,
          isMenuOpen: true, // Toggle the menu state
          Project: action.newData
        }
        : {
          ...state,
          ReadySet: [...(state.ReadySet || []), action.newData],
          ActiveIndex: state.ReadySet.length,
          isMenuOpen: true, // Toggle the menu state
          Project: action.newData

        };


    // case 'REOPEN_MENU':
    //   return {
    //     ...state,
    //     isMenuOpen: true, // Toggle the menu state
    //     Project: action.newData

    //   };

    case 'OPEN_POPUP':

      console.log(action.action)
      console.log(action.mode)
      console.log(action.ActionMessage)
      return {
        ...state,
        PopUp: {
          Open: true,
          Title: action.Title,
          Message: action.Message,
          mode: action.mode,
          ActionMessage: action.ActionMessage,
          action: action.action
        },
      };

    case 'UPDATE_PROGRESSBAR':

      // console.log("activeStepUpdate activeStepUpdate activeStepUpdate", action.value)
      return {
        ...state,
        activeStep: action.value,

      };


    case 'CLOSE_POPUP':
      return {
        ...state,
        PopUp: {
          Open: false,
          Title: "",
          Message: "",
          mode: "dialog",
          ActionMessage: "",
          action: console.log()
        },
      };

    case 'CLEAR_ALL_PAGES':
      return {
        ...state,
        Project: {
          FirstPage: null,
          SecondPage: null,
          ThirdPage: null,
          FourthPage: null,
        }
      };

    case 'UPDATE_FIRST_PAGE':
      return {
        ...state,
        Project: {
          ...state.Project,   // Keep the other pages (SecondPage, ThirdPage, FourthPage)
          FirstPage: action.data,  // Update only FirstPage
        },
      };

    case 'UPDATE_SECOND_PAGE':
      return {
        ...state,
        Project: {
          ...state.Project,   // Keep the other pages
          SecondPage: action.data,  // Update only SecondPage
        },
      };

    case 'UPDATE_THIRD_PAGE':
      return {
        ...state,
        Project: {
          ...state.Project,   // Keep the other pages
          ThirdPage: action.data,  // Update only ThirdPage
        },
      };

    case 'UPDATE_FOURTH_PAGE':
      console.log("Hey !! Hey !! Hey !! Hey !! Hey !! Hey !! Hey !!")
      return {
        ...state,
        Project: {
          ...state.Project,   // Keep the other pages
          FourthPage: action.data,  // Update only FourthPage
        },
      };

    case 'UPDATE_ALL_PAGES':
      console.log("called!")

      return {
        ...state,
        Project: action.Project
      };




    case 'UPDATE_PREVIOUS_PROJECT_DATA':

      console.log("I'm called! ", action.PData)

      return {
        ...state,
        PreviousProjectsData: action.PData // A list of Project Names
      };


    default:
      return state;
  }
};

// Combine all reducers (if you have multiple)
const rootReducer = combineReducers({
  example: exampleReducer, // Add your exampleReducer here
});

export default rootReducer;


