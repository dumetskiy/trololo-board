import * as React from "react";
import {stepBackward, stepForward} from "../helpers/HistoryHelper";

export default class HistorySwitcher extends React.PureComponent {

    private static doStepForward() {
        stepForward();
    }

    private static doStepBackward() {
        stepBackward();
    }
    constructor(props: {}, state: {}) {
        super(props, state);
    }

    public render() {
        return (
            <div className="menu-buttons-wrap">
                <button className="menu-button backward" onClick={HistorySwitcher.doStepBackward}>&nbsp;</button>
                <button className="menu-button forward" onClick={HistorySwitcher.doStepForward}>&nbsp;</button>
            </div>
        );
    }
}
