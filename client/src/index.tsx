import React from "react"
import ReactDOM from 'react-dom';
import './styles/index.scss';
import App from './App';
import { Provider } from 'react-redux';
import { store } from "redux/store"

const composeWrappers = (
  wrappers: React.FC[]
): React.FC => {
  return wrappers.reduce((Acc, Current): React.FunctionComponent => {
    return props => <Current><Acc {...props} /></Current>
  });
}


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);