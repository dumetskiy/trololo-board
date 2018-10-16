import * as React from "react";
import {connect} from "react-redux";
import {hasStepBackward, hasStepForward} from "../helpers/HistoryHelper";
import {BoardsStateType} from "../helpers/TypesHelper";
import {getBackgroundImage, hasBackgroundImage, setBackgroundImage} from "../service/BackgroundImageService";
import HistorySwitcher from "./HistorySwitcher";
import {actionTypeResetBoard} from "./UiContainer";

interface TopMenuPropsType {
    boardsState: BoardsStateType;
    updateAction: () => void;
    onGoHome: () => void;
}

interface TopMenuStateType {
    settingsOpened: boolean;
}

class TopMenu extends React.PureComponent<TopMenuPropsType, TopMenuStateType> {

    private backgroundPreview: React.RefObject<HTMLImageElement>;
    private backgroundImageSelect: React.RefObject<HTMLInputElement>;

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
        this.getSettingsModal = this.getSettingsModal.bind(this);
        this.getTopMenuTemplate = this.getTopMenuTemplate.bind(this);
        this.goHome = this.goHome.bind(this);
    }

    public render(): React.ReactNode {
        if (this.state.settingsOpened) {
            return this.getSettingsModal();
        }

        return this.getTopMenuTemplate();
    }

    private getSettingsModal(): JSX.Element {
        return (
            <div className="modal-background">
                <button className="modal-close" onClick={this.toggleSettings}>&nbsp;</button>
                <div className="modal settings-modal">
                    <h3 className="header">Settings</h3>
                    <div className="background-preview-wrap">
                        <div className="background-preview-holder">
                            <img
                                ref={this.backgroundPreview}
                                className="background-preview"
                            />
                        </div>
                    </div>
                    <input
                        ref={this.backgroundImageSelect}
                        onChange={this.updatePreview}
                        className="flex-input-small background-selector"
                        type="file"
                        accept="image/*"
                    />
                    <button
                        className="flex-input-small settings-submit"
                        onClick={this.updateBackgroundImage}
                    >
                        Save
                    </button>
                </div>
            </div>
        );
    }

    private goHome() {
        this.props.onGoHome();
    }

    private getTopMenuTemplate(): JSX.Element {
        return (
            <div className="main-menu">
                <div className="menu-section side-section" id="history-block">
                    <HistorySwitcher hasStepBackward={hasStepBackward()} hasStepForward={hasStepForward()} />
                </div>
                <div className="menu-section">
                    <h1 className="heading" id="heading">{this.props.boardsState.title}</h1>
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

    private loadPreviewImage() {
        if (this.state.settingsOpened && hasBackgroundImage()) {
            this.backgroundPreview.current.setAttribute("src", getBackgroundImage());
        }
    }

    private toggleSettings() {
        this.setState({settingsOpened: !this.state.settingsOpened}, this.loadPreviewImage);
    }

    private updatePreview() {
        const backgroundPreviewElement: HTMLImageElement = this.backgroundPreview.current,
            backgroundImageSelectElement: HTMLInputElement = this.backgroundImageSelect.current;

        if (backgroundImageSelectElement.files && backgroundImageSelectElement.files[0]) {
            const reader = new FileReader();

            reader.onload = (e: any) => {
                backgroundPreviewElement.setAttribute("src", e.target.result);
            };

            reader.readAsDataURL(backgroundImageSelectElement.files[0]);
        }
    }

    private updateBackgroundImage() {
        if (setBackgroundImage(this.backgroundPreview.current)) {
            this.setState({settingsOpened: false});
            this.props.updateAction();
        }
    }
}

export default connect(
    (state) => ({
        boardsState: state,
    }),
    (dispatch) => ({
        onGoHome: () => {
            dispatch(
                {
                    type: actionTypeResetBoard,
                });
        },
    }),
)(TopMenu);
