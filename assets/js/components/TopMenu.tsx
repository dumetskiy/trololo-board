import React, {Component} from 'react'
import ReactDOM from 'react-dom';
//import BoardsList from './BoardsList'
import {stepForward, stepBackward} from '../helpers/HistoryHelper';

export default class TopMenu extends Component {
    constructor() {
        super();
        this.state = {
            settingsOpened: false,
        };
        this.toggleSettings = this.toggleSettings.bind(this);
        this.goHome = this.goHome.bind(this);
        this.doStepForward = this.doStepForward.bind(this);
        this.doStepBackward = this.doStepBackward.bind(this);
    }

    render() {
        if (this.state.settingsOpened) {
            return (
                <div className="modal-background">
                    <button className="modal-close" onClick={this.toggleSettings}>&nbsp;</button>
                    <div className="modal"></div>
                </div>
            );
        } else {
            return (
                <div className="main-menu">
                    <div className="menu-section side-section" id="history-block">
                        <div className="menu-buttons-wrap">
                            <button className="menu-button backward" onClick={this.doStepBackward}>&nbsp;</button>
                            <button className="menu-button forward" onClick={this.doStepForward}>&nbsp;</button>
                        </div>
                    </div>
                    <div className="menu-section">
                        <h1 className="heading" id="heading">Trololo Board</h1>
                    </div>
                    <div className="menu-section side-section" id="toolbar-block">
                        <div className="menu-buttons-wrap right">
                            <button className="menu-button settings" onClick={this.toggleSettings}>&nbsp;</button>
                            <button className="menu-button home" onClick={this.goHome}>&nbsp;</button>
                        </div>
                    </div>
                </div>
            );
        }
    }

    goHome() {
        //ReactDOM.render(<BoardsList/>, document.getElementById("content"));
    }

    toggleSettings() {
        this.setState({settingsOpened: !this.state.settingsOpened});
    }

    doStepForward() {
        stepForward();
    }

    doStepBackward() {
        stepBackward();
    }
}
