import * as React from 'react';
import {stepForward, stepBackward} from '../helpers/HistoryHelper';

export default class HistorySwitcher extends React.PureComponent {
    constructor(props: any, state: any) {
        super(props, state);

        this.doStepForward = this.doStepForward.bind(this);
        this.doStepBackward = this.doStepBackward.bind(this);
    }

    render() {
        return (
            <div className="menu-buttons-wrap">
                <button className="menu-button backward" onClick={this.doStepBackward}>&nbsp;</button>
                <button className="menu-button forward" onClick={this.doStepForward}>&nbsp;</button>
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
