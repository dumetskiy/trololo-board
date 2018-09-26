import React from 'react';
import ReactDOM from 'react-dom';
import BoardsList from './components/BoardsList';
import TopMenu from './components/TopMenu';

export function drawTrololo() {
    ReactDOM.render(<BoardsList/>, document.getElementById("content"));
    ReactDOM.render(<TopMenu />, document.getElementById("main-menu-holder"));
}