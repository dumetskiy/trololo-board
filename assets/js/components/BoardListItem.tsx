import * as React from "react";
import * as ReactDOM from "react-dom";
import {getContentElement} from "../helpers/DomElementsHelper";
import {startBoardHistory} from "../helpers/HistoryHelper";
import {BoardType, SelectedTicketDataType} from "../helpers/TypesHelper";
import {getBoardById, isValidBoardName, removeBoardById, setNameForBoardById} from "../service/BoardDataService";
import Board from "./Board";

interface BoardListItemPropsType {
    boardId: number;
    updateAction: () => void;
}

interface BoardListItemStateType {
    isEditing: boolean;
}

export default class BoardListItem extends React.PureComponent<BoardListItemPropsType, BoardListItemStateType> {
    private boardNameInput: React.RefObject<HTMLInputElement>;

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
        const boardData: BoardType = getBoardById(this.props.boardId);

        if (this.state.isEditing) {
            return (
                <div className="list-item" >
                    <input
                        type="text"
                        ref={this.boardNameInput}
                        className="input-style"
                        defaultValue={boardData.title}
                    />
                    <button className="tool-button save" onClick={this.saveBoardEdit}>&nbsp;</button>
                </div>
            );
        }

        return (
            <div className="list-item" onClick={this.openBoard}>
                {boardData.title}
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
        const selectedTicket: SelectedTicketDataType = {
            column: -1,
            ticket: -1,
        };

        startBoardHistory(this.props.boardId, getBoardById(this.props.boardId));
        ReactDOM.render(
            <Board boardId={this.props.boardId} selectedTicket={selectedTicket}/>,
            getContentElement(),
        );
    }
}
