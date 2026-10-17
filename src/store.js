// src/store.js
import { createStore, combineReducers } from 'redux';

// Initial state
const initialState = {
  exampleData: [],
  isMenuOpen: false, // Add initial state for menu open
  PopUp: {
    Open: false,
    Title: "",
    Message: "",
    mode: "dialog",
    ActionMessage: "",
    action: console.log()
  },
  activeStep: 0,
  ReadySet: [],

  Explorer: {
    mode: 'WorkFlow',
    
  }

};

// Example reducer
const exampleReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_DATA':
      return {
        ...state,
        exampleData: [...state.exampleData, action.payload],
      };
    case 'TOGGLE_MENU': // Add action type for toggling menu
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen, // Toggle the state
      };

    case 'UPDATE_PROGRESSBAR':
      return {
        ...state,
        activeStep: action.value
      };
    default:
      return state;
  }


};

// Combine reducers if you have multiple
const rootReducer = combineReducers({
  example: exampleReducer,
});

// Create the Redux store
const store = createStore(rootReducer);

export default store;
