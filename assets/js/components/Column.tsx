import React, {Component} from 'react'
import Board from "./Board";
import Ticket, {getTicketColorSelect} from "./Ticket";
import {getColumnForBoard, getColorsData} from '../helpers/LocalStorageHelper';

import {
    removeBoardColumn,
    isValidColumnName,
    updateBoardColumnName,
    addTicketToBoardColumn,
    isValidTicketTitle,
    isValidTicketDescription
} from '../helpers/LocalStorageHelper';

export default class Column extends Component {
    constructor() {
        super();

        this.state = {
            colEditing: false,
            colAddTicket: false,
            ticketUpdated: false,
        };
        this.removeColumn = this.removeColumn.bind(this);
        this.toggleColumnTitleEdit = this.toggleColumnTitleEdit.bind(this);
        this.saveColumnTitle = this.saveColumnTitle.bind(this);
        this.toggleColumnAddTicket = this.toggleColumnAddTicket.bind(this);
        this.cancelAddTicket = this.cancelAddTicket.bind(this);
        this.createNewTicket = this.createNewTicket.bind(this);
        this.update = this.update.bind(this);
        this.isSelectedColumn = this.isSelectedColumn.bind(this);
        this.getTicketColorSelect = this.getTicketColorSelect.bind(this);
    }

    getTicketColorSelect(ticket) {
        var ticketColor = ticket ? ticket.color : 'none',
            selectOptions = [];

        getColorsData().forEach(function(color, index, arr) {
            selectOptions.push(<option key={index} value={color.handle} >{color.title}</option>);
        });

        return (
            <select ref={this.newTicketColorSelect} defaultValue={ticketColor} className="flex-input-small">
            {selectOptions}
            </select>
        );
    }

    render() {
        this.columnNameInput = React.createRef();
        this.newTicketTitleInput = React.createRef();
        this.newTicketDescriptionInput = React.createRef();
        this.newTicketColorSelect = React.createRef();

        var columnId = this.props.columnid,
            boardId = this.props.boardid,
            selectedTicket = this.props.selectedTicket,
            columnData = getColumnForBoard(boardId, columnId),
            ticketsTemplate = '',
            extraColumnElement = '',
            colHeader = '',
            updateAction = this.update;

        if (columnData.tickets.length) {
            ticketsTemplate = columnData.tickets.map(function(ticket, index) {
                return (<Ticket key={index}
                                boardId={boardId}
                                columnId={columnId}
                                ticketId={index}
                                updateAction={updateAction}
                                selectedTicket={selectedTicket}/>);
            });
        }

        if (this.state.colEditing) {
            colHeader = (
                <div className="col-header">
                    <input type="text"
                           className="flex-input-small flex-width-70"
                           defaultValue={columnData.title}
                           ref={this.columnNameInput}
                           placeholder="New column name..."/>
                    <button className="flex-button-small add-button" onClick={this.saveColumnTitle}>Save</button>
                </div>
            );
        }

        if (this.state.colAddTicket) {
            colHeader = (
                <div className="col-header">
                    {columnData.title}
                    <div className="column-tools">
                        <button className="tool-item remove" onClick={this.cancelAddTicket}>&nbsp;</button>
                    </div>
                </div>
            );

            extraColumnElement = (
                <div className="col-item special-item">
                    <input type="text"
                           ref={this.newTicketTitleInput}
                           className="flex-input-small flex-full-row"
                           placeholder="Ticket title..."/>
                   {this.getTicketColorSelect(null)}
                    <textarea
                        ref={this.newTicketDescriptionInput}
                        placeholder="Ticket description..."
                        className="flex-input-small flex-full-row"></textarea>
                    <button
                        onClick={this.createNewTicket}
                        className="flex-button-small flex-full-row">Create ticket</button>
                </div>
            )
        }

        if (!this.state.colAddTicket && !this.state.colEditing) {
            colHeader = (
                <div className="col-header">
                    {columnData.title}
                    <div className="column-tools">
                        <button className="tool-item add" onClick={this.toggleColumnAddTicket}>&nbsp;</button>
                        <button className="tool-item edit" onClick={this.toggleColumnTitleEdit}>&nbsp;</button>
                        <button className="tool-item delete" onClick={this.removeColumn}>&nbsp;</button>
                    </div>
                </div>
            );
        }

        return (
            <div className={this.isSelectedColumn() ? 'board-col current' : 'board-col'}>
                <div className="board-col-content">
                    {colHeader}
                    <div className="col-items-holder">
                        <div className="col-items-wrap">
                            {extraColumnElement}
                            {ticketsTemplate}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    isSelectedColumn() {
        var selectedTicket = this.props.selectedTicket;

        return selectedTicket && selectedTicket.column === this.props.columnid;
    }

    update() {
        this.setState({ticketUpdated: !this.state.ticketUpdated});
    }

    removeColumn() {
        removeBoardColumn(this.props.boardid, this.props.columnid);
        this.props.updateAction();
    }

    toggleColumnTitleEdit() {
        this.setState({colEditing: true, colAddTicket: false});
    }

    toggleColumnAddTicket() {
        this.setState({colEditing: false, colAddTicket: true});
    }

    cancelAddTicket() {
        this.setState({colEditing: false, colAddTicket: false});
    }

    saveColumnTitle() {
        var newColumnName = this.columnNameInput.current.value,
            originalColumnName = this.columnNameInput.current.defaultValue;

        if (newColumnName === originalColumnName || isValidColumnName(this.props.boardid, newColumnName)) {
            updateBoardColumnName(this.props.boardid, this.props.columnid, newColumnName);
            this.setState({colEditing: false, colAddTicket: false});
            this.props.updateAction();
        }
    }

    createNewTicket() {
        if (
            isValidTicketTitle(this.newTicketTitleInput.current.value) &&
            isValidTicketDescription(this.newTicketDescriptionInput.current.value)
        ) {
            addTicketToBoardColumn(
                this.props.boardid,
                this.props.columnid,
                this.newTicketTitleInput.current.value,
                this.newTicketDescriptionInput.current.value,
                this.newTicketColorSelect.current.value
            );
            this.setState({colEditing: false, colAddTicket: false});
            this.props.updateAction();
        }
    }
}
