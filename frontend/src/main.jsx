import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';  // <-- import Provider
import './index.css';
import App from './App.jsx';
import { store } from './redux/store.js';         // <-- import Redux store

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>            {/* <-- wraps the App with Provider */}
      <App />
    </Provider>
  </StrictMode>,
);
