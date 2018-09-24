import React from 'react';
import ReactDOM from 'react-dom';
import BoardsList from './components/BoardsList';
import {get} from './helpers/LocalStorageHelper';

export function drawTrololo() {
    ReactDOM.render(<BoardsList/>, document.getElementById("content"));
}