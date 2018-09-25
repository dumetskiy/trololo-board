import React, {Component} from 'react'
import {stepForward, stepBackward} from '../helpers/HistoryHelper';

export default class HistorySwitcher extends Component {
    constructor() {
        super();

        this.doStepForward = this.doStepForward.bind(this);
        this.doStepBackward = this.doStepBackward.bind(this);
    }

    render() {
        var stepBackwardTemplate = (<button className="menu-button backward" onClick={this.doStepBackward}>&nbsp;</button>),
            stepForwardTemplate = (<button className="menu-button forward" onClick={this.doStepForward}>&nbsp;</button>);

        return (
            <div className="menu-buttons-wrap">
                {stepBackwardTemplate}
                {stepForwardTemplate}
            </div>
        );
    }

    doStepForward() {
        stepForward();
    }

    doStepBackward() {
        stepBackward();
    }
}
