import * as React from 'react';
import {stepForward, stepBackward} from '../helpers/HistoryHelper';

export default class HistorySwitcher extends React.PureComponent {
    constructor(props: {}, state: {}) {
        super(props, state);
    }

    render() {
        return (
            <div className="menu-buttons-wrap">
                <button className="menu-button backward" onClick={HistorySwitcher.doStepBackward}>&nbsp;</button>
                <button className="menu-button forward" onClick={HistorySwitcher.doStepForward}>&nbsp;</button>
            </div>
        );
    }

    static doStepForward() {
        stepForward();
    }

    static doStepBackward() {
        stepBackward();
    }
}
