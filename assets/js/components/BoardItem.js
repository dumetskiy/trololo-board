import React, {Component} from 'react'
import {getBoardById, removeBoardById, isValidBoardName, setNameForBoardById} from '../helpers/LocalStorageHelper';

export default class BoardItem extends Component {
    constructor() {
        super();

        this.state = {
            isEditing: false,
        };
        this.removeBoard = this.removeBoard.bind(this);
        this.startBoardEdit = this.startBoardEdit.bind(this);
        this.saveBoardEdit = this.saveBoardEdit.bind(this);
    }
    render() {
        var boardData = getBoardById(this.props.boardid);

        this.boardNameInput = React.createRef();

        if (this.state.isEditing) {
            return (<div className="list-item" data-boardid={this.props.boardid} >
                    <input type="text" ref={this.boardNameInput} className="input-style" defaultValue={boardData.title}/>
                    <button className="tool-button save" onClick={this.saveBoardEdit}>&nbsp;</button>
                </div>
            );
        } else {
            return (<div className="list-item" data-boardid={this.props.boardid} >
                    {boardData.title}
                    <button className="tool-button remove" onClick={this.removeBoard}>&nbsp;</button>
                    <button className="tool-button edit" onClick={this.startBoardEdit}>&nbsp;</button>
                </div>
            );
        }
    }

    removeBoard(e) {
        removeBoardById(this.props.boardid);
        this.props.updateAction();
    }

    startBoardEdit() {
        this.setState({
            isEditing: true
        });
    }

    saveBoardEdit() {
        var newBoardName = this.boardNameInput.current.value;

        if (isValidBoardName(newBoardName) || newBoardName === this.boardNameInput.current.defaultValue) {
            setNameForBoardById(this.props.boardid, newBoardName);
            this.setState({
                isEditing: false
            });
        } else {
            alert('Invalid board name!');
        }
    }
}