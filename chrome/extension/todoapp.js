import React from 'react';
import ReactDOM from 'react-dom';
import Root from '../../app/containers/Root';
import './todoapp.css';

chrome.storage.local.get('state', obj => {
  const { state } = obj;
  let initialState = JSON.parse('{}');

  const createStore = require('../../app/core/store/configureStore');
  ReactDOM.render(
    <Root store={createStore(initialState)} />,
    document.querySelector('#root')
  );
});
