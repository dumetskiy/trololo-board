import * as React from 'react'
import * as ReactDOM from 'react-dom';
import {getBoardById, removeBoardById, isValidBoardName, setNameForBoardById} from '../helpers/LocalStorageHelper';
import {startBoardHistory} from '../helpers/HistoryHelper';
import Board from './Board';
import {BoardType} from '../helpers/TypesHelper';

export interface BoardListItemProps {
    boardId: number;
    updateAction: Function;
}

export default class BoardListItem extends React.PureComponent<BoardListItemProps> {
    constructor() {
        super();

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

    removeBoard(e: event) {
        e.stopPropagation();
        removeBoardById(this.props.boardId);
        this.props.updateAction();
    }

    startBoardEdit(e: event) {
        e.stopPropagation();
        this.setState({
            isEditing: true
        });
    }

    saveBoardEdit(e: event) {
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
        startBoardHistory(this.props.boardId, getBoardById(this.props.boardId));
        ReactDOM.render(<Board boardId={this.props.boardId}/>, document.getElementById("content"));
    }
}