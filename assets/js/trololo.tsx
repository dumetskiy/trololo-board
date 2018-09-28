import * as React from 'react';
import * as ReactDOM from 'react-dom';
import BoardsList from './components/BoardsList';
import TopMenu from './components/TopMenu';

export function trololo() {
    ReactDOM.render(<BoardsList/>, document.getElementById("content"));
    ReactDOM.render(<TopMenu />, document.getElementById("main-menu-holder"));
}