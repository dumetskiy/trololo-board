import React, {Component} from 'react'
import {stepForward, stepBackward, hasStepForward, hasStepBackward} from '../helpers/HistoryHelper';

export default class HistorySwitcher extends Component {
    constructor() {
        super();

        this.state = {
            hasStepForward: false,
            hasStepBackward: false,
        };

        this.doStepForward = this.doStepForward.bind(this);
        this.doStepBackward = this.doStepBackward.bind(this);
    }

    render() {
        var stepBackwardTemplate = '',
            stepForwardTemplate = '';

        if (this.state.hasStepBackward || true) {
            stepBackwardTemplate = (<button className="menu-button backward" onClick={this.doStepBackward}>&nbsp;</button>);
        }

        if (this.state.hasStepForward || true) {
            stepForwardTemplate = (<button className="menu-button forward" onClick={this.doStepForward}>&nbsp;</button>);
        }

        return (
            <div className="menu-buttons-wrap">
                {stepBackwardTemplate}
                {stepForwardTemplate}
            </div>
        );
    }

    doStepForward() {
        stepForward();
        this.setState({
            hasStepForward: hasStepForward(),
            hasStepBackward: hasStepBackward(),
        });
    }

    doStepBackward() {
        stepBackward();
        this.setState({
            hasStepForward: hasStepForward(),
            hasStepBackward: hasStepBackward(),
        });
    }
}
