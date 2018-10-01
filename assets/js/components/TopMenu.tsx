import * as React from 'react';
import {RefObject} from 'react';
import * as ReactDOM from 'react-dom';
import BoardsList from './BoardsList';
import {stepForward, stepBackward} from '../helpers/HistoryHelper';
import {setBackgroundImage, hasBackgroundImage, getBackgroundImage} from '../helpers/LocalStorageHelper';

type TopMenuPropsType = {
    title: string;
    updateAction: Function;
}

type TopMenuStateType = {
    settingsOpened: boolean;
}

export default class TopMenu extends React.PureComponent<TopMenuPropsType> {
    private backgroundPreview: RefObject<HTMLImageElement>;
    private backgroundImageSelect: RefObject<HTMLInputElement>;
    state: TopMenuStateType;

    constructor(props: TopMenuPropsType, state: TopMenuStateType) {
        super(props, state);

        this.state = {
            settingsOpened: false,
        };

        this.backgroundPreview = React.createRef();
        this.backgroundImageSelect = React.createRef();
        this.toggleSettings = this.toggleSettings.bind(this);
        this.updatePreview = this.updatePreview.bind(this);
        this.updateBackgroundImage = this.updateBackgroundImage.bind(this);
        this.loadPreviewImage = this.loadPreviewImage.bind(this);
    }

    render(): React.ReactNode {
        if (this.state.settingsOpened) {
            return (
                <div className="modal-background">
                    <button className="modal-close" onClick={this.toggleSettings}>&nbsp;</button>
                    <div className="modal settings-modal">
                        <h3 className="header">Settings</h3>
                        <div className="background-preview-wrap">
                            <div className="background-preview-holder">
                                <img ref={this.backgroundPreview}
                                     className="background-preview" />
                            </div>
                        </div>
                        <input ref={this.backgroundImageSelect}
                               onChange={this.updatePreview}
                               className="flex-input-small background-selector"
                               type="file"
                               accept="image/*"/>
                        <button className="flex-input-small settings-submit"
                                onClick={this.updateBackgroundImage}>Save</button>
                    </div>
                </div>
            );
        }

        return (
            <div className="main-menu">
                <div className="menu-section side-section" id="history-block">
                    <div className="menu-buttons-wrap">
                        <button className="menu-button backward" onClick={TopMenu.doStepBackward}>&nbsp;</button>
                        <button className="menu-button forward" onClick={TopMenu.doStepForward}>&nbsp;</button>
                    </div>
                </div>
                <div className="menu-section">
                    <h1 className="heading" id="heading">{this.props.title}</h1>
                </div>
                <div className="menu-section side-section" id="toolbar-block">
                    <div className="menu-buttons-wrap right">
                        <button className="menu-button settings" onClick={this.toggleSettings}>&nbsp;</button>
                        <button className="menu-button home" onClick={TopMenu.goHome}>&nbsp;</button>
                    </div>
                </div>
            </div>
        );
    }

    loadPreviewImage() {
        if (this.state.settingsOpened && hasBackgroundImage()) {
            this.backgroundPreview.current.setAttribute('src', getBackgroundImage());
        }
    }

    toggleSettings() {
        this.setState({settingsOpened: !this.state.settingsOpened}, this.loadPreviewImage);
    }

    updatePreview() {
        let backgroundPreviewElement: HTMLImageElement = this.backgroundPreview.current,
            backgroundImageSelectElement: HTMLInputElement = this.backgroundImageSelect.current;

        if (backgroundImageSelectElement.files && backgroundImageSelectElement.files[0]) {
            let reader = new FileReader();

            reader.onload = function(e: any) {
                backgroundPreviewElement.setAttribute('src', e.target.result);
            };

            reader.readAsDataURL(backgroundImageSelectElement.files[0]);
        }
    }

    updateBackgroundImage() {
        if (setBackgroundImage(this.backgroundPreview.current)) {
            this.setState({settingsOpened: false});
            this.props.updateAction();
        }
    }

    static doStepForward() {
        stepForward();
    }

    static doStepBackward() {
        stepBackward();
    }

    static goHome() {
        ReactDOM.render(<BoardsList/>, document.getElementById("content"));
    }
}
