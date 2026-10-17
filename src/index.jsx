// src/index.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; // Import Provider
import { createStore } from 'redux'; // Import createStore
import rootReducer from './reducers'; // Import your root reducer
import App from './App.jsx';

// Create the Redux store
const store = createStore(rootReducer);

const root = createRoot(document.body);
root.render(
  <Provider store={store}> {/* Wrap your App component with Provider */}
    <App />
  </Provider>
);
