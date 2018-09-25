import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {getBoardById, removeBoardById, isValidBoardName, setNameForBoardById} from '../helpers/LocalStorageHelper';
import Board from './Board';

export default class BoardListItem extends Component {
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

    render() {
        var boardData = getBoardById(this.props.boardid);

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

    removeBoard(e) {
        e.stopPropagation();
        removeBoardById(this.props.boardid);
        this.props.updateAction();
    }

    startBoardEdit(e) {
        e.stopPropagation();
        this.setState({
            isEditing: true
        });
    }

    saveBoardEdit(e) {
        e.stopPropagation();

        var newBoardName = this.boardNameInput.current.value;

        if (newBoardName === this.boardNameInput.current.defaultValue || isValidBoardName(newBoardName)) {
            setNameForBoardById(this.props.boardid, newBoardName);
            this.setState({
                isEditing: false
            });
        }
    }

    openBoard() {
        ReactDOM.render(<Board boardid={this.props.boardid}/>, document.getElementById("content"));
    }
}