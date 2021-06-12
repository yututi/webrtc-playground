import React from "react"
import ReactDOM from 'react-dom';
import './styles/index.scss';
import App from './App';
import { Provider } from 'react-redux';
import { store } from "redux/store"
import { SocketProvider } from "hooks/socket"
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <SocketProvider>
          <App />
        </SocketProvider>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);