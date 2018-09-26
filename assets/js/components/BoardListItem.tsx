import * as React from 'react'
import * as ReactDOM from 'react-dom';
import {getBoardById, removeBoardById, isValidBoardName, setNameForBoardById} from '../helpers/LocalStorageHelper';
import {startBoardHistory} from '../helpers/HistoryHelper';
import Board from './Board';
import {TicketType, ColumnType, BoardType, SelectedTicketDataType} from '../helpers/TypesHelper';
import {RefObject} from "react";

export interface BoardListItemProps {
    boardId: number;
    updateAction: Function;
}

export default class BoardListItem extends React.PureComponent<BoardListItemProps> {
    private boardNameInput: RefObject<HTMLInputElement>;
    state: any;

    constructor(props: any, state: any) {
        super(props, state);

        this.state = {
            isEditing: false,
        };
        this.removeBoard = this.removeBoard.bind(this);
        this.startBoardEdit = this.startBoardEdit.bind(this);
        this.saveBoardEdit = this.saveBoardEdit.bind(this);
        this.openBoard = this.openBoard.bind(this);
    }

    render(): React.ReactNode {
        let boardData: BoardType = getBoardById(this.props.boardId);

        this.boardNameInput = React.createRef();

        if (this.state.isEditing) {
            return (<div className="list-item" >
                    <input type="text" ref={this.boardNameInput} className="input-style" defaultValue={boardData.title}/>
                    <button className="tool-button save" onClick={this.saveBoardEdit}>&nbsp;</button>
                </div>
            );
        } else {
            return (<div className="list-item" onClick={this.openBoard}>
                    {boardData.title}
                    <button className="tool-button remove" onClick={this.removeBoard}>&nbsp;</button>
                    <button className="tool-button edit" onClick={this.startBoardEdit}>&nbsp;</button>
                </div>
            );
        }
    }

    removeBoard(e: React.MouseEvent) {
        e.stopPropagation();
        removeBoardById(this.props.boardId);
        this.props.updateAction();
    }

    startBoardEdit(e: React.MouseEvent) {
        e.stopPropagation();
        this.setState({
            isEditing: true
        });
    }

    saveBoardEdit(e: React.MouseEvent) {
        e.stopPropagation();

        let newBoardName: string = this.boardNameInput.current.value;

        if (newBoardName === this.boardNameInput.current.defaultValue || isValidBoardName(newBoardName)) {
            setNameForBoardById(this.props.boardId, newBoardName);
            this.setState({
                isEditing: false
            });
        }
    }

    openBoard() {
        let selectedTicket: SelectedTicketDataType = {
            column: -1,
            ticket: -1,
        }

        startBoardHistory(this.props.boardId, getBoardById(this.props.boardId));
        ReactDOM.render(<Board boardId={this.props.boardId} selectedTicket={selectedTicket}/>, document.getElementById("content"));
    }
}