import * as React from "react";
import {connect} from "react-redux";
import {startBoardHistory} from "../helpers/HistoryHelper";
import {BoardsStateType, BoardType} from "../helpers/TypesHelper";
import {getBoardById, isValidBoardName, removeBoardById, setNameForBoardById} from "../service/BoardDataService";
import {actionTypeSetBoard} from "./UiContainer";

interface BoardListItemPropsType {
    boardId: number;
    updateAction: () => void;
    onSelectBoard: (boardId: number, title: string) => void;
    boardsState: BoardsStateType;
}

interface BoardListItemStateType {
    isEditing: boolean;
}

class BoardListItem extends React.PureComponent<BoardListItemPropsType, BoardListItemStateType> {
    private boardNameInput: React.RefObject<HTMLInputElement>;
    private boardData: BoardType;

    constructor(props: BoardListItemPropsType, state: BoardListItemStateType) {
        super(props, state);

        this.state = {
            isEditing: false,
        };
        this.boardNameInput = React.createRef();
        this.removeBoard = this.removeBoard.bind(this);
        this.startBoardEdit = this.startBoardEdit.bind(this);
        this.saveBoardEdit = this.saveBoardEdit.bind(this);
        this.openBoard = this.openBoard.bind(this);
    }

    public render(): React.ReactNode {
        this.boardData = getBoardById(this.props.boardId);

        if (this.state.isEditing) {
            return (
                <div className="list-item" >
                    <input
                        type="text"
                        ref={this.boardNameInput}
                        className="input-style"
                        defaultValue={this.boardData.title}
                    />
                    <button className="tool-button save" onClick={this.saveBoardEdit}>&nbsp;</button>
                </div>
            );
        }

        return (
            <div className="list-item" onClick={this.openBoard}>
                {this.boardData.title}
                <button className="tool-button remove" onClick={this.removeBoard}>&nbsp;</button>
                <button className="tool-button edit" onClick={this.startBoardEdit}>&nbsp;</button>
            </div>
        );
    }

    private removeBoard(e: React.MouseEvent) {
        e.stopPropagation();
        removeBoardById(this.props.boardId);
        this.props.updateAction();
    }

    private startBoardEdit(e: React.MouseEvent) {
        e.stopPropagation();
        this.setState({isEditing: true});
    }

    private saveBoardEdit(e: React.MouseEvent) {
        e.stopPropagation();

        const newBoardName: string = this.boardNameInput.current.value;

        if (newBoardName === this.boardNameInput.current.defaultValue || isValidBoardName(newBoardName)) {
            setNameForBoardById(this.props.boardId, newBoardName);
            this.setState({isEditing: false});
        }
    }

    private openBoard() {
        startBoardHistory(this.props.boardId, getBoardById(this.props.boardId));
        this.props.onSelectBoard(this.props.boardId, this.boardData.title);
    }
}

export default connect(
    (state) => ({
        boardsState: state,
    }),
    (dispatch) => ({
        onSelectBoard: (boardId: number, title: string) => {
            dispatch(
                {
                    boardId,
                    title,
                    type: actionTypeSetBoard,
                });
        },
    }),
)(BoardListItem);
