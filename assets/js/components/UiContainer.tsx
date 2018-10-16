import * as React from "react";
import { Provider } from "react-redux";
import {createStore} from "redux";
import {BoardsStateType} from "../helpers/TypesHelper";
import {getBackgroundImage, hasBackgroundImage} from "../service/BackgroundImageService";
import BoardsList from "./BoardsList";
import TopMenu from "./TopMenu";

interface UiContainerStateType {
    backgroundUpdated: boolean;
}

export const actionTypeSetState = "SET_STATE";
export const actionTypeSetBoard = "SET_BOARD";
export const actionTypeSetSelectedTicket = "SET_SELECTED_TICKET";
export const actionTypeResetBoard = "RESET_BOARD";
export const actionTypeUpdateBoard = "UPDATE_BOARD";

export default class UiContainer extends React.PureComponent<{}, UiContainerStateType> {

    private static boardState(state: BoardsStateType, action: any): BoardsStateType {
        if (action.type === actionTypeSetState) {
            return action.boardState;
        }

        if (action.type === actionTypeSetBoard) {
            state.boardId = action.boardId;
            state.title = action.title;

            return state;
        }

        if (action.type === actionTypeSetSelectedTicket) {
            state.selectedTicket = action.selectedTicket;

            return state;
        }

        if (action.type === actionTypeResetBoard) {
            return {
                boardId: -1,
                isUpdated: false,
                selectedTicket: {
                    column: -1,
                    ticket: -1,
                },
                title: "Trololo Boards",
            };
        }

        if (action.type === actionTypeUpdateBoard) {
            state.isUpdated = !state.isUpdated;

            return state;
        }
    }
    private backgroundHolder: React.RefObject<HTMLDivElement>;
    private boardsDataStore = createStore(UiContainer.boardState);
    private defaultBoardsState: BoardsStateType = {
        boardId: -1,
        isUpdated: false,
        selectedTicket: {
            column: -1,
            ticket: -1,
        },
        title: "Trololo Boards",
    };

    constructor(props: {}, state: UiContainerStateType) {
        super(props, state);
        this.boardsDataStore.dispatch({ type: actionTypeSetState, boardState: this.defaultBoardsState });
        this.state = {
            backgroundUpdated: false,
        };
        this.boardsDataStore.subscribe(() => {
            this.update();
        });

        this.backgroundHolder = React.createRef();
        this.update = this.update.bind(this);
        this.reloadBackground = this.reloadBackground.bind(this);
    }

    public componentDidMount() {
        this.reloadBackground();
    }

    public componentDidUpdate() {
        this.reloadBackground();
    }

    public render(): React.ReactNode {
        return(
            <Provider store={this.boardsDataStore}>
                <div className="page-container" ref={this.backgroundHolder}>
                    <div id="main-menu-holder">
                        <TopMenu updateAction={this.update} isUpdated={this.state.backgroundUpdated}/>
                    </div>
                    <div className="content" id="content">
                        <BoardsList isUpdated={this.state.backgroundUpdated}/>
                    </div>
                </div>
            </Provider>
        );
    }

    private update() {
        this.setState({backgroundUpdated: !this.state.backgroundUpdated});
    }

    private reloadBackground() {
        if (hasBackgroundImage()) {
            this.backgroundHolder.current.setAttribute("style", "background-image: url(" + getBackgroundImage() + ")");
        }
    }
}
